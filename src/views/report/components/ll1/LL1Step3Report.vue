<template>
  <div class="ll1-step3-report space-y-8">
    <!-- 步骤3标题 -->
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 rounded-full bg-pink-600 text-white flex items-center justify-center font-bold">3</div>
      <h2 class="text-xl font-bold text-gray-900">步骤 3：构造LL1预测分析表</h2>
    </div>

    <!-- 预测分析表卡片 -->
    <div class="result-card bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden print:shadow-none print:border print:border-gray-300">
      <div class="px-6 py-4 bg-gray-50 border-b border-gray-200 print:px-2 print:py-1 print:bg-gray-100">
        <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2 print:text-sm">
          <Icon icon="lucide:table" class="w-5 h-5 text-pink-600 print:w-4 print:h-4" />
          LL1 预测分析表
        </h3>
        <p class="text-xs text-gray-500 mt-1 print:hidden">根据First集和Follow集构造预测分析表</p>
      </div>

      <div class="p-4 overflow-x-auto print:p-1">
        <div v-if="!hasData" class="text-center py-8 text-gray-400">
          <Icon icon="lucide:alert-circle" class="w-12 h-12 mx-auto mb-4" />
          <p class="text-lg">数据不足，无法展示分析表</p>
          <p class="text-sm mt-2">请确保已完成步骤3的答题</p>
        </div>

        <div v-else>
          <table class="min-w-full border-collapse border-2 border-gray-400">
            <thead>
              <tr class="bg-gray-100">
                <th class="border border-gray-400 px-3 py-2 text-sm font-semibold text-gray-700 text-center w-24 sticky left-0 z-10 bg-gray-100">
                  VN \ VT
                </th>
                <th
                  v-for="vt in colHeaders"
                  :key="vt"
                  class="border border-gray-400 px-3 py-2 text-sm font-semibold text-gray-700 text-center"
                >
                  {{ vt }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white">
              <tr v-for="vn in rowHeaders" :key="vn" :class="(rowHeaders.indexOf(vn) % 2 === 0) ? 'bg-white' : 'bg-gray-50/50'">
                <td class="border border-gray-400 px-3 py-2 text-center font-mono font-bold text-gray-900 sticky left-0 z-10 bg-inherit">
                  {{ vn }}
                </td>
                <td
                  v-for="vt in colHeaders"
                  :key="`${vn}|${vt}`"
                  class="border border-gray-400 p-2 align-top"
                >
                  <div class="flex flex-col gap-1.5">
                    <!-- 历史错误记录 -->
                    <div v-if="getErrorHistory(vn, vt).length > 0" class="flex flex-wrap gap-1">
                      <span
                        v-for="(err, eIdx) in getErrorHistory(vn, vt)"
                        :key="eIdx"
                        class="px-1.5 py-0.5 bg-red-50 text-red-500 rounded text-xs font-mono line-through opacity-70 border border-red-200"
                        :title="err.hint || `历史错误 ${eIdx + 1}`"
                      >
                        {{ formatProduction(vn, err.value) }}
                      </span>
                    </div>

                    <!-- 单元格内容 -->
                    <template v-if="shouldBeEmpty(vn, vt)">
                      <!-- 应该为空 -->
                      <div
                        v-if="getUserValue(vn, vt)"
                        class="answer-item px-2 py-1.5 rounded border bg-red-50 border-red-200 shadow-sm flex items-center justify-between gap-2"
                      >
                        <div class="text-sm font-mono font-bold text-red-900">
                          {{ formatProduction(vn, getUserValue(vn, vt)) }}
                        </div>
                        <Icon icon="lucide:x-circle" class="w-4 h-4 text-red-600 flex-shrink-0" />
                      </div>
                      <div v-else class="text-gray-300 text-center py-2">-</div>
                    </template>

                    <template v-else>
                      <!-- 应该填写 -->
                      <!-- 用户回答正确 -->
                      <div
                        v-if="isCorrect(vn, vt)"
                        class="answer-item px-2 py-1.5 rounded border bg-green-50 border-green-200 shadow-sm flex items-center justify-between gap-2"
                      >
                        <div class="text-sm font-mono font-bold text-green-900">
                          {{ formatProduction(vn, getUserValue(vn, vt)) }}
                        </div>
                        <Icon icon="lucide:check-circle" class="w-4 h-4 text-green-600 flex-shrink-0" />
                      </div>

                      <!-- 用户回答错误或未填写 -->
                      <div v-else class="flex flex-col gap-1.5">
                        <!-- 用户答案（错误时显示） -->
                        <div
                          v-if="getUserValue(vn, vt)"
                          class="answer-item px-2 py-1.5 rounded border bg-red-50 border-red-200 shadow-sm flex items-center justify-between gap-2"
                        >
                          <div class="text-sm font-mono font-bold text-red-900 line-through">
                            {{ formatProduction(vn, getUserValue(vn, vt)) }}
                          </div>
                          <Icon icon="lucide:x-circle" class="w-4 h-4 text-red-600 flex-shrink-0" />
                        </div>

                        <!-- 未填写提示 -->
                        <div v-else class="text-red-400 text-xs italic py-1 text-center">(未填写)</div>

                        <!-- 标准答案 -->
                        <div class="answer-item px-2 py-1.5 bg-blue-50 border border-blue-100 rounded flex items-center gap-2">
                          <Icon icon="lucide:book-open" class="w-4 h-4 text-blue-500 flex-shrink-0" />
                          <div class="text-sm font-mono font-bold text-blue-900">
                            {{ formatProduction(vn, getCorrectValue(vn, vt)) }}
                          </div>
                        </div>
                      </div>
                    </template>
                  </div>

                  <!-- 错误提示 -->
                  <div v-if="getHint(vn, vt)" class="mt-1 text-xs text-red-500 bg-red-50 px-2 py-1 rounded border border-red-100">
                    <Icon icon="lucide:alert-triangle" class="w-3 h-3 inline mr-1" />
                    {{ getHint(vn, vt) }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 颜色说明 -->
        <div class="mt-4 flex gap-4 text-xs print:mt-2 print:gap-2 print:text-[10px]">
          <div class="flex items-center gap-1"><span class="w-3 h-3 bg-green-500 rounded-full print:w-2 print:h-2"></span> 回答正确</div>
          <div class="flex items-center gap-1"><span class="w-3 h-3 bg-red-500 rounded-full print:w-2 print:h-2"></span> 回答错误</div>
          <div class="flex items-center gap-1"><span class="w-3 h-3 bg-blue-500 rounded-full print:w-2 print:h-2"></span> 标准答案</div>
          <div class="flex items-center gap-1"><span class="w-3 h-3 bg-red-300 rounded-full print:w-2 print:h-2"></span> 历史错误</div>
          <div class="flex items-center gap-1"><span class="w-3 h-3 bg-gray-300 rounded-full print:w-2 print:h-2"></span> 无需填写</div>
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
.answer-item {
  transition: all 0.2s ease;
}
.ll1-step3-report :deep(table) {
  table-layout: fixed;
}
</style>
