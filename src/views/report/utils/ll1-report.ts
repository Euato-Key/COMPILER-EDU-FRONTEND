import type { LL1HistoryRecord, LL1ErrorLog } from '@/stores/ll1-new'
import type { LL1AnalysisResult, AnalysisStepInfo } from '@/types/ll1'

export interface LL1ReportStats {
    recordId: string
    grammar: string
    createdAt: string
    lastModified: string

    step2: {
        firstSets: {
            completed: boolean
            progress: number
        }
        followSets: {
            completed: boolean
            progress: number
        }
        overall: {
            completed: boolean
            progress: number
        }
    }

    step3: {
        parsingTable: {
            completed: boolean
            progress: number
        }
        overall: {
            completed: boolean
            progress: number
        }
    }

    step4: {
        analysisSteps: {
            completed: boolean
            progress: number
        }
        overall: {
            completed: boolean
            progress: number
        }
    }

    errors: {
        total: number
        step2: {
            firstSets: number
            followSets: number
            total: number
        }
        step3: {
            parsingTable: number
            total: number
        }
        step4: {
            analysisSteps: number
            total: number
        }
    }

    overall: {
        progress: number
        completed: boolean
    }
}

export function generateLL1Report(
    record: LL1HistoryRecord,
    validationData?: {
        originalData?: LL1AnalysisResult | null,
        inputAnalysisResult?: AnalysisStepInfo | null
    }
): LL1ReportStats {
    const { id, grammar, createdAt, timestamp, errorLogs, userData } = record

    const stats: LL1ReportStats = {
        recordId: id,
        grammar,
        createdAt,
        lastModified: timestamp,

        step2: {
            firstSets: { completed: false, progress: 0 },
            followSets: { completed: false, progress: 0 },
            overall: { completed: false, progress: 0 }
        },

        step3: {
            parsingTable: { completed: false, progress: 0 },
            overall: { completed: false, progress: 0 }
        },

        step4: {
            analysisSteps: { completed: false, progress: 0 },
            overall: { completed: false, progress: 0 }
        },

        errors: {
            total: 0,
            step2: { firstSets: 0, followSets: 0, total: 0 },
            step3: { parsingTable: 0, total: 0 },
            step4: { analysisSteps: 0, total: 0 }
        },

        overall: {
            progress: 0,
            completed: false
        }
    }

    // --- 错误统计 ---
    if (errorLogs) {
        errorLogs.forEach(log => {
            stats.errors.total++

            if (log.step === 'step2') {
                stats.errors.step2.total++
                if (log.type === 'firstSet') {
                    stats.errors.step2.firstSets++
                } else if (log.type === 'followSet') {
                    stats.errors.step2.followSets++
                }
            } else if (log.step === 'step3') {
                stats.errors.step3.total++
                if (log.type === 'parsingTable') {
                    stats.errors.step3.parsingTable++
                }
            } else if (log.step === 'step4') {
                stats.errors.step4.total++
                if (log.type === 'analysisStep') {
                    stats.errors.step4.analysisSteps++
                }
            }
        })
    }

    // --- 进度计算 ---
    if (validationData?.originalData) {
        const original = validationData.originalData

        // Step 2: First/Follow
        // 修正：只计算非终结符 (Vn) 的 First/Follow 集
        const nonTerminals = original.Vn || []
        const totalItems = nonTerminals.length

        if (totalItems > 0 && userData.step2Data) {
            // First Sets
            const userFirstSets = userData.step2Data.userFirstSets || {}
            let userFirstFilled = 0
            nonTerminals.forEach(nt => {
                if (userFirstSets[nt] && userFirstSets[nt].trim()) {
                    userFirstFilled++
                }
            })
            stats.step2.firstSets.progress = Math.min(100, Math.round((userFirstFilled / totalItems) * 100))
            stats.step2.firstSets.completed = stats.step2.firstSets.progress === 100

            // Follow Sets
            const userFollowSets = userData.step2Data.userFollowSets || {}
            let userFollowFilled = 0
            nonTerminals.forEach(nt => {
                if (userFollowSets[nt] && userFollowSets[nt].trim()) {
                    userFollowFilled++
                }
            })
            stats.step2.followSets.progress = Math.min(100, Math.round((userFollowFilled / totalItems) * 100))
            stats.step2.followSets.completed = stats.step2.followSets.progress === 100

            // Step 2 Overall
            stats.step2.overall.progress = Math.round((stats.step2.firstSets.progress + stats.step2.followSets.progress) / 2)
            stats.step2.overall.completed = stats.step2.firstSets.completed && stats.step2.followSets.completed
        }

        // Step 3: Parsing Table
        // 修正：table 是 Record<string, string> 扁平结构 (key: "NonTerminal|Terminal")
        // 并且只统计需要填写的单元格（即标准答案不为空的项）
        let tableTotalCells = 0
        let userTableFilled = 0

        // 获取所有需要填写的单元格 key
        const validKeys = Object.keys(original.table || {}).filter(key => {
            return original.table[key] && original.table[key].trim() !== ''
        })
        tableTotalCells = validKeys.length

        if (userData.step3Data && userData.step3Data.userTable) {
            const userTable = userData.step3Data.userTable
            // 统计用户已填写的有效单元格
            userTableFilled = validKeys.filter(key => {
                return userTable[key] && userTable[key].trim() !== ''
            }).length
        }

        if (tableTotalCells > 0) {
            stats.step3.parsingTable.progress = Math.min(100, Math.round((userTableFilled / tableTotalCells) * 100))
            stats.step3.parsingTable.completed = stats.step3.parsingTable.progress === 100
        }
        stats.step3.overall.progress = stats.step3.parsingTable.progress
        stats.step3.overall.completed = stats.step3.parsingTable.completed
    }

    // Step 4: String Analysis
    // Rely on validationData.inputAnalysisResult for total steps
    if (validationData?.inputAnalysisResult && userData.inputString) {
        // Fix: Use info_step instead of steps
        const totalSteps = validationData.inputAnalysisResult.info_step ? validationData.inputAnalysisResult.info_step.length : 0
        let userStepsFilled = 0

        if (userData.step4Data && userData.step4Data.userSteps) {
            userStepsFilled = userData.step4Data.userSteps.length
        }

        if (totalSteps > 0) {
            stats.step4.analysisSteps.progress = Math.min(100, Math.round((userStepsFilled / totalSteps) * 100))
            stats.step4.analysisSteps.completed = stats.step4.analysisSteps.progress >= 100 // Allow for potential slight mismatches if user adds extra lines?
        }
        stats.step4.overall.progress = stats.step4.analysisSteps.progress
        stats.step4.overall.completed = stats.step4.analysisSteps.completed
    } else if (!userData.inputString) {
        // If no input string, Step 4 doesn't apply or is considered empty
        // We can treat it as 0 progress but maybe not penalize overall too much if it wasn't started?
        // For now, 0.
    }

    // Overall Calculation (Weighted)
    // Step 2: 40%, Step 3: 40%, Step 4: 20% (if input string exists)
    // If no input string, maybe 50% Step 2, 50% Step 3?

    const hasInputString = !!userData.inputString

    if (hasInputString) {
        const totalProgress = (
            (stats.step2.overall.progress * 0.4) +
            (stats.step3.overall.progress * 0.4) +
            (stats.step4.overall.progress * 0.2)
        )
        stats.overall.progress = Math.round(totalProgress)
    } else {
        const totalProgress = (
            (stats.step2.overall.progress * 0.5) +
            (stats.step3.overall.progress * 0.5)
        )
        stats.overall.progress = Math.round(totalProgress)
    }

    stats.overall.completed = stats.step2.overall.completed && stats.step3.overall.completed && (hasInputString ? stats.step4.overall.completed : true)

    return stats
}

export function getLL1ErrorSummary(errorLogs: LL1HistoryRecord['errorLogs']) {
    const summary = {
        step2: {
            firstSets: [] as Array<{ location: string; wrongValue: string; correctValue: string; timestamp: string }>,
            followSets: [] as Array<{ location: string; wrongValue: string; correctValue: string; timestamp: string }>
        },
        step3: {
            parsingTable: [] as Array<{ location: string; wrongValue: string; correctValue: string; timestamp: string }>
        },
        step4: {
            analysisSteps: [] as Array<{ location: string; wrongValue: string; correctValue: string; timestamp: string }>
        }
    }

    if (!errorLogs) return summary

    errorLogs.forEach(log => {
        // location object to string
        let locStr = ''
        if (typeof log.location.row === 'string') {
            locStr = log.location.row // For First/Follow, row is usually NonTerminal name
        } else if (log.location.row !== undefined && log.location.col !== undefined) {
            locStr = `行: ${log.location.row}, 列: ${log.location.col}`
        } else if (log.location.stepIndex !== undefined) {
            locStr = `步骤: ${log.location.stepIndex + 1}`
        } else {
            locStr = JSON.stringify(log.location)
        }

        const errorItem = {
            location: locStr,
            wrongValue: log.wrongValue,
            correctValue: log.correctValue,
            timestamp: log.timestamp
        }

        if (log.step === 'step2') {
            if (log.type === 'firstSet') summary.step2.firstSets.push(errorItem)
            else if (log.type === 'followSet') summary.step2.followSets.push(errorItem)
        } else if (log.step === 'step3') {
            summary.step3.parsingTable.push(errorItem)
        } else if (log.step === 'step4') {
            summary.step4.analysisSteps.push(errorItem)
        }
    })

    return summary
}
