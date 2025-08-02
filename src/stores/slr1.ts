import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getSLR1AnalyseAPI, SLR1AnalyseInpStrAPI } from '@/api'
import type { SLR1AnalysisResult, SLR1ValidationItem, AnalysisStepInfo } from '@/types'
import { useCommonStore } from './common'
import { usePersistence, useMultiConfig, useHistory } from '@/composables/persistence'
import { useSLR1AnimationStore } from '@/animation/store'

/**
 * SLR1 Store 持久化数据类型
 */
export interface SLR1StoreData {
  productions: string[]
  inputString: string
}

export const useSLR1Store = defineStore('slr1', () => {
  const commonStore = useCommonStore()

  // 基本状态
  const productions = ref<string[]>([])
  const analysisResult = ref<SLR1AnalysisResult | null>(null)
  const inputString = ref('')
  const inputAnalysisResult = ref<AnalysisStepInfo | null>(null)

  // 校验数据 - 用于前端显示和交互
  const validationData = ref<SLR1ValidationItem[]>([])
  const actionTable = ref<Record<string, string>>({})
  const gotoTable = ref<Record<string, string>>({})
  const dfaStates = ref<Record<string, unknown>[]>([])
  const dotItems = ref<string[]>([])
  const isSLR1Grammar = ref<boolean | null>(null)

  // DOT字符串用于图形显示
  const dotString = ref('')

  // FIRST和FOLLOW集
  const firstSets = ref<Record<string, string[]>>({})
  const followSets = ref<Record<string, string[]>>({})

  // Actions
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
    analysisResult.value = null
    inputAnalysisResult.value = null
    validationData.value = []
    actionTable.value = {}
    gotoTable.value = {}
    dfaStates.value = []
    dotItems.value = []
    isSLR1Grammar.value = null
    dotString.value = ''
    firstSets.value = {}
    followSets.value = {}
  }

  // 将后端数据转换为校验数据
  const transformToValidationData = (result: SLR1AnalysisResult): SLR1ValidationItem[] => {
    const items: SLR1ValidationItem[] = []
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
        data: { dfa },
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

  // 执行SLR1语法分析
  const performSLR1Analysis = async () => {
    if (productions.value.length === 0) {
      commonStore.setError('请至少输入一个产生式')
      return false
    }

    try {
      commonStore.setLoading(true)
      commonStore.clearError()

      const response = await getSLR1AnalyseAPI(productions.value)

      // 添加调试日志
      console.log('SLR1 API Response:', response)
      console.log('Response data:', response.data)
      console.log('Response status:', response.status)

      // 检查响应是否成功 - 后端返回 code: 0 表示成功
      if (response.status === 200 && response.data && response.data.code === 0) {
        const result = response.data.data as SLR1AnalysisResult

        console.log('Parsed result:', result)

        if (result && result.S) {
          analysisResult.value = result

          // 添加后端数据调试日志
          console.log('=== SLR1 后端返回数据调试 ===')
          console.log('后端返回的 actions:', result.actions)
          console.log('后端返回的 gotos:', result.gotos)
          console.log('actions 类型:', typeof result.actions)
          console.log('gotos 类型:', typeof result.gotos)

          if (result.actions) {
            console.log('actions 键值示例:')
            Object.entries(result.actions)
              .slice(0, 5)
              .forEach(([key, value]) => {
                console.log(`  ${key} => ${value}`)
              })
          }

          if (result.gotos) {
            console.log('gotos 键值示例:')
            Object.entries(result.gotos)
              .slice(0, 5)
              .forEach(([key, value]) => {
                console.log(`  ${key} => ${value}`)
              })
          }

          // 更新相关状态
          actionTable.value = result.actions || {}
          gotoTable.value = result.gotos || {}
          // dfaStates.value = result.all_dfa || []
          dfaStates.value = result.all_dfa.map((item) => {
            return {
              id: 'Item' + item.id,
              pros: item.pros.map((x: string, idx: number) => {
                return {
                  id: 'Item' + item.id + '_pro' + idx,
                  text: x,
                }
              }),
              next_ids: item.next_ids,
            }
          })
          dotItems.value = result.dot_items || []
          isSLR1Grammar.value = result.isSLR1 ?? null
          dotString.value = result.SLR1_dot_str || ''

          // 更新FIRST和FOLLOW集
          firstSets.value = result.first || {}
          followSets.value = result.follow || {}

          console.log('FIRST集:', firstSets.value)
          console.log('FOLLOW集:', followSets.value)

          console.log('dfaStates', dfaStates)

          // 转换为校验数据
          validationData.value = transformToValidationData(result)

          return true
        } else {
          console.error('Invalid analysis result structure:', result)
          commonStore.setError('分析结果格式错误')
          return false
        }
      } else {
        // 处理后端返回的错误
        const errorMsg =
          response.data?.message || response.data?.msg || `分析失败 (code: ${response.data?.code})`
        console.error('SLR1 Analysis failed:', errorMsg, response.data)
        commonStore.setError(errorMsg)
        return false
      }
    } catch (err) {
      console.error('SLR1 Analysis Error:', err)
      commonStore.setError(err instanceof Error ? err.message : 'SLR1分析请求失败')
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

      // 处理输入字符串：移除用户输入的#，让后端自动添加
      const processedInput = inputString.value.trim().replace(/#/g, '')

      // 打印发送给后端的数据
      console.log('=== SLR1输入串分析请求数据 ===')
      console.log('产生式数组:', productions.value)
      console.log('原始输入字符串:', inputString.value.trim())
      console.log('处理后输入字符串:', processedInput)
      console.log('请求参数:', { inpProductions: productions.value, inpStr: processedInput })

      const response = await SLR1AnalyseInpStrAPI(productions.value, processedInput)

      // 打印后端响应数据
      console.log('=== SLR1输入串分析响应数据 ===')
      console.log('响应状态:', response.status)
      console.log('响应数据:', response.data)
      console.log('响应code:', response.data?.code)
      console.log('响应message:', response.data?.message || response.data?.msg)

      // 检查响应是否成功 - 后端返回 code: 0 表示成功
      if (response.status === 200 && response.data && response.data.code === 0) {
        const result = response.data.data
        if (result) {
          inputAnalysisResult.value = result
          console.log('===== SLR1 输入串分析结果 =====')
          console.log('输入串:', processedInput)
          console.log('分析结果数据:', inputAnalysisResult.value)
          console.log('=====================================')

          // 自动解析动画数据
          try {
            const animationStore = useSLR1AnimationStore()
            await animationStore.parseAnimationData(result)
            console.log('SLR1动画数据解析成功')
          } catch (animationError) {
            console.warn('SLR1动画数据解析失败:', animationError)
            // 动画解析失败不影响主要的分析功能
          }

          return true
        } else {
          commonStore.setError('输入串分析结果为空')
          return false
        }
      } else {
        const errorMsg =
          response.data?.message ||
          response.data?.msg ||
          `输入串分析失败 (code: ${response.data?.code})`
        commonStore.setError(errorMsg)
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
  const getValidationDataByCategory = (category: SLR1ValidationItem['category']) => {
    return validationData.value.filter((item) => item.category === category)
  }

  // 重置所有状态
  const resetAll = () => {
    productions.value = []
    inputString.value = ''
    clearAnalysisResults()
    commonStore.clearError()

    // 清空动画数据
    const animationStore = useSLR1AnimationStore()
    animationStore.clearAnimationData()
  }

  // 配置持久化
  const persistenceConfig = {
    key: 'slr1_store',
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
    configKey: 'slr1',
  })

  // 历史记录管理
  const history = useHistory({
    store: {
      productions,
      inputString,
    },
    historyKey: 'slr1',
    maxHistory: 10,
    autoSave: true,
  })

  // 增强的Actions，添加历史记录功能
  const enhancedPerformSLR1Analysis = async () => {
    const success = await performSLR1Analysis()
    if (success) {
      history.addToHistory(`SLR1分析: ${productions.value.join(', ')}`)
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
    isSLR1Grammar,
    dotString,
    firstSets,
    followSets,

    // Actions
    setProductions,
    addProduction,
    removeProduction,
    clearProductions,
    setInputString,
    performSLR1Analysis: enhancedPerformSLR1Analysis,
    analyzeInputString,
    updateValidationItem,
    getValidationDataByCategory,
    resetAll,

    // 动画相关
    getAnimationStore: () => useSLR1AnimationStore(),

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
