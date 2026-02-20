<template>
  <div class="report-error-list bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
        <Icon icon="lucide:alert-triangle" class="w-5 h-5 text-red-500" />
        {{ title }}
        <span class="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">
          {{ totalCount }} 个错误
        </span>
      </h3>
      <button
        @click="toggleExpand"
        class="text-sm text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
      >
        {{ isExpanded ? '收起' : '展开' }}
        <Icon :icon="isExpanded ? 'lucide:chevron-up' : 'lucide:chevron-down'" class="w-4 h-4" />
      </button>
    </div>

    <div v-if="isExpanded && totalCount > 0" class="space-y-3">
      <div v-for="(errors, section) in errorSections" :key="section" class="space-y-2">
        <div v-if="errors.length > 0">
          <h4 class="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Icon icon="lucide:file-text" class="w-4 h-4 text-gray-400" />
            {{ sectionLabels[section] }}
            <span class="text-xs text-gray-500">({{ errors.length }})</span>
          </h4>
          <div class="space-y-2">
            <div
              v-for="(error, index) in errors"
              :key="index"
              class="p-3 bg-red-50 border border-red-200 rounded-lg"
            >
              <div class="flex items-start justify-between mb-2">
                <div class="flex items-center gap-2">
                  <span class="px-2 py-0.5 bg-red-200 text-red-800 rounded text-xs font-medium">
                    {{ error.location }}
                  </span>
                  <span class="text-xs text-gray-500">{{ formatDate(error.timestamp) }}</span>
                </div>
              </div>
              <div class="grid gap-3 text-sm" :class="error.correctValue ? 'grid-cols-2' : 'grid-cols-1'">
                <div>
                  <div class="text-xs text-gray-500 mb-1">错误答案</div>
                  <div class="px-2 py-1 bg-red-100 text-red-800 rounded font-mono text-xs">
                    {{ formatValue(error.wrongValue || '(空)', section) }}
                  </div>
                </div>
                <div v-if="error.correctValue">
                  <div class="text-xs text-gray-500 mb-1">正确答案</div>
                  <div class="px-2 py-1 bg-green-100 text-green-800 rounded font-mono text-xs">
                    {{ formatValue(error.correctValue, section) }}
                  </div>
                </div>
              </div>
              <div v-if="error.hint" class="mt-2 text-xs bg-amber-50 border border-amber-200 text-amber-800 p-2 rounded">
                <div class="font-semibold mb-1 flex items-center gap-1">
                  <Icon icon="lucide:lightbulb" class="w-3 h-3" />
                  提示信息：
                </div>
                {{ error.hint }}
              </div>
              <!-- 显示详细位置信息（用于LR0步骤4和步骤5） -->
              <div v-if="error.details && (error.details.tableType || error.details.stepIndex)" class="mt-2 text-xs bg-blue-50 border border-blue-200 text-blue-800 p-2 rounded">
                <div class="font-semibold mb-1 flex items-center gap-1">
                  <Icon icon="lucide:map-pin" class="w-3 h-3" />
                  详细位置：
                </div>
                <template v-if="error.details.tableType">
                  <div>表类型: {{ error.details.tableType }}</div>
                  <div>状态: {{ error.details.state }}, 符号: {{ error.details.symbol }}</div>
                </template>
                <template v-if="error.details.stepIndex">
                  <div>步骤: {{ error.details.stepIndex }}</div>
                  <div>字段: {{ error.details.fieldName }}</div>
                </template>
              </div>
              <!-- 显示步骤5的提示详情（ACTION/GOTO表信息） -->
              <div v-if="error.details?.hintDetails" class="mt-2 text-xs bg-purple-50 border border-purple-200 text-purple-800 p-2 rounded">
                <div class="font-semibold mb-1 flex items-center gap-1">
                  <Icon icon="lucide:lightbulb" class="w-3 h-3" />
                  提示信息：
                </div>
                <div>当前状态: {{ error.details.hintDetails.state }}</div>
                <div>输入符号: {{ error.details.hintDetails.symbol }}</div>
                <div>ACTION表单元格: {{ error.details.hintDetails.actionCell }}</div>
                <div>动作: {{ error.details.hintDetails.action }}</div>
                <div>动作类型: 
                  <span v-if="error.details.hintDetails.actionType === 'shift'" class="text-blue-600 font-medium">移进 (Shift)</span>
                  <span v-else-if="error.details.hintDetails.actionType === 'reduce'" class="text-green-600 font-medium">规约 (Reduce)</span>
                  <span v-else-if="error.details.hintDetails.actionType === 'accept'" class="text-purple-600 font-medium">接受 (Accept)</span>
                  <span v-else class="text-red-600 font-medium">错误 (Error)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="isExpanded && totalCount === 0" class="text-center py-8 text-gray-500">
      <Icon icon="lucide:check-circle" class="w-12 h-12 mx-auto mb-3 text-green-500" />
      <p class="text-sm">恭喜！没有错误记录</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ref } from 'vue'
import { formatDate } from '@/utils/date'

interface ErrorItem {
  location: string
  wrongValue: string
  correctValue: string
  timestamp: string
  hint?: string
  details?: any
}

interface ErrorSections {
  [key: string]: ErrorItem[]
}

interface Props {
  title: string
  errorSections: ErrorSections
  totalCount: number
  sectionLabels: Record<string, string>
  // 哪些部分需要使用集合格式显示（如 ['转换表', '化简 DFA 状态子集']）
  setFormatSections?: string[]
}

const props = defineProps<Props>()

const isExpanded = ref(true)

function toggleExpand() {
  isExpanded.value = !isExpanded.value
}

// 将值格式化为集合形式 {a,b,c}
function formatAsSet(val: string): string {
  if (!val || val === '-' || val === '(空)') return val
  const str = val.trim()
  if (str === '' || str === '-') return str
  // 如果已经是集合格式，直接返回
  if (str.startsWith('{') && str.endsWith('}')) return str
  const parts = str.split(/\s+/).filter(Boolean)
  if (parts.length === 0) return str
  return `{${parts.join(',')}}`
}

// 判断是否需要使用集合格式
function shouldUseSetFormat(section: string): boolean {
  if (!props.setFormatSections) return false
  return props.setFormatSections.includes(section)
}

// 格式化显示值
function formatValue(value: string, section: string): string {
  if (shouldUseSetFormat(section)) {
    return formatAsSet(value)
  }
  return value
}
</script>

<style scoped>
/* 打印时保留背景颜色 - 使用全局样式 */
@import '../styles/print-colors.css';
</style>
