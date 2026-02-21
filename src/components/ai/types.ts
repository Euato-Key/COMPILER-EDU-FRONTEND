 // AI聊天相关的类型定义
export interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
  reasoningContent?: string  // 深度思考内容
  timestamp?: number
}

// 错误日志条目
export interface ChatErrorLogEntry {
  step: string
  type: string
  location: any
  wrongValue: string
  correctValue: string
  timestamp?: number
}

export interface ChatContext {
  currentPage: string
  userInput?: Record<string, any>
  backendData?: Record<string, any>
  userAnswers?: Record<string, any>
  correctAnswers?: Record<string, any>
  errorLogs?: ChatErrorLogEntry[]
  pageContext?: string
  recordId?: string | null
  currentStep?: number
  stepName?: string
}

export interface AIConfig {
  apiKey: string
  baseURL: string
  model: string
  temperature?: number
  maxTokens?: number
  stream?: boolean
}

export interface AIResponse {
  content: string
  isStreaming: boolean
  error?: string
}
