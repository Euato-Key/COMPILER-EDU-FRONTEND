import { gsap } from 'gsap'
// import type { LR0AnalysisStepInfo } from '@/types/lr0'
import { parseLRMessage } from '../utils/messageParser'

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
