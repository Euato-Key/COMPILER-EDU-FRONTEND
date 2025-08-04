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

    if (!this.data?.info_state_stack || !Array.isArray(this.data.info_state_stack)) {
      console.warn('LRStackAnalyzer: 无效的状态栈数据')
      return operations
    }

    const symbolStacks = this.data.info_symbol_stack
    const stateStacks = this.data.info_state_stack
    const messages = this.data.info_msg || []
    const inputStates = this.data.info_str || []

    // 遍历每个分析步骤
    for (let i = 1; i < symbolStacks.length; i++) {
      this.currentStep = i

      const prevSymbolStack = this.parseStack(symbolStacks[i - 1])
      const currSymbolStack = this.parseStack(symbolStacks[i])
      const prevStateStack = this.parseStack(stateStacks[i - 1])
      const currStateStack = this.parseStack(stateStacks[i])
      const message = messages[i - 1] || ''
      const prevInput = inputStates[i - 1] || ''
      const currInput = inputStates[i] || ''

      // 分析这一步的操作（同时处理符号栈和状态栈）
      const stepOperations = this.analyzeStep(
        prevSymbolStack,
        currSymbolStack,
        prevStateStack,
        currStateStack,
        message,
        prevInput,
        currInput,
      )

      // 调试输出：显示这一步的栈变化
      // if (stepOperations.length > 0) {
      //   console.log(`第${i}步栈变化:`)
      //   console.log('  消息:', message)
      //   console.log('  符号栈:', prevSymbolStack, '->', currSymbolStack)
      //   console.log('  状态栈:', prevStateStack, '->', currStateStack)
      //   console.log('  操作:', stepOperations)
      // }

      operations.push(...stepOperations)
    }

    return operations
  }

  /**
   * 分析单个步骤的栈变化
   */
  private analyzeStep(
    prevSymbolStack: string[],
    currSymbolStack: string[],
    prevStateStack: string[],
    currStateStack: string[],
    message: string,
    prevInput: string,
    currInput: string,
  ): StackOperation[] {
    const operations: StackOperation[] = []

    // 直接分析符号栈的变化
    const symbolStackDiff = this.findStackDifference(prevSymbolStack, currSymbolStack)
    symbolStackDiff.forEach((op) => {
      op.stackType = 'symbol'
    })

    // 直接分析状态栈的变化
    const stateStackDiff = this.findStackDifference(prevStateStack, currStateStack)
    stateStackDiff.forEach((op) => {
      op.stackType = 'state'
    })

    // 分析输入串变化（根据LR动作类型）
    const inputChanged = prevInput !== currInput
    if (inputChanged) {
      // 判断是否为移进操作
      const isShiftAction = this.isShiftAction(message)
      if (isShiftAction) {
        // 移进操作：添加匹配操作（消耗输入字符）
        const consumedChar = this.getConsumedCharacter(prevInput, currInput)
        if (consumedChar) {
          operations.push({
            type: 'match',
            symbol: consumedChar,
            step: this.currentStep,
            index: 999, // 匹配操作放在最后
          })
        }
      }
    }

    // 合并所有操作
    operations.push(...symbolStackDiff, ...stateStackDiff)

    return operations
  }

  /**
   * 判断是否为移进操作
   */
  private isShiftAction(message: string): boolean {
    // 移进操作格式：Action[3,b]=s4: 状态4入栈
    return message.includes('=s') && !message.includes('=r') && !message.includes('Goto')
  }

  /**
   * 获取被消耗的字符
   */
  private getConsumedCharacter(prevInput: string, currInput: string): string | null {
    if (prevInput.length > currInput.length) {
      // 输入串变短了，返回被消耗的字符
      return prevInput[prevInput.length - currInput.length - 1] || null
    }
    return null
  }
}
