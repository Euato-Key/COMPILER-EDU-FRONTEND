<template>
  <div class="fa-step5-detailed-report space-y-8">
    <!-- 1. 化简 DFA 状态子集 (P Sets) -->
    <div class="result-card bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Icon icon="lucide:layers" class="w-5 h-5 text-red-600" />
              最小化：DFA 状态分区 (P Sets)
            </h3>
            <p class="text-xs text-gray-500 mt-1">基于集合匹配的智能对比：我们将用户填写的子集与标准答案进行匹配</p>
          </div>
          <div class="flex gap-4 text-xs">
            <div class="flex items-center gap-1.5"><span class="w-3 h-3 bg-green-500 rounded-full"></span> 匹配正确</div>
            <div class="flex items-center gap-1.5"><span class="w-3 h-3 bg-red-500 rounded-full"></span> 匹配错误/多余</div>
            <div class="flex items-center gap-1.5"><span class="w-3 h-3 bg-gray-300 rounded-full"></span> 未匹配到</div>
          </div>
        </div>
      </div>
      
      <div class="p-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- 左侧：标准答案匹配情况 -->
          <div class="space-y-4">
            <h4 class="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2 mb-4">
              <Icon icon="lucide:check-square" class="w-4 h-4" />
              标准分区对照表
            </h4>
            <div v-for="item in analyzedPSets.matched" :key="item.id" class="p-4 border rounded-xl transition-all" :class="item.matches.length > 0 ? 'border-green-100 bg-green-50/20' : 'border-gray-200 bg-gray-50/50'">
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-center gap-2">
                  <span class="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded">SET {{ item.id }}</span>
                  <span class="text-xs font-bold text-blue-800">标准答案：</span>
                </div>
                <div v-if="item.matches.length > 0" class="text-[10px] font-bold text-green-600 flex items-center gap-1">
                   <Icon icon="lucide:check-circle" class="w-3 h-3" /> 已找回 {{ item.matches.length }} 个匹配
                </div>
                <div v-else class="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                   <Icon icon="lucide:alert-circle" class="w-3 h-3" /> 深度缺失
                </div>
              </div>
              <div class="p-3 bg-white border border-blue-100 rounded-lg text-sm font-mono font-bold text-blue-900 mb-3 shadow-sm">
                {{ Array.isArray(item.original) ? item.original.join(' ') : item.original }}
              </div>
              
              <!-- 匹配到的用户填写 -->
              <div v-if="item.matches.length > 0" class="space-y-2">
                 <div class="text-[10px] text-gray-400 uppercase font-bold px-1">我的匹配填写：</div>
                 <div v-for="match in item.matches" :key="match.id" class="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-md text-xs font-mono text-green-900">
                    <Icon icon="lucide:user" class="w-3 h-3 text-green-600" />
                    {{ match.text }}
                    <span v-if="item.matches.length > 1" class="ml-auto text-[9px] bg-green-200 text-green-700 px-1 rounded">重复项</span>
                 </div>
              </div>
            </div>
          </div>

          <!-- 右侧：错误、多余及历史轨迹 -->
          <div class="space-y-6">
            <!-- 1. 明显的错误填写 -->
            <div class="error-group">
              <h4 class="text-sm font-bold text-red-600 uppercase tracking-wider flex items-center gap-2 mb-4">
                <Icon icon="lucide:x-octagon" class="w-4 h-4" />
                错误或多余的填写
              </h4>
              <div v-if="analyzedPSets.wrong.length > 0" class="space-y-3">
                <div v-for="wrong in analyzedPSets.wrong" :key="wrong.id" class="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
                  <div class="text-sm font-mono font-bold text-red-900">{{ wrong.text }}</div>
                  <div class="text-[10px] font-bold text-red-500 uppercase flex items-center gap-1 px-2 py-1 bg-red-100/50 rounded">
                    <Icon icon="lucide:shield-alert" class="w-3 h-3" /> 无效集合
                  </div>
                </div>
              </div>
              <div v-else class="py-10 text-center border-2 border-dashed border-gray-100 rounded-xl text-gray-300">
                <Icon icon="lucide:smile" class="w-8 h-8 mx-auto mb-2 opacity-20" />
                <p class="text-xs">暂无未匹配的错误填写</p>
              </div>
            </div>

            <!-- 2. 全局历史错误追溯 (P-Sets) -->
            <div class="history-group">
              <h4 class="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2 mb-4">
                <Icon icon="lucide:history" class="w-4 h-4" />
                所有 P-Sets 历史错误记录
              </h4>
              <div v-if="pSetHistoryErrors.length > 0" class="flex flex-wrap gap-2 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                <span 
                  v-for="(err, idx) in pSetHistoryErrors" 
                  :key="idx"
                  class="px-2 py-1 bg-white border border-gray-200 text-gray-400 rounded text-[10px] font-mono line-through opacity-60 hover:opacity-100 transition-opacity"
                >
                  {{ err }}
                </span>
              </div>
              <div v-else class="text-center py-6 text-gray-300 text-xs italic">
                无历史轨迹
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. 最小化 DFA 状态转换矩阵 -->
    <div class="result-card bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <!-- ... 这里保持原有的矩阵渲染逻辑 ... -->
      <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Icon icon="lucide:grid-3x3" class="w-5 h-5 text-red-600" />
          最小化：DFA 状态转换矩阵
        </h3>
        <p class="text-xs text-gray-500 mt-1">最小化后的状态映射情况</p>
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
                    <div class="text-sm font-mono font-bold text-blue-900">{{ getStandardValue(col, rowIdx - 1) }}</div>
                  </div>

                  <!-- 用户答案 -->
                  <div 
                    class="answer-item p-2 rounded border transition-all"
                    :class="getUserMatrixStatus(col, rowIdx - 1) === 'correct' 
                      ? 'bg-green-50 border-green-200 shadow-sm' 
                      : (getUserMatrixStatus(col, rowIdx - 1) === 'wrong' ? 'bg-red-50 border-red-200 shadow-sm' : 'bg-gray-50 border-gray-100')"
                  >
                    <div class="flex items-center justify-between mb-1">
                      <div class="text-[10px] font-bold uppercase tracking-wider" :class="getUserMatrixStatus(col, rowIdx - 1) === 'correct' ? 'text-green-600' : (getUserMatrixStatus(col, rowIdx - 1) === 'wrong' ? 'text-red-600' : 'text-gray-400')">
                        我的最终答案
                      </div>
                      <Icon 
                        v-if="getUserMatrixStatus(col, rowIdx - 1) === 'correct'" 
                        icon="lucide:check-circle" 
                        class="w-3 h-3 text-green-600" 
                      />
                      <Icon 
                        v-else-if="getUserMatrixStatus(col, rowIdx - 1) === 'wrong'" 
                        icon="lucide:x-circle" 
                        class="w-3 h-3 text-red-600" 
                      />
                    </div>
                    <div class="text-sm font-mono font-bold" :class="getUserMatrixStatus(col, rowIdx - 1) === 'correct' ? 'text-green-900' : (getUserMatrixStatus(col, rowIdx - 1) === 'wrong' ? 'text-red-900' : 'text-gray-400')">
                      {{ getUserMatrixValue(col, rowIdx - 1) || '(空)' }}
                    </div>
                  </div>

                   <!-- 历史错误记录 -->
                   <div v-if="getMatrixErrors(col, rowIdx - 1).length > 0" class="mt-1">
                    <div class="text-[9px] text-gray-400 font-bold uppercase mb-1">历史错误尝试</div>
                    <div class="flex flex-wrap gap-1">
                      <span 
                        v-for="(err, eIdx) in getMatrixErrors(col, rowIdx - 1)" 
                        :key="eIdx"
                        class="px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px] font-mono line-through opacity-70"
                      >
                        {{ err }}
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

// --- 1. P Sets 处理 (核心逻辑改动) ---
const analyzedPSets = computed(() => {
  const standardList = (props.standardData.P || []).map((s, idx) => ({
    id: idx,
    original: s,
    normalized: (Array.isArray(s) ? s : [s]).map(String).sort().join(' '),
    matches: [] as any[]
  }))

  const userList = props.userData.userPSets || []
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

// 全局 P-Sets 历史错误 (不分行，因为用户行数不固定)
const pSetHistoryErrors = computed(() => {
  return props.errorLogs
    .filter(log => log.step === 'step5' && log.tableType === 'pSets')
    .map(log => log.wrongValue)
    .filter((v, i, a) => a.indexOf(v) === i)
})

// --- 2. 矩阵处理 ---
const matrixCols = computed(() => {
  if (!props.standardData.table_to_num_min) return []
  return Object.keys(props.standardData.table_to_num_min).sort((a,b) => {
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
  const cell = props.userData.userMinimizedMatrix?.find(c => c.rowIndex === row && c.colIndex === colIdx)
  return cell?.value || ''
}

const getUserMatrixStatus = (col: string, rowIdx: number) => {
  const userVal = getUserMatrixValue(col, rowIdx)
  const stdVal = getStandardValue(col, rowIdx)
  if (!userVal) return 'none'
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
