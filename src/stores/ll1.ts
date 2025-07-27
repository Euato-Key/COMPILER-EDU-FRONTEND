import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getLL1AnalyseAPI, LL1AnalyseInpStrAPI } from '@/api'
import type { LL1AnalysisResult, DataLL1Type, AnalysisStepInfo } from '@/types'
import { useCommonStore } from './common'
import { usePersistence, useMultiConfig, useHistory } from '@/composables/persistence'

export const useLL1Store = defineStore('ll1', () => {
  const commonStore = useCommonStore()

  // 状态
  const productions = ref<string[]>([])
  const originalData = ref<LL1AnalysisResult | null>(null) // 后端原始数据
  const validationData = ref<DataLL1Type | null>(null) // 前端校验数据
  const inputString = ref('')
  const inputAnalysisResult = ref<AnalysisStepInfo | null>(null)

  // 计算属性 - 从原始数据提取
  const parseTable = computed(() => originalData.value?.table || {})
  const firstSets = computed(() => originalData.value?.first || {})
  const followSets = computed(() => originalData.value?.follow || {})
  const isLL1Grammar = computed(() => originalData.value?.isLL1 ?? null)

  // 数据转换方法 - 将后端原始数据转换为校验数据
  const transformToValidationData = (rawData: LL1AnalysisResult): DataLL1Type => {
    const data: DataLL1Type = {
      S: rawData.S,
      Vn: [],
      Vt: [],
      first: [],
      follow: [],
      formulas_dict: [],
      table: [],
    }

    // 转换Vn数据
    data.Vn = rawData.Vn.map((item: string, index: number) => ({
      id: 'Vn' + index,
      category: 'onlyRead' as const,
      state: 'normal' as const,
      check: 'normal' as const,
      text: item,
    }))

    // 转换Vt数据
    data.Vt = rawData.Vt.map((item: string, index: number) => ({
      id: 'Vt' + index,
      category: 'onlyRead' as const,
      state: 'normal' as const,
      check: 'normal' as const,
      text: item,
    }))

    // 转换First集合数据
    for (const [symbol, firstSet] of Object.entries(rawData.first)) {
      firstSet.forEach((item: string, index: number) => {
        data.first.push({
          id: 'first' + index + symbol,
          category: 'onlyRead' as const,
          state: 'normal' as const,
          check: 'normal' as const,
          symbol: symbol,
          text: item,
        })
      })
    }

    // 转换Follow集合数据
    for (const [symbol, followSet] of Object.entries(rawData.follow)) {
      followSet.forEach((item: string, index: number) => {
        data.follow.push({
          id: 'follow' + index + symbol,
          category: 'onlyRead' as const,
          state: 'normal' as const,
          check: 'normal' as const,
          symbol: symbol,
          text: item,
        })
      })
    }

    // 转换产生式数据
    for (const [left, rights] of Object.entries(rawData.formulas_dict)) {
      rights.forEach((right: string, index: number) => {
        data.formulas_dict.push({
          id: 'formula' + index + left,
          category: 'onlyRead' as const,
          state: 'normal' as const,
          check: 'normal' as const,
          symbol: left,
          text: `${left} -> ${right}`,
        })
      })
    }

    // 转换LL1分析表数据
    for (const [key, value] of Object.entries(rawData.table)) {
      data.table.push({
        id: 'table' + key,
        category: 'onlyRead' as const,
        state: 'normal' as const,
        check: 'normal' as const,
        coords: key.split('|'), // "A|a" -> ["A", "a"]
        text: value,
      })
    }

    return data
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
    validationData.value = null
    inputAnalysisResult.value = null
  }

  const setInputString = (str: string) => {
    inputString.value = str
    inputAnalysisResult.value = null
  }

  // 验证和格式化输入文本
  const validateAndFormatInput = (inputText: string): string[] => {
    console.log('=== validateAndFormatInput 开始处理 ===')
    console.log('原始输入:', JSON.stringify(inputText))

    // 1. 空输入检查
    const isEmpty = /^\s*$/.test(inputText)
    if (isEmpty) throw new Error('请输入产生式！')

    // 2. 中文字符检查
    const hasChinese = /[\u4e00-\u9fa5]/.test(inputText)
    if (hasChinese) throw new Error('输入不能包含中文！')

    // 3. 基本格式预处理
    const cleanedText = inputText.replace(/ +/g, '') // 移除空格但保留换行
    console.log('移除空格后:', JSON.stringify(cleanedText))

    const productionList = cleanedText.split('\n').filter((item) => item.trim() !== '')
    console.log('分割并过滤后的产生式列表:', productionList)

    // 4. 重复项检查
    const productionSet = new Set(productionList)
    if (productionList.length !== productionSet.size) {
      throw new Error('产生式含重复项，请重新输入！')
    }

    // 5. 产生式格式验证
    const isValidFormat = productionList.every((production) => {
      const arrowCount = (production.match(/->/g) || []).length
      if (arrowCount > 1) return false

      // 验证格式: X->Y (X是大写字母，Y支持|分隔，支持#作为终结符)
      const match = production.match(/^([A-Z])->((?:[^|]+\|)*[^|]+)$/)
      return !!match
    })

    if (!isValidFormat) {
      throw new Error('产生式不符合文法规范，请重新输入！')
    }

    // 6. 语法逻辑验证
    // 构建产生式字典
    const formulasDict: { [key: string]: string[] } = {}
    for (const production of productionList) {
      const [left, right] = production.split('->')
      if (right.includes('|')) {
        const rightList = right.split('|')
        if (!formulasDict[left]) formulasDict[left] = []
        rightList.forEach((r) => {
          if (!formulasDict[left].includes(r)) {
            formulasDict[left].push(r)
          }
        })
      } else {
        if (!formulasDict[left]) formulasDict[left] = []
        if (!formulasDict[left].includes(right)) {
          formulasDict[left].push(right)
        }
      }
    }

    // 检查所有非终结符都有定义
    const allVn = Array.from(new Set(productionList.join('').match(/[A-Z]/g) || []))
    for (const vn of allVn) {
      if (!formulasDict[vn]) {
        throw new Error(`Vn: ${vn}没有候选式！`)
      }
    }

    // 左递归检查
    const checkLeftRecursion = () => {
      const visited = new Set<string>()

      function hasLeftRecursion(vn: string): boolean {
        visited.add(vn)
        for (const str of formulasDict[vn]) {
          const symbol = str[0]
          if (visited.has(symbol)) return true
          if (/[A-Z]/.test(symbol) && formulasDict[symbol]) {
            if (hasLeftRecursion(symbol)) return true
          }
        }
        visited.delete(vn) // 回溯时移除
        return false
      }

      for (const vn of allVn) {
        visited.clear()
        if (hasLeftRecursion(vn)) {
          throw new Error('存在直接或间接左递归，请输入消除左递归后的文法！')
        }
      }
    }

    checkLeftRecursion()

    console.log('最终发送给后端的产生式数组:', productionList)
    console.log('=== validateAndFormatInput 处理完成 ===')

    return productionList
  }

  // 文法验证函数（从Merge版本移植）
  const validateGrammar = (inputText: string): { isValid: boolean; errorMessage: string; processedProductions: string[] } => {
    let errorMessage = ''
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
      processedProductions = processedText.split('\n').filter(item => item.trim() !== '')

      // 检查重复项
      const productionSet = new Set(processedProductions)
      if (processedProductions.length !== productionSet.size) {
        return { isValid: false, errorMessage: '产生式含重复项，请重新输入！', processedProductions: [] }
      }

      // 3. 产生式格式检查
      // 检查每个产生式
      for (let i = 0; i < processedProductions.length; i++) {
        const production = processedProductions[i]

        // 检查 -> 数量
        const arrowCount = (production.match(/->/g) || []).length
        if (arrowCount > 1) {
          return { isValid: false, errorMessage: `第${i + 1}行产生式包含多个"->"，格式错误！`, processedProductions: [] }
        }
        if (arrowCount === 0) {
          return { isValid: false, errorMessage: `第${i + 1}行产生式缺少"->"，格式错误！`, processedProductions: [] }
        }

        // 检查产生式格式：X->Y，其中X为大写字母，Y为任意字符（除|）和|分隔的序列
        const formatMatch = production.match(/^([A-Z])->((?:[^|]+\|)*[^|]+)$/)
        if (!formatMatch) {
          return { isValid: false, errorMessage: `第${i + 1}行产生式格式错误！应为"大写字母->右部"格式`, processedProductions: [] }
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
          return { isValid: false, errorMessage: `非终结符"${nonTerminal}"没有定义产生式！`, processedProductions: [] }
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
            return { isValid: false, errorMessage: '存在直接或间接左递归，请输入消除左递归后的文法！', processedProductions: [] }
          }
        }
      }

      // 7. 检查终结符连续出现
      for (let i = 0; i < processedProductions.length; i++) {
        const production = processedProductions[i]
        const [left, right] = production.split('->')
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
              return { isValid: false, errorMessage: `第${i + 1}行：终结符不能连续出现，如"${current}${next}"`, processedProductions: [] }
            }
          }
        }
      }

      return { isValid: true, errorMessage: '', processedProductions }

    } catch (error) {
      return { isValid: false, errorMessage: '文法验证过程中发生错误', processedProductions: [] }
    }
  }

  // 从原始输入文本执行LL1语法分析
  const performLL1AnalysisFromText = async (inputText: string) => {
    try {
      commonStore.setLoading(true)
      commonStore.clearError()

      // 状态重置逻辑 - 清空之前的分析结果
      originalData.value = null
      validationData.value = null
      inputAnalysisResult.value = null

      // 验证和格式化输入
      const productionList = validateAndFormatInput(inputText)

      // 更新 productions 状态
      productions.value = productionList

      // 使用验证和格式化后的数据发送请求
      const response = await getLL1AnalyseAPI(productionList)

      // 修复：后端返回的成功码是 0，不是 200
      if (response.data.code === 0 && response.data.data) {
        const rawData = response.data.data

        // 检查是否符合LL1文法
        if (!rawData.isLL1) {
          throw new Error('不符合LL1文法，请重新输入！')
        }

        originalData.value = rawData

        // 转换为校验数据
        validationData.value = transformToValidationData(rawData)

        return true
      } else {
        throw new Error(response.data.message || response.data.msg || 'LL1分析失败')
      }
    } catch (err) {
      commonStore.setError(err instanceof Error ? err.message : 'LL1分析请求失败')
      return false
    } finally {
      commonStore.setLoading(false)
    }
  }

  // 执行LL1语法分析（增强版，包含验证）
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
      validationData.value = null
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

        // 转换为校验数据
        validationData.value = transformToValidationData(rawData)

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
      return false
    }

    // 确保输入串以 # 结尾（LL1分析的结束符）
    if (!cleanedInputString.endsWith('#')) {
      cleanedInputString += '#'
      console.log('自动为输入串添加结束符 #:', cleanedInputString)
    }

    if (productions.value.length === 0) {
      commonStore.setError('请先设置产生式')
      return false
    }

    try {
      commonStore.setLoading(true)
      commonStore.clearError()

      // 使用清理后的字符串发送请求
      const response = await LL1AnalyseInpStrAPI(productions.value, cleanedInputString)

      if (response.data.code === 0 && response.data.data) {
        const responseData = response.data.data

        // 检查分析结果
        if (responseData.info_res !== 'Success!') {
          throw new Error('不是该文法的输入串，请重新输入！')
        }

        inputAnalysisResult.value = responseData
        return true
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
    validationData.value = null
    inputString.value = ''
    inputAnalysisResult.value = null
    commonStore.clearError()
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

  // 增强的Actions，添加历史记录功能
  const enhancedPerformLL1Analysis = async (processedProductions?: string[]) => {
    const success = await performLL1Analysis(processedProductions)
    if (success) {
      history.addToHistory(`LL1分析: ${productions.value.join(', ')}`)
    }
    return success
  }

  return {
    // 状态
    productions,
    originalData,
    validationData,
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
    performLL1Analysis: enhancedPerformLL1Analysis,
    performLL1AnalysisFromText, // 新增：从原始文本分析
    analyzeInputString,
    resetAll,

    // 工具方法
    transformToValidationData,
    validateAndFormatInput, // 新增：输入验证和格式化
    validateGrammar, // 新增：文法验证

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
