import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getLL1AnalyseAPI, LL1AnalyseInpStrAPI } from '@/api'
import type { LL1AnalysisResult } from '@/types'
import type { AnalysisStepInfo } from '@/types/ll1'
import { useCommonStore } from './common'
import { usePersistence, useMultiConfig, useHistory } from '@/composables/persistence'
import { useLL1AnimationStore } from '@/animation/store'

export const useLL1Store = defineStore('ll1', () => {
  const commonStore = useCommonStore()

  // 状态
  const productions = ref<string[]>([])
  const originalData = ref<LL1AnalysisResult | null>(null) // 后端原始数据
  const inputString = ref('')
  const inputAnalysisResult = ref<AnalysisStepInfo | null>(null)

  // 计算属性 - 从原始数据提取
  const parseTable = computed(() => originalData.value?.table || {})
  const firstSets = computed(() => originalData.value?.first || {})
  const followSets = computed(() => originalData.value?.follow || {})
  const isLL1Grammar = computed(() => originalData.value?.isLL1 ?? null)

  // 文法验证函数
  const validateGrammar = (
    inputText: string,
  ): { isValid: boolean; errorMessage: string; processedProductions: string[] } => {
    let processedProductions: string[] = []

    try {
      // 1. 输入基本检查
      // 检查输入是否为空（仅包含空白字符）
      const emptyPattern = /^\s*$/
      if (emptyPattern.test(inputText)) {
        return { isValid: false, errorMessage: '请输入产生式！', processedProductions: [] }
      }

      // 检查是否包含中文字符
      const chinesePattern = /[\u4e00-\u9fa5]/
      if (chinesePattern.test(inputText)) {
        return { isValid: false, errorMessage: '输入不能包含中文字符！', processedProductions: [] }
      }

      // 去除所有空格，但保留换行符
      let processedText = inputText.replace(/ +/g, '')

      // 2. 产生式分割与重复检查
      processedProductions = processedText.split('\n').filter((item) => item.trim() !== '')

      // 检查重复项
      const productionSet = new Set(processedProductions)
      if (processedProductions.length !== productionSet.size) {
        return {
          isValid: false,
          errorMessage: '产生式含重复项，请重新输入！',
          processedProductions: [],
        }
      }

      // 3. 产生式格式检查
      // 检查每个产生式
      for (let i = 0; i < processedProductions.length; i++) {
        const production = processedProductions[i]

        // 检查 -> 数量
        const arrowCount = (production.match(/->/g) || []).length
        if (arrowCount > 1) {
          return {
            isValid: false,
            errorMessage: `第${i + 1}行产生式包含多个"->"，格式错误！`,
            processedProductions: [],
          }
        }
        if (arrowCount === 0) {
          return {
            isValid: false,
            errorMessage: `第${i + 1}行产生式缺少"->"，格式错误！`,
            processedProductions: [],
          }
        }

        // 检查产生式格式：X->Y，其中X为大写字母，Y为任意字符（除|）和|分隔的序列
        const formatMatch = production.match(/^([A-Z])->((?:[^|]+\|)*[^|]+)$/)
        if (!formatMatch) {
          return {
            isValid: false,
            errorMessage: `第${i + 1}行产生式格式错误！应为"大写字母->右部"格式`,
            processedProductions: [],
          }
        }
      }

      // 4. 构建产生式字典
      const formulasDict: Record<string, string[]> = {}
      for (const production of processedProductions) {
        const [left, right] = production.split('->')
        if (right.includes('|')) {
          const rightParts = right.split('|')
          if (!formulasDict[left]) {
            formulasDict[left] = []
          }
          for (const part of rightParts) {
            if (!formulasDict[left].includes(part)) {
              formulasDict[left].push(part)
            }
          }
        } else {
          if (!formulasDict[left]) {
            formulasDict[left] = []
          }
          formulasDict[left].push(right)
        }
      }

      // 5. 检查非终结符是否有候选式
      const allNonTerminals = Array.from(processedProductions.join('').match(/[A-Z]/g) || [])
      for (const nonTerminal of allNonTerminals) {
        if (!formulasDict[nonTerminal]) {
          return {
            isValid: false,
            errorMessage: `非终结符"${nonTerminal}"没有定义产生式！`,
            processedProductions: [],
          }
        }
      }

      // 6. 检查左递归
      const visited = new Set<string>()
      const recursionStack = new Set<string>()

      const hasLeftRecursion = (nonTerminal: string): boolean => {
        if (recursionStack.has(nonTerminal)) {
          return true // 发现左递归
        }
        if (visited.has(nonTerminal)) {
          return false // 已经检查过，无左递归
        }

        visited.add(nonTerminal)
        recursionStack.add(nonTerminal)

        for (const rightPart of formulasDict[nonTerminal] || []) {
          const firstSymbol = rightPart[0]
          if (/[A-Z]/.test(firstSymbol) && formulasDict[firstSymbol]) {
            if (hasLeftRecursion(firstSymbol)) {
              return true
            }
          }
        }

        recursionStack.delete(nonTerminal)
        return false
      }

      for (const nonTerminal of allNonTerminals) {
        if (!visited.has(nonTerminal)) {
          if (hasLeftRecursion(nonTerminal)) {
            return {
              isValid: false,
              errorMessage: '存在直接或间接左递归，请输入消除左递归后的文法！',
              processedProductions: [],
            }
          }
        }
      }

      // 7. 检查终结符连续出现
      for (let i = 0; i < processedProductions.length; i++) {
        const production = processedProductions[i]
        const [_left, right] = production.split('->')
        const rightParts = right.split('|')

        for (const part of rightParts) {
          // 跳过ε
          if (part === 'ε') continue

          // 检查是否有连续的终结符
          for (let j = 0; j < part.length - 1; j++) {
            const current = part[j]
            const next = part[j + 1]

            // 如果当前字符和下一个字符都不是大写字母、|、空格，则可能是连续的终结符
            const isCurrentTerminal = !/[A-Z| ]/.test(current)
            const isNextTerminal = !/[A-Z| ]/.test(next)

            if (isCurrentTerminal && isNextTerminal) {
              return {
                isValid: false,
                errorMessage: `第${i + 1}行：终结符不能连续出现，如"${current}${next}"`,
                processedProductions: [],
              }
            }
          }
        }
      }

      return { isValid: true, errorMessage: '', processedProductions }
    } catch (error) {
      console.error('文法验证过程中发生错误:', error)
      return { isValid: false, errorMessage: '文法验证过程中发生错误', processedProductions: [] }
    }
  }

  // Actions
  const setProductions = (newProductions: string[]) => {
    productions.value = [...newProductions]
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
    originalData.value = null
    inputAnalysisResult.value = null
  }

  const setInputString = (str: string) => {
    inputString.value = str
    inputAnalysisResult.value = null
  }

  // 执行LL1语法分析
  const performLL1Analysis = async (processedProductions?: string[]) => {
    // 如果没有传入处理后的产生式，使用store中的productions
    const productionsToUse = processedProductions || productions.value

    if (productionsToUse.length === 0) {
      commonStore.setError('请至少输入一个产生式')
      return false
    }

    // 如果没有传入处理后的产生式，则进行验证
    if (!processedProductions) {
      const inputText = productions.value.join('\n')
      const validation = validateGrammar(inputText)

      if (!validation.isValid) {
        commonStore.setError(validation.errorMessage)
        return false
      }
    }

    try {
      commonStore.setLoading(true)
      commonStore.clearError()

      // 状态重置逻辑
      originalData.value = null
      inputAnalysisResult.value = null

      // 使用传入的处理后产生式或验证后的产生式数组
      const validatedProductions = processedProductions || productions.value
      const response = await getLL1AnalyseAPI(validatedProductions)

      // 修复：后端返回的成功码是 0，不是 200
      if (response.data.code === 0 && response.data.data) {
        const rawData = response.data.data

        // 调试：打印后端返回的原始数据
        console.log('=== LL1 后端返回的原始数据 ===')
        console.log('完整响应:', response.data)
        console.log('原始数据:', rawData)
        console.log('起始符号:', rawData.S)
        console.log('非终结符 Vn:', rawData.Vn)
        console.log('终结符 Vt:', rawData.Vt)
        console.log('Vt 数组长度:', rawData.Vt.length)
        console.log(
          'Vt 数组详细:',
          rawData.Vt.map((item, index) => `[${index}]: "${item}" (length: ${item.length})`),
        )
        console.log('First 集合:', rawData.first)
        console.log('Follow 集合:', rawData.follow)
        console.log('产生式字典:', rawData.formulas_dict)
        console.log('分析表:', rawData.table)
        console.log('是否LL1:', rawData.isLL1)
        console.log('================================')

        // 检查是否符合LL1文法
        if (!rawData.isLL1) {
          throw new Error('不符合LL1文法，请重新输入！')
        }

        originalData.value = rawData

        return true
      } else {
        commonStore.setError(response.data.message || response.data.msg || 'LL1分析失败')
        return false
      }
    } catch (err) {
      commonStore.setError(err instanceof Error ? err.message : 'LL1分析请求失败')
      return false
    } finally {
      commonStore.setLoading(false)
    }
  }

  // 分析输入串
  const analyzeInputString = async () => {
    // 输入串预处理
    let cleanedInputString = inputString.value.replace(/ +/g, '') // 移除空格
    if (/^\s*$/.test(cleanedInputString)) {
      commonStore.setError('请先输入字符串')
      cleanedInputString += '#'
      return false
    }

    // 不添加结束符#，让后端处理
    // 后端会自动添加结束符进行LL1分析

    if (productions.value.length === 0) {
      commonStore.setError('请先设置产生式')
      return false
    }

    try {
      commonStore.setLoading(true)
      commonStore.clearError()

      // 直接使用清理后的字符串发送请求，不添加#
      const response = await LL1AnalyseInpStrAPI(productions.value, cleanedInputString)

      if (response.data.code === 0 && response.data.data) {
        const responseData = response.data.data

        // 保存分析结果，无论成功还是失败
        inputAnalysisResult.value = responseData

        // 打印 LL1 输入串分析结果
        console.log('===== LL1 输入串分析结果 =====')
        console.log('输入串:', cleanedInputString)
        console.log('分析结果数据:', inputAnalysisResult.value)
        console.log('=====================================')

        // 自动解析动画数据
        try {
          const animationStore = useLL1AnimationStore()
          await animationStore.parseAnimationData(responseData)
          console.log('LL1动画数据解析成功')
        } catch (animationError) {
          console.warn('LL1动画数据解析失败:', animationError)
          // 动画解析失败不影响主要的分析功能
        }

        // 检查分析结果
        if (responseData.info_res === 'Success!') {
          return true
        } else {
          // 分析失败，但仍然返回true表示请求成功
          return true
        }
      } else {
        commonStore.setError(response.data.message || response.data.msg || '输入串分析失败')
        return false
      }
    } catch (err) {
      commonStore.setError(err instanceof Error ? err.message : '输入串分析请求失败')
      return false
    } finally {
      commonStore.setLoading(false)
    }
  }

  // 重置所有状态
  const resetAll = () => {
    productions.value = []
    originalData.value = null
    inputString.value = ''
    inputAnalysisResult.value = null
    commonStore.clearError()

    // 清空动画数据
    const animationStore = useLL1AnimationStore()
    animationStore.clearAnimationData()
  }

  // 获取动画Store实例
  const getAnimationStore = () => {
    return useLL1AnimationStore()
  }

  // 配置持久化
  const persistenceConfig = {
    key: 'll1_store',
    version: '1.0.0',
    include: ['productions', 'inputString'],
    autoSave: true,
    ttl: 7 * 24 * 60 * 60 * 1000, // 7天
    saveDelay: 500,
  }

  // 应用持久化功能
  const persistence = usePersistence({
    store: {
      productions,
      inputString,
    },
    ...persistenceConfig,
  })

  // 多配置管理
  const multiConfig = useMultiConfig({
    store: {
      productions,
      inputString,
    },
    configKey: 'll1',
  })

  // 历史记录管理
  const history = useHistory({
    store: {
      productions,
      inputString,
    },
    historyKey: 'll1',
    maxHistory: 20,
    autoSave: true,
  })

  return {
    // 状态
    productions,
    originalData,
    inputString,
    inputAnalysisResult,

    // 计算属性
    parseTable,
    firstSets,
    followSets,
    isLL1Grammar,

    // Actions
    setProductions,
    addProduction,
    removeProduction,
    clearProductions,
    setInputString,
    performLL1Analysis,
    analyzeInputString,
    resetAll,

    // 工具方法
    validateGrammar,

    // 动画相关
    getAnimationStore,

    // 持久化功能
    persistence: {
      save: persistence.save,
      load: persistence.load,
      clear: persistence.clear,
      storageKey: persistence.storageKey,
    },

    // 多配置管理
    configs: {
      save: multiConfig.saveConfig,
      load: multiConfig.loadConfig,
      list: multiConfig.getConfigs,
      delete: multiConfig.deleteConfig,
      clear: multiConfig.clearConfigs,
    },

    // 历史记录
    history: {
      add: history.addToHistory,
      list: history.getHistory,
      restore: history.restoreFromHistory,
      clear: history.clearHistory,
    },
  }
})
