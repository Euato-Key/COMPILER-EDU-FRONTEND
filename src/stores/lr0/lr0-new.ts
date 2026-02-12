import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getLR0AnalyseAPI, LR0AnalyseInpStrAPI } from '@/api'
import type {
  LR0AnalysisResult,
  LR0ValidationItem,
  AnalysisStepInfo,
  ValidationResult,
  ProductionItem,
} from '@/types'
import { useCommonStore } from '../common'
import { usePersistence } from '@/composables/persistence'
import { useLR0AnimationStore } from '@/animation/store'
import { buildLR0Context } from './aiContextBuilder'
import type { AIAnswerContext } from '@/types/ai-context'

const maxHistoryRecords = 50

// ================= 类型定义 =================

/**
 * 错误记录项：用于 PDF 导出对比和 AI 分析
 */
export interface LR0ErrorLog {
  id: string
  step: 'step2' | 'step3' | 'step4' | 'step5'
  type: 'actionTable' | 'gotoTable' | 'dfaState' | 'gotoTransition' | 'analysisStep' | 'augmentedFormula'
  location: {
    row?: string | number    // 行索引或状态
    col?: string             // 列名
    stepIndex?: number       // 步骤索引 (step4)
    fieldKey?: string        // 字段标识
  }
  wrongValue: string         // 学生填错的内容
  correctValue: string       // 标准答案
  timestamp: string          // 记录时间
  hint?: string              // 错误原因/提示动画信息
  hintDetails?: {            // 步骤5提示详情（ACTION/GOTO表信息）
    state: string            // 当前状态
    symbol: string           // 输入符号
    action: string           // ACTION值
    actionCell: string       // ACTION表单元格位置
    actionType: 'shift' | 'reduce' | 'accept' | 'error'  // 动作类型
  }
}

/**
 * LR0 Store 用户正在操作的数据类型
 */
export interface LR0StoreData {
  productions: string[]
  inputString: string
  // 02页面：增广文法数据
  step2Data?: {
    userAugmentedFormulas: Array<{ id: string; text: string; status: 'normal' | 'correct' | 'error'; readonly: boolean }>
    validationSuccess: boolean
    timestamp: string
  }
  // 03页面：DFA状态数据
  step3Data?: {
    userDfaStates?: any[]
    userDotItems?: any[]
    userShowAnswer?: boolean
    timestamp: string
    // DFA构造状态
    dfaState?: {
      addNodeLimit: number
      addNodeRemainCnt: number
      forEachEpochAllNum: number
      checkRightItems: string[]
      checkRightGotos: string[]
      checkRightLocalNode: string[]
      checkRightLocalEdge: string[]
      nodeIdMapItemId: Record<string, string>
      edgeIdMapGotosId: Record<string, string>
      nextStepOpen: boolean[]
    }
  }
  // 04页面：Action/Goto表构建数据
  step4Data?: {
    userActionTable: Record<string, string>
    userGotoTable: Record<string, string>
    timestamp: string
  }
  // 05页面：输入串分析步骤数据
  step5Data?: {
    userSteps: Array<{ stack: string; input: string; action: string }>
    timestamp: string
  }
}

/**
 * 历史记录单条结构
 */
export interface LR0HistoryRecord {
  id: string                 // 唯一标识
  createdAt: string          // 创建时间
  timestamp: string          // 最后修改时间
  grammar: string            // 文法内容 (用于显示)
  productions: string[]      // 产生式列表
  errorLogs: LR0ErrorLog[]   // 错误日志
  userData: {
    inputString: string
    step2Data: LR0StoreData['step2Data']
    step3Data: LR0StoreData['step3Data']
    step4Data: LR0StoreData['step4Data']
    step5Data: LR0StoreData['step5Data']
  }
}

// ================= Store 定义 =================

export const useLR0Store = defineStore('lr0', () => {
  const commonStore = useCommonStore()

  // ------------------------------------------
  // 1. 状态 (State)
  // ------------------------------------------

  // === 核心标识：当前正在编辑的记录ID ===
  const currentRecordId = ref<string | null>(null)

  // === 当前激活的会话数据 (Active Session) ===
  const productions = ref<string[]>([])
  const inputString = ref('')
  const originalData = ref<LR0AnalysisResult | null>(null) // 后端原始数据 (不持久化)
  const inputAnalysisResult = ref<AnalysisStepInfo | null>(null) // 输入串分析结果 (不持久化)

  // 校验相关状态
  const validationErrors = ref<string[]>([])
  const validationWarnings = ref<string[]>([])
  const isValidGrammar = ref<boolean | null>(null)
  const productionItems = ref<ProductionItem[]>([])

  // 校验数据 - 用于前端显示和交互
  const validationData = ref<LR0ValidationItem[]>([])
  const actionTable = ref<Record<string, string>>({})
  const gotoTable = ref<Record<string, string>>({})
  const dfaStates = ref<any[]>([])
  const dotItems = ref<string[]>([])
  const isLR0Grammar = ref<boolean | null>(null)

  // DOT字符串用于图形显示
  const dotString = ref('')

  // 用户答题数据
  const step2Data = ref<LR0StoreData['step2Data']>(undefined)
  const step3Data = ref<LR0StoreData['step3Data']>(undefined)
  const step4Data = ref<LR0StoreData['step4Data']>(undefined)
  const step5Data = ref<LR0StoreData['step5Data']>(undefined)

  // === 错误日志状态 (Active Session Error Logs) ===
  const errorLogs = ref<LR0ErrorLog[]>([])

  // === 历史记录列表 (History Archive) ===
  const historyList = ref<LR0HistoryRecord[]>([])

  // ------------------------------------------
  // 2. 计算属性 (Computed)
  // ------------------------------------------
  const grammar = computed(() => productions.value.join('\n'))

  // 判断当前是否是新会话
  const isNewSession = computed(() => currentRecordId.value === null)

  // ------------------------------------------
  // 3. 核心工具方法
  // ------------------------------------------

  const generateUniqueId = () => {
    const timestamp = Date.now().toString(36)
    const randomStr = Math.random().toString(36).substring(2, 8)
    return `${timestamp}-${randomStr}`
  }

  // 校验方法
  const validateProductions = (inputText: string): ValidationResult => {
    const errors: string[] = []
    const warnings: string[] = []

    // 1. 基础空值检测
    const isEmpty = /^\s*$/.test(inputText)
    if (isEmpty) {
      errors.push('请输入产生式！')
      return { isValid: false, errors, warnings }
    }

    // 2. 中文字符检测
    const chinesePattern = /[\u4e00-\u9fa5]/
    if (chinesePattern.test(inputText)) {
      errors.push('输入不能包含中文！')
      return { isValid: false, errors, warnings }
    }

    // 3. 预处理产生式
    const cleanedText = inputText.replace(/ +/g, '') // 只消除空格但不消除换行
    const productionList = cleanedText.split('\n').filter((item) => item.trim() !== '')

    // 4. 重复项检测
    const productionSet = new Set(productionList)
    if (productionList.length !== productionSet.size) {
      errors.push('产生式含重复项，请重新输入！')
      return { isValid: false, errors, warnings }
    }

    // 5. 产生式格式校验
    const isValidProduction = productionList.every((production) => {
      // 检查是否包含多个->
      const arrowCount = (production.match(/->/g) || []).length
      if (arrowCount > 1) return false

      const match = production.match(/^([A-Z])->((?:[^|]+\|)*[^|]+)$/)
      return !!match
    })

    if (!isValidProduction) {
      errors.push('产生式不符合文法规范，请重新输入！')
      return { isValid: false, errors, warnings }
    }

    // 6. 文法逻辑校验
    const grammarMap: { [key: string]: string[] } = {}
    for (const production of productionList) {
      const [left, right] = production.split('->')
      if (right.includes('|')) {
        const rightList = right.split('|')
        if (!grammarMap[left]) {
          grammarMap[left] = []
        }
        for (const r of rightList) {
          grammarMap[left].push(r)
        }
      } else {
        if (!grammarMap[left]) {
          grammarMap[left] = []
        }
        grammarMap[left].push(right)
      }
    }

    // 7. 检查非终结符完整性
    const allNonTerminals = Array.from(productionList.join('').match(/[A-Z]/g) || [])
    for (const vn of allNonTerminals) {
      if (!grammarMap[vn]) {
        errors.push(`Vn: ${vn}没有候选式！`)
        return { isValid: false, errors, warnings }
      }
    }

    return { isValid: true, errors, warnings }
  }

  // 输入预处理和校验
  const validateAndFormatInput = (
    inputText: string,
  ): { success: boolean; productions: string[] } => {
    const validation = validateProductions(inputText)

    if (!validation.isValid) {
      validationErrors.value = validation.errors
      validationWarnings.value = validation.warnings
      isValidGrammar.value = false
      return { success: false, productions: [] }
    }

    validationErrors.value = []
    validationWarnings.value = validation.warnings
    isValidGrammar.value = true

    // 返回处理后的产生式数组
    const cleanedText = inputText.replace(/ +/g, '')
    const processedProductions = cleanedText.split('\n').filter((item) => item.trim() !== '')

    return { success: true, productions: processedProductions }
  }

  // 将后端数据转换为校验数据
  const transformToValidationData = (result: LR0AnalysisResult): LR0ValidationItem[] => {
    const items: LR0ValidationItem[] = []
    let itemId = 0

    // 转换Action表项
    Object.entries(result.actions || {}).forEach(([key, value]) => {
      items.push({
        id: `action_${itemId++}`,
        category: 'action',
        state: key,
        check: !value.includes('conflict') && !value.includes('error'),
        data: { key, value, type: 'action' },
      })
    })

    // 转换Goto表项
    Object.entries(result.gotos || {}).forEach(([key, value]) => {
      items.push({
        id: `goto_${itemId++}`,
        category: 'goto',
        state: key,
        check: !!value,
        data: { key, value, type: 'goto' },
      })
    })

    // 转换DFA状态
    result.all_dfa?.forEach((dfa, index) => {
      items.push({
        id: `dfa_${index}`,
        category: 'dfa',
        state: `I${index}`,
        check: true,
        coords: { x: index * 100, y: index * 80 },
        data: dfa,
      })
    })

    // 转换项目集
    result.dot_items?.forEach((item, index) => {
      items.push({
        id: `item_${index}`,
        category: 'item',
        state: item,
        check: true,
        data: { item, index },
      })
    })

    return items
  }

  // ------------------------------------------
  // 4. API 交互 Actions
  // ------------------------------------------

  const performLR0Analysis = async (isRestoring = false) => {
    if (productions.value.length === 0) {
      commonStore.setError('请至少输入一个产生式')
      return false
    }

    try {
      commonStore.setLoading(true)
      commonStore.clearError()

      // 如果不是正在复现历史，则清空当前数据
      if (!isRestoring) {
        clearAllStepData()
        currentRecordId.value = null
      }

      const response = await getLR0AnalyseAPI(productions.value)

      // 检查响应是否成功 - 后端返回 code: 0 表示成功
      if (response.status === 200 && response.data && response.data.code === 0) {
        const result = response.data.data as LR0AnalysisResult

        if (result && result.S) {
          originalData.value = result

          // 更新相关状态
          actionTable.value = result.actions || {}
          gotoTable.value = result.gotos || {}
          dfaStates.value = result.all_dfa.map((item) => {
            return {
              id: 'Item' + item.id,
              pros: item.pros.map((x: any, idx: any) => {
                return {
                  id: 'Item' + item.id + '_pro' + idx,
                  text: x,
                }
              }),
              next_ids: item.next_ids,
            }
          })

          dotItems.value = result.dot_items || []
          isLR0Grammar.value = result.isLR0 ?? null
          dotString.value = result.LR0_dot_str || ''
          // 检测冲突并设置警告
          if (!result.isLR0) {
            validationWarnings.value = [
              '检测到移进-规约冲突或规约-规约冲突',
              '该文法不是LR0文法，后续功能可能无法正常使用',
              '建议修改文法以消除冲突',
            ]
          } else {
            validationWarnings.value = []
          }

          // 转换为校验数据
          validationData.value = transformToValidationData(result)

          return true
        } else {
          commonStore.setError('分析结果格式错误')
          return false
        }
      } else {
        // 处理后端返回的错误
        const errorMsg =
          response.data?.message || response.data?.msg || `分析失败 (code: ${response.data?.code})`
        commonStore.setError(errorMsg)
        return false
      }
    } catch (err) {
      commonStore.setError(err instanceof Error ? err.message : 'LR0分析请求失败')
      return false
    } finally {
      commonStore.setLoading(false)
    }
  }

  // 从原始文本分析
  const performLR0AnalysisFromText = async (inputText: string) => {
    const { success, productions: validatedProductions } = validateAndFormatInput(inputText)

    if (!success) {
      const errorMsg = validationErrors.value.join(', ')
      commonStore.setError(errorMsg)
      return false
    }

    // 更新产生式
    productions.value = validatedProductions

    // 执行分析
    return await performLR0Analysis()
  }

  // 分析输入串
  const analyzeInputString = async () => {
    if (!inputString.value.trim()) {
      commonStore.setError('请输入要分析的字符串')
      return false
    }

    if (productions.value.length === 0) {
      commonStore.setError('请先设置产生式')
      return false
    }

    try {
      commonStore.setLoading(true)
      commonStore.clearError()

      // 处理输入字符串：移除用户输入的#，让后端自动添加
      const processedInput = inputString.value.trim().replace(/#/g, '')

      const response = await LR0AnalyseInpStrAPI(productions.value, processedInput)

      // 后端返回 code: 0 表示成功
      if (
        response.status === 200 &&
        response.data &&
        response.data.code === 0 &&
        response.data.data
      ) {
        inputAnalysisResult.value = response.data.data

        // 自动解析动画数据
        try {
          const animationStore = useLR0AnimationStore()
          await animationStore.parseAnimationData(response.data.data)
        } catch {
          // 动画解析失败不影响主要的分析功能
        }

        return true
      } else {
        commonStore.setError(response.data?.message || response.data?.msg || '输入串分析失败')
        return false
      }
    } catch (err) {
      commonStore.setError(err instanceof Error ? err.message : '输入串分析请求失败')
      return false
    } finally {
      commonStore.setLoading(false)
    }
  }

  // ------------------------------------------
  // 5. 历史记录管理 Actions
  // ------------------------------------------

  const saveToHistory = () => {
    if (!productions.value.length || !originalData.value) {
      return
    }

    const nowTime = new Date().toLocaleString()

    // 深拷贝用户数据
    const snapshotData = {
      inputString: inputString.value,
      step2Data: step2Data.value ? JSON.parse(JSON.stringify(step2Data.value)) : undefined,
      step3Data: step3Data.value ? JSON.parse(JSON.stringify(step3Data.value)) : undefined,
      step4Data: step4Data.value ? JSON.parse(JSON.stringify(step4Data.value)) : undefined,
      step5Data: step5Data.value ? JSON.parse(JSON.stringify(step5Data.value)) : undefined
    }

    // 深拷贝错误日志
    const snapshotErrors = JSON.parse(JSON.stringify(errorLogs.value))

    if (currentRecordId.value) {
      const index = historyList.value.findIndex(item => item.id === currentRecordId.value)
      if (index !== -1) {
        historyList.value[index].timestamp = nowTime
        historyList.value[index].grammar = grammar.value
        historyList.value[index].productions = JSON.parse(JSON.stringify(productions.value))
        historyList.value[index].errorLogs = snapshotErrors
        historyList.value[index].userData = snapshotData as any

        const updatedRecord = historyList.value.splice(index, 1)[0]
        historyList.value.unshift(updatedRecord)
      } else {
        currentRecordId.value = null
        saveToHistory()
      }
    } else {
      const newId = generateUniqueId()
      const newRecord: LR0HistoryRecord = {
        id: newId,
        createdAt: nowTime,
        timestamp: nowTime,
        grammar: grammar.value,
        productions: JSON.parse(JSON.stringify(productions.value)),
        errorLogs: snapshotErrors,
        userData: snapshotData as any
      }

      historyList.value.unshift(newRecord)
      currentRecordId.value = newId

      if (historyList.value.length > maxHistoryRecords) {
        historyList.value = historyList.value.slice(0, maxHistoryRecords)
      }
    }
  }

  const restoreFromHistory = async (recordId: string) => {
    const record = historyList.value.find(item => item.id === recordId)
    if (!record) {
      commonStore.setError('找不到该历史记录')
      return false
    }

    currentRecordId.value = recordId
    productions.value = JSON.parse(JSON.stringify(record.productions))

    const isSuccess = await performLR0Analysis(true)

    if (isSuccess) {
      inputString.value = record.userData.inputString || ''

      if (record.userData.step2Data) {
        step2Data.value = JSON.parse(JSON.stringify(record.userData.step2Data))
      } else {
        step2Data.value = undefined
      }

      if (record.userData.step3Data) {
        step3Data.value = JSON.parse(JSON.stringify(record.userData.step3Data))
      } else {
        step3Data.value = undefined
      }

      if (record.userData.step4Data) {
        step4Data.value = JSON.parse(JSON.stringify(record.userData.step4Data))
      } else {
        step4Data.value = undefined
      }

      if (record.userData.step5Data) {
        step5Data.value = JSON.parse(JSON.stringify(record.userData.step5Data))
      } else {
        step5Data.value = undefined
      }

      // 重新分析字符串以获取 inputAnalysisResult
      if (inputString.value) {
        await analyzeInputString()
      }

      return true
    } else {
      commonStore.setError('无法复现：后端数据请求失败')
      return false
    }
  }

  const deleteHistoryRecord = (recordId: string) => {
    historyList.value = historyList.value.filter(item => item.id !== recordId)
    if (currentRecordId.value === recordId) {
      resetAll()
    }
  }

  const clearAllHistory = () => {
    historyList.value = []
    resetAll()
  }

  // ------------------------------------------
  // 6. 普通数据管理 Actions
  // ------------------------------------------

  const setProductions = (newProductions: string[]) => {
    // 处理产生式：移除所有空格，保持与旧前端一致的格式
    const processedProductions = newProductions.map(
      (prod) => prod.replace(/ +/g, ''), // 只消除空格但不消除换行
    )
    productions.value = [...processedProductions]
    // 清除之前的分析结果
    clearAnalysisResults()
  }

  const addProduction = (production: string) => {
    if (production.trim() && !productions.value.includes(production.trim())) {
      productions.value.push(production.trim())
    }
  }

  const removeProduction = (index: number) => {
    if (index >= 0 && index < productions.value.length) {
      productions.value.splice(index, 1)
    }
  }

  const clearProductions = () => {
    productions.value = []
    clearAnalysisResults()
  }

  const setInputString = (str: string) => {
    inputString.value = str
    inputAnalysisResult.value = null
  }

  const clearAnalysisResults = () => {
    originalData.value = null
    inputAnalysisResult.value = null
    validationData.value = []
    actionTable.value = {}
    gotoTable.value = {}
    dfaStates.value = []
    dotItems.value = []
    isLR0Grammar.value = null
    dotString.value = ''
    // 清除校验状态
    validationErrors.value = []
    validationWarnings.value = []
    isValidGrammar.value = null
    productionItems.value = []
  }

  const clearAllStepData = () => {
    clearAnalysisResults()
    step2Data.value = undefined
    step3Data.value = undefined
    step4Data.value = undefined
    step5Data.value = undefined
    errorLogs.value = [] // 清空错误日志
  }

  const resetAll = () => {
    productions.value = []
    inputString.value = ''
    clearAllStepData()
    commonStore.clearError()
    currentRecordId.value = null

    // 清空动画数据
    const animationStore = useLR0AnimationStore()
    animationStore.clearAnimationData()
  }

  const updateValidationItem = (id: string, check: boolean) => {
    const item = validationData.value.find((item) => item.id === id)
    if (item) {
      item.check = check
    }
  }

  const getValidationDataByCategory = (category: LR0ValidationItem['category']) => {
    return validationData.value.filter((item) => item.category === category)
  }

  const saveStep2Data = (userAugmentedFormulas: any, validationSuccess: boolean) => {
    step2Data.value = {
      userAugmentedFormulas: JSON.parse(JSON.stringify(userAugmentedFormulas)),
      validationSuccess,
      timestamp: new Date().toISOString()
    }
  }

  const saveStep3Data = (
    userShowAnswer: boolean,
    userDfaStates?: any[],
    userDotItems?: any[],
    dfaState?: {
      addNodeLimit: number
      addNodeRemainCnt: number
      forEachEpochAllNum: number
      checkRightItems: string[]
      checkRightGotos: string[]
      checkRightLocalNode: string[]
      checkRightLocalEdge: string[]
      nodeIdMapItemId: Record<string, string>
      edgeIdMapGotosId: Record<string, string>
      nextStepOpen: boolean[]
    } | null
  ) => {
    step3Data.value = {
      userShowAnswer,
      timestamp: new Date().toISOString(),
      ...(userDfaStates && { userDfaStates: JSON.parse(JSON.stringify(userDfaStates)) }),
      ...(userDotItems && { userDotItems: JSON.parse(JSON.stringify(userDotItems)) }),
      ...(dfaState && { dfaState: JSON.parse(JSON.stringify(dfaState)) }),
    }
  }

  const saveStep4Data = (userActionTable: any, userGotoTable: any) => {
    step4Data.value = {
      userActionTable: JSON.parse(JSON.stringify(userActionTable)),
      userGotoTable: JSON.parse(JSON.stringify(userGotoTable)),
      timestamp: new Date().toISOString()
    }
  }

  const saveStep5Data = (userSteps: Array<{ stack: string; input: string; action: string }>) => {
    step5Data.value = {
      userSteps: JSON.parse(JSON.stringify(userSteps)),
      timestamp: new Date().toISOString()
    }
  }

  // 记录错误日志
  const addErrorLog = (log: Omit<LR0ErrorLog, 'id' | 'timestamp'>) => {
    // 避免在极短时间内重复记录完全相同的错误（与 FA 逻辑保持一致）
    const isDuplicate = errorLogs.value.some(item =>
      item.step === log.step &&
      item.type === log.type &&
      item.location.fieldKey === log.location.fieldKey &&
      item.wrongValue === log.wrongValue
    )

    if (!isDuplicate) {
      errorLogs.value.push({
        ...log,
        id: generateUniqueId(),
        timestamp: new Date().toLocaleString()
      })
    }
  }

  // ------------------------------------------
  // 7. 持久化配置
  // ------------------------------------------

  const persistenceConfig = {
    key: 'lr0_store_v2',
    version: '2.0.0',
    include: [
      'currentRecordId',
      'productions',
      'inputString',
      'step2Data',
      'step3Data',
      'step4Data',
      'step5Data',
      'errorLogs', // 包含错误日志
      'historyList'
    ],
    autoSave: true,
    saveDelay: 500,
  }

  const persistence = usePersistence({
    store: {
      currentRecordId,
      productions,
      inputString,
      step2Data,
      step3Data,
      step4Data,
      step5Data,
      errorLogs,
      historyList,
    },
    ...persistenceConfig,
  })

  return {
    // State
    currentRecordId,
    isNewSession,
    productions,
    inputString,
    originalData,
    inputAnalysisResult,
    validationData,
    actionTable,
    gotoTable,
    dfaStates,
    dotItems,
    isLR0Grammar,
    dotString,
    step2Data,
    step3Data,
    step4Data,
    step5Data,
    errorLogs,
    historyList,

    // 校验状态
    validationErrors,
    validationWarnings,
    isValidGrammar,
    productionItems,

    // Computed
    grammar,

    // Actions
    setProductions,
    addProduction,
    removeProduction,
    clearProductions,
    setInputString,
    performLR0Analysis,
    performLR0AnalysisFromText,
    analyzeInputString,
    updateValidationItem,
    getValidationDataByCategory,
    validateProductions,
    validateAndFormatInput,
    clearAllStepData,
    resetAll,
    saveToHistory,
    restoreFromHistory,
    deleteHistoryRecord,
    clearAllHistory,
    saveStep2Data,
    saveStep3Data,
    saveStep4Data,
    saveStep5Data,
    addErrorLog,

    // 动画相关
    getAnimationStore: () => useLR0AnimationStore(),

    // Persistence
    persistence: {
      save: persistence.save,
      load: persistence.load,
      clear: persistence.clear,
    },

    // AI 上下文构造
    buildAIContext: (currentStep: number): AIAnswerContext => {
      return buildLR0Context(
        currentStep,
        {
          productions: productions.value,
          inputString: inputString.value,
          step2Data: step2Data.value,
          step3Data: step3Data.value,
          step4Data: step4Data.value,
          step5Data: step5Data.value,
        },
        originalData.value,
        inputAnalysisResult.value,
        actionTable.value,
        gotoTable.value,
        dfaStates.value,
        errorLogs.value,
        currentRecordId.value,
      )
    },
  }
})
