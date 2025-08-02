// 测试新动画方案的简单示例

import { useLL1AnimationStore } from '@/animation/store'
import { createEnhancedLL1Timeline } from '@/animation/composables/useLL1Animation'

/**
 * 测试LL1动画解析功能
 */
export async function testLL1Animation() {
  const animationStore = useLL1AnimationStore()

  // 模拟一些测试数据
  const testData = {
    info_stack: ['#S', '#BA', '#BAa', '#BA', '#B', '#Bb', '#B', '#c', '#'],
    info_msg: [
      'S->AB',
      'A->aA',
      "'a'匹配",
      'A->aA',
      "'a'匹配",
      'A->ε 不入栈',
      'B->bB',
      "'b'匹配",
      'B->c',
      "'c'匹配",
      'Success!',
    ],
    info_step: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    info_str: ['aaabc#', 'aaabc#', 'aabc#', 'aabc#', 'abc#', 'abc#', 'bc#', 'bc#', 'c#', 'c#', '#'],
    info_res: 'Success!',
  }

  try {
    console.log('开始测试LL1动画解析...')

    // 1. 解析动画数据
    await animationStore.parseAnimationData(testData)

    console.log('解析状态:', animationStore.parseStatus)
    console.log('栈操作数量:', animationStore.stackOperations.length)
    console.log('动画指令数量:', animationStore.animationInstructions.length)

    // 2. 测试创建动画时间线
    const mockRefs = {
      stack: {},
      input: {},
      pushStack: (symbol: string) => console.log('Push:', symbol),
      popStack: (symbol: string) => console.log('Pop:', symbol),
      matchSymbol: (symbol: string) => console.log('Match:', symbol),
      movePointer: () => console.log('Move pointer'),
    }

    const timeline = createEnhancedLL1Timeline(mockRefs)
    console.log('动画时间线创建成功，持续时间:', timeline.duration())

    return {
      success: true,
      stackOperations: animationStore.stackOperations,
      animationInstructions: animationStore.animationInstructions,
      timeline,
    }
  } catch (error) {
    console.error('测试失败:', error)
    return {
      success: false,
      error,
    }
  }
}

/**
 * 在浏览器控制台中运行测试
 */
if (typeof window !== 'undefined') {
  ;(window as any).testLL1Animation = testLL1Animation
  console.log('使用 testLL1Animation() 在控制台中测试新的动画方案')
}
