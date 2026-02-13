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
import { getApiKeyWithStoredPassword } from '@/api'

// DeepSeek API配置
const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions'
const DEFAULT_MODEL = 'deepseek-chat'
const DEFAULT_TEMPERATURE = 0.7
const DEFAULT_MAX_TOKENS = 4000

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

  // 2. 获取API密钥
  const apiKey = await getApiKeyWithStoredPassword()
  if (!apiKey) {
    return {
      success: false,
      error: '未配置API密钥，请先设置AI助手',
    }
  }

  try {
    // 3. 构建Prompt
    const prompt = buildPrompt(context, options.customPrompt)

    // 4. 调用AI API
    const response = await callDeepSeekAPI(prompt, apiKey, options.modelParams)

    // 5. 解析响应
    const content = parseAIResponse(response)

    // 6. 保存到缓存
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
 * 调用DeepSeek API
 * @param prompt Prompt内容
 * @param apiKey API密钥
 * @param modelParams 模型参数
 * @returns API响应
 */
async function callDeepSeekAPI(
  prompt: string,
  apiKey: string,
  modelParams?: { temperature?: number; maxTokens?: number }
): Promise<string> {
  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
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
      temperature: modelParams?.temperature ?? DEFAULT_TEMPERATURE,
      max_tokens: modelParams?.maxTokens ?? DEFAULT_MAX_TOKENS,
      response_format: { type: 'json_object' },
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error?.message || `API请求失败: ${response.status}`)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content || ''
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
