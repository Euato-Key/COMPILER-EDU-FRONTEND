import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getDFAM } from '@/api'
import type { FAResult, DataFAType } from '@/types'
import { useCommonStore } from './common'
import { usePersistence } from '@/composables/persistence'

const maxHistoryRecords = 50

// ================= 类型定义 =================

/**
 * 错误记录项：用于 PDF 导出对比和 AI 分析
 */
export interface FAErrorLog {
  id: string
  step: 'step3' | 'step5'
  tableType: 'conversionTable' | 'transitionMatrix' | 'pSets' | 'minimizedMatrix'
  location: {
    row: number       // 行索引
    col?: string      // 列名 (pSets可不传)
    fieldKey: string  // 原始字段标识，如 "matrix-0-Ia"
  }
  wrongValue: string  // 学生填错的内容
  correctValue: string // 标准答案
  timestamp: string   // 记录时间
}

/**
 * FA Store 用户正在操作的数据类型 (画布、表格等)
 */
export interface FAStoreData {
  inputRegex: string
  // 画布数据 (Step 2, 4, 6)
  canvasData: {
    step2?: { nodes: any[]; edges: any[]; timestamp: string }
    step4?: { nodes: any[]; edges: any[]; timestamp: string }
    step6?: { nodes: any[]; edges: any[]; timestamp: string }
  }
  // 03页面表格数据
  step3Data?: {
    userConversionTable: Record<string, string[]>
    userTransitionMatrix: Record<string, Record<string, string>>
    conversionTableRowCount: number
    timestamp: string
  }
  // 05页面最小化数据
  step5Data?: {
    userPSets: Array<{ id: string; category: string; state: string; check: string; text: string }>
    userMinimizedMatrix: Array<{ id: string; category: string; check: string; value: string; rowIndex: number; colIndex: number; isRowHeader?: boolean }>
    timestamp: string
  }
}

/**
 * 历史记录单条结构
 */
export interface FAHistoryRecord {
  id: string             // 唯一标识
  createdAt: string      // 创建时间
  timestamp: string      // 最后修改时间
  regex: string          // 正则表达式
  errorLogs: FAErrorLog[] // 错误轨迹记录
  userData: {
    canvasData: FAStoreData['canvasData']
    step3Data: FAStoreData['step3Data']
    step5Data: FAStoreData['step5Data']
  }
}

// ================= Store 定义 =================

export const useFAStore = defineStore('fa', () => {
  const commonStore = useCommonStore()

  // ------------------------------------------
  // 1. 状态 (State)
  // ------------------------------------------

  // === 核心标识：当前正在编辑的记录ID ===
  // null 表示这是一个新开的、未保存的会话
  const currentRecordId = ref<string | null>(null)

  // === 当前激活的会话数据 (Active Session) ===
  const inputRegex = ref('')
  const originalData = ref<FAResult | null>(null) // 后端原始数据 (不持久化)
  const validationData = ref<DataFAType | null>(null) // 前端校验数据 (不持久化)

  const canvasData = ref<FAStoreData['canvasData']>({
    step2: undefined,
    step4: undefined,
    step6: undefined
  })
  const step3Data = ref<FAStoreData['step3Data']>(undefined)
  const step5Data = ref<FAStoreData['step5Data']>(undefined)

  // === 错误日志状态 (Active Session Error Logs) ===
  const errorLogs = ref<FAErrorLog[]>([])
  // === 历史记录列表 (History Archive) ===
  const historyList = ref<FAHistoryRecord[]>([])

  // ------------------------------------------
  // 2. 计算属性 (Computed)
  // ------------------------------------------
  const nfaTable = computed(() => originalData.value?.table || null)
  const dfaTable = computed(() => originalData.value?.table_to_num || null)
  const minDfaTable = computed(() => originalData.value?.table_to_num_min || null)
  const nfaDotString = computed(() => originalData.value?.NFA_dot_str || '')
  const dfaDotString = computed(() => originalData.value?.DFA_dot_str || '')
  const minDfaDotString = computed(() => originalData.value?.Min_DFA_dot_str || '')
  const partitions = computed(() => originalData.value?.P || null)
  const partitionChanges = computed(() => originalData.value?.P_change || null)

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

  const transformToValidationData = (rawData: FAResult): DataFAType => {
    const data: DataFAType = {
      table: [],
      table_to_num: [],
      table_to_num_min: [],
      p_list: [],
    }
    // ... (保留原有的转换逻辑) ...
    if (rawData.table) {
      for (const [key, transitions] of Object.entries(rawData.table)) {
        if (Array.isArray(transitions)) {
          transitions.forEach((transition: any, index: number) => {
            // 'S' 列是只读的，不需要用户填写
            // 对于其他列，第一行是状态名称，也是只读的
            const category = key === 'S' ? 'onlyRead' : (index === 0 ? 'onlyRead' : 'blank')
            data.table.push({
              id: 'table' + index + key,
              category: category,
              state: 'normal',
              check: 'normal',
              coords: [index.toString(), key],
              text: Array.isArray(transition) ? transition.join('') : String(transition),
            })
          })
        }
      }
    }
    if (rawData.table_to_num) {
      for (const [key, transitions] of Object.entries(rawData.table_to_num)) {
        if (Array.isArray(transitions)) {
          transitions.forEach((transition: any, index: number) => {
            // 'S' 列是只读的，不需要用户填写
            // 对于其他列，第一行是状态名称，也是只读的
            const category = key === 'S' ? 'onlyRead' : (index === 0 ? 'onlyRead' : 'blank')
            data.table_to_num.push({
              id: 'table_to_num' + index + key,
              category: category,
              state: 'normal',
              check: 'normal',
              coords: [index.toString(), key],
              text: String(transition),
            })
          })
        }
      }
    }
    if (rawData.table_to_num_min) {
      for (const [key, transitions] of Object.entries(rawData.table_to_num_min)) {
        if (Array.isArray(transitions)) {
          transitions.forEach((transition: any, index: number) => {
            // 'S' 列是只读的，不需要用户填写
            // 对于其他列，第一行是状态名称，也是只读的
            const category = key === 'S' ? 'onlyRead' : (index === 0 ? 'onlyRead' : 'blank')
            data.table_to_num_min.push({
              id: 'table_to_num_min' + index + key,
              category: category,
              state: 'normal',
              check: 'normal',
              coords: [index.toString(), key],
              text: String(transition),
            })
          })
        }
      }
    }
    if (rawData.P) {
      rawData.P.forEach((partition: string[], index: number) => {
        data.p_list.push({
          id: 'p_list' + index,
          category: 'blank',
          state: 'normal',
          check: 'normal',
          text: '{' + partition.join(', ') + '}',
        })
      })
    }
    return data
  }

  // ------------------------------------------
  // 4. API 交互 Actions
  // ------------------------------------------

  const performFAAnalysis = async (isRestoring = false) => {
    if (!inputRegex.value.trim()) {
      commonStore.setError('请输入正则表达式')
      return false
    }

    try {
      commonStore.setLoading(true)
      commonStore.clearError()

      // 如果不是正在复现历史，则清空当前数据
      if (!isRestoring) {
        clearAllStepData()
        // ==================== 新增这一行 ====================
        // 关键修复：只要是重新分析（非复现），就视为新会话，
        // 强制断开与当前 ID 的关联，这样 saveToHistory 才会生成新 ID
        currentRecordId.value = null
        // ===================================================
      }

      const response = await getDFAM(inputRegex.value.trim())

      if (response.data.code === 0 && response.data.data) {
        const rawData = response.data.data
        originalData.value = rawData
        // 实时计算校验数据
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

  // ------------------------------------------
  // 5. 历史记录管理 Actions (已更新逻辑)
  // ------------------------------------------

  /**
   * 保存/更新当前答题状态到历史记录
   * 逻辑：
   * 1. 如果 currentRecordId 为空 -> 创建新记录 -> 插入列表 -> 更新 currentRecordId
   * 2. 如果 currentRecordId 有值 -> 找到该记录 -> 更新其内容和时间戳
   */
  const saveToHistory = () => {
    if (!inputRegex.value || !originalData.value) {
      // 这里的 error log 可以保留，但不要弹窗报错，因为可能是静默保存
      console.warn('当前没有有效数据，无法保存')
      return
    }

    const nowTime = new Date().toLocaleString()

    // ==================== 修改开始 ====================
    // 修复：JSON.stringify(undefined) 会导致 JSON.parse 报错
    // 我们需要先判断 value 是否存在，存在才进行深拷贝，否则保持 undefined
    const snapshotData = {
      canvasData: canvasData.value ? JSON.parse(JSON.stringify(canvasData.value)) : undefined,
      step3Data: step3Data.value ? JSON.parse(JSON.stringify(step3Data.value)) : undefined,
      step5Data: step5Data.value ? JSON.parse(JSON.stringify(step5Data.value)) : undefined
    }
    // ==================== 修改结束 ====================
    // 深拷贝错误日志
    const snapshotErrors = JSON.parse(JSON.stringify(errorLogs.value))

    if (currentRecordId.value) {
      // === 更新已有记录 ===
      const index = historyList.value.findIndex(item => item.id === currentRecordId.value)
      if (index !== -1) {
        historyList.value[index].timestamp = nowTime
        historyList.value[index].regex = inputRegex.value
        historyList.value[index].errorLogs = snapshotErrors
        historyList.value[index].userData = snapshotData as any // 类型断言，避免TS过于严格的检查

        // 把更新后的这条移到最前面
        const updatedRecord = historyList.value.splice(index, 1)[0]
        historyList.value.unshift(updatedRecord)

        console.log(`[FA Store] 更新历史记录: ${currentRecordId.value}`)
      } else {
        currentRecordId.value = null
        saveToHistory()
      }
    } else {
      // === 新增记录 ===
      const newId = generateUniqueId()
      const newRecord: FAHistoryRecord = {
        id: newId,
        createdAt: nowTime,
        timestamp: nowTime,
        regex: inputRegex.value,
        errorLogs: snapshotErrors,
        userData: snapshotData as any
      }

      historyList.value.unshift(newRecord)
      currentRecordId.value = newId

      if (historyList.value.length > maxHistoryRecords) {
        historyList.value = historyList.value.slice(0, maxHistoryRecords)
      }
      console.log(`[FA Store] 新建历史记录: ${newId}`)
    }
  }

  /**
   * 从历史记录复现
   */
  const restoreFromHistory = async (recordId: string) => {
    const record = historyList.value.find(item => item.id === recordId)
    if (!record) {
      commonStore.setError('找不到该历史记录')
      return false
    }

    // 1. 设置当前ID (标记我们正在查看旧记录)
    currentRecordId.value = recordId

    // 2. 恢复正则
    inputRegex.value = record.regex

    // 3. 请求后端 (获取背景数据)
    // 传入 true 表示这是复现操作，不要清空当前已有的 userData，因为我们要手动覆盖它
    const isSuccess = await performFAAnalysis(true)

    if (isSuccess) {
      // === 核心修复点：安全地覆盖用户数据 ===
      // 在 JSON.parse 之前先判断记录中是否存在该数据

      if (record.userData.canvasData) {
        canvasData.value = JSON.parse(JSON.stringify(record.userData.canvasData))
      } else {
        // 如果记录里没有画布数据，则初始化为空
        canvasData.value = { step2: undefined, step4: undefined, step6: undefined }
      }

      if (record.userData.step3Data) {
        step3Data.value = JSON.parse(JSON.stringify(record.userData.step3Data))
      } else {
        step3Data.value = undefined
      }

      if (record.userData.step5Data) {
        step5Data.value = JSON.parse(JSON.stringify(record.userData.step5Data))
      } else {
        step5Data.value = undefined
      }

      console.log(`[FA Store] 历史记录已成功安全复现: ${recordId}`)
      return true
    } else {
      commonStore.setError('无法复现：后端数据请求失败')
      return false
    }
  }

  const deleteHistoryRecord = (recordId: string) => {
    historyList.value = historyList.value.filter(item => item.id !== recordId)

    // 如果删除的是当前正在看的记录，执行深度重置
    if (currentRecordId.value === recordId) {
      resetAll()
      console.log(`[FA Store] 当前记录已删除并重置状态`)
    }
  }

  const clearAllHistory = () => {
    historyList.value = []
    resetAll()
    console.log(`[FA Store] 所有历史记录已清空并重置状态`)
  }

  // ------------------------------------------
  // 6. 普通数据管理 Actions
  // ------------------------------------------

  /**
   * 记录错误日志
   * @param log 错误信息 (不含ID和时间戳)
   */
  const addErrorLog = (log: Omit<FAErrorLog, 'id' | 'timestamp'>) => {
    // 避免在极短时间内重复记录完全相同的错误
    const isDuplicate = errorLogs.value.some(item =>
      item.step === log.step &&
      item.tableType === log.tableType &&
      item.location.fieldKey === log.location.fieldKey &&
      item.wrongValue === log.wrongValue
    )

    if (!isDuplicate) {
      errorLogs.value.push({
        ...log,
        id: generateUniqueId(),
        timestamp: new Date().toLocaleString()
      })
      console.log(`[FA Store] 记录错误: ${log.location.fieldKey} -> ${log.wrongValue}`)
    }
  }

  const setInputRegex = (regex: string) => {
    inputRegex.value = regex
    originalData.value = null
    validationData.value = null
    // 注意：修改正则不代表就是新会话，只有 resetAll 才是完全的新会话
    // 但如果用户修改了正则，通常意味着逻辑变了，建议视为新开始，或者保留ID等待用户点保存时更新
  }

  const clearAnalysis = () => {
    originalData.value = null
    validationData.value = null
  }

  const clearAllStepData = () => {
    clearAnalysis()
    clearCanvasData('step2')
    clearCanvasData('step4')
    clearCanvasData('step6')
    clearStep3Data()
    clearStep5Data()
    errorLogs.value = [] // 清空错误日志
  }

  /**
   * 重置所有状态（相当于点击了"新建答题"）
   */
  const resetAll = () => {
    inputRegex.value = ''
    clearAllStepData()
    commonStore.clearError()
    // 关键：ID置空，表示这是新会话
    currentRecordId.value = null
  }

  // --- 画布/表格操作 (保持不变) ---
  const saveCanvasData = (step: 'step2' | 'step4' | 'step6', nodes: any[], edges: any[]) => {
    canvasData.value[step] = {
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
      timestamp: new Date().toISOString()
    }
  }
  const loadCanvasData = (step: 'step2' | 'step4' | 'step6') => canvasData.value[step]
  const clearCanvasData = (step: 'step2' | 'step4' | 'step6') => { canvasData.value[step] = undefined }

  const saveStep3Data = (userConversionTable: any, userTransitionMatrix: any, conversionTableRowCount: number) => {
    step3Data.value = {
      userConversionTable: JSON.parse(JSON.stringify(userConversionTable)),
      userTransitionMatrix: JSON.parse(JSON.stringify(userTransitionMatrix)),
      conversionTableRowCount,
      timestamp: new Date().toISOString()
    }
  }
  const loadStep3Data = () => step3Data.value
  const clearStep3Data = () => { step3Data.value = undefined }

  const saveStep5Data = (userPSets: any, userMinimizedMatrix: any) => {
    step5Data.value = {
      userPSets: JSON.parse(JSON.stringify(userPSets)),
      userMinimizedMatrix: JSON.parse(JSON.stringify(userMinimizedMatrix)),
      timestamp: new Date().toISOString()
    }
  }
  const loadStep5Data = () => step5Data.value
  const clearStep5Data = () => { step5Data.value = undefined }

  const hasResult = () => originalData.value !== null
  const getValidationTable = (type: 'table' | 'table_to_num' | 'table_to_num_min' | 'p_list') => {
    if (!validationData.value) return []
    return validationData.value[type]
  }

  // ------------------------------------------
  // 7. 持久化配置
  // ------------------------------------------

  const persistenceConfig = {
    key: 'fa_store_v4', // 升级版本号
    version: '4.0.0',
    // 必须包含 currentRecordId，这样刷新页面后，系统还知道你正在编辑哪条记录
    include: [
      'currentRecordId',
      'inputRegex',
      'canvasData',
      'step3Data',
      'step5Data',
      'errorLogs', // 包含错误日志
      'historyList'
    ],
    autoSave: true,
    saveDelay: 500,
  }

  const persistence = usePersistence({
    store: {
      currentRecordId, // 托管 ID
      inputRegex,
      canvasData,
      step3Data,
      step5Data,
      errorLogs, // 托管错误日志
      historyList,
    },
    ...persistenceConfig,
  })

  return {
    // State
    currentRecordId, // 暴露给组件，用于判断显示"保存"还是"更新"按钮
    isNewSession,    // 计算属性：是否是新会话
    inputRegex,
    originalData,
    validationData,
    canvasData,
    errorLogs, // 暴露错误日志
    historyList,

    // Computed
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
    performFAAnalysis,
    clearAllStepData,
    resetAll,
    saveToHistory,
    restoreFromHistory,
    deleteHistoryRecord,
    clearAllHistory,
    addErrorLog, // 暴露记录错误的方法
    saveCanvasData,
    loadCanvasData,
    clearCanvasData,
    saveStep3Data,
    loadStep3Data,
    saveStep5Data,
    loadStep5Data,
    hasResult,
    getValidationTable,

    // Persistence
    persistence: {
      save: persistence.save,
      load: persistence.load,
      clear: persistence.clear,
    },
  }
})
