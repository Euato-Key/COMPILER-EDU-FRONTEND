import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Message, ChatContext } from '@/components/ai/types'

// LL1模块的AI聊天store
export const useLL1ChatStore = defineStore('ll1-chat', () => {
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

  // LL1模块的预设问题
  const presetQuestions = [
    '什么是LL1文法？',
    'First集合和Follow集合有什么区别？',
    '如何构造LL1分析表？',
    '什么是左递归？如何消除？',
    '什么是左公因子？如何提取？',
    'LL1分析算法的步骤是什么？',
    '为什么需要计算First和Follow集合？',
    'LL1分析表的冲突如何处理？',
    '什么是预测分析？',
    'LL1文法的判定条件是什么？'
  ]

  // LL1各步骤的知识库
  const stepKnowledgeBases = {
    1: `
LL(1)分析法基本定义：

LL(1)分析法是一种自顶向下语法分析方法，通过"从左到右扫描输入、最左推导、向前查看1个符号"确定产生式。

文法要求：
- 无左递归（直接/间接）
- 无回溯：对A的任意两个产生式A→α|β，需满足：
  - FIRST(α)∩FIRST(β) = ∅
  - 若β→*ε，则FIRST(α)∩FOLLOW(A) = ∅

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

文法验证规则：
1. 产生式格式：左部 → 右部
2. 左部必须是单个非终结符
3. 右部可以是终结符、非终结符或ε的组合
4. 多个产生式用|分隔
5. 不能包含左递归
6. 不能包含左公因子
`,

    2: `
关键集合计算：

FIRST集：
对符号串α，FIRST(α) 是α推导的首个终结符集合。
- 若α→*ε，则ε∈FIRST(α)
- 空串ε本身没有FIRST集

计算规则：
1. 若X是终结符，FIRST(X) = {X}
2. 若X是非终结符，X→Y₁Y₂...Yₖ，则FIRST(Y₁)中非ε元素属于FIRST(X)
3. 若Y₁→*ε，则FIRST(Y₂)中非ε元素属于FIRST(X)，以此类推
4. 若所有Yᵢ→*ε，则ε∈FIRST(X)

FOLLOW集：
对非终结符A，FOLLOW(A) 是所有句型中紧跟A后的终结符集合（含#）。

计算规则：
1. #∈FOLLOW(S)（S为开始符）
2. 若A→αBβ，则FIRST(β)中非ε元素属于FOLLOW(B)
3. 若A→αB或A→αBβ且β→*ε，则FOLLOW(A)⊆FOLLOW(B)
`,

    3: `
分析表构造：

LL(1)分析表构造规则：
对产生式A→α：
1. 若a∈FIRST(α)，则M[A, a] = A→α
2. 若ε∈FIRST(α)且a∈FOLLOW(A)，则M[A, a] = A→α

分析表定义：
M[A, a]表示在栈顶为A，输入符号为a时应该使用的产生式。

构造步骤：
1. 计算所有非终结符的FIRST集
2. 计算所有非终结符的FOLLOW集
3. 对每个产生式A→α：
   - 对FIRST(α)中的每个终结符a，在M[A, a]中填入A→α
   - 如果ε∈FIRST(α)，对FOLLOW(A)中的每个终结符a，在M[A, a]中填入A→α
4. 检查冲突：如果某个表项有多个产生式，则文法不是LL(1)文法

构造算法：
对于每个产生式A → α：
1. 对于每个a ∈ First(α)：
   - 如果a ≠ ε，则M[A, a] = A → α
2. 如果ε ∈ First(α)：
   - 对于每个b ∈ Follow(A)：
     - M[A, b] = A → α

冲突检测：
- 如果M[A, a]已经存在值，说明存在冲突
- 冲突类型：
  1. First-First冲突：两个产生式的First集合有交集
  2. First-Follow冲突：一个产生式可以推导出ε，另一个产生式的First集合与Follow集合有交集

冲突解决：
1. 消除左递归
2. 提取左公因子
3. 重写文法

示例：
文法：S → aB | bA
      A → a | bS
      B → b | aS

First集合：
First(S) = {a, b}
First(A) = {a, b}
First(B) = {a, b}

Follow集合：
Follow(S) = {$}
Follow(A) = {$}
Follow(B) = {$}

分析表：
    a     b     $
S  S→aB  S→bA
A  A→a   A→bS
B  B→aS  B→b
`,

    4: `
LL1字符串分析：

LL1分析算法：
使用栈和输入串进行自顶向下分析。

算法步骤：
1. 初始化：栈中只有开始符号S，输入指针指向输入串的第一个符号
2. 重复以下步骤直到栈为空或出错：
   a. 设栈顶符号为X，当前输入符号为a
   b. 如果X = a（终结符）：
      - 弹出X，输入指针前进
   c. 如果X是非终结符：
      - 查找分析表M[X, a]
      - 如果M[X, a]为空，报错
      - 如果M[X, a] = X → α：
        - 弹出X
        - 将α的符号从右到左压入栈（如果α = ε，不压入任何符号）
3. 如果栈为空且输入串处理完毕，分析成功

分析过程示例：
输入串：aab
文法：S → aB | bA
      A → a | bS
      B → b | aS

分析过程：
步骤  栈      输入    动作
1     S$      aab$    S→aB
2     aB$     aab$    匹配a
3     B$      ab$     B→aS
4     aS$     ab$     匹配a
5     S$      b$      S→bA
6     bA$     b$      匹配b
7     A$      $       A→a (但输入是$，冲突)
8     a$      $       匹配失败，报错

错误处理：
- 分析表项为空：语法错误
- 输入串提前结束：语法错误
- 栈为空但输入未结束：语法错误
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

    // 如果是AI回复，重置未读消息计数
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
      localStorage.setItem('ll1-chat', JSON.stringify(data))
    } catch (err) {
      console.error('保存LL1聊天记录失败:', err)
    }
  }

  const loadFromStorage = () => {
    try {
      const data = localStorage.getItem('ll1-chat')
      if (data) {
        const parsed = JSON.parse(data)
        messages.value = parsed.messages || []
        unreadCount.value = parsed.unreadCount || 0
        hasUnreadMessages.value = parsed.hasUnreadMessages || false
        lastContext.value = parsed.lastContext || null
      }
    } catch (err) {
      console.error('加载LL1聊天记录失败:', err)
    }
  }

  const clearStorage = () => {
    try {
      localStorage.removeItem('ll1-chat')
    } catch (err) {
      console.error('清除LL1聊天记录失败:', err)
    }
  }

  return {
    // 状态
    messages,
    isStreaming,
    currentStreamContent,
    error,
    unreadCount,
    hasUnreadMessages,
    lastContext,

    // 计算属性
    messageCount,
    hasMessages,

    // 预设问题和知识库
    presetQuestions,
    getStepKnowledge,

    // 方法
    addMessage,
    updateStreamContent,
    setStreaming,
    setError,
    clearChat,
    incrementUnreadCount,
    resetUnreadCount,
    updateContext,
    getContext,

    // 持久化
    saveToStorage,
    loadFromStorage,
    clearStorage
  }
})
