<template>
  <div class="flex items-center justify-between mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 shadow-sm">
    <div class="flex items-center gap-2">
      <div class="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
        <Icon icon="lucide:zap" class="w-3 h-3 text-white" />
      </div>
      <span class="text-sm font-semibold text-green-700">动画速度</span>
    </div>
    <div class="flex items-center gap-2">
      <button
        @click="$emit('decrease')"
        :disabled="speed <= 0.25"
        class="w-8 h-8 rounded-lg border-2 border-green-300 bg-white hover:bg-green-50 hover:border-green-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 shadow-sm"
      >
        <Icon icon="lucide:minus" class="w-4 h-4 text-green-600" />
      </button>
      <div class="bg-white px-3 py-1.5 rounded-lg border-2 border-green-300 shadow-sm">
        <span class="text-base font-bold text-green-700 min-w-[2.5rem] text-center">
          {{ (speed * 100).toFixed(0) }}%
        </span>
      </div>
      <button
        @click="$emit('increase')"
        :disabled="speed >= 2.0"
        class="w-8 h-8 rounded-lg border-2 border-green-300 bg-white hover:bg-green-50 hover:border-green-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 shadow-sm"
      >
        <Icon icon="lucide:plus" class="w-4 h-4 text-green-600" />
      </button>
      <button
        @click="$emit('reset')"
        class="px-3 py-1.5 text-sm bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-medium shadow-sm"
      >
        重置
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

defineProps<{
  speed: number
}>()

defineEmits<{
  'increase': []
  'decrease': []
  'reset': []
}>()
</script>
