import type { TokenUsageResponse } from '@/api/ai'

/**
 * 格式化数字（将大数字转换为 k/w 格式）
 * @param num 要格式化的数字
 * @returns 格式化后的字符串
 */
export const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

/**
 * 模块名称映射表
 */
const MODULE_NAMES: Record<string, string> = {
  'fa': 'FA 有限自动机',
  'll1': 'LL1 分析',
  'lr0': 'LR0 分析',
  'slr1': 'SLR1 分析',
  'report': 'AI 报告',
  'unknown': '未知模块'
}

/**
 * 格式化模块名称
 * @param module 模块标识符
 * @returns 格式化后的模块名称
 */
export const formatModuleName = (module: string): string => {
  return MODULE_NAMES[module] || module
}

/**
 * 定价常量（元/百万 tokens）
 */
export const PRICING = {
  INPUT: 2,   // 输入 token 单价
  OUTPUT: 3   // 输出 token 单价
} as const

/**
 * 计算总费用
 * @param data Token 用量数据
 * @returns 格式化后的总费用字符串（保留4位小数）
 */
export const calculateTotalCost = (data: TokenUsageResponse | null): string => {
  if (!data?.summary) return '0.0000'
  
  const inputCost = (data.summary.total_input_tokens / 1000000) * PRICING.INPUT
  const outputCost = (data.summary.total_output_tokens / 1000000) * PRICING.OUTPUT
  const total = inputCost + outputCost
  
  return total.toFixed(4)
}

/**
 * 计算平均每次 Token 数
 * @param data Token 用量数据
 * @returns 格式化后的平均 Token 数
 */
export const calculateAvgTokensPerRequest = (data: TokenUsageResponse | null): string => {
  if (!data?.summary) return '0'
  
  const totalTokens = data.summary.total_tokens
  const requests = data.summary.total_requests
  
  if (requests === 0) return '0'
  
  return formatNumber(Math.floor(totalTokens / requests))
}

/**
 * 计算平均每次输入 Token
 * @param data Token 用量数据
 * @returns 格式化后的平均输入 Token 数
 */
export const calculateAvgInputTokensPerRequest = (data: TokenUsageResponse | null): string => {
  if (!data?.summary) return '0'
  
  const inputTokens = data.summary.total_input_tokens
  const requests = data.summary.total_requests
  
  if (requests === 0) return '0'
  
  return formatNumber(Math.floor(inputTokens / requests))
}

/**
 * 计算平均每次输出 Token
 * @param data Token 用量数据
 * @returns 格式化后的平均输出 Token 数
 */
export const calculateAvgOutputTokensPerRequest = (data: TokenUsageResponse | null): string => {
  if (!data?.summary) return '0'
  
  const outputTokens = data.summary.total_output_tokens
  const requests = data.summary.total_requests
  
  if (requests === 0) return '0'
  
  return formatNumber(Math.floor(outputTokens / requests))
}

/**
 * 计算平均每次费用
 * @param data Token 用量数据
 * @returns 格式化后的平均费用字符串（保留4位小数）
 */
export const calculateAvgCostPerRequest = (data: TokenUsageResponse | null): string => {
  if (!data?.summary) return '0.0000'
  
  const requests = data.summary.total_requests
  
  if (requests === 0) return '0.0000'
  
  const totalCost = parseFloat(calculateTotalCost(data))
  
  return (totalCost / requests).toFixed(4)
}
