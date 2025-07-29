/**
 * @deprecated 此文件已拆分为更细粒度的类型文件
 * 请使用以下文件替代：
 * - @/types/common - 通用类型和接口
 * - @/types/fa - 有限自动机相关类型
 * - @/types/ll1 - LL1分析相关类型
 * - @/types/lr0 - LR0分析相关类型
 * - @/types/slr1 - SLR1分析相关类型
 *
 * 此文件保留用于向后兼容，将在后续版本中移除
 */

// 通用API响应格式
export interface ApiResponse<T = unknown> {
  code: number
  data?: T
  message?: string
  msg?: string
}

// LL1分析结果类型
export interface LL1AnalysisResult {
  S: string
  Vn: string[]
  Vt: string[]
  formulas_dict: Record<string, string[]>
  first: Record<string, string[]>
  follow: Record<string, string[]>
  table: Record<string, string>
  isLL1: boolean
}

// LR0/SLR1分析结果类型
export interface LRAnalysisResult {
  S: string
  Vn: string[]
  Vt: string[]
  formulas_list: string[]
  dot_items: string[]
  all_dfa: Record<string, unknown>[]
  actions: Record<string, string>
  gotos: Record<string, string>
  isLR0?: boolean
  isSLR1?: boolean
  LR0_dot_str?: string
  SLR1_dot_str?: string
}

// 有限自动机分析结果类型
export interface FAResult {
  table: Record<string, unknown>
  table_to_num: Record<string, unknown>
  table_to_num_min: Record<string, unknown>
  P: Record<string, unknown>
  P_change: Record<string, unknown>
  NFA_dot_str: string
  DFA_dot_str: string
  Min_DFA_dot_str: string
}

// 分析步骤信息类型（用于输入串分析）
export interface AnalysisStepInfo {
  info_res: string
  info_step: number[]
  info_msg: string[]
  info_state_stack: string[]
  info_str: string[]
  info_symbol_stack: string[]
  info_action?: string[]
}
