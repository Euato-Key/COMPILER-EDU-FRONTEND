<template>
  <div>
    <!-- 动画速度控制 -->
    <div class="flex items-center justify-between mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 shadow-sm">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
          <Icon icon="lucide:zap" class="w-4 h-4 text-white" />
        </div>
        <div>
          <span class="text-sm font-semibold text-blue-800">动画速度控制</span>
          <p class="text-xs text-blue-600 mt-0.5">调整提示动画播放速度</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <button
          @click="$emit('decrease-speed')"
          :disabled="speed <= 0.25"
          class="w-10 h-10 rounded-lg border-2 border-blue-300 bg-white hover:bg-blue-50 hover:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 shadow-sm"
        >
          <Icon icon="lucide:minus" class="w-5 h-5 text-blue-600" />
        </button>
        <div class="bg-white px-4 py-2 rounded-lg border-2 border-blue-300 shadow-sm">
          <span class="text-lg font-bold text-blue-800 min-w-[3rem] text-center">
            {{ (speed * 100).toFixed(0) }}%
          </span>
        </div>
        <button
          @click="$emit('increase-speed')"
          :disabled="speed >= 2.0"
          class="w-10 h-10 rounded-lg border-2 border-blue-300 bg-white hover:bg-blue-50 hover:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 shadow-sm"
        >
          <Icon icon="lucide:plus" class="w-5 h-5 text-blue-600" />
        </button>
        <button
          @click="$emit('reset-speed')"
          class="px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-medium shadow-sm"
        >
          重置
        </button>
      </div>
    </div>

    <!-- 提示动画状态显示 -->
    <transition
      enter-active-class="transition-all duration-300"
      leave-active-class="transition-all duration-300"
      enter-from-class="opacity-0 transform translate-y-4"
      leave-to-class="opacity-0 transform translate-y-4"
    >
      <div v-if="hintActive" class="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-lg shadow-lg bg-orange-500 text-white text-sm">
        <div class="flex items-center gap-2">
          <Icon icon="lucide:lightbulb" class="w-4 h-4" />
          <span>提示步骤 {{ currentStep }}/{{ totalSteps }} 进行中...</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

defineProps<{
  speed: number
  hintActive: boolean
  currentStep: number
  totalSteps: number
}>()

defineEmits<{
  'increase-speed': []
  'decrease-speed': []
  'reset-speed': []
}>()
</script>
