import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Message, ChatContext } from '@/components/ai/types'

// FA模块的AI聊天store
export const useFAChatStore = defineStore('fa-chat', () => {
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

  // FA模块的预设问题
  const presetQuestions = [
    '这个正则表达式是什么意思？',
    'NFA和DFA有什么区别？',
    '为什么要进行DFA最小化？',
    '子集构造法的步骤是什么？',
    '如何理解ε闭包的概念？',
    'DFA最小化的算法原理是什么？',
    '正则表达式如何转换为NFA？',
    '什么是确定性和非确定性？'
  ]

  // FA各步骤的知识库
  const stepKnowledgeBases = {
    1: `
正则表达式（Regular Expression）是描述字符串模式的形式化语言。

基本语法规则：
1. 字符：普通字符直接匹配
2. 特殊字符：
   - . 匹配任意单个字符
   - * 匹配前面的字符0次或多次
   - + 匹配前面的字符1次或多次
   - ? 匹配前面的字符0次或1次
   - | 表示或关系
   - () 用于分组
   - [] 字符类，匹配其中的任意一个字符
   - [^] 否定字符类，匹配不在其中的字符
   - \\ 转义字符

优先级（从高到低）：
1. () 括号
2. * + ? 量词
3. 连接
4. | 或

示例：
- a* 匹配0个或多个a
- (ab)* 匹配0个或多个ab
- a|b 匹配a或b
- [abc] 匹配a、b或c中的任意一个
- [^abc] 匹配除了a、b、c之外的任意字符
`,

    2: `
NFA（非确定性有限自动机）构造规则：

Thompson构造法：
1. 基本规则：
   - 单个字符a：创建两个状态，用a连接
   - ε：创建两个状态，用ε连接
   - 空集：创建两个状态，无连接

2. 组合规则：
   - 连接（ab）：将第一个自动机的接受状态与第二个自动机的初始状态用ε连接
   - 选择（a|b）：创建新的初始状态和接受状态，用ε连接到两个子自动机
   - 重复（a*）：创建新的初始状态和接受状态，用ε连接形成循环

3. 构造步骤：
   - 将正则表达式转换为后缀表达式
   - 使用栈构建NFA
   - 处理操作符：连接、选择、重复
   - 最终得到完整的NFA

NFA特点：
- 同一输入可能有多个转移路径
- 允许ε转移
- 状态转换不确定
- 需要回溯或并行处理
`,

    3: `
子集构造法（Subset Construction）将NFA转换为DFA：

核心思想：
将NFA的状态集合作为DFA的单个状态。

算法步骤：
1. 计算ε闭包：
   - 从初始状态开始，计算所有通过ε转移可达的状态
   - 这个集合作为DFA的初始状态

2. 对于每个输入符号a：
   - 从当前状态集合出发，计算move(I, a)
   - 对结果计算ε闭包
   - 如果得到新的状态集合，创建新的DFA状态

3. 重复步骤2，直到没有新的状态集合

4. 确定接受状态：
   - 如果DFA状态包含NFA的接受状态，则该DFA状态为接受状态

示例：
- 初始状态：ε-closure({q0}) = {q0, q1, q2}
- 输入a：move({q0, q1, q2}, a) = {q3}
- ε闭包：ε-closure({q3}) = {q3, q4}
- 新状态：{q3, q4}
`,

    4: `
DFA（确定性有限自动机）构造：

DFA特点：
- 每个输入在任意状态下都有唯一的转移
- 不允许ε转移
- 状态转换确定
- 处理效率高

从NFA到DFA的转换：
1. 使用子集构造法
2. 每个DFA状态对应NFA的一个状态集合
3. 转移函数：δ'(I, a) = ε-closure(move(I, a))

DFA最小化的必要性：
- 减少状态数量
- 提高处理效率
- 简化自动机结构

DFA状态转换表：
- 行：状态
- 列：输入符号
- 单元格：转移后的状态
`,

    5: `
DFA最小化算法（Hopcroft算法）：

目标：
合并等价状态，得到最简DFA。

等价状态定义：
两个状态p和q等价，当且仅当：
- 要么都是接受状态，要么都不是接受状态
- 对于任意输入a，δ(p,a)和δ(q,a)等价

算法步骤：
1. 初始分割：将状态分为接受状态和非接受状态两组

2. 细化分割：
   - 对于每个分割组G
   - 对于每个输入符号a
   - 检查组内状态在输入a下的转移是否在同一组
   - 如果不在同一组，将G分割为更小的组

3. 重复步骤2，直到无法进一步分割

4. 构建最小化DFA：
   - 每个分割组作为一个新状态
   - 转移函数：新状态间的转移

示例：
- 初始：{A,B,C,D}（接受）, {E,F}（非接受）
- 输入a：{A,B}（转移到接受）, {C,D}（转移到非接受）
- 结果：{A,B}, {C,D}, {E,F}
`,

    6: `
最小化DFA的可视化：

最小化后的DFA特点：
1. 状态数量最少
2. 保持原有语言识别能力
3. 结构更简洁

可视化要点：
1. 状态表示：
   - 圆形节点表示状态
   - 双圆表示接受状态
   - 节点内标注状态名称

2. 转移表示：
   - 有向边表示转移
   - 边上标注输入符号
   - 多个输入用逗号分隔

3. 布局优化：
   - 避免边交叉
   - 合理分布状态
   - 清晰的层次结构

最小化DFA的应用：
- 词法分析器优化
- 正则表达式引擎
- 模式匹配算法
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
      localStorage.setItem('fa-chat', JSON.stringify(data))
    } catch (err) {
      console.error('保存FA聊天记录失败:', err)
    }
  }

  const loadFromStorage = () => {
    try {
      const data = localStorage.getItem('fa-chat')
      if (data) {
        const parsed = JSON.parse(data)
        messages.value = parsed.messages || []
        unreadCount.value = parsed.unreadCount || 0
        hasUnreadMessages.value = parsed.hasUnreadMessages || false
        lastContext.value = parsed.lastContext || null
      }
    } catch (err) {
      console.error('加载FA聊天记录失败:', err)
    }
  }

  const clearStorage = () => {
    try {
      localStorage.removeItem('fa-chat')
    } catch (err) {
      console.error('清除FA聊天记录失败:', err)
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
