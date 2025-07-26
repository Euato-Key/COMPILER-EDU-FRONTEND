import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getLR0AnalyseAPI, LR0AnalyseInpStrAPI } from '@/api'
import type { LR0AnalysisResult, LR0ValidationItem, AnalysisStepInfo } from '@/types'
import { useCommonStore } from './common'
import { usePersistence, useMultiConfig, useHistory } from '@/composables/persistence'

/**
 * LR0 Store 持久化数据类型
 */
export interface LR0StoreData {
  productions: string[]
  inputString: string
}

export const useLR0Store = defineStore('lr0', () => {
  const commonStore = useCommonStore()

  // 基本状态
  const productions = ref<string[]>([])
  const analysisResult = ref<LR0AnalysisResult | null>(null)
  const inputString = ref('')
  const inputAnalysisResult = ref<AnalysisStepInfo | null>(null)

  // 校验数据 - 用于前端显示和交互
  const validationData = ref<LR0ValidationItem[]>([])
  const actionTable = ref<Record<string, string>>({})
  const gotoTable = ref<Record<string, string>>({})
  const dfaStates = ref<any[]>([])
  const dotItems = ref<string[]>([])
  const isLR0Grammar = ref<boolean | null>(null)

  // DOT字符串用于图形显示
  const dotString = ref('')

  // Actions
  const setProductions = (newProductions: string[]) => {
    productions.value = [...newProductions]
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
    analysisResult.value = null
    inputAnalysisResult.value = null
    validationData.value = []
    actionTable.value = {}
    gotoTable.value = {}
    dfaStates.value = []
    dotItems.value = []
    isLR0Grammar.value = null
    dotString.value = ''
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

  // 执行LR0语法分析
  const performLR0Analysis = async () => {
    if (productions.value.length === 0) {
      commonStore.setError('请至少输入一个产生式')
      return false
    }

    try {
      commonStore.setLoading(true)
      commonStore.clearError()

      const response = await getLR0AnalyseAPI(productions.value)

      if (response.data.code === 200 && response.data.data) {
        const result = response.data.data
        analysisResult.value = result

        // 更新相关状态
        actionTable.value = result.actions || {}
        gotoTable.value = result.gotos || {}
        dfaStates.value = result.all_dfa || []
        dotItems.value = result.dot_items || []
        isLR0Grammar.value = result.isLR0 ?? null
        dotString.value = result.LR0_dot_str || ''

        // 转换为校验数据
        validationData.value = transformToValidationData(result)

        return true
      } else {
        commonStore.setError(response.data.message || response.data.msg || 'LR0分析失败')
        return false
      }
    } catch (err) {
      commonStore.setError(err instanceof Error ? err.message : 'LR0分析请求失败')
      return false
    } finally {
      commonStore.setLoading(false)
    }
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

      const response = await LR0AnalyseInpStrAPI(productions.value, inputString.value.trim())

      if (response.data.code === 200 && response.data.data) {
        inputAnalysisResult.value = response.data.data
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

  // 更新校验项状态
  const updateValidationItem = (id: string, check: boolean) => {
    const item = validationData.value.find((item) => item.id === id)
    if (item) {
      item.check = check
    }
  }

  // 获取指定类别的校验数据
  const getValidationDataByCategory = (category: LR0ValidationItem['category']) => {
    return validationData.value.filter((item) => item.category === category)
  }

  // 重置所有状态
  const resetAll = () => {
    productions.value = []
    inputString.value = ''
    clearAnalysisResults()
    commonStore.clearError()
  }

  // 配置持久化
  const persistenceConfig = {
    key: 'lr0_store',
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
    configKey: 'lr0',
  })

  // 历史记录管理
  const history = useHistory({
    store: {
      productions,
      inputString,
    },
    historyKey: 'lr0',
    maxHistory: 10,
    autoSave: true,
  })

  // 增强的Actions，添加历史记录功能
  const enhancedPerformLR0Analysis = async () => {
    const success = await performLR0Analysis()
    if (success) {
      history.addToHistory(`LR0分析: ${productions.value.join(', ')}`)
    }
    return success
  }

  return {
    // 状态
    productions,
    analysisResult,
    inputString,
    inputAnalysisResult,
    validationData,
    actionTable,
    gotoTable,
    dfaStates,
    dotItems,
    isLR0Grammar,
    dotString,

    // Actions
    setProductions,
    addProduction,
    removeProduction,
    clearProductions,
    setInputString,
    performLR0Analysis: enhancedPerformLR0Analysis,
    analyzeInputString,
    updateValidationItem,
    getValidationDataByCategory,
    resetAll,

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
