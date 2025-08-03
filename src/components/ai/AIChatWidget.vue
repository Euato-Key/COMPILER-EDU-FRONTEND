<template>
  <div class="ai-chat-widget">
        <!-- 展开/收起按钮 -->
    <div class="fixed top-4 left-4 z-50">
      <button
        @click="toggleChat"
        class="group relative theme-btn-primary text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        :class="{ 'rotate-180': isExpanded }"
      >
        <Icon
          :icon="isExpanded ? 'lucide:x' : 'lucide:sparkles'"
          class="w-6 h-6 transition-all duration-300"
          :class="{
            'animate-pulse': !isExpanded && hasUnreadMessages,
            'animate-bounce': isExpanded && hasUnreadMessages
          }"
        />

        <!-- 未读消息提示 -->
        <div
          v-if="hasUnreadMessages && !isExpanded"
          class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center animate-pulse shadow-lg"
        >
          <span class="text-xs text-white font-bold animate-bounce">{{ unreadCount }}</span>
        </div>

        <!-- 工具提示 -->
        <div class="absolute left-full ml-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none transform scale-95 group-hover:scale-100">
          <div class="bg-gray-900 text-white text-sm px-2 py-1 rounded whitespace-nowrap shadow-lg">
            {{ isExpanded ? '收起AI助手' : '展开AI助手' }}
          </div>
          <div class="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-r-4 border-r-gray-900 border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
        </div>
      </button>
    </div>

    <!-- 聊天窗口 -->
    <Transition
      enter-active-class="transition-all duration-500 ease-out"
      enter-from-class="opacity-0 scale-90 translate-y-8 rotate-2"
      enter-to-class="opacity-100 scale-100 translate-y-0 rotate-0"
      leave-active-class="transition-all duration-300 ease-in"
      leave-from-class="opacity-100 scale-100 translate-y-0 rotate-0"
      leave-to-class="opacity-0 scale-90 translate-y-8 -rotate-2"
    >
      <div
        v-if="isExpanded"
        ref="chatContainer"
        class="fixed top-20 left-4 z-50 theme-content-bg border rounded-lg shadow-2xl theme-transition"
        :style="chatWindowStyle"
      >
        <!-- 调整大小手柄 -->
        <div class="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize hover:bg-gray-100 rounded-tl-lg transition-colors duration-200" @mousedown="startResize">
          <div class="absolute bottom-1 right-1 w-4 h-4 border-r-2 border-b-2 border-gray-400 hover:border-gray-600 transition-colors duration-200"></div>
        </div>

        <!-- 聊天窗口内容 -->
        <AIChatWindow
          :page-type="pageType"
          :context="props.context"
          @close="toggleChat"
        />
      </div>
    </Transition>

    <!-- 移除遮罩层，让AI聊天窗口作为独立的浮动窗口 -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { Icon } from '@iconify/vue'
import AIChatWindow from './AIChatWindow.vue'
import type { ChatContext } from './types'

// Props
interface Props {
  pageType: string
  context: ChatContext
}

const props = defineProps<Props>()

// 状态
const isExpanded = ref(false)
const chatContainer = ref<HTMLElement>()
const isResizing = ref(false)
const chatWidth = ref(600)
const chatHeight = ref(Math.min(window.innerHeight - 120, 800)) // 动态计算初始高度
const unreadCount = ref(0)
const hasUnreadMessages = ref(false)

// 计算属性
const chatWindowStyle = computed(() => ({
  width: `${chatWidth.value}px`,
  height: `${chatHeight.value}px`,
  minWidth: '400px',
  minHeight: '500px',
  maxWidth: '90vw',
  maxHeight: 'calc(100vh - 120px)' // 减去顶部空间，更好地利用屏幕高度
}))

// 方法
const toggleChat = () => {
  isExpanded.value = !isExpanded.value
  if (isExpanded.value) {
    unreadCount.value = 0
    hasUnreadMessages.value = false
  }
}

const startResize = (e: MouseEvent) => {
  e.preventDefault()
  isResizing.value = true

  const startX = e.clientX
  const startY = e.clientY
  const startWidth = chatWidth.value
  const startHeight = chatHeight.value

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing.value) return

    const deltaX = e.clientX - startX
    const deltaY = e.clientY - startY

    // 在左侧时，向右调整宽度，向下调整高度
    chatWidth.value = Math.max(400, Math.min(window.innerWidth * 0.9, startWidth + deltaX))
    chatHeight.value = Math.max(500, Math.min(window.innerHeight - 120, startHeight + deltaY))
  }

  const handleMouseUp = () => {
    isResizing.value = false
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

// 监听新消息
const handleNewMessage = () => {
  if (!isExpanded.value) {
    unreadCount.value++
    hasUnreadMessages.value = true
  }
}

// 监听键盘事件
const handleKeydown = (e: KeyboardEvent) => {
  // Ctrl/Cmd + Shift + A 切换聊天窗口
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
    e.preventDefault()
    toggleChat()
  }

  // ESC 关闭聊天窗口
  if (e.key === 'Escape' && isExpanded.value) {
    toggleChat()
  }
}

// 生命周期
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

// 监听聊天上下文变化
watch(() => props.context, (newContext) => {
  // 当上下文变化时，可以触发一些操作
  console.log('聊天上下文已更新:', newContext)
}, { deep: true })
</script>

<style scoped>
.ai-chat-widget {
  /* 组件样式 */
}

/* 调整大小时的光标样式 */
.ai-chat-widget .cursor-se-resize {
  cursor: se-resize;
}

/* 防止文本选择 */
.ai-chat-widget * {
  user-select: none;
}

.ai-chat-widget textarea,
.ai-chat-widget input {
  user-select: text;
}

/* 自定义动画效果 */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
}

.ai-chat-widget button:hover {
  animation: float 2s ease-in-out infinite;
}

/* 调整大小时的视觉反馈 */
.ai-chat-widget .cursor-se-resize:active {
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
