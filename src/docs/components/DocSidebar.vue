<template>
  <aside
    class="doc-sidebar theme-sidebar-bg border-r theme-border transition-all duration-300"
    :class="[
      collapsed ? 'lg:w-16 md:w-16 w-0' : 'lg:w-64 md:w-64 w-80',
      'h-[calc(100vh-100px)] fixed left-0 top-20 z-40 overflow-y-auto',
      collapsed ? 'lg:block md:block hidden' : 'block'
    ]"
  >
    <!-- 侧边栏头部 -->
    <div class="p-4 border-b theme-border">
      <div class="flex items-center justify-between">
        <h2
          v-if="!collapsed"
          class="text-lg font-semibold theme-text"
        >
          文档目录
        </h2>
        <button
          @click="$emit('toggle')"
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          :title="collapsed ? '展开侧边栏' : '折叠侧边栏'"
        >
          <Icon
            :icon="collapsed ? 'lucide:chevron-right' : 'lucide:chevron-left'"
            class="w-5 h-5 theme-text"
          />
        </button>
      </div>
    </div>

    <!-- 目录内容 -->
    <nav class="p-4">
      <ul class="space-y-2">
        <li
          v-for="section in sections"
          :key="section.id"
          class="section-item"
        >
          <!-- 章节标题 -->
          <div
            class="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            :class="{
              'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400':
                currentSection === section.id
            }"
            @click="toggleSection(section.id)"
          >
            <Icon
              v-if="section.icon"
              :icon="`lucide:${section.icon}`"
              class="w-4 h-4 flex-shrink-0"
            />
            <span
              v-if="!collapsed"
              class="font-medium theme-text truncate"
            >
              {{ section.title }}
            </span>
            <Icon
              v-if="!collapsed"
              :icon="expandedSections.includes(section.id) ? 'lucide:chevron-down' : 'lucide:chevron-right'"
              class="w-4 h-4 ml-auto flex-shrink-0"
            />
          </div>

          <!-- 子页面列表 -->
          <ul
            v-if="!collapsed && expandedSections.includes(section.id)"
            class="ml-6 mt-2 space-y-1"
          >
            <li
              v-for="page in section.children"
              :key="page.id"
              class="page-item"
            >
              <button
                class="w-full text-left p-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                :class="{
                  'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium':
                    currentSection === section.id && currentPage === page.id
                }"
                @click="navigateToPage(section.id, page.id)"
              >
                {{ page.title }}
              </button>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </aside>

  <!-- 遮罩层 -->
  <div
    v-if="!collapsed"
    class="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
    @click="$emit('toggle')"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import type { DocSection } from '../types'

interface Props {
  sections: DocSection[]
  currentSection: string | null
  currentPage: string | null
  collapsed: boolean
}

interface Emits {
  (e: 'toggle'): void
  (e: 'navigate', sectionId: string, pageId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 展开的章节
const expandedSections = ref<string[]>([])

// 切换章节展开状态
const toggleSection = (sectionId: string) => {
  const index = expandedSections.value.indexOf(sectionId)
  if (index > -1) {
    expandedSections.value.splice(index, 1)
  } else {
    expandedSections.value.push(sectionId)
  }
}

// 导航到页面
const navigateToPage = (sectionId: string, pageId: string) => {
  emit('navigate', sectionId, pageId)
}

// 初始化展开当前章节
const initExpandedSections = () => {
  if (props.currentSection && !expandedSections.value.includes(props.currentSection)) {
    expandedSections.value.push(props.currentSection)
  }
}

// 监听当前章节变化
watch(() => props.currentSection, (newSection) => {
  if (newSection && !expandedSections.value.includes(newSection)) {
    expandedSections.value.push(newSection)
  }
})

// 初始化
onMounted(() => {
  initExpandedSections()
})
</script>

<style scoped>
.doc-sidebar {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.doc-sidebar::-webkit-scrollbar {
  width: 6px;
}

.doc-sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.doc-sidebar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

.doc-sidebar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.7);
}
</style>
