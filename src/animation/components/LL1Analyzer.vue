<template>
  <div class="h-full flex flex-col">
    <!-- 主要内容区域 -->
    <div class="flex-1 flex flex-col lg:flex-row gap-3 p-3 min-h-0">
      <!-- 产生式显示区 -->
      <AnimatedProduction
        title="当前产生式"
        type="ll1"
        :production="currentMsg"
        :is-active="isPlaying"
        @animation-complete="onProductionAnimationComplete"
      />

      <!-- 栈区域 -->
      <AnimatedStack
        title="分析栈"
        :stack="currentStack"
        :highlight-top="true"
        highlight-color="#dbeafe"
        @animation-complete="onStackAnimationComplete"
      />

      <!-- 输入串区域 -->
      <AnimatedInput
        title="输入串"
        :input="currentInput"
        :pointer="pointer"
        :is-matching="currentMsg.type === 'match'"
        :has-error="false"
        @animation-complete="onInputAnimationComplete"
      />
    </div>

    <!-- 状态信息栏 -->
    <div class="flex-shrink-0 bg-white border-t border-gray-200 px-4 py-2">
      <div class="flex justify-between items-center text-sm text-gray-600">
        <div class="truncate max-w-[60%]">
          <span class="font-medium">动作:</span>
          {{ analysisMessage }}
        </div>
        <div class="font-medium">步骤: {{ currentStep + 1 }}/{{ totalSteps }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue'
import { useLL1Store } from '@/stores'
import { AnimationStoreFactory } from '@/animation/store/animationStoreFactory'
import AnimatedStack from './AnimatedStack.vue'
import AnimatedInput from './AnimatedInput.vue'
import AnimatedProduction from './AnimatedProduction.vue'

const props = defineProps<{
  algorithm: 'LL1'
  currentStep: number
  isPlaying: boolean
}>()

// 获取对应的动画Store
const animationStore = AnimationStoreFactory.getStore(props.algorithm)

// 获取初始输入串（从原始数据）
const getInitialInput = () => {
  // 尝试从CompilerAnalyzer的原始数据获取初始输入
  const ll1Store = useLL1Store()
  const rawData = ll1Store.inputAnalysisResult
  if (rawData?.info_str?.[0]) {
    return rawData.info_str[0].split('')
  }

  // 尝试从动画Store的第一个指令获取完整输入
  const firstInstruction = animationStore.getInstructionAtStep(0)
  if (firstInstruction?.targetState?.remainingInput) {
    return firstInstruction.targetState.remainingInput
  }

  // 如果都没有，返回空数组
  return []
}

// 获取初始栈状态
const getInitialStack = () => {
  // 从原始数据获取初始栈状态
  const ll1Store = useLL1Store()
  const rawData = ll1Store.inputAnalysisResult

  console.log('getInitialStack - rawData:', rawData)
  console.log('getInitialStack - info_stack:', rawData?.info_stack)
  console.log('getInitialStack - info_stack[0]:', rawData?.info_stack?.[0])

  if (rawData?.info_stack?.[0]) {
    // 解析初始栈状态 #S -> ['S', '#']
    const parsed = rawData.info_stack[0]
      .split('')
      .filter((c: string) => c !== '')
      .reverse()

    console.log('getInitialStack - parsed result:', parsed)
    return parsed
  }

  // 默认初始状态
  console.log("getInitialStack - using default: ['S', '#']")
  return ['S', '#']
}

const onStackAnimationComplete = () => {
  console.log('Stack animation completed')
}

const onInputAnimationComplete = () => {
  console.log('Input animation completed')
}

const onProductionAnimationComplete = () => {
  console.log('Production animation completed')
}

// 基于动画指令计算当前状态
const currentAnimationState = computed(() => {
  if (!animationStore.hasAnimationData) {
    console.log('LL1Analyzer: No animation data available')
    return null
  }

  // 获取当前步骤的指令
  const currentInstruction = animationStore.getInstructionAtStep(props.currentStep)

  // 调试信息
  console.log('LL1Analyzer - Current Step:', props.currentStep)
  console.log('LL1Analyzer - Current Instruction:', currentInstruction)

  // 如果是第0步，显示初始状态
  if (props.currentStep === 0) {
    console.log('LL1Analyzer: Showing initial state for step 0')
    const initialInput = getInitialInput()
    const initialStack = getInitialStack()

    console.log('LL1Analyzer - initialInput:', initialInput)
    console.log('LL1Analyzer - initialStack:', initialStack)

    const initialState = {
      stack: initialStack, // 使用真正的初始栈状态
      inputPointer: 0,
      remainingInput: initialInput,
      production: null,
    }

    console.log('LL1Analyzer - returning initial state:', initialState)
    return initialState
  }

  if (!currentInstruction || !currentInstruction.targetState) {
    console.log('LL1Analyzer: No instruction or target state for step', props.currentStep)
    return {
      stack: ['#'],
      inputPointer: 0,
      remainingInput: [],
      production: null,
    }
  }

  const state = {
    stack: currentInstruction.targetState.stack || ['#'],
    inputPointer: currentInstruction.targetState.inputPointer || 0,
    remainingInput: currentInstruction.targetState.remainingInput || [],
    production: currentInstruction.productionInfo || null,
  }

  console.log('LL1Analyzer - Computed State:', state)
  return state
})

const totalSteps = computed(() => animationStore.totalSteps)

const currentStack = computed(() => {
  const state = currentAnimationState.value
  return state ? state.stack : ['#']
})

const currentInput = computed(() => {
  const state = currentAnimationState.value
  return state ? state.remainingInput : []
})

const pointer = computed(() => {
  const state = currentAnimationState.value
  return state ? state.inputPointer : 0
})

const currentMsg = computed(() => {
  const state = currentAnimationState.value
  const production = state?.production

  if (!production) {
    return { type: 'message', message: '-' }
  }

  return {
    type: production.type || 'message',
    left: production.left || '',
    right: production.right || '',
    message: production.message || '',
    symbol: production.left || '',
  }
})

// 获取当前分析步骤的消息
const analysisMessage = computed(() => {
  const instruction = animationStore.getInstructionAtStep(props.currentStep)
  return instruction?.productionInfo?.message || '-'
})
</script>

<style scoped>
.stack-item {
  width: 3rem;
  height: 1.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e5e7eb;
  font-size: 1rem;
  font-family: ui-monospace, SFMono-Regular, monospace;
  border-radius: 0.375rem;
  transition: all 0.15s ease-in-out;
  background-color: #f9fafb;
}

.stack-item:hover {
  border-color: #9ca3af;
}

.input-symbol {
  width: 1.8rem;
  height: 1.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-family: ui-monospace, SFMono-Regular, monospace;
  transition: all 0.3s ease-in-out;
  background-color: #f9fafb;
}

.input-symbol:hover {
  border-color: #9ca3af;
}

/* Vue 过渡动画 */
.stack-enter-active {
  transition: all 0.4s ease;
}
.stack-leave-active {
  transition: all 0.3s ease;
}
.stack-enter-from {
  opacity: 0;
  transform: translateY(-15px) scale(0.9);
}
.stack-leave-to {
  opacity: 0;
  transform: translateY(15px) scale(0.9);
}
.stack-move {
  transition: transform 0.3s ease;
}

/* 响应式调整 */
@media (max-width: 1024px) {
  .stack-item {
    width: 2.5rem;
    height: 1.6rem;
    font-size: 0.9rem;
  }

  .input-symbol {
    width: 1.6rem;
    height: 1.6rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 768px) {
  .stack-item {
    width: 2.2rem;
    height: 1.5rem;
    font-size: 0.85rem;
  }

  .input-symbol {
    width: 1.5rem;
    height: 1.5rem;
    font-size: 0.85rem;
  }
}
</style>
