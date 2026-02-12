// 导出所有store
export { useAppStore, type AnalysisType } from './app'
export { useCommonStore } from './common'

// 导出新的 Store（推荐使用）
export { useLL1Store, useLL1Store as useLL1StoreNew } from './ll1/ll1-new'
export { useLR0Store, useLR0Store as useLR0StoreNew } from './lr0/lr0-new'
export { useSLR1Store, useSLR1Store as useSLR1StoreNew } from './slr1/slr1-new'
export { useFAStore, useFAStore as useFAStoreNew } from './fa/fa-new'

// 导出类型
export type { FAErrorLog, FAHistoryRecord, FAStoreData } from './fa/fa-new'
export type { LL1ErrorLog, LL1HistoryRecord, LL1StoreData } from './ll1/ll1-new'
export type { LR0ErrorLog, LR0HistoryRecord, LR0StoreData } from './lr0/lr0-new'
export type { SLR1ErrorLog, SLR1HistoryRecord, SLR1StoreData } from './slr1/slr1-new'

// 导出AI聊天store
export { useFAChatStore } from './fa/faChat'
export { useLL1ChatStore } from './ll1/ll1Chat'
export { useLR0ChatStore } from './lr0/lr0Chat'
export { useSLR1ChatStore } from './slr1/slr1Chat'
export { useHomeChatStore } from './homeChat'

// 导出AI上下文构造器
export { buildFAContext, getCurrentStepUserAnswer as getFACurrentStepUserAnswer } from './fa/aiContextBuilder'
export { buildLL1Context, getCurrentStepUserAnswer as getLL1CurrentStepUserAnswer } from './ll1/aiContextBuilder'
export { buildLR0Context, getCurrentStepUserAnswer as getLR0CurrentStepUserAnswer } from './lr0/aiContextBuilder'
export { buildSLR1Context, getCurrentStepUserAnswer as getSLR1CurrentStepUserAnswer } from './slr1/aiContextBuilder'

