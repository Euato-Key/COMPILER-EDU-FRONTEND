/**
 * AI报告LocalStorage存储管理
 * 用于缓存AI生成的报告，避免重复消耗token
 */

import type { AIReportData, AIReportContent } from './types'

// 存储键名前缀
const STORAGE_KEY_PREFIX = 'ai_report_'
// 存储版本号
const STORAGE_VERSION = '1.0.0'
// 缓存有效期（7天）
const CACHE_EXPIRY_DAYS = 7

/**
 * 生成存储键名
 * @param recordId 记录ID
 * @param moduleType 模块类型
 * @returns 存储键名
 */
export function getStorageKey(recordId: string, moduleType: string): string {
  return `${STORAGE_KEY_PREFIX}${moduleType}_${recordId}`
}

/**
 * 保存AI报告到LocalStorage
 * @param recordId 记录ID
 * @param moduleType 模块类型
 * @param content 报告内容
 */
export function saveAIReport(
  recordId: string,
  moduleType: string,
  content: AIReportContent
): void {
  try {
    const reportData: AIReportData = {
      recordId,
      moduleType,
      content,
      generatedAt: new Date().toISOString(),
      version: STORAGE_VERSION,
    }

    const key = getStorageKey(recordId, moduleType)
    localStorage.setItem(key, JSON.stringify(reportData))
    console.log(`[AI Report] 报告已保存: ${key}`)
  } catch (error) {
    console.error('[AI Report] 保存报告失败:', error)
  }
}

/**
 * 从LocalStorage加载AI报告
 * @param recordId 记录ID
 * @param moduleType 模块类型
 * @returns 报告数据或null
 */
export function loadAIReport(
  recordId: string,
  moduleType: string
): AIReportData | null {
  try {
    const key = getStorageKey(recordId, moduleType)
    const data = localStorage.getItem(key)

    if (!data) {
      return null
    }

    const reportData: AIReportData = JSON.parse(data)

    // 检查版本号
    if (reportData.version !== STORAGE_VERSION) {
      console.log(`[AI Report] 版本不匹配，清除旧数据: ${key}`)
      localStorage.removeItem(key)
      return null
    }

    // 检查是否过期
    if (isReportExpired(reportData.generatedAt)) {
      console.log(`[AI Report] 报告已过期，清除旧数据: ${key}`)
      localStorage.removeItem(key)
      return null
    }

    console.log(`[AI Report] 报告已加载: ${key}`)
    return reportData
  } catch (error) {
    console.error('[AI Report] 加载报告失败:', error)
    return null
  }
}

/**
 * 检查报告是否过期
 * @param generatedAt 生成时间
 * @returns 是否过期
 */
function isReportExpired(generatedAt: string): boolean {
  const generatedDate = new Date(generatedAt)
  const expiryDate = new Date()
  expiryDate.setDate(expiryDate.getDate() - CACHE_EXPIRY_DAYS)
  return generatedDate < expiryDate
}

/**
 * 清除指定报告
 * @param recordId 记录ID
 * @param moduleType 模块类型
 */
export function clearAIReport(recordId: string, moduleType: string): void {
  try {
    const key = getStorageKey(recordId, moduleType)
    localStorage.removeItem(key)
    console.log(`[AI Report] 报告已清除: ${key}`)
  } catch (error) {
    console.error('[AI Report] 清除报告失败:', error)
  }
}

/**
 * 清除所有AI报告缓存
 */
export function clearAllAIReports(): void {
  try {
    const keysToRemove: string[] = []

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(STORAGE_KEY_PREFIX)) {
        keysToRemove.push(key)
      }
    }

    keysToRemove.forEach((key) => {
      localStorage.removeItem(key)
    })

    console.log(`[AI Report] 已清除 ${keysToRemove.length} 个报告缓存`)
  } catch (error) {
    console.error('[AI Report] 清除所有报告失败:', error)
  }
}

/**
 * 清除指定模块的所有报告
 * @param moduleType 模块类型
 */
export function clearModuleAIReports(moduleType: string): void {
  try {
    const keysToRemove: string[] = []
    const prefix = `${STORAGE_KEY_PREFIX}${moduleType}_`

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(prefix)) {
        keysToRemove.push(key)
      }
    }

    keysToRemove.forEach((key) => {
      localStorage.removeItem(key)
    })

    console.log(`[AI Report] 已清除 ${moduleType} 模块的 ${keysToRemove.length} 个报告缓存`)
  } catch (error) {
    console.error('[AI Report] 清除模块报告失败:', error)
  }
}

/**
 * 获取所有缓存的报告信息
 * @returns 报告信息列表
 */
export function getAllCachedReports(): Array<{
  recordId: string
  moduleType: string
  generatedAt: string
}> {
  const reports: Array<{ recordId: string; moduleType: string; generatedAt: string }> = []

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(STORAGE_KEY_PREFIX)) {
        const data = localStorage.getItem(key)
        if (data) {
          try {
            const reportData: AIReportData = JSON.parse(data)
            reports.push({
              recordId: reportData.recordId,
              moduleType: reportData.moduleType,
              generatedAt: reportData.generatedAt,
            })
          } catch {
            // 忽略解析错误
          }
        }
      }
    }
  } catch (error) {
    console.error('[AI Report] 获取缓存报告列表失败:', error)
  }

  return reports
}

/**
 * 检查报告是否存在且有效
 * @param recordId 记录ID
 * @param moduleType 模块类型
 * @returns 是否存在有效报告
 */
export function hasValidAIReport(recordId: string, moduleType: string): boolean {
  return loadAIReport(recordId, moduleType) !== null
}
