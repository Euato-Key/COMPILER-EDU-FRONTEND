import type { SLR1HistoryRecord } from '@/stores'
import type { SLR1AnalysisResult } from '@/types/slr1'
import type { AnalysisStepInfo } from '@/types'

export interface SLR1ReportStats {
  recordId: string
  grammar: string
  createdAt: string
  lastModified: string

  step2: {
    augmentedFormula: {
      completed: boolean
      progress: number
    }
    overall: {
      completed: boolean
      progress: number
    }
  }

  step3: {
    dfaStates: {
      completed: boolean
      progress: number
    }
    overall: {
      completed: boolean
      progress: number
    }
  }

  step4: {
    actionTable: {
      completed: boolean
      progress: number
    }
    gotoTable: {
      completed: boolean
      progress: number
    }
    overall: {
      completed: boolean
      progress: number
    }
  }

  step5: {
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
      augmentedFormula: number
      total: number
    }
    step3: {
      dfaStates: number
      total: number
    }
    step4: {
      actionTable: number
      gotoTable: number
      total: number
    }
    step5: {
      analysisSteps: number
      total: number
    }
  }

  overall: {
    progress: number
    completed: boolean
  }
}

export function generateSLR1Report(
  record: SLR1HistoryRecord,
  validationData?: {
    originalData?: SLR1AnalysisResult | null
    inputAnalysisResult?: AnalysisStepInfo | null
  }
): SLR1ReportStats {
  const { id, grammar, createdAt, timestamp, errorLogs, userData } = record

  const stats: SLR1ReportStats = {
    recordId: id,
    grammar,
    createdAt,
    lastModified: timestamp,

    step2: {
      augmentedFormula: { completed: false, progress: 0 },
      overall: { completed: false, progress: 0 }
    },

    step3: {
      dfaStates: { completed: false, progress: 0 },
      overall: { completed: false, progress: 0 }
    },

    step4: {
      actionTable: { completed: false, progress: 0 },
      gotoTable: { completed: false, progress: 0 },
      overall: { completed: false, progress: 0 }
    },

    step5: {
      analysisSteps: { completed: false, progress: 0 },
      overall: { completed: false, progress: 0 }
    },

    errors: {
      total: 0,
      step2: { augmentedFormula: 0, total: 0 },
      step3: { dfaStates: 0, total: 0 },
      step4: { actionTable: 0, gotoTable: 0, total: 0 },
      step5: { analysisSteps: 0, total: 0 }
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
        if (log.type === 'augmentedFormula') {
          stats.errors.step2.augmentedFormula++
        }
      } else if (log.step === 'step3') {
        stats.errors.step3.total++
        if (log.type === 'dfaState' || log.type === 'gotoTransition') {
          stats.errors.step3.dfaStates++
        }
      } else if (log.step === 'step4') {
        stats.errors.step4.total++
        if (log.type === 'actionTable') {
          stats.errors.step4.actionTable++
        } else if (log.type === 'gotoTable') {
          stats.errors.step4.gotoTable++
        }
      } else if (log.step === 'step5') {
        stats.errors.step5.total++
        if (log.type === 'analysisStep') {
          stats.errors.step5.analysisSteps++
        }
      }
    })
  }

  // --- Step 2: 增广文法 ---
  // 与LR0保持一致：基于原始产生式数量 + 增广产生式
  const originalProductionsCount = record.productions.length
  const augmentedProductionsCount = originalProductionsCount + 1 // 增广产生式 S'->S

  if (augmentedProductionsCount > 0 && userData.step2Data?.userAugmentedFormulas) {
    const userFormulas = userData.step2Data.userAugmentedFormulas
    const filledCount = userFormulas.filter(f => f.text && f.text.trim()).length
    stats.step2.augmentedFormula.progress = Math.min(100, Math.round((filledCount / augmentedProductionsCount) * 100))
    stats.step2.augmentedFormula.completed = userData.step2Data.validationSuccess || false
  }
  stats.step2.overall.progress = stats.step2.augmentedFormula.progress
  stats.step2.overall.completed = stats.step2.augmentedFormula.completed

  // --- Step 3: DFA状态集 ---
  if (userData.step3Data) {
    const dfaStates = userData.step3Data.userDfaStates || []
    const dfaState = userData.step3Data.dfaState

    // 根据 nextStepOpen 判断完成状态
    // nextStepOpen[0] = Item校验完成, nextStepOpen[1] = Goto校验完成
    const itemCheckComplete = dfaState?.nextStepOpen?.[0] || false
    const gotoCheckComplete = dfaState?.nextStepOpen?.[1] || false

    // 计算进度：有DFA状态数据占30%，Item校验完成占35%，Goto校验完成占35%
    let progress = 0

    if (dfaStates.length > 0) {
      progress += 30 // 有DFA状态数据，基础30%
    }

    if (itemCheckComplete) {
      progress += 35 // Item校验完成，加35%
    }

    if (gotoCheckComplete) {
      progress += 35 // Goto校验完成，加35%
    }

    const isComplete = itemCheckComplete && gotoCheckComplete

    stats.step3.dfaStates.progress = progress
    stats.step3.dfaStates.completed = isComplete
    stats.step3.overall.completed = isComplete
    stats.step3.overall.progress = progress
  }

  // --- Step 4: SLR1分析表 ---
  // 与LR0保持一致：基于后端返回的actions和gotos数量计算
  const actionEntries = Object.keys(validationData?.originalData?.actions || {}).length
  const gotoEntries = Object.keys(validationData?.originalData?.gotos || {}).length
  const totalTableEntries = actionEntries + gotoEntries

  if (totalTableEntries > 0 && userData.step4Data) {
    // 统计用户填写的非空条目数
    const userActionEntries = Object.keys(userData.step4Data.userActionTable || {}).filter(
      key => userData.step4Data!.userActionTable[key]?.trim()
    ).length
    const userGotoEntries = Object.keys(userData.step4Data.userGotoTable || {}).filter(
      key => userData.step4Data!.userGotoTable[key]?.trim()
    ).length

    if (actionEntries > 0) {
      stats.step4.actionTable.progress = Math.min(100, Math.round((userActionEntries / actionEntries) * 100))
      stats.step4.actionTable.completed = stats.step4.actionTable.progress === 100
    }
    if (gotoEntries > 0) {
      stats.step4.gotoTable.progress = Math.min(100, Math.round((userGotoEntries / gotoEntries) * 100))
      stats.step4.gotoTable.completed = stats.step4.gotoTable.progress === 100
    }
  }
  stats.step4.overall.progress = Math.round((stats.step4.actionTable.progress + stats.step4.gotoTable.progress) / 2)
  stats.step4.overall.completed = stats.step4.actionTable.completed && stats.step4.gotoTable.completed

  // --- Step 5: 输入串分析 ---
  // 与LR0保持一致：基于用户填写的步骤数计算
  if (userData.inputString) {
    const userSteps = userData.step5Data?.userSteps || []

    if (userSteps.length > 0) {
      // 计算有实际内容的步骤数（非空步骤）
      let filledSteps = 0
      userSteps.forEach((step: any, index: number) => {
        // 第一行是预设的初始状态，也算作已完成
        if (index === 0) {
          filledSteps++
        } else {
          // 检查该步骤是否有用户填写的内容
          const hasContent = step.stateStack?.trim() || step.symbolStack?.trim() || step.inputString?.trim()
          if (hasContent) {
            filledSteps++
          }
        }
      })

      // 进度基于用户已填写的步骤数 / 总步骤数
      const totalSteps = userSteps.length
      stats.step5.analysisSteps.progress = Math.min(100, Math.round((filledSteps / totalSteps) * 100))
      stats.step5.analysisSteps.completed = filledSteps >= totalSteps
    } else {
      // 有输入串但没有步骤数据，说明还没开始填写
      stats.step5.analysisSteps.progress = 0
      stats.step5.analysisSteps.completed = false
    }

    stats.step5.overall.progress = stats.step5.analysisSteps.progress
    stats.step5.overall.completed = stats.step5.analysisSteps.completed
  } else {
    // 如果没有输入串，Step 5 为 0% 进度
    stats.step5.analysisSteps.progress = 0
    stats.step5.analysisSteps.completed = false
    stats.step5.overall.progress = 0
    stats.step5.overall.completed = false
  }

  // --- 总体进度 ---
  // 与LR0保持一致：使用加权平均
  // Step 2: 20%, Step 3: 25%, Step 4: 35%, Step 5: 20% (如果有输入串)
  const hasInputString = !!userData.inputString

  if (hasInputString) {
    const totalProgress = (
      (stats.step2.overall.progress * 0.2) +
      (stats.step3.overall.progress * 0.25) +
      (stats.step4.overall.progress * 0.35) +
      (stats.step5.overall.progress * 0.2)
    )
    stats.overall.progress = Math.round(totalProgress)
  } else {
    const totalProgress = (
      (stats.step2.overall.progress * 0.25) +
      (stats.step3.overall.progress * 0.35) +
      (stats.step4.overall.progress * 0.40)
    )
    stats.overall.progress = Math.round(totalProgress)
  }

  stats.overall.completed =
    stats.step2.overall.completed &&
    stats.step3.overall.completed &&
    stats.step4.overall.completed &&
    (!hasInputString || stats.step5.overall.completed)

  return stats
}

// 错误项接口（与 ReportErrorList 组件兼容）
interface ErrorItem {
  location: string
  wrongValue: string
  correctValue: string
  timestamp: string
  hint?: string
  details?: any
}

// 将 SLR1ErrorLog 的 location 对象转换为字符串
function formatLocation(location: SLR1HistoryRecord['errorLogs'][0]['location'], step: string, type: string): string {
  // Step 2: 增广文法 - 显示行号
  if (step === 'step2') {
    return location.row !== undefined ? `第 ${location.row} 行` : '未知位置'
  }
  // Step 3: DFA状态
  if (step === 'step3') {
    return location.row !== undefined ? `状态 ${location.row}` : '未知状态'
  }
  // Step 4: Action/Goto表
  if (step === 'step4') {
    const parts: string[] = []
    if (location.row !== undefined) parts.push(`状态 ${location.row}`)
    if (location.col) parts.push(`符号 ${location.col}`)
    return parts.length > 0 ? parts.join(', ') : '未知位置'
  }
  // Step 5: 分析步骤
  if (step === 'step5') {
    return location.stepIndex !== undefined ? `步骤 ${location.stepIndex}` : '未知步骤'
  }
  return '未知位置'
}

// 获取错误摘要
export function getSLR1ErrorSummary(errorLogs: SLR1HistoryRecord['errorLogs']) {
  if (!errorLogs || errorLogs.length === 0) return null

  const summary = {
    step2: {
      augmentedFormula: [] as ErrorItem[]
    },
    step3: {
      dfaStates: [] as ErrorItem[]
    },
    step4: {
      actionTable: [] as ErrorItem[],
      gotoTable: [] as ErrorItem[]
    },
    step5: {
      analysisSteps: [] as ErrorItem[]
    }
  }

  errorLogs.forEach(log => {
    // 转换错误日志为 ErrorItem 格式
    const errorItem: ErrorItem = {
      location: formatLocation(log.location, log.step, log.type),
      wrongValue: log.wrongValue,
      correctValue: log.correctValue,
      timestamp: log.timestamp,
      hint: log.hint,
      details: {
        tableType: log.type === 'actionTable' ? 'ACTION' : log.type === 'gotoTable' ? 'GOTO' : undefined,
        state: log.location.row,
        symbol: log.location.col,
        stepIndex: log.location.stepIndex,
        fieldName: log.location.fieldKey,
        hintDetails: log.hintDetails
      }
    }

    if (log.step === 'step2' && log.type === 'augmentedFormula') {
      summary.step2.augmentedFormula.push(errorItem)
    } else if (log.step === 'step3' && (log.type === 'dfaState' || log.type === 'gotoTransition')) {
      summary.step3.dfaStates.push(errorItem)
    } else if (log.step === 'step4') {
      if (log.type === 'actionTable') {
        summary.step4.actionTable.push(errorItem)
      } else if (log.type === 'gotoTable') {
        summary.step4.gotoTable.push(errorItem)
      }
    } else if (log.step === 'step5' && log.type === 'analysisStep') {
      summary.step5.analysisSteps.push(errorItem)
    }
  })

  return summary
}
