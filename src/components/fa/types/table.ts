// 表格数据类型定义
export interface TableData {
  headers: string[]
  rows: (string | number)[][]
}

// 列配置
export interface ColumnConfig {
  key: string
  title: string
  type: 'state' | 'transition' | 'action'
  editable?: boolean
  placeholder?: string
  width?: string
}

// 表格类型
export type TableType = 'conversion' | 'matrix' | 'minimized'

// 终态高亮配置
export interface FinalStateConfig {
  isFinalState: (row: number, col: string, value: any) => boolean
  finalStateClass?: string
  finalStates?: Set<string>
}

// 验证状态
export interface ValidationState {
  row: number
  col: string
  status: 'valid' | 'invalid' | 'normal' | 'empty'
  errors?: string[]
}

// 表格主题
export interface TableTheme {
  headerBg: string
  rowBg: string
  alternateRowBg: string
  borderColor: string
  textColor: string
}

// 表格组件Props
export interface TransitionTableProps {
  // 表格数据
  data: TableData
  // 表格类型
  type?: TableType
  // 列配置
  columns: ColumnConfig[]
  // 是否显示答案
  showAnswer?: boolean
  // 是否可编辑
  editable?: boolean
  // 终态高亮配置
  finalStateConfig?: FinalStateConfig
  // 验证状态
  validationStates?: ValidationState[]
  // 表格主题
  theme?: Partial<TableTheme>
  // 事件处理
  onCellChange?: (row: number, col: string, value: string) => void
  onCellFocus?: (row: number, col: string) => void
  onCellBlur?: (row: number, col: string) => void
  onCellInput?: (row: number, col: string, value: string) => void
}

// 默认主题配置
export const DEFAULT_THEMES: Record<TableType, TableTheme> = {
  conversion: {
    headerBg: 'bg-green-50',
    rowBg: 'bg-white',
    alternateRowBg: 'bg-green-50',
    borderColor: 'border-gray-300',
    textColor: 'text-gray-900'
  },
  matrix: {
    headerBg: 'bg-green-50',
    rowBg: 'bg-white',
    alternateRowBg: 'bg-green-50',
    borderColor: 'border-gray-300',
    textColor: 'text-gray-900'
  },
  minimized: {
    headerBg: 'bg-green-50',
    rowBg: 'bg-white',
    alternateRowBg: 'bg-green-50',
    borderColor: 'border-gray-300',
    textColor: 'text-gray-900'
  }
}
