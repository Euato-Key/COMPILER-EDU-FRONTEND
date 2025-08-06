import { ref, reactive } from 'vue'
import OpenAI from 'openai'
import type { Message, ChatContext, AIConfig, AIResponse } from '../types'

export function useAIChat() {
  // AI配置
  const aiConfig = reactive<AIConfig>({
    apiKey: 'sk-c5556dda462041a9ac35303eb5ffe78c',
    baseURL: 'https://api.deepseek.com',
    model: 'deepseek-chat',
    temperature: 1.0,
    maxTokens: 2048,
    stream: true
  })

  // 聊天状态
  const messages = ref<Message[]>([])
  const isStreaming = ref(false)
  const currentStreamContent = ref('')
  const error = ref<string | null>(null)

  // 初始化OpenAI客户端
  const openai = new OpenAI({
    baseURL: aiConfig.baseURL,
    apiKey: aiConfig.apiKey,
    dangerouslyAllowBrowser: true // 允许在浏览器中使用
  })

  // 添加消息
  const addMessage = (role: Message['role'], content: string) => {
    const message: Message = {
      role,
      content,
      timestamp: Date.now()
    }
    messages.value.push(message)
  }

    // 构建系统提示词
  const buildSystemPrompt = (context: ChatContext, faChatStore?: any, ll1ChatStore?: any, lr0ChatStore?: any, slr1ChatStore?: any, homeChatStore?: any): string => {
    let prompt = '你是一个编译原理教学助手，专门帮助学生理解编译原理的概念和算法。'

    if (context.currentPage) {
      prompt += `\n\n当前页面：${context.currentPage}`
    }

    if (context.pageContext) {
      prompt += `\n\n页面内容：${context.pageContext}`
    }

    // 添加FA步骤知识库
    if (faChatStore && context.userInput?.currentStep) {
      const stepKnowledge = faChatStore.getStepKnowledge(context.userInput.currentStep)
      prompt += `\n\n当前步骤知识库：${stepKnowledge}`
    }

    // 添加LL1步骤知识库
    if (ll1ChatStore && context.userInput?.currentStep) {
      const stepKnowledge = ll1ChatStore.getStepKnowledge(context.userInput.currentStep)
      prompt += `\n\n当前步骤知识库：${stepKnowledge}`
    }

    // 添加LR0步骤知识库
    if (lr0ChatStore && context.userInput?.currentStep) {
      const stepKnowledge = lr0ChatStore.getStepKnowledge(context.userInput.currentStep)
      prompt += `\n\n当前步骤知识库：${stepKnowledge}`
    }

    // 添加SLR1步骤知识库
    if (slr1ChatStore && context.userInput?.currentStep) {
      const stepKnowledge = slr1ChatStore.getStepKnowledge(context.userInput.currentStep)
      prompt += `\n\n当前步骤知识库：${stepKnowledge}`
    }

    // 添加主页项目知识库
    if (homeChatStore && context.currentPage === 'home') {
      const projectKnowledge = homeChatStore.getProjectKnowledge('projectOverview')
      const featuresKnowledge = homeChatStore.getProjectKnowledge('implementedFeatures')
      const learningPathKnowledge = homeChatStore.getProjectKnowledge('learningPath')
      const techStackKnowledge = homeChatStore.getProjectKnowledge('technicalStack')

      prompt += `\n\n项目概述：${projectKnowledge}`
      prompt += `\n\n已实现功能：${featuresKnowledge}`
      prompt += `\n\n学习路径：${learningPathKnowledge}`
      prompt += `\n\n技术栈：${techStackKnowledge}`
    }

    if (context.userInput) {
      prompt += `\n\n用户输入数据：${JSON.stringify(context.userInput, null, 2)}`
    }

    if (context.backendData) {
      prompt += `\n\n后端返回数据：${JSON.stringify(context.backendData, null, 2)}`
    }

    if (context.userAnswers) {
      prompt += `\n\n用户答题记录：${JSON.stringify(context.userAnswers, null, 2)}`
    }

    prompt += '\n\n请根据以上信息，为用户提供有针对性的帮助和解释。回答要简洁明了，重点突出。'

    // 添加图表渲染功能说明
    prompt += '\n\n重要提示：当前环境支持图表渲染功能！'
    prompt += '\n\n1. Mermaid图表：你可以使用```mermaid代码块来创建流程图、时序图、甘特图等。例如：'
    prompt += '\n```mermaid'
    prompt += '\ngraph LR'
    prompt += '\n    A[开始] --> B[处理]'
    prompt += '\n    B --> C[结束]'
    prompt += '\n```'

    prompt += '\n\n2. Graphviz DOT图表：你可以使用```dot代码块来创建有向图、无向图、状态图等。例如：'
    prompt += '\n```dot'
    prompt += '\ndigraph example {'
    prompt += '\n    A -> B -> C;'
    prompt += '\n    B -> D;'
    prompt += '\n}'
    prompt += '\n```'

    prompt += '\n\n在回答用户问题时，如果可以用图表来更好地展示概念、算法流程、数据结构或关系，请主动使用这些图表功能。图表能够帮助用户更直观地理解复杂的概念。'

    prompt += '\n\n图表选择建议：'
    prompt += '\n\n默认使用Mermaid图表的情况：'
    prompt += '\n- 流程图：展示算法流程、决策过程、业务流程'
    prompt += '\n- 时序图：展示交互时序、消息传递、系统调用'
    prompt += '\n- 甘特图：展示项目进度、时间安排、任务依赖'
    prompt += '\n- 类图：展示类关系、对象结构、继承关系'
    prompt += '\n- 饼图：展示数据分布、比例关系、统计信息'
    prompt += '\n- 用户旅程图：展示用户体验流程、用户行为'
    prompt += '\n- Git图：展示版本控制分支、提交历史'

    prompt += '\n\n默认使用Graphviz DOT图表的情况：'
    prompt += '\n- 自动机图：DFA、NFA、PDA等有限自动机（Graphviz的布局算法特别适合自动机）'
    prompt += '\n- 语法树：抽象语法树、语法分析树（需要精确的层次结构）'
    prompt += '\n- 网络拓扑图：计算机网络、系统架构（需要精确的节点位置）'
    prompt += '\n- 数据库ER图：实体关系图、数据模型（需要专业的图形布局）'
    prompt += '\n- 复杂状态图：状态转换图、状态机（需要精确的状态布局）'
    prompt += '\n- 依赖关系图：模块依赖、组件关系（需要清晰的层次结构）'

    prompt += '\n\n特别说明：'
    prompt += '\n- 对于编译原理中的DFA、NFA等自动机图，优先使用Graphviz DOT，因为其布局算法能够生成更美观、更清晰的自动机图'
    prompt += '\n- 对于一般的流程图、时序图等，使用Mermaid更简单高效'
    prompt += '\n- 当需要精确控制节点位置和样式时，使用Graphviz DOT'
    prompt += '\n- 当需要快速展示简单关系时，使用Mermaid'

    return prompt
  }

          // 发送消息到AI
  const sendMessage = async (userMessage: string, context: ChatContext, faChatStore?: any, ll1ChatStore?: any, lr0ChatStore?: any, slr1ChatStore?: any, homeChatStore?: any): Promise<AIResponse> => {
    try {
      // 根据页面类型选择正确的store
      const currentStore = context.currentPage === 'fa' ? faChatStore :
                          context.currentPage === 'll1' ? ll1ChatStore :
                          context.currentPage === 'lr0' ? lr0ChatStore :
                          context.currentPage === 'slr1' ? slr1ChatStore :
                          context.currentPage === 'home' ? homeChatStore : null

      if (currentStore) {
        currentStore.setError(null)
        currentStore.setStreaming(true)
        currentStore.updateStreamContent('')
      } else {
        error.value = null
        isStreaming.value = true
        currentStreamContent.value = ''
      }

      // 添加用户消息
      if (currentStore) {
        currentStore.addMessage('user', userMessage)
      } else {
        addMessage('user', userMessage)
      }

                  // 构建系统提示词
      const systemPrompt = buildSystemPrompt(context, faChatStore, ll1ChatStore, lr0ChatStore, slr1ChatStore, homeChatStore)

      // 构建消息历史
      const messageHistory: Message[] = [
        { role: 'system', content: systemPrompt },
        ...(currentStore ? currentStore.messages : messages.value)
      ]

      // 发送请求
      const stream = await openai.chat.completions.create({
        model: aiConfig.model,
        messages: messageHistory,
        temperature: aiConfig.temperature,
        max_tokens: aiConfig.maxTokens,
        stream: aiConfig.stream
      })

                  // 处理流式响应
      let fullContent = ''

              for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || ''
          if (content) {
            fullContent += content
            if (currentStore) {
              currentStore.updateStreamContent(fullContent)
            } else {
              currentStreamContent.value = fullContent
            }
          }
        }

      // 添加AI回复
      if (currentStore) {
        currentStore.addMessage('assistant', fullContent)
        currentStore.setStreaming(false)
        currentStore.updateStreamContent('')
      } else {
        addMessage('assistant', fullContent)
        isStreaming.value = false
        currentStreamContent.value = ''
      }

      return {
        content: fullContent,
        isStreaming: false
      }

                } catch (err) {
      console.error('AI聊天错误:', err)
      const errorMessage = err instanceof Error ? err.message : '未知错误'

      // 根据页面类型选择正确的store进行错误处理
      const errorStore = context.currentPage === 'fa' ? faChatStore :
                        context.currentPage === 'll1' ? ll1ChatStore :
                        context.currentPage === 'lr0' ? lr0ChatStore :
                        context.currentPage === 'slr1' ? slr1ChatStore :
                        context.currentPage === 'home' ? homeChatStore : null

      if (errorStore) {
        errorStore.setError(errorMessage)
        errorStore.setStreaming(false)
        errorStore.updateStreamContent('')
      } else {
        error.value = errorMessage
        isStreaming.value = false
        currentStreamContent.value = ''
      }

      return {
        content: '',
        isStreaming: false,
        error: errorMessage
      }
    }
  }

  // 清空聊天记录
  const clearChat = (faChatStore?: any, ll1ChatStore?: any, lr0ChatStore?: any, slr1ChatStore?: any, homeChatStore?: any) => {
    // 清除所有传入的store
    if (faChatStore) {
      faChatStore.clearChat()
      faChatStore.clearStorage()
    }
    if (ll1ChatStore) {
      ll1ChatStore.clearChat()
      ll1ChatStore.clearStorage()
    }
    if (lr0ChatStore) {
      lr0ChatStore.clearChat()
      lr0ChatStore.clearStorage()
    }
        if (slr1ChatStore) {
      slr1ChatStore.clearChat()
      slr1ChatStore.clearStorage()
    }
    if (homeChatStore) {
      homeChatStore.clearChat()
      homeChatStore.clearStorage()
    }

    // 如果没有传入任何store，清除本地状态
    if (!faChatStore && !ll1ChatStore && !lr0ChatStore && !slr1ChatStore && !homeChatStore) {
      messages.value = []
      error.value = null
      currentStreamContent.value = ''
    }
  }

  // 获取预设问题
  const getPresetQuestions = (pageType: string): string[] => {
    const questionMap: Record<string, string[]> = {
      'fa': [
        '这个正则表达式是什么意思？',
        'NFA和DFA有什么区别？',
        '为什么要进行DFA最小化？',
        '子集构造法的步骤是什么？'
      ],
      'll1': [
        '什么是First集和Follow集？',
        '如何判断一个文法是否是LL1文法？',
        'LL1分析表的构建过程是什么？',
        '为什么会出现冲突？'
      ],
      'lr0': [
        'LR0分析的基本思想是什么？',
        '项目集规范族是如何构造的？',
        'LR0分析表的构建过程是什么？',
        '什么是移进-归约冲突？'
      ],
      'slr1': [
        'SLR1和LR0有什么区别？',
        'SLR1如何解决LR0的冲突问题？',
        'SLR1分析表的构建过程是什么？',
        '什么时候使用SLR1分析？'
      ],
      'home': [
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
    }

    return questionMap[pageType] || [
      '请解释一下当前页面的内容',
      '我遇到了什么问题？',
      '如何理解这个算法？'
    ]
  }

  return {
    // 状态
    messages,
    isStreaming,
    currentStreamContent,
    error,
    aiConfig,

    // 方法
    sendMessage,
    addMessage,
    clearChat,
    getPresetQuestions
  }
}
