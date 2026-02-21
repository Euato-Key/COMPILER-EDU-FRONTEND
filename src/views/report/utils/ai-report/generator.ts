/**
 * AI报告生成器
 * 负责调用AI API生成报告并处理响应
 */

import type {
  AIReportContext,
  AIReportContent,
  AIReportGenerateOptions,
  AIReportGenerateResult,
  PromptTemplateVariables,
} from './types'
import { getFullPrompt } from './prompts'
import { saveAIReport, loadAIReport } from './storage'
import { sendAIChat } from '@/api/ai'

// 默认模型配置
const DEFAULT_MODEL = 'deepseek-chat'
const DEFAULT_TEMPERATURE = 0.3
const DEFAULT_MAX_TOKENS = 6000
const DEFAULT_THINKING = true  // 默认开启深度思考

/**
 * 生成AI报告
 * @param context 报告上下文
 * @param options 生成选项
 * @returns 生成结果
 */
export async function generateAIReport(
  context: AIReportContext,
  options: AIReportGenerateOptions = {}
): Promise<AIReportGenerateResult> {
  const { recordId, moduleType } = context

  // 1. 检查缓存
  if (!options.forceRegenerate) {
    const cachedReport = loadAIReport(recordId, moduleType)
    if (cachedReport) {
      console.log(`[AI Report] 使用缓存的报告: ${recordId}`)
      return {
        success: true,
        content: cachedReport.content,
        cached: true,
      }
    }
  }

  try {
    // 2. 构建Prompt
    const prompt = buildPrompt(context, options.customPrompt)

    // 3. 调用AI API（通过后端代理）
    const response = await callAIAPI(prompt, context.moduleType, options.modelParams)

    if (!response) {
      return {
        success: false,
        error: '生成报告失败，请稍后重试',
      }
    }

    // 4. 解析响应
    const content = parseAIResponse(response)

    // 5. 保存到缓存
    saveAIReport(recordId, moduleType, content)

    return {
      success: true,
      content,
      cached: false,
    }
  } catch (error) {
    console.error('[AI Report] 生成报告失败:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '生成报告失败',
    }
  }
}

/**
 * 构建Prompt
 * @param context 报告上下文
 * @param customPrompt 自定义Prompt
 * @returns 完整的Prompt
 */
function buildPrompt(context: AIReportContext, customPrompt?: string): string {
  if (customPrompt) {
    return customPrompt
  }

  const variables: PromptTemplateVariables = {
    moduleName: context.moduleName,
    input: context.input,
    errorAnalysis: formatErrorLogs(context.errorLogs),
    userAnswers: JSON.stringify(context.answerData, null, 2),
    correctAnswers: JSON.stringify(context.correctData, null, 2),
  }

  return getFullPrompt(context.moduleType, variables)
}

/**
 * 格式化错误日志
 * @param errorLogs 错误日志
 * @returns 格式化后的字符串
 */
function formatErrorLogs(errorLogs: any[]): string {
  if (!errorLogs || errorLogs.length === 0) {
    return '暂无错误记录'
  }

  return errorLogs
    .map((log, index) => {
      const lines = [`错误 ${index + 1}:`]
      for (const [key, value] of Object.entries(log)) {
        lines.push(`  ${key}: ${JSON.stringify(value)}`)
      }
      return lines.join('\n')
    })
    .join('\n\n')
}

/**
 * 调用AI API（通过后端代理）
 * @param prompt Prompt内容
 * @param moduleType 模块类型
 * @param modelParams 模型参数
 * @returns API响应内容
 */
async function callAIAPI(
  prompt: string,
  moduleType: string,
  modelParams?: { temperature?: number; maxTokens?: number; thinking?: boolean }
): Promise<string> {
  const response = await sendAIChat({
    messages: [
      {
        role: 'system',
        content:
          '你是一位专业的编译原理教学助手，擅长分析学生的学习情况并给出个性化的学习建议。请确保返回有效的JSON格式。',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    model: DEFAULT_MODEL,
    temperature: modelParams?.temperature ?? DEFAULT_TEMPERATURE,
    max_tokens: modelParams?.maxTokens ?? DEFAULT_MAX_TOKENS,
    thinking: (modelParams?.thinking ?? DEFAULT_THINKING) ? { type: 'enabled' } : undefined,
    response_format: { type: 'json_object' },
    module: moduleType,
  })

  if (!response) {
    throw new Error('AI 请求失败')
  }

  // 只取正式回答内容，忽略 reasoning_content
  return response.choices?.[0]?.message?.content || ''
}

/**
 * 解析AI响应
 * @param response API响应内容
 * @returns 解析后的报告内容
 */
function parseAIResponse(response: string): AIReportContent {
  try {
    // 尝试直接解析JSON
    const parsed = JSON.parse(response)

    // 验证必要字段
    if (!parsed.overallEvaluation) {
      throw new Error('响应缺少overallEvaluation字段')
    }

    // 确保数组字段存在
    return {
      overallEvaluation: parsed.overallEvaluation,
      strengths: parsed.strengths || [],
      weaknesses: parsed.weaknesses || [],
      suggestions: parsed.suggestions || [],
      knowledgeMastery: parsed.knowledgeMastery || [],
      learningPath: parsed.learningPath,
    }
  } catch (error) {
    console.error('[AI Report] 解析响应失败:', error)
    console.log('[AI Report] 原始响应:', response)

    // 返回默认内容
    return {
      overallEvaluation: '解析AI响应失败，请稍后重试。',
      strengths: [],
      weaknesses: [],
      suggestions: [
        {
          id: 'error',
          title: '重新生成报告',
          description: '由于技术原因，报告生成失败。请尝试刷新页面或重新生成报告。',
          priority: 'high',
        },
      ],
      knowledgeMastery: [],
    }
  }
}

/**
 * 强制重新生成报告
 * @param context 报告上下文
 * @returns 生成结果
 */
export async function regenerateAIReport(
  context: AIReportContext
): Promise<AIReportGenerateResult> {
  return generateAIReport(context, { forceRegenerate: true })
}

/**
 * 预览Prompt（用于调试）
 * @param context 报告上下文
 * @returns Prompt内容
 */
export function previewPrompt(context: AIReportContext): string {
  return buildPrompt(context)
}
