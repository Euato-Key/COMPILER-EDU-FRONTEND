import { gsap } from 'gsap'
import type { AnalysisStepInfo } from '@/types/ll1'
import { parseLL1Message } from '../utils/messageParser'

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
