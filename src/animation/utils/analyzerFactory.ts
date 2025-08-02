import { LL1StackAnalyzer } from './ll1StackAnalyzer'
import { LRStackAnalyzer } from './lrStackAnalyzer'
import type { IStackAnalyzer } from '../types/animation'

/**
 * 分析器工厂类
 */
export class AnalyzerFactory {
  /**
   * 创建分析器实例
   */
  static create(type: 'LL1' | 'LR0' | 'SLR1', data: any): IStackAnalyzer {
    switch (type) {
      case 'LL1':
        return new LL1StackAnalyzer(data)
      case 'LR0':
      case 'SLR1':
        return new LRStackAnalyzer(data)
      default:
        throw new Error(`不支持的分析器类型: ${type}`)
    }
  }

  /**
   * 获取支持的分析器类型
   */
  static getSupportedTypes(): string[] {
    return ['LL1', 'LR0', 'SLR1']
  }

  /**
   * 检查是否支持某种分析器类型
   */
  static isSupported(type: string): boolean {
    return this.getSupportedTypes().includes(type)
  }
}
