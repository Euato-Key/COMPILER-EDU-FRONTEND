import type { StackOperation, IStackAnalyzer } from '../types/animation'

/**
 * 栈状态差异分析器基类
 */
export abstract class StackDiffAnalyzer implements IStackAnalyzer {
  protected data: any
  protected currentStep: number = 0

  constructor(data: any) {
    this.data = data
  }

  /**
   * 分析栈状态差异，生成操作序列
   */
  abstract analyzeStackDifferences(): StackOperation[]

  /**
   * 解析栈字符串为数组
   */
  protected parseStack(stackStr: string): string[] {
    if (!stackStr || typeof stackStr !== 'string') {
      return []
    }
    return stackStr
      .replace(/\s+/g, '')
      .split('')
      .filter((c) => c !== '')
  }

  /**
   * 比较两个栈状态，找出差异
   */
  protected findStackDifference(prev: string[], curr: string[]): StackOperation[] {
    const operations: StackOperation[] = []

    // 找到最长公共前缀
    let commonPrefixLength = 0
    const minLength = Math.min(prev.length, curr.length)

    for (let i = 0; i < minLength; i++) {
      if (prev[i] === curr[i]) {
        commonPrefixLength++
      } else {
        break
      }
    }

    // 生成pop操作（移除prev中多余的部分）
    for (let i = prev.length - 1; i >= commonPrefixLength; i--) {
      operations.push({
        type: 'pop',
        symbol: prev[i],
        step: this.currentStep,
        index: operations.length,
      })
    }

    // 生成push操作（添加curr中新增的部分）
    for (let i = commonPrefixLength; i < curr.length; i++) {
      operations.push({
        type: 'push',
        symbol: curr[i],
        step: this.currentStep,
        index: operations.length,
      })
    }

    return operations
  }
}
