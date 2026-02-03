<template>
  <div class="fa-table-report space-y-8">
    <div v-for="section in tableSections" :key="section.key" class="table-section-card bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Icon :icon="section.icon" class="w-5 h-5 text-blue-600" />
          {{ section.title }}
        </h3>
      </div>

      <div class="p-6">
        <div v-if="hasData(section.key)" class="overflow-x-auto">
          <!-- Step 3: Conversion Table -->
          <table v-if="section.key === 'conversionTable'" class="min-w-full divide-y divide-gray-200 border">
            <thead>
              <tr class="bg-gray-50">
                <th v-for="col in conversionTableCols" :key="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                  {{ col }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="rowIdx in conversionTableRowCount" :key="rowIdx">
                <td v-for="col in conversionTableCols" :key="col" class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border font-mono">
                  {{ getCellValue('conversionTable', col, rowIdx - 1) }}
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Step 3: Transition Matrix -->
          <table v-else-if="section.key === 'transitionMatrix'" class="min-w-full divide-y divide-gray-200 border">
            <thead>
              <tr class="bg-gray-50">
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">DFA 状态</th>
                <th v-for="symbol in symbols" :key="symbol" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                  {{ symbol }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(row, dfaState) in userTransitionMatrix" :key="dfaState">
                <td class="px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-700 bg-gray-50 border">
                  {{ dfaState }}
                </td>
                <td v-for="symbol in symbols" :key="symbol" class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border font-mono text-center">
                  {{ row[symbol] || '-' }}
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Step 5: P Sets -->
          <div v-else-if="section.key === 'pSets'" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div v-for="p in userPSets" :key="p.id" class="p-3 bg-gray-50 border rounded-lg flex items-center gap-3">
              <span class="text-xs font-bold text-gray-400">#{{ p.id.split('p_list')[1] }}</span>
              <span class="text-sm font-mono text-gray-800">{{ p.text }}</span>
            </div>
          </div>

          <!-- Step 5: Minimized Matrix -->
          <table v-else-if="section.key === 'minimizedMatrix'" class="min-w-full divide-y divide-gray-200 border">
            <thead>
              <tr class="bg-gray-50">
                <th v-for="header in minimizedMatrixHeaders" :key="header" class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">
                  {{ header }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="rowIdx in minimizedMatrixRows" :key="rowIdx">
                <td v-for="colIdx in minimizedMatrixCols" :key="colIdx" class="px-4 py-3 whitespace-nowrap text-sm border text-center font-mono" :class="colIdx === 0 ? 'bg-gray-50 font-bold text-gray-700' : 'text-gray-900'">
                  {{ getMinimizedCellValue(rowIdx - 1, colIdx) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="py-6 text-center text-gray-400">
          <p class="text-sm">暂无该步骤的答题记录</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

interface Props {
  step3Data?: {
    userConversionTable: Record<string, string[]>
    userTransitionMatrix: Record<string, Record<string, string>>
    conversionTableRowCount: number
  }
  step5Data?: {
    userPSets: Array<{ id: string; text: string }>
    userMinimizedMatrix: Array<{ value: string; rowIndex: number; colIndex: number; isRowHeader?: boolean }>
  }
}

const props = defineProps<Props>()

const tableSections = [
  { key: 'conversionTable', title: '子集构造：状态转换表 (NFA -> DFA)', icon: 'lucide:split' },
  { key: 'transitionMatrix', title: '子集构造：DFA 状态转移矩阵', icon: 'lucide:grid-3x3' },
  { key: 'pSets', title: 'DFA 最小化：状态等价类集合', icon: 'lucide:layers' },
  { key: 'minimizedMatrix', title: 'DFA 最小化：最小化 DFA 状态转移矩阵', icon: 'lucide:grid-2x2' }
]

const hasData = (key: string) => {
  if (key === 'conversionTable') return !!props.step3Data?.userConversionTable
  if (key === 'transitionMatrix') return !!props.step3Data?.userTransitionMatrix
  if (key === 'pSets') return !!props.step5Data?.userPSets?.length
  if (key === 'minimizedMatrix') return !!props.step5Data?.userMinimizedMatrix?.length
  return false
}

// Step 3 辅助
const conversionTableCols = computed(() => {
  if (!props.step3Data?.userConversionTable) return []
  return Object.keys(props.step3Data.userConversionTable).sort((a,b) => {
    if(a === 'S') return -1;
    if(b === 'S') return 1;
    return a.localeCompare(b);
  })
})

const conversionTableRowCount = computed(() => props.step3Data?.conversionTableRowCount || 0)

const getCellValue = (type: string, col: string, rowIdx: number) => {
  if (type === 'conversionTable') {
    return props.step3Data?.userConversionTable[col]?.[rowIdx] || '-'
  }
  return '-'
}

const userTransitionMatrix = computed(() => props.step3Data?.userTransitionMatrix || {})
const symbols = computed(() => {
  const rows = Object.values(userTransitionMatrix.value)
  if (rows.length === 0) return []
  return Object.keys(rows[0]).sort()
})

// Step 5 辅助
const userPSets = computed(() => props.step5Data?.userPSets || [])

const userMinimizedMatrix = computed(() => props.step5Data?.userMinimizedMatrix || [])
const minimizedMatrixRows = computed(() => {
  if (userMinimizedMatrix.value.length === 0) return 0
  return Math.max(...userMinimizedMatrix.value.map(c => c.rowIndex)) + 1
})
const minimizedMatrixCols = computed(() => {
  if (userMinimizedMatrix.value.length === 0) return 0
  return Math.max(...userMinimizedMatrix.value.map(c => c.colIndex)) + 1
})

const minimizedMatrixHeaders = computed(() => {
  // 假设第一行是 Header
  const headers: string[] = []
  for (let j = 0; j < minimizedMatrixCols.value; j++) {
    const cell = userMinimizedMatrix.value.find(c => c.rowIndex === 0 && c.colIndex === j)
    headers.push(cell?.value || '')
  }
  return headers
})

// 我们在渲染tbody时跳过第一行(Index 0)
const getMinimizedCellValue = (rowIdx: number, colIdx: number) => {
  const cell = userMinimizedMatrix.value.find(c => c.rowIndex === rowIdx && c.colIndex === colIdx)
  return cell?.value || '-'
}
</script>

<style scoped>
.table-section-card {
  transition: all 0.3s ease;
}
</style>
