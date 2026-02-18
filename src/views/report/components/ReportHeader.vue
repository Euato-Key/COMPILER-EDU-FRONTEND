<template>
  <header class="bg-white border-b sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <router-link
            :to="backLink"
            class="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
          >
            <Icon icon="lucide:arrow-left" class="w-6 h-6" />
          </router-link>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ title }}</h1>
            <p class="text-sm text-gray-500 mt-1">{{ subtitle }}</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            @click="$emit('export-pdf')"
          >
            <Icon icon="lucide:file-text" class="w-4 h-4" />
            导出 PDF
          </button>
          <button
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            @click="$emit('export-html')"
          >
            <Icon icon="lucide:download" class="w-4 h-4" />
            导出 HTML
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface Props {
  title: string
  subtitle: string
  backLink: string
}

defineProps<Props>()

defineEmits<{
  'export-html': []
  'export-pdf': []
}>()
</script>

<style scoped>
/* 打印时保留背景颜色 - 使用全局样式 */
@import '../styles/print-colors.css';
</style>
