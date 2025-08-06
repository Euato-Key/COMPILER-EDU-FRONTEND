import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Message, ChatContext } from '@/components/ai/types'

// SLR1模块的AI聊天store
export const useSLR1ChatStore = defineStore('slr1-chat', () => {
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

  // SLR1模块的预设问题
  const presetQuestions = [
    '什么是SLR1文法？',
    'SLR1和LR0有什么区别？',
    'SLR1项目集规范族如何构造？',
    'SLR1分析表的构造步骤是什么？',
    '什么是SLR1冲突？如何处理？',
    'SLR1分析算法的原理是什么？',
    '为什么SLR1比LR0更强大？',
    'SLR1如何解决LR0的冲突？',
    '什么是Follow集合在SLR1中的作用？',
    'SLR1分析表的ACTION和GOTO表有什么区别？',
    '如何判断一个文法是SLR1文法？',
    'SLR1分析的优势和局限性是什么？',
    'SLR1和LR1有什么区别？',
    'SLR1的冲突解决策略是什么？'
  ]

  // SLR1各步骤的知识库
  const stepKnowledgeBases = {
    1: `
SLR(1)分析法基本思想：

SLR(1)分析法是对LR(0)项目集中的冲突，通过FOLLOW集解决：
- 若Iₖ含移进项目A→α·aβ和归约项目B→α·，且{a}∩FOLLOW(B)=∅，则冲突可解（a移进，归约仅当输入∈FOLLOW(B)）

文法要求：
- 文法必须是SLR(1)文法（冲突可通过FOLLOW集解决）
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
SLR(1)项目：

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

与LR(0)的区别：
- 项目集规范族构造方法与LR(0)相同
- 区别在于分析表构造时使用FOLLOW集解决冲突
- SLR(1)能够处理LR(0)无法处理的某些冲突
`,

    4: `
分析表构造：

ACTION表：
1. 移进规则同LR(0)：若A→α·aβ∈Iₖ且GO(Iₖ, a)=Iⱼ，则ACTION[k, a] = sⱼ
2. 归约规则：若A→α·∈Iₖ，则仅对a∈FOLLOW(A)，ACTION[k, a] = rⱼ
3. 接受规则同LR(0)：若S'→S·∈Iₖ，则ACTION[k, #] = acc

GOTO表：
同LR(0)：若GO(Iₖ, B)=Iⱼ（B为非终结符），则GOTO[k, B] = j

冲突解决：
- 移进/归约冲突：通过FOLLOW集解决
- 若A→α·aβ∈Iₖ和B→α·∈Iₖ，且a∈FOLLOW(B)，则选择移进
- 若a∉FOLLOW(B)，则选择归约
- 归约/归约冲突：通过FOLLOW集交集判断
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

与LR(0)的区别：
- 分析算法相同
- 区别在于分析表的构造
- SLR(1)能够处理更多的文法
- 分析效率与LR(0)相同
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
      localStorage.setItem('slr1-chat', JSON.stringify(data))
    } catch (err) {
      console.error('保存SLR1聊天记录失败:', err)
    }
  }

  const loadFromStorage = () => {
    try {
      const data = localStorage.getItem('slr1-chat')
      if (data) {
        const parsed = JSON.parse(data)
        messages.value = parsed.messages || []
        unreadCount.value = parsed.unreadCount || 0
        hasUnreadMessages.value = parsed.hasUnreadMessages || false
        lastContext.value = parsed.lastContext || null
      }
    } catch (err) {
      console.error('加载SLR1聊天记录失败:', err)
    }
  }

  const clearStorage = () => {
    try {
      localStorage.removeItem('slr1-chat')
    } catch (err) {
      console.error('清除SLR1聊天记录失败:', err)
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
