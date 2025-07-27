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

// LL1校验数据结构（前端处理后的格式）
export interface DataLL1Type {
  S: string
  Vn: LL1ValidationItem[]
  Vt: LL1ValidationItem[]
  first: LL1ValidationItem[]
  follow: LL1ValidationItem[]
  formulas_dict: LL1ValidationItem[]
  table: LL1ValidationItem[]
}

// LL1专用的校验数据项
export interface LL1ValidationItem {
  id: string
  category: 'blank' | 'onlyRead' | 'writed'
  state: 'normal' | 'waitWriteIn' | 'isCorrect' | 'isError'
  check: 'normal' | 'isCorrect' | 'isError'
  text: string
  coords?: string[]
  symbol?: string
}

// LL1输入串分析结果
export interface LL1AnalysisStepInfo {
  info_res: string
  info_step: number[]
  info_msg: string[]
  info_stack: LL1InfoSymbol[]
  info_str: LL1InfoStr[]
}

// 简化的LL1输入串分析结果（用于API响应）
export interface AnalysisStepInfo {
  info_res: string
  info_step: number[]
  info_msg: string[]
  info_stack: string[]
  info_str: string[]
}

// LL1分析过程中的符号栈
export interface LL1InfoSymbol {
  id: string
  category: string
  state: string
  check: string
  text: string
}

// LL1分析过程中的输入串
export interface LL1InfoStr {
  id: string
  category: string
  state: string
  check: string
  text: string
}
