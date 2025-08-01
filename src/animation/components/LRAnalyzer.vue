<template>
  <div class="flex flex-col md:flex-row gap-4 p-4">
    <!-- 动作信息区 -->
    <div class="flex-1 bg-white rounded shadow p-4">
      <div class="font-bold mb-2">动作信息</div>
      <div v-if="currentMsg.type === 'shift'">
        <span class="text-blue-600">移进</span>：状态 {{ currentMsg.currentState }} →
        {{ currentMsg.newState }}，符号 '{{ currentMsg.symbol }}' 入栈
      </div>
      <div v-else-if="currentMsg.type === 'reduce'">
        <span class="text-green-600">归约</span>：用 {{ currentMsg.production }} (r{{
          currentMsg.ruleNumber
        }})
      </div>
      <div v-else-if="currentMsg.type === 'accept'">
        <span class="text-green-600">接受 acc</span>
      </div>
      <div v-else>
        <span class="text-gray-400">{{ currentMsg.message }}</span>
      </div>
    </div>
    <!-- 状态栈 -->
    <div class="flex flex-col items-center bg-white rounded shadow p-4 min-w-[80px]">
      <div class="font-bold mb-2">状态栈</div>
      <div class="flex flex-col-reverse items-center">
        <div
          v-for="(item, idx) in currentStateStack"
          :key="idx"
          class="stack-item"
          :class="{ 'bg-blue-100': idx === 0 }"
        >
          {{ item }}
        </div>
      </div>
      <div class="text-xs text-gray-400 mt-2">栈底 #</div>
    </div>
    <!-- 符号栈 -->
    <div class="flex flex-col items-center bg-white rounded shadow p-4 min-w-[80px]">
      <div class="font-bold mb-2">符号栈</div>
      <div class="flex flex-col-reverse items-center">
        <div
          v-for="(item, idx) in currentSymbolStack"
          :key="idx"
          class="stack-item"
          :class="{ 'bg-green-100': idx === 0 }"
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
    <div>当前动作: {{ analysisData.info_msg?.[currentStep] || '-' }}</div>
    <div>步骤: {{ currentStep + 1 }}/{{ totalSteps }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue'
import { parseLRMessage } from '@/animation/utils/messageParser'

const props = defineProps<{
  algorithm: string
  analysisData: any
  currentStep: number
  isPlaying: boolean
}>()

const totalSteps = computed(() => props.analysisData?.info_step?.length || 0)
const currentMsg = computed(() =>
  parseLRMessage(props.analysisData?.info_msg?.[props.currentStep] || ''),
)
const currentStateStack = computed(() => {
  const stack = props.analysisData?.info_state_stack?.[props.currentStep]
  return stack ? stack.split('').reverse() : []
})
const currentSymbolStack = computed(() => {
  const stack = props.analysisData?.info_symbol_stack?.[props.currentStep]
  return stack ? stack.split('').reverse() : []
})
const currentInput = computed(() => {
  const str = props.analysisData?.info_str?.[props.currentStep]
  return str ? str.split('') : []
})
const pointer = computed(() => {
  const all = props.analysisData?.info_str?.[0]?.length || 0
  const now = props.analysisData?.info_str?.[props.currentStep]?.length || 0
  return all - now
})
</script>

<style scoped>
.stack-item {
  width: 3rem;
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
