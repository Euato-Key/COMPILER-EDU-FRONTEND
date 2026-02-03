<script setup lang="ts">
import { Icon } from '@iconify/vue'
import AnimationSpeedControl from './AnimationSpeedControl.vue'

const props = defineProps<{
  vn: string[]
  userFirstSets: Record<string, string>
  firstValidation: Record<string, string>
  loading: boolean
  showFirstAnswer: boolean
  correctFirstSets: Record<string, string[]>
  animationSpeed: number
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
  const validation = props.firstValidation[symbol]
  if (validation === 'correct') {
    return 'border-green-400 bg-green-50 shadow-sm'
  } else if (validation === 'incorrect') {
    return 'border-red-400 bg-red-50 shadow-sm'
  }
  return 'border-gray-300 bg-gradient-to-r from-amber-50 to-orange-50'
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-base font-semibold text-gray-900 flex items-center">
        <Icon icon="lucide:arrow-right" class="w-4 h-4 mr-2 text-blue-600" />
        First集合（非终结符）
      </h3>
      <div class="flex gap-2">
        <button
          @click="emit('clear')"
          class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-md shadow-sm hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-1 focus:ring-red-300 transition-all duration-200"
        >
          <Icon icon="lucide:trash-2" class="w-3 h-3 mr-1" />
          清空
        </button>
        <button
          @click="emit('check')"
          :disabled="loading"
          class="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors text-sm"
        >
          <Icon v-if="loading" icon="lucide:loader-2" class="w-3 h-3 animate-spin mr-1" />
          <Icon v-else icon="lucide:check-circle" class="w-3 h-3 mr-1" />
          校验
        </button>
        <button
          @click="emit('toggle-answer')"
          class="inline-flex items-center px-2 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 hover:text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-300 transition-all duration-200"
        >
          <Icon v-if="showFirstAnswer" icon="lucide:eye-off" class="w-3 h-3 mr-1" />
          <Icon v-else icon="lucide:eye" class="w-3 h-3 mr-1" />
          {{ showFirstAnswer ? '隐藏答案' : '显示答案' }}
        </button>
      </div>
    </div>

    <AnimationSpeedControl
      :animation-speed="animationSpeed"
      theme="blue"
      @increase="emit('increase-speed')"
      @decrease="emit('decrease-speed')"
      @reset="emit('reset-speed')"
    />

    <div class="space-y-2">
      <div class="mb-3">
        <div class="space-y-1.5">
          <div
            v-for="symbol in vn"
            :key="'first-vn-' + symbol"
            class="flex items-center gap-2"
          >
            <span class="w-20 text-sm font-medium text-gray-700 whitespace-nowrap">
              first(<span class="font-mono text-blue-700">{{ symbol }}</span>) =
            </span>
            <div class="flex-1 relative">
              <input
                v-model="userFirstSets[symbol]"
                type="text"
                placeholder="输入First集，用空格分隔"
                :class="[
                  'w-full px-3 py-1.5 text-sm font-mono border rounded-md transition-all duration-300 focus:ring-2 focus:ring-blue-200 focus:outline-none outline-none',
                  getInputClass(symbol)
                ]"
                @focus="emit('focus', symbol)"
                @dragover.prevent
                @drop="emit('drop', $event, symbol)"
                :data-input="symbol"
              />
              <div class="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                <Icon
                  v-if="firstValidation[symbol] === 'correct'"
                  icon="lucide:check"
                  class="w-4 h-4 text-green-500"
                />
                <Icon
                  v-else-if="firstValidation[symbol] === 'incorrect'"
                  icon="lucide:x"
                  class="w-4 h-4 text-red-500"
                />
                <button
                  @click="emit('hint', symbol)"
                  class="flex items-center px-1.5 py-0.5 text-[10px] bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors border border-blue-200"
                >
                  <Icon icon="lucide:lightbulb" class="w-3 h-3 mr-1" />
                  提示
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 答案展示 -->
      <transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <div v-if="showFirstAnswer" class="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 class="text-sm font-bold text-blue-800 mb-2 flex items-center">
            <Icon icon="lucide:info" class="w-4 h-4 mr-1" />
            First集标准答案：
          </h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div
              v-for="symbol in vn"
              :key="'ans-first-' + symbol"
              class="flex items-center text-xs font-mono"
            >
              <span class="text-blue-700 font-bold w-16">First({{ symbol }}) =</span>
              <span class="text-gray-700 font-semibold">{ {{ correctFirstSets[symbol]?.join(', ') || '' }} }</span>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
