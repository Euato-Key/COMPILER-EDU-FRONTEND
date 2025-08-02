import { gsap } from 'gsap'
import type { AnalysisStepInfo } from '@/types/ll1'
import { parseLL1Message } from '../utils/messageParser'
import { useLL1Store } from '@/stores/ll1'

export const ANIMATION_DURATIONS = {
  symbolFly: 0.5,
  stackPop: 0.3,
  pointerMove: 0.4,
  highlight: 0.2,
  messageShow: 0.3,
}

export function createLL1Timeline(steps: AnalysisStepInfo, refs: any) {
  const tl = gsap.timeline({ paused: true })
  const len = steps.info_step.length
  for (let i = 0; i < len; i++) {
    const msg = steps.info_msg[i]
    const parsed = parseLL1Message(msg)
    if (parsed.type === 'production' && Array.isArray(parsed.right)) {
      parsed.right.forEach((symbol: string) => {
        tl.to(refs.stack, {
          onStart: () => refs.pushStack(symbol),
          duration: ANIMATION_DURATIONS.symbolFly,
        })
      })
      tl.to({}, { duration: ANIMATION_DURATIONS.messageShow })
    } else if (parsed.type === 'match') {
      tl.to(refs.stack, {
        onStart: () => refs.matchSymbol(parsed.symbol),
        duration: ANIMATION_DURATIONS.highlight,
      })
      tl.to(refs.input, {
        onStart: () => refs.movePointer(),
        duration: ANIMATION_DURATIONS.pointerMove,
      })
    } else if (parsed.type === 'epsilon') {
      tl.to(refs.stack, {
        onStart: () => refs.epsilonPop(parsed.left),
        duration: ANIMATION_DURATIONS.stackPop,
      })
      tl.to({}, { duration: ANIMATION_DURATIONS.messageShow })
    } else {
      tl.to({}, { duration: ANIMATION_DURATIONS.messageShow })
    }
  }
  return tl
}

/**
 * 创建增强版LL1动画时间线（使用Store中的解析数据）
 */
export function createEnhancedLL1Timeline(refs: any) {
  const store = useLL1Store()

  // 直接从Store获取解析好的动画指令
  const instructions = store.animationInstructions

  if (!instructions || instructions.length === 0) {
    console.warn('没有可用的动画指令，请先解析数据')
    return gsap.timeline({ paused: true })
  }

  // 创建时间线
  const tl = gsap.timeline({ paused: true })

  instructions.forEach((instruction) => {
    tl.to(
      refs.stack,
      {
        onStart: () => {
          switch (instruction.action) {
            case 'pushToStack':
              refs.pushStack(instruction.symbol)
              break
            case 'popFromStack':
              refs.popStack(instruction.symbol)
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
 * 自动解析和创建动画的便捷函数
 */
export async function createAutoLL1Timeline(refs: any, forceReparse = false) {
  const store = useLL1Store()

  // 如果需要重新解析，或者还没有解析过
  if (forceReparse || store.animationDataStatus !== 'ready') {
    await store.parseAnimationData()
  }

  return createEnhancedLL1Timeline(refs)
}
