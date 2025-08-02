<template>
  <Teleport to="body">
    <Transition name="hint-modal">
      <div v-if="visible" class="hint-modal-overlay">
        <div class="hint-modal-container" :class="containerClass">
          <!-- 弹窗头部 -->
          <div class="hint-modal-header" :class="headerClass">
            <div class="hint-modal-icon" :class="`hint-modal-icon-${type}`">
              <Icon :icon="iconType" class="w-5 h-5" />
            </div>
            <h3 class="hint-modal-title">{{ title }}</h3>
            <div class="hint-modal-timer">
              <div class="hint-modal-timer-bar" :style="{ width: `${timerProgress}%` }"></div>
            </div>
          </div>

          <!-- 弹窗内容 -->
          <div class="hint-modal-content">
            <p class="hint-modal-message">{{ message }}</p>
            <div v-if="details" class="hint-modal-details">
              {{ details }}
            </div>
            <div v-if="action" class="hint-modal-action">
              <Icon :icon="actionIcon" class="w-4 h-4 mr-2" />
              <span>{{ action }}</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { Icon } from '@iconify/vue'

export interface AnimationHintModalProps {
  visible: boolean
  type?: 'success' | 'error' | 'warning' | 'info' | 'hint'
  title?: string
  message: string
  details?: string
  action?: string
  duration?: number
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center'
}

const props = withDefaults(defineProps<AnimationHintModalProps>(), {
  type: 'hint',
  title: '',
  duration: 3000,
  position: 'top-right'
})

const emit = defineEmits<{
  close: []
}>()

// 计时器状态
const timerProgress = ref(100)
let timerInterval: number | null = null

// 根据类型计算样式类
const containerClass = computed(() => {
  const positionClass = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'center': 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
  }
  return positionClass[props.position]
})

const headerClass = computed(() => {
  const baseClass = 'flex items-center gap-3'
  const typeClass = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200',
    hint: 'bg-purple-50 border-purple-200'
  }
  return `${baseClass} ${typeClass[props.type]}`
})

const iconType = computed(() => {
  const iconMap = {
    success: 'lucide:check-circle',
    error: 'lucide:x-circle',
    warning: 'lucide:alert-triangle',
    info: 'lucide:info',
    hint: 'lucide:lightbulb'
  }
  return iconMap[props.type]
})

const actionIcon = computed(() => {
  if (props.action?.includes('双击')) return 'lucide:mouse-pointer-2'
  if (props.action?.includes('匹配')) return 'lucide:check'
  if (props.action?.includes('推导')) return 'lucide:arrow-right'
  return 'lucide:play'
})

// 启动计时器
const startTimer = () => {
  timerProgress.value = 100
  const step = 100 / (props.duration / 50) // 每50ms更新一次

  timerInterval = window.setInterval(() => {
    timerProgress.value -= step
    if (timerProgress.value <= 0) {
      closeModal()
    }
  }, 50)
}

// 关闭弹窗
const closeModal = () => {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
  emit('close')
}

// 监听visible变化
import { watch } from 'vue'

watch(() => props.visible, (newValue) => {
  if (newValue) {
    startTimer()
  } else {
    if (timerInterval) {
      clearInterval(timerInterval)
      timerInterval = null
    }
  }
}, { immediate: true })

onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval)
  }
})
</script>

<style scoped>
.hint-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1000;
}

.hint-modal-container {
  position: absolute;
  max-width: 400px;
  width: 100%;
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid #e5e7eb;
  overflow: hidden;
  pointer-events: auto;
}

.hint-modal-header {
  padding: 1rem 1.25rem 0.75rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
}

.hint-modal-icon {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.hint-modal-icon-success {
  background-color: #dcfce7;
  color: #16a34a;
}

.hint-modal-icon-error {
  background-color: #fee2e2;
  color: #dc2626;
}

.hint-modal-icon-warning {
  background-color: #fef3c7;
  color: #d97706;
}

.hint-modal-icon-info {
  background-color: #dbeafe;
  color: #2563eb;
}

.hint-modal-icon-hint {
  background-color: #f3e8ff;
  color: #9333ea;
}

.hint-modal-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  flex: 1;
}

.hint-modal-timer {
  width: 40px;
  height: 4px;
  background-color: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
  position: relative;
}

.hint-modal-timer-bar {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 2px;
  transition: width 0.05s linear;
}

.hint-modal-content {
  padding: 1rem 1.25rem 1.25rem;
}

.hint-modal-message {
  font-size: 0.875rem;
  color: #374151;
  line-height: 1.5;
  margin: 0 0 0.5rem 0;
}

.hint-modal-details {
  font-size: 0.75rem;
  color: #6b7280;
  background-color: #f9fafb;
  padding: 0.5rem;
  border-radius: 6px;
  margin-top: 0.5rem;
  line-height: 1.4;
}

.hint-modal-action {
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  color: #7c3aed;
  background-color: #f3e8ff;
  padding: 0.5rem;
  border-radius: 6px;
  margin-top: 0.5rem;
  font-weight: 500;
}

/* 动画效果 */
.hint-modal-enter-active,
.hint-modal-leave-active {
  transition: all 0.3s ease;
}

.hint-modal-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

.hint-modal-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

/* 位置特定动画 */
.hint-modal-container.top-right {
  animation: slideInRight 0.3s ease-out;
}

.hint-modal-container.top-left {
  animation: slideInLeft 0.3s ease-out;
}

.hint-modal-container.bottom-right {
  animation: slideInRight 0.3s ease-out;
}

.hint-modal-container.bottom-left {
  animation: slideInLeft 0.3s ease-out;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
