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
                <th class="px-4 py-3 text-left border">分析栈 (Stack)</th>
                <th class="px-4 py-3 text-right border">剩余输入串 (Input)</th>
                <th class="px-4 py-3 text-left border">动作 / 产生式</th>
                <th class="px-4 py-3 text-center border w-24">状态</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200 text-sm font-mono">
              <tr 
                v-for="(row, idx) in rows" 
                :key="idx" 
                class="hover:bg-gray-50 transition-colors"
                :class="{'bg-red-50/30': !row.isCorrect && row.hasUserAction}"
              >
                <!-- 步骤序号 -->
                <td class="px-4 py-3 text-center border text-gray-500">
                  {{ idx + 1 }}
                </td>

                 <!-- 分析栈 -->
                 <td class="px-4 py-3 border text-gray-800 break-all relative group">
                   <div class="flex flex-col gap-1 items-start">
                       <!-- History with Hints -->
                        <div v-if="row.stackHistory && row.stackHistory.length > 0" class="flex flex-wrap gap-1 opacity-70 w-full mb-1">
                           <div 
                             v-for="(h, hi) in row.stackHistory" 
                             :key="hi"
                             class="relative group/err"
                           >
                              <span class="text-red-500 bg-red-50 border border-red-100 text-[10px] px-1.5 py-0.5 rounded line-through decoration-red-300 w-fit cursor-help block">
                                 {{ h.value }}
                              </span>
                              <!-- Historical Hint Tooltip -->
                              <div v-if="h.hint" class="absolute z-50 top-full left-0 mt-1 w-48 p-2 bg-gray-700 text-white text-[10px] rounded shadow-xl opacity-0 invisible group-hover/err:opacity-100 group-hover/err:visible transition-all duration-200 pointer-events-none text-left font-sans">
                                 <div class="font-bold mb-1 border-b border-gray-500 pb-0.5">历史错误提示</div>
                                 <div class="whitespace-pre-wrap">{{ h.hint }}</div>
                                 <div class="absolute bottom-full left-4 border-4 border-transparent border-b-gray-700"></div>
                              </div>
                           </div>
                        </div>

                       <div v-if="row.isStackCorrect || !row.hasUserAction" class="flex items-center gap-2">
                          <span>{{ row.stack }}</span>
                          <span v-if="row.hasUserAction && row.isStackCorrect && row.stackHistory.length > 0" class="text-[8px] bg-green-100 px-1 rounded text-green-600 border border-green-200">已修正</span>
                       </div>
                       <div v-else class="flex flex-col gap-1 cursor-help w-full">
                           <span class="text-red-600 line-through decoration-red-400 opacity-70">{{ row.userStack }}</span>
                           <span class="text-green-700 font-bold bg-green-50 px-1 rounded inline-block w-fit">{{ row.stack }}</span>
                       </div>
                   </div>
                   <!-- Latest Hint Tooltip -->
                   <div v-if="row.hint && !row.isCorrect" class="absolute z-10 top-full left-1/2 transform -translate-x-1/2 mt-1 w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none text-left font-sans">
                      <div class="font-bold mb-1 border-b border-gray-600 pb-1">错误提示</div>
                      <div class="whitespace-pre-wrap">{{ row.hint }}</div>
                      <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-gray-800"></div>
                   </div>
                 </td>

                 <!-- 剩余输入 -->
                 <td class="px-4 py-3 border text-right text-gray-800 break-all relative group">
                    <div class="flex flex-col gap-1 items-end w-full">
                        <!-- History with Hints -->
                        <div v-if="row.inputHistory && row.inputHistory.length > 0" class="flex flex-wrap gap-1 opacity-70 w-full items-end justify-end mb-1">
                           <div 
                             v-for="(h, hi) in row.inputHistory" 
                             :key="hi"
                             class="relative group/err"
                           >
                              <span class="text-red-500 bg-red-50 border border-red-100 text-[10px] px-1.5 py-0.5 rounded line-through decoration-red-300 w-fit cursor-help block">
                                 {{ h.value }}
                              </span>
                               <!-- Historical Hint Tooltip -->
                               <div v-if="h.hint" class="absolute z-50 top-full right-0 mt-1 w-48 p-2 bg-gray-700 text-white text-[10px] rounded shadow-xl opacity-0 invisible group-hover/err:opacity-100 group-hover/err:visible transition-all duration-200 pointer-events-none text-left font-sans">
                                 <div class="font-bold mb-1 border-b border-gray-500 pb-0.5">历史错误提示</div>
                                 <div class="whitespace-pre-wrap">{{ h.hint }}</div>
                                 <div class="absolute bottom-full right-4 border-4 border-transparent border-b-gray-700"></div>
                              </div>
                           </div>
                        </div>

                        <div v-if="row.isInputCorrect || !row.hasUserAction" class="flex items-center gap-2">
                          <span v-if="row.hasUserAction && row.isInputCorrect && row.inputHistory.length > 0" class="text-[8px] bg-green-100 px-1 rounded text-green-600 border border-green-200">已修正</span>
                          <span>{{ row.input }}</span>
                       </div>
                       <div v-else class="flex flex-col gap-1 items-end cursor-help w-full">
                           <span class="text-red-600 line-through decoration-red-400 opacity-70">{{ row.userInput }}</span>
                           <span class="text-green-700 font-bold bg-green-50 px-1 rounded inline-block w-fit">{{ row.input }}</span>
                       </div>
                    </div>
                    <!-- Latest Hint Tooltip -->
                    <div v-if="row.hint && !row.isCorrect" class="absolute z-10 top-full right-0 mt-1 w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none text-left font-sans">
                      <div class="font-bold mb-1 border-b border-gray-600 pb-1">错误提示</div>
                      <div class="whitespace-pre-wrap">{{ row.hint }}</div>
                      <div class="absolute bottom-full right-4 border-4 border-transparent border-b-gray-800"></div>
                   </div>
                 </td>

                <!-- 动作说明 -->
                <td class="px-4 py-3 border text-gray-600 text-xs">
                  <span v-if="row.action" class="bg-blue-50 text-blue-700 px-2 py-1 rounded">
                    {{ row.action }}
                  </span>
                  <span v-else class="text-gray-300">-</span>
                </td>

                  <!-- 状态 -->
                 <td class="px-4 py-3 border text-center">
                     <template v-if="row.hasUserAction">
                         <Icon v-if="row.isCorrect" icon="lucide:check" class="w-5 h-5 text-green-500 mx-auto" />
                         <div v-else class="relative group/status inline-block">
                              <Icon icon="lucide:x" class="w-5 h-5 text-red-500 mx-auto cursor-help" />
                               <!-- Hint Tooltip -->
                               <div v-if="row.hint" class="absolute z-50 top-full right-0 transform translate-x-1/2 mt-1 w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover/status:opacity-100 group-hover/status:visible transition-all duration-200 pointer-events-none text-left font-sans">
                                  <div class="font-bold mb-1 border-b border-gray-600 pb-1">错误提示</div>
                                  <div class="whitespace-pre-wrap">{{ row.hint }}</div>
                                  <div class="absolute bottom-full right-1/2 transform translate-x-1/2 border-4 border-transparent border-b-gray-800"></div>
                               </div>
                         </div>
                     </template>
                    <span v-else class="text-gray-300 text-xs text-center block">未做</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import type { AnalysisStepInfo } from '@/types/ll1'
import type { LL1ErrorLog } from '@/stores/ll1-new'

interface Props {
  step4Data?: {
    userSteps: Array<{ stack: string; input: string }>
  }
  inputAnalysisResult?: AnalysisStepInfo
  errorLogs?: LL1ErrorLog[]
}

const props = defineProps<Props>()

const rows = computed(() => {
    if (!props.inputAnalysisResult) return []
    
    // Standard standard steps
    const standardStacks = props.inputAnalysisResult.info_stack || []
    const standardInputs = props.inputAnalysisResult.info_str || []
    const standardActions = props.inputAnalysisResult.info_msg || []
    
    // User steps
    const userSteps = props.step4Data?.userSteps || []
    
    const count = Math.max(standardStacks.length, userSteps.length)
    const result: Array<{
        stepIndex: number;
        stack: string;
        input: string;
        action: string;
        userStack: string;
        userInput: string;
        hasUserAction: boolean;
        isCorrect: boolean;
        hint?: string;
        stackHistory: string[];
        inputHistory: string[];
    }> = []
    
    for (let i = 0; i < standardStacks.length; i++) {
        const correctStack = standardStacks[i]
        const correctInput = standardInputs[i]
        const action = standardActions[i] || ''
        
        let userStack = ''
        let userInput = ''
        let hasUserAction = false
        
        if (i < userSteps.length) {
            userStack = userSteps[i].stack
            userInput = userSteps[i].input
            hasUserAction = true
        }
        
        let isStackCorrect = userStack.replace(/\s+/g, '') === correctStack.replace(/\s+/g, '')
        let isInputCorrect = userInput.replace(/\s+/g, '') === correctInput.replace(/\s+/g, '')
        
        // Find history
        const stackHistory: Array<{ value: string; hint: string | undefined }> = []
        const inputHistory: Array<{ value: string; hint: string | undefined }> = []
        const seenStack = new Set<string>()
        const seenInput = new Set<string>()
        
        if (props.errorLogs) {
            props.errorLogs.forEach(log => {
                if (log.step === 'step4' && log.type === 'analysisStep' && log.location.stepIndex === i) {
                    if (log.hint) hint = log.hint // Latest hint for current state
                    
                    const val = log.wrongValue?.trim() || ''
                    if (val !== '') {
                        if (log.location.fieldKey === 'stack' || log.location.fieldKey?.includes('stack')) {
                            if (!seenStack.has(val) && val !== userStack) {
                                stackHistory.push({ value: val, hint: log.hint })
                                seenStack.add(val)
                            }
                        } else if (log.location.fieldKey === 'input' || log.location.fieldKey?.includes('input')) {
                             if (!seenInput.has(val) && val !== userInput) {
                                inputHistory.push({ value: val, hint: log.hint })
                                seenInput.add(val)
                             }
                        }
                    }
                }
            })
        }

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
