<template>
  <div class="step-placeholder">
    <div class="step-header">
      <div class="flex items-center gap-4">
        <div class="step-icon">
          <Icon :icon="icon" class="w-6 h-6" :class="iconColor" />
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-900">{{ title }}</h2>
          <p class="text-gray-600 mt-1">{{ description }}</p>
        </div>
      </div>
    </div>

    <div class="step-content">
      <div class="text-center py-20">
        <Icon icon="lucide:construction" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-gray-600 mb-2">组件开发中</h3>
        <p class="text-gray-500">{{ placeholder || `${title}组件正在开发中...` }}</p>

        <!-- 显示旧前端参考信息 -->
        <div class="mt-8 max-w-md mx-auto text-left">
          <div class="bg-blue-50 rounded-lg p-4">
            <h4 class="font-medium text-blue-900 mb-2">预期功能</h4>
            <ul class="text-sm text-blue-700 space-y-1">
              <li v-for="feature in features" :key="feature">• {{ feature }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="step-actions">
      <div class="flex justify-between items-center">
        <button
          @click="$emit('prev-step')"
          :disabled="!canGoBack"
          :class="[
            'px-6 py-2 rounded-lg transition-colors',
            canGoBack
              ? 'border border-gray-300 text-gray-700 hover:bg-gray-50'
              : 'border border-gray-300 text-gray-400 cursor-not-allowed'
          ]"
        >
          <Icon icon="lucide:chevron-left" class="w-4 h-4 inline mr-2" />
          上一步
        </button>
        <div class="text-sm text-gray-500">步骤 {{ currentStep }} / {{ totalSteps }}</div>
        <button
          @click="$emit('next-step')"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          下一步
          <Icon icon="lucide:chevron-right" class="w-4 h-4 inline ml-2" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface Props {
  title: string
  description: string
  placeholder?: string
  icon: string
  iconColor?: string
  currentStep: number
  totalSteps: number
  canGoBack?: boolean
  features?: string[]
}

withDefaults(defineProps<Props>(), {
  iconColor: 'text-blue-600',
  canGoBack: true,
  features: () => []
})

defineEmits<{
  'next-step': []
  'prev-step': []
}>()
</script>

<style scoped>
.step-header {
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 1.5rem;
  margin-bottom: 2rem;
}

.step-content {
  margin-bottom: 2rem;
}

.step-actions {
  border-top: 1px solid #e5e7eb;
  padding-top: 1.5rem;
}

.step-icon {
  width: 3rem;
  height: 3rem;
  background-color: #dbeafe;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
