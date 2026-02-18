<template>
  <div class="ll1-step4-report space-y-8">
    <!-- 步骤4标题 -->
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold">4</div>
      <h2 class="text-xl font-bold text-gray-900">步骤 4：输入串分析过程</h2>
    </div>

    <!-- 输入串分析过程卡片 -->
    <div class="result-card bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden print:shadow-none print:border print:border-gray-300">
      <div class="px-6 py-4 bg-gray-50 border-b border-gray-200 print:px-2 print:py-1 print:bg-gray-100">
        <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2 print:text-sm">
          <Icon icon="lucide:play-circle" class="w-5 h-5 text-orange-600 print:w-4 print:h-4" />
          预测分析过程
        </h3>
        <p class="text-xs text-gray-500 mt-1 print:hidden">使用LL1预测分析表进行输入串的语法分析</p>
      </div>

      <div class="p-4 overflow-x-auto print:p-1">
        <div v-if="rows.length === 0" class="text-center py-8 text-gray-400">
          <Icon icon="lucide:alert-circle" class="w-12 h-12 mx-auto mb-4" />
          <p class="text-lg">暂无分析步骤数据</p>
          <p class="text-sm mt-2">请确保已完成输入串分析</p>
        </div>

        <div v-else>
          <table class="min-w-full border-collapse border-2 border-gray-400">
            <thead>
              <tr class="bg-gray-100">
                <th class="border border-gray-400 px-3 py-2 text-sm font-semibold text-gray-700 text-center w-16">步骤</th>
                <th class="border border-gray-400 px-3 py-2 text-sm font-semibold text-gray-700 text-center w-1/4">
                  <div class="flex items-center justify-center gap-1">
                    <Icon icon="lucide:layers" class="w-4 h-4 text-blue-600" />
                    <span>分析栈</span>
                  </div>
                </th>
                <th class="border border-gray-400 px-3 py-2 text-sm font-semibold text-gray-700 text-center w-1/4">
                  <div class="flex items-center justify-center gap-1">
                    <Icon icon="lucide:arrow-right" class="w-4 h-4 text-purple-600" />
                    <span>输入串</span>
                  </div>
                </th>
                <th class="border border-gray-400 px-3 py-2 text-sm font-semibold text-gray-700 text-center w-40">动作</th>
                <th class="border border-gray-400 px-3 py-2 text-sm font-semibold text-gray-700 text-center w-24">状态</th>
              </tr>
            </thead>
            <tbody class="bg-white">
              <tr
                v-for="(row, idx) in rows"
                :key="idx"
                :class="(idx % 2 === 0) ? 'bg-white' : 'bg-gray-50/50'"
              >
                <!-- 步骤序号 -->
                <td class="border border-gray-400 px-3 py-2 text-center text-gray-500 font-medium">
                  {{ idx + 1 }}
                </td>

                <!-- 分析栈 (Stack) -->
                <td class="border border-gray-400 p-2">
                  <div v-if="row.hasUserAction" class="flex flex-col gap-1.5">
                    <!-- 历史错误记录 -->
                    <div v-if="row.stackHistory && row.stackHistory.length > 0" class="flex flex-wrap gap-1">
                      <span
                        v-for="(h, hi) in row.stackHistory"
                        :key="hi"
                        class="px-1.5 py-0.5 bg-red-50 text-red-500 rounded text-xs font-mono line-through opacity-70 border border-red-200"
                        :title="h.hint || `历史错误 ${hi + 1}`"
                      >
                        {{ h.value }}
                      </span>
                    </div>

                    <!-- 用户答案 -->
                    <div
                      class="answer-item px-2 py-1.5 rounded border transition-all flex items-center justify-between gap-2"
                      :class="row.isStackCorrect
                        ? 'bg-green-50 border-green-200 shadow-sm'
                        : 'bg-red-50 border-red-200 shadow-sm'"
                    >
                      <div class="text-sm font-mono font-bold" :class="row.isStackCorrect ? 'text-green-900' : 'text-red-900'">
                        {{ row.userStack || '-' }}
                      </div>
                      <Icon
                        v-if="row.isStackCorrect"
                        icon="lucide:check-circle"
                        class="w-4 h-4 text-green-600 flex-shrink-0"
                      />
                      <Icon
                        v-else
                        icon="lucide:x-circle"
                        class="w-4 h-4 text-red-600 flex-shrink-0"
                      />
                    </div>

                    <!-- 标准答案（仅当答错时显示） -->
                    <div v-if="!row.isStackCorrect" class="answer-item px-2 py-1.5 bg-blue-50 border border-blue-100 rounded flex items-center gap-2">
                      <Icon icon="lucide:book-open" class="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <div class="text-sm font-mono font-bold text-blue-900">{{ row.stack }}</div>
                    </div>
                  </div>
                  <span v-else class="text-gray-400 italic text-center block py-2">未填写</span>
                </td>

                <!-- 输入串 (Input) -->
                <td class="border border-gray-400 p-2">
                  <div v-if="row.hasUserAction" class="flex flex-col gap-1.5">
                    <!-- 历史错误记录 -->
                    <div v-if="row.inputHistory && row.inputHistory.length > 0" class="flex flex-wrap gap-1">
                      <span
                        v-for="(h, hi) in row.inputHistory"
                        :key="hi"
                        class="px-1.5 py-0.5 bg-red-50 text-red-500 rounded text-xs font-mono line-through opacity-70 border border-red-200"
                        :title="h.hint || `历史错误 ${hi + 1}`"
                      >
                        {{ h.value }}
                      </span>
                    </div>

                    <!-- 用户答案 -->
                    <div
                      class="answer-item px-2 py-1.5 rounded border transition-all flex items-center justify-between gap-2"
                      :class="row.isInputCorrect
                        ? 'bg-green-50 border-green-200 shadow-sm'
                        : 'bg-red-50 border-red-200 shadow-sm'"
                    >
                      <div class="text-sm font-mono font-bold" :class="row.isInputCorrect ? 'text-green-900' : 'text-red-900'">
                        {{ row.userInput || '-' }}
                      </div>
                      <Icon
                        v-if="row.isInputCorrect"
                        icon="lucide:check-circle"
                        class="w-4 h-4 text-green-600 flex-shrink-0"
                      />
                      <Icon
                        v-else
                        icon="lucide:x-circle"
                        class="w-4 h-4 text-red-600 flex-shrink-0"
                      />
                    </div>

                    <!-- 标准答案（仅当答错时显示） -->
                    <div v-if="!row.isInputCorrect" class="answer-item px-2 py-1.5 bg-blue-50 border border-blue-100 rounded flex items-center gap-2">
                      <Icon icon="lucide:book-open" class="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <div class="text-sm font-mono font-bold text-blue-900">{{ row.input }}</div>
                    </div>
                  </div>
                  <span v-else class="text-gray-400 italic text-center block py-2">未填写</span>
                </td>

                <!-- 动作说明 -->
                <td class="border border-gray-400 p-2 align-middle">
                  <div v-if="row.action" class="flex flex-col gap-1">
                    <!-- 匹配动作 -->
                    <div v-if="row.action.includes('匹配')" class="answer-item px-2 py-1.5 rounded border bg-blue-50 border-blue-200 shadow-sm flex items-center justify-center gap-1.5">
                      <Icon icon="lucide:check-square" class="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span class="text-sm font-bold text-blue-900">{{ row.action }}</span>
                    </div>
                    <!-- 推导动作 -->
                    <div v-else-if="row.action.includes('推导') || row.action.includes('->')" class="answer-item px-2 py-1.5 rounded border bg-purple-50 border-purple-200 shadow-sm flex items-center justify-center gap-1.5">
                      <Icon icon="lucide:git-branch" class="w-4 h-4 text-purple-600 flex-shrink-0" />
                      <span class="text-sm font-bold text-purple-900">{{ row.action }}</span>
                    </div>
                    <!-- 接受动作 -->
                    <div v-else-if="row.action.includes('接受') || row.action.includes('成功')" class="answer-item px-2 py-1.5 rounded border bg-green-50 border-green-200 shadow-sm flex items-center justify-center gap-1.5">
                      <Icon icon="lucide:party-popper" class="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span class="text-sm font-bold text-green-900">{{ row.action }}</span>
                    </div>
                    <!-- 错误动作 -->
                    <div v-else-if="row.action.includes('错误') || row.action.includes('失败')" class="answer-item px-2 py-1.5 rounded border bg-red-50 border-red-200 shadow-sm flex items-center justify-center gap-1.5">
                      <Icon icon="lucide:alert-circle" class="w-4 h-4 text-red-600 flex-shrink-0" />
                      <span class="text-sm font-bold text-red-900">{{ row.action }}</span>
                    </div>
                    <!-- 其他动作 -->
                    <div v-else class="answer-item px-2 py-1.5 rounded border bg-gray-50 border-gray-200 shadow-sm flex items-center justify-center gap-1.5">
                      <Icon icon="lucide:arrow-right-circle" class="w-4 h-4 text-gray-600 flex-shrink-0" />
                      <span class="text-sm font-bold text-gray-900">{{ row.action }}</span>
                    </div>
                  </div>
                  <span v-else class="text-gray-300 text-center block py-2">-</span>
                </td>

                <!-- 状态 -->
                <td class="border border-gray-400 p-2">
                  <template v-if="row.hasUserAction">
                    <div
                      v-if="row.isCorrect"
                      class="answer-item px-2 py-1.5 rounded border bg-green-50 border-green-200 shadow-sm flex items-center justify-center gap-1"
                    >
                      <Icon icon="lucide:check-circle" class="w-4 h-4 text-green-600" />
                      <span class="text-sm font-bold text-green-900">正确</span>
                    </div>
                    <div
                      v-else
                      class="answer-item px-2 py-1.5 rounded border bg-red-50 border-red-200 shadow-sm flex items-center justify-center gap-1 cursor-help"
                      :title="row.hint"
                    >
                      <Icon icon="lucide:x-circle" class="w-4 h-4 text-red-600" />
                      <span class="text-sm font-bold text-red-900">错误</span>
                    </div>
                  </template>
                  <span v-else class="text-gray-400 italic text-center block py-2">未做</span>
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import type { AnalysisStepInfo } from '@/types/ll1'
import type { LL1ErrorLog } from '@/stores'

interface Props {
  step4Data?: {
    userSteps: Array<{ stack: string; input: string }>
  }
  inputAnalysisResult?: AnalysisStepInfo
  errorLogs?: LL1ErrorLog[]
}

const props = defineProps<Props>()

interface RowData {
  stepIndex: number
  stack: string
  input: string
  action: string
  userStack: string
  userInput: string
  hasUserAction: boolean
  isStackCorrect: boolean
  isInputCorrect: boolean
  isCorrect: boolean
  hint?: string
  stackHistory: Array<{ value: string; hint: string | undefined }>
  inputHistory: Array<{ value: string; hint: string | undefined }>
}

const rows = computed<RowData[]>(() => {
  if (!props.inputAnalysisResult) return []

  // 标准步骤
  const standardStacks = props.inputAnalysisResult.info_stack || []
  const standardInputs = props.inputAnalysisResult.info_str || []
  const standardActions = props.inputAnalysisResult.info_msg || []

  // 用户步骤
  const userSteps = props.step4Data?.userSteps || []

  const result: RowData[] = []

  for (let i = 0; i < standardStacks.length; i++) {
    const correctStack = standardStacks[i]
    const correctInput = standardInputs[i]
    const action = standardActions[i] || ''

    let userStack = ''
    let userInput = ''
    let hasUserAction = false

    // 首先从 userSteps 获取用户答案
    if (i < userSteps.length) {
      userStack = userSteps[i].stack
      userInput = userSteps[i].input
      hasUserAction = true
    }

    // 查找历史错误记录，同时如果没有 userSteps 数据，从错误日志中提取用户答案
    const stackHistory: Array<{ value: string; hint: string | undefined }> = []
    const inputHistory: Array<{ value: string; hint: string | undefined }> = []
    const seenStack = new Set<string>()
    const seenInput = new Set<string>()
    let hint: string | undefined = undefined

    if (props.errorLogs) {
      props.errorLogs.forEach(log => {
        if (log.step === 'step4' && log.type === 'analysisStep' && log.location.stepIndex === i) {
          if (log.hint) hint = log.hint

          // 解析 wrongValue 格式: "Stack: xxx, Input: xxx"
          const wrongValue = log.wrongValue?.trim() || ''
          if (wrongValue !== '') {
            const stackMatch = wrongValue.match(/Stack:\s*([^,]+)/i)
            const inputMatch = wrongValue.match(/Input:\s*([^,]+)/i)

            const wrongStack = stackMatch ? stackMatch[1].trim() : ''
            const wrongInput = inputMatch ? inputMatch[1].trim() : ''

            // 如果没有 userSteps 数据，使用错误日志中的 wrongValue 作为用户答案
            if (!hasUserAction) {
              if (wrongStack) userStack = wrongStack
              if (wrongInput) userInput = wrongInput
              hasUserAction = true
            }

            // 添加到历史记录（排除与正确答案相同的）
            if (wrongStack && !seenStack.has(wrongStack) && wrongStack !== correctStack) {
              stackHistory.push({ value: wrongStack, hint: log.hint })
              seenStack.add(wrongStack)
            }

            if (wrongInput && !seenInput.has(wrongInput) && wrongInput !== correctInput) {
              inputHistory.push({ value: wrongInput, hint: log.hint })
              seenInput.add(wrongInput)
            }
          }
        }
      })
    }

    const isStackCorrect = userStack.replace(/\s+/g, '') === correctStack.replace(/\s+/g, '')
    const isInputCorrect = userInput.replace(/\s+/g, '') === correctInput.replace(/\s+/g, '')

    result.push({
      stepIndex: i,
      stack: correctStack,
      input: correctInput,
      action,
      userStack,
      userInput,
      hasUserAction,
      isStackCorrect,
      isInputCorrect,
      isCorrect: isStackCorrect && isInputCorrect,
      hint,
      stackHistory,
      inputHistory
    })
  }

  return result
})
</script>

<style scoped>
.answer-item {
  transition: all 0.2s ease;
}
.ll1-step4-report :deep(table) {
  table-layout: fixed;
}
</style>
