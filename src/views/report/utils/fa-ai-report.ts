/**
 * FA模块AI报告上下文构建器
 * 将FA模块的数据转换为AI报告所需的上下文格式
 */

import type { AIReportContext, AIReportContent } from './ai-report'
import type { FAHistoryRecord, FAErrorLog } from '@/stores'
import type { DataFAType, FAResult } from '@/types'
import { useFAStoreNew } from '@/stores'
import { faToDot } from '@/utils/fa-to-dot'

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
    description: '学生输入的正则表达式，作为整个FA构造流程的起点。系统将根据此正则表达式生成标准答案，学生后续所有步骤的答题都将基于这个正则表达式进行验证。',
    content: record.regex,
    completed: true,
    note: '正则表达式是FA构造的基础，决定了NFA、DFA的结构',
  }

  // Step 2: NFA画布
  if (userData.canvasData?.step2) {
    const nodes = userData.canvasData.step2.nodes || []
    const edges = userData.canvasData.step2.edges || []
    // 转换为Graphviz DOT格式
    const dotString = nodes.length > 0 ? faToDot(nodes, edges) : ''

    data.step2 = {
      stepNumber: 2,
      stepName: 'NFA构造',
      description: '使用NFA的造方法将正则表达式转换为非确定有限自动机(NFA)。学生需要在画布上绘制NFA状态转换图，包括：初始状态、接受状态、中间状态，以及标记有输入符号（包括ε）的转换边。Thompson构造法的核心是为每个基本正则表达式符号创建对应的状态和转换，然后通过组合规则处理连接、选择和闭包操作。',
      canvasData: {
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes.map((n: any) => ({
          id: n.id,
          label: n.label,
          type: n.type,
          isInitial: n.data?.isInitial,
          isFinal: n.data?.isFinal,
        })),
        edges: edges.map((e: any) => ({
          source: e.source,
          target: e.target,
          label: e.data?.text || e.label,
        })),
        // Graphviz DOT格式表示，便于AI理解图结构
        dotRepresentation: dotString,
      },
      timestamp: userData.canvasData.step2.timestamp,
      completed: true,
      keyPoints: [
        '初始状态：用单箭头指向的节点表示',
        '接受状态：用双圆圈表示',
        'ε转换：不消耗输入符号的转换',
        '基本构造：字符、连接、选择(|)、闭包(*)',
      ],
    }
  } else {
    data.step2 = {
      stepNumber: 2,
      stepName: 'NFA构造（Thompson构造法）',
      description: '使用Thompson构造法将正则表达式转换为非确定有限自动机(NFA)。学生需要在画布上绘制NFA状态转换图，包括：初始状态、接受状态、中间状态，以及标记有输入符号（包括ε）的转换边。',
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
      description: '使用子集构造法（Subset Construction Algorithm）将NFA转换为等价的DFA。这一步是FA理论中的核心算法，包括两个主要部分：(1) NFA→DFA转换表：记录从NFA状态集合到新DFA状态的映射关系，需要计算ε-闭包和状态转移；(2) DFA状态转换矩阵：用数字编号表示DFA状态间的转换关系。学生需要根据NFA图，通过计算ε-闭包和输入符号的转移，逐步构建出DFA。',
      tables: {
        conversionTable: {
          name: 'NFA到DFA转换表',
          description: '记录每个NFA状态集合通过各输入符号转换后的目标状态集合。格式要求：多个状态用空格分隔（如：1 2 3），包含NFA状态集合、ε-闭包、各输入符号的转移结果。',
          rowCount: userData.step3Data.conversionTableRowCount,
          data: conversionTableData,
        },
        transitionMatrix: {
          name: 'DFA状态转换矩阵',
          description: 'DFA的完整状态转换表，行表示DFA状态编号，列表示输入符号（S列是状态编号，其他列是转移目标状态）。无转换的格子可以填写"-"或留空。',
          data: transitionMatrixData,
        },
      },
      timestamp: userData.step3Data.timestamp,
      completed: true,
      algorithmSteps: [
        '计算初始状态的ε-闭包，得到DFA的初始状态',
        '对于每个新发现的DFA状态，计算其在每个输入符号下的转移',
        '转移目标 = 当前状态集合中每个状态通过输入符号可达的状态的ε-闭包',
        '重复直到没有新状态产生',
      ],
    }
  } else {
    data.step3 = {
      stepNumber: 3,
      stepName: '子集构造法（NFA转DFA）',
      description: '使用子集构造法将NFA转换为等价的DFA。包括计算ε-闭包和状态转移，需要填写NFA→DFA转换表和DFA状态转换矩阵。',
      completed: false,
    }
  }

  // Step 4: DFA画布
  if (userData.canvasData?.step4) {
    const nodes = userData.canvasData.step4.nodes || []
    const edges = userData.canvasData.step4.edges || []
    // 转换为Graphviz DOT格式
    const dotString = nodes.length > 0 ? faToDot(nodes, edges) : ''

    data.step4 = {
      stepNumber: 4,
      stepName: 'DFA构造（画图）',
      description: '根据第三步子集构造法得到的DFA状态转换矩阵，在画布上绘制确定有限自动机(DFA)的状态转换图。DFA与NFA的主要区别在于：DFA每个状态对于每个输入符号有且仅有一条出边（或表示为无转换），没有ε转换。学生需要根据状态转换矩阵，绘制出包含所有状态和转换边的DFA图，并正确标记初始状态和接受状态。',
      canvasData: {
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes.map((n: any) => ({
          id: n.id,
          label: n.label,
          type: n.type,
          isInitial: n.data?.isInitial,
          isFinal: n.data?.isFinal,
        })),
        edges: edges.map((e: any) => ({
          source: e.source,
          target: e.target,
          label: e.data?.text || e.label,
        })),
        // Graphviz DOT格式表示，便于AI理解图结构
        dotRepresentation: dotString,
      },
      timestamp: userData.canvasData.step4.timestamp,
      completed: true,
      dfaCharacteristics: [
        '确定性：每个状态对于每个输入符号有且仅有一个转移',
        '无ε转换：所有转换都必须消耗输入符号',
        '状态用数字编号表示（0, 1, 2, ...）',
        '接受状态：用双圆圈表示，对应于包含原NFA接受状态的状态集合',
      ],
    }
  } else {
    data.step4 = {
      stepNumber: 4,
      stepName: 'DFA构造（画图）',
      description: '根据第三步子集构造法得到的DFA状态转换矩阵，在画布上绘制确定有限自动机(DFA)的状态转换图。DFA没有ε转换，每个状态对于每个输入符号有且仅有一条出边。',
      completed: false,
    }
  }

  // Step 5: DFA最小化
  if (userData.step5Data) {
    data.step5 = {
      stepNumber: 5,
      stepName: 'DFA最小化',
      description: '使用分割法（Partitioning/Equivalence Algorithm）对DFA进行最小化，合并等价状态。DFA最小化的核心是找出并合并不可区分的状态（等价状态）。这一步包括两个部分：(1) 化简DFA状态子集：将DFA的所有状态划分为若干个等价类，每个等价类中的状态都是不可区分的；(2) 最小化状态转换矩阵：基于状态划分结果，构建最小化后的DFA状态转换表。最小化后的DFA状态数最少，且与原DFA识别相同的语言。',
      tables: {
        pSets: {
          name: '化简DFA状态子集',
          description: '记录DFA最小化过程中每个迭代步骤的状态划分集合。格式：每行输入一个化简后的状态子集，多个状态用空格隔开（如：1 2 3）。初始划分将状态分为接受状态和非接受状态，然后通过迭代细分直到无法继续划分。',
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
          description: '最小化后的DFA状态转换表。S列表示最小化后的状态编号（0, 1, 2, ...），其他列表示在各输入符号下的转移目标。无转换的格子可以填写"-"或留空。',
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
      minimizationAlgorithm: [
        '初始划分：将状态分为接受状态集和非接受状态集',
        '迭代细分：对于每个划分块，检查其中状态在各输入符号下的转移是否落在同一划分块',
        '如果转移落在不同划分块，则将该块进一步细分',
        '重复直到没有新的细分产生',
        '每个最终的划分块对应最小化DFA的一个状态',
      ],
    }
  } else {
    data.step5 = {
      stepNumber: 5,
      stepName: 'DFA最小化',
      description: '使用分割法对DFA进行最小化，合并等价状态。包括填写化简DFA状态子集和最小化状态转换矩阵。',
      completed: false,
    }
  }

  // Step 6: 最小化DFA画布
  if (userData.canvasData?.step6) {
    const nodes = userData.canvasData.step6.nodes || []
    const edges = userData.canvasData.step6.edges || []
    // 转换为Graphviz DOT格式
    const dotString = nodes.length > 0 ? faToDot(nodes, edges) : ''

    data.step6 = {
      stepNumber: 6,
      stepName: '最小化DFA构造（画图）',
      description: '根据第五步DFA最小化得到的状态转换矩阵，绘制最小化后的DFA状态转换图。最小化DFA的状态数最少，每个状态对应原DFA中的一个等价类。学生需要根据最小化状态转换矩阵，绘制出包含所有最小化状态和转换边的DFA图。终态（接受状态）在矩阵中用绿色高亮显示，对应于包含原DFA接受状态的等价类。',
      canvasData: {
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes: nodes.map((n: any) => ({
          id: n.id,
          label: n.label,
          type: n.type,
          isInitial: n.data?.isInitial,
          isFinal: n.data?.isFinal,
        })),
        edges: edges.map((e: any) => ({
          source: e.source,
          target: e.target,
          label: e.data?.text || e.label,
        })),
        // Graphviz DOT格式表示，便于AI理解图结构
        dotRepresentation: dotString,
      },
      timestamp: userData.canvasData.step6.timestamp,
      completed: true,
      minimizationResult: [
        '最小化DFA的状态数 = 第五步中状态子集的个数',
        '每个状态代表原DFA中的一个等价类',
        '状态编号为 0, 1, 2, ...（与第五步矩阵中的S列对应）',
        '接受状态：对应于包含原DFA接受状态的等价类',
      ],
    }
  } else {
    data.step6 = {
      stepNumber: 6,
      stepName: '最小化DFA构造（画图）',
      description: '根据第五步DFA最小化得到的状态转换矩阵，绘制最小化后的DFA状态转换图。最小化DFA的状态数最少，每个状态对应原DFA中的一个等价类。',
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
