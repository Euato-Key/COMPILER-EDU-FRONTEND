/**
 * AI报告生成模块入口
 * 导出所有类型、函数和组件
 */

// 类型定义
export type {
  AIReportContent,
  AIReportData,
  AIReportContext,
  AIReportGenerateOptions,
  AIReportGenerateResult,
  AISuggestion,
  KnowledgeMasteryItem,
  AIReportContextBuilder,
  PromptTemplateVariables,
} from './types'

// Prompt模板
export {
  BASE_REPORT_PROMPT_TEMPLATE,
  FA_MODULE_PROMPT_SUPPLEMENT,
  LL1_MODULE_PROMPT_SUPPLEMENT,
  LR0_MODULE_PROMPT_SUPPLEMENT,
  SLR1_MODULE_PROMPT_SUPPLEMENT,
  MODULE_PROMPT_SUPPLEMENTS,
  fillPromptTemplate,
  getFullPrompt,
} from './prompts'

// 存储管理
export {
  saveAIReport,
  loadAIReport,
  clearAIReport,
  clearAllAIReports,
  clearModuleAIReports,
  getAllCachedReports,
  hasValidAIReport,
  getStorageKey,
} from './storage'

// 生成器
export {
  generateAIReport,
  regenerateAIReport,
  previewPrompt,
} from './generator'
