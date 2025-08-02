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
  generate(operations: StackOperation[]): AnimationInstruction[]
}
