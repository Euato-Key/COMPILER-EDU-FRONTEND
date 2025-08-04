// 动画相关类型定义

export interface StackOperation {
  type: 'push' | 'pop' | 'match'
  symbol: string
  step: number
  index?: number
}

export interface AnimationInstruction {
  action: 'pushToStack' | 'popFromStack' | 'matchSymbol' | 'movePointer'
  symbol: string
  duration: number
  delay: number
  step: number

  // 新增：完整状态信息
  targetState?: {
    stack: string[] // 执行后的栈状态 (LL1为符号栈，LR为状态栈)
    inputPointer: number // 执行后的输入指针位置
    remainingInput: string[] // 剩余输入串
    // LR分析器特有字段
    symbolStack?: string[] // LR分析器的符号栈
    stateStack?: string[] // LR分析器的状态栈 (与stack相同，保持兼容性)
  }

  // 新增：产生式信息
  productionInfo?: {
    type: 'production' | 'match' | 'epsilon' | 'shift' | 'reduce' | 'accept'
    left?: string
    right?: string | string[]
    message?: string
  }

  // 新增：同步信息
  syncId?: string // 同一分析步骤的指令共享相同syncId
  analysisStep: number // 对应的原始分析步骤
}

export interface StackState {
  symbols: string[]
  step: number
}

// 分析器接口
export interface IStackAnalyzer {
  analyzeStackDifferences(): StackOperation[]
}

// 动画指令生成器接口
export interface IAnimationInstructionGenerator {
  generate(operations: StackOperation[], rawAnalysisData?: any): AnimationInstruction[]
}
