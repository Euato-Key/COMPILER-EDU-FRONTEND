<script setup lang="ts">
import { Icon } from '@iconify/vue'

defineProps<{
  animationSpeed: number
  theme: 'blue' | 'green'
}>()

const emit = defineEmits<{
  (e: 'increase'): void
  (e: 'decrease'): void
  (e: 'reset'): void
}>()
</script>

<template>
  <div 
    :class="[
      'flex items-center justify-between mb-3 p-3 rounded-lg border shadow-sm',
      theme === 'blue' ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200' : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
    ]"
  >
    <div class="flex items-center gap-2">
      <div 
        :class="[
          'w-6 h-6 rounded-lg flex items-center justify-center',
          theme === 'blue' ? 'bg-gradient-to-br from-blue-500 to-indigo-600' : 'bg-gradient-to-br from-green-500 to-emerald-600'
        ]"
      >
        <Icon icon="lucide:zap" class="w-3 h-3 text-white" />
      </div>
      <span :class="['text-sm font-semibold', theme === 'blue' ? 'text-blue-900' : 'text-green-900']">动画速度</span>
    </div>
    <div class="flex items-center gap-2">
      <button
        @click="emit('decrease')"
        :disabled="animationSpeed <= 0.25"
        :class="[
          'w-6 h-6 rounded-md border bg-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 shadow-sm',
          theme === 'blue' ? 'border-blue-300 hover:bg-blue-50 hover:border-blue-400' : 'border-green-300 hover:bg-green-50 hover:border-green-400'
        ]"
      >
        <Icon icon="lucide:minus" :class="['w-3 h-3', theme === 'blue' ? 'text-blue-600' : 'text-green-600']" />
      </button>
      <div :class="['bg-white px-2 py-1 rounded-md border shadow-sm', theme === 'blue' ? 'border-blue-300' : 'border-green-300']">
        <span :class="['text-sm font-bold min-w-[2rem] text-center', theme === 'blue' ? 'text-blue-900' : 'text-green-900']">
          {{ (animationSpeed * 100).toFixed(0) }}%
        </span>
      </div>
      <button
        @click="emit('increase')"
        :disabled="animationSpeed >= 2.0"
        :class="[
          'w-6 h-6 rounded-md border bg-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 shadow-sm',
          theme === 'blue' ? 'border-blue-300 hover:bg-blue-50 hover:border-blue-400' : 'border-green-300 hover:bg-green-50 hover:border-green-400'
        ]"
      >
        <Icon icon="lucide:plus" :class="['w-3 h-3', theme === 'blue' ? 'text-blue-600' : 'text-green-600']" />
      </button>
      <button
        @click="emit('reset')"
        :class="[
          'px-2 py-1 text-sm text-white rounded-md transition-all duration-200 font-medium shadow-sm',
          theme === 'blue' ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700' : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
        ]"
      >
        重置
      </button>
    </div>
  </div>
</template>
