import { ref, computed, type Ref } from 'vue'
import { gsap } from 'gsap'

export interface AnimationStep {
  stepIndex: number
  stackChanges?: {
    before: string[]
    after: string[]
    operation: 'push' | 'pop' | 'multiple-push' | 'multiple-pop'
  }
  inputChanges?: {
    pointerFrom: number
    pointerTo: number
    isMatching?: boolean
    hasError?: boolean
  }
  productionChanges?: {
    production: any
    isActive: boolean
  }
  duration: number
  delay: number
}

export function useEnhancedAnimationControl(totalSteps: Ref<number>) {
  const isPlaying = ref(false)
  const currentStep = ref(0)
  const speed = ref(1)
  const timeline = ref<gsap.core.Timeline | null>(null)
  const animationSteps = ref<AnimationStep[]>([])
  const pendingAnimations = ref<Set<string>>(new Set())

  // 动画完成追踪
  const trackAnimationCompletion = (animationType: string) => {
    pendingAnimations.value.add(animationType)

    return () => {
      pendingAnimations.value.delete(animationType)

      // 如果所有动画都完成，继续下一步
      if (pendingAnimations.value.size === 0 && isPlaying.value) {
        proceedToNextStep()
      }
    }
  }

  // 继续下一步
  const proceedToNextStep = () => {
    if (currentStep.value < totalSteps.value - 1) {
      setTimeout(() => {
        if (isPlaying.value) {
          currentStep.value++
        }
      }, 200) // 短暂延迟确保动画完成
    } else {
      // 播放完成
      isPlaying.value = false
    }
  }

  // 播放控制
  const play = () => {
    isPlaying.value = true
    if (timeline.value) {
      timeline.value.play()
    } else {
      proceedToNextStep()
    }
  }

  const pause = () => {
    isPlaying.value = false
    if (timeline.value) {
      timeline.value.pause()
    }
  }

  const reset = () => {
    isPlaying.value = false
    currentStep.value = 0
    pendingAnimations.value.clear()
    if (timeline.value) {
      timeline.value.restart().pause()
    }
  }

  const step = () => {
    if (currentStep.value < totalSteps.value - 1) {
      currentStep.value++
      isPlaying.value = false
    }
  }

  const stepBack = () => {
    if (currentStep.value > 0) {
      currentStep.value--
      isPlaying.value = false
      pendingAnimations.value.clear()
    }
  }

  const setSpeed = (newSpeed: number) => {
    speed.value = newSpeed
    if (timeline.value) {
      timeline.value.timeScale(newSpeed)
    }
  }

  // 创建协调动画时间线
  const createCoordinatedTimeline = (
    analysisData: any,
    stackAnalyzer: (step: number) => string[],
    inputAnalyzer: (step: number) => { pointer: number; isMatching: boolean },
    productionAnalyzer: (step: number) => any,
  ) => {
    const steps: AnimationStep[] = []

    for (let i = 0; i < totalSteps.value; i++) {
      const step: AnimationStep = {
        stepIndex: i,
        duration: 0.5 / speed.value,
        delay: 0.1 / speed.value,
      }

      // 分析栈变化
      if (i > 0) {
        const prevStack = stackAnalyzer(i - 1)
        const currentStack = stackAnalyzer(i)

        if (JSON.stringify(prevStack) !== JSON.stringify(currentStack)) {
          step.stackChanges = {
            before: prevStack,
            after: currentStack,
            operation:
              currentStack.length > prevStack.length
                ? currentStack.length - prevStack.length === 1
                  ? 'push'
                  : 'multiple-push'
                : prevStack.length - currentStack.length === 1
                  ? 'pop'
                  : 'multiple-pop',
          }
        }
      }

      // 分析输入变化
      if (i > 0) {
        const prevInput = inputAnalyzer(i - 1)
        const currentInput = inputAnalyzer(i)

        if (prevInput.pointer !== currentInput.pointer) {
          step.inputChanges = {
            pointerFrom: prevInput.pointer,
            pointerTo: currentInput.pointer,
            isMatching: currentInput.isMatching,
          }
        }
      }

      // 分析产生式变化
      const production = productionAnalyzer(i)
      if (production) {
        step.productionChanges = {
          production,
          isActive: true,
        }
      }

      steps.push(step)
    }

    animationSteps.value = steps

    // 创建GSAP时间线
    const tl = gsap.timeline({
      paused: true,
      onUpdate: () => {
        const progress = tl.progress()
        const targetStep = Math.floor(progress * (steps.length - 1))
        if (targetStep !== currentStep.value && !isPlaying.value) {
          currentStep.value = targetStep
        }
      },
    })

    steps.forEach((step, index) => {
      tl.addLabel(`step-${index}`, index * (step.duration + step.delay))

      // 添加步骤变化回调
      tl.call(
        () => {
          if (isPlaying.value) {
            currentStep.value = index
          }
        },
        [],
        index * (step.duration + step.delay),
      )
    })

    timeline.value = tl
    return tl
  }

  // 获取当前步骤的动画配置
  const getCurrentStepAnimation = computed(() => {
    return animationSteps.value[currentStep.value] || null
  })

  // 分析栈操作类型
  const analyzeStackOperation = (
    oldStack: string[],
    newStack: string[],
  ): {
    type: 'push' | 'pop' | 'reduce' | 'none'
    items?: string[]
    count?: number
  } => {
    if (oldStack.length === newStack.length) {
      return { type: 'none' }
    }

    if (newStack.length > oldStack.length) {
      // 入栈操作
      const newItems = newStack.slice(oldStack.length)
      return { type: 'push', items: newItems }
    } else {
      // 出栈操作
      const removedCount = oldStack.length - newStack.length

      // 检查是否为归约操作（出栈多个后入栈一个）
      if (removedCount > 1) {
        return { type: 'reduce', count: removedCount }
      } else {
        return { type: 'pop', count: removedCount }
      }
    }
  }

  // 计算动画延迟时间
  const calculateAnimationDelay = (operationType: string): number => {
    const baseDelay = 0.1 / speed.value
    const delays: Record<string, number> = {
      'stack-push': baseDelay,
      'stack-pop': baseDelay * 1.5,
      'stack-reduce': baseDelay * 2,
      'input-move': baseDelay * 0.8,
      'production-change': baseDelay * 0.5,
    }

    return delays[operationType] || baseDelay
  }

  // 同步所有组件状态
  const syncComponentStates = () => {
    pendingAnimations.value.clear()
  }

  return {
    // 状态
    isPlaying,
    currentStep,
    speed,
    animationSteps,
    pendingAnimations,
    getCurrentStepAnimation,

    // 方法
    play,
    pause,
    reset,
    step,
    stepBack,
    setSpeed,
    createCoordinatedTimeline,
    trackAnimationCompletion,
    analyzeStackOperation,
    calculateAnimationDelay,
    syncComponentStates,

    // 时间线
    timeline,
  }
}

// 动画序列协调器
export class AnimationSequenceCoordinator {
  private steps: AnimationStep[] = []
  private currentStepIndex = 0
  private isRunning = false
  private callbacks: Record<string, (() => void)[]> = {}

  constructor(private speedMultiplier: number = 1) {}

  addStep(step: AnimationStep) {
    this.steps.push(step)
  }

  addEventListener(event: string, callback: () => void) {
    if (!this.callbacks[event]) {
      this.callbacks[event] = []
    }
    this.callbacks[event].push(callback)
  }

  private emit(event: string) {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach((callback) => callback())
    }
  }

  async play() {
    if (this.isRunning) return

    this.isRunning = true
    this.emit('play-start')

    while (this.currentStepIndex < this.steps.length && this.isRunning) {
      const step = this.steps[this.currentStepIndex]

      this.emit('step-start')

      // 执行当前步骤的动画
      await this.executeStep(step)

      this.emit('step-complete')

      // 等待步骤间隔
      if (step.delay) {
        await new Promise((resolve) =>
          setTimeout(resolve, (step.delay! * 1000) / this.speedMultiplier),
        )
      }

      this.currentStepIndex++
    }

    this.isRunning = false
    this.emit('play-complete')
  }

  pause() {
    this.isRunning = false
    this.emit('pause')
  }

  reset() {
    this.isRunning = false
    this.currentStepIndex = 0
    this.emit('reset')
  }

  private async executeStep(step: AnimationStep): Promise<void> {
    const promises: Promise<void>[] = []

    // 栈动画
    if (step.stackChanges) {
      promises.push(this.executeStackAnimation(step.stackChanges))
    }

    // 输入串动画
    if (step.inputChanges) {
      promises.push(this.executeInputAnimation(step.inputChanges))
    }

    // 产生式动画
    if (step.productionChanges) {
      promises.push(this.executeProductionAnimation(step.productionChanges))
    }

    // 等待所有动画完成
    await Promise.all(promises)
  }

  private async executeStackAnimation(
    _changes: NonNullable<AnimationStep['stackChanges']>,
  ): Promise<void> {
    return new Promise((resolve) => {
      const duration = (0.3 / this.speedMultiplier) * 1000
      setTimeout(resolve, duration)
    })
  }

  private async executeInputAnimation(
    _changes: NonNullable<AnimationStep['inputChanges']>,
  ): Promise<void> {
    return new Promise((resolve) => {
      const duration = (0.2 / this.speedMultiplier) * 1000
      setTimeout(resolve, duration)
    })
  }

  private async executeProductionAnimation(
    _changes: NonNullable<AnimationStep['productionChanges']>,
  ): Promise<void> {
    return new Promise((resolve) => {
      const duration = (0.25 / this.speedMultiplier) * 1000
      setTimeout(resolve, duration)
    })
  }

  setSpeed(multiplier: number) {
    this.speedMultiplier = multiplier
  }

  getCurrentStep(): AnimationStep | null {
    return this.steps[this.currentStepIndex] || null
  }

  getProgress(): number {
    return this.steps.length > 0 ? this.currentStepIndex / this.steps.length : 0
  }
}
