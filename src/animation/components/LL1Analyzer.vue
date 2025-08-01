<template>
  <div class="flex flex-col md:flex-row gap-4 p-4">
    <!-- 产生式显示区 -->
    <div class="flex-1 bg-white rounded shadow p-4">
      <div class="font-bold mb-2">当前产生式</div>
      <div v-if="currentMsg.type === 'production'">
        <span class="text-blue-600">{{ currentMsg.left }}</span>
        <span class="mx-2">→</span>
        <span class="text-green-600">{{
          Array.isArray(currentMsg.right) ? currentMsg.right.join(' ') : currentMsg.right
        }}</span>
      </div>
      <div v-else-if="currentMsg.type === 'epsilon'">
        <span class="text-blue-600">{{ currentMsg.left }}</span>
        <span class="mx-2">→</span>
        <span class="text-gray-400">ε (不入栈)</span>
      </div>
      <div v-else-if="currentMsg.type === 'match'">
        <span class="text-green-600">符号匹配: '{{ currentMsg.symbol }}'</span>
      </div>
      <div v-else>
        <span class="text-gray-400">{{ currentMsg.message }}</span>
      </div>
    </div>
    <!-- 栈区域 -->
    <div class="flex flex-col items-center bg-white rounded shadow p-4 min-w-[120px]">
      <div class="font-bold mb-2">分析栈</div>
      <div class="flex flex-col-reverse items-center">
        <div
          v-for="(item, idx) in currentStack"
          :key="idx"
          class="stack-item"
          :class="{ 'bg-blue-100': idx === 0 }"
        >
          {{ item }}
        </div>
      </div>
      <div class="text-xs text-gray-400 mt-2">栈底 #</div>
    </div>
    <!-- 输入串区域 -->
    <div class="flex-1 bg-white rounded shadow p-4 flex flex-col items-center">
      <div class="font-bold mb-2">输入串</div>
      <div class="flex gap-1">
        <div
          v-for="(ch, idx) in currentInput"
          :key="idx"
          class="input-symbol"
          :class="{ 'bg-green-200': idx === pointer }"
        >
          {{ ch }}
        </div>
      </div>
      <div class="mt-2 text-xs text-gray-400">指针 ↑</div>
    </div>
  </div>
  <div class="flex justify-between px-4 py-2 text-sm text-gray-600">
    <div>动作信息: {{ analysisData.info_msg?.[currentStep] || '-' }}</div>
    <div>步骤: {{ currentStep + 1 }}/{{ totalSteps }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue'
import { parseLL1Message } from '@/animation/utils/messageParser'

const props = defineProps<{
  analysisData: any
  currentStep: number
  isPlaying: boolean
}>()

const totalSteps = computed(() => props.analysisData?.info_step?.length || 0)
const currentMsg = computed(() =>
  parseLL1Message(props.analysisData?.info_msg?.[props.currentStep] || ''),
)
const currentStack = computed(() => {
  const stack = props.analysisData?.info_stack?.[props.currentStep]
  return stack ? stack.split('').reverse() : []
})
const currentInput = computed(() => {
  const str = props.analysisData?.info_str?.[props.currentStep]
  return str ? str.split('') : []
})
const pointer = computed(() => {
  // 指针为输入串长度 - 当前输入串长度
  const all = props.analysisData?.info_str?.[0]?.length || 0
  const now = props.analysisData?.info_str?.[props.currentStep]?.length || 0
  return all - now
})
</script>

<style scoped>
.stack-item {
  width: 4rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #e5e7eb;
  font-size: 1.125rem;
  font-family: ui-monospace, SFMono-Regular, monospace;
  margin-bottom: 0.25rem;
  border-radius: 0.25rem;
  transition: all 0.15s ease-in-out;
}
.input-symbol {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  font-size: 1.125rem;
  font-family: ui-monospace, SFMono-Regular, monospace;
  transition: all 0.15s ease-in-out;
}
</style>
