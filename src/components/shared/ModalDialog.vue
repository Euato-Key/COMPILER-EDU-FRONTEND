<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible" class="modal-overlay" @click="handleOverlayClick">
        <div class="modal-container" @click.stop>
          <!-- 弹窗头部 -->
          <div class="modal-header" :class="headerClass">
            <div class="modal-icon" :class="`modal-icon-${props.type}`">
              <Icon :icon="iconType" class="w-6 h-6" />
            </div>
            <h3 class="modal-title">{{ title }}</h3>
            <button @click="handleClose" class="modal-close">
              <Icon icon="lucide:x" class="w-5 h-5" />
            </button>
          </div>

          <!-- 弹窗内容 -->
          <div class="modal-content">
            <p class="modal-message">{{ message }}</p>
            <div v-if="details" class="modal-details">
              {{ details }}
            </div>
          </div>

          <!-- 弹窗底部按钮 -->
          <div class="modal-footer">
            <button
              v-if="showCancel"
              @click="handleCancel"
              class="modal-btn modal-btn-cancel"
            >
              {{ cancelText }}
            </button>
            <button
              @click="handleConfirm"
              class="modal-btn modal-btn-confirm"
              :class="confirmButtonClass"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

export interface ModalProps {
  visible: boolean
  type?: 'success' | 'error' | 'warning' | 'info' | 'confirm'
  title?: string
  message: string
  details?: string
  confirmText?: string
  cancelText?: string
  showCancel?: boolean
  closeOnOverlay?: boolean
}

const props = withDefaults(defineProps<ModalProps>(), {
  type: 'info',
  title: '',
  confirmText: '确定',
  cancelText: '取消',
  showCancel: false,
  closeOnOverlay: true
})

const emit = defineEmits<{
  confirm: []
  cancel: []
  close: []
}>()

// 根据类型计算样式类
const headerClass = computed(() => {
  const baseClass = 'flex items-center gap-3'
  const typeClass = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200',
    confirm: 'bg-purple-50 border-purple-200'
  }
  return `${baseClass} ${typeClass[props.type]}`
})

const confirmButtonClass = computed(() => {
  const typeClass = {
    success: 'bg-green-600 hover:bg-green-700',
    error: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-yellow-600 hover:bg-yellow-700',
    info: 'bg-blue-600 hover:bg-blue-700',
    confirm: 'bg-purple-600 hover:bg-purple-700'
  }
  return typeClass[props.type]
})

const iconType = computed(() => {
  const iconMap = {
    success: 'lucide:check-circle',
    error: 'lucide:x-circle',
    warning: 'lucide:alert-triangle',
    info: 'lucide:info',
    confirm: 'lucide:help-circle'
  }
  return iconMap[props.type]
})

// 事件处理
const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
}

const handleClose = () => {
  emit('close')
}

const handleOverlayClick = () => {
  if (props.closeOnOverlay) {
    emit('close')
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  animation: modalSlideIn 0.3s ease-out;
}

.modal-header {
  padding: 1.5rem 1.5rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.modal-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.modal-icon-success {
  background-color: #dcfce7;
  color: #16a34a;
}

.modal-icon-error {
  background-color: #fee2e2;
  color: #dc2626;
}

.modal-icon-warning {
  background-color: #fef3c7;
  color: #d97706;
}

.modal-icon-info {
  background-color: #dbeafe;
  color: #2563eb;
}

.modal-icon-confirm {
  background-color: #f3e8ff;
  color: #9333ea;
}

.modal-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  flex: 1;
}

.modal-close {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.modal-close:hover {
  background-color: #f3f4f6;
  color: #374151;
}

.modal-content {
  padding: 1.5rem;
}

.modal-message {
  font-size: 1rem;
  color: #374151;
  line-height: 1.5;
  margin: 0 0 0.5rem 0;
}

.modal-details {
  font-size: 0.875rem;
  color: #6b7280;
  background-color: #f9fafb;
  padding: 0.75rem;
  border-radius: 6px;
  margin-top: 0.75rem;
}

.modal-footer {
  padding: 1rem 1.5rem 1.5rem;
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

.modal-btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 4rem;
}

.modal-btn-cancel {
  background-color: #f3f4f6;
  color: #374151;
}

.modal-btn-cancel:hover {
  background-color: #e5e7eb;
}

.modal-btn-confirm {
  color: white;
}

/* 动画 */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
