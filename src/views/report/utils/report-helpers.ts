/**
 * 报告页面通用工具函数
 */

/**
 * 根据进度百分比获取进度条颜色类名
 * @param progress 进度百分比 (0-100)
 * @returns Tailwind CSS 颜色类名
 */
export function getOverallProgressBarClass(progress: number): string {
  if (progress === 100) return 'bg-green-500'
  if (progress >= 80) return 'bg-blue-500'
  if (progress >= 50) return 'bg-yellow-500'
  return 'bg-orange-500'
}
