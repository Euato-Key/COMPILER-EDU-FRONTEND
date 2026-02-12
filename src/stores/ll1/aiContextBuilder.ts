/**
 * LL1 模块 AI 上下文构造层
 * 负责将 LL1 Store 的数据转换为 AI 可用的上下文格式
 */

import type {
  AIAnswerContext,
  AIUserInput,
  AIUserAnswers,
  AICorrectAnswers,
  AIErrorLogEntry,
  AIBackendData,
} from '@/types/ai-context'
import type { LL1StoreData, LL1ErrorLog } from './ll1-new'
import type { LL1AnalysisResult, AnalysisStepInfo } from '@/types/ll1'

// LL1 步骤名称映射
const LL1_STEP_NAMES: Record<number, string> = {
  1: '文法输入',
  2: 'First/Follow集',
  3: 'LL1分析表',
  4: '字符串分析',
}

// LL1 步骤的 key 映射
const LL1_STEP_KEYS: Record<number, string> = {
  1: 'grammarInput',
  2: 'firstFollowSets',
  3: 'll1Table',
  4: 'stringAnalysis',
}

/**
 * 构建 LL1 模块的 AI 上下文
 * @param currentStep 当前步骤
 * @param storeData Store 中的数据
 * @param originalData 后端原始数据
 * @param inputAnalysisResult 输入串分析结果
 * @param errorLogs 错误日志
 * @param recordId 记录ID
 * @returns AI 上下文
 */
export function buildLL1Context(
  currentStep: number,
  storeData: {
    productions: string[]
    inputString: string
    step2Data?: LL1StoreData['step2Data']
    step3Data?: LL1StoreData['step3Data']
    step4Data?: LL1StoreData['step4Data']
  },
  originalData: LL1AnalysisResult | null,
  inputAnalysisResult: AnalysisStepInfo | null,
  errorLogs: LL1ErrorLog[],
  recordId: string | null,
): AIAnswerContext {
  return {
    recordId,
    currentStep,
    stepName: LL1_STEP_NAMES[currentStep] || '未知步骤',
    userInput: getLL1UserInput(storeData.productions, storeData.inputString),
    userAnswers: getLL1UserAnswers(currentStep, storeData),
    correctAnswers: getLL1CorrectAnswers(currentStep, originalData, inputAnalysisResult),
    errorLogs: convertLL1ErrorLogs(errorLogs),
    backendData: getLL1BackendData(originalData, inputAnalysisResult),
  }
}

/**
 * 获取用户输入
 */
function getLL1UserInput(productions: string[], inputString: string): AIUserInput {
  return {
    grammar: productions.join('\n'),
    productions,
    inputString,
  }
}

/**
 * 获取用户答题数据
 */
function getLL1UserAnswers(
  currentStep: number,
  storeData: {
    step2Data?: LL1StoreData['step2Data']
    step3Data?: LL1StoreData['step3Data']
    step4Data?: LL1StoreData['step4Data']
  },
): AIUserAnswers {
  const answers: AIUserAnswers = {}

  // Step 2: First/Follow 集
  if (storeData.step2Data) {
    answers.firstFollowSets = {
      firstSets: storeData.step2Data.userFirstSets,
      followSets: storeData.step2Data.userFollowSets,
      timestamp: storeData.step2Data.timestamp,
    }
  }

  // Step 3: LL1 分析表
  if (storeData.step3Data) {
    answers.ll1Table = {
      table: storeData.step3Data.userTable,
      timestamp: storeData.step3Data.timestamp,
    }
  }

  // Step 4: 字符串分析步骤
  if (storeData.step4Data) {
    answers.stringAnalysis = {
      steps: storeData.step4Data.userSteps,
      timestamp: storeData.step4Data.timestamp,
    }
  }

  return answers
}

/**
 * 获取正确答案
 */
function getLL1CorrectAnswers(
  currentStep: number,
  originalData: LL1AnalysisResult | null,
  inputAnalysisResult: AnalysisStepInfo | null,
): AICorrectAnswers {
  if (!originalData) {
    return {}
  }

  const answers: AICorrectAnswers = {}

  // Step 2: First/Follow 集
  answers.firstFollowSets = {
    firstSets: originalData.first,
    followSets: originalData.follow,
  }

  // Step 3: LL1 分析表
  answers.ll1Table = {
    table: originalData.table,
    isLL1: originalData.isLL1,
  }

  // Step 4: 字符串分析
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
function convertLL1ErrorLogs(errorLogs: LL1ErrorLog[]): AIErrorLogEntry[] {
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
function getLL1BackendData(
  originalData: LL1AnalysisResult | null,
  inputAnalysisResult: AnalysisStepInfo | null,
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
    },
    // First/Follow 集
    firstFollow: {
      firstSets: originalData.first,
      followSets: originalData.follow,
    },
    // 分析表
    parsingTable: {
      table: originalData.table,
      isLL1: originalData.isLL1,
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
    step2Data?: LL1StoreData['step2Data']
    step3Data?: LL1StoreData['step3Data']
    step4Data?: LL1StoreData['step4Data']
  },
): any {
  const answers = getLL1UserAnswers(currentStep, storeData)
  const stepKey = LL1_STEP_KEYS[currentStep]
  return stepKey ? answers[stepKey] : null
}

/**
 * 获取当前步骤的正确答案（用于快速查看）
 */
export function getCurrentStepCorrectAnswer(
  currentStep: number,
  originalData: LL1AnalysisResult | null,
  inputAnalysisResult: AnalysisStepInfo | null,
): any {
  const answers = getLL1CorrectAnswers(currentStep, originalData, inputAnalysisResult)
  const stepKey = LL1_STEP_KEYS[currentStep]
  return stepKey ? answers[stepKey] : null
}

/**
 * 获取步骤相关的错误日志
 */
export function getStepRelatedErrorLogs(
  currentStep: number,
  errorLogs: LL1ErrorLog[],
): LL1ErrorLog[] {
  const stepMap: Record<number, string> = {
    2: 'step2',
    3: 'step3',
    4: 'step4',
  }

  const stepKey = stepMap[currentStep]
  if (!stepKey) {
    return []
  }

  return errorLogs.filter((log) => log.step === stepKey)
}
