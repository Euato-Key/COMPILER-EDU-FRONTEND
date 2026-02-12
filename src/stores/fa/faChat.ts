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
有限自动机（FA）基本定义：

确定有限自动机（DFA）：
由五元组 (S, Σ, f, s₀, Z) 组成。
- S：有限状态集合
- Σ：输入字母表（有限字符集）
- f：状态转换函数，f(sᵢ, a) = sⱼ（sᵢ、sⱼ∈S，a∈Σ，单值映射）
- s₀：唯一初始状态（s₀∈S）
- Z：终态集合（Z⊆S）

非确定有限自动机（NFA）：
由五元组 (S, Σ, f, Q, Z) 组成。
- 与DFA的区别：初始状态为非空集 Q⊆S
- 转换函数 f 是多值映射（f(sᵢ, a) = {sⱼ, sₖ,...}）
- 允许输入空字 ε

等价性：任何NFA都存在等价的DFA（识别相同语言）。

正规式运算符：

基本运算符：
- |（竖线）：表示"或"关系
- •（点）：表示"连接"关系（通常可以省略）
- *（星号）：表示"闭包"关系

运算符优先级（从高到低）：
1. *（闭包）：最高优先级
2. •（连接）：中等优先级
3. |（或）：最低优先级

括号使用：
- 括号可以改变运算顺序
- 如果遵循上述优先级，在没有歧义的情况下可以省略括号

正规式与FA的转换：
正规式构造NFA：
1. 基础规则：
   - ε（空字）对应NFA：X→Y（X为初态，Y为终态，边标记ε）
   - 单个字符a∈Σ对应NFA：X→a→Y
2. 组合规则：
   - R = R₁|R₂（或）：构造两个并行的NFA，初态X通过ε连接两个子NFA的初态，子NFA的终态通过ε连接终态Y
   - R = R₁R₂（连接）：第一个NFA的终态通过ε连接第二个NFA的初态
   - R = R₁*（闭包）：初态X通过ε连接子NFA的初态，子NFA的终态通过ε连接自身初态和终态Y，X直接通过ε连接Y

NFA状态标记规则：
- X：初始状态（单圆圈）
- Y：终止状态（双圆圈）
- 1, 2, 3, ...：中间状态（单圆圈，用数字标记）
`,

    2: `
由正规表达式构造等价的NFA：

构造方法：
1. 将正规表达式R表示为拓广转换图（初始状态X，终止状态Y）
2. 运用三条转换规则逐步分解，不断加入新结点
3. 直至每条有向边上仅标识有Σ的一个字母或ε为止

转换规则：

规则①（或运算 r₁|r₂）：
- 转换前：状态sᵢ到sⱼ的边标记为r₁|r₂
- 转换后：sᵢ通过两条并行边到达sⱼ，一条标记r₁，一条标记r₂

规则②（连接运算 r₁r₂）：
- 转换前：状态sᵢ到sⱼ的边标记为r₁r₂
- 转换后：引入中间状态k（数字标记），sᵢ到k标记r₁，k到sⱼ标记r₂

规则③（闭包运算 r₁*）：
- 转换前：状态sᵢ到sⱼ的边标记为r₁*
- 转换后：引入中间状态k（数字标记），包含以下转换：
  * sᵢ通过ε转换到k
  * k有自环标记r₁（允许r₁重复0次或多次）
  * k通过ε转换到sⱼ
  * sᵢ直接通过ε转换到sⱼ（处理r₁*的0次重复情况）

NFA确定化（子集法）：

核心思想：将NFA的状态集合作为DFA的单个状态。

算法步骤：
1. 计算ε-闭包：对状态集I，ε_CLOSURE(I) 是I及所有通过ε边可达的状态集合
2. 对每个状态集I和输入a∈Σ，计算Iₐ = ε_CLOSURE(J)（J是从I经a边可达的状态集）
3. 重复步骤2，直到无新状态集生成，得到DFA的状态转换表

DFA状态标记规则：
- 0, 1, 2, 3, ...：状态用数字标记（单圆圈）
- 终态用双圆圈表示
- 初始状态通常为状态0

NFA特点：
- 同一输入可能有多个转移路径
- 允许ε转移
- 状态转换不确定
- 需要回溯或并行处理

DFA特点：
- 每个输入只有一个确定的转移路径
- 不允许ε转移
- 状态转换确定
- 处理效率高
`,

    3: `
DFA化简：

核心思想：合并等价状态，减少DFA的状态数量。

算法步骤：
1. 初始划分：将状态分为终态集和非终态集
2. 细化划分：对每个子集I，若存在a∈Σ使Iₐ跨越多个现有子集，则将I分裂为多个子集
3. 重复步骤2至无法细化，每个子集保留一个代表状态，删除冗余状态

等价状态定义：
两个状态s₁和s₂等价，当且仅当：
- 对于所有输入串w，δ*(s₁, w) ∈ F 当且仅当 δ*(s₂, w) ∈ F
- 其中F是终态集合，δ*是扩展转移函数

化简后的DFA：
- 状态数量最少
- 功能等价于原DFA
- 识别相同的语言

最小化DFA状态标记规则：
- 0, 1, 2, 3, ...：状态用数字标记（单圆圈）
- 终态用双圆圈表示
- 初始状态通常为状态0

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
- 行：状态（0, 1, 2, 3, ...）
- 列：输入符号
- 单元格：转移后的状态

DFA状态标记规则：
- 0, 1, 2, 3, ...：状态用数字标记（单圆圈）
- 终态用双圆圈表示
- 初始状态通常为状态0
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

最小化DFA状态标记规则：
- 0, 1, 2, 3, ...：状态用数字标记（单圆圈）
- 终态用双圆圈表示
- 初始状态通常为状态0

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
   - 圆形节点表示状态（0, 1, 2, 3, ...）
   - 双圆表示接受状态
   - 节点内标注状态数字

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
