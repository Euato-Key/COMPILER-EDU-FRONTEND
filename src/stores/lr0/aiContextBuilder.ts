/**
 * LR0 模块 AI 上下文构造层
 * 负责将 LR0 Store 的数据转换为 AI 可用的上下文格式
 */

import type {
  AIAnswerContext,
  AIUserInput,
  AIUserAnswers,
  AICorrectAnswers,
  AIErrorLogEntry,
  AIBackendData,
} from '@/types/ai-context'
import type { LR0StoreData, LR0ErrorLog } from './lr0-new'
import type { LR0AnalysisResult, AnalysisStepInfo } from '@/types'

// LR0 步骤名称映射
const LR0_STEP_NAMES: Record<number, string> = {
  1: '文法输入',
  2: '增广文法',
  3: 'DFA构造',
  4: 'LR0分析表',
  5: '字符串分析',
}

// LR0 步骤的 key 映射
const LR0_STEP_KEYS: Record<number, string> = {
  1: 'grammarInput',
  2: 'augmentedGrammar',
  3: 'dfaConstruction',
  4: 'lr0Table',
  5: 'stringAnalysis',
}

/**
 * 构建 LR0 模块的 AI 上下文
 * @param currentStep 当前步骤
 * @param storeData Store 中的数据
 * @param originalData 后端原始数据
 * @param inputAnalysisResult 输入串分析结果
 * @param actionTable Action表
 * @param gotoTable Goto表
 * @param dfaStates DFA状态
 * @param errorLogs 错误日志
 * @param recordId 记录ID
 * @returns AI 上下文
 */
export function buildLR0Context(
  currentStep: number,
  storeData: {
    productions: string[]
    inputString: string
    step2Data?: LR0StoreData['step2Data']
    step3Data?: LR0StoreData['step3Data']
    step4Data?: LR0StoreData['step4Data']
    step5Data?: LR0StoreData['step5Data']
  },
  originalData: LR0AnalysisResult | null,
  inputAnalysisResult: AnalysisStepInfo | null,
  actionTable: Record<string, string>,
  gotoTable: Record<string, string>,
  dfaStates: any[],
  errorLogs: LR0ErrorLog[],
  recordId: string | null,
): AIAnswerContext {
  return {
    recordId,
    currentStep,
    stepName: LR0_STEP_NAMES[currentStep] || '未知步骤',
    userInput: getLR0UserInput(storeData.productions, storeData.inputString),
    userAnswers: getLR0UserAnswers(currentStep, storeData),
    correctAnswers: getLR0CorrectAnswers(currentStep, originalData, inputAnalysisResult, actionTable, gotoTable),
    errorLogs: convertLR0ErrorLogs(errorLogs),
    backendData: getLR0BackendData(originalData, inputAnalysisResult, dfaStates),
  }
}

/**
 * 获取用户输入
 */
function getLR0UserInput(productions: string[], inputString: string): AIUserInput {
  return {
    grammar: productions.join('\n'),
    productions,
    inputString,
  }
}

/**
 * 获取用户答题数据
 */
function getLR0UserAnswers(
  currentStep: number,
  storeData: {
    step2Data?: LR0StoreData['step2Data']
    step3Data?: LR0StoreData['step3Data']
    step4Data?: LR0StoreData['step4Data']
    step5Data?: LR0StoreData['step5Data']
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

  // Step 4: LR0 分析表
  if (storeData.step4Data) {
    answers.lr0Table = {
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
function getLR0CorrectAnswers(
  currentStep: number,
  originalData: LR0AnalysisResult | null,
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

  // Step 4: LR0 分析表
  answers.lr0Table = {
    actionTable,
    gotoTable,
    isLR0: originalData.is_lr0,
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
function convertLR0ErrorLogs(errorLogs: LR0ErrorLog[]): AIErrorLogEntry[] {
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
function getLR0BackendData(
  originalData: LR0AnalysisResult | null,
  inputAnalysisResult: AnalysisStepInfo | null,
  dfaStates: any[],
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
      isLR0: originalData.is_lr0,
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
    step2Data?: LR0StoreData['step2Data']
    step3Data?: LR0StoreData['step3Data']
    step4Data?: LR0StoreData['step4Data']
    step5Data?: LR0StoreData['step5Data']
  },
): any {
  const answers = getLR0UserAnswers(currentStep, storeData)
  const stepKey = LR0_STEP_KEYS[currentStep]
  return stepKey ? answers[stepKey] : null
}

/**
 * 获取当前步骤的正确答案（用于快速查看）
 */
export function getCurrentStepCorrectAnswer(
  currentStep: number,
  originalData: LR0AnalysisResult | null,
  inputAnalysisResult: AnalysisStepInfo | null,
  actionTable: Record<string, string>,
  gotoTable: Record<string, string>,
): any {
  const answers = getLR0CorrectAnswers(currentStep, originalData, inputAnalysisResult, actionTable, gotoTable)
  const stepKey = LR0_STEP_KEYS[currentStep]
  return stepKey ? answers[stepKey] : null
}

/**
 * 获取步骤相关的错误日志
 */
export function getStepRelatedErrorLogs(
  currentStep: number,
  errorLogs: LR0ErrorLog[],
): LR0ErrorLog[] {
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
