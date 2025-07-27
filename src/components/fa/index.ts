// FA组件导出
export { default as TransitionTable } from './TransitionTable.vue'

// 类型导出
export type {
  TransitionTableProps,
  TableData,
  ColumnConfig,
  TableType,
  FinalStateConfig,
  ValidationState,
  TableTheme
} from './types/table'

// 工具函数导出
export {
  isConversionTableFinalState,
  createMatrixFinalStateChecker,
  createMinimizedMatrixFinalStateChecker,
  extractAcceptingStatesFromDot,
  buildAcceptingStatesFromData,
  buildMinimizedAcceptingStates
} from './utils/finalStateUtils'

// 常量导出
export { DEFAULT_THEMES } from './types/table'
