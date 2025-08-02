import { StackDiffAnalyzer } from './stackDiffAnalyzer'
import type { StackOperation } from '../types/animation'

/**
 * LR算法栈状态分析器（支持LR0、SLR1等）
 */
export class LRStackAnalyzer extends StackDiffAnalyzer {
  analyzeStackDifferences(): StackOperation[] {
    const operations: StackOperation[] = []

    if (!this.data?.info_symbol_stack || !Array.isArray(this.data.info_symbol_stack)) {
      console.warn('LRStackAnalyzer: 无效的符号栈数据')
      return operations
    }

    const symbolStacks = this.data.info_symbol_stack
    const messages = this.data.info_msg || []
    const inputStates = this.data.info_str || []

    // 遍历每个分析步骤
    for (let i = 1; i < symbolStacks.length; i++) {
      this.currentStep = i

      const prevSymbolStack = this.parseStack(symbolStacks[i - 1])
      const currSymbolStack = this.parseStack(symbolStacks[i])
      const message = messages[i - 1] || ''
      const prevInput = inputStates[i - 1] || ''
      const currInput = inputStates[i] || ''

      // 分析这一步的操作
      const stepOperations = this.analyzeStep(
        prevSymbolStack,
        currSymbolStack,
        message,
        prevInput,
        currInput,
      )

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
    _prevInput: string,
    _currInput: string,
  ): StackOperation[] {
    const operations: StackOperation[] = []
    const actionInfo = this.parseActionMessage(message)

    if (actionInfo.type === 'shift') {
      // 移进操作：输入符号入栈
      operations.push({
        type: 'push',
        symbol: actionInfo.symbol || '',
        step: this.currentStep,
        index: 0,
      })
    } else if (actionInfo.type === 'reduce') {
      // 归约操作：根据产生式进行pop和push
      const reduceOps = this.handleReduceOperation(
        prevStack,
        currStack,
        actionInfo.production || '',
      )
      operations.push(...reduceOps)
    } else {
      // 其他情况：直接分析栈差异
      const stackDiff = this.findStackDifference(prevStack, currStack)
      operations.push(...stackDiff)
    }

    return operations
  }

  /**
   * 解析动作消息
   */
  private parseActionMessage(message: string): {
    type: 'shift' | 'reduce' | 'accept' | 'unknown'
    symbol?: string
    state?: string
    ruleNumber?: string
    production?: string
  } {
    if (message.includes('=s')) {
      // 移进操作: "Action[0,a]=s3: 状态3入栈"
      const shiftMatch = message.match(/Action\[(\d+),(.)\]=s(\d+)/)
      if (shiftMatch) {
        return {
          type: 'shift',
          symbol: shiftMatch[2],
          state: shiftMatch[3],
        }
      }
    } else if (message.includes('=r')) {
      // 归约操作: "Action[4,b]=r3: 用B->b归约"
      const reduceMatch = message.match(/Action\[(\d+),(.)\]=r(\d+): 用 (.+) 归约/)
      if (reduceMatch) {
        return {
          type: 'reduce',
          symbol: reduceMatch[2],
          ruleNumber: reduceMatch[3],
          production: reduceMatch[4],
        }
      }
    } else if (message.includes('acc')) {
      return { type: 'accept' }
    }

    return { type: 'unknown' }
  }

  /**
   * 处理归约操作
   */
  private handleReduceOperation(
    prevStack: string[],
    currStack: string[],
    production: string,
  ): StackOperation[] {
    const operations: StackOperation[] = []

    if (!production.includes('->')) {
      // 如果产生式格式不正确，直接使用栈差异
      return this.findStackDifference(prevStack, currStack)
    }

    const [left, right] = production.split('->')
    const leftSymbol = left.trim()
    const rightSymbols = right.trim()

    // 计算需要弹出的符号数量
    const popCount = rightSymbols === 'ε' ? 0 : rightSymbols.length

    // 生成弹出操作
    for (let i = 0; i < popCount; i++) {
      const symbolIndex = prevStack.length - 1 - i
      if (symbolIndex >= 0) {
        operations.push({
          type: 'pop',
          symbol: prevStack[symbolIndex],
          step: this.currentStep,
          index: i,
        })
      }
    }

    // 生成压入操作
    operations.push({
      type: 'push',
      symbol: leftSymbol,
      step: this.currentStep,
      index: popCount,
    })

    return operations
  }
}
