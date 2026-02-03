<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-6">
        <h3 class="text-lg font-semibold text-gray-900 flex items-center">
          <Icon icon="lucide:table" class="w-5 h-5 mr-2 text-green-600" />
          LL1 分析表
        </h3>
        <!-- 表格状态说明 -->
        <div class="flex items-center gap-3 text-xs">
          <div class="flex items-center gap-2 px-2 py-1 bg-gradient-to-r from-amber-50 to-orange-50 rounded-md border border-amber-200">
            <div class="w-3 h-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-sm border border-orange-600"></div>
            <span class="font-semibold text-orange-700">待填写</span>
          </div>
          <div class="flex items-center gap-2 px-2 py-1 bg-gradient-to-r from-green-50 to-emerald-50 rounded-md border border-green-200">
            <div class="w-3 h-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full shadow-sm border border-green-600"></div>
            <span class="font-semibold text-green-700">校验正确</span>
          </div>
          <div class="flex items-center gap-2 px-2 py-1 bg-gradient-to-r from-red-50 to-pink-50 rounded-md border border-red-200">
            <div class="w-3 h-3 bg-gradient-to-br from-red-400 to-pink-500 rounded-full shadow-sm border border-red-600"></div>
            <span class="font-semibold text-red-700">校验错误</span>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <button
          @click="$emit('hint')"
          :disabled="hintActive || checking"
          class="inline-flex items-center px-3 py-2 text-sm font-medium text-orange-600 bg-white border border-orange-300 rounded-md shadow-sm hover:bg-orange-50 hover:text-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          <Icon icon="lucide:lightbulb" class="w-4 h-4 mr-1.5" />
          提示
        </button>
        <button
          @click="$emit('clear')"
          :disabled="hintActive || checking"
          class="inline-flex items-center px-3 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md shadow-sm hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          <Icon icon="lucide:trash-2" class="w-4 h-4 mr-1.5" />
          清空
        </button>
        <button
          @click="$emit('check')"
          :disabled="checking"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
        >
          <Icon v-if="checking" icon="lucide:loader-2" class="w-4 h-4 animate-spin mr-2" />
          校验
        </button>
      </div>
    </div>

    <!-- 操作提示 -->
    <div class="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-md">
      <div class="text-xs text-blue-700 flex items-center gap-4">
        <span class="flex items-center gap-1">
          <Icon icon="lucide:mouse-pointer" class="w-3 h-3" />
          <span>从左侧拖拽产生式到表格中</span>
        </span>
        <span class="flex items-center gap-1">
          <Icon icon="lucide:keyboard" class="w-3 h-3" />
          <span>或直接手动输入产生式</span>
        </span>
      </div>
    </div>

    <!-- LL1分析表 -->
    <div class="overflow-x-auto">
      <table class="min-w-full border border-gray-300">
        <thead class="bg-green-50">
          <tr>
            <th
              class="border border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase"
            >
              非终结符
            </th>
            <th
              v-for="terminal in terminals"
              :key="terminal"
              class="border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-700"
            >
              {{ terminal }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white">
          <tr v-for="nonTerminal in nonTerminals" :key="nonTerminal">
            <td
              class="border border-gray-300 px-3 py-2 font-mono font-semibold text-green-700"
            >
              {{ nonTerminal }}
            </td>
            <td
              v-for="terminal in terminals"
              :key="`${nonTerminal}-${terminal}`"
              class="border border-gray-300 px-1 py-1 relative"
            >
              <input
                v-model="userTable[`${nonTerminal}|${terminal}`]"
                type="text"
                placeholder="拖拽产生式到此"
                :class="[
                  'w-full px-2 py-1 text-xs text-center border-0 focus:ring-2 focus:ring-green-500 transition-colors pr-6',
                  getTableCellClass(nonTerminal, terminal),
                  { 'ring-2 ring-orange-400 ring-opacity-50': tableCellHighlightState[`${nonTerminal}|${terminal}`] }
                ]"
                :data-table-cell="`${nonTerminal}|${terminal}`"
                @focus="$emit('cell-focus', nonTerminal, terminal)"
                @input="$emit('cell-change', nonTerminal, terminal)"
                @blur="$emit('cell-change', nonTerminal, terminal)"
                @dragover.prevent
                @drop="onDrop($event, nonTerminal, terminal)"
              />
              <!-- 校验状态图标 -->
              <div v-if="userTable[`${nonTerminal}|${terminal}`] && tableValidation[`${nonTerminal}|${terminal}`]"
                   class="absolute right-1 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <Icon
                  v-if="tableValidation[`${nonTerminal}|${terminal}`] === 'correct'"
                  icon="lucide:check-circle"
                  class="w-3 h-3 text-green-600"
                />
                <Icon
                  v-else-if="tableValidation[`${nonTerminal}|${terminal}`] === 'incorrect'"
                  icon="lucide:x-circle"
                  class="w-3 h-3 text-red-600"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 校验结果提示 -->
    <div
      v-if="tableValidated && !hasErrors"
      class="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg"
    >
      <div class="flex items-center">
        <Icon icon="lucide:check-circle" class="w-5 h-5 text-green-500 mr-2" />
        <p class="text-sm text-green-700 font-medium">
          LL1 分析表校验成功！该文法是 LL1 文法。
        </p>
      </div>
    </div>

    <div
      v-if="tableValidated && hasErrors"
      class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"
    >
      <div class="flex items-center mb-2">
        <Icon icon="lucide:alert-triangle" class="w-5 h-5 text-red-500 mr-2" />
        <p class="text-sm text-red-700 font-medium">分析表校验失败，请检查错误项目</p>
      </div>
      <p class="text-xs text-red-600">
        剩余 {{ remainingAttempts }} 次尝试，超过限制将显示正确答案
      </p>
    </div>

    <!-- 显示答案 -->
    <div v-if="showAnswer" class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h4 class="text-sm font-medium text-blue-800 mb-3">正确答案：</h4>
      <div class="overflow-x-auto">
        <table class="min-w-full border border-blue-300 text-xs">
          <thead class="bg-blue-100">
            <tr>
              <th
                class="border border-blue-300 px-2 py-1 text-left font-medium text-blue-700"
              >
                非终结符
              </th>
              <th
                v-for="terminal in terminals"
                :key="terminal"
                class="border border-blue-300 px-2 py-1 text-center font-medium text-blue-700"
              >
                {{ terminal }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="nonTerminal in nonTerminals" :key="nonTerminal">
              <td
                class="border border-blue-300 px-2 py-1 font-mono font-semibold text-blue-700"
              >
                {{ nonTerminal }}
              </td>
              <td
                v-for="terminal in terminals"
                :key="`${nonTerminal}-${terminal}`"
                class="border border-blue-300 px-2 py-1 text-center text-blue-600"
              >
                 {{ getCorrectEntry(nonTerminal, terminal) || '-' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

const props = defineProps<{
  nonTerminals: string[]
  terminals: string[]
  userTable: Record<string, string>
  tableValidation: Record<string, 'correct' | 'incorrect' | ''>
  tableCellHighlightState: Record<string, boolean>
  checking: boolean
  hintActive: boolean
  tableValidated: boolean
  hasErrors: boolean
  remainingAttempts: number
  showAnswer: boolean
  getCorrectEntry: (nt: string, t: string) => string
}>()

const emit = defineEmits<{
  'cell-change': [nt: string, t: string]
  'cell-focus': [nt: string, t: string]
  'cell-drop': [nt: string, t: string, production: string]
  'check': []
  'hint': []
  'clear': []
}>()

const onDrop = (event: DragEvent, nt: string, t: string) => {
  event.preventDefault()
  const production = event.dataTransfer?.getData('text/plain')
  if (production) {
    emit('cell-drop', nt, t, production)
  }
}

const getTableCellClass = (nonTerminal: string, terminal: string): string => {
  const key = `${nonTerminal}|${terminal}`
  const validation = props.tableValidation[key]

  if (validation === 'correct') {
    return 'bg-green-50 border-green-300'
  } else if (validation === 'incorrect') {
    return 'bg-red-50 border-red-300'
  }

  // 检查是否为需要填写的项
  const correctEntry = props.getCorrectEntry(nonTerminal, terminal)
  if (correctEntry) {
    return 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300' // 待填写
  }

  return 'bg-gray-100' // 不需要填写
}
</script>

<style scoped>
@keyframes highlight-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.ring-orange-400 {
  animation: highlight-pulse 1s ease-in-out infinite;
}
</style>
