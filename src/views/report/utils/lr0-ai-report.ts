/**
 * LR0模块AI报告上下文构建器
 * 将LR0模块的数据转换为AI报告所需的上下文格式
 */

import type { AIReportContext, AIReportContent } from './ai-report'
import type { LR0HistoryRecord, LR0ErrorLog } from '@/stores'
import type { LR0AnalysisResult } from '@/types/lr0'
import type { AnalysisStepInfo } from '@/types'
import { useLR0StoreNew } from '@/stores'

/**
 * 构建LR0模块的AI报告上下文
 * @param record 历史记录
 * @param originalData 后端原始数据
 * @param inputAnalysisResult 输入串分析结果
 * @returns AI报告上下文
 */
export function buildLR0ReportContext(
  record: LR0HistoryRecord,
  originalData?: LR0AnalysisResult | null,
  inputAnalysisResult?: AnalysisStepInfo | null
): AIReportContext {
  const { id, grammar, productions, errorLogs, userData } = record

  // 构建答题数据
  const answerData = buildLR0AnswerData(record)

  // 构建正确答案数据
  const correctData = buildLR0CorrectData(originalData, inputAnalysisResult)

  return {
    moduleType: 'lr0',
    moduleName: 'LR(0)语法分析',
    recordId: id,
    input: grammar,
    errorLogs: errorLogs || [],
    answerData,
    correctData,
  }
}

/**
 * 构建LR0答题数据
 */
function buildLR0AnswerData(record: LR0HistoryRecord): Record<string, any> {
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

  // Step 4: LR(0)分析表
  if (userData.step4Data) {
    data.step4 = {
      stepNumber: 4,
      stepName: 'LR(0)分析表构造',
      description: '根据DFA状态集构造LR(0)分析表，包括Action表和Goto表',
      actionTable: {
        name: 'Action表',
        description: '动作表，定义在每个状态下面对终结符时的动作（移进、归约、接受、报错）',
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
      stepName: 'LR(0)分析表构造',
      description: '根据DFA状态集构造LR(0)分析表，包括Action表和Goto表',
      completed: false,
    }
  }

  // Step 5: 输入串分析
  if (userData.step5Data && userData.inputString) {
    data.step5 = {
      stepNumber: 5,
      stepName: '输入串分析',
      description: '使用LR(0)分析表对输入串进行自底向上的语法分析',
      inputString: userData.inputString,
      analysis: {
        name: '分析步骤',
        description: 'LR分析过程的每一步，包括栈状态、剩余输入和动作',
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
      description: '使用LR(0)分析表对输入串进行自底向上的语法分析',
      inputString: userData.inputString || null,
      completed: false,
    }
  }

  return data
}

/**
 * 构建LR0正确答案数据
 */
function buildLR0CorrectData(
  originalData?: LR0AnalysisResult | null,
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
    _isLR0Grammar: originalData.isLR0,

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
        value: originalData.LR0_dot_str || '',
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
          items: state.items || [],
        })),
        stateCount: originalData.all_dfa?.length || 0,
      },
    },

    // Step 4: LR(0)分析表
    step4: {
      stepNumber: 4,
      stepName: 'LR(0)分析表（标准答案）',
      description: '根据DFA状态集构造的LR(0)分析表',
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
    },

    // Step 5: 输入串分析
    step5: {
      stepNumber: 5,
      stepName: '输入串分析（标准答案）',
      description: '使用LR(0)分析表对输入串进行分析的标准步骤',
      analysis: inputAnalysisResult
        ? {
            name: '分析步骤（标准答案）',
            description: 'LR分析的标准过程',
            steps: inputAnalysisResult.info_step?.map((stepNum, index) => ({
              stepNumber: stepNum,
              stateStack: inputAnalysisResult.info_state_stack?.[index] || '',
              symbolStack: inputAnalysisResult.info_symbol_stack?.[index] || '',
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
 * 使用Store构建LR0报告上下文
 * @param recordId 记录ID
 * @returns 报告上下文或null
 */
export function buildLR0ReportContextFromStore(recordId: string): AIReportContext | null {
  const lr0Store = useLR0StoreNew()
  const record = lr0Store.historyList.find((r) => r.id === recordId)

  if (!record) {
    console.error(`[LR0 AI Report] 找不到记录: ${recordId}`)
    return null
  }

  return buildLR0ReportContext(
    record,
    lr0Store.originalData,
    lr0Store.inputAnalysisResult || undefined
  )
}

// 导出类型
export type { AIReportContext, AIReportContent }
