import { useLL1AnimationStore } from './ll1AnimationStore'

/**
 * 动画Store工厂
 * 根据算法类型返回对应的动画Store
 */
export class AnimationStoreFactory {
  /**
   * 获取指定算法的动画Store
   */
  static getStore(algorithm: 'LL1' | 'LR0' | 'SLR1') {
    switch (algorithm) {
      case 'LL1':
        return useLL1AnimationStore()
      case 'LR0':
        // TODO: 实现LR0动画Store
        throw new Error('LR0动画Store尚未实现')
      case 'SLR1':
        // TODO: 实现SLR1动画Store
        throw new Error('SLR1动画Store尚未实现')
      default:
        throw new Error(`不支持的算法类型: ${algorithm}`)
    }
  }

  /**
   * 获取支持的算法类型
   */
  static getSupportedAlgorithms(): string[] {
    return ['LL1', 'LR0', 'SLR1']
  }
}
