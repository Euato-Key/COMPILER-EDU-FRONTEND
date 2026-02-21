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
    1: `
LR(0)分析法基本定义：

LR(0)分析法是一种自底向上语法分析方法，基于"活前缀"（规范句型中不含句柄后符号的前缀）进行规范归约。

文法要求：
- 文法必须是LR(0)文法（项目集无冲突：无移进/归约或归约/归约冲突）
- 输入串为文法的句子

文法表示法：
- 大写字母表示非终结符（如S, A, B）
- 小写字母表示终结符（如a, b, c）
- ε表示空串
- |表示或关系
- →表示推导关系

示例文法：
S → aB | bA
A → a | bS
B → b | aS
`,

    2: `
LR(0)项目：

产生式右部加圆点表示分析进度，如：
- 移进项目：A→α·aβ（圆点后为终结符）
- 归约项目：A→α·（圆点在末尾）
- 待约项目：A→α·Bβ（圆点后为非终结符）
- 接受项目：S'→S·（S'为拓广文法开始符）

拓广文法：
添加S'→S（S为原文法开始符）

闭包运算（CLOSURE）：
若I是项目集，则CLOSURE(I) 包含：
1. I中所有项目
2. 若A→α·Bβ∈CLOSURE(I)，则B的所有初始项目B→·γ∈CLOSURE(I)

转换函数（GO）：
GO(I, X) = CLOSURE({A→αX·β | A→α·Xβ∈I})，X为文法符号
`,

    3: `
项目集规范族构造：

构造步骤：
1. 从拓广文法的初始项目S'→·S开始
2. 计算CLOSURE({S'→·S})
3. 对每个项目集I和每个文法符号X，计算GO(I, X)
4. 重复步骤3，直到无新项目集生成
5. 得到项目集规范族C = {I₀, I₁, ..., Iₙ}

项目集特点：
- 每个项目集代表分析过程中的一个状态
- 项目集中的项目表示在该状态下可能的应用产生式
- 项目集之间的转换表示分析过程中的状态转移
`,

    4: `
分析表构造：

ACTION表：
1. 若A→α·aβ∈Iₖ且GO(Iₖ, a)=Iⱼ，则ACTION[k, a] = sⱼ（移进）
2. 若A→α·∈Iₖ，则对所有a∈V_T∪{#}，ACTION[k, a] = rⱼ（归约，j为产生式编号）
3. 若S'→S·∈Iₖ，则ACTION[k, #] = acc（接受）

GOTO表：
若GO(Iₖ, B)=Iⱼ（B为非终结符），则GOTO[k, B] = j

冲突检查：
- 移进/归约冲突：同一项目集中既有移进项目又有归约项目
- 归约/归约冲突：同一项目集中有多个归约项目
- 如果存在冲突，则文法不是LR(0)文法
`,

    5: `
字符串分析：

分析算法：
1. 初始化：栈中只有状态0，输入串后加#
2. 设当前状态为s，输入符号为a
3. 查ACTION[s, a]：
   - 若为sⱼ（移进）：将a和j压栈，读入下一个输入符号
   - 若为rⱼ（归约）：按产生式j归约，弹出相应数量的符号，查GOTO表确定新状态
   - 若为acc（接受）：分析成功
   - 若为空：分析失败
4. 重复步骤3直到接受或失败

分析特点：
- 自底向上分析
- 使用栈存储状态和符号
- 通过查表确定下一步动作
- 能够处理左递归文法
`
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

  const deleteMessage = (index: number) => {
    if (index >= 0 && index < messages.value.length) {
      messages.value.splice(index, 1)
    }
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
    deleteMessage,
    incrementUnreadCount,
    resetUnreadCount,
    updateContext,
    getContext,
    saveToStorage,
    loadFromStorage,
    clearStorage
  }
})
