<template>
  <div class="ll1-step2-report space-y-8">
    <!-- 步骤2标题 -->
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">2</div>
      <h2 class="text-xl font-bold text-gray-900">步骤 2：求First集和Follow集</h2>
    </div>

    <!-- 左右布局的表格 -->
    <div class="grid grid-cols-1 xl:grid-cols-2 print:grid-cols-2 gap-4 print:gap-2">
      <!-- 1. First集合 -->
      <div class="result-card bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden print:shadow-none print:border print:border-gray-300">
        <div class="px-6 py-4 bg-gray-50 border-b border-gray-200 print:px-2 print:py-1 print:bg-gray-100">
          <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2 print:text-sm">
            <Icon icon="lucide:list-start" class="w-5 h-5 text-indigo-600 print:w-4 print:h-4" />
            First 集合
          </h3>
          <p class="text-xs text-gray-500 mt-1 print:hidden">计算每个非终结符的First集合</p>
        </div>
        <div class="p-4 overflow-x-auto print:p-1">
          <table class="min-w-full border-collapse border-2 border-gray-400">
            <thead>
              <tr class="bg-gray-100">
                <th class="border border-gray-400 px-3 py-2 text-sm font-semibold text-gray-700 text-center w-24">非终结符</th>
                <th class="border border-gray-400 px-3 py-2 text-sm font-semibold text-gray-700 text-center">First集合</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="vn in nonTerminals" :key="`first-${vn}`" :class="(nonTerminals.indexOf(vn) % 2 === 0) ? 'bg-white' : 'bg-gray-50/50'">
                <td class="border border-gray-400 px-3 py-2 text-center font-mono font-bold text-gray-900">
                  {{ vn }}
                </td>
                <td class="border border-gray-400 p-2">
                  <div class="flex flex-col gap-2">
                    <!-- 用户答案 -->
                    <div
                      class="answer-item px-2 py-1.5 rounded border transition-all flex items-center justify-between gap-2"
                      :class="getUserAnswerStatus(vn, 'firstSet') === 'correct'
                        ? 'bg-green-50 border-green-200 shadow-sm'
                        : (getUserAnswerStatus(vn, 'firstSet') === 'wrong' ? 'bg-red-50 border-red-200 shadow-sm' : 'bg-gray-50 border-gray-100')"
                    >
                      <div class="text-sm font-mono font-bold" :class="getUserAnswerStatus(vn, 'firstSet') === 'correct' ? 'text-green-900' : (getUserAnswerStatus(vn, 'firstSet') === 'wrong' ? 'text-red-900' : 'text-gray-400')">
                        First({{ vn }}) = {{ formatAsSet(getUserFirstSet(vn)) }}
                      </div>
                      <Icon
                        v-if="getUserAnswerStatus(vn, 'firstSet') === 'correct'"
                        icon="lucide:check-circle"
                        class="w-4 h-4 text-green-600 flex-shrink-0"
                      />
                      <Icon
                        v-else-if="getUserAnswerStatus(vn, 'firstSet') === 'wrong'"
                        icon="lucide:x-circle"
                        class="w-4 h-4 text-red-600 flex-shrink-0"
                      />
                    </div>

                    <!-- 标准答案（仅当用户答错时显示） -->
                    <div v-if="getUserAnswerStatus(vn, 'firstSet') === 'wrong'" class="answer-item px-2 py-1.5 bg-blue-50 border border-blue-100 rounded flex items-center gap-2">
                      <Icon icon="lucide:book-open" class="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <div class="text-sm font-mono font-bold text-blue-900">First({{ vn }}) = {{ formatAsSet(getCorrectFirstSet(vn)) }}</div>
                    </div>

                    <!-- 历史错误记录 -->
                    <div v-if="getErrorHistory(vn, 'firstSet').length > 0" class="flex flex-wrap gap-1">
                      <span
                        v-for="(err, eIdx) in getErrorHistory(vn, 'firstSet')"
                        :key="eIdx"
                        class="px-1.5 py-0.5 bg-red-50 text-red-500 rounded text-xs font-mono line-through opacity-70 border border-red-200"
                        :title="err.hint || `历史错误 ${eIdx + 1}`"
                      >
                        {{ formatAsSet(err.value) }}
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

      <!-- 2. Follow集合 -->
      <div class="result-card bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden print:shadow-none print:border print:border-gray-300">
        <div class="px-6 py-4 bg-gray-50 border-b border-gray-200 print:px-2 print:py-1 print:bg-gray-100">
          <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2 print:text-sm">
            <Icon icon="lucide:list-end" class="w-5 h-5 text-purple-600 print:w-4 print:h-4" />
            Follow 集合
          </h3>
          <p class="text-xs text-gray-500 mt-1 print:hidden">计算每个非终结符的Follow集合</p>
        </div>
        <div class="p-4 overflow-x-auto print:p-1">
          <table class="min-w-full border-collapse border-2 border-gray-400">
            <thead>
              <tr class="bg-gray-100">
                <th class="border border-gray-400 px-3 py-2 text-sm font-semibold text-gray-700 text-center w-24">非终结符</th>
                <th class="border border-gray-400 px-3 py-2 text-sm font-semibold text-gray-700 text-center">Follow集合</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="vn in nonTerminals" :key="`follow-${vn}`" :class="(nonTerminals.indexOf(vn) % 2 === 0) ? 'bg-white' : 'bg-gray-50/50'">
                <td class="border border-gray-400 px-3 py-2 text-center font-mono font-bold text-gray-900">
                  {{ vn }}
                </td>
                <td class="border border-gray-400 p-2">
                  <div class="flex flex-col gap-2">
                    <!-- 用户答案 -->
                    <div
                      class="answer-item px-2 py-1.5 rounded border transition-all flex items-center justify-between gap-2"
                      :class="getUserAnswerStatus(vn, 'followSet') === 'correct'
                        ? 'bg-green-50 border-green-200 shadow-sm'
                        : (getUserAnswerStatus(vn, 'followSet') === 'wrong' ? 'bg-red-50 border-red-200 shadow-sm' : 'bg-gray-50 border-gray-100')"
                    >
                      <div class="text-sm font-mono font-bold" :class="getUserAnswerStatus(vn, 'followSet') === 'correct' ? 'text-green-900' : (getUserAnswerStatus(vn, 'followSet') === 'wrong' ? 'text-red-900' : 'text-gray-400')">
                        Follow({{ vn }}) = {{ formatAsSet(getUserFollowSet(vn)) }}
                      </div>
                      <Icon
                        v-if="getUserAnswerStatus(vn, 'followSet') === 'correct'"
                        icon="lucide:check-circle"
                        class="w-4 h-4 text-green-600 flex-shrink-0"
                      />
                      <Icon
                        v-else-if="getUserAnswerStatus(vn, 'followSet') === 'wrong'"
                        icon="lucide:x-circle"
                        class="w-4 h-4 text-red-600 flex-shrink-0"
                      />
                    </div>

                    <!-- 标准答案（仅当用户答错时显示） -->
                    <div v-if="getUserAnswerStatus(vn, 'followSet') === 'wrong'" class="answer-item px-2 py-1.5 bg-blue-50 border border-blue-100 rounded flex items-center gap-2">
                      <Icon icon="lucide:book-open" class="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <div class="text-sm font-mono font-bold text-blue-900">Follow({{ vn }}) = {{ formatAsSet(getCorrectFollowSet(vn)) }}</div>
                    </div>

                    <!-- 历史错误记录 -->
                    <div v-if="getErrorHistory(vn, 'followSet').length > 0" class="flex flex-wrap gap-1">
                      <span
                        v-for="(err, eIdx) in getErrorHistory(vn, 'followSet')"
                        :key="eIdx"
                        class="px-1.5 py-0.5 bg-red-50 text-red-500 rounded text-xs font-mono line-through opacity-70 border border-red-200"
                        :title="err.hint || `历史错误 ${eIdx + 1}`"
                      >
                        {{ formatAsSet(err.value) }}
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
import type { LL1ErrorLog } from '@/stores'

interface Props {
  step2Data?: {
    userFirstSets: Record<string, string>
    userFollowSets: Record<string, string>
  }
  originalData?: {
    Vn: string[]
    first: Record<string, string[]>
    follow: Record<string, string[]>
  }
  errorLogs?: LL1ErrorLog[]
}

const props = defineProps<Props>()

const nonTerminals = computed(() => props.originalData?.Vn || [])

function getUserFirstSet(vn: string) {
  return props.step2Data?.userFirstSets?.[vn] || ''
}

function getCorrectFirstSet(vn: string) {
  return (props.originalData?.first?.[vn] || []).join(' ')
}

function getUserFollowSet(vn: string) {
  return props.step2Data?.userFollowSets?.[vn] || ''
}

function getCorrectFollowSet(vn: string) {
  return (props.originalData?.follow?.[vn] || []).join(' ')
}

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

// 状态集合比对 (忽略空格顺序)
const isStateSetMatch = (userVal: string, standardVal: string) => {
  if (!userVal || !standardVal) return userVal === standardVal
  const user = userVal.trim().split(/\s+/).filter(Boolean).sort().join(' ')
  const std = standardVal.trim().split(/\s+/).filter(Boolean).sort().join(' ')
  return user === std
}

// 检查值是否表示空/无
const isEmptyValue = (val: string): boolean => {
  return !val || val.trim() === '' || val.trim() === '-'
}

// 判断用户回答状态
const getUserAnswerStatus = (vn: string, type: 'firstSet' | 'followSet') => {
  const userVal = type === 'firstSet' ? getUserFirstSet(vn) : getUserFollowSet(vn)
  const stdVal = type === 'firstSet' ? getCorrectFirstSet(vn) : getCorrectFollowSet(vn)

  // 如果标准答案是空，用户填空或留空都算正确
  if (isEmptyValue(stdVal)) {
    return isEmptyValue(userVal) ? 'correct' : 'wrong'
  }

  // 如果标准答案有值，用户留空算未填写
  if (!userVal || userVal.trim() === '') return 'none'

  return isStateSetMatch(userVal, stdVal) ? 'correct' : 'wrong'
}

// 获取历史错误列表
const getErrorHistory = (vn: string, type: 'firstSet' | 'followSet') => {
  if (!props.errorLogs) return []
  const logs = props.errorLogs.filter(log =>
    log.step === 'step2' &&
    log.type === type &&
    log.location.row === vn
  )

  // 结果数组去重
  const history: { value: string, hint: string | undefined }[] = []
  const valuesSeen = new Set<string>()

  logs.forEach(log => {
    const val = log.wrongValue?.trim() || ''
    if (val !== '' && !valuesSeen.has(val)) {
      history.push({
        value: val,
        hint: log.hint
      })
      valuesSeen.add(val)
    }
  })

  const currentVal = type === 'firstSet' ? getUserFirstSet(vn) : getUserFollowSet(vn)
  return history.filter(h => h.value !== currentVal)
}
</script>

<style scoped>
.answer-item {
  transition: all 0.2s ease;
}
.ll1-step2-report :deep(table) {
  table-layout: fixed;
}
</style>
