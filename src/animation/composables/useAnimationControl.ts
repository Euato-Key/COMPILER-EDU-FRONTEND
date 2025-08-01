import { ref, type Ref } from 'vue'
import { gsap } from 'gsap'

export function useAnimationControl(totalSteps: Ref<number>) {
  const isPlaying = ref(false)
  const currentStep = ref(0)
  const speed = ref(1)
  const timeline = ref<gsap.core.Timeline | null>(null)

  const play = () => {
    isPlaying.value = true
    timeline.value?.play()
  }

  const pause = () => {
    isPlaying.value = false
    timeline.value?.pause()
  }

  const reset = () => {
    isPlaying.value = false
    currentStep.value = 0
    timeline.value?.restart().pause()
  }

  const step = () => {
    if (timeline.value) {
      const steps = totalSteps.value
      if (currentStep.value < steps - 1) {
        currentStep.value++
        const progress = currentStep.value / (steps - 1)
        timeline.value.progress(progress)
      }
    }
  }

  const setSpeed = (newSpeed: number) => {
    speed.value = newSpeed
    timeline.value?.timeScale(newSpeed)
  }

  const createTimeline = (animations: (() => gsap.core.Timeline)[]) => {
    const tl = gsap.timeline({
      paused: true,
      onUpdate: () => {
        const progress = tl.progress()
        currentStep.value = Math.floor(progress * (animations.length - 1))
      },
    })
    animations.forEach((animFn) => {
      tl.add(animFn())
    })
    timeline.value = tl
    return tl
  }

  return {
    isPlaying,
    currentStep,
    speed,
    play,
    pause,
    reset,
    step,
    setSpeed,
    createTimeline,
    timeline,
  }
}
