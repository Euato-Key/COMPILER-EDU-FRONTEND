<template>
  <div class="flex items-center justify-between px-4 py-2 bg-white shadow rounded mb-4">
    <div class="flex items-center gap-2">
      <button @click="$emit('play')" :disabled="isPlaying" class="btn">
        <lucide-play class="w-5 h-5" />
      </button>
      <button @click="$emit('pause')" :disabled="!isPlaying" class="btn">
        <lucide-pause class="w-5 h-5" />
      </button>
      <button @click="$emit('reset')" class="btn">
        <lucide-rotate-ccw class="w-5 h-5" />
      </button>
      <button @click="$emit('step')" class="btn">
        <lucide-step-forward class="w-5 h-5" />
      </button>
    </div>
    <div class="flex items-center gap-4">
      <div class="flex items-center gap-1">
        <span>速度:</span>
        <select v-model.number="speed" @change="$emit('speed-change', speed)" class="select">
          <option :value="0.5">0.5x</option>
          <option :value="1">1x</option>
          <option :value="2">2x</option>
          <option :value="3">3x</option>
        </select>
      </div>
      <div>
        步骤: <span class="font-bold">{{ currentStep + 1 }}</span
        >/<span>{{ totalSteps }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue'
import { Play, Pause, RotateCcw, StepForward } from 'lucide-vue-next'

const props = defineProps<{
  isPlaying: boolean
  currentStep: number
  totalSteps: number
  speed: number
}>()
const emit = defineEmits(['play', 'pause', 'reset', 'step', 'speed-change'])
const speed = ref(props.speed)
watch(
  () => props.speed,
  (v) => (speed.value = v),
)
</script>

<style scoped>
.btn {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  transition: all 0.15s ease-in-out;
}
.btn:hover {
  background-color: #f3f4f6;
}
.btn:disabled {
  opacity: 0.5;
}
.select {
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  padding: 0.125rem 0.25rem;
}
</style>
