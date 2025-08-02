import { useLL1AnimationStore } from './ll1AnimationStore'
import { useLR0AnimationStore } from './lr0AnimationStore'
import { useSLR1AnimationStore } from './slr1AnimationStore'

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
        return useLR0AnimationStore()
      case 'SLR1':
        return useSLR1AnimationStore()
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
