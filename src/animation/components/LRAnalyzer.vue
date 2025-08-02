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
        @animation-complete="onStateStackAnimationComplete"
      />

      <!-- 符号栈 -->
      <AnimatedStack
        title="符号栈"
        :stack="currentSymbolStack"
        :highlight-top="true"
        highlight-color="#dcfce7"
        @animation-complete="onSymbolStackAnimationComplete"
      />

      <!-- 输入串区域 -->
      <AnimatedInput
        title="输入串"
        :input="currentInput"
        :pointer="pointer"
        :is-matching="currentMsg.type === 'shift'"
        :has-error="false"
        @animation-complete="onInputAnimationComplete"
      />
    </div>

    <!-- 状态信息栏 -->
    <div class="flex-shrink-0 bg-white border-t border-gray-200 px-4 py-2">
      <div class="flex justify-between items-center text-sm text-gray-600">
        <div class="truncate max-w-[60%]">
          <span class="font-medium">当前动作:</span>
          {{ analysisData.info_msg?.[currentStep] || '-' }}
        </div>
        <div class="font-medium">步骤: {{ currentStep + 1 }}/{{ totalSteps }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue'
import { parseLRMessage } from '@/animation/utils/messageParser'
import AnimatedStack from './AnimatedStack.vue'
import AnimatedInput from './AnimatedInput.vue'
import AnimatedProduction from './AnimatedProduction.vue'

const props = defineProps<{
  algorithm: string
  analysisData: any
  currentStep: number
  isPlaying: boolean
}>()

const onStateStackAnimationComplete = () => {
  // 状态栈动画完成回调
  console.log('State stack animation completed')
}

const onSymbolStackAnimationComplete = () => {
  // 符号栈动画完成回调
  console.log('Symbol stack animation completed')
}

const onInputAnimationComplete = () => {
  // 输入串动画完成回调
  console.log('Input animation completed')
}

const onProductionAnimationComplete = () => {
  // 产生式动画完成回调
  console.log('Production animation completed')
}

const totalSteps = computed(() => props.analysisData?.info_step?.length || 0)
const currentMsg = computed(() =>
  parseLRMessage(props.analysisData?.info_msg?.[props.currentStep] || ''),
)
const currentStateStack = computed(() => {
  const stack = props.analysisData?.info_state_stack?.[props.currentStep]
  return stack ? stack.split('').reverse() : []
})
const currentSymbolStack = computed(() => {
  const stack = props.analysisData?.info_symbol_stack?.[props.currentStep]
  return stack ? stack.split('').reverse() : []
})
const currentInput = computed(() => {
  const str = props.analysisData?.info_str?.[props.currentStep]
  return str ? str.split('') : []
})
const pointer = computed(() => {
  const all = props.analysisData?.info_str?.[0]?.length || 0
  const now = props.analysisData?.info_str?.[props.currentStep]?.length || 0
  return all - now
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
