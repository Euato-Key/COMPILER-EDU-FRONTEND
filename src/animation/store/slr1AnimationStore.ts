import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { AnalyzerFactory } from '../utils/analyzerFactory'
import { AnimationInstructionGenerator } from '../utils/instructionGenerator'
import type { StackOperation, AnimationInstruction } from '../types/animation'

/**
 * SLR1动画专用Store
 * 处理SLR1算法的动画数据解析和状态管理
 */
export const useSLR1AnimationStore = defineStore('slr1Animation', () => {
  // 状态
  const stackOperations = ref<StackOperation[]>([])
  const animationInstructions = ref<AnimationInstruction[]>([])
  const parseStatus = ref<'idle' | 'parsing' | 'ready' | 'error'>('idle')
  const parseError = ref<string | null>(null)

  // 当前动画状态
  const currentStep = ref(0)
  const isPlaying = ref(false)
  const playbackSpeed = ref(1)

  // 新增：步骤映射系统
  const stepMapping = ref<Map<number, number[]>>(new Map()) // analysisStep -> animationSteps
  const reverseStepMapping = ref<Map<number, number>>(new Map()) // animationStep -> analysisStep

  // 计算属性
  const totalSteps = computed(() => animationInstructions.value.length)
  const hasAnimationData = computed(() => animationInstructions.value.length > 0)
  const canPlay = computed(() => parseStatus.value === 'ready' && totalSteps.value > 0)

  /**
   * 解析SLR1分析数据生成动画指令
   */
  const parseAnimationData = async (stepData: any) => {
    try {
      parseStatus.value = 'parsing'
      parseError.value = null

      // 数据验证
      if (!stepData) {
        throw new Error('没有可用的分析数据')
      }

      if (!stepData.info_symbol_stack || !Array.isArray(stepData.info_symbol_stack)) {
        throw new Error('无效的符号栈数据格式')
      }

      if (!stepData.info_state_stack || !Array.isArray(stepData.info_state_stack)) {
        throw new Error('无效的状态栈数据格式')
      }

      console.log('开始解析SLR1动画数据:', stepData)

      // 1. 使用LR栈差异分析器（SLR1使用相同的LR分析器）
      const analyzer = AnalyzerFactory.create('SLR1', stepData)
      const stackOps = analyzer.analyzeStackDifferences()
      stackOperations.value = stackOps

      // 分别打印符号栈和状态栈操作
      const symbolStackOps = stackOps.filter((op) => op.stackType === 'symbol')
      const stateStackOps = stackOps.filter((op) => op.stackType === 'state')

      console.log('SLR1符号栈操作解析完成:', symbolStackOps)
      console.log('SLR1状态栈操作解析完成:', stateStackOps)
      console.log('SLR1总栈操作解析完成:', stackOps)

      // 2. 生成动画指令，传递原始数据
      const instructionGen = new AnimationInstructionGenerator()
      const instructions = instructionGen.generate(stackOps, stepData)
      animationInstructions.value = instructions

      console.log('SLR1动画指令生成完成:', instructions)

      // 3. 建立步骤映射关系
      buildStepMappings()

      parseStatus.value = 'ready'
    } catch (error) {
      console.error('解析SLR1动画数据失败:', error)
      parseError.value = error instanceof Error ? error.message : '未知错误'
      parseStatus.value = 'error'
      throw error
    }
  }

  /**
   * 清空所有动画数据
   */
  const clearAnimationData = () => {
    stackOperations.value = []
    animationInstructions.value = []
    parseStatus.value = 'idle'
    parseError.value = null
    currentStep.value = 0
    isPlaying.value = false
  }

  /**
   * 重置动画播放状态
   */
  const resetPlayback = () => {
    currentStep.value = 0
    isPlaying.value = false
  }

  /**
   * 设置播放速度
   */
  const setPlaybackSpeed = (speed: number) => {
    playbackSpeed.value = Math.max(0.1, Math.min(5, speed))
  }

  /**
   * 建立步骤映射关系
   */
  const buildStepMappings = () => {
    stepMapping.value.clear()
    reverseStepMapping.value.clear()

    animationInstructions.value.forEach((instruction) => {
      // 建立分析步骤到动画步骤的映射
      if (!stepMapping.value.has(instruction.analysisStep)) {
        stepMapping.value.set(instruction.analysisStep, [])
      }
      stepMapping.value.get(instruction.analysisStep)!.push(instruction.step)

      // 建立动画步骤到分析步骤的反向映射
      reverseStepMapping.value.set(instruction.step, instruction.analysisStep)
    })
  }

  /**
   * 根据分析步骤获取对应的动画指令
   */
  const getInstructionsForAnalysisStep = (analysisStep: number): AnimationInstruction[] => {
    return animationInstructions.value.filter((inst) => inst.analysisStep === analysisStep)
  }

  /**
   * 跳转到指定分析步骤
   */
  const jumpToAnalysisStep = (analysisStep: number) => {
    const targetInstructions = getInstructionsForAnalysisStep(analysisStep)
    if (targetInstructions.length > 0) {
      // 跳转到该分析步骤的第一个动画指令
      currentStep.value = targetInstructions[0].step
    }
  }

  /**
   * 获取当前分析步骤
   */
  const getCurrentAnalysisStep = computed(() => {
    const reverseMap = reverseStepMapping.value
    return reverseMap.get(currentStep.value) || 0
  })

  /**
   * 获取当前步骤的动画指令
   */
  const getCurrentInstruction = computed(() => {
    return animationInstructions.value[currentStep.value] || null
  })

  /**
   * 设置当前步骤
   */
  const setCurrentStep = (step: number) => {
    if (step >= 0 && step <= totalSteps.value) {
      currentStep.value = step
    }
  }

  /**
   * 播放控制
   */
  const play = () => {
    if (canPlay.value) {
      isPlaying.value = true
    }
  }

  const pause = () => {
    isPlaying.value = false
  }

  const stop = () => {
    pause()
    resetPlayback()
  }

  /**
   * 获取指定步骤的动画指令
   */
  const getInstructionAtStep = (step: number): AnimationInstruction | null => {
    if (step >= 0 && step < animationInstructions.value.length) {
      return animationInstructions.value[step]
    }
    return null
  }

  /**
   * 获取指定步骤范围的指令
   */
  const getInstructionsInRange = (startStep: number, endStep: number): AnimationInstruction[] => {
    return animationInstructions.value.filter(
      (instruction) => instruction.step >= startStep && instruction.step <= endStep,
    )
  }

  /**
   * 获取指定步骤的栈操作
   */
  const getStackOperationsForStep = (step: number): StackOperation[] => {
    return stackOperations.value.filter((operation) => operation.step === step)
  }

  /**
   * 获取动画统计信息
   */
  const getAnimationStats = () => {
    const pushCount = stackOperations.value.filter((op) => op.type === 'push').length
    const popCount = stackOperations.value.filter((op) => op.type === 'pop').length
    const matchCount = stackOperations.value.filter((op) => op.type === 'match').length

    return {
      totalOperations: stackOperations.value.length,
      totalInstructions: animationInstructions.value.length,
      pushCount,
      popCount,
      matchCount,
      totalSteps: new Set(stackOperations.value.map((op) => op.step)).size,
    }
  }

  return {
    // 状态
    stackOperations,
    animationInstructions,
    parseStatus,
    parseError,
    currentStep,
    isPlaying,
    playbackSpeed,

    // 计算属性
    totalSteps,
    hasAnimationData,
    canPlay,
    getCurrentInstruction,
    getCurrentAnalysisStep,

    // 方法
    parseAnimationData,
    clearAnimationData,
    resetPlayback,
    setCurrentStep,
    play,
    pause,
    stop,
    setPlaybackSpeed,
    getInstructionAtStep,
    getInstructionsInRange,
    getStackOperationsForStep,
    getAnimationStats,

    // 新增步骤管理方法
    stepMapping,
    reverseStepMapping,
    getInstructionsForAnalysisStep,
    jumpToAnalysisStep,
  }
})
