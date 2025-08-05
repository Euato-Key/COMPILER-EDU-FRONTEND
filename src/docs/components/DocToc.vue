<template>
  <aside
    class="doc-toc theme-sidebar-bg border-l theme-border transition-all duration-300"
    :class="[
      collapsed ? 'lg:w-12 md:w-12 w-0' : 'lg:w-64 md:w-64 w-0',
      'h-[calc(100vh-100px)] fixed right-0 top-20 z-40 overflow-y-auto',
      'lg:block md:block hidden'
    ]"
  >
    <!-- 目录头部 -->
    <div class="p-4 border-b theme-border">
      <div class="flex items-center justify-between">
        <h3
          v-if="!collapsed"
          class="text-lg font-semibold theme-text"
        >
          本页目录
        </h3>
        <button
          @click="$emit('toggle')"
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          :title="collapsed ? '展开目录' : '折叠目录'"
        >
          <Icon
            :icon="collapsed ? 'lucide:chevron-left' : 'lucide:chevron-right'"
            class="w-5 h-5 theme-text"
          />
        </button>
      </div>
    </div>

    <!-- 目录内容 -->
    <nav v-if="!collapsed" class="p-4">
      <div v-if="toc.length === 0" class="text-center text-gray-500 py-8">
        <Icon icon="lucide:file-text" class="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p class="text-sm">暂无目录</p>
      </div>

      <ul v-else class="space-y-1">
        <li
          v-for="item in toc"
          :key="item.id"
          class="toc-item"
        >
          <button
            class="w-full text-left p-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            :class="[
              `pl-${(item.level - 1) * 4 + 2}`,
              {
                'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium':
                  activeHeading === item.id
              }
            ]"
            @click="scrollToHeading(item.id)"
          >
            {{ item.title }}
          </button>

          <!-- 子目录 -->
          <ul v-if="item.children && item.children.length > 0" class="ml-4 mt-1 space-y-1">
            <li
              v-for="child in item.children"
              :key="child.id"
              class="toc-item"
            >
              <button
                class="w-full text-left p-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                :class="[
                  `pl-${(child.level - 1) * 4 + 2}`,
                  {
                    'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium':
                      activeHeading === child.id
                  }
                ]"
                @click="scrollToHeading(child.id)"
              >
                {{ child.title }}
              </button>
            </li>
          </ul>
        </li>
      </ul>
    </nav>

    <!-- 折叠时的图标 -->
    <div v-else class="p-4">
      <div class="text-center">
        <Icon
          icon="lucide:list"
          class="w-6 h-6 theme-text opacity-60"
          title="展开目录"
        />
      </div>
    </div>
  </aside>

  <!-- 遮罩层 -->
  <div
    v-if="!collapsed"
    class="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
    @click="$emit('toggle')"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Icon } from '@iconify/vue'
import type { TocItem } from '../types'

interface Props {
  toc: TocItem[]
  collapsed: boolean
}

interface Emits {
  (e: 'toggle'): void
  (e: 'navigate', headingId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 当前激活的标题
const activeHeading = ref<string>('')

// 滚动到指定标题
const scrollToHeading = (headingId: string) => {
  const element = document.getElementById(headingId)
  if (element) {
    // 先滚动到元素位置
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })

    // 然后微调位置，让元素显示在头部下方
    setTimeout(() => {
      const elementRect = element.getBoundingClientRect()
      const headerHeight = 80 // 头部高度
      const extraOffset = 20 // 额外偏移量，确保标题完全可见

      // 计算需要额外滚动的距离，让元素显示在头部下方
      const additionalScroll = elementRect.top - headerHeight - extraOffset

      if (Math.abs(additionalScroll) > 10) { // 只有当偏移量大于10px时才调整
        window.scrollBy({
          top: additionalScroll,
          behavior: 'smooth'
        })
      }
    }, 300) // 等待 scrollIntoView 完成

    activeHeading.value = headingId
    emit('navigate', headingId)
  }
}

// 监听滚动，更新激活的标题
const handleScroll = () => {
  // 只查询Markdown内容区域的标题
  const contentArea = document.getElementById('doc-markdown-content')
  if (!contentArea) return

  const headings = contentArea.querySelectorAll('h1, h2, h3, h4, h5, h6')
  let currentHeading = ''

  // 考虑头部高度（大约80px）
  const headerHeight = 80

  headings.forEach((heading) => {
    const rect = heading.getBoundingClientRect()
    // 当标题顶部距离视口顶部小于头部高度时，认为该标题是当前激活的
    if (rect.top <= headerHeight + 20) {
      currentHeading = heading.id
    }
  })

  if (currentHeading && currentHeading !== activeHeading.value) {
    activeHeading.value = currentHeading
  }
}

// 监听滚动事件
onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.doc-toc {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.doc-toc::-webkit-scrollbar {
  width: 6px;
}

.doc-toc::-webkit-scrollbar-track {
  background: transparent;
}

.doc-toc::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

.doc-toc::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.7);
}

.toc-item button {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
