<script setup lang="ts">
import { Icon } from '@iconify/vue'
import AnimationSpeedControl from './AnimationSpeedControl.vue'

const props = defineProps<{
  vn: string[]
  userFollowSets: Record<string, string>
  followValidation: Record<string, string>
  loading: boolean
  showFollowAnswer: boolean
  correctFollowSets: Record<string, string[]>
  animationSpeed: number
  firstStepCompleted: boolean
  hintActive: boolean
}>()

const emit = defineEmits<{
  (e: 'check'): void
  (e: 'clear'): void
  (e: 'toggle-answer'): void
  (e: 'increase-speed'): void
  (e: 'decrease-speed'): void
  (e: 'reset-speed'): void
  (e: 'drop', event: DragEvent, symbol: string): void
  (e: 'focus', symbol: string): void
  (e: 'hint', symbol: string): void
}>()

const getInputClass = (symbol: string): string => {
  const validation = props.followValidation[symbol]
  if (validation === 'correct') {
    return 'border-green-400 bg-green-50 shadow-sm'
  } else if (validation === 'incorrect') {
    return 'border-red-400 bg-red-50 shadow-sm'
  }
  return 'border-gray-300 bg-gradient-to-r from-green-50 to-emerald-50'
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-base font-semibold text-gray-900 flex items-center">
        <Icon icon="lucide:arrow-right" class="w-4 h-4 mr-2 text-green-600" />
        Follow集合（非终结符）
      </h3>
      <div class="flex gap-2">
        <button
          @click="emit('clear')"
          class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-md shadow-sm hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-1 focus:ring-red-300 transition-all duration-200"
        >
          <Icon icon="lucide:refresh-cw" class="w-3 h-3 mr-1" />
          清空重填
        </button>
        <button
          @click="emit('check')"
          :disabled="loading || !firstStepCompleted"
          class="inline-flex items-center px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 transition-colors text-sm"
        >
          <Icon v-if="loading" icon="lucide:loader-2" class="w-3 h-3 animate-spin mr-1" />
          <Icon v-else icon="lucide:check-circle" class="w-3 h-3 mr-1" />
          校验
        </button>
        <button
          @click="emit('toggle-answer')"
          :disabled="!firstStepCompleted"
          class="inline-flex items-center px-2 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 hover:text-gray-800 focus:outline-none focus:ring-1 focus:ring-green-300 transition-all duration-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          <Icon v-if="showFollowAnswer" icon="lucide:eye-off" class="w-3 h-3 mr-1" />
          <Icon v-else icon="lucide:eye" class="w-3 h-3 mr-1" />
          {{ showFollowAnswer ? '隐藏答案' : '显示答案' }}
        </button>
      </div>
    </div>

    <!-- 动画速度控制 -->
    <AnimationSpeedControl
      :animation-speed="animationSpeed"
      theme="green"
      @increase="emit('increase-speed')"
      @decrease="emit('decrease-speed')"
      @reset="emit('reset-speed')"
    />

    <div class="space-y-1.5">
      <div
        v-for="symbol in vn"
        :key="'follow-' + symbol"
        class="flex items-center gap-2"
      >
        <span class="w-20 text-sm font-medium text-gray-700 whitespace-nowrap">
          follow(<span class="font-mono text-green-700">{{ symbol }}</span>) =
        </span>
        <div class="flex-1 relative">
          <input
            v-model="userFollowSets[symbol]"
            type="text"
            placeholder="输入Follow集，用空格分隔"
            :disabled="!firstStepCompleted"
            :class="[
              'w-full px-3 py-2 text-sm border-2 rounded-lg focus:ring-2 focus:ring-green-200 focus:border-green-400 transition-all duration-200 font-mono bg-gradient-to-r from-gray-50 to-white text-gray-800',
              getInputClass(symbol),
              !firstStepCompleted && 'bg-gray-100 cursor-not-allowed'
            ]"
            :data-input="`follow-${symbol}`"
            @focus="emit('focus', symbol)"
            @dragover.prevent
            @drop="emit('drop', $event, symbol)"
          />
          <div class="absolute right-2 top-1/2 transform -translate-y-1/2">
            <Icon
              v-if="followValidation[symbol] === 'correct'"
              icon="lucide:check"
              class="w-4 h-4 text-green-600"
            />
            <Icon
              v-else-if="followValidation[symbol] === 'incorrect'"
              icon="lucide:x"
              class="w-4 h-4 text-red-600"
            />
          </div>
        </div>
        <button
          @click="emit('hint', symbol)"
          :disabled="hintActive || !firstStepCompleted || followValidation[symbol] === 'correct'"
          class="inline-flex items-center px-2 py-1.5 text-sm font-medium text-orange-600 bg-white border border-orange-200 rounded-md shadow-sm hover:bg-orange-50 hover:text-orange-700 focus:outline-none focus:ring-1 focus:ring-orange-300 transition-all duration-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          <Icon icon="lucide:lightbulb" class="w-3 h-3 mr-1" />
          提示
        </button>
      </div>
    </div>

    <!-- Follow集答案提示 -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div v-if="showFollowAnswer" class="mt-3 p-3 bg-green-50 rounded-lg border border-green-200 shadow-sm">
        <h4 class="text-sm font-bold text-green-900 mb-2 flex items-center">
          <Icon icon="lucide:info" class="w-4 h-4 mr-1" />
          Follow集标准答案：
        </h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
          <div
            v-for="symbol in vn"
            :key="'answer-follow-' + symbol"
            class="flex items-center text-xs font-mono"
          >
            <span class="font-bold text-green-700 w-20">Follow({{ symbol }}) =</span>
            <span class="text-gray-700 font-semibold">{ {{ correctFollowSets[symbol]?.join(', ') || '#' }} }</span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
