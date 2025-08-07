<template>
  <div class="h-full flex flex-col">
    <!-- 主要内容区域 -->
    <div class="flex-1 flex flex-col lg:flex-row gap-3 p-3 min-h-0">
      <!-- 动作信息区 -->
      <AnimatedProduction
        title="动作信息"
        type="lr"
        :production="currentMsg"
        :is-active="isPlaying"
        @animation-complete="onProductionAnimationComplete"
      />

      <!-- 状态栈 -->
      <AnimatedStack
        title="状态栈"
        :stack="currentStateStack"
        :highlight-top="true"
        highlight-color="#dbeafe"
        animation-speed="normal"
        :enable-physics="true"
        size="md"
        theme="primary"
        @animation-complete="onStateStackAnimationComplete"
        @stack-change="onStateStackChange"
      />

      <!-- 符号栈 -->
      <AnimatedStack
        title="符号栈"
        :stack="currentSymbolStack"
        :highlight-top="true"
        highlight-color="#dcfce7"
        animation-speed="normal"
        :enable-physics="true"
        size="md"
        theme="success"
        @animation-complete="onSymbolStackAnimationComplete"
        @stack-change="onSymbolStackChange"
      />

      <!-- 输入串区域 -->
      <AnimatedInput
        title="输入串"
        :input="fullInputString"
        :consumed-count="consumedCount"
        :show-pointer="shouldShowPointer"
        :is-matching="isCurrentlyMatching"
        :has-error="false"
        :pointer-style="currentPointerStyle"
        @animation-complete="onInputAnimationComplete"
      />
    </div>

    <!-- 状态信息栏 -->
    <div class="flex-shrink-0 bg-white border-t border-gray-200 px-4 py-2">
      <div class="flex justify-between items-center text-sm text-gray-600">
        <div class="truncate max-w-[60%]">
          <span class="font-medium">当前动作:</span>
          {{ analysisMessage }}
        </div>
        <div class="font-medium">步骤: {{ currentStep + 1 }}/{{ totalSteps }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue'
import { AnimationStoreFactory } from '@/animation/store/animationStoreFactory'
import AnimatedStack from './AnimatedStack.vue'
import AnimatedInput from './AnimatedInput.vue'
import AnimatedProduction from './AnimatedProduction.vue'

const props = defineProps<{
  algorithm: 'LR0' | 'SLR1'
  currentStep: number
  isPlaying: boolean
}>()

interface StackDiff {
  toRemove: string[]
  toAdd: string[]
  unchanged: string[]
}

// 获取对应的动画Store
const animationStore = AnimationStoreFactory.getStore(props.algorithm)

const onStateStackAnimationComplete = () => {
  console.log('State stack animation completed')
}

const onStateStackChange = (event: { oldStack: string[], newStack: string[], diff: StackDiff }) => {
  console.log('State stack changed:', event)
  // 可以在这里添加额外的状态栈变化处理逻辑
}

const onSymbolStackAnimationComplete = () => {
  console.log('Symbol stack animation completed')
}

const onSymbolStackChange = (event: { oldStack: string[], newStack: string[], diff: StackDiff }) => {
  console.log('Symbol stack changed:', event)
  // 可以在这里添加额外的符号栈变化处理逻辑
}

const onInputAnimationComplete = () => {
  console.log('Input animation completed')
}

const onProductionAnimationComplete = () => {
  console.log('Production animation completed')
}

// 基于动画指令计算当前状态
const currentAnimationState = computed(() => {
  if (!animationStore.hasAnimationData) return null

  // 如果是第0步，显示初始状态
  if (props.currentStep === 0) {
    // 获取初始状态数据
    const firstInstruction = animationStore.getInstructionAtStep(0)
    const initialInput = firstInstruction?.targetState?.remainingInput || []

    // 获取初始符号栈和状态栈
    const initialSymbolStack = ['#'] // LR符号栈初始状态
    const initialStateStack = ['0'] // LR状态栈初始状态

    return {
      stateStack: initialStateStack,
      symbolStack: initialSymbolStack,
      inputPointer: 0,
      remainingInput: initialInput,
      production: null,
    }
  }

  // 获取当前步骤的指令
  const currentInstruction = animationStore.getInstructionAtStep(props.currentStep)
  if (!currentInstruction || !currentInstruction.targetState) {
    return {
      stateStack: ['0'],
      symbolStack: ['#'],
      inputPointer: 0,
      remainingInput: [],
      production: null,
    }
  }

  // 从动画指令中获取状态信息
  const targetState = currentInstruction.targetState
  return {
    stateStack: targetState.stateStack || targetState.stack || ['0'],
    symbolStack: targetState.symbolStack || ['#'],
    inputPointer: targetState.inputPointer || 0,
    remainingInput: targetState.remainingInput || [],
    production: currentInstruction.productionInfo || null,
  }
})

const totalSteps = computed(() => animationStore.totalSteps)

const currentStateStack = computed(() => {
  const state = currentAnimationState.value
  return state ? state.stateStack : ['0']
})

const currentSymbolStack = computed(() => {
  const state = currentAnimationState.value
  if (state && state.symbolStack) {
    return state.symbolStack
  }
  // 如果没有符号栈信息，返回默认值
  return state ? ['#'] : ['#']
})

// 新的输入串数据计算
const fullInputString = computed(() => {
  // 获取完整输入串（从初始状态）
  const firstInstruction = animationStore.getInstructionAtStep(0)
  return firstInstruction?.targetState?.remainingInput || []
})

const consumedCount = computed(() => {
  const state = currentAnimationState.value
  if (!state) return 0

  // 计算已消费字符数量
  const fullInput = fullInputString.value
  const totalLength = fullInput.length
  const remainingLength = state.remainingInput.length
  return totalLength - remainingLength
})

// 指针样式
const currentPointerStyle = computed((): 'normal' | 'matching' | 'error' => {
  const instruction = animationStore.getInstructionAtStep(props.currentStep)
  if (instruction?.action === 'matchSymbol') {
    return 'matching'
  }
  return 'normal'
})

// 是否应该显示指针（默认始终显示）
const shouldShowPointer = computed(() => {
  // 始终显示指针，这样用户可以清楚看到当前分析位置
  return true
})

// 是否正在匹配（matchSymbol动作时为true）
const isCurrentlyMatching = computed(() => {
  const instruction = animationStore.getInstructionAtStep(props.currentStep)
  return instruction?.action === 'matchSymbol'
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
    currentState: '',
    newState: '',
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
