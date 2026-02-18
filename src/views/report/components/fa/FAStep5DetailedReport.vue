<template>
  <div class="fa-step5-detailed-report space-y-8">
    <!-- 步骤5：DFA最小化 -->
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold">5</div>
      <h2 class="text-xl font-bold text-gray-900">DFA 最小化</h2>
    </div>

    <!-- 左右布局 -->
    <div class="grid grid-cols-1 xl:grid-cols-2 print:grid-cols-2 gap-4 print:gap-2">
      <!-- 左侧：P Sets -->
      <div class="result-card bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden print:shadow-none print:border print:border-gray-300">
        <div class="px-6 py-4 bg-gray-50 border-b border-gray-200 print:px-2 print:py-1 print:bg-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2 print:text-sm">
                <Icon icon="lucide:layers" class="w-5 h-5 text-red-600 print:w-4 print:h-4" />
                最小化：DFA 状态分区 (P Sets)
              </h3>
              <p class="text-xs text-gray-500 mt-1 print:hidden">基于集合匹配的智能对比</p>
            </div>
          </div>
          <div class="flex gap-4 text-xs mt-3 print:hidden">
            <div class="flex items-center gap-1.5"><span class="w-3 h-3 bg-green-500 rounded-full"></span> 匹配正确</div>
            <div class="flex items-center gap-1.5"><span class="w-3 h-3 bg-red-500 rounded-full"></span> 匹配错误/多余</div>
            <div class="flex items-center gap-1.5"><span class="w-3 h-3 bg-gray-300 rounded-full"></span> 未匹配到</div>
          </div>
        </div>

        <div class="p-4 space-y-4 max-h-[600px] overflow-y-auto print:p-2">
          <!-- 标准分区对照表 -->
          <div v-for="item in analyzedPSets.matched" :key="item.id" class="p-3 border rounded-lg transition-all" :class="item.matches.length > 0 ? 'border-green-100 bg-green-50/20' : 'border-gray-200 bg-gray-50/50'">
            <div class="flex items-start justify-between mb-2">
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded">SET {{ item.id }}</span>
              </div>
              <div v-if="item.matches.length > 0" class="text-[10px] font-bold text-green-600 flex items-center gap-1">
                <Icon icon="lucide:check-circle" class="w-3 h-3" /> 已匹配
              </div>
              <div v-else class="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                <Icon icon="lucide:alert-circle" class="w-3 h-3" /> 缺失
              </div>
            </div>
            <div class="p-2 bg-white border border-blue-100 rounded text-sm font-mono font-bold text-blue-900 mb-2">
              {{ Array.isArray(item.original) ? item.original.join(' ') : item.original }}
            </div>

            <!-- 匹配到的用户填写 -->
            <div v-if="item.matches.length > 0" class="space-y-1">
              <div v-for="match in item.matches" :key="match.id" class="flex items-center gap-2 px-2 py-1.5 bg-green-50 border border-green-200 rounded text-xs font-mono text-green-900">
                <Icon icon="lucide:user" class="w-3 h-3 text-green-600" />
                {{ match.text }}
              </div>
            </div>
          </div>

          <!-- 错误或多余的填写 -->
          <div v-if="analyzedPSets.wrong.length > 0" class="mt-4">
            <h4 class="text-sm font-bold text-red-600 uppercase tracking-wider flex items-center gap-2 mb-3">
              <Icon icon="lucide:x-octagon" class="w-4 h-4" />
              错误或多余的填写
            </h4>
            <div class="space-y-2">
              <div v-for="wrong in analyzedPSets.wrong" :key="wrong.id" class="p-2 bg-red-50 border border-red-200 rounded flex items-center justify-between">
                <div class="text-sm font-mono font-bold text-red-900">{{ wrong.text }}</div>
                <div class="text-[10px] font-bold text-red-500 uppercase px-2 py-0.5 bg-red-100/50 rounded">
                  无效
                </div>
              </div>
            </div>
          </div>

          <!-- 历史错误记录 -->
          <div v-if="pSetHistoryErrors.length > 0" class="mt-4">
            <h4 class="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2 mb-3">
              <Icon icon="lucide:history" class="w-4 h-4" />
              历史错误记录
            </h4>
            <div class="flex flex-wrap gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <span
                v-for="(err, idx) in pSetHistoryErrors"
                :key="idx"
                class="px-2 py-1 bg-white border border-gray-200 text-gray-400 rounded text-[10px] font-mono line-through"
              >
                {{ err }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：最小化 DFA 状态转换矩阵 -->
      <div class="result-card bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden print:shadow-none print:border print:border-gray-300">
        <div class="px-6 py-4 bg-gray-50 border-b border-gray-200 print:px-2 print:py-1 print:bg-gray-100">
          <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2 print:text-sm">
            <Icon icon="lucide:grid-3x3" class="w-5 h-5 text-red-600 print:w-4 print:h-4" />
            最小化：DFA 状态转换矩阵
          </h3>
          <p class="text-xs text-gray-500 mt-1 print:hidden">最小化后的状态映射情况</p>
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
                      :class="getUserMatrixStatus(col, rowIdx - 1) === 'correct'
                        ? 'bg-green-50 border-green-200 shadow-sm'
                        : (getUserMatrixStatus(col, rowIdx - 1) === 'wrong' ? 'bg-red-50 border-red-200 shadow-sm' : 'bg-gray-50 border-gray-100')"
                    >
                      <div class="text-xs font-mono font-bold truncate" :class="getUserMatrixStatus(col, rowIdx - 1) === 'correct' ? 'text-green-900' : (getUserMatrixStatus(col, rowIdx - 1) === 'wrong' ? 'text-red-900' : 'text-gray-400')">
                        {{ getUserMatrixValue(col, rowIdx - 1) || '-' }}
                      </div>
                      <Icon
                        v-if="getUserMatrixStatus(col, rowIdx - 1) === 'correct'"
                        icon="lucide:check-circle"
                        class="w-3 h-3 text-green-600 flex-shrink-0"
                      />
                      <Icon
                        v-else-if="getUserMatrixStatus(col, rowIdx - 1) === 'wrong'"
                        icon="lucide:x-circle"
                        class="w-3 h-3 text-red-600 flex-shrink-0"
                      />
                    </div>

                    <!-- 标准答案（仅当用户答错时显示） -->
                    <div v-if="getUserMatrixStatus(col, rowIdx - 1) === 'wrong'" class="answer-item px-1.5 py-1 bg-blue-50 border border-blue-100 rounded flex items-center gap-1">
                      <Icon icon="lucide:book-open" class="w-3 h-3 text-blue-500 flex-shrink-0" />
                      <div class="text-xs font-mono font-bold text-blue-900 truncate">{{ getStandardValue(col, rowIdx - 1) }}</div>
                    </div>

                    <!-- 历史错误记录 -->
                    <div v-if="getMatrixErrors(col, rowIdx - 1).length > 0" class="flex flex-wrap gap-0.5">
                      <span
                        v-for="(err, eIdx) in getMatrixErrors(col, rowIdx - 1)"
                        :key="eIdx"
                        class="px-1 py-0.5 bg-red-50 text-red-500 rounded text-[9px] font-mono line-through opacity-70 border border-red-200"
                      >
                        {{ err }}
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
  standardData: {
    P: any[]
    table_to_num_min: Record<string, any>
  }
  userData: {
    userPSets: any[]
    userMinimizedMatrix: any[]
  }
  errorLogs: any[]
}

const props = defineProps<Props>()

// --- 1. P Sets 处理 ---
const analyzedPSets = computed(() => {
  const standardList = (props.standardData.P || []).map((s, idx) => ({
    id: idx,
    original: s,
    normalized: (Array.isArray(s) ? s : [s]).map(String).sort().join(' '),
    matches: [] as any[]
  }))

  const userList = props.userData?.userPSets || []
  const wrongInputs = [] as any[]

  userList.forEach(u => {
    if (!u.text || !u.text.trim()) return
    const normUser = u.text.trim().split(/\s+/).filter(Boolean).sort().join(' ')
    const matchMatch = standardList.find(s => s.normalized === normUser)

    if (matchMatch) {
      matchMatch.matches.push(u)
    } else {
      wrongInputs.push(u)
    }
  })

  return {
    matched: standardList,
    wrong: wrongInputs
  }
})

// 全局 P-Sets 历史错误
const pSetHistoryErrors = computed(() => {
  return props.errorLogs
    .filter(log => log.step === 'step5' && log.tableType === 'pSets')
    .map(log => log.wrongValue)
    .filter((v, i, a) => a.indexOf(v) === i)
})

// --- 2. 矩阵处理 ---
const matrixCols = computed(() => {
  if (!props.standardData.table_to_num_min) return []
  return Object.keys(props.standardData.table_to_num_min).sort((a, b) => {
    if (a === 'S') return -1
    if (b === 'S') return 1
    return a.localeCompare(b)
  })
})

const matrixMaxRows = computed(() => {
  if (!props.standardData.table_to_num_min) return 0
  const keys = Object.keys(props.standardData.table_to_num_min)
  if (keys.length === 0) return 0
  return props.standardData.table_to_num_min[keys[0]].length
})

const getStandardValue = (col: string, row: number) => {
  const val = props.standardData.table_to_num_min[col]?.[row]
  return val === undefined ? '-' : String(val)
}

const getUserMatrixValue = (col: string, row: number) => {
  const colIdx = matrixCols.value.indexOf(col)
  const cell = props.userData?.userMinimizedMatrix?.find(c => c.rowIndex === row && c.colIndex === colIdx)
  return cell?.value || ''
}

// 检查值是否表示空/无转换（"-"或空字符串）
const isEmptyValue = (val: string): boolean => {
  return !val || val.trim() === '' || val.trim() === '-'
}

const getUserMatrixStatus = (col: string, rowIdx: number) => {
  const userVal = getUserMatrixValue(col, rowIdx)
  const stdVal = getStandardValue(col, rowIdx)

  // 如果标准答案是"-"（表示无转换），用户填"-"或留空都算正确
  if (isEmptyValue(stdVal)) {
    return isEmptyValue(userVal) ? 'correct' : 'wrong'
  }

  // 如果标准答案有值，用户留空算未填写
  if (!userVal || userVal.trim() === '') return 'none'
  return userVal.trim() === stdVal.trim() ? 'correct' : 'wrong'
}

const getMatrixErrors = (col: string, rowIdx: number) => {
  return props.errorLogs
    .filter(log =>
      log.step === 'step5' &&
      log.tableType === 'minimizedMatrix' &&
      log.location.row === rowIdx &&
      log.location.col === col
    )
    .map(log => log.wrongValue)
    .filter((v, i, a) => a.indexOf(v) === i)
}
</script>

<style scoped>
.answer-item {
  transition: all 0.2s ease;
}
.result-card {
  transition: transform 0.2s ease;
}
.result-card:hover {
  transform: translateY(-2px);
}
</style>
