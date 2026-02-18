/**
 * FA 模块 AI 上下文构造层
 * 负责将 FA Store 的数据转换为 AI 可用的上下文格式
 */

import type {
  AIAnswerContext,
  AIUserInput,
  AIUserAnswers,
  AICorrectAnswers,
  AIErrorLogEntry,
  AIBackendData,
} from '@/types/ai-context'
import type { FAStoreData, FAErrorLog } from './fa-new'
import type { FAResult } from '@/types'
import { faToDot } from '@/utils/fa-to-dot'

// FA 步骤名称映射
const FA_STEP_NAMES: Record<number, string> = {
  1: '正则表达式输入',
  2: 'NFA构造',
  3: '子集构造',
  4: 'DFA构造',
  5: 'DFA最小化',
  6: '最小化DFA图',
}

// FA 步骤的 key 映射
const FA_STEP_KEYS: Record<number, string> = {
  1: 'regexInput',
  2: 'nfaDraw',
  3: 'subsetConstruction',
  4: 'dfaDraw',
  5: 'dfaMinimization',
  6: 'minimizedDfaDraw',
}

/**
 * 构建 FA 模块的 AI 上下文
 * @param currentStep 当前步骤
 * @param storeData Store 中的数据
 * @param originalData 后端原始数据
 * @param errorLogs 错误日志
 * @param recordId 记录ID
 * @returns AI 上下文
 */
export function buildFAContext(
  currentStep: number,
  storeData: {
    inputRegex: string
    canvasData: FAStoreData['canvasData']
    step3Data?: FAStoreData['step3Data']
    step5Data?: FAStoreData['step5Data']
  },
  originalData: FAResult | null,
  errorLogs: FAErrorLog[],
  recordId: string | null,
): AIAnswerContext {
  return {
    recordId,
    currentStep,
    stepName: FA_STEP_NAMES[currentStep] || '未知步骤',
    userInput: getFAUserInput(storeData.inputRegex),
    userAnswers: getFAUserAnswers(currentStep, storeData),
    correctAnswers: getFACorrectAnswers(currentStep, originalData),
    errorLogs: convertFAErrorLogs(errorLogs),
    backendData: getFABackendData(originalData),
  }
}

/**
 * 获取用户输入
 */
function getFAUserInput(inputRegex: string): AIUserInput {
  return {
    regex: inputRegex,
  }
}

/**
 * 获取用户答题数据
 */
function getFAUserAnswers(
  currentStep: number,
  storeData: {
    canvasData: FAStoreData['canvasData']
    step3Data?: FAStoreData['step3Data']
    step5Data?: FAStoreData['step5Data']
  },
): AIUserAnswers {
  const answers: AIUserAnswers = {}

  // Step 2: NFA 画布
  if (storeData.canvasData.step2) {
    const nodes = storeData.canvasData.step2.nodes || []
    const edges = storeData.canvasData.step2.edges || []
    const dotString = nodes.length > 0 ? faToDot(nodes, edges) : ''
    answers.nfaDraw = {
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
      nodeCount: nodes.length,
      edgeCount: edges.length,
      dotRepresentation: dotString,
      timestamp: storeData.canvasData.step2.timestamp,
    }
  }

  // Step 3: 子集构造表格
  if (storeData.step3Data) {
    answers.subsetConstruction = {
      conversionTable: storeData.step3Data.userConversionTable,
      transitionMatrix: storeData.step3Data.userTransitionMatrix,
      rowCount: storeData.step3Data.conversionTableRowCount,
    }
  }

  // Step 4: DFA 画布
  if (storeData.canvasData.step4) {
    const nodes = storeData.canvasData.step4.nodes || []
    const edges = storeData.canvasData.step4.edges || []
    const dotString = nodes.length > 0 ? faToDot(nodes, edges) : ''
    answers.dfaDraw = {
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
      nodeCount: nodes.length,
      edgeCount: edges.length,
      dotRepresentation: dotString,
      timestamp: storeData.canvasData.step4.timestamp,
    }
  }

  // Step 5: DFA 最小化
  if (storeData.step5Data) {
    answers.dfaMinimization = {
      pSets: storeData.step5Data.userPSets,
      minimizedMatrix: storeData.step5Data.userMinimizedMatrix,
    }
  }

  // Step 6: 最小化 DFA 画布
  if (storeData.canvasData.step6) {
    const nodes = storeData.canvasData.step6.nodes || []
    const edges = storeData.canvasData.step6.edges || []
    const dotString = nodes.length > 0 ? faToDot(nodes, edges) : ''
    answers.minimizedDfaDraw = {
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
      nodeCount: nodes.length,
      edgeCount: edges.length,
      dotRepresentation: dotString,
      timestamp: storeData.canvasData.step6.timestamp,
    }
  }

  return answers
}

/**
 * 获取正确答案
 */
function getFACorrectAnswers(
  currentStep: number,
  originalData: FAResult | null,
): AICorrectAnswers {
  if (!originalData) {
    return {}
  }

  const answers: AICorrectAnswers = {}

  // Step 2: NFA 数据
  answers.nfaDraw = {
    dotString: originalData.NFA_dot_str,
    table: originalData.table,
  }

  // Step 3: 子集构造
  answers.subsetConstruction = {
    table: originalData.table,
    dfaTable: originalData.table_to_num,
  }

  // Step 4: DFA 数据
  answers.dfaDraw = {
    dotString: originalData.DFA_dot_str,
    table: originalData.table_to_num,
  }

  // Step 5: DFA 最小化
  answers.dfaMinimization = {
    partitions: originalData.P,
    partitionChanges: originalData.P_change,
  }

  // Step 6: 最小化 DFA
  answers.minimizedDfaDraw = {
    dotString: originalData.Min_DFA_dot_str,
    table: originalData.table_to_num_min,
  }

  return answers
}

/**
 * 转换错误日志格式
 */
function convertFAErrorLogs(errorLogs: FAErrorLog[]): AIErrorLogEntry[] {
  return errorLogs.map((log) => ({
    step: log.step,
    type: log.tableType,
    location: log.location,
    wrongValue: log.wrongValue,
    correctValue: log.correctValue,
    timestamp: new Date(log.timestamp).getTime(),
  }))
}

/**
 * 获取后端数据
 */
function getFABackendData(originalData: FAResult | null): AIBackendData {
  if (!originalData) {
    return {}
  }

  return {
    // NFA 相关
    nfa: {
      dotString: originalData.NFA_dot_str,
      table: originalData.table,
    },
    // DFA 相关
    dfa: {
      dotString: originalData.DFA_dot_str,
      table: originalData.table_to_num,
    },
    // 最小化 DFA 相关
    minDfa: {
      dotString: originalData.Min_DFA_dot_str,
      table: originalData.table_to_num_min,
      partitions: originalData.P,
      partitionChanges: originalData.P_change,
    },
  }
}

/**
 * 获取当前步骤的用户答题数据（用于快速查看）
 */
export function getCurrentStepUserAnswer(
  currentStep: number,
  storeData: {
    canvasData: FAStoreData['canvasData']
    step3Data?: FAStoreData['step3Data']
    step5Data?: FAStoreData['step5Data']
  },
): any {
  const answers = getFAUserAnswers(currentStep, storeData)
  const stepKey = FA_STEP_KEYS[currentStep]
  return stepKey ? answers[stepKey] : null
}

/**
 * 获取当前步骤的正确答案（用于快速查看）
 */
export function getCurrentStepCorrectAnswer(
  currentStep: number,
  originalData: FAResult | null,
): any {
  const answers = getFACorrectAnswers(currentStep, originalData)
  const stepKey = FA_STEP_KEYS[currentStep]
  return stepKey ? answers[stepKey] : null
}

/**
 * 获取步骤相关的错误日志
 */
export function getStepRelatedErrorLogs(
  currentStep: number,
  errorLogs: FAErrorLog[],
): FAErrorLog[] {
  const stepMap: Record<number, string> = {
    3: 'step3',
    5: 'step5',
  }

  const stepKey = stepMap[currentStep]
  if (!stepKey) {
    return []
  }

  return errorLogs.filter((log) => log.step === stepKey)
}
