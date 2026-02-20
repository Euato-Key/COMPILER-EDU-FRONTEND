<template>
  <div class="slr1-step5-report space-y-8">
    <!-- 步骤5标题 -->
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold">5</div>
      <h2 class="text-xl font-bold text-gray-900">步骤 5：输入串分析过程</h2>
    </div>

    <!-- 全局Tooltip - 固定在body层级避免被遮挡 -->
    <Teleport to="body">
      <div
        v-if="tooltipVisible && tooltipContent"
        class="fixed z-[9999] w-64 p-3 bg-gray-800 text-white text-xs rounded-lg shadow-2xl pointer-events-none"
        :style="{ left: tooltipX + 'px', top: tooltipY + 'px' }"
      >
        <div class="font-bold mb-1 border-b border-gray-600 pb-1 flex items-center gap-1">
          <Icon icon="lucide:alert-circle" class="w-3 h-3" />
          错误提示
        </div>
        <div class="whitespace-pre-wrap leading-relaxed">{{ tooltipContent }}</div>
        <div class="absolute top-2 -left-1.5 border-4 border-transparent border-r-gray-800"></div>
      </div>
    </Teleport>

    <!-- 输入串分析过程卡片 -->
    <div class="result-card bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden print:shadow-none print:border print:border-gray-300">
      <div class="px-6 py-4 bg-gray-50 border-b border-gray-200 print:px-2 print:py-1 print:bg-gray-100">
        <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2 print:text-sm">
          <Icon icon="lucide:play-circle" class="w-5 h-5 text-orange-600 print:w-4 print:h-4" />
          移进-规约分析过程
        </h3>
        <p class="text-xs text-gray-500 mt-1 print:hidden">使用SLR1分析表进行输入串的语法分析</p>
      </div>

      <div class="p-4 overflow-x-auto print:p-1 print:overflow-visible">
        <div v-if="rows.length === 0" class="text-center py-8 text-gray-400">
          <Icon icon="lucide:alert-circle" class="w-12 h-12 mx-auto mb-4" />
          <p class="text-lg">暂无分析步骤数据</p>
          <p class="text-sm mt-2">请确保已完成输入串分析</p>
        </div>

        <div v-else>
          <table class="min-w-full border-collapse border-2 border-gray-400 print:w-full print:table-fixed">
            <thead>
              <tr class="bg-gray-100">
                <th class="border border-gray-400 px-2 py-2 text-sm font-semibold text-gray-700 text-center w-12 print:w-[8%] print:px-1 print:py-1 print:text-[10px]">步骤</th>
                <th class="border border-gray-400 px-3 py-2 text-sm font-semibold text-gray-700 text-center w-32 print:w-[18%] print:px-1 print:py-1 print:text-[10px]">
                  <div class="flex items-center justify-center gap-1">
                    <Icon icon="lucide:layers" class="w-4 h-4 text-blue-600 print:hidden" />
                    <span>状态栈</span>
                  </div>
                </th>
                <th class="border border-gray-400 px-3 py-2 text-sm font-semibold text-gray-700 text-center w-32 print:w-[18%] print:px-1 print:py-1 print:text-[10px]">
                  <div class="flex items-center justify-center gap-1">
                    <Icon icon="lucide:database" class="w-4 h-4 text-purple-600 print:hidden" />
                    <span>符号栈</span>
                  </div>
                </th>
                <th class="border border-gray-400 px-3 py-2 text-sm font-semibold text-gray-700 text-center w-32 print:w-[18%] print:px-1 print:py-1 print:text-[10px]">
                  <div class="flex items-center justify-center gap-1">
                    <Icon icon="lucide:arrow-right" class="w-4 h-4 text-pink-600 print:hidden" />
                    <span>输入串</span>
                  </div>
                </th>
                <th class="border border-gray-400 px-3 py-2 text-sm font-semibold text-gray-700 text-center w-64 print:w-[28%] print:px-1 print:py-1 print:text-[10px]">动作</th>
                <th class="border border-gray-400 px-3 py-2 text-sm font-semibold text-gray-700 text-center w-32 print:w-[10%] print:px-1 print:py-1 print:text-[10px]">状态</th>
              </tr>
            </thead>
            <tbody class="bg-white">
              <tr
                v-for="(row, idx) in rows"
                :key="idx"
                :class="(idx % 2 === 0) ? 'bg-white' : 'bg-gray-50/50'"
              >
                <!-- 步骤序号 -->
                <td class="border border-gray-400 px-3 py-2 text-center text-gray-500 font-medium print:px-1 print:py-1 print:text-[10px]">
                  {{ idx + 1 }}
                </td>

                <!-- 状态栈 -->
                <td class="border border-gray-400 p-2 print:p-1">
                  <div v-if="row.hasUserAction" class="flex flex-col gap-1.5 print:gap-1">
                    <!-- 历史错误记录 -->
                    <div v-if="row.stateStackHistory && row.stateStackHistory.length > 0" class="flex flex-wrap gap-1 print:gap-0.5">
                      <span
                        v-for="(h, hi) in row.stateStackHistory"
                        :key="hi"
                        class="px-1.5 py-0.5 bg-red-50 text-red-500 rounded text-xs font-mono line-through opacity-70 border border-red-200 cursor-help print:text-[8px] print:px-0.5 print:py-0"
                        @mouseenter="showTooltip($event, h.hint)"
                        @mouseleave="hideTooltip"
                      >
                        {{ h.value }}
                      </span>
                    </div>

                    <!-- 用户答案 -->
                    <div
                      class="answer-item px-2 py-1.5 rounded border transition-all flex items-center justify-between gap-2 print:px-1 print:py-0.5 print:gap-1"
                      :class="row.isStateStackCorrect
                        ? 'bg-green-50 border-green-200 shadow-sm'
                        : 'bg-red-50 border-red-200 shadow-sm'"
                    >
                      <div class="text-sm font-mono font-bold print:text-[10px]" :class="row.isStateStackCorrect ? 'text-green-900' : 'text-red-900'">
                        {{ row.userStateStack || '-' }}
                      </div>
                      <Icon
                        v-if="row.isStateStackCorrect"
                        icon="lucide:check-circle"
                        class="w-4 h-4 text-green-600 flex-shrink-0 print:hidden"
                      />
                      <Icon
                        v-else
                        icon="lucide:x-circle"
                        class="w-4 h-4 text-red-600 flex-shrink-0 print:hidden"
                      />
                    </div>

                    <!-- 标准答案（仅当答错时显示） -->
                    <div v-if="!row.isStateStackCorrect" class="answer-item px-2 py-1.5 bg-blue-50 border border-blue-100 rounded flex items-center gap-2 print:px-1 print:py-0.5 print:gap-1">
                      <Icon icon="lucide:book-open" class="w-4 h-4 text-blue-500 flex-shrink-0 print:hidden" />
                      <div class="text-sm font-mono font-bold text-blue-900 print:text-[10px]">{{ row.correctStateStack }}</div>
                    </div>
                  </div>
                  <span v-else class="text-gray-400 italic text-center block py-2 print:text-[10px] print:py-1">未填写</span>
                </td>

                <!-- 符号栈 -->
                <td class="border border-gray-400 p-2 print:p-1">
                  <div v-if="row.hasUserAction" class="flex flex-col gap-1.5 print:gap-1">
                    <!-- 历史错误记录 -->
                    <div v-if="row.symbolStackHistory && row.symbolStackHistory.length > 0" class="flex flex-wrap gap-1 print:gap-0.5">
                      <span
                        v-for="(h, hi) in row.symbolStackHistory"
                        :key="hi"
                        class="px-1.5 py-0.5 bg-red-50 text-red-500 rounded text-xs font-mono line-through opacity-70 border border-red-200 cursor-help print:text-[8px] print:px-0.5 print:py-0"
                        @mouseenter="showTooltip($event, h.hint)"
                        @mouseleave="hideTooltip"
                      >
                        {{ h.value }}
                      </span>
                    </div>

                    <!-- 用户答案 -->
                    <div
                      class="answer-item px-2 py-1.5 rounded border transition-all flex items-center justify-between gap-2 print:px-1 print:py-0.5 print:gap-1"
                      :class="row.isSymbolStackCorrect
                        ? 'bg-green-50 border-green-200 shadow-sm'
                        : 'bg-red-50 border-red-200 shadow-sm'"
                    >
                      <div class="text-sm font-mono font-bold print:text-[10px]" :class="row.isSymbolStackCorrect ? 'text-green-900' : 'text-red-900'">
                        {{ row.userSymbolStack || '-' }}
                      </div>
                      <Icon
                        v-if="row.isSymbolStackCorrect"
                        icon="lucide:check-circle"
                        class="w-4 h-4 text-green-600 flex-shrink-0 print:hidden"
                      />
                      <Icon
                        v-else
                        icon="lucide:x-circle"
                        class="w-4 h-4 text-red-600 flex-shrink-0 print:hidden"
                      />
                    </div>

                    <!-- 标准答案（仅当答错时显示） -->
                    <div v-if="!row.isSymbolStackCorrect" class="answer-item px-2 py-1.5 bg-blue-50 border border-blue-100 rounded flex items-center gap-2 print:px-1 print:py-0.5 print:gap-1">
                      <Icon icon="lucide:book-open" class="w-4 h-4 text-blue-500 flex-shrink-0 print:hidden" />
                      <div class="text-sm font-mono font-bold text-blue-900 print:text-[10px]">{{ row.correctSymbolStack }}</div>
                    </div>
                  </div>
                  <span v-else class="text-gray-400 italic text-center block py-2 print:text-[10px] print:py-1">未填写</span>
                </td>

                <!-- 输入串 -->
                <td class="border border-gray-400 p-2 print:p-1">
                  <div v-if="row.hasUserAction" class="flex flex-col gap-1.5 print:gap-1">
                    <!-- 历史错误记录 -->
                    <div v-if="row.inputStringHistory && row.inputStringHistory.length > 0" class="flex flex-wrap gap-1 print:gap-0.5">
                      <span
                        v-for="(h, hi) in row.inputStringHistory"
                        :key="hi"
                        class="px-1.5 py-0.5 bg-red-50 text-red-500 rounded text-xs font-mono line-through opacity-70 border border-red-200 cursor-help print:text-[8px] print:px-0.5 print:py-0"
                        @mouseenter="showTooltip($event, h.hint)"
                        @mouseleave="hideTooltip"
                      >
                        {{ h.value }}
                      </span>
                    </div>

                    <!-- 用户答案 -->
                    <div
                      class="answer-item px-2 py-1.5 rounded border transition-all flex items-center justify-between gap-2 print:px-1 print:py-0.5 print:gap-1"
                      :class="row.isInputStringCorrect
                        ? 'bg-green-50 border-green-200 shadow-sm'
                        : 'bg-red-50 border-red-200 shadow-sm'"
                    >
                      <div class="text-sm font-mono font-bold print:text-[10px]" :class="row.isInputStringCorrect ? 'text-green-900' : 'text-red-900'">
                        {{ row.userInputString || '-' }}
                      </div>
                      <Icon
                        v-if="row.isInputStringCorrect"
                        icon="lucide:check-circle"
                        class="w-4 h-4 text-green-600 flex-shrink-0 print:hidden"
                      />
                      <Icon
                        v-else
                        icon="lucide:x-circle"
                        class="w-4 h-4 text-red-600 flex-shrink-0 print:hidden"
                      />
                    </div>

                    <!-- 标准答案（仅当答错时显示） -->
                    <div v-if="!row.isInputStringCorrect" class="answer-item px-2 py-1.5 bg-blue-50 border border-blue-100 rounded flex items-center gap-2 print:px-1 print:py-0.5 print:gap-1">
                      <Icon icon="lucide:book-open" class="w-4 h-4 text-blue-500 flex-shrink-0 print:hidden" />
                      <div class="text-sm font-mono font-bold text-blue-900 print:text-[10px]">{{ row.correctInputString }}</div>
                    </div>
                  </div>
                  <span v-else class="text-gray-400 italic text-center block py-2 print:text-[10px] print:py-1">未填写</span>
                </td>

                <!-- 动作说明 -->
                <td class="border border-gray-400 p-2 align-middle print:p-1">
                  <div v-if="row.action" class="flex flex-col gap-1 print:gap-0.5">
                    <!-- 移进动作 -->
                    <div v-if="row.action.includes('S') || row.action.includes('移进')" class="answer-item px-2 py-1.5 rounded border bg-blue-50 border-blue-200 shadow-sm flex items-center justify-center gap-1.5 print:px-1 print:py-0.5 print:gap-1">
                      <Icon icon="lucide:arrow-down" class="w-4 h-4 text-blue-600 flex-shrink-0 print:hidden" />
                      <span class="text-sm font-bold text-blue-900 print:text-[10px]">{{ row.action }}</span>
                    </div>
                    <!-- 规约动作 -->
                    <div v-else-if="row.action.includes('r') || row.action.includes('规约')" class="answer-item px-2 py-1.5 rounded border bg-purple-50 border-purple-200 shadow-sm flex items-center justify-center gap-1.5 print:px-1 print:py-0.5 print:gap-1">
                      <Icon icon="lucide:git-branch" class="w-4 h-4 text-purple-600 flex-shrink-0 print:hidden" />
                      <span class="text-sm font-bold text-purple-900 print:text-[10px]">{{ row.action }}</span>
                    </div>
                    <!-- 接受动作 -->
                    <div v-else-if="row.action.includes('acc') || row.action.includes('接受')" class="answer-item px-2 py-1.5 rounded border bg-green-50 border-green-200 shadow-sm flex items-center justify-center gap-1.5 print:px-1 print:py-0.5 print:gap-1">
                      <Icon icon="lucide:party-popper" class="w-4 h-4 text-green-600 flex-shrink-0 print:hidden" />
                      <span class="text-sm font-bold text-green-900 print:text-[10px]">{{ row.action }}</span>
                    </div>
                    <!-- 其他动作 -->
                    <div v-else class="answer-item px-2 py-1.5 rounded border bg-gray-50 border-gray-200 shadow-sm flex items-center justify-center gap-1.5 print:px-1 print:py-0.5 print:gap-1">
                      <Icon icon="lucide:arrow-right-circle" class="w-4 h-4 text-gray-600 flex-shrink-0 print:hidden" />
                      <span class="text-sm font-bold text-gray-900 print:text-[10px]">{{ row.action }}</span>
                    </div>
                  </div>
                  <span v-else class="text-gray-300 text-center block py-2 print:text-[10px] print:py-1">-</span>
                </td>

                <!-- 状态 -->
                <td class="border border-gray-400 p-2 print:p-1">
                  <template v-if="row.hasUserAction">
                    <div
                      v-if="row.isCorrect"
                      class="answer-item px-2 py-1.5 rounded border bg-green-50 border-green-200 shadow-sm flex items-center justify-center gap-1 print:px-1 print:py-0.5"
                    >
                      <Icon icon="lucide:check-circle" class="w-4 h-4 text-green-600 print:hidden" />
                      <span class="text-sm font-bold text-green-900 print:text-[10px]">正确</span>
                    </div>
                    <div
                      v-else
                      class="answer-item px-2 py-1.5 rounded border bg-red-50 border-red-200 shadow-sm flex items-center justify-center gap-1 cursor-help print:px-1 print:py-0.5"
                      :title="row.hint"
                    >
                      <Icon icon="lucide:x-circle" class="w-4 h-4 text-red-600 print:hidden" />
                      <span class="text-sm font-bold text-red-900 print:text-[10px]">错误</span>
                    </div>
                  </template>
                  <span v-else class="text-gray-400 italic text-center block py-2 print:text-[10px] print:py-1">未做</span>
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
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'
import type { SLR1ErrorLog } from '@/stores'
import type { AnalysisStepInfo } from '@/types/common'

interface Props {
  step5Data?: {
    userSteps: Array<{ stateStack: string; symbolStack: string; inputString: string }>
  }
  inputAnalysisResult?: AnalysisStepInfo
  inputString?: string
  errorLogs?: SLR1ErrorLog[]
}

const props = defineProps<Props>()

// Tooltip 状态
const tooltipVisible = ref(false)
const tooltipContent = ref('')
const tooltipX = ref(0)
const tooltipY = ref(0)

// 显示 Tooltip
function showTooltip(event: MouseEvent, hint: string | undefined) {
  if (!hint) return
  tooltipContent.value = hint
  tooltipVisible.value = true
  // 计算位置：在元素右侧显示
  const rect = (event.target as HTMLElement).getBoundingClientRect()
  tooltipX.value = rect.right + 8
  tooltipY.value = rect.top
}

// 隐藏 Tooltip
function hideTooltip() {
  tooltipVisible.value = false
  tooltipContent.value = ''
}

interface RowData {
  stepIndex: number
  correctStateStack: string
  correctSymbolStack: string
  correctInputString: string
  action: string
  userStateStack: string
  userSymbolStack: string
  userInputString: string
  hasUserAction: boolean
  isStateStackCorrect: boolean
  isSymbolStackCorrect: boolean
  isInputStringCorrect: boolean
  isCorrect: boolean
  hint?: string
  stateStackHistory: Array<{ value: string; hint: string | undefined }>
  symbolStackHistory: Array<{ value: string; hint: string | undefined }>
  inputStringHistory: Array<{ value: string; hint: string | undefined }>
}

const rows = computed<RowData[]>(() => {
  if (!props.inputAnalysisResult) return []

  // 标准步骤 - 使用正确的属性名
  const standardStateStacks = props.inputAnalysisResult.info_state_stack || []
  const standardSymbolStacks = props.inputAnalysisResult.info_symbol_stack || []
  const standardInputs = props.inputAnalysisResult.info_str || []
  const standardActions = props.inputAnalysisResult.info_msg || []

  // 用户步骤
  const userSteps = props.step5Data?.userSteps || []

  const result: RowData[] = []

  for (let i = 0; i < standardStateStacks.length; i++) {
    const correctStateStack = standardStateStacks[i] || ''
    const correctSymbolStack = standardSymbolStacks[i] || ''
    const correctInput = standardInputs[i] || ''
    const action = standardActions[i] || ''

    let userStateStack = ''
    let userSymbolStack = ''
    let userInputString = ''
    let hasUserAction = false

    // 首先从 userSteps 获取用户答案
    if (i < userSteps.length) {
      userStateStack = userSteps[i].stateStack
      userSymbolStack = userSteps[i].symbolStack
      userInputString = userSteps[i].inputString
      hasUserAction = true
    }

    // 查找历史错误记录，同时如果没有 userSteps 数据，从错误日志中提取用户答案
    const stateStackHistory: Array<{ value: string; hint: string | undefined }> = []
    const symbolStackHistory: Array<{ value: string; hint: string | undefined }> = []
    const inputStringHistory: Array<{ value: string; hint: string | undefined }> = []
    const seenStateStack = new Set<string>()
    const seenSymbolStack = new Set<string>()
    const seenInputString = new Set<string>()
    let hint: string | undefined = undefined

    if (props.errorLogs) {
      props.errorLogs.forEach(log => {
        if (log.step === 'step5' && log.type === 'analysisStep' && log.location.stepIndex === i) {
          if (log.hint) hint = log.hint

          // 解析 wrongValue 格式
          const wrongValue = log.wrongValue?.trim() || ''
          if (wrongValue !== '') {
            let wrongStateStack = ''
            let wrongSymbolStack = ''
            let wrongInputString = ''

            // 尝试解析完整格式: "StateStack: xxx, SymbolStack: xxx, InputString: xxx"
            const stateStackMatch = wrongValue.match(/StateStack:\s*([^,]+)/i)
            const symbolStackMatch = wrongValue.match(/SymbolStack:\s*([^,]+)/i)
            const inputStringMatch = wrongValue.match(/InputString:\s*([^,]+)/i)

            if (stateStackMatch || symbolStackMatch || inputStringMatch) {
              // 完整格式
              wrongStateStack = stateStackMatch ? stateStackMatch[1].trim() : ''
              wrongSymbolStack = symbolStackMatch ? symbolStackMatch[1].trim() : ''
              wrongInputString = inputStringMatch ? inputStringMatch[1].trim() : ''
            } else {
              // 简单格式：根据 fieldKey 判断是哪个字段
              const fieldKey = log.location.fieldKey || ''
              if (fieldKey.includes('stateStack')) {
                wrongStateStack = wrongValue
              } else if (fieldKey.includes('symbolStack')) {
                wrongSymbolStack = wrongValue
              } else if (fieldKey.includes('inputString')) {
                wrongInputString = wrongValue
              }
            }

            // 如果没有 userSteps 数据，使用错误日志中的 wrongValue 作为用户答案
            if (!hasUserAction) {
              if (wrongStateStack) userStateStack = wrongStateStack
              if (wrongSymbolStack) userSymbolStack = wrongSymbolStack
              if (wrongInputString) userInputString = wrongInputString
              hasUserAction = true
            }

            // 添加到历史记录（排除与正确答案相同的）
            if (wrongStateStack && !seenStateStack.has(wrongStateStack) && wrongStateStack !== correctStateStack) {
              stateStackHistory.push({ value: wrongStateStack, hint: log.hint })
              seenStateStack.add(wrongStateStack)
            }

            if (wrongSymbolStack && !seenSymbolStack.has(wrongSymbolStack) && wrongSymbolStack !== correctSymbolStack) {
              symbolStackHistory.push({ value: wrongSymbolStack, hint: log.hint })
              seenSymbolStack.add(wrongSymbolStack)
            }

            if (wrongInputString && !seenInputString.has(wrongInputString) && wrongInputString !== correctInput) {
              inputStringHistory.push({ value: wrongInputString, hint: log.hint })
              seenInputString.add(wrongInputString)
            }
          }
        }
      })
    }

    const isStateStackCorrect = userStateStack.replace(/\s+/g, '') === correctStateStack.replace(/\s+/g, '')
    const isSymbolStackCorrect = userSymbolStack.replace(/\s+/g, '') === correctSymbolStack.replace(/\s+/g, '')
    const isInputStringCorrect = userInputString.replace(/\s+/g, '') === correctInput.replace(/\s+/g, '')

    result.push({
      stepIndex: i,
      correctStateStack,
      correctSymbolStack,
      correctInputString: correctInput,
      action,
      userStateStack,
      userSymbolStack,
      userInputString,
      hasUserAction,
      isStateStackCorrect,
      isSymbolStackCorrect,
      isInputStringCorrect,
      isCorrect: isStateStackCorrect && isSymbolStackCorrect && isInputStringCorrect,
      hint,
      stateStackHistory,
      symbolStackHistory,
      inputStringHistory
    })
  }

  return result
})
</script>

<style scoped>
.answer-item {
  transition: all 0.2s ease;
}
.slr1-step5-report :deep(table) {
  table-layout: fixed;
}
</style>
