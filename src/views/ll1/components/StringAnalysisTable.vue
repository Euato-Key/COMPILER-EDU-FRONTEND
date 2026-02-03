<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
      <Icon icon="lucide:table" class="w-5 h-5 mr-2 text-blue-600" />
      LL1 分析表
    </h3>
    <div class="overflow-x-auto">
      <table class="min-w-full border border-gray-300">
        <thead class="bg-blue-50">
          <tr>
            <th class="border border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-700">
              非终结符
            </th>
            <th
              v-for="terminal in terminals"
              :key="terminal"
              class="border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-700 transition-colors"
              :class="{
                'bg-orange-200 font-bold': hintActive && hintCol === terminal
              }"
            >
              {{ terminal }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white">
          <tr v-for="nonTerminal in nonTerminals" :key="nonTerminal">
            <td
              class="border border-gray-300 px-3 py-2 font-mono font-semibold text-blue-700 transition-colors"
              :class="{
                'bg-orange-200': hintActive && hintRow === nonTerminal
              }"
            >
              {{ nonTerminal }}
            </td>
            <td
              v-for="terminal in terminals"
              :key="`${nonTerminal}-${terminal}`"
              :data-table-cell="`${nonTerminal}|${terminal}`"
              class="border border-gray-300 px-3 py-2 text-center text-xs font-mono transition-colors"
              :class="[
                !isAnalysisComplete ? 'cursor-pointer hover:bg-blue-50' : 'cursor-not-allowed opacity-50',
                hintActive && hintRow === nonTerminal && hintCol === terminal ? 'bg-red-300 font-bold' : '',
                hintActive && (hintRow === nonTerminal || hintCol === terminal) && !(hintRow === nonTerminal && hintCol === terminal) ? 'bg-orange-100' : ''
              ]"
              @dblclick="!isAnalysisComplete && $emit('cell-dblclick', nonTerminal, terminal)"
            >
              <span
                v-if="table[`${nonTerminal}|${terminal}`]"
                class="text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded border"
              >
                {{ nonTerminal }}->{{ table[`${nonTerminal}|${terminal}`] }}
              </span>
              <span v-else class="text-gray-400">-</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <div class="flex items-start gap-2 text-sm text-blue-700">
        <Icon icon="lucide:info" class="w-4 h-4 mt-0.5 flex-shrink-0" />
        <div>
          <p class="font-medium mb-1">💡 操作提示</p>
          <p class="text-sm">
            • <span class="font-bold">双击</span>表格中的产生式可进行推导操作
          </p>
          <p class="text-sm">• 根据当前分析栈栈顶符号和输入串首字符选择正确的操作</p>
        </div>
      </div>
    </div>

    <!-- 符号卡片显示 -->
    <div class="mt-4 grid grid-cols-2 gap-4">
      <!-- 非终结符卡片 -->
      <div class="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg border border-purple-200 p-4 shadow-sm">
        <div class="flex items-center gap-2 mb-3">
          <div class="w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Icon icon="lucide:tag" class="w-3 h-3 text-white" />
          </div>
          <span class="text-sm font-semibold text-purple-800">非终结符 Vn</span>
        </div>
        <div class="flex flex-wrap gap-2 justify-center">
          <span
            v-for="nt in nonTerminals"
            :key="nt"
            :data-symbol="nt"
            class="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-mono font-semibold border border-purple-200 shadow-sm"
          >
            {{ nt }}
          </span>
        </div>
      </div>

      <!-- 终结符卡片 -->
      <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200 p-4 shadow-sm">
        <div class="flex items-center gap-2 mb-3">
          <div class="w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
            <Icon icon="lucide:hash" class="w-3 h-3 text-white" />
          </div>
          <span class="text-sm font-semibold text-green-800">终结符 Vt</span>
        </div>
        <div class="flex flex-wrap gap-2 justify-center">
          <span
            v-for="t in terminals.filter(item => item !== '#')"
            :key="t"
            :data-symbol="t"
            class="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-mono font-semibold border border-green-200 shadow-sm"
          >
            {{ t }}
          </span>
          <!-- 结束符 # -->
          <span
            data-symbol="#"
            class="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-mono font-semibold border border-blue-200 shadow-sm"
          >
            #
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

defineProps<{
  nonTerminals: string[]
  terminals: string[]
  table: Record<string, string>
  isAnalysisComplete: boolean
  hintActive: boolean
  hintRow: string
  hintCol: string
}>()

defineEmits<{
  'cell-dblclick': [nt: string, t: string]
}>()
</script>
