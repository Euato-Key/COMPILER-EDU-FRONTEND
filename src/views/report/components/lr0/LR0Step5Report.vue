<template>
  <div class="lr0-step5-report space-y-6">
    <!-- 输入串分析表 -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
      <div class="px-6 py-4 bg-orange-50 border-b border-orange-100 flex items-center justify-between">
        <h3 class="text-lg font-bold text-orange-900 flex items-center gap-2">
          <Icon icon="lucide:play-circle" class="w-5 h-5 text-orange-600" />
          输入串分析过程回顾
        </h3>
        <span class="text-xs font-medium px-2 py-1 bg-white text-orange-600 rounded-lg border border-orange-100">Step 5</span>
      </div>

      <div class="p-6">
        <!-- 输入串信息 -->
        <div class="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <div class="flex items-center gap-2">
            <Icon icon="lucide:file-text" class="w-5 h-5 text-orange-600" />
            <span class="text-sm font-medium text-orange-800">输入串:</span>
            <span class="text-lg font-mono font-bold text-orange-900">{{ inputString }}</span>
          </div>
        </div>

        <div v-if="rows.length === 0" class="text-center py-8 text-gray-400">
          <Icon icon="lucide:clipboard-x" class="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>暂无分析步骤数据</p>
        </div>
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 border">
            <thead>
              <tr class="bg-gray-50 text-gray-500 uppercase tracking-wider text-xs">
                <th class="px-4 py-3 text-center border w-12">步骤</th>
                <th class="px-3 py-3 text-left border w-32">
                  <div class="flex flex-col gap-0.5">
                    <span class="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded w-fit">状态栈</span>
                  </div>
                </th>
                <th class="px-3 py-3 text-left border w-32">
                  <div class="flex flex-col gap-0.5">
                    <span class="text-[10px] bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded w-fit">符号栈</span>
                  </div>
                </th>
                <th class="px-3 py-3 text-left border w-32">
                  <div class="flex flex-col gap-0.5">
                    <span class="text-[10px] bg-pink-100 text-pink-600 px-1.5 py-0.5 rounded w-fit">输入串</span>
                  </div>
                </th>
                <th class="px-4 py-3 text-left border min-w-[200px]">
                  <div class="flex items-center gap-2">
                    <span>标准答案</span>
                    <span class="text-[10px] bg-green-100 text-green-600 px-1.5 py-0.5 rounded">状态/符号/输入</span>
                  </div>
                </th>
                <th class="px-4 py-3 text-left border w-24">动作</th>
                <th class="px-4 py-3 text-center border w-16">状态</th>
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
                <td class="px-2 py-3 text-center border text-gray-500 font-medium">
                  {{ idx + 1 }}
                </td>

                <!-- 用户答案 - 状态栈 -->
                <td class="px-3 py-3 border break-all">
                  <div v-if="row.hasUserAction" class="flex flex-col gap-1">
                    <!-- 历史错误记录 -->
                    <div v-if="row.stateStackHistory && row.stateStackHistory.length > 0" class="mb-1">
                      <button 
                        @click="toggleHistory(idx, 'stateStack')"
                        class="text-[10px] text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-1"
                      >
                        <Icon :icon="isHistoryExpanded(idx, 'stateStack') ? 'lucide:chevron-down' : 'lucide:chevron-right'" class="w-3 h-3" />
                        历史错误 ({{ row.stateStackHistory.length }})
                      </button>
                      <div v-if="isHistoryExpanded(idx, 'stateStack')" class="flex flex-col gap-1">
                        <div 
                          v-for="(h, hi) in row.stateStackHistory" 
                          :key="hi"
                          class="relative group/err"
                        >
                          <span class="text-red-500 bg-red-50 border border-red-100 text-[10px] px-1.5 py-0.5 rounded line-through decoration-red-300 cursor-help inline-block">
                            {{ h.value }}
                          </span>
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
                          'text-green-700 font-medium': row.isStateStackCorrect,
                          'text-red-600 font-medium': !row.isStateStackCorrect
                        }"
                      >
                        {{ row.userStateStack || '-' }}
                      </span>
                      <Icon 
                        v-if="row.isStateStackCorrect" 
                        icon="lucide:check" 
                        class="w-4 h-4 text-green-500" 
                      />
                      <div v-else class="relative group/icon inline-block">
                        <Icon 
                          icon="lucide:x" 
                          class="w-4 h-4 text-red-500 cursor-help" 
                        />
                        <!-- Hint Tooltip on Icon -->
                        <div v-if="row.hint" class="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-1 w-56 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover/icon:opacity-100 group-hover/icon:visible transition-all duration-200 pointer-events-none text-left font-sans">
                          <div class="font-bold mb-1 border-b border-gray-600 pb-1">错误提示</div>
                          <div class="whitespace-pre-wrap">{{ row.hint }}</div>
                          <div class="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <span v-else class="text-gray-400 italic">未填写</span>
                </td>

                <!-- 用户答案 - 符号栈 -->
                <td class="px-4 py-3 border break-all">
                  <div v-if="row.hasUserAction" class="flex flex-col gap-1">
                    <!-- 历史错误记录 -->
                    <div v-if="row.symbolStackHistory && row.symbolStackHistory.length > 0" class="mb-1">
                      <button 
                        @click="toggleHistory(idx, 'symbolStack')"
                        class="text-[10px] text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-1"
                      >
                        <Icon :icon="isHistoryExpanded(idx, 'symbolStack') ? 'lucide:chevron-down' : 'lucide:chevron-right'" class="w-3 h-3" />
                        历史错误 ({{ row.symbolStackHistory.length }})
                      </button>
                      <div v-if="isHistoryExpanded(idx, 'symbolStack')" class="flex flex-col gap-1">
                        <div 
                          v-for="(h, hi) in row.symbolStackHistory" 
                          :key="hi"
                          class="relative group/err"
                        >
                          <span class="text-red-500 bg-red-50 border border-red-100 text-[10px] px-1.5 py-0.5 rounded line-through decoration-red-300 cursor-help inline-block">
                            {{ h.value }}
                          </span>
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
                          'text-green-700 font-medium': row.isSymbolStackCorrect,
                          'text-red-600 font-medium': !row.isSymbolStackCorrect
                        }"
                      >
                        {{ row.userSymbolStack || '-' }}
                      </span>
                      <Icon 
                        v-if="row.isSymbolStackCorrect" 
                        icon="lucide:check" 
                        class="w-4 h-4 text-green-500" 
                      />
                      <div v-else class="relative group/icon inline-block">
                        <Icon 
                          icon="lucide:x" 
                          class="w-4 h-4 text-red-500 cursor-help" 
                        />
                        <!-- Hint Tooltip on Icon -->
                        <div v-if="row.hint" class="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-1 w-56 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover/icon:opacity-100 group-hover/icon:visible transition-all duration-200 pointer-events-none text-left font-sans">
                          <div class="font-bold mb-1 border-b border-gray-600 pb-1">错误提示</div>
                          <div class="whitespace-pre-wrap">{{ row.hint }}</div>
                          <div class="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <span v-else class="text-gray-400 italic">未填写</span>
                </td>

                <!-- 用户答案 - 输入串 -->
                <td class="px-3 py-3 border break-all">
                  <div v-if="row.hasUserAction" class="flex flex-col gap-1">
                    <!-- 历史错误记录 -->
                    <div v-if="row.inputStringHistory && row.inputStringHistory.length > 0" class="mb-1">
                      <button 
                        @click="toggleHistory(idx, 'inputString')"
                        class="text-[10px] text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-1"
                      >
                        <Icon :icon="isHistoryExpanded(idx, 'inputString') ? 'lucide:chevron-down' : 'lucide:chevron-right'" class="w-3 h-3" />
                        历史错误 ({{ row.inputStringHistory.length }})
                      </button>
                      <div v-if="isHistoryExpanded(idx, 'inputString')" class="flex flex-col gap-1">
                        <div 
                          v-for="(h, hi) in row.inputStringHistory" 
                          :key="hi"
                          class="relative group/err"
                        >
                          <span class="text-red-500 bg-red-50 border border-red-100 text-[10px] px-1.5 py-0.5 rounded line-through decoration-red-300 cursor-help inline-block">
                            {{ h.value }}
                          </span>
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
                          'text-green-700 font-medium': row.isInputStringCorrect,
                          'text-red-600 font-medium': !row.isInputStringCorrect
                        }"
                      >
                        {{ row.userInputString || '-' }}
                      </span>
                      <Icon 
                        v-if="row.isInputStringCorrect" 
                        icon="lucide:check" 
                        class="w-4 h-4 text-green-500" 
                      />
                      <div v-else class="relative group/icon inline-block">
                        <Icon 
                          icon="lucide:x" 
                          class="w-4 h-4 text-red-500 cursor-help" 
                        />
                        <!-- Hint Tooltip on Icon -->
                        <div v-if="row.hint" class="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-1 w-56 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover/icon:opacity-100 group-hover/icon:visible transition-all duration-200 pointer-events-none text-left font-sans">
                          <div class="font-bold mb-1 border-b border-gray-600 pb-1">错误提示</div>
                          <div class="whitespace-pre-wrap">{{ row.hint }}</div>
                          <div class="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <span v-else class="text-gray-400 italic">未填写</span>
                </td>

                <!-- 标准答案 -->
                <td class="px-4 py-3 border bg-green-50/50">
                  <div class="flex flex-col gap-1">
                    <div class="flex items-center gap-2">
                      <span class="text-[10px] text-gray-500">状态栈:</span>
                      <span class="text-green-800 font-medium">{{ row.correctStateStack }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="text-[10px] text-gray-500">符号栈:</span>
                      <span class="text-green-800 font-medium">{{ row.correctSymbolStack }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="text-[10px] text-gray-500">输入串:</span>
                      <span class="text-green-800 font-medium">{{ row.correctInputString }}</span>
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

        <!-- 分析规则提示 -->
        <div class="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
          <div class="flex items-start gap-3">
            <Icon icon="lucide:lightbulb" class="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
            <div class="text-sm text-indigo-700">
              <p class="font-medium mb-2">LR0移进-规约分析规则：</p>
              <ul class="space-y-1 text-xs">
                <li>• <strong>移进(Si)：</strong>将输入符号压入符号栈，状态i压入状态栈</li>
                <li>• <strong>规约(rj)：</strong>根据产生式j弹出栈中符号和状态，压入产生式左部符号</li>
                <li>• <strong>接受(acc)：</strong>分析成功完成</li>
                <li>• <strong>错误：</strong>无对应动作，分析失败</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'
import type { LR0ErrorLog } from '@/stores'

// 定义输入串分析结果类型（与后端返回格式一致）
interface InputAnalysisResult {
  info_res: string
  info_step: number[]
  info_msg: string[]
  info_state_stack: string[]
  info_symbol_stack: string[]
  info_str: string[]
  info_action?: string[]
}

interface Props {
  step5Data?: {
    userSteps: Array<{ stateStack: string; symbolStack: string; inputString: string }>
  }
  inputAnalysisResult?: InputAnalysisResult
  inputString?: string
  errorLogs?: LR0ErrorLog[]
}

const props = defineProps<Props>()

// 历史记录展开状态
const expandedHistory = ref<Map<string, Set<number>>>(new Map())

const toggleHistory = (idx: number, field: string) => {
  const key = `${field}`
  if (!expandedHistory.value.has(key)) {
    expandedHistory.value.set(key, new Set())
  }
  const set = expandedHistory.value.get(key)!
  if (set.has(idx)) {
    set.delete(idx)
  } else {
    set.add(idx)
  }
}

const isHistoryExpanded = (idx: number, field: string): boolean => {
  const key = `${field}`
  return expandedHistory.value.get(key)?.has(idx) || false
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

  const result = props.inputAnalysisResult
  const standardSteps = result.info_step || []
  const standardStateStacks = result.info_state_stack || []
  const standardSymbolStacks = result.info_symbol_stack || []
  const standardInputStrings = result.info_str || []
  // 优先使用 info_action，如果不存在则使用 info_msg
  const standardActions = result.info_action || result.info_msg || []

  // 用户步骤
  const userSteps = props.step5Data?.userSteps || []

  const rows: RowData[] = []

  for (let i = 0; i < standardSteps.length; i++) {
    const correctStateStack = standardStateStacks[i] || ''
    const correctSymbolStack = standardSymbolStacks[i] || ''
    const correctInputString = standardInputStrings[i] || ''
    const action = standardActions[i] || ''

    let userStateStack = ''
    let userSymbolStack = ''
    let userInputString = ''
    let hasUserAction = false

    // 从 userSteps 获取用户答案
    if (i < userSteps.length) {
      userStateStack = userSteps[i].stateStack || ''
      userSymbolStack = userSteps[i].symbolStack || ''
      userInputString = userSteps[i].inputString || ''
      hasUserAction = true
    }

    // 第一行是预设的初始状态，使用标准答案作为用户答案
    if (i === 0) {
      userStateStack = correctStateStack
      userSymbolStack = correctSymbolStack
      userInputString = correctInputString
      hasUserAction = true
    }

    // 查找历史错误记录
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
          if (wrongValue) {
            // 尝试解析不同格式的错误值
            const stateMatch = wrongValue.match(/状态栈:\s*([^,]+)/i)
            const symbolMatch = wrongValue.match(/符号栈:\s*([^,]+)/i)
            const inputMatch = wrongValue.match(/输入串:\s*([^,]+)/i)

            const wrongStateStack = stateMatch ? stateMatch[1].trim() : ''
            const wrongSymbolStack = symbolMatch ? symbolMatch[1].trim() : ''
            const wrongInputString = inputMatch ? inputMatch[1].trim() : ''

            // 如果没有 userSteps 数据，使用错误日志中的值
            if (!hasUserAction) {
              if (wrongStateStack) userStateStack = wrongStateStack
              if (wrongSymbolStack) userSymbolStack = wrongSymbolStack
              if (wrongInputString) userInputString = wrongInputString
              hasUserAction = true
            }

            // 添加到历史记录
            if (wrongStateStack && !seenStateStack.has(wrongStateStack) && wrongStateStack !== correctStateStack) {
              stateStackHistory.push({ value: wrongStateStack, hint: log.hint })
              seenStateStack.add(wrongStateStack)
            }

            if (wrongSymbolStack && !seenSymbolStack.has(wrongSymbolStack) && wrongSymbolStack !== correctSymbolStack) {
              symbolStackHistory.push({ value: wrongSymbolStack, hint: log.hint })
              seenSymbolStack.add(wrongSymbolStack)
            }

            if (wrongInputString && !seenInputString.has(wrongInputString) && wrongInputString !== correctInputString) {
              inputStringHistory.push({ value: wrongInputString, hint: log.hint })
              seenInputString.add(wrongInputString)
            }
          }
        }
      })
    }

    const isStateStackCorrect = userStateStack.replace(/\s+/g, '') === correctStateStack.replace(/\s+/g, '')
    const isSymbolStackCorrect = userSymbolStack.replace(/\s+/g, '') === correctSymbolStack.replace(/\s+/g, '')
    const isInputStringCorrect = userInputString.replace(/\s+/g, '') === correctInputString.replace(/\s+/g, '')

    rows.push({
      stepIndex: i,
      correctStateStack,
      correctSymbolStack,
      correctInputString,
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

  return rows
})
</script>

<style scoped>
.lr0-step5-report {
  width: 100%;
}
</style>
