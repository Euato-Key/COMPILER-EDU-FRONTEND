/**
 * LL1模块AI报告上下文构建器
 * 将LL1模块的数据转换为AI报告所需的上下文格式
 */

import type { AIReportContext, AIReportContent } from './ai-report'
import type { LL1HistoryRecord, LL1ErrorLog } from '@/stores'
import type { LL1AnalysisResult, AnalysisStepInfo } from '@/types/ll1'
import { useLL1Store } from '@/stores'

/**
 * 构建LL1模块的AI报告上下文
 * @param record 历史记录
 * @param originalData 后端原始数据
 * @param inputAnalysisResult 输入串分析结果
 * @returns AI报告上下文
 */
export function buildLL1ReportContext(
  record: LL1HistoryRecord,
  originalData?: LL1AnalysisResult | null,
  inputAnalysisResult?: AnalysisStepInfo | null
): AIReportContext {
  const { id, grammar, productions, errorLogs, userData } = record

  // 构建答题数据
  const answerData = buildLL1AnswerData(record)

  // 构建正确答案数据
  const correctData = buildLL1CorrectData(originalData, inputAnalysisResult)

  return {
    moduleType: 'll1',
    moduleName: 'LL(1)语法分析',
    recordId: id,
    input: grammar,
    errorLogs: errorLogs || [],
    answerData,
    correctData,
  }
}

/**
 * 构建LL1答题数据
 */
function buildLL1AnswerData(record: LL1HistoryRecord): Record<string, any> {
  const { userData, productions } = record
  const data: Record<string, any> = {
    _description: '学生答题数据，按步骤组织',
    _totalSteps: 4,
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

  // Step 2: First/Follow集
  if (userData.step2Data) {
    data.step2 = {
      stepNumber: 2,
      stepName: 'First & Follow集合计算',
      description: '计算文法中每个非终结符的First集和Follow集。重要规范：First集和Follow集只需要为【非终结符】填写，终结符不需要填写。',
      _importantNote: 'First集和Follow集只需要为【非终结符】填写，终结符不需要填写。First集包含终结符和可能的ε，Follow集只包含终结符和可能的$（结束符）。',
      sets: {
        firstSets: {
          name: 'First集合',
          description: '每个非终结符的First集，表示该非终结符能推导出的所有终结符串的第一个终结符。注意：只需要为非终结符填写First集，终结符不需要填写。First集包含终结符和可能的ε。',
          data: userData.step2Data.userFirstSets || {},
          _key: '非终结符 -> First集（终结符集合，可能包含ε）',
        },
        followSets: {
          name: 'Follow集合',
          description: '每个非终结符的Follow集，表示在某些句型中可能紧跟在该非终结符后面的终结符。注意：只需要为非终结符填写Follow集，终结符不需要填写。Follow集只包含终结符和可能的$（结束符），不包含ε。',
          data: userData.step2Data.userFollowSets || {},
          _key: '非终结符 -> Follow集（终结符集合，可能包含$，不包含ε）',
        },
      },
      timestamp: userData.step2Data.timestamp,
      completed: true,
    }
  } else {
    data.step2 = {
      stepNumber: 2,
      stepName: 'First & Follow集合计算',
      description: '计算文法中每个非终结符的First集和Follow集。重要规范：First集和Follow集只需要为【非终结符】填写，终结符不需要填写。',
      _importantNote: 'First集和Follow集只需要为【非终结符】填写，终结符不需要填写。First集包含终结符和可能的ε，Follow集只包含终结符和可能的$（结束符）。',
      completed: false,
    }
  }

  // Step 3: LL(1)预测分析表
  if (userData.step3Data) {
    data.step3 = {
      stepNumber: 3,
      stepName: 'LL(1)预测分析表构造',
      description: '根据First集和Follow集构造LL(1)预测分析表',
      table: {
        name: '预测分析表',
        description: '行表示非终结符，列表示终结符，单元格表示使用的产生式',
        data: userData.step3Data.userTable || {},
      },
      timestamp: userData.step3Data.timestamp,
      completed: true,
    }
  } else {
    data.step3 = {
      stepNumber: 3,
      stepName: 'LL(1)预测分析表构造',
      description: '根据First集和Follow集构造LL(1)预测分析表',
      completed: false,
    }
  }

  // Step 4: 输入串分析
  if (userData.step4Data && userData.inputString) {
    data.step4 = {
      stepNumber: 4,
      stepName: '输入串分析',
      description: '使用预测分析表对输入串进行自顶向下的语法分析',
      inputString: userData.inputString,
      analysis: {
        name: '分析步骤',
        description: '预测分析过程的每一步，包括栈状态、剩余输入和动作',
        steps: userData.step4Data.userSteps?.map((step, index) => ({
          stepNumber: index + 1,
          stack: step.stack,
          input: step.input,
        })),
        stepCount: userData.step4Data.userSteps?.length || 0,
      },
      timestamp: userData.step4Data.timestamp,
      completed: true,
    }
  } else {
    data.step4 = {
      stepNumber: 4,
      stepName: '输入串分析',
      description: '使用预测分析表对输入串进行自顶向下的语法分析',
      inputString: userData.inputString || null,
      completed: false,
    }
  }

  return data
}

/**
 * 构建LL1正确答案数据
 */
function buildLL1CorrectData(
  originalData?: LL1AnalysisResult | null,
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
    _totalSteps: 4,
    _isLL1Grammar: originalData.isLL1,

    // Step 1: 文法
    step1: {
      stepNumber: 1,
      stepName: '文法产生式',
      description: '输入的上下文无关文法',
      productions: originalData.formulas_dict || {},
      nonTerminals: originalData.Vn || [],
      terminals: originalData.Vt || [],
      startSymbol: originalData.S,
    },

    // Step 2: First/Follow集
    step2: {
      stepNumber: 2,
      stepName: 'First & Follow集合（标准答案）',
      description: '计算得到的First集和Follow集。重要规范：First集和Follow集只需要为【非终结符】填写，终结符不需要填写。',
      _importantNote: 'First集和Follow集只需要为【非终结符】填写，终结符不需要填写。First集包含终结符和可能的ε，Follow集只包含终结符和可能的$（结束符），不包含ε。',
      sets: {
        firstSets: {
          name: 'First集合（标准答案）',
          description: '每个非终结符的First集。注意：只需要为非终结符填写First集，终结符不需要填写。First集包含终结符和可能的ε。',
          data: originalData.first || {},
          _key: '非终结符 -> First集（终结符集合，可能包含ε）',
        },
        followSets: {
          name: 'Follow集合（标准答案）',
          description: '每个非终结符的Follow集。注意：只需要为非终结符填写Follow集，终结符不需要填写。Follow集只包含终结符和可能的$（结束符），不包含ε。',
          data: originalData.follow || {},
          _key: '非终结符 -> Follow集（终结符集合，可能包含$，不包含ε）',
        },
      },
    },

    // Step 3: 预测分析表
    step3: {
      stepNumber: 3,
      stepName: 'LL(1)预测分析表（标准答案）',
      description: '根据First集和Follow集构造的预测分析表',
      table: {
        name: '预测分析表（标准答案）',
        description: '行表示非终结符，列表示终结符',
        data: originalData.table || {},
      },
    },

    // Step 4: 输入串分析
    step4: {
      stepNumber: 4,
      stepName: '输入串分析（标准答案）',
      description: '使用预测分析表对输入串进行分析的标准步骤',
      analysis: inputAnalysisResult
        ? {
            name: '分析步骤（标准答案）',
            description: '预测分析的标准过程',
            steps: inputAnalysisResult.info_step?.map((stepNum, index) => ({
              stepNumber: stepNum,
              stack: inputAnalysisResult.info_stack?.[index] || '',
              input: inputAnalysisResult.info_str?.[index] || '',
              action: inputAnalysisResult.info_msg?.[index] || '',
            })),
            isAccepted: inputAnalysisResult.info_res === 'Success!',
          }
        : null,
    },
  }
}

/**
 * 使用Store构建LL1报告上下文
 * @param recordId 记录ID
 * @returns 报告上下文或null
 */
export function buildLL1ReportContextFromStore(recordId: string): AIReportContext | null {
  const ll1Store = useLL1Store()
  const record = ll1Store.historyList.find((r) => r.id === recordId)

  if (!record) {
    console.error(`[LL1 AI Report] 找不到记录: ${recordId}`)
    return null
  }

  return buildLL1ReportContext(
    record,
    ll1Store.originalData,
    ll1Store.inputAnalysisResult || undefined
  )
}

// 导出类型
export type { AIReportContext, AIReportContent }
