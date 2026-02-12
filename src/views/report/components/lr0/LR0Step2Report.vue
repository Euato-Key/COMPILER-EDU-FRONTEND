<template>
  <div class="lr0-step2-report space-y-6">
    <!-- 增广文法分析 -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
      <div class="px-6 py-4 bg-indigo-50 border-b border-indigo-100 flex items-center justify-between">
        <h3 class="text-lg font-bold text-indigo-900 flex items-center gap-2">
          <Icon icon="lucide:file-plus" class="w-5 h-5 text-indigo-600" />
          增广文法分析
        </h3>
        <span class="text-xs font-medium px-2 py-1 bg-white text-indigo-600 rounded-lg border border-indigo-100">Step 2</span>
      </div>

      <div class="p-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- 左侧：用户作答 -->
          <div class="space-y-4">
            <div class="flex items-center gap-2 mb-3">
              <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Icon icon="lucide:user" class="w-4 h-4 text-blue-600" />
              </div>
              <h4 class="text-base font-semibold text-gray-900">学生作答</h4>
              <span
                v-if="isAllCorrect"
                class="ml-auto px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full border border-green-200"
              >
                全部正确
              </span>
              <span
                v-else-if="hasAnswer"
                class="ml-auto px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full border border-red-200"
              >
                有错误
              </span>
              <span
                v-else
                class="ml-auto px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full border border-gray-200"
              >
                未作答
              </span>
            </div>

            <div class="space-y-2">
              <div
                v-for="(formula, index) in userFormulas"
                :key="`user-${index}`"
                class="flex items-center gap-3 p-3 rounded-lg border font-mono text-sm"
                :class="getFormulaClass(formula, index)"
              >
                <span class="w-6 h-6 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                  {{ index + 1 }}
                </span>
                <span class="flex-1">{{ formula.text || '(未填写)' }}</span>
                <Icon
                  v-if="formula.text && isFormulaCorrect(formula.text)"
                  icon="lucide:check-circle"
                  class="w-5 h-5 text-green-500 flex-shrink-0"
                />
                <Icon
                  v-else-if="formula.text"
                  icon="lucide:x-circle"
                  class="w-5 h-5 text-red-500 flex-shrink-0"
                />
              </div>
              <div v-if="userFormulas.length === 0" class="text-center py-8 text-gray-400">
                <Icon icon="lucide:file-x" class="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p class="text-sm">未填写增广文法</p>
              </div>
            </div>

            <!-- 历史错误记录 -->
            <div v-if="historyErrors.length > 0" class="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div class="flex items-start gap-2">
                <Icon icon="lucide:history" class="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div class="text-sm text-amber-800 flex-1">
                  <p class="font-medium mb-2">历史错误记录：</p>
                  <div class="space-y-2">
                    <div
                      v-for="(err, idx) in historyErrors"
                      :key="`hist-${idx}`"
                      class="flex items-center gap-2 p-2 bg-white/60 rounded border border-amber-100"
                    >
                      <span class="text-amber-700 font-mono text-xs whitespace-nowrap">{{ err.timestamp }}</span>
                      <span class="line-through decoration-red-400 text-red-600 font-mono">{{ err.wrongValue }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 当前错误提示 -->
            <div v-if="errorFormulas.length > 0" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div class="flex items-start gap-2">
                <Icon icon="lucide:alert-circle" class="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <div class="text-sm text-red-700">
                  <p class="font-medium mb-1">当前错误：</p>
                  <ul class="space-y-1">
                    <li v-for="(err, idx) in errorFormulas" :key="`err-${idx}`">
                      第 {{ err.index + 1 }} 条：{{ err.formula }} 不正确
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧：标准答案 -->
          <div class="space-y-4">
            <div class="flex items-center gap-2 mb-3">
              <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Icon icon="lucide:check-square" class="w-4 h-4 text-green-600" />
              </div>
              <h4 class="text-base font-semibold text-gray-900">标准答案</h4>
            </div>

            <div class="space-y-2">
              <div
                v-for="(formula, index) in correctFormulas"
                :key="`correct-${index}`"
                class="flex items-center gap-3 p-3 rounded-lg border border-green-200 bg-green-50 font-mono text-sm"
              >
                <span class="w-6 h-6 bg-green-200 text-green-700 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                  {{ index + 1 }}
                </span>
                <span class="flex-1 text-green-800">{{ formula }}</span>
                <Icon icon="lucide:check" class="w-5 h-5 text-green-600 flex-shrink-0" />
              </div>
              <div v-if="correctFormulas.length === 0" class="text-center py-8 text-gray-400">
                <Icon icon="lucide:loader-2" class="w-12 h-12 mx-auto mb-2 opacity-50 animate-spin" />
                <p class="text-sm">加载中...</p>
              </div>
            </div>

            <!-- 构造规则提示 -->
            <div class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div class="flex items-start gap-2">
                <Icon icon="lucide:lightbulb" class="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <div class="text-sm text-blue-700">
                  <p class="font-medium mb-1">增广文法构造规则：</p>
                  <ul class="space-y-1 text-xs">
                    <li>• 为原文法添加新的开始符号 {{ startSymbol }}'</li>
                    <li>• 添加产生式：{{ startSymbol }}' -> {{ startSymbol }}</li>
                    <li>• 将含有多个候选式的产生式分解为多个单独的产生式</li>
                    <li>• 例如：A -> α | β 分解为 A -> α 和 A -> β</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 统计信息 -->
    <div class="grid grid-cols-3 gap-4">
      <div class="bg-white rounded-lg border border-gray-200 p-4">
        <div class="text-2xl font-bold text-gray-900">{{ userFormulas.length }}</div>
        <div class="text-sm text-gray-500">填写产生式数</div>
      </div>
      <div class="bg-white rounded-lg border border-gray-200 p-4">
        <div class="text-2xl font-bold text-green-600">{{ correctCount }}</div>
        <div class="text-sm text-gray-500">正确数量</div>
      </div>
      <div class="bg-white rounded-lg border border-gray-200 p-4">
        <div class="text-2xl font-bold" :class="accuracyClass">{{ accuracy }}%</div>
        <div class="text-sm text-gray-500">正确率</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import type { LR0ErrorLog } from '@/stores'

interface AugmentedFormula {
  id: string
  text: string
  status: 'normal' | 'correct' | 'error'
  readonly: boolean
}

interface Props {
  step2Data?: {
    userAugmentedFormulas: AugmentedFormula[]
    validationSuccess: boolean
  }
  originalData?: {
    formulas_list?: string[]
    S?: string
  }
  errorLogs?: LR0ErrorLog[]
}

const props = defineProps<Props>()

// 用户填写的产生式
const userFormulas = computed(() => {
  return props.step2Data?.userAugmentedFormulas || []
})

// 正确答案
const correctFormulas = computed(() => {
  return props.originalData?.formulas_list || []
})

// 开始符号
const startSymbol = computed(() => {
  return props.originalData?.S || 'S'
})

// 是否有作答
const hasAnswer = computed(() => {
  return userFormulas.value.some(f => f.text && f.text.trim())
})

// 判断某个产生式是否正确
const isFormulaCorrect = (text: string) => {
  if (!text || !correctFormulas.value.length) return false
  return correctFormulas.value.includes(text.trim())
}

// 获取产生式的样式类
const getFormulaClass = (formula: AugmentedFormula, index: number) => {
  if (!formula.text) {
    return 'border-gray-200 bg-gray-50 text-gray-400'
  }
  if (isFormulaCorrect(formula.text)) {
    return 'border-green-200 bg-green-50 text-green-800'
  }
  return 'border-red-200 bg-red-50 text-red-800'
}

// 错误产生式列表
const errorFormulas = computed(() => {
  const errors: Array<{ index: number; formula: string }> = []
  userFormulas.value.forEach((formula, index) => {
    if (formula.text && !isFormulaCorrect(formula.text)) {
      errors.push({ index, formula: formula.text })
    }
  })
  return errors
})

// 正确数量
const correctCount = computed(() => {
  return userFormulas.value.filter(f => f.text && isFormulaCorrect(f.text)).length
})

// 是否全部正确
const isAllCorrect = computed(() => {
  if (correctFormulas.value.length === 0) return false
  if (userFormulas.value.length !== correctFormulas.value.length) return false
  return userFormulas.value.every(f => f.text && isFormulaCorrect(f.text))
})

// 正确率
const accuracy = computed(() => {
  if (correctFormulas.value.length === 0) return 0
  const filledCount = userFormulas.value.filter(f => f.text && f.text.trim()).length
  if (filledCount === 0) return 0
  return Math.round((correctCount.value / correctFormulas.value.length) * 100)
})

// 正确率样式类
const accuracyClass = computed(() => {
  if (accuracy.value >= 80) return 'text-green-600'
  if (accuracy.value >= 60) return 'text-yellow-600'
  return 'text-red-600'
})

// 历史错误记录（从 errorLogs 中提取 step2 的 augmentedFormula 类型错误）
const historyErrors = computed(() => {
  if (!props.errorLogs) return []

  return props.errorLogs
    .filter(log => log.step === 'step2' && log.type === 'augmentedFormula')
    .map(log => ({
      timestamp: new Date(log.timestamp).toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).replace(/\//g, '-'),
      wrongValue: log.wrongValue,
      hint: log.hint
    }))
})
</script>

<style scoped>
/* Scoped styles if needed */
</style>
