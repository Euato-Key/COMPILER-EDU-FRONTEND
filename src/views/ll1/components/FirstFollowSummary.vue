<template>
  <div class="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-slate-200 shadow-sm">
    <div class="flex items-center mb-6">
      <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
        <Icon icon="lucide:database" class="w-5 h-5 text-white" />
      </div>
      <h3 class="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">First/Follow集摘要</h3>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- First集 -->
      <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-blue-200/50 shadow-sm">
        <div class="flex items-center mb-3">
          <div class="w-7 h-7 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center mr-2">
            <Icon icon="lucide:arrow-right" class="w-3.5 h-3.5 text-white" />
          </div>
          <h4 class="text-base font-semibold text-emerald-800">First集（非终结符）</h4>
        </div>
        <div class="space-y-2">
          <div v-for="(symbols, symbol) in firstSets" :key="`first-${symbol}`" class="group">
            <!-- 只显示非终结符的First集 -->
            <template v-if="vn.includes(symbol as string)">
              <div class="flex items-center p-2 rounded-lg border border-emerald-200/50 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 hover:from-emerald-100/70 hover:to-teal-100/70 transition-all duration-200 shadow-sm hover:shadow-md"
                   :class="{ 'ring-2 ring-yellow-400 ring-opacity-60 shadow-lg': symbolHighlightState[symbol] }">
                <div class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center mr-3 shadow-sm">
                  <span class="font-mono font-bold text-white text-base">{{ symbol }}</span>
                </div>
                <div class="flex-1">
                  <div class="text-xs text-emerald-700 font-medium mb-1">First({{ symbol }})</div>
                  <div class="flex flex-wrap gap-1">
                    <span
                      v-for="(sym, index) in symbols"
                      :key="`${symbol}-${sym}-${index}`"
                      class="inline-flex items-center px-1.5 py-0.5 text-xs font-mono bg-emerald-100 text-emerald-800 rounded border border-emerald-200 shadow-sm"
                      :class="{ 'bg-yellow-200 border-yellow-300 ring-1 ring-yellow-400': symbolHighlightState[symbol] }"
                    >
                      {{ sym === 'ε' ? 'ε' : sym }}
                    </span>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>

      <!-- Follow集 -->
      <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-indigo-200/50 shadow-sm">
        <div class="flex items-center mb-3">
          <div class="w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-2">
            <Icon icon="lucide:arrow-left" class="w-3.5 h-3.5 text-white" />
          </div>
          <h4 class="text-base font-semibold text-indigo-800">Follow集</h4>
        </div>
        <div class="space-y-2">
          <div v-for="(symbols, symbol) in followSets" :key="`follow-${symbol}`" class="group">
            <div class="flex items-center p-2 rounded-lg border border-indigo-200/50 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 hover:from-indigo-100/70 hover:to-purple-100/70 transition-all duration-200 shadow-sm hover:shadow-md"
                 :class="{ 'ring-2 ring-yellow-400 ring-opacity-60 shadow-lg': symbolHighlightState[symbol] }">
              <div class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-3 shadow-sm">
                <span class="font-mono font-bold text-white text-base">{{ symbol }}</span>
              </div>
              <div class="flex-1">
                <div class="text-xs text-indigo-700 font-medium mb-1">Follow({{ symbol }})</div>
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="(sym, index) in symbols"
                    :key="`${symbol}-${sym}-${index}`"
                    class="inline-flex items-center px-1.5 py-0.5 text-xs font-mono bg-indigo-100 text-indigo-800 rounded border border-indigo-200 shadow-sm"
                    :class="{ 'bg-yellow-200 border-yellow-300 ring-1 ring-yellow-400': symbolHighlightState[symbol] }"
                  >
                    {{ sym === '#' ? '#' : sym }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 构建规则 -->
      <div class="bg-white/70 backdrop-blur-sm rounded-xl p-5 border border-purple-200/50 shadow-sm">
        <div class="flex items-center mb-4">
          <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mr-3">
            <Icon icon="lucide:book-open" class="w-4 h-4 text-white" />
          </div>
          <h4 class="text-lg font-semibold text-purple-800">构建规则</h4>
        </div>
        <div class="space-y-4 text-sm text-gray-700">
          <div class="flex items-start">
            <span class="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            <div>
              <span class="font-semibold text-purple-800">步骤 1：</span>对于每个产生式 A → α，执行以下步骤：
              <div class="ml-4 mt-2 space-y-2">
                <div class="flex items-start">
                  <span class="w-1.5 h-1.5 bg-purple-300 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span :class="{ 'bg-yellow-200 px-1 rounded': ruleHighlightState['对每个终结符a ∈ First(A)，将A->α加入到M[A, a]'] }">
                    对每个终结符 <span class="font-mono text-purple-600">a ∈ First(A)</span> ，将 <span class="font-mono text-purple-600">A->α </span>加入到  <span class="font-mono text-purple-600">M[A, a]</span>
                  </span>
                </div>
                <div class="flex items-start">
                  <span class="w-1.5 h-1.5 bg-purple-300 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span :class="{ 'bg-yellow-200 px-1 rounded': ruleHighlightState['如果ε ∈ First(A)，对于Follow(A)中的每个终结符b，将A->ε加入到M[A, b]'] }">
                    如果 <span class="font-mono text-purple-600">ε ∈ First(A)</span>，对于 <span class="font-mono text-purple-600">Follow(A)</span> 中的每个终结符 <span class="font-mono text-purple-600">b</span>，将 <span class="font-mono text-purple-600">A->ε</span> 加入到 <span class="font-mono text-purple-600">M[A, b]</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="flex items-start">
            <span class="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            <span><span class="font-semibold text-purple-800">步骤 2：</span>将所有无定义的条目标记为错误</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

defineProps<{
  firstSets: Record<string, string[]>
  followSets: Record<string, string[]>
  vn: string[]
  symbolHighlightState: Record<string, boolean>
  ruleHighlightState: Record<string, boolean>
}>()
</script>
