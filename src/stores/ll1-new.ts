import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getLL1AnalyseAPI, LL1AnalyseInpStrAPI } from '@/api'
import type { LL1AnalysisResult, AnalysisStepInfo } from '@/types/ll1'
import { useCommonStore } from './common'
import { usePersistence } from '@/composables/persistence'
import { useLL1AnimationStore } from '@/animation/store'

const maxHistoryRecords = 50

// ================= 类型定义 =================

/**
 * LL1 Store 用户正在操作的数据类型
 */
export interface LL1StoreData {
    productions: string[]
    inputString: string
    // 02页面：First/Follow集数据
    step2Data?: {
        userFirstSets: Record<string, string>
        userFollowSets: Record<string, string>
        timestamp: string
    }
    // 03页面：LL1分析表构建数据
    step3Data?: {
        userTable: Record<string, string>
        timestamp: string
    }
    // 04页面：输入串分析步骤数据
    step4Data?: {
        userSteps: Array<{ stack: string; input: string }>
        timestamp: string
    }
}

/**
 * 历史记录单条结构
 */
export interface LL1HistoryRecord {
    id: string             // 唯一标识
    createdAt: string      // 创建时间
    timestamp: string      // 最后修改时间
    grammar: string        // 文法内容 (用于显示)
    productions: string[]  // 产生式列表
    userData: {
        inputString: string
        step2Data: LL1StoreData['step2Data']
        step3Data: LL1StoreData['step3Data']
        step4Data: LL1StoreData['step4Data']
    }
}

// ================= Store 定义 =================

export const useLL1Store = defineStore('ll1', () => {
    const commonStore = useCommonStore()

    // ------------------------------------------
    // 1. 状态 (State)
    // ------------------------------------------

    // === 核心标识：当前正在编辑的记录ID ===
    const currentRecordId = ref<string | null>(null)

    // === 当前激活的会话数据 (Active Session) ===
    const productions = ref<string[]>([])
    const inputString = ref('')
    const originalData = ref<LL1AnalysisResult | null>(null) // 后端原始数据 (不持久化)
    const inputAnalysisResult = ref<AnalysisStepInfo | null>(null) // 输入串分析结果 (不持久化)

    // 用户答题数据
    const step2Data = ref<LL1StoreData['step2Data']>(undefined)
    const step3Data = ref<LL1StoreData['step3Data']>(undefined)
    const step4Data = ref<LL1StoreData['step4Data']>(undefined)

    // === 历史记录列表 (History Archive) ===
    const historyList = ref<LL1HistoryRecord[]>([])

    // ------------------------------------------
    // 2. 计算属性 (Computed)
    // ------------------------------------------
    const grammar = computed(() => productions.value.join('\n'))
    const parseTable = computed(() => originalData.value?.table || {})
    const firstSets = computed(() => originalData.value?.first || {})
    const followSets = computed(() => originalData.value?.follow || {})
    const isLL1Grammar = computed(() => originalData.value?.isLL1 ?? null)

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

    // 文法验证函数 (移植自原 ll1.ts)
    const validateGrammar = (
        inputText: string,
    ): { isValid: boolean; errorMessage: string; processedProductions: string[] } => {
        let processedProductions: string[] = []

        try {
            const emptyPattern = /^\s*$/
            if (emptyPattern.test(inputText)) {
                return { isValid: false, errorMessage: '请输入产生式！', processedProductions: [] }
            }

            const chinesePattern = /[\u4e00-\u9fa5]/
            if (chinesePattern.test(inputText)) {
                return { isValid: false, errorMessage: '输入不能包含中文字符！', processedProductions: [] }
            }

            let processedText = inputText.replace(/ +/g, '')
            processedProductions = processedText.split('\n').filter((item) => item.trim() !== '')

            const productionSet = new Set(processedProductions)
            if (processedProductions.length !== productionSet.size) {
                return { isValid: false, errorMessage: '产生式含重复项，请重新输入！', processedProductions: [] }
            }

            for (let i = 0; i < processedProductions.length; i++) {
                const production = processedProductions[i]
                const arrowCount = (production.match(/->/g) || []).length
                if (arrowCount > 1) {
                    return { isValid: false, errorMessage: `第${i + 1}行产生式包含多个"->"，格式错误！`, processedProductions: [] }
                }
                if (arrowCount === 0) {
                    return { isValid: false, errorMessage: `第${i + 1}行产生式缺少"->"，格式错误！`, processedProductions: [] }
                }
                const formatMatch = production.match(/^([A-Z])->((?:[^|]+\|)*[^|]+)$/)
                if (!formatMatch) {
                    return { isValid: false, errorMessage: `第${i + 1}行产生式格式错误！应为"大写字母->右部"格式`, processedProductions: [] }
                }
            }

            const formulasDict: Record<string, string[]> = {}
            for (const production of processedProductions) {
                const [left, right] = production.split('->')
                if (right.includes('|')) {
                    const rightParts = right.split('|')
                    if (!formulasDict[left]) formulasDict[left] = []
                    for (const part of rightParts) {
                        if (!formulasDict[left].includes(part)) formulasDict[left].push(part)
                    }
                } else {
                    if (!formulasDict[left]) formulasDict[left] = []
                    formulasDict[left].push(right)
                }
            }

            const allNonTerminals = Array.from(processedProductions.join('').match(/[A-Z]/g) || [])
            for (const nonTerminal of allNonTerminals) {
                if (!formulasDict[nonTerminal]) {
                    return { isValid: false, errorMessage: `非终结符"${nonTerminal}"没有定义产生式！`, processedProductions: [] }
                }
            }

            const visited = new Set<string>()
            const recursionStack = new Set<string>()
            const hasLeftRecursion = (nonTerminal: string): boolean => {
                if (recursionStack.has(nonTerminal)) return true
                if (visited.has(nonTerminal)) return false
                visited.add(nonTerminal)
                recursionStack.add(nonTerminal)
                for (const rightPart of formulasDict[nonTerminal] || []) {
                    const firstSymbol = rightPart[0]
                    if (/[A-Z]/.test(firstSymbol) && formulasDict[firstSymbol]) {
                        if (hasLeftRecursion(firstSymbol)) return true
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

            for (let i = 0; i < processedProductions.length; i++) {
                const production = processedProductions[i]
                const [_left, right] = production.split('->')
                const rightParts = right.split('|')
                for (const part of rightParts) {
                    if (part === 'ε') continue
                    for (let j = 0; j < part.length - 1; j++) {
                        const current = part[j]
                        const next = part[j + 1]
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
            console.error('文法验证过程中发生错误:', error)
            return { isValid: false, errorMessage: '文法验证过程中发生错误', processedProductions: [] }
        }
    }

    // ------------------------------------------
    // 4. API 交互 Actions
    // ------------------------------------------

    const performLL1Analysis = async (isRestoring = false) => {
        if (productions.value.length === 0) {
            commonStore.setError('请至少输入一个产生式')
            return false
        }

        if (!isRestoring) {
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

            // 如果不是正在复现历史，则清空当前数据
            if (!isRestoring) {
                clearAllStepData()
                currentRecordId.value = null
            }

            const response = await getLL1AnalyseAPI(productions.value)

            if (response.data.code === 0 && response.data.data) {
                const rawData = response.data.data
                if (!rawData.isLL1) {
                    throw new Error('不符合LL1文法，请重新输入！')
                }
                originalData.value = rawData
                return true
            } else {
                commonStore.setError(response.data.msg || 'LL1分析失败')
                return false
            }
        } catch (err) {
            commonStore.setError(err instanceof Error ? err.message : 'LL1分析请求失败')
            return false
        } finally {
            commonStore.setLoading(false)
        }
    }

    const analyzeInputString = async () => {
        let cleanedInputString = inputString.value.replace(/ +/g, '')
        if (/^\s*$/.test(cleanedInputString)) {
            commonStore.setError('请先输入字符串')
            return false
        }

        if (productions.value.length === 0) {
            commonStore.setError('请先设置产生式')
            return false
        }

        try {
            commonStore.setLoading(true)
            commonStore.clearError()

            const response = await LL1AnalyseInpStrAPI(productions.value, cleanedInputString)

            if (response.data.code === 0 && response.data.data) {
                inputAnalysisResult.value = response.data.data

                try {
                    const animationStore = useLL1AnimationStore()
                    await animationStore.parseAnimationData(response.data.data)
                } catch (animationError) {
                    console.warn('LL1动画数据解析失败:', animationError)
                }
                return true
            } else {
                commonStore.setError(response.data.msg || '输入串分析失败')
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
            console.warn('当前没有有效数据，无法保存')
            return
        }

        const nowTime = new Date().toLocaleString()

        // 深拷贝用户数据
        const snapshotData = {
            inputString: inputString.value,
            step2Data: step2Data.value ? JSON.parse(JSON.stringify(step2Data.value)) : undefined,
            step3Data: step3Data.value ? JSON.parse(JSON.stringify(step3Data.value)) : undefined,
            step4Data: step4Data.value ? JSON.parse(JSON.stringify(step4Data.value)) : undefined
        }

        if (currentRecordId.value) {
            const index = historyList.value.findIndex(item => item.id === currentRecordId.value)
            if (index !== -1) {
                historyList.value[index].timestamp = nowTime
                historyList.value[index].grammar = grammar.value
                historyList.value[index].productions = JSON.parse(JSON.stringify(productions.value))
                historyList.value[index].userData = snapshotData as any

                const updatedRecord = historyList.value.splice(index, 1)[0]
                historyList.value.unshift(updatedRecord)
                console.log(`[LL1 Store] 更新历史记录: ${currentRecordId.value}`)
            } else {
                currentRecordId.value = null
                saveToHistory()
            }
        } else {
            const newId = generateUniqueId()
            const newRecord: LL1HistoryRecord = {
                id: newId,
                createdAt: nowTime,
                timestamp: nowTime,
                grammar: grammar.value,
                productions: JSON.parse(JSON.stringify(productions.value)),
                userData: snapshotData as any
            }

            historyList.value.unshift(newRecord)
            currentRecordId.value = newId

            if (historyList.value.length > maxHistoryRecords) {
                historyList.value = historyList.value.slice(0, maxHistoryRecords)
            }
            console.log(`[LL1 Store] 新建历史记录: ${newId}`)
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

        const isSuccess = await performLL1Analysis(true)

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

            // 重新分析字符串以获取 inputAnalysisResult
            if (inputString.value) {
                await analyzeInputString()
            }

            console.log(`[LL1 Store] 历史记录已成功复现: ${recordId}`)
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
            console.log(`[LL1 Store] 当前记录已删除并重置状态`)
        }
    }

    const clearAllHistory = () => {
        historyList.value = []
        resetAll()
        console.log(`[LL1 Store] 所有历史记录已清空并重置状态`)
    }

    // ------------------------------------------
    // 6. 普通数据管理 Actions
    // ------------------------------------------

    const setProductions = (newProductions: string[]) => {
        productions.value = [...newProductions]
    }

    const setInputString = (str: string) => {
        inputString.value = str
        inputAnalysisResult.value = null
    }

    const clearAllStepData = () => {
        originalData.value = null
        inputAnalysisResult.value = null
        step2Data.value = undefined
        step3Data.value = undefined
        step4Data.value = undefined
    }

    const resetAll = () => {
        productions.value = []
        inputString.value = ''
        clearAllStepData()
        commonStore.clearError()
        currentRecordId.value = null

        const animationStore = useLL1AnimationStore()
        animationStore.clearAnimationData()
    }

    const saveStep2Data = (userFirstSets: any, userFollowSets: any) => {
        step2Data.value = {
            userFirstSets: JSON.parse(JSON.stringify(userFirstSets)),
            userFollowSets: JSON.parse(JSON.stringify(userFollowSets)),
            timestamp: new Date().toISOString()
        }
    }

    const saveStep3Data = (userTable: any) => {
        step3Data.value = {
            userTable: JSON.parse(JSON.stringify(userTable)),
            timestamp: new Date().toISOString()
        }
    }

    const saveStep4Data = (userSteps: any) => {
        step4Data.value = {
            userSteps: JSON.parse(JSON.stringify(userSteps)),
            timestamp: new Date().toISOString()
        }
    }

    // ------------------------------------------
    // 7. 持久化配置
    // ------------------------------------------

    const persistenceConfig = {
        key: 'll1_store_v2',
        version: '2.0.0',
        include: [
            'currentRecordId',
            'productions',
            'inputString',
            'step2Data',
            'step3Data',
            'step4Data',
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
        step2Data,
        step3Data,
        step4Data,
        historyList,

        // Computed
        grammar,
        parseTable,
        firstSets,
        followSets,
        isLL1Grammar,

        // Actions
        setProductions,
        setInputString,
        performLL1Analysis,
        analyzeInputString,
        saveToHistory,
        restoreFromHistory,
        deleteHistoryRecord,
        clearAllHistory,
        saveStep2Data,
        saveStep3Data,
        saveStep4Data,
        resetAll,
        validateGrammar,

        // Persistence
        persistence: {
            save: persistence.save,
            load: persistence.load,
            clear: persistence.clear,
        },
    }
})
