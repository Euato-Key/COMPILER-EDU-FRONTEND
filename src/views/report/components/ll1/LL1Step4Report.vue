<template>
  <div class="ll1-step4-report">
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="px-6 py-4 bg-orange-50 border-b border-orange-100 flex items-center justify-between">
        <h3 class="text-lg font-bold text-orange-900 flex items-center gap-2">
          <Icon icon="lucide:play-circle" class="w-5 h-5 text-orange-600" />
          输入串分析过程回顾
        </h3>
        <span class="text-xs font-medium px-2 py-1 bg-white text-orange-600 rounded-lg border border-orange-100">Step 4</span>
      </div>

      <div class="p-6">
        <div v-if="rows.length === 0" class="text-center py-8 text-gray-400">
          暂无分析步骤数据
        </div>
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 border">
            <thead>
              <tr class="bg-gray-50 text-gray-500 uppercase tracking-wider text-xs">
                <th class="px-4 py-3 text-center border w-16">步骤</th>
                <th class="px-4 py-3 text-left border w-1/4">
                  <div class="flex items-center gap-2">
                    <span>用户答案</span>
                    <span class="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded">Stack</span>
                  </div>
                </th>
                <th class="px-4 py-3 text-left border w-1/4">
                  <div class="flex items-center gap-2">
                    <span>用户答案</span>
                    <span class="text-[10px] bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded">Input</span>
                  </div>
                </th>
                <th class="px-4 py-3 text-left border">
                  <div class="flex items-center gap-2">
                    <span>标准答案</span>
                    <span class="text-[10px] bg-green-100 text-green-600 px-1.5 py-0.5 rounded">Stack / Input</span>
                  </div>
                </th>
                <th class="px-4 py-3 text-left border w-32">动作</th>
                <th class="px-4 py-3 text-center border w-20">状态</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200 text-sm font-mono">
              <tr 
                v-for="(row, idx) in rows" 
                :key="idx" 
                class="hover:bg-gray-50 transition-colors"
                :class="{
                  'bg-red-50/30': row.hasUserAction && !row.isCorrect,
                  'bg-green-50/30': row.hasUserAction && row.isCorrect
                }"
              >
                <!-- 步骤序号 -->
                <td class="px-4 py-3 text-center border text-gray-500 font-medium">
                  {{ idx + 1 }}
                </td>

                <!-- 用户答案 - Stack -->
                <td class="px-4 py-3 border break-all">
                  <div v-if="row.hasUserAction" class="flex flex-col gap-1">
                    <!-- 历史错误记录（折叠显示） -->
                    <div v-if="row.stackHistory && row.stackHistory.length > 0" class="mb-1">
                      <button 
                        @click="toggleStackHistory(idx)"
                        class="text-[10px] text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-1"
                      >
                        <Icon :icon="isStackHistoryExpanded(idx) ? 'lucide:chevron-down' : 'lucide:chevron-right'" class="w-3 h-3" />
                        历史错误 ({{ row.stackHistory.length }})
                      </button>
                      <div v-if="isStackHistoryExpanded(idx)" class="flex flex-col gap-1">
                        <div 
                          v-for="(h, hi) in row.stackHistory" 
                          :key="hi"
                          class="relative group/err"
                        >
                          <span class="text-red-500 bg-red-50 border border-red-100 text-[10px] px-1.5 py-0.5 rounded line-through decoration-red-300 cursor-help inline-block">
                            {{ h.value }}
                          </span>
                          <!-- Hint Tooltip -->
                          <div v-if="h.hint" class="absolute z-50 bottom-full left-0 mb-1 w-56 p-2 bg-gray-800 text-white text-[11px] rounded shadow-lg opacity-0 invisible group-hover/err:opacity-100 group-hover/err:visible transition-all duration-200 pointer-events-none text-left font-sans">
                            <div class="font-bold mb-1 border-b border-gray-600 pb-1">错误提示</div>
                            <div class="whitespace-pre-wrap">{{ h.hint }}</div>
                            <div class="absolute top-full left-4 border-4 border-transparent border-t-gray-800"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <!-- 用户最终答案 -->
                    <div class="flex items-center gap-2">
                      <span 
                        :class="{
                          'text-green-700 font-medium': row.isStackCorrect,
                          'text-red-600 font-medium': !row.isStackCorrect
                        }"
                      >
                        {{ row.userStack || '-' }}
                      </span>
                      <Icon 
                        v-if="row.isStackCorrect" 
                        icon="lucide:check" 
                        class="w-4 h-4 text-green-500" 
                      />
                      <Icon 
                        v-else 
                        icon="lucide:x" 
                        class="w-4 h-4 text-red-500" 
                      />
                    </div>
                  </div>
                  <span v-else class="text-gray-400 italic">未填写</span>
                </td>

                <!-- 用户答案 - Input -->
                <td class="px-4 py-3 border break-all">
                  <div v-if="row.hasUserAction" class="flex flex-col gap-1">
                    <!-- 历史错误记录（折叠显示） -->
                    <div v-if="row.inputHistory && row.inputHistory.length > 0" class="mb-1">
                      <button 
                        @click="toggleInputHistory(idx)"
                        class="text-[10px] text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-1"
                      >
                        <Icon :icon="isInputHistoryExpanded(idx) ? 'lucide:chevron-down' : 'lucide:chevron-right'" class="w-3 h-3" />
                        历史错误 ({{ row.inputHistory.length }})
                      </button>
                      <div v-if="isInputHistoryExpanded(idx)" class="flex flex-col gap-1">
                        <div 
                          v-for="(h, hi) in row.inputHistory" 
                          :key="hi"
                          class="relative group/err"
                        >
                          <span class="text-red-500 bg-red-50 border border-red-100 text-[10px] px-1.5 py-0.5 rounded line-through decoration-red-300 cursor-help inline-block">
                            {{ h.value }}
                          </span>
                          <!-- Hint Tooltip -->
                          <div v-if="h.hint" class="absolute z-50 bottom-full left-0 mb-1 w-56 p-2 bg-gray-800 text-white text-[11px] rounded shadow-lg opacity-0 invisible group-hover/err:opacity-100 group-hover/err:visible transition-all duration-200 pointer-events-none text-left font-sans">
                            <div class="font-bold mb-1 border-b border-gray-600 pb-1">错误提示</div>
                            <div class="whitespace-pre-wrap">{{ h.hint }}</div>
                            <div class="absolute top-full left-4 border-4 border-transparent border-t-gray-800"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <!-- 用户最终答案 -->
                    <div class="flex items-center gap-2">
                      <span 
                        :class="{
                          'text-green-700 font-medium': row.isInputCorrect,
                          'text-red-600 font-medium': !row.isInputCorrect
                        }"
                      >
                        {{ row.userInput || '-' }}
                      </span>
                      <Icon 
                        v-if="row.isInputCorrect" 
                        icon="lucide:check" 
                        class="w-4 h-4 text-green-500" 
                      />
                      <Icon 
                        v-else 
                        icon="lucide:x" 
                        class="w-4 h-4 text-red-500" 
                      />
                    </div>
                  </div>
                  <span v-else class="text-gray-400 italic">未填写</span>
                </td>

                <!-- 标准答案 -->
                <td class="px-4 py-3 border bg-green-50/50">
                  <div class="flex flex-col gap-1">
                    <div class="flex items-center gap-2">
                      <span class="text-[10px] text-gray-500">Stack:</span>
                      <span class="text-green-800 font-medium">{{ row.stack }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="text-[10px] text-gray-500">Input:</span>
                      <span class="text-green-800 font-medium">{{ row.input }}</span>
                    </div>
                  </div>
                </td>

                <!-- 动作说明 -->
                <td class="px-4 py-3 border text-gray-600 text-xs">
                  <span v-if="row.action" class="bg-blue-50 text-blue-700 px-2 py-1 rounded inline-block">
                    {{ row.action }}
                  </span>
                  <span v-else class="text-gray-300">-</span>
                </td>

                <!-- 状态 -->
                <td class="px-4 py-3 border text-center">
                  <template v-if="row.hasUserAction">
                    <div 
                      v-if="row.isCorrect" 
                      class="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium"
                    >
                      <Icon icon="lucide:check" class="w-3 h-3" />
                      正确
                    </div>
                    <div 
                      v-else 
                      class="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium cursor-help relative group/status"
                    >
                      <Icon icon="lucide:x" class="w-3 h-3" />
                      错误
                      <!-- Error Hint Tooltip -->
                      <div v-if="row.hint" class="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-1 w-56 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover/status:opacity-100 group-hover/status:visible transition-all duration-200 pointer-events-none text-left font-sans">
                        <div class="font-bold mb-1 border-b border-gray-600 pb-1">错误提示</div>
                        <div class="whitespace-pre-wrap">{{ row.hint }}</div>
                        <div class="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                      </div>
                    </div>
                  </template>
                  <span v-else class="text-gray-400 text-xs italic">未做</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 图例说明 -->
        <div class="mt-4 flex flex-wrap items-center gap-4 text-xs text-gray-600">
          <div class="flex items-center gap-1">
            <span class="w-3 h-3 bg-green-50 border border-green-200 rounded"></span>
            <span>标准答案区域</span>
          </div>
          <div class="flex items-center gap-1">
            <span class="w-3 h-3 bg-green-100 rounded"></span>
            <span>回答正确</span>
          </div>
          <div class="flex items-center gap-1">
            <span class="w-3 h-3 bg-red-100 rounded"></span>
            <span>回答错误</span>
          </div>
          <div class="flex items-center gap-1">
            <span class="text-red-500 line-through decoration-red-300">文字</span>
            <span>历史错误记录</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
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

// 独立的展开状态管理
const expandedStackHistory = ref<Set<number>>(new Set())
const expandedInputHistory = ref<Set<number>>(new Set())

const toggleStackHistory = (idx: number) => {
  if (expandedStackHistory.value.has(idx)) {
    expandedStackHistory.value.delete(idx)
  } else {
    expandedStackHistory.value.add(idx)
  }
}

const isStackHistoryExpanded = (idx: number) => {
  return expandedStackHistory.value.has(idx)
}

const toggleInputHistory = (idx: number) => {
  if (expandedInputHistory.value.has(idx)) {
    expandedInputHistory.value.delete(idx)
  } else {
    expandedInputHistory.value.add(idx)
  }
}

const isInputHistoryExpanded = (idx: number) => {
  return expandedInputHistory.value.has(idx)
}

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
</style>
