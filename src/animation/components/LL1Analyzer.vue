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
          {{ analysisData.info_msg?.[currentStep] || '-' }}
        </div>
        <div class="font-medium">步骤: {{ currentStep + 1 }}/{{ totalSteps }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue'
import { parseLL1Message } from '@/animation/utils/messageParser'
import AnimatedStack from './AnimatedStack.vue'
import AnimatedInput from './AnimatedInput.vue'
import AnimatedProduction from './AnimatedProduction.vue'

const props = defineProps<{
  analysisData: any
  currentStep: number
  isPlaying: boolean
}>()

const onStackAnimationComplete = () => {
  // 栈动画完成回调
  console.log('Stack animation completed')
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
  parseLL1Message(props.analysisData?.info_msg?.[props.currentStep] || ''),
)
const currentStack = computed(() => {
  const stack = props.analysisData?.info_stack?.[props.currentStep]
  if (!stack) return []

  // 处理不同的栈数据格式
  if (typeof stack === 'string') {
    // 如果是字符串格式，例如："#S" -> ['#', 'S']
    const stackArray = stack.split('').filter((c: string) => c !== '')
    return stackArray.reverse() // 栈顶在前面显示
  } else if (Array.isArray(stack)) {
    // 如果是数组格式
    if (stack.length > 0 && typeof stack[0] === 'object') {
      // LL1InfoSymbol[] 格式
      return stack.map((item: any) => item.text || item.symbol || item).reverse()
    } else {
      // string[] 格式
      return [...stack].reverse()
    }
  }

  return []
})

const currentInput = computed(() => {
  const str = props.analysisData?.info_str?.[props.currentStep]
  if (!str) return []

  // 处理不同的输入串数据格式
  if (typeof str === 'string') {
    return str.split('')
  } else if (typeof str === 'object' && str.text) {
    // LL1InfoStr 格式
    return str.text.split('')
  }

  return []
})

const pointer = computed(() => {
  // 指针为输入串长度 - 当前输入串长度
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
