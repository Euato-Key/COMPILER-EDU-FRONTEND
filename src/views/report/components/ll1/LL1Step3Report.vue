<template>
  <div class="ll1-step3-report">
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="px-6 py-4 bg-pink-50 border-b border-pink-100 flex items-center justify-between">
        <h3 class="text-lg font-bold text-pink-900 flex items-center gap-2">
          <Icon icon="lucide:table" class="w-5 h-5 text-pink-600" />
          LL1 预测分析表构造分析
        </h3>
        <span class="text-xs font-medium px-2 py-1 bg-white text-pink-600 rounded-lg border border-pink-100">Step 3</span>
      </div>

      <div class="p-6">
        <!-- 调试信息（开发时可用） -->
        <!-- <div class="mb-4 p-2 bg-gray-100 text-xs">
          <div>step3Data: {{ step3Data }}</div>
          <div>originalData.table: {{ originalData?.table }}</div>
          <div>errorLogs: {{ errorLogs?.length }}</div>
        </div> -->

        <div v-if="!hasData" class="text-center py-8 text-gray-400">
           <Icon icon="lucide:alert-circle" class="w-12 h-12 mx-auto mb-4" />
           <p class="text-lg">数据不足，无法展示分析表</p>
           <p class="text-sm mt-2">请确保已完成步骤3的答题</p>
        </div>
        <div v-else>
          <table class="w-full divide-y divide-gray-200 border">
            <thead>
              <tr class="bg-gray-50">
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border bg-gray-50 sticky left-0 z-10 w-24">
                  VN \ VT
                </th>
                <th 
                  v-for="vt in colHeaders" 
                  :key="vt" 
                  class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border"
                >
                  {{ vt }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="vn in rowHeaders" :key="vn">
                <td class="px-4 py-3 whitespace-nowrap font-mono font-bold text-gray-900 border bg-gray-50 sticky left-0 z-10">
                  {{ vn }}
                </td>
                <td 
                  v-for="vt in colHeaders" 
                  :key="`${vn}|${vt}`" 
                  class="px-3 py-3 text-center border relative group"
                  :class="getCellClass(vn, vt)"
                >
                  <div class="flex flex-col items-center gap-1 text-xs">
                     <!-- Historical Errors with Hints -->
                     <template v-if="getErrorHistory(vn, vt).length > 0">
                         <div 
                           v-for="(err, eIdx) in getErrorHistory(vn, vt)" 
                           :key="`err-${eIdx}`" 
                           class="relative group/err mb-0.5"
                         >
                            <span class="text-red-400 bg-red-50/50 px-2 py-0.5 rounded text-[10px] line-through decoration-red-300 border border-red-100 cursor-help block">
                                {{ err.value }}
                            </span>
                            <!-- Historical Hint Tooltip -->
                            <div v-if="err.hint" class="absolute z-30 top-full left-1/2 transform -translate-x-1/2 mt-1 w-48 p-2 bg-gray-700 text-white text-[10px] rounded shadow-xl opacity-0 invisible group-hover/err:opacity-100 group-hover/err:visible transition-all duration-200 pointer-events-none text-left">
                                <div class="font-bold mb-1 border-b border-gray-500 pb-0.5">历史错误提示</div>
                                <div class="whitespace-pre-wrap">{{ err.hint }}</div>
                                <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-gray-700"></div>
                            </div>
                         </div>
                     </template>

                     <!-- Cell Content -->
                     <template v-if="shouldBeEmpty(vn, vt)">
                         <!-- Should be empty -->
                         <span v-if="getUserValue(vn, vt)" class="text-red-600 bg-red-50 px-2 py-0.5 rounded cursor-help border border-red-200">
                             {{ formatProduction(vn, getUserValue(vn, vt)) }} <span class="text-[10px]">(多余)</span>
                         </span>
                         <span v-else class="text-gray-300">-</span>
                     </template>
                     <template v-else>
                         <!-- Should be filled -->
                         <!-- User correct -->
                         <div v-if="isCorrect(vn, vt)" 
                              class="relative w-full overflow-visible"
                              :class="getErrorHistory(vn, vt).length > 0 ? 'mt-1' : ''"
                         >
                            <div class="text-green-700 bg-green-50 px-2 py-1 rounded w-full font-mono border border-green-200 flex flex-col items-center">
                                {{ formatProduction(vn, getUserValue(vn, vt)) }}
                                <span v-if="getErrorHistory(vn, vt).length > 0" class="text-[8px] bg-green-100 px-1 rounded mt-0.5 text-green-600">已修正</span>
                            </div>
                         </div>
                         <div v-else class="w-full flex flex-col gap-1 cursor-help">
                             <!-- User wrong or empty -->
                             <div v-if="getUserValue(vn, vt)" class="text-red-700 bg-red-50 px-2 py-1 rounded w-full font-mono line-through decoration-red-400 border border-red-200">
                                 {{ formatProduction(vn, getUserValue(vn, vt)) }}
                             </div>
                             <div v-else class="text-red-400 text-xs italic py-1">
                                 (未填写)
                             </div>
                             <!-- Correct Answer (shown when wrong or empty) -->
                             <div class="text-green-600 font-mono text-[10px] border border-green-200 bg-green-50/30 rounded px-1 py-0.5">
                                 标准答案: {{ formatProduction(vn, getCorrectValue(vn, vt)) }}
                             </div>
                         </div>
                     </template>
                  </div>
                  
                  <!-- Hint Tooltip -->
                  <div v-if="getHint(vn, vt)" class="absolute z-20 top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none text-left">
                     <div class="font-bold mb-1 border-b border-gray-600 pb-1">错误提示</div>
                     <div class="whitespace-pre-wrap">{{ getHint(vn, vt) }}</div>
                     <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-gray-800"></div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="mt-4 flex items-center gap-6 text-sm text-gray-500 justify-end">
            <div class="flex items-center gap-2">
                <span class="w-3 h-3 bg-green-50 border border-green-200 rounded"></span>
                <span>回答正确</span>
            </div>
            <div class="flex items-center gap-2">
                <span class="w-3 h-3 bg-red-50 border border-red-200 rounded"></span>
                <span>回答错误</span>
            </div>
             <div class="flex items-center gap-2">
                <span class="w-3 h-3 border border-gray-200 bg-white rounded flex items-center justify-center text-[8px] text-gray-300">-</span>
                <span>无需填写</span>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import type { LL1ErrorLog } from '@/stores/ll1-new'

interface Props {
  step3Data?: {
    userTable: Record<string, string>
  }
  originalData?: {
    Vn: string[]
    Vt: string[]
    table: Record<string, string>
  }
  errorLogs?: LL1ErrorLog[]
}

const props = defineProps<Props>()

// 检查是否有数据
const hasData = computed(() => {
  const hasOriginal = props.originalData && (props.originalData.Vn?.length > 0 || Object.keys(props.originalData.table || {}).length > 0)
  const hasStep3 = props.step3Data && Object.keys(props.step3Data.userTable || {}).length > 0
  return hasOriginal || hasStep3
})

// 行标题（非终结符）
const rowHeaders = computed(() => {
  if (!props.originalData?.Vn?.length) return []
  return props.originalData.Vn
})

// 列标题（终结符），排除 ε，添加 #
const colHeaders = computed(() => {
  if (!props.originalData?.Vt?.length) return []
  const sortedVt = [...props.originalData.Vt]
    .filter(t => t !== 'ε')
    .sort()
  return [...sortedVt, '#']
})

// 获取单元格键（使用 | 分隔，与答题页面一致）
function getCellKey(vn: string, vt: string): string {
  return `${vn}|${vt}`
}

// 格式化产生式显示（与答题页面一致）
function formatProduction(nonTerminal: string, value: string): string {
  if (!value) return ''
  // 如果已经包含 ->，直接返回
  if (value.includes('->')) return value
  // 否则拼接成完整格式
  return `${nonTerminal}->${value}`
}

// 获取用户输入值
function getUserValue(vn: string, vt: string): string {
  const key = getCellKey(vn, vt)
  return props.step3Data?.userTable?.[key] || ''
}

// 获取正确答案（从 originalData.table 中获取原始值）
function getCorrectValue(vn: string, vt: string): string {
  const key = getCellKey(vn, vt)
  return props.originalData?.table?.[key] || ''
}

// 获取格式化后的正确答案（用于比较）
function getFormattedCorrectValue(vn: string, vt: string): string {
  const rawValue = getCorrectValue(vn, vt)
  return formatProduction(vn, rawValue)
}

// 检查单元格是否应该为空
function shouldBeEmpty(vn: string, vt: string): boolean {
  return !getCorrectValue(vn, vt)
}

// 检查用户答案是否正确
function isCorrect(vn: string, vt: string): boolean {
  const userVal = getUserValue(vn, vt)
  const correctVal = getFormattedCorrectValue(vn, vt)
  return userVal === correctVal
}

// 获取单元格样式类
function getCellClass(vn: string, vt: string): string {
  if (shouldBeEmpty(vn, vt)) {
    return getUserValue(vn, vt) ? 'bg-red-50/30' : ''
  }
  
  if (isCorrect(vn, vt)) {
    return 'bg-green-50/30'
  }
  
  return 'bg-red-50/30'
}

// 获取错误提示
function getHint(vn: string, vt: string): string | null {
  if (!props.errorLogs) return null
  
  const logs = props.errorLogs.filter(log => 
    log.step === 'step3' && 
    log.type === 'parsingTable' && 
    log.location?.row === vn &&
    log.location?.col === vt &&
    log.hint
  )
  
  if (logs.length === 0) return null
  return logs[logs.length - 1].hint ?? null
}

// 获取错误历史
function getErrorHistory(vn: string, vt: string): { value: string, hint: string | undefined }[] {
  if (!props.errorLogs) return []
  
  const logs = props.errorLogs.filter(log => 
    log.step === 'step3' && 
    log.type === 'parsingTable' && 
    log.location?.row === vn && 
    log.location?.col === vt
  )
  
  // 结果数组，保留顺序
  const history: { value: string, hint: string | undefined }[] = []
  const valuesSeen = new Set<string>()
  
  // 日志按时间顺序排列
  logs.forEach(log => {
    const val = log.wrongValue?.trim() || ''
    // 显示所有历史错误，包括重复的（用时间戳区分）
    if (val !== '') {
      history.push({
        value: val,
        hint: log.hint
      })
    }
  })
  
  return history
}
</script>

<style scoped>
/* Table styles */
</style>
