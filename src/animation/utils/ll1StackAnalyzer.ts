import { StackDiffAnalyzer } from './stackDiffAnalyzer'
import type { StackOperation } from '../types/animation'

/**
 * LL1算法栈状态分析器
 */
export class LL1StackAnalyzer extends StackDiffAnalyzer {
  analyzeStackDifferences(): StackOperation[] {
    const operations: StackOperation[] = []

    if (!this.data?.info_stack || !Array.isArray(this.data.info_stack)) {
      console.warn('LL1StackAnalyzer: 无效的栈数据')
      return operations
    }

    const stackStates = this.data.info_stack
    const messages = this.data.info_msg || []
    const inputStates = this.data.info_str || []

    // 遍历每个分析步骤
    for (let i = 1; i < stackStates.length; i++) {
      this.currentStep = i

      const prevStack = this.parseStack(stackStates[i - 1])
      const currStack = this.parseStack(stackStates[i])
      const message = messages[i - 1] || ''
      const prevInput = inputStates[i - 1] || ''
      const currInput = inputStates[i] || ''

      // 分析这一步的操作
      const stepOperations = this.analyzeStep(prevStack, currStack, message, prevInput, currInput)

      operations.push(...stepOperations)
    }

    return operations
  }

  /**
   * 分析单个步骤的栈变化
   */
  private analyzeStep(
    prevStack: string[],
    currStack: string[],
    message: string,
    prevInput: string,
    currInput: string,
  ): StackOperation[] {
    const operations: StackOperation[] = []

    // 检查是否是匹配操作（输入串发生了变化）
    if (prevInput !== currInput && this.isMatchOperation(message)) {
      const matchedSymbol = this.extractMatchedSymbol(message, prevStack, currStack)
      if (matchedSymbol) {
        operations.push({
          type: 'match',
          symbol: matchedSymbol,
          step: this.currentStep,
          index: 0,
        })
      }
    }

    // 分析栈的实际变化
    const stackDiff = this.findStackDifference(prevStack, currStack)
    operations.push(
      ...stackDiff.map((op) => ({
        ...op,
        index: operations.length + op.index!,
      })),
    )

    return operations
  }

  /**
   * 判断是否是匹配操作
   */
  private isMatchOperation(message: string): boolean {
    return message.includes('匹配') || message.includes('match')
  }

  /**
   * 提取匹配的符号
   */
  private extractMatchedSymbol(
    message: string,
    prevStack: string[],
    currStack: string[],
  ): string | null {
    // 从消息中提取匹配的符号
    const matchResult = message.match(/'([^']+)'匹配/)
    if (matchResult) {
      return matchResult[1]
    }

    // 如果消息解析失败，从栈变化中推断
    if (prevStack.length > currStack.length) {
      return prevStack[prevStack.length - 1]
    }

    return null
  }
}
