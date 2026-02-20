/**
 * 时区转换工具函数
 * 用于处理 UTC 时间与本地时间的相互转换
 */

/**
 * 将 UTC 时间字符串转换为本地日期字符串 YYYY-MM-DD
 * 支持格式: "2026-02-20 17:19:09" 或 "2026-02-20T17:19:09Z"
 * @param utcTime UTC 时间字符串
 * @returns 本地日期字符串 YYYY-MM-DD
 */
export const utcToLocalDate = (utcTime: string): string => {
  if (!utcTime) return ''
  
  try {
    // 统一格式为 ISO 格式
    const isoString = utcTime.includes('T') 
      ? utcTime 
      : utcTime.replace(' ', 'T') + 'Z'
    
    const date = new Date(isoString)
    
    if (isNaN(date.getTime())) {
      return utcTime.split(' ')[0] || utcTime
    }
    
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  } catch (e) {
    return utcTime.split(' ')[0] || utcTime
  }
}

/**
 * 将 UTC 时间字符串转换为本地完整时间显示
 * 例如："2026-02-20 17:19:09" → "2026-02-21 01:19:09"
 * @param utcTime UTC 时间字符串
 * @returns 本地日期时间字符串 YYYY-MM-DD HH:mm:ss
 */
export const utcToLocalDateTime = (utcTime: string): string => {
  if (!utcTime) return ''
  
  try {
    // 统一格式为 ISO 格式
    const isoString = utcTime.includes('T')
      ? utcTime
      : utcTime.replace(' ', 'T') + 'Z'
    
    const date = new Date(isoString)
    
    if (isNaN(date.getTime())) {
      return utcTime
    }
    
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  } catch (e) {
    return utcTime
  }
}

/**
 * 将本地日期字符串转换为 UTC 时间字符串（用于查询）
 * 例如："2026-02-21" → "2026-02-20 16:00:00"（北京时间）
 * @param localDate 本地日期字符串 YYYY-MM-DD
 * @returns UTC 时间字符串 YYYY-MM-DD HH:mm:ss
 */
export const localDateToUTC = (localDate: string): string => {
  if (!localDate) return ''
  
  try {
    // 将本地日期视为当天的 00:00:00 本地时间
    const date = new Date(localDate + 'T00:00:00')
    
    if (isNaN(date.getTime())) {
      return localDate
    }
    
    const year = date.getUTCFullYear()
    const month = String(date.getUTCMonth() + 1).padStart(2, '0')
    const day = String(date.getUTCDate()).padStart(2, '0')
    const hours = String(date.getUTCHours()).padStart(2, '0')
    const minutes = String(date.getUTCMinutes()).padStart(2, '0')
    const seconds = String(date.getUTCSeconds()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  } catch (e) {
    return localDate
  }
}

/**
 * 将本地日期字符串转换为 UTC 日期字符串（仅日期部分）
 * 例如："2026-02-21" → "2026-02-20"（北京时间）
 * @param localDate 本地日期字符串 YYYY-MM-DD
 * @returns UTC 日期字符串 YYYY-MM-DD
 */
export const localDateToUTCDate = (localDate: string): string => {
  if (!localDate) return ''
  
  try {
    const date = new Date(localDate + 'T00:00:00')
    
    if (isNaN(date.getTime())) {
      return localDate
    }
    
    const year = date.getUTCFullYear()
    const month = String(date.getUTCMonth() + 1).padStart(2, '0')
    const day = String(date.getUTCDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  } catch (e) {
    return localDate
  }
}

/**
 * 获取当前本地日期字符串 YYYY-MM-DD
 * @returns 当前本地日期字符串
 */
export const getCurrentLocalDate = (): string => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * 将 Date 对象格式化为本地日期字符串 YYYY-MM-DD
 * @param date Date 对象
 * @returns 本地日期字符串 YYYY-MM-DD
 */
export const formatDateToLocalString = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
