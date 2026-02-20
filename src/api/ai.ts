import request from '@/lib/request'
import type { ApiResponse } from '@/types'

// 本地存储键名
const ADMIN_PASSWORD_KEY = 'ai_admin_password'

/**
 * 获取保存的管理员密码
 * @returns 密码或 null
 */
export const getStoredPassword = (): string | null => {
  return localStorage.getItem(ADMIN_PASSWORD_KEY)
}

/**
 * 保存管理员密码到本地存储
 * @param password 密码
 */
export const storePassword = (password: string): void => {
  localStorage.setItem(ADMIN_PASSWORD_KEY, password)
}

/**
 * 清除保存的管理员密码
 */
export const clearStoredPassword = (): void => {
  localStorage.removeItem(ADMIN_PASSWORD_KEY)
}

/**
 * 从后端获取 API 密钥
 * @param password 管理员密码
 * @returns API 密钥
 */
export const getApiKey = (password: string) => {
  return request.get<ApiResponse<{ api_key: string }>>('/api/getApiKey', {
    headers: {
      'X-Admin-Password': password
    }
  })
}

/**
 * 更新 API 密钥
 * @param oldPassword 原密码
 * @param newApiKey 新 API 密钥
 * @param newPassword 新密码（可选）
 * @returns 更新结果
 */
export const updateApiKey = (
  oldPassword: string,
  newApiKey: string,
  newPassword?: string
) => {
  return request.post<ApiResponse<{ api_key_updated: boolean; password_updated: boolean }>>(
    '/api/updateApiKey',
    {
      old_password: oldPassword,
      new_api_key: newApiKey,
      ...(newPassword && { new_password: newPassword })
    }
  )
}

/**
 * 更新管理员密码
 * @param oldPassword 原密码
 * @param newPassword 新密码
 * @returns 更新结果
 */
export const updateAdminPassword = (oldPassword: string, newPassword: string) => {
  return request.post<ApiResponse>('/api/updateAdminPassword', {
    old_password: oldPassword,
    new_password: newPassword
  })
}

/**
 * 获取 API 密钥（优先使用本地存储的密码）
 * @returns API 密钥或 null
 */
export const getApiKeyWithStoredPassword = async (): Promise<string | null> => {
  const password = getStoredPassword()
  if (!password) {
    return null
  }

  try {
    const res = await getApiKey(password)
    if (res.data.code === 0) {
      return res.data.data?.api_key || null
    }
    // 密码错误，清除本地存储
    if (res.data.code === 403) {
      clearStoredPassword()
    }
    return null
  } catch (error) {
    console.error('获取 API 密钥失败:', error)
    return null
  }
}

// 余额信息接口
export interface BalanceInfo {
  currency: string
  total_balance: string
  granted_balance: string
  topped_up_balance: string
}

export interface BalanceResponse {
  is_available: boolean
  balance_infos: BalanceInfo[]
}

/**
 * 查询 DeepSeek API 余额（通过后端代理，更安全）
 * @returns 余额信息
 */
export const queryDeepSeekBalance = async (): Promise<BalanceResponse | null> => {
  try {
    const response = await request.get<ApiResponse<BalanceResponse>>('/api/ai/balance')

    if (response.data.code === 0) {
      return response.data.data || null
    }
    console.error('查询余额失败:', response.data.msg)
    return null
  } catch (error) {
    console.error('查询余额请求失败:', error)
    return null
  }
}

/**
 * 查询 DeepSeek API 余额（直接请求，需要 API Key）
 * @param apiKey DeepSeek API 密钥
 * @returns 余额信息
 * @deprecated 请使用 queryDeepSeekBalance() 通过后端代理查询
 */
export const queryDeepSeekBalanceDirect = async (apiKey: string): Promise<BalanceResponse | null> => {
  try {
    const response = await fetch('https://api.deepseek.com/user/balance', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    })

    if (!response.ok) {
      console.error('查询余额失败:', response.status, response.statusText)
      return null
    }

    const data: BalanceResponse = await response.json()
    return data
  } catch (error) {
    console.error('查询余额请求失败:', error)
    return null
  }
}

// Token 用量统计接口
export interface TokenUsageSummary {
  total_requests: number
  total_input_tokens: number
  total_output_tokens: number
  total_tokens: number
}

export interface ModuleTokenStat {
  module: string
  requests: number
  input_tokens: number
  output_tokens: number
  total_tokens: number
}

export interface DailyTokenStat {
  date: string
  requests: number
  total_tokens: number
}

export interface ModelTokenStat {
  model: string
  requests: number
  total_tokens: number
}

export interface TokenUsageResponse {
  summary: TokenUsageSummary
  module_stats: ModuleTokenStat[]
  daily_stats: DailyTokenStat[]
  model_stats: ModelTokenStat[]
  date_range: {
    start_date: string
    end_date: string
  }
}

/**
 * 获取 Token 使用统计
 * @param params 查询参数
 * @returns Token 用量统计
 */
export const getTokenUsage = async (params?: {
  start_date?: string
  end_date?: string
  module?: string
}): Promise<TokenUsageResponse | null> => {
  try {
    const response = await request.get<ApiResponse<TokenUsageResponse>>('/api/ai/token-usage', {
      params
    })

    if (response.data.code === 0) {
      return response.data.data || null
    }
    console.error('获取 Token 用量失败:', response.data.msg)
    return null
  } catch (error) {
    console.error('获取 Token 用量请求失败:', error)
    return null
  }
}

// AI 聊天请求参数
export interface AIChatRequest {
  messages: Array<{
    role: 'system' | 'user' | 'assistant'
    content: string
  }>
  model?: string
  temperature?: number
  max_tokens?: number
  response_format?: { type: string }
  top_p?: number
  frequency_penalty?: number
  presence_penalty?: number
  thinking?: { type: 'enabled' | 'disabled' }
  module?: string
}

// AI 聊天响应
export interface AIChatResponse {
  id: string
  object: string
  created: number
  model: string
  choices: Array<{
    index: number
    message: {
      role: string
      content: string
      reasoning_content?: string
    }
    finish_reason: string
  }>
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

/**
 * 发送 AI 聊天请求（非流式，通过后端代理）
 * @param data 请求参数
 * @returns AI 响应
 */
export const sendAIChat = async (data: AIChatRequest): Promise<AIChatResponse | null> => {
  try {
    const response = await request.post<ApiResponse<AIChatResponse>>('/api/ai/chat', data)

    if (response.data.code === 0) {
      return response.data.data || null
    }
    console.error('AI 聊天请求失败:', response.data.msg)
    return null
  } catch (error) {
    console.error('AI 聊天请求失败:', error)
    return null
  }
}

/**
 * 发送 AI 聊天请求（流式，通过后端代理）
 * @param data 请求参数
 * @returns Response 对象，需要自行处理流
 */
export const sendAIChatStream = async (data: AIChatRequest): Promise<Response | null> => {
  try {
    const response = await fetch('/api/ai/chat/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      console.error('AI 流式请求失败:', response.status)
      return null
    }

    return response
  } catch (error) {
    console.error('AI 流式请求失败:', error)
    return null
  }
}
