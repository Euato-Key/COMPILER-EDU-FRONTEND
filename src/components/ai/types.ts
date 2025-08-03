 // AI聊天相关的类型定义
export interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
  timestamp?: number
}

export interface ChatContext {
  currentPage: string
  userInput?: Record<string, any>
  backendData?: Record<string, any>
  userAnswers?: Record<string, any>
  pageContext?: string
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
