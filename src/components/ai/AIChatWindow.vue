<template>
  <div class="ai-chat-window theme-content-bg border rounded-lg shadow-lg flex flex-col theme-transition w-full">
    <!-- 聊天窗口头部 -->
    <div class="flex items-center justify-between p-4 border-b theme-step-bg">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center shadow-md">
          <Icon icon="lucide:brain" class="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 class="font-semibold text-gray-900">AI 教学助手</h3>
          <p class="text-xs text-gray-500">编译原理智能问答</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="handleClearChat"
          class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-sm"
          title="清空聊天记录"
        >
          <Icon icon="lucide:trash-2" class="w-4 h-4" />
        </button>
        <button
          @click="$emit('close')"
          class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-sm"
          title="关闭聊天"
        >
          <Icon icon="lucide:x" class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- 聊天消息区域 -->
    <div
      ref="messagesContainer"
      class="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 w-full"
      style="max-height: calc(100vh - 300px);"
    >
      <!-- 欢迎消息 -->
      <div v-if="messages.length === 0" class="text-center py-8">
        <div class="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
          <Icon icon="lucide:sparkles" class="w-8 h-8 text-purple-600 animate-bounce" />
        </div>
        <h4 class="font-medium text-gray-900 mb-2">欢迎使用AI教学助手</h4>
        <p class="text-sm text-gray-500 mb-4">我可以帮助您理解编译原理的概念和算法</p>

        <!-- 预设问题 -->
        <div class="space-y-2">
          <p class="text-xs text-gray-400">快速提问：</p>
          <div class="flex flex-wrap gap-2 justify-center">
            <button
              v-for="(question, index) in presetQuestions"
              :key="question"
              @click="sendPresetQuestion(question)"
              class="px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-all duration-300 border border-blue-200 hover:border-blue-300 hover:scale-105 hover:shadow-md animate-fade-in"
              :style="{ animationDelay: `${index * 150}ms` }"
            >
              {{ question }}
            </button>
          </div>
        </div>
      </div>

      <!-- 消息列表 -->
      <div v-else class="space-y-4">
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="[
            'flex gap-3 animate-fade-in',
            message.role === 'user' ? 'justify-end' : 'justify-start'
          ]"
          :style="{ animationDelay: `${index * 100}ms` }"
        >
          <!-- 用户消息 -->
          <div v-if="message.role === 'user'" class="flex items-end gap-2 max-w-[80%] animate-fade-in">
            <div class="theme-btn-primary text-white px-4 py-2 rounded-2xl rounded-br-md flex-1 min-w-0 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <p class="text-sm whitespace-pre-wrap">{{ message.content }}</p>
            </div>
            <div class="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110">
              <Icon icon="lucide:user-circle" class="w-4 h-4 text-white" />
            </div>
          </div>

          <!-- AI消息 -->
          <div v-else-if="message.role === 'assistant'" class="flex items-start gap-2 w-full animate-fade-in">
            <div class="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110">
              <Icon icon="lucide:brain" class="w-4 h-4 text-white animate-pulse" />
            </div>
            <div class="flex-1 min-w-0 w-full">
              <div class="bg-gray-100 text-gray-900 px-4 py-2 rounded-2xl rounded-bl-md shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 w-full">
                <MarkdownRenderer
                  :content="message.content"
                  theme="auto"
                  size="sm"
                />
              </div>
              <!-- 操作按钮行 -->
              <div class="flex items-center gap-2 mt-2 ml-2">
                <button
                  @click="copyToClipboard(message.content)"
                  class="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-all duration-300 hover:scale-110 hover:shadow-sm"
                  title="复制原始Markdown"
                >
                  <Icon icon="lucide:copy" class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 流式输出 -->
        <div v-if="isStreaming" class="flex items-start gap-2 w-full animate-fade-in">
          <div class="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md animate-pulse">
            <Icon icon="lucide:brain" class="w-4 h-4 text-white" />
          </div>
          <div class="flex-1 min-w-0 w-full">
            <div class="bg-gray-100 text-gray-900 px-4 py-2 rounded-2xl rounded-bl-md shadow-sm border-l-4 border-purple-400 w-full">
              <MarkdownRenderer
                :content="currentStreamContent"
                theme="auto"
                size="sm"
              />
              <span class="inline-block w-2 h-4 bg-purple-400 animate-pulse rounded"></span>
            </div>
            <!-- 操作按钮行 -->
            <div class="flex items-center gap-2 mt-2 ml-2">
              <button
                @click="copyToClipboard(currentStreamContent)"
                class="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                title="复制原始Markdown"
              >
                <Icon icon="lucide:copy" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 错误提示 -->
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 scale-95 translate-y-4"
        enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 translate-y-4"
      >
        <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-3 animate-pulse">
          <div class="flex items-center gap-2 text-red-700">
            <Icon icon="lucide:alert-circle" class="w-4 h-4 animate-bounce" />
            <span class="text-sm">{{ error }}</span>
          </div>
        </div>
      </Transition>

      <!-- 复制成功提示 -->
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 scale-95 translate-x-4"
        enter-to-class="opacity-100 scale-100 translate-x-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 scale-100 translate-x-0"
        leave-to-class="opacity-0 scale-95 translate-x-4"
      >
        <div v-if="showCopySuccess" class="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-bounce">
          <Icon icon="lucide:check" class="w-4 h-4" />
          <span class="text-sm">已复制到剪贴板</span>
        </div>
      </Transition>
    </div>

    <!-- 输入区域 -->
    <div class="border-t border-gray-200 p-4">
      <div class="flex gap-2">
        <div class="flex-1 relative">
          <textarea
            v-model="inputMessage"
            @keydown="handleKeydown"
            placeholder=""
            class="w-full px-3 py-2 pr-24 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-theme-primary focus:border-transparent transition-all duration-300 hover:border-gray-400 focus:shadow-lg"
            :rows="inputRows"
            :disabled="isStreaming"
          ></textarea>
          <div class="absolute bottom-2 right-2 text-xs text-gray-400">
            <span class="hidden sm:inline">Enter 发送，</span>Shift+Enter 换行
          </div>
        </div>
        <button
          @click="handleSend"
          :disabled="!inputMessage.trim() || isStreaming"
          class="px-4 py-2 theme-btn-primary text-white rounded-lg hover:opacity-90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2"
        >
          <Icon v-if="isStreaming" icon="lucide:loader-2" class="w-4 h-4 animate-spin" />
          <Icon v-else icon="lucide:send" class="w-4 h-4" />
          <span class="hidden sm:inline">发送</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useAIChat } from './composables/useAIChat'
import type { ChatContext } from './types'
import MarkdownRenderer from '@/components/ai/MarkdownRenderer.vue'

// 移除简单的Markdown渲染函数，使用新的MarkdownRenderer组件

// 复制到剪贴板函数
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    // 显示成功提示
    showCopySuccess.value = true
    setTimeout(() => {
      showCopySuccess.value = false
    }, 2000)
  } catch (err) {
    console.error('复制失败:', err)
    // 降级方案：使用传统的复制方法
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    // 显示成功提示
    showCopySuccess.value = true
    setTimeout(() => {
      showCopySuccess.value = false
    }, 2000)
  }
}

// Props
interface Props {
  pageType: string
  context: ChatContext
}

const props = defineProps<Props>()

// Emits
defineEmits<{
  close: []
}>()

// 使用AI聊天组合式函数
const {
  sendMessage
} = useAIChat()

// 使用聊天store
import { useFAChatStore, useLL1ChatStore, useLR0ChatStore, useSLR1ChatStore, useHomeChatStore } from '@/stores'
const faChatStore = useFAChatStore()
const ll1ChatStore = useLL1ChatStore()
const lr0ChatStore = useLR0ChatStore()
const slr1ChatStore = useSLR1ChatStore()
const homeChatStore = useHomeChatStore()

// 根据页面类型选择store
const currentStore = computed(() => {
  if (props.pageType === 'fa') return faChatStore
  if (props.pageType === 'll1') return ll1ChatStore
  if (props.pageType === 'lr0') return lr0ChatStore
  if (props.pageType === 'slr1') return slr1ChatStore
  if (props.pageType === 'home') return homeChatStore
  return null
})

// 从store获取状态
const messages = computed(() => currentStore.value?.messages || [])
const isStreaming = computed(() => currentStore.value?.isStreaming || false)
const currentStreamContent = computed(() => currentStore.value?.currentStreamContent || '')
const error = computed(() => currentStore.value?.error || null)

// 获取预设问题
const presetQuestions = computed(() => currentStore.value?.presetQuestions || [])

// 本地状态
const inputMessage = ref('')
const messagesContainer = ref<HTMLElement>()
const showCopySuccess = ref(false)

// 计算属性
const inputRows = computed(() => {
  const lines = inputMessage.value.split('\n').length
  return Math.min(Math.max(lines, 1), 4)
})

// 方法
const handleSend = async () => {
  const message = inputMessage.value.trim()
  if (!message || isStreaming.value) return

  console.log('发送消息:', message)
  console.log('当前store:', currentStore.value)
  console.log('聊天上下文:', props.context)

  inputMessage.value = ''

    try {
    // 更新上下文
    if (currentStore.value) {
      currentStore.value.updateContext(props.context)
    }

    // 发送消息到AI
    await sendMessage(message, props.context, faChatStore, ll1ChatStore, lr0ChatStore, slr1ChatStore, homeChatStore)

    // 保存到本地存储
    if (currentStore.value) {
      currentStore.value.saveToStorage()
    }
  } catch (err) {
    console.error('发送消息失败:', err)
  }
}

const sendPresetQuestion = async (question: string) => {
  console.log('发送预设问题:', question)
  console.log('当前页面类型:', props.pageType)
  console.log('当前store:', currentStore.value)
  console.log('预设问题:', presetQuestions.value)
  inputMessage.value = question
  await handleSend()
}

// 处理清除聊天记录
const handleClearChat = () => {
  // 只清除当前页面的store
  if (currentStore.value) {
    currentStore.value.clearChat()
    currentStore.value.clearStorage()
  }
}

// 处理键盘事件
const handleKeydown = (e: KeyboardEvent) => {
  // Shift+Enter 换行
  if (e.shiftKey && e.key === 'Enter') {
    // 允许默认行为（换行）
    return
  }
  // 普通Enter 发送消息
  else if (e.key === 'Enter') {
    e.preventDefault()
    handleSend()
  }
}

// 自动滚动到底部
const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// 监听消息变化，自动滚动
watch([messages, currentStreamContent], scrollToBottom, { deep: true })

// 监听流式输出变化
watch(currentStreamContent, scrollToBottom)

// 组件挂载时加载存储的聊天记录
onMounted(() => {
  if (currentStore.value) {
    currentStore.value.loadFromStorage()
  }
})


</script>

<style scoped>
.ai-chat-window {
  min-height: 500px;
  max-height: calc(100vh - 120px);
  height: 100%;
}

/* 自定义滚动条 */
.ai-chat-window ::-webkit-scrollbar {
  width: 6px;
}

.ai-chat-window ::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.ai-chat-window ::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.ai-chat-window ::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* 自定义动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

/* 消息出现动画 */
@keyframes slideInFromBottom {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-enter {
  animation: slideInFromBottom 0.4s ease-out;
}

/* 按钮悬停效果 */
.ai-chat-window button:hover {
  transform: translateY(-1px);
}

/* 输入框焦点效果 */
.ai-chat-window textarea:focus {
  box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
}

/* Markdown内容样式 */
.markdown-content h1,
.markdown-content h2,
.markdown-content h3 {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.markdown-content h1:first-child,
.markdown-content h2:first-child,
.markdown-content h3:first-child {
  margin-top: 0;
}

.markdown-content pre {
  margin: 0.5rem 0;
  width: 100%;
  overflow-x: auto;
}

.markdown-content code {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.markdown-content strong {
  color: #1f2937;
}

.markdown-content em {
  color: #4b5563;
}

/* 确保AI消息充分利用空间 */
.markdown-content {
  width: 100%;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.markdown-content p {
  width: 100%;
  word-wrap: break-word;
}

.markdown-content table {
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
  display: block;
}
</style>
