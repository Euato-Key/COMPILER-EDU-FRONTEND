import type { FAHistoryRecord } from '@/stores/fa-new'

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

export function generateFAReport(record: FAHistoryRecord): FAReportStats {
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

  if (userData.step3Data) {
    const { userConversionTable, userTransitionMatrix, conversionTableRowCount } = userData.step3Data
    
    const conversionTableTotal = Object.keys(userConversionTable).reduce((sum, col) => {
      return sum + (userConversionTable[col]?.length || 0)
    }, 0)
    const conversionTableFilled = Object.keys(userConversionTable).reduce((sum, col) => {
      return sum + (userConversionTable[col]?.filter(v => v && v.trim()).length || 0)
    }, 0)
    
    stats.step3.conversionTable.progress = conversionTableTotal > 0 
      ? Math.round((conversionTableFilled / conversionTableTotal) * 100) 
      : 0
    stats.step3.conversionTable.completed = stats.step3.conversionTable.progress === 100
    
    const matrixTotal = Object.keys(userTransitionMatrix).reduce((sum, rowKey) => {
      return sum + Object.keys(userTransitionMatrix[rowKey]).length
    }, 0)
    const matrixFilled = Object.keys(userTransitionMatrix).reduce((sum, rowKey) => {
      return sum + Object.values(userTransitionMatrix[rowKey]).filter(v => v && v.trim()).length
    }, 0)
    
    stats.step3.transitionMatrix.progress = matrixTotal > 0 
      ? Math.round((matrixFilled / matrixTotal) * 100) 
      : 0
    stats.step3.transitionMatrix.completed = stats.step3.transitionMatrix.progress === 100
    
    stats.step3.overall.progress = Math.round(
      (stats.step3.conversionTable.progress + stats.step3.transitionMatrix.progress) / 2
    )
    stats.step3.overall.completed = stats.step3.conversionTable.completed && stats.step3.transitionMatrix.completed
  }

  if (userData.step5Data) {
    const { userPSets, userMinimizedMatrix } = userData.step5Data
    
    const pSetsTotal = userPSets.length
    const pSetsFilled = userPSets.filter(p => p.text && p.text.trim()).length
    
    stats.step5.pSets.progress = pSetsTotal > 0 
      ? Math.round((pSetsFilled / pSetsTotal) * 100) 
      : 0
    stats.step5.pSets.completed = stats.step5.pSets.progress === 100
    
    const matrixTotal = userMinimizedMatrix.filter(cell => cell.category !== 'onlyRead').length
    const matrixFilled = userMinimizedMatrix.filter(
      cell => cell.category !== 'onlyRead' && cell.value && cell.value.trim()
    ).length
    
    stats.step5.minimizedMatrix.progress = matrixTotal > 0 
      ? Math.round((matrixFilled / matrixTotal) * 100) 
      : 0
    stats.step5.minimizedMatrix.completed = stats.step5.minimizedMatrix.progress === 100
    
    stats.step5.overall.progress = Math.round(
      (stats.step5.pSets.progress + stats.step5.minimizedMatrix.progress) / 2
    )
    stats.step5.overall.completed = stats.step5.pSets.completed && stats.step5.minimizedMatrix.completed
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

  const step3Weight = 0.5
  const step5Weight = 0.5
  
  stats.overall.progress = Math.round(
    stats.step3.overall.progress * step3Weight + 
    stats.step5.overall.progress * step5Weight
  )
  
  stats.overall.completed = stats.step3.overall.completed && stats.step5.overall.completed

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
