import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Message, ChatContext } from '@/components/ai/types'

// 主页的AI聊天store
export const useHomeChatStore = defineStore('home-chat', () => {
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

  // 主页的预设问题
  const presetQuestions = [
    '这个项目是做什么的？',
    '有哪些编译原理算法？',
    '如何使用这个平台学习？',
    '项目有什么特色功能？',
    '支持哪些语法分析方法？',
    '如何开始学习有限自动机？',
    'LL1和LR0有什么区别？',
    '项目的技术栈是什么？',
    '如何理解编译原理？',
    '推荐的学习路径是什么？',
    '项目适合什么水平的学习者？',
    '有哪些交互式功能？',
    '如何理解语法分析？',
    '项目的发展计划是什么？'
  ]

  // 主页的知识库
  const projectKnowledgeBase = {
    projectOverview: `
编译原理可视化工具是一个专门用于教学和学习编译原理的交互式平台。

**项目目标：**
- 通过可视化方式帮助学习者理解编译原理的核心概念
- 提供交互式的算法演示和练习
- 降低编译原理学习的门槛

**技术特色：**
- 基于Vue3 + TypeScript + Tailwind CSS构建
- 使用Vue Flow实现交互式图形绘制
- 集成AI教学助手提供智能问答
- 支持多种主题切换和响应式设计
    `,

    implementedFeatures: `
**已实现的核心功能：**

1. **有限自动机 (FA) 模块：**
   - 正则表达式输入和验证
   - Thompson构造法生成NFA
   - 子集构造法转换DFA
   - Hopcroft算法DFA最小化
   - 交互式状态图绘制

2. **LL1语法分析：**
   - 上下文无关文法输入
   - First集和Follow集计算
   - LL1分析表构建
   - 字符串语法分析
   - 冲突检测和处理

3. **LR0语法分析：**
   - 增广文法构造
   - LR0项目集规范族DFA
   - LR0分析表构建
   - 自底向上语法分析
   - 移进-归约操作可视化

4. **SLR1语法分析：**
   - 改进的LR分析算法
   - 使用Follow集解决冲突
   - SLR1分析表构建
   - 更强大的语法分析能力

5. **AI教学助手：**
   - 智能问答系统
   - 上下文感知的回复
   - 多页面聊天记录管理
   - 预设问题快速提问
   - 流式输出实时显示

6. **用户体验功能：**
   - 多主题切换（浅色/深色）
   - 响应式设计适配各种设备
   - 步骤流程图导航
   - 进度保存和恢复
   - 动画效果和交互反馈
    `,

    learningPath: `
**推荐学习路径：**

1. **入门阶段：**
   - 从有限自动机开始，理解基本概念
   - 学习正则表达式到NFA的转换
   - 理解DFA最小化的意义

2. **进阶阶段：**
   - 学习LL1语法分析，理解自顶向下分析
   - 掌握First集和Follow集的计算
   - 理解LL1分析表的构建过程

3. **高级阶段：**
   - 学习LR0语法分析，理解自底向上分析
   - 掌握项目集规范族的构造
   - 学习SLR1解决冲突的方法

4. **实践阶段：**
   - 使用AI助手解答疑问
   - 通过交互式操作加深理解
   - 尝试不同的输入测试算法
    `,

    technicalStack: `
**技术栈详情：**

**前端框架：**
- Vue 3.5.17 (Composition API)
- TypeScript 5.8.0
- Vite 7.0.0 (构建工具)

**UI组件和样式：**
- Tailwind CSS 4.1.11
- Lucide Vue Next (图标库)
- Vue Flow (图形绘制)
- GSAP (动画库)

**状态管理：**
- Pinia 3.0.3
- 模块化store设计

**AI集成：**
- OpenAI API (DeepSeek模型)
- 流式响应处理
- 上下文管理

**开发工具：**
- ESLint + Prettier (代码规范)
- Vitest (单元测试)
- Playwright (E2E测试)
    `
  }

  // 获取项目知识库
  const getProjectKnowledge = (topic: string) => {
    return projectKnowledgeBase[topic as keyof typeof projectKnowledgeBase] || projectKnowledgeBase.projectOverview
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
      localStorage.setItem('home-chat', JSON.stringify(data))
    } catch (err) {
      console.error('保存主页聊天记录失败:', err)
    }
  }

  const loadFromStorage = () => {
    try {
      const data = localStorage.getItem('home-chat')
      if (data) {
        const parsed = JSON.parse(data)
        messages.value = parsed.messages || []
        unreadCount.value = parsed.unreadCount || 0
        hasUnreadMessages.value = parsed.hasUnreadMessages || false
        lastContext.value = parsed.lastContext || null
      }
    } catch (err) {
      console.error('加载主页聊天记录失败:', err)
    }
  }

  const clearStorage = () => {
    try {
      localStorage.removeItem('home-chat')
    } catch (err) {
      console.error('清除主页聊天记录失败:', err)
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
    getProjectKnowledge,
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
