/**
 * SLR1模块AI报告上下文构建器
 * 将SLR1模块的数据转换为AI报告所需的上下文格式
 */

import type { AIReportContext, AIReportContent } from './ai-report'
import type { SLR1HistoryRecord, SLR1ErrorLog } from '@/stores'
import type { SLR1AnalysisResult } from '@/types/slr1'
import type { AnalysisStepInfo } from '@/types'
import { useSLR1Store } from '@/stores'

/**
 * 构建SLR1模块的AI报告上下文
 * @param record 历史记录
 * @param originalData 后端原始数据
 * @param inputAnalysisResult 输入串分析结果
 * @returns AI报告上下文
 */
export function buildSLR1ReportContext(
  record: SLR1HistoryRecord,
  originalData?: SLR1AnalysisResult | null,
  inputAnalysisResult?: AnalysisStepInfo | null
): AIReportContext {
  const { id, grammar, productions, errorLogs, userData } = record

  // 构建答题数据
  const answerData = buildSLR1AnswerData(record)

  // 构建正确答案数据
  const correctData = buildSLR1CorrectData(originalData, inputAnalysisResult)

  return {
    moduleType: 'slr1',
    moduleName: 'SLR(1)语法分析',
    recordId: id,
    input: grammar,
    errorLogs: errorLogs || [],
    answerData,
    correctData,
  }
}

/**
 * 构建SLR1答题数据
 */
function buildSLR1AnswerData(record: SLR1HistoryRecord): Record<string, any> {
  const { userData, productions } = record
  const data: Record<string, any> = {
    _description: '学生答题数据，按步骤组织',
    _totalSteps: 5,
  }

  // Step 1: 文法产生式输入
  data.step1 = {
    stepNumber: 1,
    stepName: '文法产生式输入',
    description: '学生输入的上下文无关文法产生式',
    productions: productions || [],
    grammar: record.grammar,
    completed: true,
  }

  // Step 2: 增广文法
  if (userData.step2Data) {
    data.step2 = {
      stepNumber: 2,
      stepName: '增广文法构造',
      description: '构造增广文法，添加新的开始符号产生式 S\' -> S',
      augmentedFormulas: {
        name: '增广产生式列表',
        description: '学生输入的增广文法产生式列表',
        formulas: userData.step2Data.userAugmentedFormulas?.map(f => ({
          id: f.id,
          text: f.text,
          status: f.status,
        })) || [],
      },
      timestamp: userData.step2Data.timestamp,
      completed: true,
    }
  } else {
    data.step2 = {
      stepNumber: 2,
      stepName: '增广文法构造',
      description: '构造增广文法，添加新的开始符号产生式 S\' -> S',
      completed: false,
    }
  }

  // Step 3: DFA状态集
  if (userData.step3Data) {
    const dfaState = userData.step3Data.dfaState
    data.step3 = {
      stepNumber: 3,
      stepName: 'DFA状态集构造',
      description: '构造LR(0)项目的DFA状态集，包括项目集的闭包和转移',
      dfaStates: {
        name: 'DFA状态集',
        description: '学生构造的DFA状态，每个状态包含一组LR(0)项目',
        states: userData.step3Data.userDfaStates?.map((state, index) => ({
          stateNumber: index,
          items: state.items || [],
        })),
        stateCount: userData.step3Data.userDfaStates?.length || 0,
      },
      dotItems: {
        name: 'LR(0)项目',
        description: '学生绘制的LR(0)项目（图中的节点）',
        items: userData.step3Data.userDotItems || [],
        itemCount: userData.step3Data.userDotItems?.length || 0,
      },
      drawingState: dfaState
        ? {
            name: '绘图状态',
            description: 'DFA绘图过程中的状态信息，包括节点和边的映射关系',
            addNodeLimit: dfaState.addNodeLimit,
            addNodeRemainCnt: dfaState.addNodeRemainCnt,
            forEachEpochAllNum: dfaState.forEachEpochAllNum,
            checkRightItems: dfaState.checkRightItems || [],
            checkRightGotos: dfaState.checkRightGotos || [],
            checkRightLocalNode: dfaState.checkRightLocalNode || [],
            checkRightLocalEdge: dfaState.checkRightLocalEdge || [],
            nodeIdMapItemId: dfaState.nodeIdMapItemId || {},
            edgeIdMapGotosId: dfaState.edgeIdMapGotosId || {},
            nextStepOpen: dfaState.nextStepOpen || [],
          }
        : null,
      showAnswer: userData.step3Data.userShowAnswer,
      timestamp: userData.step3Data.timestamp,
      completed: true,
    }
  } else {
    data.step3 = {
      stepNumber: 3,
      stepName: 'DFA状态集构造',
      description: '构造LR(0)项目的DFA状态集，包括项目集的闭包和转移',
      completed: false,
    }
  }

  // Step 4: SLR1分析表
  if (userData.step4Data) {
    data.step4 = {
      stepNumber: 4,
      stepName: 'SLR(1)分析表构造',
      description: '根据DFA状态集和FOLLOW集构造SLR(1)分析表，包括Action表和Goto表。SLR(1)与LR(0)的区别在于：SLR(1)在归约时使用FOLLOW集来确定在哪些终结符下可以归约',
      actionTable: {
        name: 'Action表',
        description: '动作表，定义在每个状态下面对终结符时的动作（移进、归约、接受、报错）。SLR(1)中归约动作只在FOLLOW集中的终结符下进行',
        data: userData.step4Data.userActionTable || {},
      },
      gotoTable: {
        name: 'Goto表',
        description: '转移表，定义在每个状态下面对非终结符时的状态转移',
        data: userData.step4Data.userGotoTable || {},
      },
      timestamp: userData.step4Data.timestamp,
      completed: true,
    }
  } else {
    data.step4 = {
      stepNumber: 4,
      stepName: 'SLR(1)分析表构造',
      description: '根据DFA状态集和FOLLOW集构造SLR(1)分析表，包括Action表和Goto表',
      completed: false,
    }
  }

  // Step 5: 输入串分析
  if (userData.step5Data && userData.inputString) {
    data.step5 = {
      stepNumber: 5,
      stepName: '输入串分析',
      description: '使用SLR(1)分析表对输入串进行自底向上的语法分析',
      inputString: userData.inputString,
      analysis: {
        name: '分析步骤',
        description: 'SLR分析过程的每一步，包括栈状态、剩余输入和动作',
        steps: userData.step5Data.userSteps?.map((step, index) => ({
          stepNumber: index + 1,
          stack: step.stack,
          input: step.input,
          action: step.action,
        })),
        stepCount: userData.step5Data.userSteps?.length || 0,
      },
      timestamp: userData.step5Data.timestamp,
      completed: true,
    }
  } else {
    data.step5 = {
      stepNumber: 5,
      stepName: '输入串分析',
      description: '使用SLR(1)分析表对输入串进行自底向上的语法分析',
      inputString: userData.inputString || null,
      completed: false,
    }
  }

  return data
}

/**
 * 构建SLR1正确答案数据
 */
function buildSLR1CorrectData(
  originalData?: SLR1AnalysisResult | null,
  inputAnalysisResult?: AnalysisStepInfo | null
): Record<string, any> {
  if (!originalData) {
    return {
      _description: '标准答案数据（后端数据加载失败）',
      _note: '无法获取标准答案数据，AI分析将仅基于学生答题数据进行',
    }
  }

  return {
    _description: '标准答案数据，用于与学生答题进行对比分析',
    _totalSteps: 5,
    _isSLR1Grammar: originalData.isSLR1,

    // Step 1: 文法
    step1: {
      stepNumber: 1,
      stepName: '文法产生式',
      description: '输入的上下文无关文法',
      productions: originalData.formulas_list || [],
      nonTerminals: originalData.Vn || [],
      terminals: originalData.Vt || [],
      startSymbol: originalData.S,
    },

    // Step 2: 增广文法
    step2: {
      stepNumber: 2,
      stepName: '增广文法（标准答案）',
      description: '增广文法的开始符号产生式',
      augmentedFormula: {
        name: '增广产生式（标准答案）',
        description: '标准增广产生式 S\' -> S',
        value: originalData.SLR1_dot_str || '',
      },
    },

    // Step 3: DFA状态集
    step3: {
      stepNumber: 3,
      stepName: 'DFA状态集（标准答案）',
      description: '构造的DFA状态集，包含所有LR(0)项目集',
      dfaStates: {
        name: 'DFA状态集（标准答案）',
        description: '每个状态包含一组LR(0)项目',
        states: originalData.all_dfa?.map((state, index) => ({
          stateNumber: index,
          items: state.pros || [],
        })),
        stateCount: originalData.all_dfa?.length || 0,
      },
    },

    // Step 4: SLR1分析表
    step4: {
      stepNumber: 4,
      stepName: 'SLR(1)分析表（标准答案）',
      description: '根据DFA状态集和FOLLOW集构造的SLR(1)分析表',
      actionTable: {
        name: 'Action表（标准答案）',
        description: '动作表，行表示状态，列表示终结符',
        data: originalData.actions || {},
      },
      gotoTable: {
        name: 'Goto表（标准答案）',
        description: '转移表，行表示状态，列表示非终结符',
        data: originalData.gotos || {},
      },
      followSets: {
        name: 'FOLLOW集',
        description: '用于确定归约动作的FOLLOW集合',
        data: originalData.follow || {},
      },
    },

    // Step 5: 输入串分析
    step5: {
      stepNumber: 5,
      stepName: '输入串分析（标准答案）',
      description: '使用SLR(1)分析表对输入串进行分析的标准步骤',
      analysis: inputAnalysisResult
        ? {
            name: '分析步骤（标准答案）',
            description: 'SLR分析的标准过程',
            steps: inputAnalysisResult.info_step?.map((stepNum, index) => ({
              stepNumber: stepNum,
              stack: inputAnalysisResult.info_state_stack?.[index] || '',
              input: inputAnalysisResult.info_str?.[index] || '',
              action: inputAnalysisResult.info_action?.[index] || inputAnalysisResult.info_msg?.[index] || '',
            })),
            isAccepted: inputAnalysisResult.info_res === 'Success!',
          }
        : null,
    },
  }
}

/**
 * 格式化错误日志用于AI分析
 */
export function formatSLR1ErrorLogsForAI(errorLogs: SLR1ErrorLog[]): string {
  if (!errorLogs || errorLogs.length === 0) {
    return '无错误记录'
  }

  return errorLogs
    .map((log, index) => {
      const parts = [
        `错误 ${index + 1}:`,
        `  步骤: ${log.step}`,
        `  类型: ${log.type}`,
        `  位置: 行${log.location.row}${log.location.col ? ', 列' + log.location.col : ''}`,
        `  错误值: ${log.wrongValue}`,
        `  正确值: ${log.correctValue}`,
      ]
      return parts.join('\n')
    })
    .join('\n\n')
}

/**
 * 使用Store构建SLR1报告上下文
 * @param recordId 记录ID
 * @returns 报告上下文或null
 */
export function buildSLR1ReportContextFromStore(recordId: string): AIReportContext | null {
  const slr1Store = useSLR1Store()
  const record = slr1Store.historyList.find((r) => r.id === recordId)

  if (!record) {
    console.error(`[SLR1 AI Report] 找不到记录: ${recordId}`)
    return null
  }

  return buildSLR1ReportContext(
    record,
    slr1Store.originalData,
    slr1Store.inputAnalysisResult || undefined
  )
}

// 导出类型
export type { AIReportContext, AIReportContent }
