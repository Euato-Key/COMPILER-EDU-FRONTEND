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
  generate(operations: StackOperation[]): AnimationInstruction[] {
    const instructions: AnimationInstruction[] = []
    let currentDelay = 0

    // 按步骤分组操作
    const operationsByStep = this.groupOperationsByStep(operations)

    // 为每个步骤生成动画指令
    for (const [_step, stepOperations] of operationsByStep) {
      const stepInstructions = this.generateStepInstructions(stepOperations, currentDelay)
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
  ): AnimationInstruction[] {
    const instructions: AnimationInstruction[] = []
    let operationDelay = baseDelay

    // 按操作索引排序
    const sortedOps = operations.sort((a, b) => (a.index || 0) - (b.index || 0))

    for (const operation of sortedOps) {
      const instruction = this.createInstruction(operation, operationDelay)
      instructions.push(instruction)

      // 为下一个操作计算延迟
      operationDelay += instruction.duration + ANIMATION_DELAYS.betweenOperations
    }

    return instructions
  }

  /**
   * 创建单个动画指令
   */
  private createInstruction(operation: StackOperation, delay: number): AnimationInstruction {
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

    return {
      action,
      symbol: operation.symbol,
      duration,
      delay,
      step: operation.step,
    }
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
}
