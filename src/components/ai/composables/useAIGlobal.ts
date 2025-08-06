import { ref, reactive } from 'vue'
import type { ChatContext } from '../types'

// 全局AI聊天状态
const globalChatContext = reactive<ChatContext>({
  currentPage: '',
  userInput: {},
  backendData: {},
  userAnswers: {},
  pageContext: ''
})

// 全局设置
const aiSettings = reactive({
  enabled: true,
  autoExpand: false,
  showNotifications: true
})

// 更新聊天上下文
const updateChatContext = (context: Partial<ChatContext>) => {
  Object.assign(globalChatContext, context)
}

// 更新页面信息
const updatePageInfo = (pageType: string, pageContext?: string) => {
  globalChatContext.currentPage = pageType
  if (pageContext) {
    globalChatContext.pageContext = pageContext
  }
}

// 更新用户输入数据
const updateUserInput = (input: Record<string, any>) => {
  globalChatContext.userInput = { ...globalChatContext.userInput, ...input }
}

// 更新后端数据
const updateBackendData = (data: Record<string, any>) => {
  globalChatContext.backendData = { ...globalChatContext.backendData, ...data }
}

// 更新用户答题记录
const updateUserAnswers = (answers: Record<string, any>) => {
  globalChatContext.userAnswers = { ...globalChatContext.userAnswers, ...answers }
}

// 清空聊天上下文
const clearChatContext = () => {
  Object.assign(globalChatContext, {
    currentPage: '',
    userInput: {},
    backendData: {},
    userAnswers: {},
    pageContext: ''
  })
}

// 获取当前聊天上下文
const getCurrentContext = () => {
  return { ...globalChatContext }
}

export function useAIGlobal() {
  return {
    // 状态
    globalChatContext,
    aiSettings,

    // 方法
    updateChatContext,
    updatePageInfo,
    updateUserInput,
    updateBackendData,
    updateUserAnswers,
    clearChatContext,
    getCurrentContext
  }
}
