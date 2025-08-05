<template>
  <header class="theme-header-bg backdrop-blur-sm border-b sticky top-0 z-50 theme-transition">
    <div class="max-w-7xl mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <!-- 移动端菜单按钮 -->
          <button
            @click="toggleSidebar"
            class="lg:hidden md:hidden block p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title="菜单"
          >
            <Icon icon="lucide:menu" class="w-5 h-5" />
          </button>

          <router-link
            to="/"
            class="text-2xl font-bold theme-header-text hover:opacity-80 transition-colors"
          >
            编译原理可视化
          </router-link>
          <span class="text-gray-400 hidden md:inline">|</span>
          <h1 class="text-xl font-semibold text-gray-800 dark:text-gray-200 hidden md:block">
            官方文档
            <span v-if="currentPageTitle" class="text-lg text-gray-600 dark:text-gray-400 ml-2">
              - {{ currentPageTitle }}
            </span>
          </h1>
        </div>
        <div class="flex items-center gap-2">
          <ThemeSelector />
          <button
            @click="toggleSidebar"
            class="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
            :title="sidebarCollapsed ? '展开侧边栏' : '折叠侧边栏'"
          >
            <Icon
              :icon="sidebarCollapsed ? 'lucide:panel-left-open' : 'lucide:panel-left-close'"
              class="w-4 h-4 mr-1"
            />
            {{ sidebarCollapsed ? '展开目录' : '折叠目录' }}
          </button>
          <button
            @click="toggleToc"
            class="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
            :title="tocCollapsed ? '展开目录' : '折叠目录'"
          >
            <Icon
              :icon="tocCollapsed ? 'lucide:list' : 'lucide:list-x'"
              class="w-4 h-4 mr-1"
            />
            {{ tocCollapsed ? '展开目录' : '折叠目录' }}
          </button>
          <router-link
            to="/fa"
            class="px-4 py-2 text-sm theme-btn-primary rounded-lg hover:opacity-90 transition-colors"
          >
            开始学习 →
          </router-link>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import ThemeSelector from '@/components/shared/ThemeSelector.vue'

interface Props {
  sidebarCollapsed: boolean
  tocCollapsed: boolean
  currentPageTitle?: string
}

interface Emits {
  (e: 'toggle-sidebar'): void
  (e: 'toggle-toc'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const toggleSidebar = () => {
  emit('toggle-sidebar')
}

const toggleToc = () => {
  emit('toggle-toc')
}
</script>
