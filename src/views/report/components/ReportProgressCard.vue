<template>
  <div class="report-progress-card bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
        <Icon :icon="icon" class="w-5 h-5" :class="iconColor" />
        {{ title }}
      </h3>
      <div v-if="stats.overall.completed" class="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
        <Icon icon="lucide:check-circle" class="w-4 h-4" />
        已完成
      </div>
    </div>

    <div class="space-y-4">
      <div v-for="(item, key) in items" :key="key" class="space-y-2">
        <div class="flex items-center justify-between text-sm">
          <span class="text-gray-600 font-medium">{{ item.label }}</span>
          <span class="text-gray-900 font-semibold">{{ item.progress }}%</span>
        </div>
        <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            class="h-full rounded-full transition-all duration-500 ease-out"
            :class="getProgressBarClass(item.progress)"
            :style="{ width: item.progress + '%' }"
          />
        </div>
        <div v-if="item.completed" class="flex items-center gap-1 text-xs text-green-600">
          <Icon icon="lucide:check" class="w-3 h-3" />
          已完成
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed } from 'vue'

interface ProgressItem {
  label: string
  progress: number
  completed: boolean
}

interface Props {
  title: string
  icon: string
  iconColor: string
  items: Record<string, ProgressItem>
  stats: {
    overall: {
      completed: boolean
      progress: number
    }
  }
}

const props = defineProps<Props>()

function getProgressBarClass(progress: number) {
  if (progress === 100) return 'bg-green-500'
  if (progress >= 60) return 'bg-blue-500'
  if (progress >= 30) return 'bg-yellow-500'
  return 'bg-gray-300'
}
</script>

<style scoped>
/* 打印时保留背景颜色 - 使用全局样式 */
@import '../styles/print-colors.css';
</style>
