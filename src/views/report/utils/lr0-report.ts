import type { LR0HistoryRecord } from '@/stores/lr0-new'
import type { LR0AnalysisResult } from '@/types/lr0'
import type { AnalysisStepInfo } from '@/types'

export interface LR0ReportStats {
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

export function generateLR0Report(
  record: LR0HistoryRecord,
  validationData?: {
    originalData?: LR0AnalysisResult | null
    inputAnalysisResult?: AnalysisStepInfo | null
  }
): LR0ReportStats {
  const { id, grammar, createdAt, timestamp, errorLogs, userData } = record

  const stats: LR0ReportStats = {
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
        if (log.type === 'dfaState') {
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

  // --- 进度计算 ---
  if (validationData?.originalData) {
    const original = validationData.originalData

    // Step 2: 增广文法
    // 基于原始产生式数量 + 增广产生式
    const originalProductionsCount = record.productions.length
    const augmentedProductionsCount = originalProductionsCount + 1 // 增广产生式 S'->S

    if (augmentedProductionsCount > 0 && userData.step2Data?.userAugmentedFormulas) {
      const userFormulas = userData.step2Data.userAugmentedFormulas
      const filledCount = userFormulas.filter(f => f.text && f.text.trim()).length
      stats.step2.augmentedFormula.progress = Math.min(100, Math.round((filledCount / augmentedProductionsCount) * 100))
      stats.step2.augmentedFormula.completed = stats.step2.augmentedFormula.progress === 100
    }
    stats.step2.overall.progress = stats.step2.augmentedFormula.progress
    stats.step2.overall.completed = stats.step2.augmentedFormula.completed

    // Step 3: DFA状态集
    // 基于后端返回的DFA状态数量
    const dfaStatesCount = original.all_dfa?.length || 0
    if (dfaStatesCount > 0 && userData.step3Data?.userDfaStates) {
      const userStatesCount = userData.step3Data.userDfaStates.length
      stats.step3.dfaStates.progress = Math.min(100, Math.round((userStatesCount / dfaStatesCount) * 100))
      stats.step3.dfaStates.completed = stats.step3.dfaStates.progress === 100
    }
    stats.step3.overall.progress = stats.step3.dfaStates.progress
    stats.step3.overall.completed = stats.step3.dfaStates.completed

    // Step 4: Action/Goto表
    // Action表：基于actions对象的大小
    const actionEntries = Object.keys(original.actions || {}).length
    const gotoEntries = Object.keys(original.gotos || {}).length
    const totalTableEntries = actionEntries + gotoEntries

    if (totalTableEntries > 0 && userData.step4Data) {
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
  }

  // Step 5: 输入串分析
  // 根据 LR0 移进-规约分析答题表的完成进度来计算
  if (userData.inputString) {
    const userSteps = userData.step5Data?.userSteps || []
    
    if (userSteps.length > 0) {
      // 计算有实际内容的步骤数（非空步骤）
      let filledSteps = 0
      userSteps.forEach((step, index) => {
        // 第一行是预设的初始状态，也算作已完成
        if (index === 0) {
          filledSteps++
        } else {
          // 检查该步骤是否有用户填写的内容
          const hasContent = step.stack?.trim() || step.input?.trim() || step.action?.trim()
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

  // 总体进度计算 (加权)
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

  stats.overall.completed = stats.step2.overall.completed &&
    stats.step3.overall.completed &&
    stats.step4.overall.completed &&
    (hasInputString ? stats.step5.overall.completed : true)

  return stats
}

export function getLR0ErrorSummary(errorLogs: LR0HistoryRecord['errorLogs']) {
  const summary = {
    step2: {
      augmentedFormula: [] as Array<{ location: string; wrongValue: string; correctValue: string; timestamp: string; details?: any }>
    },
    step3: {
      dfaStates: [] as Array<{ location: string; wrongValue: string; correctValue: string; timestamp: string; details?: any }>
    },
    step4: {
      actionTable: [] as Array<{ location: string; wrongValue: string; correctValue: string; timestamp: string; details?: any }>,
      gotoTable: [] as Array<{ location: string; wrongValue: string; correctValue: string; timestamp: string; details?: any }>
    },
    step5: {
      analysisSteps: [] as Array<{ location: string; wrongValue: string; correctValue: string; timestamp: string; details?: any }>
    }
  }

  if (!errorLogs) return summary

  errorLogs.forEach(log => {
    let locStr = ''
    let details: any = {}

    if (log.step === 'step4') {
      // 步骤4：显示 ACTION/GOTO 表的具体位置
      const tableType = log.type === 'actionTable' ? 'ACTION' : 'GOTO'
      const state = log.location.row
      const symbol = log.location.col
      locStr = `${tableType}表 [状态: ${state}, 符号: ${symbol}]`
      details = {
        tableType,
        state,
        symbol,
        fieldKey: log.location.fieldKey
      }
    } else if (log.step === 'step5') {
      // 步骤5：显示具体步骤和字段
      const stepIndex = log.location.stepIndex
      const fieldKey = log.location.fieldKey as string
      // fieldKey 格式: "stateStack-0", "symbolStack-0", "inputString-0"
      const fieldMap: Record<string, string> = {
        'stateStack': '状态栈',
        'symbolStack': '符号栈',
        'inputString': '输入串',
        'action': '动作'
      }
      const fieldName = fieldKey ? fieldMap[fieldKey.split('-')[0]] || fieldKey : '未知字段'
      locStr = `第${(stepIndex ?? 0) + 1}步 - ${fieldName}`
      details = {
        stepIndex: (stepIndex ?? 0) + 1,
        fieldName,
        fieldKey,
        // 添加提示详情（如果有）
        hintDetails: log.hintDetails || null
      }
    } else if (typeof log.location.row === 'string') {
      locStr = log.location.row
    } else if (log.location.row !== undefined && log.location.col !== undefined) {
      locStr = `行: ${log.location.row}, 列: ${log.location.col}`
    } else if (log.location.stepIndex !== undefined) {
      locStr = `步骤: ${log.location.stepIndex + 1}`
    } else if (log.location.fieldKey) {
      locStr = `字段: ${log.location.fieldKey}`
    } else {
      locStr = JSON.stringify(log.location)
    }

    const errorItem = {
      location: locStr,
      wrongValue: log.wrongValue,
      correctValue: log.correctValue,
      timestamp: log.timestamp,
      details
    }

    if (log.step === 'step2') {
      if (log.type === 'augmentedFormula') summary.step2.augmentedFormula.push(errorItem)
    } else if (log.step === 'step3') {
      if (log.type === 'dfaState') summary.step3.dfaStates.push(errorItem)
    } else if (log.step === 'step4') {
      if (log.type === 'actionTable') summary.step4.actionTable.push(errorItem)
      else if (log.type === 'gotoTable') summary.step4.gotoTable.push(errorItem)
    } else if (log.step === 'step5') {
      if (log.type === 'analysisStep') summary.step5.analysisSteps.push(errorItem)
    }
  })

  return summary
}
