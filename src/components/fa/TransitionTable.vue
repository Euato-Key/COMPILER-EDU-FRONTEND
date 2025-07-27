<template>
  <div class="transition-table-wrapper">
    <div class="overflow-x-auto">
      <table class="w-full border-collapse border border-gray-300">
        <!-- 表头 -->
        <thead>
          <tr :class="currentTheme.headerBg">
            <th
              v-for="column in columns"
              :key="column.key"
              :class="[
                'border border-gray-300 px-3 py-2 text-center font-semibold',
                column.width ? column.width : ''
              ]"
            >
              {{ column.title }}
            </th>
          </tr>
        </thead>

        <!-- 表格内容 -->
        <tbody>
          <tr
            v-for="(row, rowIndex) in data.rows"
            :key="rowIndex"
            :class="rowIndex % 2 === 0 ? currentTheme.rowBg : currentTheme.alternateRowBg"
          >
            <td
              v-for="(column, colIndex) in columns"
              :key="column.key"
              :class="getCellClass(rowIndex, column.key)"
            >
              <!-- 可编辑单元格 -->
              <input
                v-if="editable && !showAnswer && column.editable !== false"
                v-model="cellValues[rowIndex][column.key]"
                type="text"
                :placeholder="column.placeholder || '-'"
                :class="getInputClass(rowIndex, column.key)"
                :disabled="!editable"
                @focus="handleCellFocus(rowIndex, column.key)"
                @input="handleCellInput(rowIndex, column.key, $event)"
                @blur="handleCellBlur(rowIndex, column.key)"
              />

              <!-- 只读单元格 -->
              <span v-else :class="getDisplayClass(rowIndex, column.key)">
                {{ getCellValue(rowIndex, column.key) || '-' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type {
  TransitionTableProps,
  TableTheme,
  ValidationState,
  FinalStateConfig
} from './types/table'
import { DEFAULT_THEMES } from './types/table'

// 定义组件Props
const props = withDefaults(defineProps<TransitionTableProps>(), {
  type: 'minimized',
  showAnswer: false,
  editable: false,
  finalStateClass: 'final-state-cell text-green-800 font-semibold'
})

// 定义组件事件
const emit = defineEmits<{
  'cell-change': [row: number, col: string, value: string]
  'cell-focus': [row: number, col: string]
  'cell-blur': [row: number, col: string]
  'cell-input': [row: number, col: string, value: string]
}>()

// 本地状态
const cellValues = ref<Record<number, Record<string, string>>>({})

// 计算当前主题
const currentTheme = computed<TableTheme>(() => {
  const defaultTheme = DEFAULT_THEMES[props.type]
  return { ...defaultTheme, ...props.theme }
})

// 获取单元格值
const getCellValue = (rowIndex: number, colKey: string): string => {
  if (props.showAnswer) {
    // 显示答案模式：从data中获取值
    const colIndex = props.columns.findIndex(col => col.key === colKey)
    return colIndex >= 0 ? String(props.data.rows[rowIndex]?.[colIndex] || '') : ''
  } else {
    // 编辑模式：从本地状态获取值
    return cellValues.value[rowIndex]?.[colKey] || ''
  }
}

// 获取单元格CSS类
const getCellClass = (rowIndex: number, colKey: string): string => {
  const baseClass = 'border border-gray-300 px-3 py-2 text-center'

  // 检查是否为终态
  if (props.finalStateConfig) {
    const cellValue = getCellValue(rowIndex, colKey)
    if (props.finalStateConfig.isFinalState(rowIndex, colKey, cellValue)) {
      return `${baseClass} ${props.finalStateConfig.finalStateClass || 'final-state-cell text-green-800 font-semibold'}`
    }
  }

  return baseClass
}

// 获取输入框CSS类
const getInputClass = (rowIndex: number, colKey: string): string => {
  const baseClass = 'w-full text-center border-none bg-transparent focus:outline-none focus:ring-1 rounded'

  // 获取验证状态
  const validationState = props.validationStates?.find(
    state => state.row === rowIndex && state.col === colKey
  )

  if (validationState) {
    switch (validationState.status) {
      case 'valid':
        return `${baseClass} focus:ring-green-500`
      case 'invalid':
        return `${baseClass} focus:ring-red-500`
      case 'empty':
        return `${baseClass} focus:ring-yellow-500`
      default:
        return `${baseClass} focus:ring-blue-500`
    }
  }

  return `${baseClass} focus:ring-blue-500`
}

// 获取显示CSS类
const getDisplayClass = (rowIndex: number, colKey: string): string => {
  return 'text-gray-900'
}

// 事件处理函数
const handleCellFocus = (rowIndex: number, colKey: string) => {
  emit('cell-focus', rowIndex, colKey)
}

const handleCellInput = (rowIndex: number, colKey: string, event: Event) => {
  const value = (event.target as HTMLInputElement).value
  emit('cell-input', rowIndex, colKey, value)
}

const handleCellBlur = (rowIndex: number, colKey: string) => {
  const value = cellValues.value[rowIndex]?.[colKey] || ''
  emit('cell-blur', rowIndex, colKey)
  emit('cell-change', rowIndex, colKey, value)
}

// 初始化单元格值
const initializeCellValues = () => {
  cellValues.value = {}
  props.data.rows.forEach((row, rowIndex) => {
    cellValues.value[rowIndex] = {}
    props.columns.forEach((column, colIndex) => {
      cellValues.value[rowIndex][column.key] = String(row[colIndex] || '')
    })
  })
}

// 监听数据变化
watch(() => props.data, initializeCellValues, { immediate: true })
</script>

<style scoped>
/* 终态单元格高亮动画 */
@keyframes finalStateGlow {
  0%, 100% {
    box-shadow: 0 0 5px rgba(34, 197, 94, 0.3), 0 0 10px rgba(34, 197, 94, 0.2);
  }
  50% {
    box-shadow: 0 0 10px rgba(34, 197, 94, 0.5), 0 0 20px rgba(34, 197, 94, 0.3);
  }
}

/* 终态单元格样式 */
.final-state-cell {
  animation: finalStateGlow 2s ease-in-out infinite;
  border: 2px solid #22c55e !important;
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%) !important;
}
</style>
