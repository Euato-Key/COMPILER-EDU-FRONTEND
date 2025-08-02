<template>
  <div
    class="flex items-center justify-between px-3 py-2 bg-white shadow-sm border-b border-gray-200"
  >
    <div class="flex items-center gap-1">
      <button @click="$emit('play')" :disabled="isPlaying" class="btn btn-primary" title="播放动画">
        <Icon icon="material-symbols:play-arrow" class="w-4 h-4" />
      </button>
      <button
        @click="$emit('pause')"
        :disabled="!isPlaying"
        class="btn btn-secondary"
        title="暂停动画"
      >
        <Icon icon="material-symbols:pause" class="w-4 h-4" />
      </button>
      <button @click="$emit('reset')" class="btn" title="重置到开始">
        <Icon icon="material-symbols:refresh" class="w-4 h-4" />
      </button>
      <button @click="$emit('step-back')" :disabled="currentStep <= 0" class="btn" title="上一步">
        <Icon icon="material-symbols:skip-previous" class="w-4 h-4" />
      </button>
      <button @click="$emit('step')" class="btn" title="下一步">
        <Icon icon="material-symbols:skip-next" class="w-4 h-4" />
      </button>
    </div>
    <div class="flex items-center gap-3 text-sm">
      <div class="flex items-center gap-1">
        <Icon icon="material-symbols:speed" class="w-4 h-4 text-gray-500" />
        <span class="text-gray-600">速度:</span>
        <select v-model.number="speed" @change="$emit('speed-change', speed)" class="select">
          <option :value="0.5">0.5x</option>
          <option :value="1">1x</option>
          <option :value="2">2x</option>
          <option :value="3">3x</option>
        </select>
      </div>
      <div class="text-gray-600 flex items-center gap-1">
        <Icon icon="material-symbols:format-list-numbered" class="w-4 h-4 text-gray-500" />
        步骤: <span class="font-semibold text-gray-800">{{ currentStep + 1 }}</span
        >/<span class="text-gray-500">{{ totalSteps }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps<{
  isPlaying: boolean
  currentStep: number
  totalSteps: number
  speed: number
}>()
const emit = defineEmits(['play', 'pause', 'reset', 'step', 'step-back', 'speed-change'])
const speed = ref(props.speed)
watch(
  () => props.speed,
  (v) => (speed.value = v),
)
</script>

<style scoped>
.btn {
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  transition: all 0.15s ease-in-out;
  border: 1px solid #e5e7eb;
  background-color: #f9fafb;
  color: #374151;
  font-size: 0.875rem;
  position: relative;
  overflow: hidden;
}

.btn:hover:not(:disabled) {
  background-color: #f3f4f6;
  border-color: #d1d5db;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  background-color: #f3f4f6;
  color: #9ca3af;
  border-color: #e5e7eb;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
  border-color: #3b82f6;
  box-shadow: 0 1px 3px rgba(59, 130, 246, 0.3);
}

.btn-primary:hover:not(:disabled) {
  background-color: #2563eb;
  border-color: #2563eb;
  box-shadow: 0 2px 6px rgba(59, 130, 246, 0.4);
}

.btn-secondary {
  background-color: #6b7280;
  color: white;
  border-color: #6b7280;
  box-shadow: 0 1px 3px rgba(107, 114, 128, 0.3);
}

.btn-secondary:hover:not(:disabled) {
  background-color: #4b5563;
  border-color: #4b5563;
  box-shadow: 0 2px 6px rgba(107, 114, 128, 0.4);
}

.select {
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  background-color: white;
  color: #374151;
}

.select:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
  border-color: #3b82f6;
}
</style>
