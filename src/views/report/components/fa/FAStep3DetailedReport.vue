<template>
  <div class="fa-step3-detailed-report space-y-8">
    <!-- 1. 转换表 (NFA -> DFA) -->
    <div class="result-card bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Icon icon="lucide:split" class="w-5 h-5 text-blue-600" />
          子集构造：NFA → DFA 转换表
        </h3>
        <p class="text-xs text-gray-500 mt-1">集成了标准答案、我的最终答案以及历史错误记录（以标准答案规模为准）</p>
      </div>
      <div class="p-6 overflow-x-auto">
        <table class="min-w-full border-collapse border-2 border-gray-400">
          <thead>
            <tr class="bg-gray-100">
              <th v-for="col in conversionCols" :key="col" class="border border-gray-400 px-4 py-3 text-sm font-semibold text-gray-700 text-center">
                {{ col }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="rowIdx in conversionMaxRows" :key="rowIdx" :class="rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'">
              <td v-for="col in conversionCols" :key="col" class="border border-gray-400 p-2 min-w-[150px]">
                <div class="flex flex-col gap-2">
                  <!-- 标准答案 -->
                  <div class="answer-item p-2 bg-blue-50 border border-blue-100 rounded">
                    <div class="text-[10px] text-blue-500 font-bold uppercase tracking-wider mb-1">标准答案</div>
                    <div class="text-sm font-mono font-bold text-blue-900">{{ getStandardValue('conversionTable', col, rowIdx - 1) }}</div>
                  </div>

                  <!-- 用户答案 -->
                  <div 
                    class="answer-item p-2 rounded border transition-all"
                    :class="getUserAnswerStatus('conversionTable', col, rowIdx - 1) === 'correct' 
                      ? 'bg-green-50 border-green-200 shadow-sm' 
                      : (getUserAnswerStatus('conversionTable', col, rowIdx - 1) === 'wrong' ? 'bg-red-50 border-red-200 shadow-sm' : 'bg-gray-50 border-gray-100')"
                  >
                    <div class="flex items-center justify-between mb-1">
                      <div class="text-[10px] font-bold uppercase tracking-wider" :class="getUserAnswerStatus('conversionTable', col, rowIdx - 1) === 'correct' ? 'text-green-600' : (getUserAnswerStatus('conversionTable', col, rowIdx - 1) === 'wrong' ? 'text-red-600' : 'text-gray-400')">
                        我的最终答案
                      </div>
                      <Icon 
                        v-if="getUserAnswerStatus('conversionTable', col, rowIdx - 1) === 'correct'" 
                        icon="lucide:check-circle" 
                        class="w-3 h-3 text-green-600" 
                      />
                      <Icon 
                        v-else-if="getUserAnswerStatus('conversionTable', col, rowIdx - 1) === 'wrong'" 
                        icon="lucide:x-circle" 
                        class="w-3 h-3 text-red-600" 
                      />
                    </div>
                    <div class="text-sm font-mono font-bold" :class="getUserAnswerStatus('conversionTable', col, rowIdx - 1) === 'correct' ? 'text-green-900' : (getUserAnswerStatus('conversionTable', col, rowIdx - 1) === 'wrong' ? 'text-red-900' : 'text-gray-400')">
                      {{ getFinalUserValue('conversionTable', col, rowIdx - 1) || '(空)' }}
                    </div>
                  </div>

                  <!-- 历史错误记录 -->
                  <div v-if="getWrongAttempts('conversionTable', col, rowIdx - 1).length > 0" class="mt-1">
                    <div class="text-[9px] text-gray-400 font-bold uppercase mb-1">历史错误尝试</div>
                    <div class="flex flex-wrap gap-1">
                      <span 
                        v-for="(attempt, aIdx) in getWrongAttempts('conversionTable', col, rowIdx - 1)" 
                        :key="aIdx"
                        class="px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px] font-mono line-through opacity-70 border border-gray-200"
                        :title="`次数: ${aIdx + 1}`"
                      >
                        {{ attempt }}
                      </span>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 2. 状态转换矩阵 -->
    <div class="result-card bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Icon icon="lucide:grid-3x3" class="w-5 h-5 text-purple-600" />
          子集构造：DFA 状态转换矩阵
        </h3>
        <p class="text-xs text-gray-500 mt-1">显示状态重命名后的转移关系（以标准答案规模为准）</p>
      </div>
      <div class="p-6 overflow-x-auto">
        <table class="min-w-full border-collapse border-2 border-gray-400">
          <thead>
            <tr class="bg-gray-100">
              <th v-for="col in matrixCols" :key="col" class="border border-gray-400 px-4 py-3 text-sm font-semibold text-gray-700 text-center">
                {{ col }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="rowIdx in matrixMaxRows" :key="rowIdx" :class="rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'">
              <td v-for="col in matrixCols" :key="col" class="border border-gray-400 p-2 min-w-[150px]">
                <div class="flex flex-col gap-2">
                  <!-- 标准答案 -->
                  <div class="answer-item p-2 bg-blue-50 border border-blue-100 rounded">
                    <div class="text-[10px] text-blue-500 font-bold uppercase tracking-wider mb-1">标准答案</div>
                    <div class="text-sm font-mono font-bold text-blue-900">{{ getStandardValue('transitionMatrix', col, rowIdx - 1) }}</div>
                  </div>

                  <!-- 用户答案 -->
                  <div 
                    class="answer-item p-2 rounded border transition-all"
                    :class="getUserAnswerStatus('transitionMatrix', col, rowIdx - 1) === 'correct' 
                      ? 'bg-green-50 border-green-200 shadow-sm' 
                      : (getUserAnswerStatus('transitionMatrix', col, rowIdx - 1) === 'wrong' ? 'bg-red-50 border-red-200 shadow-sm' : 'bg-gray-50 border-gray-100')"
                  >
                    <div class="flex items-center justify-between mb-1">
                      <div class="text-[10px] font-bold uppercase tracking-wider" :class="getUserAnswerStatus('transitionMatrix', col, rowIdx - 1) === 'correct' ? 'text-green-600' : (getUserAnswerStatus('transitionMatrix', col, rowIdx - 1) === 'wrong' ? 'text-red-600' : 'text-gray-400')">
                        我的最终答案
                      </div>
                      <Icon 
                        v-if="getUserAnswerStatus('transitionMatrix', col, rowIdx - 1) === 'correct'" 
                        icon="lucide:check-circle" 
                        class="w-3 h-3 text-green-600" 
                      />
                      <Icon 
                        v-else-if="getUserAnswerStatus('transitionMatrix', col, rowIdx - 1) === 'wrong'" 
                        icon="lucide:x-circle" 
                        class="w-3 h-3 text-red-600" 
                      />
                    </div>
                    <div class="text-sm font-mono font-bold" :class="getUserAnswerStatus('transitionMatrix', col, rowIdx - 1) === 'correct' ? 'text-green-900' : (getUserAnswerStatus('transitionMatrix', col, rowIdx - 1) === 'wrong' ? 'text-red-900' : 'text-gray-400')">
                      {{ getFinalUserValue('transitionMatrix', col, rowIdx - 1) || '(空)' }}
                    </div>
                  </div>

                  <!-- 历史错误记录 -->
                  <div v-if="getWrongAttempts('transitionMatrix', col, rowIdx - 1).length > 0" class="mt-1">
                    <div class="text-[9px] text-gray-400 font-bold uppercase mb-1">历史错误尝试</div>
                    <div class="flex flex-wrap gap-1">
                      <span 
                        v-for="(attempt, aIdx) in getWrongAttempts('transitionMatrix', col, rowIdx - 1)" 
                        :key="aIdx"
                        class="px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px] font-mono line-through opacity-70 border border-gray-200"
                      >
                        {{ attempt }}
                      </span>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
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

// 获取标准答案值
const getStandardValue = (type: 'conversionTable' | 'transitionMatrix', col: string, row: number) => {
  if (type === 'conversionTable') {
    const val = props.standardData.table[col]?.[row]
    return Array.isArray(val) ? val.join(' ') : String(val || '-')
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

// 判断用户回答状态
const getUserAnswerStatus = (type: 'conversionTable' | 'transitionMatrix', col: string, row: number) => {
  const userVal = getFinalUserValue(type, col, row)
  const stdVal = getStandardValue(type, col, row)
  
  if (!userVal) return 'none'
  
  if (type === 'conversionTable') {
    return isStateSetMatch(userVal, stdVal) ? 'correct' : 'wrong'
  } else {
    return userVal.trim() === stdVal.trim() ? 'correct' : 'wrong'
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
