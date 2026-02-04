<template>
  <div class="ll1-step2-report space-y-6">
    <!-- First Sets Section -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
      <div class="px-6 py-4 bg-indigo-50 border-b border-indigo-100 flex items-center justify-between">
        <h3 class="text-lg font-bold text-indigo-900 flex items-center gap-2">
          <Icon icon="lucide:list-start" class="w-5 h-5 text-indigo-600" />
          First 集合分析  
        </h3>
        <span class="text-xs font-medium px-2 py-1 bg-white text-indigo-600 rounded-lg border border-indigo-100">Step 2-1</span>
      </div>
      
      <div class="p-6">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr class="bg-gray-50">
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">非终结符</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">学生作答</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">标准答案</th>
                <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">状态</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200 text-sm">
              <tr v-for="vn in nonTerminals" :key="`first-${vn}`" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap font-mono font-bold text-gray-900 bg-gray-50/50">{{ vn }}</td>
                <td class="px-6 py-4 whitespace-nowrap font-mono text-gray-700 relative group">
                  <div class="flex flex-col gap-2">
                    <!-- Historical Errors with Hints -->
                    <div v-if="getErrorHistory(vn, 'firstSet').length > 0" class="flex flex-wrap gap-2 opacity-70 mb-1">
                        <div 
                           v-for="(err, eIdx) in getErrorHistory(vn, 'firstSet')" 
                           :key="`err-${eIdx}`"
                           class="relative group/err"
                        >
                            <span class="px-2 py-1 bg-red-50 text-red-600 rounded text-[10px] line-through decoration-red-400 border border-red-100 cursor-help block">
                                {{ err.value }}
                            </span>
                            <!-- Historical Hint Tooltip -->
                            <div v-if="err.hint" class="absolute z-50 top-full left-1/2 transform -translate-x-1/2 mt-1 w-48 p-2 bg-gray-700 text-white text-[10px] rounded shadow-xl opacity-0 invisible group-hover/err:opacity-100 group-hover/err:visible transition-all duration-200 pointer-events-none text-left">
                                <div class="font-bold mb-1 border-b border-gray-500 pb-0.5">历史错误提示</div>
                                <div class="whitespace-pre-wrap">{{ err.hint }}</div>
                                <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-gray-700"></div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Current Answer -->
                    <div class="flex flex-wrap gap-2 items-center">
                        <template v-if="!getUserFirstSet(vn)">
                            <span class="text-gray-400 italic text-xs">(未填写)</span>
                        </template>
                        <template v-else>
                            <div class="flex flex-wrap gap-2">
                                <span 
                                    v-for="(symbol, idx) in splitSet(getUserFirstSet(vn))" 
                                    :key="idx" 
                                    class="px-2 py-1 rounded text-xs border"
                                    :class="isSymbolCorrect(symbol, getCorrectFirstSet(vn)) ? 'bg-green-50 text-green-700 border-green-100' : 'text-red-600 font-bold bg-red-50 border-red-100'"
                                >
                                    {{ symbol }}
                                </span>
                            </div>
                        </template>
                        <!-- Corrected Badge -->
                        <span v-if="isSetEqual(getUserFirstSet(vn), getCorrectFirstSet(vn)) && getErrorHistory(vn, 'firstSet').length > 0" 
                              class="text-[8px] bg-green-100 px-1.5 py-0.5 rounded text-green-600 border border-green-200">
                              已修正
                        </span>
                    </div>
                  </div>

                  <!-- Hint Tooltip (showing latest hint if any) - appears BELOW to avoid clipping -->
                  <div v-if="getHint(vn, 'firstSet')" class="absolute z-50 top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none">
                     <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-gray-800"></div>
                     <div class="font-bold mb-1 border-b border-gray-600 pb-1">错误提示</div>
                     <div class="whitespace-pre-wrap">{{ getHint(vn, 'firstSet') }}</div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap font-mono text-gray-600">
                   <div class="flex flex-wrap gap-2">
                    <span 
                      v-for="(symbol, idx) in splitSet(getCorrectFirstSet(vn))" 
                      :key="idx" 
                      class="px-2 py-1 bg-green-50 text-green-700 border border-green-100 rounded text-xs"
                    >
                      {{ symbol }}
                    </span>
                   </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <Icon 
                    v-if="isSetEqual(getUserFirstSet(vn), getCorrectFirstSet(vn))" 
                    icon="lucide:check-circle" 
                    class="w-6 h-6 text-green-500 mx-auto" 
                  />
                  <div v-else class="relative group inline-block">
                    <Icon 
                        icon="lucide:x-circle" 
                        class="w-6 h-6 text-red-500 mx-auto cursor-help" 
                    />
                     <!-- Hint Tooltip on Icon - appears BELOW -->
                     <div v-if="getHint(vn, 'firstSet')" class="absolute z-50 top-full right-0 mt-2 w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none text-left">
                         <div class="absolute bottom-full right-4 border-4 border-transparent border-b-gray-800"></div>
                         <div class="font-bold mb-1 border-b border-gray-600 pb-1">错误提示</div>
                         <div class="whitespace-pre-wrap">{{ getHint(vn, 'firstSet') }}</div>
                     </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Follow Sets Section -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
      <div class="px-6 py-4 bg-purple-50 border-b border-purple-100 flex items-center justify-between">
        <h3 class="text-lg font-bold text-purple-900 flex items-center gap-2">
          <Icon icon="lucide:list-end" class="w-5 h-5 text-purple-600" />
          Follow 集合分析
        </h3>
        <span class="text-xs font-medium px-2 py-1 bg-white text-purple-600 rounded-lg border border-purple-100">Step 2-2</span>
      </div>
      
      <div class="p-6">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr class="bg-gray-50">
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">非终结符</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">学生作答</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">标准答案</th>
                <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">状态</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200 text-sm">
              <tr v-for="vn in nonTerminals" :key="`follow-${vn}`" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap font-mono font-bold text-gray-900 bg-gray-50/50">{{ vn }}</td>
                <td class="px-6 py-4 whitespace-nowrap font-mono text-gray-700 relative group">
                  <div class="flex flex-col gap-2">
                    <!-- Historical Errors with Hints -->
                    <div v-if="getErrorHistory(vn, 'followSet').length > 0" class="flex flex-wrap gap-2 opacity-70 mb-1">
                        <div 
                           v-for="(err, eIdx) in getErrorHistory(vn, 'followSet')" 
                           :key="`err-${eIdx}`"
                           class="relative group/err"
                        >
                            <span class="px-2 py-1 bg-red-50 text-red-600 rounded text-[10px] line-through decoration-red-400 border border-red-100 cursor-help block">
                                {{ err.value }}
                            </span>
                            <!-- Historical Hint Tooltip -->
                            <div v-if="err.hint" class="absolute z-50 top-full left-1/2 transform -translate-x-1/2 mt-1 w-48 p-2 bg-gray-700 text-white text-[10px] rounded shadow-xl opacity-0 invisible group-hover/err:opacity-100 group-hover/err:visible transition-all duration-200 pointer-events-none text-left">
                                <div class="font-bold mb-1 border-b border-gray-500 pb-0.5">历史错误提示</div>
                                <div class="whitespace-pre-wrap">{{ err.hint }}</div>
                                <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-gray-700"></div>
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-wrap gap-2 items-center">
                        <template v-if="!getUserFollowSet(vn)">
                            <span class="text-gray-400 italic text-xs">(未填写)</span>
                        </template>
                        <template v-else>
                            <div class="flex flex-wrap gap-2">
                                <span 
                                    v-for="(symbol, idx) in splitSet(getUserFollowSet(vn))" 
                                    :key="idx" 
                                    class="px-2 py-1 rounded text-xs border"
                                    :class="isSymbolCorrect(symbol, getCorrectFollowSet(vn)) ? 'bg-green-50 text-green-700 border-green-100' : 'text-red-600 font-bold bg-red-50 border-red-100'"
                                >
                                    {{ symbol }}
                                </span>
                            </div>
                        </template>
                        <!-- Corrected Badge -->
                        <span v-if="isSetEqual(getUserFollowSet(vn), getCorrectFollowSet(vn)) && getErrorHistory(vn, 'followSet').length > 0" 
                              class="text-[8px] bg-green-100 px-1.5 py-0.5 rounded text-green-600 border border-green-200">
                              已修正
                        </span>
                    </div>
                  </div>

                  <!-- Hint Tooltip - appears BELOW -->
                  <div v-if="getHint(vn, 'followSet')" class="absolute z-50 top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none text-left">
                     <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-gray-800"></div>
                     <div class="font-bold mb-1 border-b border-gray-600 pb-1">错误提示</div>
                     <div class="whitespace-pre-wrap">{{ getHint(vn, 'followSet') }}</div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap font-mono text-gray-600">
                   <div class="flex flex-wrap gap-2">
                    <span 
                      v-for="(symbol, idx) in splitSet(getCorrectFollowSet(vn))" 
                      :key="idx" 
                      class="px-2 py-1 bg-green-50 text-green-700 border border-green-100 rounded text-xs"
                    >
                      {{ symbol }}
                    </span>
                   </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <Icon 
                    v-if="isSetEqual(getUserFollowSet(vn), getCorrectFollowSet(vn))" 
                    icon="lucide:check-circle" 
                    class="w-6 h-6 text-green-500 mx-auto" 
                  />
                  <div v-else class="relative group inline-block">
                     <Icon 
                        icon="lucide:x-circle" 
                        class="w-6 h-6 text-red-500 mx-auto cursor-help" 
                    />
                    <!-- Hint Tooltip on Icon - appears BELOW -->
                     <div v-if="getHint(vn, 'followSet')" class="absolute z-50 top-full right-0 mt-2 w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none text-left">
                         <div class="absolute bottom-full right-4 border-4 border-transparent border-b-gray-800"></div>
                         <div class="font-bold mb-1 border-b border-gray-600 pb-1">错误提示</div>
                         <div class="whitespace-pre-wrap">{{ getHint(vn, 'followSet') }}</div>
                     </div>
                  </div>
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
import type { LL1ErrorLog } from '@/stores/ll1-new'

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

function splitSet(str: string) {
  if (!str) return []
  return str.split(' ').filter(s => s.trim() !== '').sort()
}

function isSetEqual(userStr: string, correctStr: string) {
  const userSet = new Set(splitSet(userStr))
  const correctSet = new Set(splitSet(correctStr))
  
  if (userSet.size !== correctSet.size) return false
  for (const s of userSet) {
    if (!correctSet.has(s)) return false
  }
  return true
}

function isSymbolCorrect(symbol: string, correctStr: string) {
    const correctSet = new Set(splitSet(correctStr))
    return correctSet.has(symbol)
}

function getHint(vn: string, type: 'firstSet' | 'followSet') {
    if (!props.errorLogs) return null
    // Find the latest error log for this item that has a hint
    const logs = props.errorLogs.filter(log => 
        log.step === 'step2' && 
        log.type === type && 
        log.location.row === vn &&
        log.hint
    )
    if (logs.length === 0) return null
    // Return the hint from the latest log (assuming last one is most relevant or just take first found)
    // The logs are usually pushed in chronological order, so the last one is the latest.
    return logs[logs.length - 1].hint
}

function getErrorHistory(vn: string, type: 'firstSet' | 'followSet') {
    if (!props.errorLogs) return []
    const logs = props.errorLogs.filter(log => 
        log.step === 'step2' && 
        log.type === type && 
        log.location.row === vn
    )
    
    // Result array to preserve order
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
/* Scoped styles if needed */
</style>
