/**
 * FA模块AI报告上下文构建器
 * 将FA模块的数据转换为AI报告所需的上下文格式
 */

import type { AIReportContext, AIReportContent } from './ai-report'
import type { FAHistoryRecord, FAErrorLog } from '@/stores'
import type { DataFAType, FAResult } from '@/types'
import { useFAStoreNew } from '@/stores'

/**
 * 构建FA模块的AI报告上下文
 * @param record 历史记录
 * @param validationData 验证数据
 * @param originalData 后端原始数据
 * @returns AI报告上下文
 */
export function buildFAReportContext(
  record: FAHistoryRecord,
  validationData?: DataFAType,
  originalData?: FAResult | null
): AIReportContext {
  const { id, regex, errorLogs, userData } = record

  // 构建答题数据
  const answerData = buildFAAnswerData(record)

  // 构建正确答案数据
  const correctData = buildFACorrectData(originalData)

  return {
    moduleType: 'fa',
    moduleName: '有限自动机（FA）',
    recordId: id,
    input: regex,
    errorLogs: errorLogs || [],
    answerData,
    correctData,
  }
}

/**
 * 构建FA答题数据
 * 为每个步骤添加清晰的描述说明
 */
function buildFAAnswerData(record: FAHistoryRecord): Record<string, any> {
  const { userData } = record
  const data: Record<string, any> = {
    _description: '学生答题数据，按步骤组织',
    _totalSteps: 6,
  }

  // Step 1: 正则表达式输入
  data.step1 = {
    stepNumber: 1,
    stepName: '正则表达式输入',
    description: '学生输入的正则表达式，用于后续NFA构造',
    content: record.regex,
    completed: true,
  }

  // Step 2: NFA画布
  if (userData.canvasData?.step2) {
    data.step2 = {
      stepNumber: 2,
      stepName: 'NFA构造（画图）',
      description: '根据正则表达式构造非确定有限自动机(NFA)的状态转换图',
      canvasData: {
        nodeCount: userData.canvasData.step2.nodes?.length || 0,
        edgeCount: userData.canvasData.step2.edges?.length || 0,
        nodes: userData.canvasData.step2.nodes?.map((n: any) => ({
          id: n.id,
          label: n.label,
          type: n.type,
        })),
        edges: userData.canvasData.step2.edges?.map((e: any) => ({
          source: e.source,
          target: e.target,
          label: e.label,
        })),
      },
      timestamp: userData.canvasData.step2.timestamp,
      completed: true,
    }
  } else {
    data.step2 = {
      stepNumber: 2,
      stepName: 'NFA构造（画图）',
      description: '根据正则表达式构造非确定有限自动机(NFA)的状态转换图',
      completed: false,
    }
  }

  // Step 3: 子集构造
  if (userData.step3Data) {
    const conversionTableData = userData.step3Data.userConversionTable || {}
    const transitionMatrixData = userData.step3Data.userTransitionMatrix || {}

    data.step3 = {
      stepNumber: 3,
      stepName: '子集构造法（NFA转DFA）',
      description: '使用子集构造法将NFA转换为DFA，包括计算ε-闭包和状态转换',
      tables: {
        conversionTable: {
          name: 'NFA到DFA转换表',
          description: '记录每个NFA状态集合通过各输入符号转换后的目标状态集合',
          rowCount: userData.step3Data.conversionTableRowCount,
          data: conversionTableData,
        },
        transitionMatrix: {
          name: 'DFA状态转换矩阵',
          description: 'DFA的完整状态转换表，行表示状态，列表示输入符号',
          data: transitionMatrixData,
        },
      },
      timestamp: userData.step3Data.timestamp,
      completed: true,
    }
  } else {
    data.step3 = {
      stepNumber: 3,
      stepName: '子集构造法（NFA转DFA）',
      description: '使用子集构造法将NFA转换为DFA，包括计算ε-闭包和状态转换',
      completed: false,
    }
  }

  // Step 4: DFA画布
  if (userData.canvasData?.step4) {
    data.step4 = {
      stepNumber: 4,
      stepName: 'DFA构造（画图）',
      description: '根据子集构造的结果绘制确定有限自动机(DFA)的状态转换图',
      canvasData: {
        nodeCount: userData.canvasData.step4.nodes?.length || 0,
        edgeCount: userData.canvasData.step4.edges?.length || 0,
        nodes: userData.canvasData.step4.nodes?.map((n: any) => ({
          id: n.id,
          label: n.label,
          type: n.type,
        })),
        edges: userData.canvasData.step4.edges?.map((e: any) => ({
          source: e.source,
          target: e.target,
          label: e.label,
        })),
      },
      timestamp: userData.canvasData.step4.timestamp,
      completed: true,
    }
  } else {
    data.step4 = {
      stepNumber: 4,
      stepName: 'DFA构造（画图）',
      description: '根据子集构造的结果绘制确定有限自动机(DFA)的状态转换图',
      completed: false,
    }
  }

  // Step 5: DFA最小化
  if (userData.step5Data) {
    data.step5 = {
      stepNumber: 5,
      stepName: 'DFA最小化',
      description: '使用分割法或Hopcroft算法对DFA进行最小化，合并等价状态',
      tables: {
        pSets: {
          name: '状态子集划分',
          description: '记录DFA最小化过程中每个迭代步骤的状态划分集合',
          count: userData.step5Data.userPSets?.length || 0,
          data: userData.step5Data.userPSets?.map((p: any) => ({
            id: p.id,
            category: p.category,
            state: p.state,
            text: p.text,
          })),
        },
        minimizedMatrix: {
          name: '最小化DFA状态转换矩阵',
          description: '最小化后的DFA状态转换表',
          cellCount: userData.step5Data.userMinimizedMatrix?.length || 0,
          data: userData.step5Data.userMinimizedMatrix?.map((cell: any) => ({
            row: cell.rowIndex,
            col: cell.colIndex,
            value: cell.value,
            category: cell.category,
          })),
        },
      },
      timestamp: userData.step5Data.timestamp,
      completed: true,
    }
  } else {
    data.step5 = {
      stepNumber: 5,
      stepName: 'DFA最小化',
      description: '使用分割法或Hopcroft算法对DFA进行最小化，合并等价状态',
      completed: false,
    }
  }

  // Step 6: 最小化DFA画布
  if (userData.canvasData?.step6) {
    data.step6 = {
      stepNumber: 6,
      stepName: '最小化DFA构造（画图）',
      description: '绘制最小化后的DFA状态转换图',
      canvasData: {
        nodeCount: userData.canvasData.step6.nodes?.length || 0,
        edgeCount: userData.canvasData.step6.edges?.length || 0,
        nodes: userData.canvasData.step6.nodes?.map((n: any) => ({
          id: n.id,
          label: n.label,
          type: n.type,
        })),
        edges: userData.canvasData.step6.edges?.map((e: any) => ({
          source: e.source,
          target: e.target,
          label: e.label,
        })),
      },
      timestamp: userData.canvasData.step6.timestamp,
      completed: true,
    }
  } else {
    data.step6 = {
      stepNumber: 6,
      stepName: '最小化DFA构造（画图）',
      description: '绘制最小化后的DFA状态转换图',
      completed: false,
    }
  }

  return data
}

/**
 * 构建FA正确答案数据
 * 为每个步骤添加清晰的描述说明
 */
function buildFACorrectData(originalData?: FAResult | null): Record<string, any> {
  if (!originalData) {
    return {
      _description: '标准答案数据（后端数据加载失败）',
      _note: '无法获取标准答案数据，AI分析将仅基于学生答题数据进行',
    }
  }

  return {
    _description: '标准答案数据，用于与学生答题进行对比分析',
    _totalSteps: 6,

    // Step 1: 正则表达式
    step1: {
      stepNumber: 1,
      stepName: '正则表达式输入',
      description: '学生输入的正则表达式',
      content: '由学生输入决定',
    },

    // Step 2: NFA数据
    step2: {
      stepNumber: 2,
      stepName: 'NFA构造（标准答案）',
      description: '根据正则表达式构造的非确定有限自动机(NFA)',
      data: {
        dotString: originalData.NFA_dot_str,
        table: originalData.table,
        tableColumns: Object.keys(originalData.table || {}),
        tableDescription: 'NFA状态转换表，包含ε转移和字符转移',
      },
    },

    // Step 3: 子集构造
    step3: {
      stepNumber: 3,
      stepName: '子集构造法（标准答案）',
      description: '使用子集构造法将NFA转换为DFA的标准结果',
      tables: {
        conversionTable: {
          name: 'NFA到DFA转换表（标准答案）',
          description: '每个NFA状态集合通过各输入符号转换后的目标状态集合',
          data: originalData.table,
        },
        transitionMatrix: {
          name: 'DFA状态转换矩阵（标准答案）',
          description: 'DFA的完整状态转换表',
          data: originalData.table_to_num,
        },
      },
    },

    // Step 4: DFA数据
    step4: {
      stepNumber: 4,
      stepName: 'DFA构造（标准答案）',
      description: '子集构造后得到的确定有限自动机(DFA)',
      data: {
        dotString: originalData.DFA_dot_str,
        table: originalData.table_to_num,
        tableColumns: Object.keys(originalData.table_to_num || {}),
        tableDescription: 'DFA状态转换表',
      },
    },

    // Step 5: DFA最小化
    step5: {
      stepNumber: 5,
      stepName: 'DFA最小化（标准答案）',
      description: 'DFA最小化后的结果，包含状态划分和最小化转换表',
      tables: {
        pSets: {
          name: '状态子集划分（标准答案）',
          description: 'DFA最小化过程中每个迭代步骤的状态划分集合',
          data: originalData.P,
          partitionCount: originalData.P?.length || 0,
        },
        minimizedMatrix: {
          name: '最小化DFA状态转换矩阵（标准答案）',
          description: '最小化后的DFA状态转换表',
          data: originalData.table_to_num_min,
          tableColumns: Object.keys(originalData.table_to_num_min || {}),
        },
      },
      partitionChanges: originalData.P_change,
    },

    // Step 6: 最小化DFA
    step6: {
      stepNumber: 6,
      stepName: '最小化DFA构造（标准答案）',
      description: '最小化后的DFA状态转换图',
      data: {
        dotString: originalData.Min_DFA_dot_str,
        table: originalData.table_to_num_min,
        tableDescription: '最小化DFA状态转换表',
      },
    },
  }
}

/**
 * 格式化错误日志用于AI分析
 */
export function formatFAErrorLogsForAI(errorLogs: FAErrorLog[]): string {
  if (!errorLogs || errorLogs.length === 0) {
    return '无错误记录'
  }

  return errorLogs
    .map((log, index) => {
      const parts = [
        `错误 ${index + 1}:`,
        `  步骤: ${log.step}`,
        `  类型: ${log.tableType}`,
        `  位置: 行${log.location.row}${log.location.col ? ', 列' + log.location.col : ''}`,
        `  错误值: ${log.wrongValue}`,
        `  正确值: ${log.correctValue}`,
      ]
      return parts.join('\n')
    })
    .join('\n\n')
}

/**
 * 使用Store构建FA报告上下文
 * @param recordId 记录ID
 * @returns 报告上下文或null
 */
export function buildFAReportContextFromStore(recordId: string): AIReportContext | null {
  const faStore = useFAStoreNew()
  const record = faStore.historyList.find((r) => r.id === recordId)

  if (!record) {
    console.error(`[FA AI Report] 找不到记录: ${recordId}`)
    return null
  }

  return buildFAReportContext(record, faStore.validationData || undefined, faStore.originalData)
}

// 导出类型
export type { AIReportContext, AIReportContent }
