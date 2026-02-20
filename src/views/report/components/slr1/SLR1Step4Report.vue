<template>
  <div class="slr1-step4-report space-y-6">
    <!-- 步骤4标题 -->
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 rounded-full bg-pink-600 text-white flex items-center justify-center font-bold">4</div>
      <h2 class="text-xl font-bold text-gray-900">步骤 4：构造 SLR1 分析表</h2>
    </div>

    <!-- SLR1分析表 -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 print:shadow-none print:border print:border-gray-300">
      <div class="px-6 py-4 bg-pink-50 border-b border-pink-100 flex items-center justify-between print:px-2 print:py-1 print:bg-pink-100">
        <h3 class="text-lg font-bold text-pink-900 flex items-center gap-2 print:text-sm">
          <Icon icon="lucide:table" class="w-5 h-5 text-pink-600 print:hidden" />
          SLR1 分析表
        </h3>
      </div>

      <div class="p-6 print:p-2">
        <!-- 统计信息 -->
        <div class="grid grid-cols-4 gap-4 mb-6 print:grid-cols-4 print:gap-2 print:mb-2">
          <div class="bg-blue-50 rounded-lg border border-blue-200 p-4 print:p-2">
            <div class="text-2xl font-bold text-blue-600 print:text-lg">{{ stateCount }}</div>
            <div class="text-sm text-blue-700 print:text-[10px]">状态数量</div>
          </div>
          <div class="bg-green-50 rounded-lg border border-green-200 p-4 print:p-2">
            <div class="text-2xl font-bold text-green-600 print:text-lg">{{ terminals.length }}</div>
            <div class="text-sm text-green-700 print:text-[10px]">终结符数量</div>
          </div>
          <div class="bg-purple-50 rounded-lg border border-purple-200 p-4 print:p-2">
            <div class="text-2xl font-bold text-purple-600 print:text-lg">{{ nonterminals.length }}</div>
            <div class="text-sm text-purple-700 print:text-[10px]">非终结符数量</div>
          </div>
          <div class="bg-orange-50 rounded-lg border border-orange-200 p-4 print:p-2">
            <div class="text-2xl font-bold text-orange-600 print:text-lg">{{ accuracy }}%</div>
            <div class="text-sm text-orange-700 print:text-[10px]">正确率</div>
          </div>
        </div>

        <!-- SLR1特性提示 -->
        <div v-if="isSLR1Grammar === false" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg print:hidden">
          <div class="flex items-start gap-3">
            <Icon icon="lucide:alert-triangle" class="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div class="text-sm text-red-700">
              <p class="font-medium mb-1">⚠️ 该文法不是 SLR1 文法</p>
              <p class="text-xs">检测到移进-规约冲突或规约-规约冲突，ACTION表中可能包含冲突标记。</p>
            </div>
          </div>
        </div>

        <!-- FOLLOW集展示 -->
        <div v-if="followSets && Object.keys(followSets).length > 0" class="mb-6 p-4 bg-cyan-50 border border-cyan-200 rounded-lg print:hidden">
          <div class="flex items-start gap-3">
            <Icon icon="lucide:book-open" class="w-5 h-5 text-cyan-500 mt-0.5 flex-shrink-0" />
            <div class="flex-1">
              <p class="font-medium text-cyan-800 mb-2">FOLLOW 集（用于 SLR1 规约动作）：</p>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div
                  v-for="(followSet, nonTerminal) in followSets"
                  :key="nonTerminal"
                  class="text-xs bg-white border border-cyan-200 rounded p-2"
                >
                  <span class="font-mono font-bold text-cyan-700">FOLLOW({{ nonTerminal }})</span>
                  <span class="text-cyan-600"> = { {{ followSet.join(', ') }} }</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 分析表对比 -->
        <div class="overflow-x-auto print:overflow-visible">
          <table class="min-w-full border border-gray-300 print:w-full print:table-fixed">
            <!-- 表头 -->
            <thead class="bg-gray-50">
              <tr>
                <th
                  rowspan="2"
                  class="px-3 py-2 border border-gray-300 text-xs font-medium text-gray-900 bg-gray-100"
                >
                  State
                </th>
                <th
                  :colspan="terminals.length + 1"
                  class="px-3 py-2 border border-gray-300 text-xs font-bold text-blue-900 bg-blue-100 text-center"
                >
                  ACTION
                </th>
                <th
                  :colspan="nonterminals.length"
                  class="px-3 py-2 border border-gray-300 text-xs font-bold text-green-900 bg-green-100 text-center"
                >
                  GOTO
                </th>
              </tr>
              <tr>
                <!-- ACTION列 -->
                <th
                  v-for="terminal in terminals"
                  :key="terminal"
                  class="px-3 py-2 border border-gray-300 text-xs font-medium text-gray-900 bg-blue-50"
                >
                  {{ terminal }}
                </th>
                <th
                  class="px-3 py-2 border border-gray-300 text-xs font-medium text-gray-900 bg-blue-50"
                >
                  #
                </th>
                <!-- GOTO列 -->
                <th
                  v-for="nonterminal in nonterminals"
                  :key="nonterminal"
                  class="px-3 py-2 border border-gray-300 text-xs font-medium text-gray-900 bg-green-50"
                >
                  {{ nonterminal }}
                </th>
              </tr>
            </thead>

            <!-- 表体 -->
            <tbody>
              <tr v-for="stateIndex in stateCount" :key="stateIndex - 1" class="hover:bg-gray-50">
                <td
                  class="px-3 py-2 border border-gray-300 text-xs font-bold bg-gray-50 text-center"
                >
                  {{ stateIndex - 1 }}
                </td>

                <!-- ACTION单元格 -->
                <td
                  v-for="terminal in [...terminals, '#']"
                  :key="`action-${stateIndex - 1}-${terminal}`"
                  class="px-2 py-1 border border-gray-300 text-xs"
                >
                  <div class="flex flex-col gap-1">
                    <!-- 历史错误记录 -->
                    <div v-if="getErrorHistory(stateIndex - 1, terminal, 'action').length > 0" class="mb-1">
                      <div class="flex flex-wrap gap-1">
                        <div
                          v-for="(err, eIdx) in getErrorHistory(stateIndex - 1, terminal, 'action')"
                          :key="`err-${eIdx}`"
                          class="relative group/err"
                        >
                          <span class="px-1.5 py-0.5 bg-red-50 text-red-600 rounded text-[10px] line-through decoration-red-400 border border-red-100 cursor-help block">
                            {{ err.value }}
                          </span>
                          <!-- Hint Tooltip -->
                          <div v-if="err.hint" class="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-1 w-48 p-2 bg-gray-700 text-white text-[10px] rounded shadow-xl opacity-0 invisible group-hover/err:opacity-100 group-hover/err:visible transition-all duration-200 pointer-events-none text-left">
                            <div class="font-bold mb-1 border-b border-gray-500 pb-0.5">历史错误</div>
                            <div class="whitespace-pre-wrap">{{ err.hint }}</div>
                            <div class="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-700"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- 单元格内容 - 参考LL1样式 -->
                    <template v-if="shouldBeEmpty(stateIndex - 1, terminal, 'action')">
                      <!-- 应该为空 -->
                      <div
                        v-if="getUserValue(stateIndex - 1, terminal, 'action')"
                        class="px-2 py-1.5 rounded border bg-red-50 border-red-200 shadow-sm flex items-center justify-between gap-2"
                      >
                        <div class="text-sm font-mono font-bold text-red-900">
                          {{ getUserValue(stateIndex - 1, terminal, 'action') }}
                        </div>
                        <Icon icon="lucide:x-circle" class="w-4 h-4 text-red-600 flex-shrink-0" />
                      </div>
                      <div v-else class="text-gray-300 text-center py-2">-</div>
                    </template>

                    <template v-else>
                      <!-- 应该填写 -->
                      <!-- 用户回答正确 - 只显示正确答案 -->
                      <div
                        v-if="getCellStatus(stateIndex - 1, terminal, 'action') === 'correct'"
                        class="px-2 py-1.5 rounded border bg-green-50 border-green-200 shadow-sm flex items-center justify-between gap-2"
                      >
                        <div class="text-sm font-mono font-bold text-green-900">
                          {{ getCorrectValue(stateIndex - 1, terminal, 'action') }}
                        </div>
                        <Icon icon="lucide:check-circle" class="w-4 h-4 text-green-600 flex-shrink-0" />
                      </div>

                      <!-- 用户回答错误或未填写 -->
                      <div v-else class="flex flex-col gap-1.5">
                        <!-- 用户答案（错误时显示） -->
                        <div
                          v-if="getUserValue(stateIndex - 1, terminal, 'action')"
                          class="px-2 py-1.5 rounded border bg-red-50 border-red-200 shadow-sm flex items-center justify-between gap-2"
                        >
                          <div class="text-sm font-mono font-bold text-red-900 line-through">
                            {{ getUserValue(stateIndex - 1, terminal, 'action') }}
                          </div>
                          <Icon icon="lucide:x-circle" class="w-4 h-4 text-red-600 flex-shrink-0" />
                        </div>

                        <!-- 未填写提示 -->
                        <div v-else class="text-red-400 text-xs italic py-1 text-center">(未填写)</div>

                        <!-- 标准答案 -->
                        <div class="px-2 py-1.5 bg-blue-50 border border-blue-100 rounded flex items-center gap-2">
                          <Icon icon="lucide:book-open" class="w-4 h-4 text-blue-500 flex-shrink-0" />
                          <div class="text-sm font-mono font-bold text-blue-900">
                            {{ getCorrectValue(stateIndex - 1, terminal, 'action') }}
                          </div>
                        </div>
                      </div>
                    </template>
                  </div>
                </td>

                <!-- GOTO单元格 -->
                <td
                  v-for="nonterminal in nonterminals"
                  :key="`goto-${stateIndex - 1}-${nonterminal}`"
                  class="px-2 py-1 border border-gray-300 text-xs"
                >
                  <div class="flex flex-col gap-1">
                    <!-- 历史错误记录 -->
                    <div v-if="getErrorHistory(stateIndex - 1, nonterminal, 'goto').length > 0" class="mb-1">
                      <div class="flex flex-wrap gap-1">
                        <div
                          v-for="(err, eIdx) in getErrorHistory(stateIndex - 1, nonterminal, 'goto')"
                          :key="`err-${eIdx}`"
                          class="relative group/err"
                        >
                          <span class="px-1.5 py-0.5 bg-red-50 text-red-600 rounded text-[10px] line-through decoration-red-400 border border-red-100 cursor-help block">
                            {{ err.value }}
                          </span>
                          <!-- Hint Tooltip -->
                          <div v-if="err.hint" class="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-1 w-48 p-2 bg-gray-700 text-white text-[10px] rounded shadow-xl opacity-0 invisible group-hover/err:opacity-100 group-hover/err:visible transition-all duration-200 pointer-events-none text-left">
                            <div class="font-bold mb-1 border-b border-gray-500 pb-0.5">历史错误</div>
                            <div class="whitespace-pre-wrap">{{ err.hint }}</div>
                            <div class="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-700"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- 单元格内容 - 参考LL1样式 -->
                    <template v-if="shouldBeEmpty(stateIndex - 1, nonterminal, 'goto')">
                      <!-- 应该为空 -->
                      <div
                        v-if="getUserValue(stateIndex - 1, nonterminal, 'goto')"
                        class="px-2 py-1.5 rounded border bg-red-50 border-red-200 shadow-sm flex items-center justify-between gap-2"
                      >
                        <div class="text-sm font-mono font-bold text-red-900">
                          {{ getUserValue(stateIndex - 1, nonterminal, 'goto') }}
                        </div>
                        <Icon icon="lucide:x-circle" class="w-4 h-4 text-red-600 flex-shrink-0" />
                      </div>
                      <div v-else class="text-gray-300 text-center py-2">-</div>
                    </template>

                    <template v-else>
                      <!-- 应该填写 -->
                      <!-- 用户回答正确 - 只显示正确答案 -->
                      <div
                        v-if="getCellStatus(stateIndex - 1, nonterminal, 'goto') === 'correct'"
                        class="px-2 py-1.5 rounded border bg-green-50 border-green-200 shadow-sm flex items-center justify-between gap-2"
                      >
                        <div class="text-sm font-mono font-bold text-green-900">
                          {{ getCorrectValue(stateIndex - 1, nonterminal, 'goto') }}
                        </div>
                        <Icon icon="lucide:check-circle" class="w-4 h-4 text-green-600 flex-shrink-0" />
                      </div>

                      <!-- 用户回答错误或未填写 -->
                      <div v-else class="flex flex-col gap-1.5">
                        <!-- 用户答案（错误时显示） -->
                        <div
                          v-if="getUserValue(stateIndex - 1, nonterminal, 'goto')"
                          class="px-2 py-1.5 rounded border bg-red-50 border-red-200 shadow-sm flex items-center justify-between gap-2"
                        >
                          <div class="text-sm font-mono font-bold text-red-900 line-through">
                            {{ getUserValue(stateIndex - 1, nonterminal, 'goto') }}
                          </div>
                          <Icon icon="lucide:x-circle" class="w-4 h-4 text-red-600 flex-shrink-0" />
                        </div>

                        <!-- 未填写提示 -->
                        <div v-else class="text-red-400 text-xs italic py-1 text-center">(未填写)</div>

                        <!-- 标准答案 -->
                        <div class="px-2 py-1.5 bg-blue-50 border border-blue-100 rounded flex items-center gap-2">
                          <Icon icon="lucide:book-open" class="w-4 h-4 text-blue-500 flex-shrink-0" />
                          <div class="text-sm font-mono font-bold text-blue-900">
                            {{ getCorrectValue(stateIndex - 1, nonterminal, 'goto') }}
                          </div>
                        </div>
                      </div>
                    </template>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 图例说明 -->
        <div class="mt-4 flex flex-wrap items-center gap-4 text-xs text-gray-600">
          <div class="flex items-center gap-1">
            <Icon icon="lucide:check-circle" class="w-4 h-4 text-green-500" />
            <span>回答正确</span>
          </div>
          <div class="flex items-center gap-1">
            <Icon icon="lucide:x-circle" class="w-4 h-4 text-red-500" />
            <span>回答错误</span>
          </div>
          <div class="flex items-center gap-1">
            <Icon icon="lucide:minus-circle" class="w-4 h-4 text-yellow-400" />
            <span>未填写</span>
          </div>
          <div class="flex items-center gap-1">
            <span class="text-red-500 line-through decoration-red-300 text-[10px]">文字</span>
            <span>历史错误记录</span>
          </div>
        </div>

        <!-- 填表规则提示 -->
        <div class="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
          <div class="flex items-start gap-3">
            <Icon icon="lucide:lightbulb" class="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
            <div class="text-sm text-indigo-700">
              <p class="font-medium mb-2">SLR1分析表构造规则：</p>
              <ul class="space-y-1 text-xs">
                <li>• <strong>移进动作：</strong>A → α·aβ，则ACTION[i,a] = Sj（状态j包含A → αa·β）</li>
                <li>• <strong>规约动作：</strong>A → α·且a∈FOLLOW(A)，则ACTION[i,a] = rk（第k个产生式）</li>
                <li>• <strong>接受动作：</strong>S' → S·，则ACTION[i,#] = acc</li>
                <li>• <strong>GOTO函数：</strong>根据DFA的转移关系填写状态转移</li>
                <li>• <strong>SLR1特点：</strong>仅对FOLLOW集中的终结符进行规约，解决LR0的冲突</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import type { SLR1ErrorLog } from '@/stores'

interface Props {
  step4Data?: {
    userActionTable: Record<string, string>
    userGotoTable: Record<string, string>
  }
  originalData?: {
    S?: string
    Vt?: string[]
    Vn?: string[]
    all_dfa?: any[]
    actions?: Record<string, string>
    gotos?: Record<string, string>
    isSLR1?: boolean
  }
  followSets?: Record<string, string[]>
  errorLogs?: SLR1ErrorLog[]
}

const props = defineProps<Props>()

// 计算属性
const stateCount = computed(() => props.originalData?.all_dfa?.length || 0)
const isSLR1Grammar = computed(() => props.originalData?.isSLR1)
const followSets = computed(() => props.followSets || {})

const terminals = computed(() => {
  if (!props.originalData?.Vt) return []
  return props.originalData.Vt.map((item: any) =>
    typeof item === 'object' ? item.text || item.value : item
  )
})

const nonterminals = computed(() => {
  if (!props.originalData?.Vn) return []
  return props.originalData.Vn
    .filter((item: any) => {
      const text = typeof item === 'object' ? item.text || item.value : item
      return text !== (props.originalData?.S || '') + "'"
    })
    .map((item: any) => typeof item === 'object' ? item.text || item.value : item)
})

// 获取用户填写的值
const getUserValue = (state: number, symbol: string, type: 'action' | 'goto'): string => {
  const key = `${state},${symbol}`
  if (type === 'action') {
    return props.step4Data?.userActionTable?.[key] || ''
  } else {
    return props.step4Data?.userGotoTable?.[key] || ''
  }
}

// 获取正确答案
const getCorrectValue = (state: number, symbol: string, type: 'action' | 'goto'): string => {
  const key = `${state}|${symbol}`
  if (type === 'action') {
    const value = props.originalData?.actions?.[key]
    return value !== undefined && value !== null ? String(value) : ''
  } else {
    const value = props.originalData?.gotos?.[key]
    return value !== undefined && value !== null ? String(value) : ''
  }
}

// 检查单元格是否应该为空
const shouldBeEmpty = (state: number, symbol: string, type: 'action' | 'goto'): boolean => {
  const correctVal = getCorrectValue(state, symbol, type)
  const normalizedCorrectVal = correctVal?.trim() || ''
  return !normalizedCorrectVal || normalizedCorrectVal === '-'
}

// 获取单元格状态
const getCellStatus = (state: number, symbol: string, type: 'action' | 'goto'): 'correct' | 'wrong' | 'empty' => {
  const userVal = getUserValue(state, symbol, type)
  const correctVal = getCorrectValue(state, symbol, type)

  // 标准化值（处理空值和 '-'）
  const normalizedUserVal = userVal?.trim() || ''
  const normalizedCorrectVal = correctVal?.trim() || ''

  // 如果标准答案为空（或 '-'），用户也留空或填 '-'，算作正确
  if (!normalizedCorrectVal || normalizedCorrectVal === '-') {
    if (!normalizedUserVal || normalizedUserVal === '-') {
      return 'correct'
    }
    // 标准答案为空，但用户填写了其他内容，算作错误
    return 'wrong'
  }

  // 标准答案不为空的情况
  if (!normalizedUserVal) return 'empty'
  if (normalizedUserVal === normalizedCorrectVal) return 'correct'
  return 'wrong'
}

// 获取错误历史
const getErrorHistory = (state: number, symbol: string, type: 'action' | 'goto'): Array<{ value: string; hint: string | undefined }> => {
  if (!props.errorLogs) return []

  const tableType = type === 'action' ? 'actionTable' : 'gotoTable'
  const logs = props.errorLogs.filter(log =>
    log.step === 'step4' &&
    log.type === tableType &&
    log.location.row === String(state) &&
    log.location.col === symbol
  )

  const history: Array<{ value: string; hint: string | undefined }> = []
  const seen = new Set<string>()

  logs.forEach(log => {
    const val = log.wrongValue?.trim() || ''
    if (val && !seen.has(val)) {
      history.push({ value: val, hint: log.hint })
      seen.add(val)
    }
  })

  // 排除当前值
  const currentVal = getUserValue(state, symbol, type)
  return history.filter(h => h.value !== currentVal)
}

// 计算正确率
const accuracy = computed(() => {
  if (stateCount.value === 0) return 0

  let totalCells = 0
  let correctCells = 0

  for (let state = 0; state < stateCount.value; state++) {
    // ACTION cells
    for (const terminal of [...terminals.value, '#']) {
      totalCells++
      if (getCellStatus(state, terminal, 'action') === 'correct') {
        correctCells++
      }
    }
    // GOTO cells
    for (const nonterminal of nonterminals.value) {
      totalCells++
      if (getCellStatus(state, nonterminal, 'goto') === 'correct') {
        correctCells++
      }
    }
  }

  if (totalCells === 0) return 0
  return Math.round((correctCells / totalCells) * 100)
})
</script>

<style scoped>
.slr1-step4-report {
  width: 100%;
}
</style>
