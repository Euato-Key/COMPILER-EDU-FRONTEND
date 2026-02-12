/**
 * AI 上下文构造层统一类型定义
 * 用于各模块构建传递给 AI 的上下文数据
 */

// 错误日志条目
export interface AIErrorLogEntry {
  step: string
  type: string
  location: any
  wrongValue: string
  correctValue: string
  hint?: string
  timestamp?: number
}

// 用户答题数据（各模块自定义）
export interface AIUserAnswers {
  [stepName: string]: any
}

// 正确答案数据
export interface AICorrectAnswers {
  [stepName: string]: any
}

// 用户输入数据
export interface AIUserInput {
  [key: string]: any
}

// 后端原始数据
export interface AIBackendData {
  [key: string]: any
}

// 统一的 AI 上下文数据结构
export interface AIAnswerContext {
  // 基础信息
  recordId: string | null
  currentStep: number
  stepName: string

  // 用户输入
  userInput: AIUserInput

  // 用户答题数据（各模块不同）
  userAnswers: AIUserAnswers

  // 正确答案（后端数据）
  correctAnswers: AICorrectAnswers

  // 错误记录
  errorLogs: AIErrorLogEntry[]

  // 后端原始数据（完整）
  backendData: AIBackendData
}

// AI 上下文构造器接口
export interface AIContextBuilder<T extends AIAnswerContext = AIAnswerContext> {
  // 构建完整的 AI 上下文
  buildContext(currentStep: number): T

  // 获取用户输入
  getUserInput(): AIUserInput

  // 获取用户答题数据
  getUserAnswers(currentStep: number): AIUserAnswers

  // 获取正确答案
  getCorrectAnswers(currentStep: number): AICorrectAnswers

  // 获取错误日志
  getErrorLogs(): AIErrorLogEntry[]

  // 获取后端数据
  getBackendData(): AIBackendData
}

// 构造器配置选项
export interface AIContextBuilderOptions {
  // 是否包含详细的后端数据
  includeBackendData?: boolean

  // 是否包含错误日志
  includeErrorLogs?: boolean

  // 错误日志最大数量
  maxErrorLogs?: number

  // 自定义字段
  customFields?: Record<string, any>
}
