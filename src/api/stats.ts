import request from '@/lib/request'
import type { ApiResponse } from '@/types'

/**
 * 错误统计记录项
 */
export interface ErrorStatRecord {
  record_id: string
  module: 'lr0' | 'slr1' | 'll1' | 'fa'
  step: string
  error_type: string
  error_count: number
  record_created_at: string
}

/**
 * 统计摘要项
 */
export interface StatsSummaryItem {
  module: string
  step: string
  total_errors: number
  affected_records: number
}

/**
 * 错误分布项
 */
export interface ErrorDistributionItem {
  step: string
  error_type: string
  total_errors: number
  percentage: number
}

/**
 * 趋势数据项
 */
export interface TrendItem {
  day: string
  daily_errors: number
  daily_records: number
}

/**
 * 整体统计
 */
export interface OverallStats {
  total_errors: number
  total_records: number
  module_stats: Array<{
    module: string
    errors: number
    records: number
  }>
  today_stats: {
    errors: number
    records: number
  }
}

/**
 * 模块配置
 */
export interface ModuleConfig {
  modules: string[]
  steps: string[]
  error_types: Record<string, Record<string, string[]>>
}

/**
 * 记录单个错误统计
 */
export const recordErrorAPI = (data: ErrorStatRecord) => {
  return request.post<ApiResponse<{ success: boolean }>>('/api/stats/record', data)
}

/**
 * 批量记录错误统计
 */
export const batchRecordErrorsAPI = (errors: ErrorStatRecord[]) => {
  return request.post<ApiResponse<{ success_count: number; fail_count: number }>>('/api/stats/record/batch', { errors })
}

/**
 * 获取统计摘要
 */
export const getStatsSummaryAPI = (params?: {
  module?: string
  step?: string
  start_date?: string
  end_date?: string
}) => {
  return request.get<ApiResponse<StatsSummaryItem[]>>('/api/stats/summary', { params })
}

/**
 * 获取错误类型分布
 */
export const getErrorDistributionAPI = (params: {
  module: string
  step?: string
  start_date?: string
  end_date?: string
}) => {
  return request.get<ApiResponse<{ total_errors: number; distribution: ErrorDistributionItem[] }>>('/api/stats/distribution', { params })
}

/**
 * 获取错误趋势
 */
export const getErrorTrendAPI = (params: {
  module: string
  step?: string
  days?: number
}) => {
  return request.get<ApiResponse<{ module: string; step?: string; days: number; trend: TrendItem[] }>>('/api/stats/trend', { params })
}

/**
 * 获取整体统计
 * @param params 可选的时间范围参数
 */
export const getOverallStatsAPI = (params?: { start_date?: string; end_date?: string }) => {
  return request.get<ApiResponse<OverallStats>>('/api/stats/overall', { params })
}

/**
 * 清空所有统计数据
 */
export const clearAllStatsAPI = () => {
  return request.post<ApiResponse<{ success: boolean }>>('/api/stats/clear')
}

/**
 * 删除指定模块数据
 */
export const deleteModuleStatsAPI = (module: string) => {
  return request.post<ApiResponse<{ success: boolean }>>(`/api/stats/delete/${module}`)
}

/**
 * 获取模块配置
 */
export const getModuleConfigAPI = () => {
  return request.get<ApiResponse<ModuleConfig>>('/api/stats/config/modules')
}

/**
 * 获取模块错误类型配置
 */
export const getModuleErrorTypesAPI = (module: string) => {
  return request.get<ApiResponse<{ module: string; error_types: Record<string, string[]> }>>(`/api/stats/config/error-types/${module}`)
}
