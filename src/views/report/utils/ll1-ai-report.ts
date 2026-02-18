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
    _description: '学生LL(1)语法分析答题数据',
    _totalSteps: 4,
    _learningObjectives: [
      '理解LL(1)文法的定义和判定条件',
      '掌握First集和Follow集的计算方法',
      '理解预测分析表的构造原理',
      '掌握基于预测分析表的自顶向下语法分析过程'
    ]
  }

  // Step 1: 文法产生式输入
  data.step1 = {
    stepNumber: 1,
    stepName: '文法产生式输入',
    description: '学生输入的上下文无关文法产生式，要求消除左递归并提取左公因子',
    keyPoints: [
      '文法必须满足LL(1)条件',
      '需要消除左递归',
      '需要提取左公因子',
      '产生式格式：非终结符->产生式右部'
    ],
    productions: productions || [],
    grammar: record.grammar,
    completed: true,
  }

  // Step 2: First/Follow集
  if (userData.step2Data) {
    const firstSets = userData.step2Data.userFirstSets || {}
    const followSets = userData.step2Data.userFollowSets || {}
    
    data.step2 = {
      stepNumber: 2,
      stepName: 'First & Follow集合计算',
      description: '计算文法中每个非终结符的First集和Follow集，这是构造预测分析表的基础',
      keyPoints: [
        'First集：非终结符能推导出的所有终结符串的第一个终结符集合',
        'Follow集：在所有句型中可能紧跟在非终结符后面的终结符集合',
        '只需要为非终结符填写First集和Follow集',
        'First集可能包含ε（空串），Follow集不包含ε但可能包含#（结束符）'
      ],
      firstSets: {
        name: 'First集合',
        description: '每个非终结符的First集，表示该非终结符能推导出的所有终结符串的第一个终结符',
        data: firstSets,
        format: '非终结符 -> {终结符集合，可能包含ε}',
        example: 'E -> {(,i} 表示E可以推导出以"("或"i"开头的串'
      },
      followSets: {
        name: 'Follow集合',
        description: '每个非终结符的Follow集，表示在某些句型中可能紧跟在该非终结符后面的终结符',
        data: followSets,
        format: '非终结符 -> {终结符集合，可能包含$，不包含ε}',
        example: 'E -> {),$} 表示在某些句型中E后面可以跟")"或结束符$'
      },
      timestamp: userData.step2Data.timestamp,
      completed: true,
    }
  } else {
    data.step2 = {
      stepNumber: 2,
      stepName: 'First & Follow集合计算',
      description: '计算文法中每个非终结符的First集和Follow集',
      keyPoints: [
        'First集：非终结符能推导出的所有终结符串的第一个终结符集合',
        'Follow集：在某些句型中可能紧跟在非终结符后面的终结符集合'
      ],
      completed: false,
    }
  }

  // Step 3: LL(1)预测分析表
  if (userData.step3Data) {
    const userTable = userData.step3Data.userTable || {}
    
    data.step3 = {
      stepNumber: 3,
      stepName: 'LL(1)预测分析表构造',
      description: '根据First集和Follow集构造LL(1)预测分析表，用于指导自顶向下的语法分析',
      keyPoints: [
        '分析表行：非终结符',
        '分析表列：终结符（包括结束符#）',
        'M[A,a] = 产生式：当a∈First(α)或(ε∈First(α)且a∈Follow(A))时',
        '每个单元格最多填入一个产生式（LL(1)文法的特性）'
      ],
      table: {
        name: '预测分析表',
        description: '行表示非终结符，列表示终结符，单元格表示使用的产生式',
        data: userTable,
        format: '非终结符|终结符 -> 产生式',
        example: 'E|( -> E->TG 表示当栈顶是E且输入是"("时，使用产生式E->TG'
      },
      constructionRules: [
        '对于每个产生式A->α，对每个a∈First(α)，置M[A,a] = A->α',
        '如果ε∈First(α)，则对每个b∈Follow(A)，置M[A,b] = A->α',
        '如果ε∈First(α)且$∈Follow(A)，则置M[A,$] = A->α'
      ],
      timestamp: userData.step3Data.timestamp,
      completed: true,
    }
  } else {
    data.step3 = {
      stepNumber: 3,
      stepName: 'LL(1)预测分析表构造',
      description: '根据First集和Follow集构造LL(1)预测分析表',
      keyPoints: [
        '分析表行：非终结符',
        '分析表列：终结符',
        '每个单元格填入对应的产生式'
      ],
      completed: false,
    }
  }

  // Step 4: 输入串分析
  if (userData.step4Data && userData.inputString) {
    const steps = userData.step4Data.userSteps || []
    
    data.step4 = {
      stepNumber: 4,
      stepName: '输入串分析',
      description: '使用预测分析表对输入串进行自顶向下的语法分析，模拟预测分析器的工作过程',
      keyPoints: [
        '分析栈：存放文法符号，栈底为#，栈顶为当前要处理的符号',
        '输入缓冲区：存放待分析的输入串，末尾为#',
        '动作：根据栈顶符号和当前输入符号查表决定下一步动作',
        '接受：当栈顶和输入都为#时，分析成功'
      ],
      inputString: userData.inputString,
      analysis: {
        name: '分析步骤',
        description: '预测分析过程的每一步，包括栈状态、剩余输入和动作',
        steps: steps.map((step, index) => ({
          stepNumber: index + 1,
          stack: step.stack,
          input: step.input,
          explanation: getStepExplanation(step, index)
        })),
        stepCount: steps.length,
        dataStructures: {
          stack: '分析栈，存放文法符号，栈底为#',
          input: '剩余输入串，从当前位置到结束符#',
          action: '根据预测分析表确定的下一步动作'
        }
      },
      commonActions: [
        '匹配：栈顶终结符与当前输入符号相同，两者都弹出',
        '推导：栈顶非终结符，根据分析表用对应产生式右部替换',
        '接受：栈顶和输入都为#，分析成功结束',
        '错误：查表失败，输入串不符合文法'
      ],
      timestamp: userData.step4Data.timestamp,
      completed: true,
    }
  } else {
    data.step4 = {
      stepNumber: 4,
      stepName: '输入串分析',
      description: '使用预测分析表对输入串进行自顶向下的语法分析',
      keyPoints: [
        '分析栈存放文法符号',
        '输入缓冲区存放待分析串',
        '根据分析表确定动作'
      ],
      inputString: userData.inputString || null,
      completed: false,
    }
  }

  return data
}

/**
 * 获取步骤解释
 */
function getStepExplanation(step: { stack: string; input: string }, index: number): string {
  if (index === 0) {
    return '初始状态：分析栈为#S（S为开始符号，#为栈底标记），输入串为待分析字符串后跟结束符#'
  }
  return `第${index + 1}步：根据栈顶符号和当前输入符号查预测分析表确定动作`
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
    _description: 'LL(1)语法分析标准答案数据',
    _totalSteps: 4,
    _isLL1Grammar: originalData.isLL1,
    _grammarProperties: {
      isLL1: originalData.isLL1,
      nonTerminals: originalData.Vn || [],
      terminals: originalData.Vt || [],
      startSymbol: originalData.S,
      productions: originalData.formulas_dict || {}
    },

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
      description: '计算得到的First集和Follow集',
      firstSets: {
        name: 'First集合（标准答案）',
        description: '每个非终结符的First集',
        data: originalData.first || {},
        format: '非终结符 -> [终结符数组，可能包含ε]'
      },
      followSets: {
        name: 'Follow集合（标准答案）',
        description: '每个非终结符的Follow集',
        data: originalData.follow || {},
        format: '非终结符 -> [终结符数组，可能包含$，不包含ε]'
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
        format: '非终结符|终结符 -> 产生式右部'
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
            result: inputAnalysisResult.info_res
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
