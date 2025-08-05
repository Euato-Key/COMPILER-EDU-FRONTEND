<template>
  <main
    class="doc-content theme-main-bg transition-all duration-300"
    :class="[
      'min-h-[calc(100vh-80px)] overflow-y-auto pt-4',
      'mt-20', // 添加顶部边距，让内容从头部下方开始
      sidebarCollapsed ? 'lg:ml-16 md:ml-16 ml-0' : 'lg:ml-64 md:ml-16 ml-0',
      tocCollapsed ? 'lg:mr-12 md:mr-12 mr-0' : 'lg:mr-64 md:mr-12 mr-0'
    ]"
  >
    <!-- 加载状态 -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">加载中...</p>
      </div>
    </div>

    <!-- 内容区域 -->
    <div v-else class="max-w-4xl mx-auto px-6 py-8">
      <!-- 面包屑导航 -->
      <nav v-if="breadcrumbs.length > 0" class="mb-6">
        <ol class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <li>
            <router-link
              to="/docs"
              class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              文档
            </router-link>
          </li>
          <li v-for="(crumb, index) in breadcrumbs" :key="index" class="flex items-center">
            <Icon icon="lucide:chevron-right" class="w-4 h-4 mx-2" />
            <span v-if="index === breadcrumbs.length - 1" class="text-gray-900 dark:text-gray-100">
              {{ crumb.title }}
            </span>
            <router-link
              v-else
              :to="crumb.path"
              class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {{ crumb.title }}
            </router-link>
          </li>
        </ol>
      </nav>

      <!-- Markdown 内容 -->
      <article
        id="doc-markdown-content"
        v-if="content"
        class="prose prose-lg max-w-none dark:prose-invert"
        v-html="content"
      />



      <!-- 空状态 -->
      <div v-else class="text-center py-16">
        <Icon icon="lucide:file-text" class="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          暂无内容
        </h2>
        <p class="text-gray-600 dark:text-gray-400">
          请从左侧目录选择一个文档页面
        </p>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useDocStore } from '../stores/docStore'
import 'highlight.js/styles/github.css'

interface Props {
  content: string
  loading: boolean
  sidebarCollapsed: boolean
  tocCollapsed: boolean
}

const props = defineProps<Props>()
const route = useRoute()
const docStore = useDocStore()

// 面包屑导航
const breadcrumbs = computed(() => {
  const crumbs = []

  const currentSection = docStore.currentSectionData
  if (currentSection) {
    crumbs.push({
      title: currentSection.title,
      path: `/docs/${currentSection.id}`
    })
  }

  const currentPage = docStore.currentPageData
  if (currentPage) {
    crumbs.push({
      title: currentPage.title,
      path: route.path
    })
  }

  return crumbs
})
</script>

<style scoped>
/* 自定义 Markdown 样式 */
:deep(.prose) {
  color: inherit;
}

:deep(.prose h1) {
  color: inherit;
  font-size: 2.25rem;
  font-weight: 700;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

:deep(.prose h2) {
  color: inherit;
  font-size: 1.875rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

:deep(.prose h3) {
  color: inherit;
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 1.25rem;
  margin-bottom: 0.5rem;
}

:deep(.prose h4) {
  color: inherit;
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

:deep(.prose p) {
  margin-top: 1rem;
  margin-bottom: 1rem;
  line-height: 1.75;
}

:deep(.prose ul) {
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

:deep(.prose ol) {
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

:deep(.prose li) {
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
}

:deep(.prose blockquote) {
  border-left: 4px solid #e5e7eb;
  padding-left: 1rem;
  margin: 1.5rem 0;
  font-style: italic;
  color: #6b7280;
}

:deep(.prose code) {
  background-color: #f3f4f6;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  color: #dc2626;
}

:deep(.prose pre) {
  background-color: #1f2937;
  color: #f9fafb;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 1.5rem 0;
}

:deep(.prose pre code) {
  background-color: transparent;
  padding: 0;
  color: inherit;
}

:deep(.prose table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
}

:deep(.prose th) {
  background-color: #f9fafb;
  padding: 0.75rem;
  text-align: left;
  font-weight: 600;
  border: 1px solid #e5e7eb;
}

:deep(.prose td) {
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
}

:deep(.prose img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 1.5rem 0;
}

:deep(.prose video) {
  max-width: 100%;
  border-radius: 0.5rem;
  margin: 1.5rem 0;
}

:deep(.mermaid) {
  text-align: center;
  margin: 1.5rem 0;
}

:deep(.graphviz) {
  text-align: center;
  margin: 1.5rem 0;
}

/* 深色模式样式 */
:deep(.dark .prose) {
  color: #f9fafb;
}

:deep(.dark .prose blockquote) {
  border-left-color: #4b5563;
  color: #9ca3af;
}

:deep(.dark .prose code) {
  background-color: #374151;
  color: #f87171;
}

:deep(.dark .prose th) {
  background-color: #374151;
  border-color: #4b5563;
}

:deep(.dark .prose td) {
  border-color: #4b5563;
}

/* 代码块样式 */
:deep(.code-block-wrapper) {
  margin: 1rem 0;
  border-radius: 0.5rem;
  overflow: hidden;
  background-color: rgb(255 255 255);
  border: 1px solid rgb(226 232 240);
  box-shadow: 0 4px 6px rgb(0 0 0 / 0.1);
}

:deep(.dark .code-block-wrapper) {
  background-color: rgb(15 23 42);
  border-color: rgb(51 65 85);
  box-shadow: 0 4px 6px rgb(0 0 0 / 0.3);
}

:deep(.code-header) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  background-color: rgb(248 250 252);
  border-bottom: 1px solid rgb(226 232 240);
  color: rgb(51 65 85);
  font-size: 0.75rem;
  font-weight: 500;
}

:deep(.dark .code-header) {
  background-color: rgb(30 41 59);
  border-bottom-color: rgb(51 65 85);
  color: rgb(148 163 184);
}

:deep(.code-language) {
  font-size: 0.75rem;
  font-weight: 500;
  color: rgb(51 65 85);
}

:deep(.dark .code-language) {
  color: rgb(148 163 184);
}

:deep(.copy-button) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  background-color: transparent;
  border: 1px solid rgb(203 213 225);
  border-radius: 0.25rem;
  color: rgb(71 85 105);
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

:deep(.copy-button:hover) {
  background-color: rgb(241 245 249);
  border-color: rgb(148 163 184);
  color: rgb(30 41 59);
}

:deep(.dark .copy-button) {
  border-color: rgb(71 85 105);
  color: rgb(148 163 184);
}

:deep(.dark .copy-button:hover) {
  background-color: rgb(51 65 85);
  border-color: rgb(100 116 139);
  color: rgb(226 232 240);
}

:deep(.copy-button.copied) {
  background-color: rgb(34 197 94);
  border-color: rgb(34 197 94);
  color: white;
}

:deep(.copy-button.copied:hover) {
  background-color: rgb(22 163 74);
  border-color: rgb(22 163 74);
}

/* Mermaid 图表样式 */
:deep(.mermaid-block-wrapper) {
  margin: 1rem 0;
  border-radius: 0.5rem;
  overflow: hidden;
  background-color: rgb(255 255 255);
  border: 1px solid rgb(226 232 240);
  box-shadow: 0 4px 6px rgb(0 0 0 / 0.1);
}

:deep(.dark .mermaid-block-wrapper) {
  background-color: rgb(15 23 42);
  border-color: rgb(51 65 85);
  box-shadow: 0 4px 6px rgb(0 0 0 / 0.3);
}

:deep(.mermaid-header) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  background-color: rgb(248 250 252);
  border-bottom: 1px solid rgb(226 232 240);
  color: rgb(51 65 85);
  font-size: 0.75rem;
  font-weight: 500;
}

:deep(.mermaid-tabs) {
  display: flex;
  gap: 0.25rem;
}

:deep(.tab-button) {
  padding: 0.25rem 0.75rem;
  border: 1px solid rgb(203 213 225);
  border-radius: 0.375rem;
  background-color: rgb(241 245 249);
  color: rgb(71 85 105);
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

:deep(.tab-button:hover) {
  background-color: rgb(226 232 240);
  border-color: rgb(148 163 184);
}

:deep(.tab-button.active) {
  background-color: rgb(255 255 255);
  border-color: rgb(59 130 246);
  color: rgb(59 130 246);
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.05);
}

:deep(.mermaid-actions) {
  display: flex;
  gap: 0.25rem;
}

:deep(.action-button) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  background-color: transparent;
  border: 1px solid rgb(203 213 225);
  border-radius: 0.375rem;
  color: rgb(71 85 105);
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

:deep(.action-button:hover) {
  background-color: rgb(241 245 249);
  border-color: rgb(148 163 184);
  color: rgb(30 41 59);
}

:deep(.action-button.copied) {
  background-color: rgb(34 197 94);
  border-color: rgb(34 197 94);
  color: white;
}

:deep(.dark .mermaid-header) {
  background-color: rgb(30 41 59);
  border-bottom-color: rgb(51 65 85);
  color: rgb(148 163 184);
}

:deep(.dark .tab-button) {
  border-color: rgb(71 85 105);
  background-color: rgb(51 65 85);
  color: rgb(148 163 184);
}

:deep(.dark .tab-button:hover) {
  background-color: rgb(71 85 105);
  border-color: rgb(100 116 139);
}

:deep(.dark .tab-button.active) {
  background-color: rgb(15 23 42);
  border-color: rgb(59 130 246);
  color: rgb(147 197 253);
}

:deep(.dark .action-button) {
  border-color: rgb(71 85 105);
  color: rgb(148 163 184);
}

:deep(.dark .action-button:hover) {
  background-color: rgb(51 65 85);
  border-color: rgb(100 116 139);
  color: rgb(226 232 240);
}

:deep(.mermaid-container) {
  padding: 1rem;
  background-color: rgb(255 255 255);
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  width: 100%;
}

:deep(.dark .mermaid-container) {
  background-color: rgb(15 23 42);
}

:deep(.mermaid) {
  width: 100%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

:deep(.mermaid svg) {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
}

:deep(.mermaid-code) {
  display: none;
  margin: 0;
  padding: 1rem;
  background-color: rgb(255 255 255);
  border: none;
  border-radius: 0;
  font-size: 0.875rem;
  line-height: 1.5;
  overflow-x: auto;
  color: rgb(17 24 39);
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
}

:deep(.mermaid-code code) {
  background-color: transparent;
  border: none;
  padding: 0;
  font-size: inherit;
  color: inherit;
  font-family: inherit;
}

/* DOT 图表样式 */
:deep(.dot-block-wrapper) {
  margin: 1rem 0;
  border-radius: 0.5rem;
  overflow: hidden;
  background-color: rgb(255 255 255);
  border: 1px solid rgb(226 232 240);
  box-shadow: 0 4px 6px rgb(0 0 0 / 0.1);
}

:deep(.dark .dot-block-wrapper) {
  background-color: rgb(15 23 42);
  border-color: rgb(51 65 85);
  box-shadow: 0 4px 6px rgb(0 0 0 / 0.3);
}

:deep(.dot-header) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  background-color: rgb(248 250 252);
  border-bottom: 1px solid rgb(226 232 240);
  color: rgb(51 65 85);
  font-size: 0.75rem;
  font-weight: 500;
}

:deep(.dot-tabs) {
  display: flex;
  gap: 0.25rem;
}

:deep(.dot-actions) {
  display: flex;
  gap: 0.25rem;
}

:deep(.dark .dot-header) {
  background-color: rgb(30 41 59);
  border-bottom-color: rgb(51 65 85);
  color: rgb(148 163 184);
}

:deep(.dot-container) {
  padding: 1rem;
  background-color: rgb(255 255 255);
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  width: 100%;
}

:deep(.dark .dot-container) {
  background-color: rgb(15 23 42);
}

:deep(.dot-graph) {
  width: 100%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

:deep(.dot-graph svg) {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
}

:deep(.dot-code) {
  display: none;
  margin: 0;
  padding: 1rem;
  background-color: rgb(255 255 255);
  border: none;
  border-radius: 0;
  font-size: 0.875rem;
  line-height: 1.5;
  overflow-x: auto;
  color: rgb(17 24 39);
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
}

:deep(.dot-code code) {
  background-color: transparent;
  border: none;
  padding: 0;
  font-size: inherit;
  color: inherit;
  font-family: inherit;
}

/* 覆盖 highlight.js 的深色背景 */
:deep(.hljs) {
  background: rgb(255 255 255) !important;
  color: rgb(17 24 39) !important;
}

:deep(.dark .hljs) {
  background: rgb(15 23 42) !important;
  color: rgb(226 232 240) !important;
}
</style>
