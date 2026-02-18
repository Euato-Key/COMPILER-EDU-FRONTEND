<template>
  <div class="ai-report-section">
    <!-- 头部 -->
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
        <Icon icon="lucide:sparkles" class="w-5 h-5 text-purple-600" />
        AI 智能学习报告
      </h3>
      <div class="flex items-center gap-2">
        <!-- 缓存标识 -->
        <span
          v-if="isCached"
          class="px-2 py-1 bg-green-100 text-green-700 rounded text-xs flex items-center gap-1"
        >
          <Icon icon="lucide:check-circle" class="w-3 h-3" />
          已缓存
        </span>
        <!-- 重新生成按钮 -->
        <button
          @click="handleRegenerate"
          :disabled="isGenerating"
          class="px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
        >
          <Icon
            :icon="isGenerating ? 'lucide:loader-2' : 'lucide:refresh-cw'"
            :class="{ 'animate-spin': isGenerating }"
            class="w-4 h-4"
          />
          {{ isGenerating ? '生成中...' : '重新生成' }}
        </button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="isGenerating" class="py-12">
      <div class="text-center">
        <div class="relative inline-block">
          <div class="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          <Icon icon="lucide:sparkles" class="w-6 h-6 text-purple-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p class="mt-4 text-gray-600">AI 正在分析您的答题数据...</p>
        <p class="mt-2 text-sm text-gray-400">这可能需要几秒钟时间</p>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="py-8">
      <div class="text-center p-6 bg-red-50 rounded-xl border border-red-200">
        <Icon icon="lucide:alert-circle" class="w-12 h-12 text-red-500 mx-auto mb-3" />
        <p class="text-red-700 font-medium">{{ error }}</p>
        <button
          @click="handleGenerate"
          class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          重试
        </button>
      </div>
    </div>

    <!-- 报告内容 -->
    <div v-else-if="reportContent" class="space-y-6">
      <!-- 总体评价 -->
      <div class="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
        <h4 class="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Icon icon="lucide:message-square" class="w-4 h-4 text-purple-600" />
          总体评价
        </h4>
        <p class="text-gray-700 leading-relaxed">{{ reportContent.overallEvaluation }}</p>
      </div>

      <!-- 优点和不足 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- 优点 -->
        <div v-if="reportContent.strengths?.length" class="bg-green-50 rounded-xl p-5 border border-green-200">
          <h4 class="text-base font-semibold text-green-800 mb-3 flex items-center gap-2">
            <Icon icon="lucide:thumbs-up" class="w-4 h-4" />
            优点
          </h4>
          <ul class="space-y-2">
            <li
              v-for="(strength, index) in reportContent.strengths"
              :key="index"
              class="flex items-start gap-2 text-green-700 text-sm"
            >
              <Icon icon="lucide:check" class="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{{ strength }}</span>
            </li>
          </ul>
        </div>

        <!-- 不足 -->
        <div v-if="reportContent.weaknesses?.length" class="bg-orange-50 rounded-xl p-5 border border-orange-200">
          <h4 class="text-base font-semibold text-orange-800 mb-3 flex items-center gap-2">
            <Icon icon="lucide:alert-triangle" class="w-4 h-4" />
            需要改进
          </h4>
          <ul class="space-y-2">
            <li
              v-for="(weakness, index) in reportContent.weaknesses"
              :key="index"
              class="flex items-start gap-2 text-orange-700 text-sm"
            >
              <Icon icon="lucide:minus" class="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{{ weakness }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- 知识点掌握情况 -->
      <div v-if="reportContent.knowledgeMastery?.length" class="bg-white rounded-xl p-5 border border-gray-200">
        <h4 class="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Icon icon="lucide:book-open" class="w-4 h-4 text-blue-600" />
          知识点掌握情况
        </h4>
        <div class="space-y-3">
          <div
            v-for="(item, index) in reportContent.knowledgeMastery"
            :key="index"
            class="flex items-start gap-3 p-3 rounded-lg"
            :class="getMasteryLevelClass(item.masteryLevel)"
          >
            <Icon
              :icon="getMasteryLevelIcon(item.masteryLevel)"
              class="w-5 h-5 flex-shrink-0 mt-0.5"
              :class="getMasteryLevelIconClass(item.masteryLevel)"
            />
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <span class="font-medium text-sm">{{ item.knowledgePoint }}</span>
                <span
                  class="px-2 py-0.5 rounded text-xs font-medium"
                  :class="getMasteryBadgeClass(item.masteryLevel)"
                >
                  {{ getMasteryLevelText(item.masteryLevel) }}
                </span>
              </div>
              <p class="text-sm mt-1 opacity-80">{{ item.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 学习建议 -->
      <div v-if="reportContent.suggestions?.length" class="bg-white rounded-xl p-5 border border-gray-200">
        <h4 class="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Icon icon="lucide:lightbulb" class="w-4 h-4 text-yellow-600" />
          学习建议
        </h4>
        <div class="space-y-3">
          <div
            v-for="suggestion in reportContent.suggestions"
            :key="suggestion.id"
            class="p-4 rounded-lg border-l-4"
            :class="getSuggestionPriorityClass(suggestion.priority)"
          >
            <div class="flex items-start justify-between gap-2">
              <h5 class="font-medium text-sm">{{ suggestion.title }}</h5>
              <span
                class="px-2 py-0.5 rounded text-xs font-medium flex-shrink-0"
                :class="getPriorityBadgeClass(suggestion.priority)"
              >
                {{ getPriorityText(suggestion.priority) }}
              </span>
            </div>
            <p class="text-sm mt-2 opacity-80">{{ suggestion.description }}</p>
            <p v-if="suggestion.relatedStep" class="text-xs mt-2 opacity-60">
              相关步骤: {{ suggestion.relatedStep }}
            </p>
          </div>
        </div>
      </div>

      <!-- 学习路径建议 -->
      <div v-if="reportContent.learningPath" class="bg-blue-50 rounded-xl p-5 border border-blue-200">
        <h4 class="text-base font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Icon icon="lucide:map" class="w-4 h-4" />
          学习路径建议
        </h4>
        <p class="text-blue-700 text-sm leading-relaxed">{{ reportContent.learningPath }}</p>
      </div>

      <!-- 生成时间 -->
      <div v-if="generatedAt" class="text-right text-xs text-gray-400">
        报告生成时间: {{ formatDate(generatedAt) }}
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="py-8 text-center">
      <Icon icon="lucide:file-text" class="w-12 h-12 text-gray-300 mx-auto mb-3" />
      <p class="text-gray-500">暂无AI报告</p>
      <button
        @click="handleGenerate"
        class="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
      >
        生成报告
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Icon } from '@iconify/vue'
import type { AIReportContent, AIReportContext, AIReportGenerateResult } from '../utils/ai-report'

// Props
interface Props {
  // 报告上下文（用于生成报告）
  context?: AIReportContext | null
  // 初始报告内容（如果有缓存）
  initialContent?: AIReportContent
  // 是否已缓存
  isCached?: boolean
  // 生成时间
  generatedAt?: string
  // 自定义生成函数
  generateFn?: (context: AIReportContext, forceRegenerate?: boolean) => Promise<AIReportGenerateResult>
}

const props = withDefaults(defineProps<Props>(), {
  isCached: false,
})

// Emits
const emit = defineEmits<{
  (e: 'generate', result: AIReportGenerateResult): void
  (e: 'regenerate', result: AIReportGenerateResult): void
}>()

// 状态
const isGenerating = ref(false)
const error = ref<string | null>(null)
const reportContent = ref<AIReportContent | null>(props.initialContent || null)
const localGeneratedAt = ref<string>(props.generatedAt || new Date().toISOString())

// 计算属性
const hasContent = computed(() => !!reportContent.value)

// 方法
async function handleGenerate() {
  if (!props.context || !props.generateFn) {
    error.value = '缺少生成报告所需的上下文或生成函数'
    return
  }

  isGenerating.value = true
  error.value = null

  try {
    const result = await props.generateFn(props.context)

    if (result.success && result.content) {
      reportContent.value = result.content
      localGeneratedAt.value = new Date().toISOString()
      emit('generate', result)
    } else {
      error.value = result.error || '生成报告失败'
      emit('generate', result)
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : '生成报告时发生错误'
    error.value = errorMsg
    emit('generate', { success: false, error: errorMsg })
  } finally {
    isGenerating.value = false
  }
}

async function handleRegenerate() {
  if (!props.context || !props.generateFn) {
    error.value = '缺少生成报告所需的上下文或生成函数'
    return
  }

  isGenerating.value = true
  error.value = null

  try {
    // 传递 forceRegenerate = true 强制重新生成
    const result = await props.generateFn(props.context, true)

    if (result.success && result.content) {
      reportContent.value = result.content
      localGeneratedAt.value = new Date().toISOString()
      emit('regenerate', result)
    } else {
      error.value = result.error || '重新生成报告失败'
      emit('regenerate', result)
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : '重新生成报告时发生错误'
    error.value = errorMsg
    emit('regenerate', { success: false, error: errorMsg })
  } finally {
    isGenerating.value = false
  }
}

// 掌握程度样式
function getMasteryLevelClass(level: string): string {
  const classes: Record<string, string> = {
    excellent: 'bg-green-50 border border-green-200',
    good: 'bg-blue-50 border border-blue-200',
    average: 'bg-yellow-50 border border-yellow-200',
    poor: 'bg-red-50 border border-red-200',
  }
  return classes[level] || classes.average
}

function getMasteryLevelIcon(level: string): string {
  const icons: Record<string, string> = {
    excellent: 'lucide:award',
    good: 'lucide:thumbs-up',
    average: 'lucide:help-circle',
    poor: 'lucide:alert-circle',
  }
  return icons[level] || icons.average
}

function getMasteryLevelIconClass(level: string): string {
  const classes: Record<string, string> = {
    excellent: 'text-green-600',
    good: 'text-blue-600',
    average: 'text-yellow-600',
    poor: 'text-red-600',
  }
  return classes[level] || classes.average
}

function getMasteryBadgeClass(level: string): string {
  const classes: Record<string, string> = {
    excellent: 'bg-green-100 text-green-700',
    good: 'bg-blue-100 text-blue-700',
    average: 'bg-yellow-100 text-yellow-700',
    poor: 'bg-red-100 text-red-700',
  }
  return classes[level] || classes.average
}

function getMasteryLevelText(level: string): string {
  const texts: Record<string, string> = {
    excellent: '优秀',
    good: '良好',
    average: '一般',
    poor: '需加强',
  }
  return texts[level] || '一般'
}

// 建议优先级样式
function getSuggestionPriorityClass(priority: string): string {
  const classes: Record<string, string> = {
    high: 'bg-red-50 border-red-400',
    medium: 'bg-yellow-50 border-yellow-400',
    low: 'bg-blue-50 border-blue-400',
  }
  return classes[priority] || classes.medium
}

function getPriorityBadgeClass(priority: string): string {
  const classes: Record<string, string> = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-blue-100 text-blue-700',
  }
  return classes[priority] || classes.medium
}

function getPriorityText(priority: string): string {
  const texts: Record<string, string> = {
    high: '高优先级',
    medium: '中优先级',
    low: '低优先级',
  }
  return texts[priority] || '中优先级'
}

// 日期格式化
function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return dateStr
  }
}

// 初始化
onMounted(() => {
  // 如果有上下文但没有内容，自动开始生成
  if (props.context && !props.initialContent && !props.isCached) {
    handleGenerate()
  }
})
</script>

<style scoped>
/* 打印时保留背景颜色 - 使用全局样式 */
@import '../styles/print-colors.css';
</style>
