import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Message, ChatContext } from '@/components/ai/types'

// LR0模块的AI聊天store
export const useLR0ChatStore = defineStore('lr0-chat', () => {
  // 状态
  const messages = ref<Message[]>([])
  const isStreaming = ref(false)
  const currentStreamContent = ref('')
  const error = ref<string | null>(null)
  const unreadCount = ref(0)
  const hasUnreadMessages = ref(false)
  const lastContext = ref<ChatContext | null>(null)

  // 计算属性
  const messageCount = computed(() => messages.value.length)
  const hasMessages = computed(() => messages.value.length > 0)

  // LR0模块的预设问题
  const presetQuestions = [
    '什么是LR0文法？',
    'LR0项目集规范族如何构造？',
    'LR0分析表的构造步骤是什么？',
    '什么是LR0冲突？如何处理？',
    'LR0分析算法的原理是什么？',
    '为什么需要计算闭包？',
    'LR0和SLR1有什么区别？',
    '什么是归约-归约冲突？',
    '什么是移进-归约冲突？',
    'LR0分析表的ACTION和GOTO表有什么区别？',
    '如何判断一个文法是LR0文法？',
    'LR0分析的优势和局限性是什么？'
  ]

  // LR0各步骤的知识库
  const stepKnowledgeBases = {
    1: `LR0文法输入和验证：LR0文法是一种特殊的上下文无关文法，满足无二义性条件。`,
    2: `增广文法构造：添加新的开始符号S'和产生式S' → S，确保分析器能够识别句子的结束。`,
    3: `LR0项目集规范族构造：使用闭包和转移算法构造项目集规范族。`,
    4: `LR0分析表构造：构造ACTION表和GOTO表，处理移进、归约、接受和错误动作。`,
    5: `LR0字符串分析：使用栈和输入串进行自底向上分析，实现语法分析。`
  }

  // 获取当前步骤的知识库
  const getStepKnowledge = (step: number) => {
    return stepKnowledgeBases[step as keyof typeof stepKnowledgeBases] || stepKnowledgeBases[1]
  }

  // 方法
  const addMessage = (role: Message['role'], content: string) => {
    const message: Message = {
      role,
      content,
      timestamp: Date.now()
    }
    messages.value.push(message)

    if (role === 'assistant') {
      unreadCount.value = 0
      hasUnreadMessages.value = false
    }
  }

  const updateStreamContent = (content: string) => {
    currentStreamContent.value = content
  }

  const setStreaming = (streaming: boolean) => {
    isStreaming.value = streaming
    if (!streaming) {
      currentStreamContent.value = ''
    }
  }

  const setError = (errorMessage: string | null) => {
    error.value = errorMessage
  }

  const clearChat = () => {
    messages.value = []
    error.value = null
    currentStreamContent.value = ''
    isStreaming.value = false
    unreadCount.value = 0
    hasUnreadMessages.value = false
    lastContext.value = null
  }

  const incrementUnreadCount = () => {
    unreadCount.value++
    hasUnreadMessages.value = true
  }

  const resetUnreadCount = () => {
    unreadCount.value = 0
    hasUnreadMessages.value = false
  }

  const updateContext = (context: ChatContext) => {
    lastContext.value = context
  }

  const getContext = () => lastContext.value

  // 持久化相关
  const saveToStorage = () => {
    try {
      const data = {
        messages: messages.value,
        unreadCount: unreadCount.value,
        hasUnreadMessages: hasUnreadMessages.value,
        lastContext: lastContext.value,
        timestamp: Date.now()
      }
      localStorage.setItem('lr0-chat', JSON.stringify(data))
    } catch (err) {
      console.error('保存LR0聊天记录失败:', err)
    }
  }

  const loadFromStorage = () => {
    try {
      const data = localStorage.getItem('lr0-chat')
      if (data) {
        const parsed = JSON.parse(data)
        messages.value = parsed.messages || []
        unreadCount.value = parsed.unreadCount || 0
        hasUnreadMessages.value = parsed.hasUnreadMessages || false
        lastContext.value = parsed.lastContext || null
      }
    } catch (err) {
      console.error('加载LR0聊天记录失败:', err)
    }
  }

  const clearStorage = () => {
    try {
      localStorage.removeItem('lr0-chat')
    } catch (err) {
      console.error('清除LR0聊天记录失败:', err)
    }
  }

  return {
    messages,
    isStreaming,
    currentStreamContent,
    error,
    unreadCount,
    hasUnreadMessages,
    lastContext,
    messageCount,
    hasMessages,
    presetQuestions,
    getStepKnowledge,
    addMessage,
    updateStreamContent,
    setStreaming,
    setError,
    clearChat,
    incrementUnreadCount,
    resetUnreadCount,
    updateContext,
    getContext,
    saveToStorage,
    loadFromStorage,
    clearStorage
  }
})
