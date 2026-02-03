<template>
  <div class="bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 rounded-xl p-6 mb-6 border border-purple-100 shadow-lg">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
          <Icon icon="lucide:book-open" class="w-4 h-4 text-white" />
        </div>
        <div>
          <h4 class="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            示例文法
          </h4>
          <p class="text-sm text-gray-700 mt-0.5 font-medium">点击卡片使用示例文法</p>
        </div>
      </div>
      <div class="flex items-center gap-2 px-2 py-1 bg-purple-100 rounded-full">
        <Icon icon="lucide:mouse-pointer" class="w-3 h-3 text-purple-600" />
        <span class="text-sm font-medium text-purple-800">点击使用示例</span>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div
        v-for="(example, index) in examples"
        :key="index"
        class="bg-white rounded-lg p-4 border-2 border-purple-200 cursor-pointer hover:border-purple-400 hover:shadow-xl transition-all duration-300 group transform hover:scale-105 flex flex-col"
        @click="$emit('use', example)"
      >
        <div class="flex items-center justify-between mb-3">
          <h5 class="text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:from-purple-700 group-hover:to-pink-700">
            {{ example.name }}
          </h5>
          <div class="w-6 h-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center group-hover:from-purple-200 group-hover:to-pink-200 transition-all duration-300">
            <Icon
              icon="lucide:copy"
              class="w-3 h-3 text-purple-600 group-hover:text-purple-700 transition-colors"
            />
          </div>
        </div>
        <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-md p-3 border border-gray-200 mb-3 flex-1">
          <pre class="text-sm text-gray-800 font-mono leading-tight whitespace-pre-wrap font-semibold">{{
            example.grammar
          }}</pre>
        </div>
        <div class="pt-1 border-t border-gray-200">
          <span class="text-sm text-gray-700 leading-tight line-clamp-2 font-medium">{{ example.description }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { GrammarExample } from '../utils/constants'

defineProps<{
  examples: GrammarExample[]
}>()

defineEmits<{
  use: [example: GrammarExample]
}>()
</script>

<style scoped>
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
