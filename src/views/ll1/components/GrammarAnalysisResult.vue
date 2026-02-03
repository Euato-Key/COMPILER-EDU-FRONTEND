<template>
  <div v-if="data" class="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6 shadow-xl">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
          <Icon icon="lucide:zap" class="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 class="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            当前文法分析结果
          </h4>
          <p class="text-sm text-gray-700 mt-0.5 font-medium">LL(1)文法分析完成</p>
        </div>
      </div>
      <div class="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full shadow-lg">
        <Icon icon="lucide:check-circle" class="w-3 h-3 text-white" />
        <span class="text-sm font-semibold text-white">LL(1)文法</span>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 左侧统计信息 -->
      <div class="lg:col-span-1">
        <div class="grid grid-cols-2 gap-4 h-full">
          <div class="bg-white rounded-lg p-4 border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex flex-col">
            <div class="flex items-center gap-2 mb-3">
              <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Icon icon="lucide:play" class="w-4 h-4 text-white" />
              </div>
              <span class="text-sm font-semibold text-gray-800">起始符号</span>
            </div>
            <p class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-mono">{{ data.S }}</p>
          </div>

          <div class="bg-white rounded-lg p-4 border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex flex-col">
            <div class="flex items-center gap-2 mb-3">
              <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Icon icon="lucide:tag" class="w-4 h-4 text-white" />
              </div>
              <span class="text-sm font-semibold text-gray-800">非终结符</span>
            </div>
            <p class="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent font-mono">{{ data.Vn.length }}</p>
            <p class="text-sm font-semibold text-gray-700 mt-1 font-mono">{{ data.Vn.join(', ') }}</p>
          </div>

          <div class="bg-white rounded-lg p-4 border-2 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex flex-col">
            <div class="flex items-center gap-2 mb-3">
              <div class="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <Icon icon="lucide:hash" class="w-4 h-4 text-white" />
              </div>
              <span class="text-sm font-semibold text-gray-800">终结符</span>
            </div>
            <p class="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent font-mono">{{ data.Vt.length }}</p>
            <p class="text-sm font-semibold text-gray-700 mt-1 font-mono">{{ data.Vt.join(', ') }}</p>
          </div>

          <div class="bg-white rounded-lg p-4 border-2 border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex flex-col">
            <div class="flex items-center gap-2 mb-3">
              <div class="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Icon icon="lucide:list" class="w-4 h-4 text-white" />
              </div>
              <span class="text-sm font-semibold text-gray-800">产生式数</span>
            </div>
            <p class="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent font-mono">
              {{ Object.keys(data.formulas_dict).length }}
            </p>
          </div>
        </div>
      </div>

      <!-- 右侧文法信息 -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg border-2 border-blue-200 p-4 shadow-lg h-full flex flex-col">
          <div class="flex items-center gap-2 mb-4">
            <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Icon icon="lucide:file-text" class="w-4 h-4 text-white" />
            </div>
            <div>
              <h5 class="text-base font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                文法信息
              </h5>
              <p class="text-sm text-gray-600 font-medium">Grammar Information</p>
            </div>
          </div>
          <div class="space-y-1.5 flex-1">
            <div
              v-for="(productions, nonTerminal) in data.formulas_dict"
              :key="nonTerminal"
              class="flex items-center gap-2 p-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-md border border-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-blue-300 transition-all duration-200"
            >
              <span class="text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-mono">{{ nonTerminal }}</span>
              <span class="text-gray-400 font-mono text-sm">→</span>
              <span class="font-mono text-gray-800 text-sm flex-1 font-semibold">{{ productions.join(' | ') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { LL1AnalysisResult } from '@/types'

defineProps<{
  data: LL1AnalysisResult | null
}>()
</script>
