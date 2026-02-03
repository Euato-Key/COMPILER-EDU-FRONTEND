<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { LL1AnalysisResult } from '@/types'

defineProps<{
  originalData: LL1AnalysisResult
  symbolHighlightState: Record<string, boolean>
  productionHighlightState: Record<string, boolean>
}>()

const emit = defineEmits<{
  (e: 'dragstart', symbol: string, event: DragEvent): void
  (e: 'symbol-dblclick', symbol: string): void
}>()

const handleDragStart = (symbol: string, event: DragEvent) => {
  emit('dragstart', symbol, event)
}

const handleSymbolDblClick = (symbol: string) => {
  emit('symbol-dblclick', symbol)
}
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
    <!-- 非终结符 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 class="text-md font-semibold text-gray-900 mb-4 flex items-center">
        <Icon icon="lucide:tag" class="w-4 h-4 mr-2 text-purple-600" />
        非终结符 Vn
      </h3>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="symbol in originalData.Vn"
          :key="'vn-' + symbol"
          :class="[
            'flex items-center justify-center rounded-full font-mono text-base w-10 h-10 cursor-move shadow hover:bg-purple-200 transition-all select-none',
            symbolHighlightState[symbol]
              ? 'bg-gradient-to-br from-purple-400 to-purple-600 text-white shadow-lg scale-110 animate-pulse'
              : 'bg-purple-100 text-purple-800'
          ]"
          draggable="true"
          @dragstart="handleDragStart(symbol, $event)"
          @dblclick="handleSymbolDblClick(symbol)"
          :data-symbol="symbol"
        >
          {{ symbol }}
        </span>
      </div>
    </div>

    <!-- 终结符和其他符号 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 class="text-md font-semibold text-gray-900 mb-4 flex items-center">
        <Icon icon="lucide:hash" class="w-4 h-4 mr-2 text-green-600" />
        终结符 Vt
      </h3>
      <div class="flex flex-wrap gap-2 mb-4">
        <span
          v-for="symbol in originalData.Vt"
          :key="'vt-' + symbol"
          :class="[
            'flex items-center justify-center rounded-full font-mono text-base w-10 h-10 cursor-move shadow hover:bg-green-200 transition-all select-none',
            symbolHighlightState[symbol]
              ? 'bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg scale-110 animate-pulse'
              : 'bg-green-100 text-green-800'
          ]"
          draggable="true"
          @dragstart="handleDragStart(symbol, $event)"
          @dblclick="handleSymbolDblClick(symbol)"
          :data-symbol="symbol"
        >
          {{ symbol }}
        </span>
      </div>

      <h3 class="text-md font-semibold text-gray-900 mb-4 flex items-center">
        <Icon icon="lucide:circle" class="w-4 h-4 mr-2 text-pink-600" />
        其他符号
      </h3>
      <div class="flex flex-wrap gap-2">
        <span
          :class="[
            'flex items-center justify-center rounded-full font-mono text-base w-10 h-10 cursor-move shadow hover:bg-pink-200 transition-all select-none',
            symbolHighlightState['ε']
              ? 'bg-gradient-to-br from-pink-400 to-pink-600 text-white shadow-lg scale-110 animate-pulse'
              : 'bg-pink-100 text-pink-800'
          ]"
          draggable="true"
          @dragstart="handleDragStart('ε', $event)"
          @dblclick="handleSymbolDblClick('ε')"
          data-symbol="ε"
        >
          ε
        </span>
        <span
          :class="[
            'flex items-center justify-center rounded-full font-mono text-base w-10 h-10 cursor-move shadow hover:bg-blue-200 transition-all select-none',
            symbolHighlightState['#']
              ? 'bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-lg scale-110 animate-pulse'
              : 'bg-blue-100 text-blue-800'
          ]"
          draggable="true"
          @dragstart="handleDragStart('#', $event)"
          @dblclick="handleSymbolDblClick('#')"
          data-symbol="#"
        >
          #
        </span>
      </div>
    </div>

    <!-- 产生式 -->
    <div class="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 class="text-md font-semibold text-gray-900 mb-4 flex items-center">
        <Icon icon="lucide:list" class="w-4 h-4 mr-2 text-blue-600" />
        产生式
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 auto-rows-min">
        <div
          v-for="(productions, nonTerminal) in originalData.formulas_dict"
          :key="'prod-' + nonTerminal"
          class="contents"
        >
          <div
            v-for="(production, index) in productions"
            :key="'prod-' + nonTerminal + '-' + index"
            :class="[
              'text-base p-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md',
              productionHighlightState[`${nonTerminal}->${production}`]
                ? 'bg-gradient-to-r from-yellow-100 via-orange-50 to-yellow-50 border-2 border-yellow-300 shadow-md'
                : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 hover:border-blue-300 hover:from-blue-100 hover:via-indigo-100 hover:to-purple-100'
            ]"
          >
            <span class="font-mono text-blue-700 font-bold text-lg">{{ nonTerminal }}</span>
            <span class="text-gray-400 mx-2 font-semibold">→</span>
            <span class="font-mono text-gray-800 text-base">{{ production }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
