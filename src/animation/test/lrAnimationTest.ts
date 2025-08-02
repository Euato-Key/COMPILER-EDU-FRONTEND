// 测试LR0和SLR1动画方案的示例

import { useLR0AnimationStore, useSLR1AnimationStore } from '@/animation/store'
import {
  createEnhancedLR0Timeline,
  createEnhancedSLR1Timeline,
} from '@/animation/composables/useLRAnimation'

/**
 * 测试LR0动画解析功能
 */
export async function testLR0Animation() {
  const animationStore = useLR0AnimationStore()

  // 模拟LR0测试数据
  const testData = {
    info_symbol_stack: ['#', '#E', '#E+', '#E+T', '#E+T*', '#E+T*F', '#E+T', '#E'],
    info_state_stack: ['0', '01', '015', '01510', '015107', '0151074', '01510', '015'],
    info_action: ['s5', 's7', 's4', 'r4', 'r2', 'r1', 'acc'],
    info_msg: [
      'ACTION[0,id]=s5',
      'ACTION[5,+]=s7',
      'ACTION[7,id]=s4',
      'r4: F->id',
      'r2: T->T*F',
      'r1: E->E+T',
      'accept',
    ],
    info_step: [1, 2, 3, 4, 5, 6, 7],
    info_str: ['id+id*id#', '+id*id#', 'id*id#', 'id#', 'id#', 'id#', '#'],
    info_res: 'Success!',
  }

  try {
    console.log('开始测试LR0动画解析...')

    // 1. 解析动画数据
    await animationStore.parseAnimationData(testData)

    console.log('LR0解析状态:', animationStore.parseStatus)
    console.log('LR0栈操作数量:', animationStore.stackOperations.length)
    console.log('LR0动画指令数量:', animationStore.animationInstructions.length)

    // 2. 测试创建动画时间线
    const mockRefs = {
      symbolStack: {},
      stateStack: {},
      input: {},
      pushSymbol: (symbol: string) => console.log('LR0 Push Symbol:', symbol),
      popSymbol: (symbol: string) => console.log('LR0 Pop Symbol:', symbol),
      pushState: (state: string) => console.log('LR0 Push State:', state),
      popState: (state: string) => console.log('LR0 Pop State:', state),
      matchSymbol: (symbol: string) => console.log('LR0 Match Symbol:', symbol),
      movePointer: () => console.log('LR0 Move pointer'),
    }

    const timeline = createEnhancedLR0Timeline(mockRefs)
    console.log('LR0动画时间线创建成功，持续时间:', timeline.duration())

    return {
      success: true,
      stackOperations: animationStore.stackOperations,
      animationInstructions: animationStore.animationInstructions,
      timeline,
      stats: animationStore.getAnimationStats(),
    }
  } catch (error) {
    console.error('LR0测试失败:', error)
    return {
      success: false,
      error,
    }
  }
}

/**
 * 测试SLR1动画解析功能
 */
export async function testSLR1Animation() {
  const animationStore = useSLR1AnimationStore()

  // 模拟SLR1测试数据
  const testData = {
    info_symbol_stack: ['#', '#E', '#E+', '#E+T', '#E+T*', '#E+T*F', '#E+T', '#E'],
    info_state_stack: ['0', '01', '015', '01510', '015107', '0151074', '01510', '015'],
    info_action: ['s5', 's7', 's4', 'r4', 'r2', 'r1', 'acc'],
    info_msg: [
      'ACTION[0,id]=s5',
      'ACTION[5,+]=s7',
      'ACTION[7,id]=s4',
      'r4: F->id',
      'r2: T->T*F',
      'r1: E->E+T',
      'accept',
    ],
    info_step: [1, 2, 3, 4, 5, 6, 7],
    info_str: ['id+id*id#', '+id*id#', 'id*id#', 'id#', 'id#', 'id#', '#'],
    info_res: 'Success!',
  }

  try {
    console.log('开始测试SLR1动画解析...')

    // 1. 解析动画数据
    await animationStore.parseAnimationData(testData)

    console.log('SLR1解析状态:', animationStore.parseStatus)
    console.log('SLR1栈操作数量:', animationStore.stackOperations.length)
    console.log('SLR1动画指令数量:', animationStore.animationInstructions.length)

    // 2. 测试创建动画时间线
    const mockRefs = {
      symbolStack: {},
      stateStack: {},
      input: {},
      pushSymbol: (symbol: string) => console.log('SLR1 Push Symbol:', symbol),
      popSymbol: (symbol: string) => console.log('SLR1 Pop Symbol:', symbol),
      pushState: (state: string) => console.log('SLR1 Push State:', state),
      popState: (state: string) => console.log('SLR1 Pop State:', state),
      matchSymbol: (symbol: string) => console.log('SLR1 Match Symbol:', symbol),
      movePointer: () => console.log('SLR1 Move pointer'),
    }

    const timeline = createEnhancedSLR1Timeline(mockRefs)
    console.log('SLR1动画时间线创建成功，持续时间:', timeline.duration())

    return {
      success: true,
      stackOperations: animationStore.stackOperations,
      animationInstructions: animationStore.animationInstructions,
      timeline,
      stats: animationStore.getAnimationStats(),
    }
  } catch (error) {
    console.error('SLR1测试失败:', error)
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
  ;(window as any).testLR0Animation = testLR0Animation
  ;(window as any).testSLR1Animation = testSLR1Animation
  console.log('使用 testLR0Animation() 和 testSLR1Animation() 在控制台中测试LR系列动画方案')
}
