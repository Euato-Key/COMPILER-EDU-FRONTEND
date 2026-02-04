/**
 * 日期格式化工具函数
 */

/**
 * 格式化时间戳为标准日期时间字符串
 * @param timestamp 时间戳或日期字符串
 * @returns 格式化后的日期时间字符串 (YYYY-MM-DD HH:mm:ss) 或原始输入
 */
export function formatDate(timestamp: string): string {
  if (!timestamp) return '-'
  try {
    let date = new Date(timestamp)
    
    // 如果直接解析失败，尝试解析 "DD/MM/YYYY, HH:mm:ss" 格式
    if (isNaN(date.getTime())) {
      const regex = /^(\d{1,2})\/(\d{1,2})\/(\d{4}),\s*(\d{1,2}):(\d{1,2}):(\d{1,2})$/;
      const match = timestamp.match(regex);
      
      if (match) {
        const [, day, month, year, hours, minutes, seconds] = match;
        date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes), parseInt(seconds));
      } else {
        return timestamp
      }
    }
    
    if (isNaN(date.getTime())) return timestamp

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  } catch (e) {
    return timestamp
  }
}