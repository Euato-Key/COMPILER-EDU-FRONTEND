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
    let instructionIndex = 0

    // 初始化栈状态模拟器
    const stackSimulator = this.createStackSimulator(rawAnalysisData)

    // 按步骤分组操作
    const operationsByStep = this.groupOperationsByStep(operations)

    // 为每个步骤生成动画指令
    for (const [step, stepOperations] of operationsByStep) {
      const stepInstructions = this.generateStepInstructions(
        stepOperations,
        currentDelay,
        rawAnalysisData,
        step,
        instructionIndex,
        stackSimulator, // 传递栈模拟器
      )
      instructions.push(...stepInstructions)

      // 更新指令索引
      instructionIndex += stepInstructions.length
      // 计算下一步的起始延迟
      currentDelay = this.calculateNextDelay(stepInstructions, currentDelay)
    }

    return instructions
  }

  /**
   * 创建栈状态模拟器
   */
  private createStackSimulator(rawData: any) {
    // 获取初始状态
    const initialStack = rawData?.info_stack?.[0] || '#S'
    const initialInput = rawData?.info_str?.[0] || ''

    // 初始化符号栈和状态栈（用于LR分析器）
    const initialSymbolStack = rawData?.info_symbol_stack?.[0] || '#S'
    const initialStateStack = rawData?.info_state_stack?.[0] || '0'

    return {
      stack: this.parseStackString(initialStack), // LL1使用的栈
      symbolStack: this.parseStackString(initialSymbolStack), // LR符号栈
      stateStack: this.parseStackString(initialStateStack), // LR状态栈
      inputPointer: 0,
      remainingInput: initialInput.split(''),

      // 执行栈操作并返回新状态
      executeOperation(operation: StackOperation) {
        const stackType = operation.stackType || 'symbol'

        switch (operation.type) {
          case 'push':
            if (stackType === 'state') {
              this.stateStack.unshift(operation.symbol) // 添加到状态栈顶
            } else {
              this.symbolStack.unshift(operation.symbol) // 添加到符号栈顶
              this.stack.unshift(operation.symbol) // LL1兼容
            }
            break
          case 'pop':
            if (stackType === 'state') {
              this.stateStack.shift() // 从状态栈顶移除
            } else {
              this.symbolStack.shift() // 从符号栈顶移除
              this.stack.shift() // LL1兼容
            }
            break
          case 'match':
            this.inputPointer++
            this.remainingInput.shift() // 消耗一个输入符号
            break
        }

        return {
          stack: [...this.stack], // LL1兼容
          symbolStack: [...this.symbolStack], // LR符号栈
          stateStack: [...this.stateStack], // LR状态栈
          inputPointer: this.inputPointer,
          remainingInput: [...this.remainingInput],
        }
      },
    }
  }

  /**
   * 解析栈字符串为数组
   */
  private parseStackString(stackStr: string): string[] {
    if (!stackStr) return ['#']
    return stackStr
      .split('')
      .filter((c) => c !== '')
      .reverse()
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
    startInstructionIndex?: number,
    stackSimulator?: any,
  ): AnimationInstruction[] {
    const instructions: AnimationInstruction[] = []
    let operationDelay = baseDelay
    let instructionIndex = startInstructionIndex || 0

    // 按操作索引排序
    const sortedOps = operations.sort((a, b) => (a.index || 0) - (b.index || 0))

    for (const operation of sortedOps) {
      // 使用栈模拟器计算目标状态
      const targetState = stackSimulator ? stackSimulator.executeOperation(operation) : null

      const instruction = this.createInstruction(
        operation,
        operationDelay,
        rawAnalysisData,
        analysisStep || operation.step,
        instructionIndex,
        targetState, // 传递计算出的目标状态
      )
      instructions.push(instruction)

      // 为下一个操作计算延迟
      operationDelay += instruction.duration + ANIMATION_DELAYS.betweenOperations
      instructionIndex++
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
    instructionStep?: number,
    simulatedTargetState?: any,
  ): AnimationInstruction {
    let action: AnimationInstruction['action']
    let duration: number

    // 根据栈类型和操作类型确定动画动作
    const stackType = operation.stackType || 'symbol' // 默认为符号栈

    switch (operation.type) {
      case 'push':
        action = stackType === 'state' ? 'pushToStateStack' : 'pushToStack'
        duration = ANIMATION_DURATIONS.push
        break
      case 'pop':
        action = stackType === 'state' ? 'popFromStateStack' : 'popFromStack'
        duration = ANIMATION_DURATIONS.pop
        break
      case 'match':
        action = 'matchSymbol' // 匹配操作不分栈类型
        duration = ANIMATION_DURATIONS.match
        break
      default:
        action = stackType === 'state' ? 'pushToStateStack' : 'pushToStack'
        duration = ANIMATION_DURATIONS.push
    }

    const instruction: AnimationInstruction = {
      action,
      symbol: operation.symbol,
      duration,
      delay,
      step: instructionStep || 0, // 使用连续的动画步骤索引（从0开始）
      analysisStep: analysisStep || operation.step, // 分析步骤号（从1开始）
      syncId: `sync-${analysisStep || operation.step}`,
      stackType, // 添加栈类型信息
    }

    // 使用模拟的目标状态或从原始数据提取
    if (simulatedTargetState) {
      instruction.targetState = simulatedTargetState
    } else if (rawAnalysisData) {
      instruction.targetState = this.extractTargetState(
        operation,
        rawAnalysisData,
        analysisStep || operation.step,
      )
    }

    // 提取产生式信息
    if (rawAnalysisData) {
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
   * 注意：需要根据动画指令的实际执行来计算正确的目标状态
   */
  private extractTargetState(operation: StackOperation, rawData: any, stepIndex: number) {
    // 对于动画指令，我们需要计算执行该指令后的状态
    // stepIndex 是分析步骤号，需要转换为数组索引
    const arrayIndex = Math.max(0, stepIndex - 1)

    // 获取该分析步骤结束后的状态（即下一个分析步骤的初始状态）
    const targetArrayIndex = Math.min(arrayIndex + 1, rawData.info_stack?.length - 1 || 0)

    const targetState: any = {
      stack: this.getStackAtStep(rawData, targetArrayIndex),
      inputPointer: this.getPointerAtStep(rawData, targetArrayIndex),
      remainingInput: this.getInputAtStep(rawData, targetArrayIndex),
    }

    // 如果是LR分析器，添加符号栈和状态栈信息
    if (rawData.info_symbol_stack && rawData.info_state_stack) {
      const symbolStack = rawData.info_symbol_stack?.[targetArrayIndex]
      const stateStack = rawData.info_state_stack?.[targetArrayIndex]

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
