/**
 * AI报告生成模块通用类型定义
 * 用于各模块生成AI报告总结
 */

// AI报告内容结构
export interface AIReportContent {
  // 总体评价
  overallEvaluation: string
  // 优点
  strengths: string[]
  // 不足
  weaknesses: string[]
  // 具体建议
  suggestions: AISuggestion[]
  // 知识点掌握情况
  knowledgeMastery: KnowledgeMasteryItem[]
  // 学习路径建议
  learningPath?: string
}

// 建议项
export interface AISuggestion {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  relatedStep?: string
}

// 知识点掌握情况
export interface KnowledgeMasteryItem {
  knowledgePoint: string
  masteryLevel: 'excellent' | 'good' | 'average' | 'poor'
  description: string
}

// AI报告数据（存储用）
export interface AIReportData {
  recordId: string
  moduleType: string
  content: AIReportContent
  generatedAt: string
  version: string
}

// 报告生成上下文
export interface AIReportContext {
  // 模块类型
  moduleType: string
  // 模块名称
  moduleName: string
  // 记录ID
  recordId: string
  // 答题数据
  answerData: Record<string, any>
  // 正确答案数据
  correctData: Record<string, any>
  // 错误日志
  errorLogs: any[]
  // 原始正则/输入
  input: string
}

// 报告生成选项
export interface AIReportGenerateOptions {
  // 是否强制重新生成
  forceRegenerate?: boolean
  // 自定义prompt
  customPrompt?: string
  // 模型参数
  modelParams?: {
    temperature?: number
    maxTokens?: number
  }
}

// 报告生成结果
export interface AIReportGenerateResult {
  success: boolean
  content?: AIReportContent
  error?: string
  cached?: boolean
}

// 模块特定的上下文构建器接口
export interface AIReportContextBuilder<T extends AIReportContext = AIReportContext> {
  buildContext(recordId: string): T | null
}

// Prompt模板变量
export interface PromptTemplateVariables {
  moduleName: string
  input: string
  errorAnalysis: string
  userAnswers: string
  correctAnswers: string
}
