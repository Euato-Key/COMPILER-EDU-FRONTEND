/**
 * SLR1 模块 AI 上下文构造层
 * 负责将 SLR1 Store 的数据转换为 AI 可用的上下文格式
 */

import type {
  AIAnswerContext,
  AIUserInput,
  AIUserAnswers,
  AICorrectAnswers,
  AIErrorLogEntry,
  AIBackendData,
} from '@/types/ai-context'
import type { SLR1StoreData, SLR1ErrorLog } from './slr1-new'
import type { SLR1AnalysisResult, AnalysisStepInfo } from '@/types'

// SLR1 步骤名称映射
const SLR1_STEP_NAMES: Record<number, string> = {
  1: '文法输入',
  2: '增广文法',
  3: 'DFA构造',
  4: 'SLR1分析表',
  5: '字符串分析',
}

// SLR1 步骤的 key 映射
const SLR1_STEP_KEYS: Record<number, string> = {
  1: 'grammarInput',
  2: 'augmentedGrammar',
  3: 'dfaConstruction',
  4: 'slr1Table',
  5: 'stringAnalysis',
}

/**
 * 构建 SLR1 模块的 AI 上下文
 * @param currentStep 当前步骤
 * @param storeData Store 中的数据
 * @param originalData 后端原始数据
 * @param inputAnalysisResult 输入串分析结果
 * @param actionTable Action表
 * @param gotoTable Goto表
 * @param dfaStates DFA状态
 * @param firstSets First集
 * @param followSets Follow集
 * @param errorLogs 错误日志
 * @param recordId 记录ID
 * @returns AI 上下文
 */
export function buildSLR1Context(
  currentStep: number,
  storeData: {
    productions: string[]
    inputString: string
    step2Data?: SLR1StoreData['step2Data']
    step3Data?: SLR1StoreData['step3Data']
    step4Data?: SLR1StoreData['step4Data']
    step5Data?: SLR1StoreData['step5Data']
  },
  originalData: SLR1AnalysisResult | null,
  inputAnalysisResult: AnalysisStepInfo | null,
  actionTable: Record<string, string>,
  gotoTable: Record<string, string>,
  dfaStates: any[],
  firstSets: Record<string, string[]>,
  followSets: Record<string, string[]>,
  errorLogs: SLR1ErrorLog[],
  recordId: string | null,
): AIAnswerContext {
  return {
    recordId,
    currentStep,
    stepName: SLR1_STEP_NAMES[currentStep] || '未知步骤',
    userInput: getSLR1UserInput(storeData.productions, storeData.inputString),
    userAnswers: getSLR1UserAnswers(currentStep, storeData),
    correctAnswers: getSLR1CorrectAnswers(currentStep, originalData, inputAnalysisResult, actionTable, gotoTable),
    errorLogs: convertSLR1ErrorLogs(errorLogs),
    backendData: getSLR1BackendData(originalData, inputAnalysisResult, dfaStates, firstSets, followSets),
  }
}

/**
 * 获取用户输入
 */
function getSLR1UserInput(productions: string[], inputString: string): AIUserInput {
  return {
    grammar: productions.join('\n'),
    productions,
    inputString,
  }
}

/**
 * 获取用户答题数据
 */
function getSLR1UserAnswers(
  currentStep: number,
  storeData: {
    step2Data?: SLR1StoreData['step2Data']
    step3Data?: SLR1StoreData['step3Data']
    step4Data?: SLR1StoreData['step4Data']
    step5Data?: SLR1StoreData['step5Data']
  },
): AIUserAnswers {
  const answers: AIUserAnswers = {}

  // Step 2: 增广文法
  if (storeData.step2Data) {
    answers.augmentedGrammar = {
      formulas: storeData.step2Data.userAugmentedFormulas,
      validationSuccess: storeData.step2Data.validationSuccess,
      timestamp: storeData.step2Data.timestamp,
    }
  }

  // Step 3: DFA 构造
  if (storeData.step3Data) {
    answers.dfaConstruction = {
      dfaStates: storeData.step3Data.userDfaStates,
      dotItems: storeData.step3Data.userDotItems,
      showAnswer: storeData.step3Data.userShowAnswer,
      dfaState: storeData.step3Data.dfaState,
      timestamp: storeData.step3Data.timestamp,
    }
  }

  // Step 4: SLR1 分析表
  if (storeData.step4Data) {
    answers.slr1Table = {
      actionTable: storeData.step4Data.userActionTable,
      gotoTable: storeData.step4Data.userGotoTable,
      timestamp: storeData.step4Data.timestamp,
    }
  }

  // Step 5: 字符串分析
  if (storeData.step5Data) {
    answers.stringAnalysis = {
      steps: storeData.step5Data.userSteps,
      timestamp: storeData.step5Data.timestamp,
    }
  }

  return answers
}

/**
 * 获取正确答案
 */
function getSLR1CorrectAnswers(
  currentStep: number,
  originalData: SLR1AnalysisResult | null,
  inputAnalysisResult: AnalysisStepInfo | null,
  actionTable: Record<string, string>,
  gotoTable: Record<string, string>,
): AICorrectAnswers {
  if (!originalData) {
    return {}
  }

  const answers: AICorrectAnswers = {}

  // Step 2: 增广文法
  answers.augmentedGrammar = {
    augmentedStart: originalData.augmented_start,
    formulas: originalData.formulas,
  }

  // Step 3: DFA 构造
  answers.dfaConstruction = {
    dfaStates: originalData.dfa_states,
    dotItems: originalData.dot_items,
    dotString: originalData.dot_string,
  }

  // Step 4: SLR1 分析表
  answers.slr1Table = {
    actionTable,
    gotoTable,
    isSLR1: originalData.is_slr1,
  }

  // Step 5: 字符串分析
  answers.stringAnalysis = {
    analysisSteps: inputAnalysisResult?.steps || [],
    isSuccess: inputAnalysisResult?.isSuccess ?? null,
    result: inputAnalysisResult?.result || null,
  }

  return answers
}

/**
 * 转换错误日志格式
 */
function convertSLR1ErrorLogs(errorLogs: SLR1ErrorLog[]): AIErrorLogEntry[] {
  return errorLogs.map((log) => ({
    step: log.step,
    type: log.type,
    location: log.location,
    wrongValue: log.wrongValue,
    correctValue: log.correctValue,
    hint: log.hint,
    timestamp: new Date(log.timestamp).getTime(),
  }))
}

/**
 * 获取后端数据
 */
function getSLR1BackendData(
  originalData: SLR1AnalysisResult | null,
  inputAnalysisResult: AnalysisStepInfo | null,
  dfaStates: any[],
  firstSets: Record<string, string[]>,
  followSets: Record<string, string[]>,
): AIBackendData {
  if (!originalData) {
    return {}
  }

  return {
    // 文法信息
    grammar: {
      productions: originalData.formulas_dict,
      nonTerminals: originalData.Vn,
      terminals: originalData.Vt,
      startSymbol: originalData.S,
      augmentedStart: originalData.augmented_start,
    },
    // First/Follow 集
    firstFollow: {
      firstSets,
      followSets,
    },
    // DFA 信息
    dfa: {
      states: dfaStates,
      dotItems: originalData.dot_items,
      dotString: originalData.dot_string,
    },
    // 分析表
    parsingTable: {
      actionTable: originalData.action_table,
      gotoTable: originalData.goto_table,
      isSLR1: originalData.is_slr1,
    },
    // 输入串分析结果
    inputAnalysis: inputAnalysisResult
      ? {
          steps: inputAnalysisResult.steps,
          isSuccess: inputAnalysisResult.isSuccess,
          result: inputAnalysisResult.result,
        }
      : null,
  }
}

/**
 * 获取当前步骤的用户答题数据（用于快速查看）
 */
export function getCurrentStepUserAnswer(
  currentStep: number,
  storeData: {
    step2Data?: SLR1StoreData['step2Data']
    step3Data?: SLR1StoreData['step3Data']
    step4Data?: SLR1StoreData['step4Data']
    step5Data?: SLR1StoreData['step5Data']
  },
): any {
  const answers = getSLR1UserAnswers(currentStep, storeData)
  const stepKey = SLR1_STEP_KEYS[currentStep]
  return stepKey ? answers[stepKey] : null
}

/**
 * 获取当前步骤的正确答案（用于快速查看）
 */
export function getCurrentStepCorrectAnswer(
  currentStep: number,
  originalData: SLR1AnalysisResult | null,
  inputAnalysisResult: AnalysisStepInfo | null,
  actionTable: Record<string, string>,
  gotoTable: Record<string, string>,
): any {
  const answers = getSLR1CorrectAnswers(currentStep, originalData, inputAnalysisResult, actionTable, gotoTable)
  const stepKey = SLR1_STEP_KEYS[currentStep]
  return stepKey ? answers[stepKey] : null
}

/**
 * 获取步骤相关的错误日志
 */
export function getStepRelatedErrorLogs(
  currentStep: number,
  errorLogs: SLR1ErrorLog[],
): SLR1ErrorLog[] {
  const stepMap: Record<number, string> = {
    2: 'step2',
    3: 'step3',
    4: 'step4',
    5: 'step5',
  }

  const stepKey = stepMap[currentStep]
  if (!stepKey) {
    return []
  }

  return errorLogs.filter((log) => log.step === stepKey)
}
