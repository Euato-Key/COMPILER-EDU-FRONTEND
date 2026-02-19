/**
 * 学习统计页面共享类型定义
 */

// 步骤错误类型
export interface StepType {
  type: string
  count: number
}

// 步骤统计
export interface StepStat {
  step: string
  errors: number
  types: StepType[]
}

// 单个模块统计
export interface ModuleStat {
  totalErrors: number
  records: number
  steps: StepStat[]
}

// 所有模块统计
export interface ModuleStats {
  fa: ModuleStat | null
  ll1: ModuleStat | null
  lr0: ModuleStat | null
  slr1: ModuleStat | null
}
