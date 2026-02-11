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
 * 查询 DeepSeek API 余额
 * @param apiKey DeepSeek API 密钥
 * @returns 余额信息
 */
export const queryDeepSeekBalance = async (apiKey: string): Promise<BalanceResponse | null> => {
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
