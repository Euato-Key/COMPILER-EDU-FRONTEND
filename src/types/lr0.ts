// LR0分析结果类型
export interface LR0AnalysisResult {
  S: string
  Vn: string[]
  Vt: string[]
  formulas_list: string[]
  dot_items: string[]
  all_dfa: any[]
  actions: Record<string, string>
  gotos: Record<string, string>
  isLR0: boolean
  LR0_dot_str: string
}

// 校验状态枚举
export enum ValidationState {
  NORMAL = 'normal',
  ERROR = 'error',
  SUCCESS = 'success',
  CHECKING = 'checking',
}

// 产生式项接口
export interface ProductionItem {
  id: string
  text: string
  validationState: ValidationState
  errorMessage?: string
}

// 校验结果接口
export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

// LR0校验数据项接口
export interface LR0ValidationItem {
  id: string
  category: 'action' | 'goto' | 'dfa' | 'item'
  state: string
  check: boolean
  coords?: { x: number; y: number }
  data: any
}

// LR0校验数据结构
export interface DataLR0Type {
  actionTable: LR0ValidationItem[]
  gotoTable: LR0ValidationItem[]
  dfaStates: LR0ValidationItem[]
  dotItems: LR0ValidationItem[]
}

// LR0输入串分析结果
export interface LR0AnalysisStepInfo {
  info_res: string
  info_step: number[]
  info_msg: string[]
  info_stack: string[]
  info_str: string[]
  info_action: string[]
}

export type dfa_item =  { id: string, category: string, state: string, check:string, text: string }
export type dfa_gotoVt =  { id: string, category: string, state: string, check:string, text: string }
