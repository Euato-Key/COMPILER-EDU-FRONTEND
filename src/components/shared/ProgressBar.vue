<template>
  <div class="progress-bar-container">
    <!-- 进度条标题和百分比 -->
    <div v-if="showLabel" class="flex items-center justify-between mb-2">
      <span class="text-sm font-medium text-gray-700">{{ label }}</span>
      <span class="text-sm text-gray-600">{{ percentage }}%</span>
    </div>

    <!-- 进度条 -->
    <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden shadow-inner">
      <div
        class="h-2 rounded-full transition-all duration-500 relative shadow-lg"
        :class="progressBarClass"
        :style="{ width: percentage + '%' }"
      >
        <!-- 渐变效果 -->
        <div class="absolute inset-0 rounded-full" :class="gradientClass"></div>
        <!-- 光泽效果 -->
        <div class="absolute top-0 left-0 right-0 h-1/2 rounded-full opacity-40 bg-white"></div>
        <!-- 脉冲动画效果 -->
        <div
          v-if="percentage > 0 && percentage < 100"
          class="absolute top-0 right-0 w-1 h-full bg-white opacity-60 animate-pulse"
        ></div>
        <!-- 彩虹流动动画 -->
        <div
          v-if="props.theme === 'rainbow' && percentage > 0"
          class="absolute inset-0 rounded-full animate-pulse"
          style="background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);"
        ></div>
      </div>
    </div>

    <!-- 完成提示 -->
    <div v-if="showCompletionMessage && percentage === 100" class="mt-2 flex items-center gap-2 text-green-600">
      <Icon :icon="completionIcon" class="w-4 h-4" />
      <span class="text-sm font-medium">{{ completionMessage }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

interface Props {
  percentage: number // 进度百分比 (0-100)
  label?: string // 进度条标签
  showLabel?: boolean // 是否显示标签和百分比
  theme?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'rainbow' // 颜色主题
  showCompletionMessage?: boolean // 是否显示完成提示
  completionMessage?: string // 完成提示文字
  completionIcon?: string // 完成提示图标
}

const props = withDefaults(defineProps<Props>(), {
  label: '完成进度',
  showLabel: true,
  theme: 'blue',
  showCompletionMessage: false,
  completionMessage: '完成！',
  completionIcon: 'lucide:check-circle'
})

// 计算进度条样式类
const progressBarClass = computed(() => {
  const baseClass = 'h-2 rounded-full transition-all duration-300'

  if (props.percentage === 100) {
    return `${baseClass} bg-green-500`
  }

  const themeColors = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
    rainbow: 'bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500'
  }

  return `${baseClass} ${themeColors[props.theme]}`
})

// 计算渐变样式类
const gradientClass = computed(() => {
  if (props.percentage === 100) {
    return 'bg-gradient-to-r from-green-400 via-green-500 to-green-600'
  }

  const gradientThemes = {
    blue: 'bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600',
    green: 'bg-gradient-to-r from-green-400 via-green-500 to-green-600',
    purple: 'bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600',
    orange: 'bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600',
    red: 'bg-gradient-to-r from-red-400 via-red-500 to-red-600',
    rainbow: 'bg-gradient-to-r from-red-400 via-yellow-400 via-blue-400 to-purple-400'
  }

  return gradientThemes[props.theme]
})
</script>

<style scoped>
.progress-bar-container {
  /* 可以添加自定义样式 */
}
</style>
