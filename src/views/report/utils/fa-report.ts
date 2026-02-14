import type { FAHistoryRecord } from '@/stores'
import type { DataFAType } from '@/types/fa'
import type { FAResult } from '@/types'

export interface FAReportStats {
  recordId: string
  regex: string
  createdAt: string
  lastModified: string
  
  step3: {
    conversionTable: {
      completed: boolean
      progress: number
    }
    transitionMatrix: {
      completed: boolean
      progress: number
    }
    overall: {
      completed: boolean
      progress: number
    }
  }
  
  step5: {
    pSets: {
      completed: boolean
      progress: number
    }
    minimizedMatrix: {
      completed: boolean
      progress: number
    }
    overall: {
      completed: boolean
      progress: number
    }
  }
  
  canvas: {
    step2: boolean
    step4: boolean
    step6: boolean
    overall: boolean
  }
  
  errors: {
    total: number
    step3: {
      conversionTable: number
      transitionMatrix: number
      total: number
    }
    step5: {
      pSets: number
      minimizedMatrix: number
      total: number
    }
  }
  
  overall: {
    progress: number
    completed: boolean
  }
}

export function generateFAReport(record: FAHistoryRecord, validationData?: DataFAType, originalData?: FAResult | null): FAReportStats {
  const { id, regex, createdAt, timestamp, errorLogs, userData } = record

  const stats: FAReportStats = {
    recordId: id,
    regex,
    createdAt,
    lastModified: timestamp,
    
    step3: {
      conversionTable: {
        completed: false,
        progress: 0
      },
      transitionMatrix: {
        completed: false,
        progress: 0
      },
      overall: {
        completed: false,
        progress: 0
      }
    },
    
    step5: {
      pSets: {
        completed: false,
        progress: 0
      },
      minimizedMatrix: {
        completed: false,
        progress: 0
      },
      overall: {
        completed: false,
        progress: 0
      }
    },
    
    canvas: {
      step2: false,
      step4: false,
      step6: false,
      overall: false
    },
    
    errors: {
      total: 0,
      step3: {
        conversionTable: 0,
        transitionMatrix: 0,
        total: 0
      },
      step5: {
        pSets: 0,
        minimizedMatrix: 0,
        total: 0
      }
    },
    
    overall: {
      progress: 0,
      completed: false
    }
  }

  if (userData.canvasData) {
    stats.canvas.step2 = !!userData.canvasData.step2
    stats.canvas.step4 = !!userData.canvasData.step4
    stats.canvas.step6 = !!userData.canvasData.step6
    stats.canvas.overall = stats.canvas.step2 && stats.canvas.step4 && stats.canvas.step6
  }

  // Step 3 进度计算（基于后端验证数据）
  if (validationData) {
    const s3Data = userData.step3Data; // 提取局部变量解决 ts(18048)

    // --- 1. 转换表 (NFA->DFA) 进度 ---
    const conversionTableTotal = validationData.table.filter(item => item.category !== 'onlyRead').length
    let conversionTableFilled = 0
    
    if (s3Data?.userConversionTable) {
      // 遍历每一列，累加有值的单元格
      Object.values(s3Data.userConversionTable).forEach(columnArray => {
        if (Array.isArray(columnArray)) {
          conversionTableFilled += columnArray.filter(v => v && v.trim()).length
        }
      })
    }
    
    // 使用 Math.min(100, ...) 防止进度超过 100%
    stats.step3.conversionTable.progress = conversionTableTotal > 0 
      ? Math.min(100, Math.round((conversionTableFilled / conversionTableTotal) * 100)) 
      : 0
    stats.step3.conversionTable.completed = stats.step3.conversionTable.progress === 100
    
    // --- 2. 转移矩阵 (DFA) 进度 ---
    const transitionMatrixTotal = validationData.table_to_num.filter(item => item.category !== 'onlyRead').length
    let transitionMatrixFilled = 0
    
    if (s3Data?.userTransitionMatrix) {
      // 遍历每一行对象
      Object.values(s3Data.userTransitionMatrix).forEach(rowObject => {
        if (rowObject && typeof rowObject === 'object') {
          // 累加该行中所有非空的值
          transitionMatrixFilled += Object.values(rowObject).filter(v => v && v.trim()).length
        }
      })
    }
    
    // 使用 Math.min(100, ...) 防止进度超过 100%
    stats.step3.transitionMatrix.progress = transitionMatrixTotal > 0 
      ? Math.min(100, Math.round((transitionMatrixFilled / transitionMatrixTotal) * 100)) 
      : 0
    stats.step3.transitionMatrix.completed = stats.step3.transitionMatrix.progress === 100
    
    // --- 3. Step 3 整体进度 ---
    const step3Total = conversionTableTotal + transitionMatrixTotal
    const step3Filled = conversionTableFilled + transitionMatrixFilled
    
    stats.step3.overall.progress = Math.round(
      (stats.step3.conversionTable.progress + stats.step3.transitionMatrix.progress) / 2
    )
    stats.step3.overall.completed = stats.step3.conversionTable.completed && stats.step3.transitionMatrix.completed
  } else {
    // ... (保持原有的 else 逻辑不变)
    stats.step3.conversionTable.completed = false
    stats.step3.conversionTable.progress = 0
    stats.step3.transitionMatrix.completed = false
    stats.step3.transitionMatrix.progress = 0
    stats.step3.overall.completed = false
    stats.step3.overall.progress = 0
  } 

  // Step 5 进度计算（基于后端验证数据）
  if (validationData) {
    const s5Data = userData.step5Data; // 提取局部变量解决 TS 潜在警告

    // 1. P集合进度计算
    const pSetsTotal = validationData.p_list.filter(item => item.category !== 'onlyRead').length
    let pSetsFilled = 0
    
    if (s5Data?.userPSets) {
      pSetsFilled = s5Data.userPSets.filter(p => p.text && p.text.trim()).length
    }
    
    stats.step5.pSets.progress = pSetsTotal > 0 
      ? Math.min(100, Math.round((pSetsFilled / pSetsTotal) * 100)) 
      : 0
    stats.step5.pSets.completed = stats.step5.pSets.progress === 100
    
    // 2. 最小化矩阵进度计算
    const minimizedMatrixTotal = validationData.table_to_num_min.filter(item => item.category !== 'onlyRead').length
    let minimizedMatrixFilledCount = 0
    
    if (s5Data?.userMinimizedMatrix) {
      minimizedMatrixFilledCount = s5Data.userMinimizedMatrix.filter(cell => {
        const isNotReadonly = cell.category !== 'onlyRead'
        if (!isNotReadonly) return false
        
        // 判定已填：check 状态不是 empty，或者 value 有实际内容
        const hasInteraction = cell.check && cell.check !== 'empty' 
        const hasValue = cell.value !== undefined && cell.value !== null && cell.value.trim() !== ''
        
        // 如果用户有填写内容，视为已填
        if (hasInteraction || hasValue) return true
        
        // 如果标准答案中该单元格为空（表示无转换），也视为已填（用户可以不填或填"-"）
        if (originalData?.table_to_num_min) {
          // 根据 colIndex 获取对应的列名（跳过 S 列，因为 S 列是第 0 列且是 onlyRead）
          const columns = Object.keys(originalData.table_to_num_min).filter(k => k !== 'S')
          const colName = columns[cell.colIndex - 1] // colIndex 从 0 开始，但 S 列是第 0 列
          if (colName) {
            const correctValue = originalData.table_to_num_min[colName]?.[cell.rowIndex]
            // 标准答案为空、"-"或undefined，表示该单元格不需要填写
            if (!correctValue || correctValue === '-' || correctValue === '') {
              return true
            }
          }
        }
        
        return false
      }).length
    }
    
    stats.step5.minimizedMatrix.progress = minimizedMatrixTotal > 0 
      ? Math.min(100, Math.round((minimizedMatrixFilledCount / minimizedMatrixTotal) * 100)) 
      : 0
    stats.step5.minimizedMatrix.completed = stats.step5.minimizedMatrix.progress === 100
    
    // 3. Step 5 整体进度
    const step5TotalWeight = pSetsTotal + minimizedMatrixTotal
    const step5FilledWeight = pSetsFilled + minimizedMatrixFilledCount
    
    stats.step5.overall.progress = Math.round(
      (stats.step5.pSets.progress + stats.step5.minimizedMatrix.progress) / 2
    )
    stats.step5.overall.completed = stats.step5.pSets.completed && stats.step5.minimizedMatrix.completed
  } else {
    // 没有后端验证数据，标注为未完成
    stats.step5.pSets.completed = false
    stats.step5.pSets.progress = 0
    stats.step5.minimizedMatrix.completed = false
    stats.step5.minimizedMatrix.progress = 0
    stats.step5.overall.completed = false
    stats.step5.overall.progress = 0
  }

  errorLogs.forEach(log => {
    stats.errors.total++
    
    if (log.step === 'step3') {
      stats.errors.step3.total++
      if (log.tableType === 'conversionTable') {
        stats.errors.step3.conversionTable++
      } else if (log.tableType === 'transitionMatrix') {
        stats.errors.step3.transitionMatrix++
      }
    } else if (log.step === 'step5') {
      stats.errors.step5.total++
      if (log.tableType === 'pSets') {
        stats.errors.step5.pSets++
      } else if (log.tableType === 'minimizedMatrix') {
        stats.errors.step5.minimizedMatrix++
      }
    }
  })

  let canvasCount = 0
  if (stats.canvas.step2) canvasCount++
  if (stats.canvas.step4) canvasCount++
  if (stats.canvas.step6) canvasCount++
  const canvasProgress = Math.round((canvasCount / 3) * 100)

  // 2. 综合计算总体进度 (给画布、Step3、Step5 分配权重)
  // 建议权重：画布 20%, Step 3 40%, Step 5 40%
  // 这样只要 Step 3 的转换表是 50%，总体进度就会被拉下来
  const totalProgress = (
    (canvasProgress * 0.2) + 
    (stats.step3.overall.progress * 0.4) + 
    (stats.step5.overall.progress * 0.4)
  )

  stats.overall.progress = Math.min(100, Math.round(totalProgress))
  
  // 3. 总体完成状态判断
  stats.overall.completed = 
    stats.canvas.overall && 
    stats.step3.overall.completed && 
    stats.step5.overall.completed

  return stats
}

export function getErrorSummary(errorLogs: FAHistoryRecord['errorLogs']) {
  const summary = {
    step3: {
      conversionTable: [] as Array<{ location: string; wrongValue: string; correctValue: string; timestamp: string }>,
      transitionMatrix: [] as Array<{ location: string; wrongValue: string; correctValue: string; timestamp: string }>
    },
    step5: {
      pSets: [] as Array<{ location: string; wrongValue: string; correctValue: string; timestamp: string }>,
      minimizedMatrix: [] as Array<{ location: string; wrongValue: string; correctValue: string; timestamp: string }>
    }
  }

  errorLogs.forEach(log => {
    const errorItem = {
      location: `第${log.location.row + 1}行${log.location.col ? log.location.col + '列' : ''}`,
      wrongValue: log.wrongValue,
      correctValue: log.correctValue,
      timestamp: log.timestamp
    }

    if (log.step === 'step3') {
      if (log.tableType === 'conversionTable') {
        summary.step3.conversionTable.push(errorItem)
      } else if (log.tableType === 'transitionMatrix') {
        summary.step3.transitionMatrix.push(errorItem)
      }
    } else if (log.step === 'step5') {
      if (log.tableType === 'pSets') {
        summary.step5.pSets.push(errorItem)
      } else if (log.tableType === 'minimizedMatrix') {
        summary.step5.minimizedMatrix.push(errorItem)
      }
    }
  })

  return summary
}
