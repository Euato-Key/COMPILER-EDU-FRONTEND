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
  const buildSystemPrompt = (context: ChatContext, faChatStore?: any, ll1ChatStore?: any): string => {
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

    return prompt
  }

          // 发送消息到AI
  const sendMessage = async (userMessage: string, context: ChatContext, faChatStore?: any, ll1ChatStore?: any): Promise<AIResponse> => {
    try {
      // 根据页面类型选择正确的store
      const currentStore = context.currentPage === 'fa' ? faChatStore :
                          context.currentPage === 'll1' ? ll1ChatStore : null

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
      const systemPrompt = buildSystemPrompt(context, faChatStore, ll1ChatStore)

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
                        context.currentPage === 'll1' ? ll1ChatStore : null

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
  const clearChat = (faChatStore?: any, ll1ChatStore?: any) => {
    if (faChatStore) {
      faChatStore.clearChat()
      faChatStore.clearStorage()
    } else if (ll1ChatStore) {
      ll1ChatStore.clearChat()
      ll1ChatStore.clearStorage()
    } else {
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
