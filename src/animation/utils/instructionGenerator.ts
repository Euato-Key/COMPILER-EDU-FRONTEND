import type {
  StackOperation,
  AnimationInstruction,
  IAnimationInstructionGenerator,
} from '../types/animation'

// 动画持续时间配置
export const ANIMATION_DURATIONS = {
  push: 0.5,
  pop: 0.3,
  match: 0.2,
  pointer: 0.4,
}

// 动画延迟配置
export const ANIMATION_DELAYS = {
  betweenOperations: 0.1,
  beforeNextStep: 0.3,
}

/**
 * 动画指令生成器
 */
export class AnimationInstructionGenerator implements IAnimationInstructionGenerator {
  /**
   * 根据栈操作生成动画指令序列
   */
  generate(operations: StackOperation[], rawAnalysisData?: any): AnimationInstruction[] {
    const instructions: AnimationInstruction[] = []
    let currentDelay = 0

    // 按步骤分组操作
    const operationsByStep = this.groupOperationsByStep(operations)

    // 为每个步骤生成动画指令
    for (const [step, stepOperations] of operationsByStep) {
      const stepInstructions = this.generateStepInstructions(
        stepOperations,
        currentDelay,
        rawAnalysisData,
        step,
      )
      instructions.push(...stepInstructions)

      // 计算下一步的起始延迟
      currentDelay = this.calculateNextDelay(stepInstructions, currentDelay)
    }

    return instructions
  }

  /**
   * 按步骤分组操作
   */
  private groupOperationsByStep(operations: StackOperation[]): Map<number, StackOperation[]> {
    const grouped = new Map<number, StackOperation[]>()

    for (const operation of operations) {
      const step = operation.step
      if (!grouped.has(step)) {
        grouped.set(step, [])
      }
      grouped.get(step)!.push(operation)
    }

    return grouped
  }

  /**
   * 为单个步骤生成动画指令
   */
  private generateStepInstructions(
    operations: StackOperation[],
    baseDelay: number,
    rawAnalysisData?: any,
    analysisStep?: number,
  ): AnimationInstruction[] {
    const instructions: AnimationInstruction[] = []
    let operationDelay = baseDelay

    // 按操作索引排序
    const sortedOps = operations.sort((a, b) => (a.index || 0) - (b.index || 0))

    for (const operation of sortedOps) {
      const instruction = this.createInstruction(
        operation,
        operationDelay,
        rawAnalysisData,
        analysisStep || operation.step,
      )
      instructions.push(instruction)

      // 为下一个操作计算延迟
      operationDelay += instruction.duration + ANIMATION_DELAYS.betweenOperations
    }

    return instructions
  }

  /**
   * 创建单个动画指令
   */
  private createInstruction(
    operation: StackOperation,
    delay: number,
    rawAnalysisData?: any,
    analysisStep?: number,
  ): AnimationInstruction {
    let action: AnimationInstruction['action']
    let duration: number

    switch (operation.type) {
      case 'push':
        action = 'pushToStack'
        duration = ANIMATION_DURATIONS.push
        break
      case 'pop':
        action = 'popFromStack'
        duration = ANIMATION_DURATIONS.pop
        break
      case 'match':
        action = 'matchSymbol'
        duration = ANIMATION_DURATIONS.match
        break
      default:
        action = 'pushToStack'
        duration = ANIMATION_DURATIONS.push
    }

    const instruction: AnimationInstruction = {
      action,
      symbol: operation.symbol,
      duration,
      delay,
      step: operation.step,
      analysisStep: analysisStep || operation.step,
      syncId: `sync-${analysisStep || operation.step}`,
    }

    // 提取状态信息
    if (rawAnalysisData) {
      instruction.targetState = this.extractTargetState(
        operation,
        rawAnalysisData,
        analysisStep || operation.step,
      )
      instruction.productionInfo = this.extractProductionInfo(
        operation,
        rawAnalysisData,
        analysisStep || operation.step,
      )
    }

    return instruction
  }

  /**
   * 计算下一步的起始延迟
   */
  private calculateNextDelay(instructions: AnimationInstruction[], baseDelay: number): number {
    if (instructions.length === 0) {
      return baseDelay
    }

    // 找到最后完成的指令
    const lastInstruction = instructions.reduce((latest, current) => {
      const currentEnd = current.delay + current.duration
      const latestEnd = latest.delay + latest.duration
      return currentEnd > latestEnd ? current : latest
    })

    return lastInstruction.delay + lastInstruction.duration + ANIMATION_DELAYS.beforeNextStep
  }

  /**
   * 从原始数据中提取目标状态信息
   * 注意：后端步骤从1开始，前端数组索引从0开始
   */
  private extractTargetState(operation: StackOperation, rawData: any, stepIndex: number) {
    // 将分析步骤号转换为数组索引
    const arrayIndex = Math.max(0, stepIndex - 1)

    const targetState: any = {
      stack: this.getStackAtStep(rawData, arrayIndex),
      inputPointer: this.getPointerAtStep(rawData, arrayIndex),
      remainingInput: this.getInputAtStep(rawData, arrayIndex),
    }

    // 如果是LR分析器，添加符号栈信息
    if (rawData.info_symbol_stack && rawData.info_state_stack) {
      const symbolStack = rawData.info_symbol_stack?.[arrayIndex]
      const stateStack = rawData.info_state_stack?.[arrayIndex]

      if (symbolStack && typeof symbolStack === 'string') {
        targetState.symbolStack = symbolStack.split('').reverse()
      }

      if (stateStack && typeof stateStack === 'string') {
        targetState.stateStack = stateStack.split('').reverse()
        // 对于LR分析器，主栈设为状态栈
        targetState.stack = targetState.stateStack
      }
    }

    return targetState
  }

  /**
   * 从原始数据中提取产生式信息
   * 注意：后端步骤从1开始，前端数组索引从0开始
   * 注意：一个消息可能对应多个分析步骤
   */
  private extractProductionInfo(operation: StackOperation, rawData: any, stepIndex: number) {
    // 将分析步骤号转换为数组索引
    const arrayIndex = Math.max(0, stepIndex - 1)
    const message = rawData.info_msg?.[arrayIndex] || ''
    return this.parseMessageToProductionInfo(message)
  }

  /**
   * 获取指定步骤的栈状态
   */
  private getStackAtStep(rawData: any, stepIndex: number): string[] {
    // 优先尝试LL1格式的栈数据
    const ll1Stack = rawData.info_stack?.[stepIndex] || rawData.info_symbol_stack?.[stepIndex]
    if (ll1Stack) {
      if (typeof ll1Stack === 'string') {
        return ll1Stack
          .split('')
          .filter((c: string) => c !== '')
          .reverse()
      } else if (Array.isArray(ll1Stack)) {
        return ll1Stack.map((item: any) => item.text || item.symbol || item).reverse()
      }
    }

    // 对于LR分析器，使用状态栈
    const lrStateStack = rawData.info_state_stack?.[stepIndex]
    if (lrStateStack) {
      if (typeof lrStateStack === 'string') {
        return lrStateStack.split('').reverse()
      }
    }

    return []
  }

  /**
   * 获取指定步骤的输入指针位置
   */
  private getPointerAtStep(rawData: any, stepIndex: number): number {
    const all = rawData.info_str?.[0]?.length || 0
    const now = rawData.info_str?.[stepIndex]?.length || 0
    return all - now
  }

  /**
   * 获取指定步骤的剩余输入串
   */
  private getInputAtStep(rawData: any, stepIndex: number): string[] {
    const str = rawData.info_str?.[stepIndex]
    if (!str) return []

    if (typeof str === 'string') {
      return str.split('')
    } else if (typeof str === 'object' && str.text) {
      return str.text.split('')
    }
    return []
  }

  /**
   * 直接使用后端消息数据，不做复杂解析
   * 注意：一个消息可能对应多个分析步骤
   */
  private parseMessageToProductionInfo(message: string) {
    // 直接返回原始消息，让前端组件自行处理显示
    return {
      type: 'message' as const,
      message: message || '',
      rawMessage: message || '',
    }
  }
}
