<template>
  <div class="fa-step3-detailed-report space-y-8">
    <!-- 步骤3：子集构造法 -->
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">3</div>
      <h2 class="text-xl font-bold text-gray-900">步骤 3：子集构造法</h2>
    </div>

    <!-- 左右布局的表格 -->
    <div class="grid grid-cols-1 xl:grid-cols-2 print:grid-cols-2 gap-4 print:gap-2">
      <!-- 1. 转换表 (NFA -> DFA) -->
      <div class="result-card bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden print:shadow-none print:border print:border-gray-300">
        <div class="px-6 py-4 bg-gray-50 border-b border-gray-200 print:px-2 print:py-1 print:bg-gray-100">
          <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2 print:text-sm">
            <Icon icon="lucide:split" class="w-5 h-5 text-blue-600 print:w-4 print:h-4" />
            子集构造：NFA → DFA 转换表
          </h3>
          <p class="text-xs text-gray-500 mt-1 print:hidden">记录 NFA 状态集合到 DFA 状态的映射关系</p>
        </div>
        <div class="p-4 overflow-x-auto print:p-1">
          <table class="min-w-full border-collapse border-2 border-gray-400">
            <thead>
              <tr class="bg-gray-100">
                <th v-for="col in conversionCols" :key="col" class="border border-gray-400 px-3 py-2 text-sm font-semibold text-gray-700 text-center">
                  {{ col }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="rowIdx in conversionMaxRows" :key="rowIdx" :class="rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'">
                <td v-for="col in conversionCols" :key="col" class="border border-gray-400 p-1 min-w-[60px]">
                  <div class="flex flex-col gap-2">
                    <!-- 用户答案（正确时显示绿色，错误时显示红色并显示标准答案） -->
                    <div
                      class="answer-item px-1.5 py-1 rounded border transition-all flex items-center justify-between gap-1"
                      :class="getUserAnswerStatus('conversionTable', col, rowIdx - 1) === 'correct'
                        ? 'bg-green-50 border-green-200 shadow-sm'
                        : (getUserAnswerStatus('conversionTable', col, rowIdx - 1) === 'wrong' ? 'bg-red-50 border-red-200 shadow-sm' : 'bg-gray-50 border-gray-100')"
                    >
                      <div class="text-sm font-mono font-bold truncate print:text-xs" :class="getUserAnswerStatus('conversionTable', col, rowIdx - 1) === 'correct' ? 'text-green-900' : (getUserAnswerStatus('conversionTable', col, rowIdx - 1) === 'wrong' ? 'text-red-900' : 'text-gray-400')">
                        {{ formatAsSet(getFinalUserValue('conversionTable', col, rowIdx - 1)) }}
                      </div>
                      <Icon
                        v-if="getUserAnswerStatus('conversionTable', col, rowIdx - 1) === 'correct'"
                        icon="lucide:check-circle"
                        class="w-3 h-3 text-green-600 flex-shrink-0 print:hidden"
                      />
                      <Icon
                        v-else-if="getUserAnswerStatus('conversionTable', col, rowIdx - 1) === 'wrong'"
                        icon="lucide:x-circle"
                        class="w-3 h-3 text-red-600 flex-shrink-0"
                      />
                    </div>

                    <!-- 标准答案（仅当用户答错时显示） -->
                    <div v-if="getUserAnswerStatus('conversionTable', col, rowIdx - 1) === 'wrong'" class="answer-item px-1.5 py-1 bg-blue-50 border border-blue-100 rounded flex items-center gap-1">
                      <Icon icon="lucide:book-open" class="w-3 h-3 text-blue-500 flex-shrink-0" />
                      <div class="text-sm font-mono font-bold text-blue-900 truncate">{{ getStandardValue('conversionTable', col, rowIdx - 1) }}</div>
                    </div>

                    <!-- 历史错误记录 -->
                    <div v-if="getWrongAttempts('conversionTable', col, rowIdx - 1).length > 0" class="flex flex-wrap gap-0.5">
                      <span
                        v-for="(attempt, aIdx) in getWrongAttempts('conversionTable', col, rowIdx - 1)"
                        :key="aIdx"
                        class="px-1 py-0.5 bg-red-50 text-red-500 rounded text-xs font-mono line-through opacity-70 border border-red-200"
                        :title="`次数: ${aIdx + 1}`"
                      >
                        {{ formatAsSet(attempt) }}
                      </span>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <!-- 颜色说明 -->
          <div class="mt-4 flex gap-4 text-xs print:mt-2 print:gap-2 print:text-[10px]">
            <div class="flex items-center gap-1"><span class="w-3 h-3 bg-green-500 rounded-full print:w-2 print:h-2"></span> 回答正确</div>
            <div class="flex items-center gap-1"><span class="w-3 h-3 bg-red-500 rounded-full print:w-2 print:h-2"></span> 回答错误</div>
            <div class="flex items-center gap-1"><span class="w-3 h-3 bg-blue-500 rounded-full print:w-2 print:h-2"></span> 标准答案</div>
            <div class="flex items-center gap-1"><span class="w-3 h-3 bg-red-300 rounded-full print:w-2 print:h-2"></span> 历史错误</div>
          </div>
        </div>
      </div>

      <!-- 2. 状态转换矩阵 -->
      <div class="result-card bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden print:shadow-none print:border print:border-gray-300">
        <div class="px-6 py-4 bg-gray-50 border-b border-gray-200 print:px-2 print:py-1 print:bg-gray-100">
          <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2 print:text-sm">
            <Icon icon="lucide:grid-3x3" class="w-5 h-5 text-purple-600 print:w-4 print:h-4" />
            子集构造：DFA 状态转换矩阵
          </h3>
          <p class="text-xs text-gray-500 mt-1 print:hidden">显示状态重命名后的转移关系</p>
        </div>
        <div class="p-4 overflow-x-auto print:p-1">
          <table class="min-w-full border-collapse border-2 border-gray-400">
            <thead>
              <tr class="bg-gray-100">
                <th v-for="col in matrixCols" :key="col" class="border border-gray-400 px-3 py-2 text-sm font-semibold text-gray-700 text-center">
                  {{ col }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="rowIdx in matrixMaxRows" :key="rowIdx" :class="rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'">
                <td v-for="col in matrixCols" :key="col" class="border border-gray-400 p-1 min-w-[60px]">
                  <div class="flex flex-col gap-1">
                    <!-- 用户答案（正确时显示绿色，错误时显示红色并显示标准答案） -->
                    <div
                      class="answer-item px-1.5 py-1 rounded border transition-all flex items-center justify-between gap-1"
                      :class="getUserAnswerStatus('transitionMatrix', col, rowIdx - 1) === 'correct'
                        ? 'bg-green-50 border-green-200 shadow-sm'
                        : (getUserAnswerStatus('transitionMatrix', col, rowIdx - 1) === 'wrong' ? 'bg-red-50 border-red-200 shadow-sm' : 'bg-gray-50 border-gray-100')"
                    >
                      <div class="text-sm font-mono font-bold truncate print:text-xs" :class="getUserAnswerStatus('transitionMatrix', col, rowIdx - 1) === 'correct' ? 'text-green-900' : (getUserAnswerStatus('transitionMatrix', col, rowIdx - 1) === 'wrong' ? 'text-red-900' : 'text-gray-400')">
                        {{ getFinalUserValue('transitionMatrix', col, rowIdx - 1) || '-' }}
                      </div>
                      <Icon
                        v-if="getUserAnswerStatus('transitionMatrix', col, rowIdx - 1) === 'correct'"
                        icon="lucide:check-circle"
                        class="w-3 h-3 text-green-600 flex-shrink-0 print:hidden"
                      />
                      <Icon
                        v-else-if="getUserAnswerStatus('transitionMatrix', col, rowIdx - 1) === 'wrong'"
                        icon="lucide:x-circle"
                        class="w-3 h-3 text-red-600 flex-shrink-0"
                      />
                    </div>

                    <!-- 标准答案（仅当用户答错时显示） -->
                    <div v-if="getUserAnswerStatus('transitionMatrix', col, rowIdx - 1) === 'wrong'" class="answer-item px-1.5 py-1 bg-blue-50 border border-blue-100 rounded flex items-center gap-1">
                      <Icon icon="lucide:book-open" class="w-3 h-3 text-blue-500 flex-shrink-0" />
                      <div class="text-sm font-mono font-bold text-blue-900 truncate">{{ getStandardValue('transitionMatrix', col, rowIdx - 1) }}</div>
                    </div>

                    <!-- 历史错误记录 -->
                    <div v-if="getWrongAttempts('transitionMatrix', col, rowIdx - 1).length > 0" class="flex flex-wrap gap-0.5">
                      <span
                        v-for="(attempt, aIdx) in getWrongAttempts('transitionMatrix', col, rowIdx - 1)"
                        :key="aIdx"
                        class="px-1 py-0.5 bg-red-50 text-red-500 rounded text-xs font-mono line-through opacity-70 border border-red-200"
                      >
                        {{ attempt }}
                      </span>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <!-- 颜色说明 -->
          <div class="mt-4 flex gap-4 text-xs print:mt-2 print:gap-2 print:text-[10px]">
            <div class="flex items-center gap-1"><span class="w-3 h-3 bg-green-500 rounded-full print:w-2 print:h-2"></span> 回答正确</div>
            <div class="flex items-center gap-1"><span class="w-3 h-3 bg-red-500 rounded-full print:w-2 print:h-2"></span> 回答错误</div>
            <div class="flex items-center gap-1"><span class="w-3 h-3 bg-blue-500 rounded-full print:w-2 print:h-2"></span> 标准答案</div>
            <div class="flex items-center gap-1"><span class="w-3 h-3 bg-red-300 rounded-full print:w-2 print:h-2"></span> 历史错误</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

interface Props {
  // 标准数据 (来自 store.originalData)
  standardData: {
    table: Record<string, string[]>
    table_to_num: Record<string, string[]>
  }
  // 用户最后一次保存的数据
  userData: {
    userConversionTable: Record<string, string[]>
    userTransitionMatrix: Record<string, Record<string, string>>
    conversionTableRowCount: number
  }
  // 所有的历史错误日志
  errorLogs: any[]
}

const props = defineProps<Props>()

// --- 转换表配置 (Step 3 Table) ---
const conversionCols = computed(() => {
  if (!props.standardData.table) return []
  return Object.keys(props.standardData.table).sort((a, b) => {
    if (a === 'I') return -1
    if (b === 'I') return 1
    return a.localeCompare(b)
  })
})

const conversionMaxRows = computed(() => {
  if (!props.standardData.table) return 0
  const colKeys = Object.keys(props.standardData.table)
  if (colKeys.length === 0) return 0
  return props.standardData.table[colKeys[0]].length
})

// --- 矩阵配置 (Step 3 Matrix) ---
const matrixCols = computed(() => {
  if (!props.standardData.table_to_num) return []
  return Object.keys(props.standardData.table_to_num).sort((a, b) => {
    if (a === 'S') return -1
    if (b === 'S') return 1
    return a.localeCompare(b)
  })
})

const matrixMaxRows = computed(() => {
  if (!props.standardData.table_to_num) return 0
  const keys = Object.keys(props.standardData.table_to_num)
  if (keys.length === 0) return 0
  return props.standardData.table_to_num[keys[0]]?.length || 0
})

// --- 通用工具函数 ---

// 将值格式化为集合形式 {a,b,c}
const formatAsSet = (val: any): string => {
  if (val === undefined || val === null || val === '-') return '-'
  if (Array.isArray(val)) {
    if (val.length === 0) return '-'
    return `{${val.join(',')}}`
  }
  // 如果是字符串，按空格分割后格式化为集合
  const str = String(val).trim()
  if (str === '' || str === '-') return '-'
  const parts = str.split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '-'
  return `{${parts.join(',')}}`
}

// 获取标准答案原始值（用于比较）
const getStandardRawValue = (type: 'conversionTable' | 'transitionMatrix', col: string, row: number) => {
  if (type === 'conversionTable') {
    const val = props.standardData.table[col]?.[row]
    return Array.isArray(val) ? val.join(' ') : String(val || '-')
  } else {
    const val = props.standardData.table_to_num[col]?.[row]
    return val === undefined ? '-' : String(val)
  }
}

// 获取标准答案显示值（格式化后的集合形式）
const getStandardValue = (type: 'conversionTable' | 'transitionMatrix', col: string, row: number) => {
  if (type === 'conversionTable') {
    const val = props.standardData.table[col]?.[row]
    return formatAsSet(val)
  } else {
    const val = props.standardData.table_to_num[col]?.[row]
    return val === undefined ? '-' : String(val)
  }
}

// 获取用户最终填写的值
const getFinalUserValue = (type: 'conversionTable' | 'transitionMatrix', col: string, row: number) => {
  if (!props.userData) return ''
  if (type === 'conversionTable') {
    return props.userData.userConversionTable?.[col]?.[row] || ''
  } else {
    return props.userData.userTransitionMatrix?.[String(row)]?.[col] || ''
  }
}

// 状态集合比对 (忽略空格顺序)
const isStateSetMatch = (userVal: string, standardVal: string) => {
  if (!userVal || !standardVal) return userVal === standardVal
  const user = userVal.trim().split(/\s+/).filter(Boolean).sort().join(' ')
  const std = standardVal.trim().split(/\s+/).filter(Boolean).sort().join(' ')
  return user === std
}

// 检查值是否表示空/无转换（"-"或空字符串）
const isEmptyValue = (val: string): boolean => {
  return !val || val.trim() === '' || val.trim() === '-'
}

// 判断用户回答状态
const getUserAnswerStatus = (type: 'conversionTable' | 'transitionMatrix', col: string, row: number) => {
  const userVal = getFinalUserValue(type, col, row)
  // 使用原始值进行比较，而不是格式化后的值
  const stdValRaw = getStandardRawValue(type, col, row)

  // 如果标准答案是"-"（表示无转换），用户填"-"或留空都算正确
  if (isEmptyValue(stdValRaw)) {
    return isEmptyValue(userVal) ? 'correct' : 'wrong'
  }

  // 如果标准答案有值，用户留空算未填写
  if (!userVal || userVal.trim() === '') return 'none'

  if (type === 'conversionTable') {
    return isStateSetMatch(userVal, stdValRaw) ? 'correct' : 'wrong'
  } else {
    return userVal.trim() === stdValRaw.trim() ? 'correct' : 'wrong'
  }
}

// 获取某一格的历史错误列表
const getWrongAttempts = (type: 'conversionTable' | 'transitionMatrix', col: string, row: number) => {
  const tableType = type
  return props.errorLogs
    .filter(log => 
      log.step === 'step3' && 
      log.tableType === tableType && 
      log.location.row === row && 
      log.location.col === col
    )
    .map(log => log.wrongValue)
    // 去重并限制数量
    .filter((value, index, self) => self.indexOf(value) === index)
}
</script>

<style scoped>
.answer-item {
  transition: all 0.2s ease;
}
.fa-step3-detailed-report :deep(table) {
  table-layout: fixed;
}
</style>
