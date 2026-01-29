import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getDFAM } from '@/api'
import type { FAResult, DataFAType } from '@/types'
import { useCommonStore } from './common'
import { usePersistence, useMultiConfig, useHistory } from '@/composables/persistence'

/**
 * FA Store 持久化数据类型
 */
export interface FAStoreData {
  inputRegex: string
  // 画布数据
  canvasData: {
    step2?: {
      nodes: any[]
      edges: any[]
      timestamp: string
    }
    step4?: {
      nodes: any[]
      edges: any[]
      timestamp: string
    }
    step6?: {
      nodes: any[]
      edges: any[]
      timestamp: string
    }
  }
  // 03页面数据
  step3Data?: {
    userConversionTable: Record<string, string[]>
    userTransitionMatrix: Record<string, Record<string, string>>
    conversionTableRowCount: number
    timestamp: string
  }
  // 05页面数据
  step5Data?: {
    userPSets: Array<{
      id: string
      category: string
      state: string
      check: string
      text: string
    }>
    userMinimizedMatrix: Array<{
      id: string
      category: string
      check: string
      value: string
      rowIndex: number
      colIndex: number
      isRowHeader?: boolean
    }>
    timestamp: string
  }
}

export const useFAStore = defineStore('fa', () => {
  const commonStore = useCommonStore()

  // 状态
  const inputRegex = ref('')
  const originalData = ref<FAResult | null>(null) // 后端原始数据
  const validationData = ref<DataFAType | null>(null) // 前端校验数据

  // 画布数据状态
  const canvasData = ref<FAStoreData['canvasData']>({
    step2: undefined,
    step4: undefined,
    step6: undefined
  })

  // 03页面数据状态
  const step3Data = ref<FAStoreData['step3Data']>(undefined)
  // 05页面数据状态
  const step5Data = ref<FAStoreData['step5Data']>(undefined)

  // 计算属性 - 从原始数据提取
  const nfaTable = computed(() => originalData.value?.table || null)
  const dfaTable = computed(() => originalData.value?.table_to_num || null)
  const minDfaTable = computed(() => originalData.value?.table_to_num_min || null)
  const nfaDotString = computed(() => originalData.value?.NFA_dot_str || '')
  const dfaDotString = computed(() => originalData.value?.DFA_dot_str || '')
  const minDfaDotString = computed(() => originalData.value?.Min_DFA_dot_str || '')
  const partitions = computed(() => originalData.value?.P || null)
  const partitionChanges = computed(() => originalData.value?.P_change || null)

  // 数据转换方法 - 将后端原始数据转换为校验数据
  const transformToValidationData = (rawData: FAResult): DataFAType => {
    const data: DataFAType = {
      table: [],
      table_to_num: [],
      table_to_num_min: [],
      p_list: [],
    }

    // 转换NFA->DFA转换表数据
    if (rawData.table) {
      for (const [key, transitions] of Object.entries(rawData.table)) {
        if (Array.isArray(transitions)) {
          transitions.forEach((transition: any, index: number) => {
            data.table.push({
              id: 'table' + index + key,
              category: 'blank' as const,
              state: 'normal' as const,
              check: 'normal' as const,
              coords: [index.toString(), key],
              text: Array.isArray(transition) ? transition.join('') : String(transition),
            })
          })
        }
      }
    }

    // 转换DFA状态转换表数据
    if (rawData.table_to_num) {
      for (const [key, transitions] of Object.entries(rawData.table_to_num)) {
        if (Array.isArray(transitions)) {
          transitions.forEach((transition: any, index: number) => {
            data.table_to_num.push({
              id: 'table_to_num' + index + key,
              category: 'blank' as const,
              state: 'normal' as const,
              check: 'normal' as const,
              coords: [index.toString(), key],
              text: String(transition),
            })
          })
        }
      }
    }

    // 转换最小化DFA状态转换表数据
    if (rawData.table_to_num_min) {
      for (const [key, transitions] of Object.entries(rawData.table_to_num_min)) {
        if (Array.isArray(transitions)) {
          transitions.forEach((transition: any, index: number) => {
            data.table_to_num_min.push({
              id: 'table_to_num_min' + index + key,
              category: 'blank' as const,
              state: 'normal' as const,
              check: 'normal' as const,
              coords: [index.toString(), key],
              text: String(transition),
            })
          })
        }
      }
    }

    // 转换最小化结果集合数据
    if (rawData.P) {
      rawData.P.forEach((partition: string[], index: number) => {
        data.p_list.push({
          id: 'p_list' + index,
          category: 'onlyRead' as const,
          state: 'normal' as const,
          check: 'normal' as const,
          text: '{' + partition.join(', ') + '}',
        })
      })
    }

    return data
  }

  // Actions
  const setInputRegex = (regex: string) => {
    inputRegex.value = regex
    // 清除之前的分析结果
    originalData.value = null
    validationData.value = null
  }

  // 执行正则表达式转DFAM分析
  const performFAAnalysis = async () => {
    if (!inputRegex.value.trim()) {
      commonStore.setError('请输入正则表达式')
      return false
    }

    try {
      commonStore.setLoading(true)
      commonStore.clearError()
      
      // 清空所有之前的分析数据和用户数据
      clearAllStepData()

      const response = await getDFAM(inputRegex.value.trim())

      if (response.data.code === 0 && response.data.data) {
        const rawData = response.data.data
        originalData.value = rawData

        // 转换为校验数据
        validationData.value = transformToValidationData(rawData)

        return true
      } else {
        commonStore.setError(response.data.msg || '正则表达式分析失败')
        return false
      }
    } catch (err) {
      commonStore.setError(err instanceof Error ? err.message : '正则表达式分析请求失败')
      return false
    } finally {
      commonStore.setLoading(false)
    }
  }

  // 清除当前分析
  const clearAnalysis = () => {
    originalData.value = null
    validationData.value = null
  }
  
  // 清空所有步骤数据（用户输入和画布数据）
  const clearAllStepData = () => {
    // 清除分析结果
    clearAnalysis()
    
    // 清除所有画布数据
    clearCanvasData('step2')
    clearCanvasData('step4')
    clearCanvasData('step6')
    
    // 清除步骤3的数据
    clearStep3Data()
    
    // 清除步骤5的数据
    clearStep5Data()
  }

  // 重置所有状态
  const resetAll = () => {
    inputRegex.value = ''
    clearAllStepData() // 使用新的清除函数清空所有步骤数据
    commonStore.clearError()
  }

  // 保存画布数据
  const saveCanvasData = (step: 'step2' | 'step4' | 'step6', nodes: any[], edges: any[]) => {
    canvasData.value[step] = {
      nodes: JSON.parse(JSON.stringify(nodes)), // 深拷贝
      edges: JSON.parse(JSON.stringify(edges)), // 深拷贝
      timestamp: new Date().toISOString()
    }
    console.log(`保存${step}画布数据:`, canvasData.value[step])
  }

  // 加载画布数据
  const loadCanvasData = (step: 'step2' | 'step4' | 'step6') => {
    return canvasData.value[step]
  }

  // 清除特定步骤的画布数据
  const clearCanvasData = (step: 'step2' | 'step4' | 'step6') => {
    canvasData.value[step] = undefined
  }

  // 03页面数据操作方法
  const saveStep3Data = (
    userConversionTable: Record<string, string[]>,
    userTransitionMatrix: Record<string, Record<string, string>>,
    conversionTableRowCount: number
  ) => {
    step3Data.value = {
      userConversionTable: JSON.parse(JSON.stringify(userConversionTable)), // 深拷贝
      userTransitionMatrix: JSON.parse(JSON.stringify(userTransitionMatrix)), // 深拷贝
      conversionTableRowCount,
      timestamp: new Date().toISOString()
    }
  }

  const loadStep3Data = () => {
    return step3Data.value
  }

  const clearStep3Data = () => {
    step3Data.value = undefined
  }

  const saveStep5Data = (
    userPSets: Array<{
      id: string
      category: string
      state: string
      check: string
      text: string
    }>,
    userMinimizedMatrix: Array<{
      id: string
      category: string
      check: string
      value: string
      rowIndex: number
      colIndex: number
      isRowHeader?: boolean
    }>
  ) => {
    step5Data.value = {
      userPSets: JSON.parse(JSON.stringify(userPSets)), // 深拷贝
      userMinimizedMatrix: JSON.parse(JSON.stringify(userMinimizedMatrix)), // 深拷贝
      timestamp: new Date().toISOString()
    }
  }

  const loadStep5Data = () => {
    return step5Data.value
  }

  const clearStep5Data = () => {
    step5Data.value = undefined
  }

  // 检查是否有分析结果
  const hasResult = () => {
    return originalData.value !== null
  }

  // 获取指定类型的dot字符串
  const getDotString = (type: 'nfa' | 'dfa' | 'min-dfa') => {
    switch (type) {
      case 'nfa':
        return nfaDotString.value
      case 'dfa':
        return dfaDotString.value
      case 'min-dfa':
        return minDfaDotString.value
      default:
        return ''
    }
  }

  // 获取指定类型的状态转换表
  const getTable = (type: 'nfa' | 'dfa' | 'min-dfa') => {
    switch (type) {
      case 'nfa':
        return nfaTable.value
      case 'dfa':
        return dfaTable.value
      case 'min-dfa':
        return minDfaTable.value
      default:
        return null
    }
  }

  // 获取指定类型的校验数据
  const getValidationTable = (type: 'table' | 'table_to_num' | 'table_to_num_min' | 'p_list') => {
    if (!validationData.value) return []
    return validationData.value[type]
  }

  // 配置持久化
  const persistenceConfig = {
    key: 'fa_store',
    version: '1.0.0',
    include: ['inputRegex', 'canvasData', 'step3Data', 'step5Data'],
    autoSave: true,
    ttl: 7 * 24 * 60 * 60 * 1000, // 7天
    saveDelay: 500,
  }

  // 应用持久化功能
  const persistence = usePersistence({
    store: {
      inputRegex,
      canvasData,
      step3Data,
      step5Data,
    },
    ...persistenceConfig,
  })

  // 多配置管理
  const multiConfig = useMultiConfig({
    store: {
      inputRegex,
    },
    configKey: 'fa',
  })

  // 历史记录管理
  const history = useHistory({
    store: {
      inputRegex,
    },
    historyKey: 'fa',
    maxHistory: 10,
    autoSave: true,
  })

  // 增强的Actions，添加历史记录功能
  const enhancedPerformFAAnalysis = async () => {
    const success = await performFAAnalysis()
    if (success) {
      history.addToHistory(`FA分析: ${inputRegex.value}`)
    }
    return success
  }

  return {
    // 状态
    inputRegex,
    originalData,
    validationData,
    canvasData,

    // 计算属性
    nfaTable,
    dfaTable,
    minDfaTable,
    nfaDotString,
    dfaDotString,
    minDfaDotString,
    partitions,
    partitionChanges,

    // Actions
    setInputRegex,
    performFAAnalysis: enhancedPerformFAAnalysis,
    clearAnalysis,
    clearAllStepData,
    resetAll,

    // 画布数据管理
    saveCanvasData,
    loadCanvasData,
    clearCanvasData,

    // 03页面数据管理
    saveStep3Data,
    loadStep3Data,
    clearStep3Data,

    // 05页面数据管理
    saveStep5Data,
    loadStep5Data,
    clearStep5Data,

    // 辅助方法
    hasResult,
    getDotString,
    getTable,
    getValidationTable,
    transformToValidationData,

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
