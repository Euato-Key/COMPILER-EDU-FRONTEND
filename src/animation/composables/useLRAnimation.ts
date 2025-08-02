import { gsap } from 'gsap'
// import type { LR0AnalysisStepInfo } from '@/types/lr0'
import { parseLRMessage } from '../utils/messageParser'
import { useLR0AnimationStore, useSLR1AnimationStore } from '@/animation/store'
import type { AnimationInstruction } from '@/animation/types/animation'

export const ANIMATION_DURATIONS = {
  symbolFly: 0.5,
  stackPop: 0.3,
  pointerMove: 0.4,
  highlight: 0.2,
  messageShow: 0.3,
}

export function createLRTimeline(steps: any, refs: any) {
  const tl = gsap.timeline({ paused: true })
  const len = steps.info_step.length
  for (let i = 0; i < len; i++) {
    const msg = steps.info_msg[i]
    const parsed = parseLRMessage(msg)
    if (parsed.type === 'shift') {
      tl.to(refs.stateStack, {
        onStart: () => refs.pushState(parsed.newState),
        duration: ANIMATION_DURATIONS.symbolFly,
      })
      tl.to(refs.symbolStack, {
        onStart: () => refs.pushSymbol(parsed.symbol),
        duration: ANIMATION_DURATIONS.symbolFly,
      })
      tl.to(refs.input, {
        onStart: () => refs.movePointer(),
        duration: ANIMATION_DURATIONS.pointerMove,
      })
    } else if (parsed.type === 'reduce' && parsed.production) {
      tl.to(refs.symbolStack, {
        onStart: () => refs.reduceSymbols(parsed.production),
        duration: ANIMATION_DURATIONS.stackPop,
      })
      tl.to(refs.stateStack, {
        onStart: () => refs.reduceStates(),
        duration: ANIMATION_DURATIONS.stackPop,
      })
      tl.to(refs.symbolStack, {
        onStart: () => refs.pushSymbol(parsed.production?.split('->')[0].trim() || ''),
        duration: ANIMATION_DURATIONS.symbolFly,
      })
      tl.to(refs.stateStack, {
        onStart: () => refs.pushState(''),
        duration: ANIMATION_DURATIONS.symbolFly,
      })
    } else if (parsed.type === 'accept') {
      tl.to({}, { duration: ANIMATION_DURATIONS.messageShow })
    } else {
      tl.to({}, { duration: ANIMATION_DURATIONS.messageShow })
    }
  }
  return tl
}

/**
 * 创建增强版LR0动画时间线（使用Store中的解析数据）
 */
export function createEnhancedLR0Timeline(refs: any) {
  const animationStore = useLR0AnimationStore()

  // 直接从动画Store获取解析好的动画指令
  const instructions = animationStore.animationInstructions

  if (!instructions || instructions.length === 0) {
    console.warn('没有可用的LR0动画指令，请先解析数据')
    return gsap.timeline({ paused: true })
  }

  // 创建时间线
  const tl = gsap.timeline({ paused: true })

  instructions.forEach((instruction: AnimationInstruction) => {
    tl.to(
      refs.symbolStack,
      {
        onStart: () => {
          switch (instruction.action) {
            case 'pushToStack':
              refs.pushSymbol(instruction.symbol)
              break
            case 'popFromStack':
              refs.popSymbol(instruction.symbol)
              break
            case 'matchSymbol':
              refs.matchSymbol(instruction.symbol)
              // 同时移动输入指针
              tl.to(
                refs.input,
                {
                  onStart: () => refs.movePointer(),
                  duration: ANIMATION_DURATIONS.pointerMove,
                },
                instruction.delay + instruction.duration * 0.5,
              )
              break
          }
        },
        duration: instruction.duration,
      },
      instruction.delay,
    )
  })

  return tl
}

/**
 * 创建增强版SLR1动画时间线（使用Store中的解析数据）
 */
export function createEnhancedSLR1Timeline(refs: any) {
  const animationStore = useSLR1AnimationStore()

  // 直接从动画Store获取解析好的动画指令
  const instructions = animationStore.animationInstructions

  if (!instructions || instructions.length === 0) {
    console.warn('没有可用的SLR1动画指令，请先解析数据')
    return gsap.timeline({ paused: true })
  }

  // 创建时间线
  const tl = gsap.timeline({ paused: true })

  instructions.forEach((instruction: AnimationInstruction) => {
    tl.to(
      refs.symbolStack,
      {
        onStart: () => {
          switch (instruction.action) {
            case 'pushToStack':
              refs.pushSymbol(instruction.symbol)
              break
            case 'popFromStack':
              refs.popSymbol(instruction.symbol)
              break
            case 'matchSymbol':
              refs.matchSymbol(instruction.symbol)
              // 同时移动输入指针
              tl.to(
                refs.input,
                {
                  onStart: () => refs.movePointer(),
                  duration: ANIMATION_DURATIONS.pointerMove,
                },
                instruction.delay + instruction.duration * 0.5,
              )
              break
          }
        },
        duration: instruction.duration,
      },
      instruction.delay,
    )
  })

  return tl
}

/**
 * 自动解析和创建LR0动画的便捷函数
 */
export async function createAutoLR0Timeline(refs: any, forceReparse = false) {
  const animationStore = useLR0AnimationStore()

  // 如果需要重新解析，或者还没有解析过
  if (forceReparse || animationStore.parseStatus !== 'ready') {
    // 从主Store获取输入分析结果
    const { useLR0Store } = await import('@/stores/lr0')
    const lr0Store = useLR0Store()
    const analysisResult = lr0Store.inputAnalysisResult

    if (!analysisResult) {
      throw new Error('没有可用的LR0分析结果，请先执行输入串分析')
    }

    await animationStore.parseAnimationData(analysisResult)
  }

  return createEnhancedLR0Timeline(refs)
}

/**
 * 自动解析和创建SLR1动画的便捷函数
 */
export async function createAutoSLR1Timeline(refs: any, forceReparse = false) {
  const animationStore = useSLR1AnimationStore()

  // 如果需要重新解析，或者还没有解析过
  if (forceReparse || animationStore.parseStatus !== 'ready') {
    // 从主Store获取输入分析结果
    const { useSLR1Store } = await import('@/stores/slr1')
    const slr1Store = useSLR1Store()
    const analysisResult = slr1Store.inputAnalysisResult

    if (!analysisResult) {
      throw new Error('没有可用的SLR1分析结果，请先执行输入串分析')
    }

    await animationStore.parseAnimationData(analysisResult)
  }

  return createEnhancedSLR1Timeline(refs)
}
