<template>
  <div class="string-analysis-step">
    <div class="step-header">
      <div class="flex items-center gap-4">
        <div class="step-icon">
          <Icon icon="lucide:play-circle" class="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-900">字符串分析</h2>
          <p class="text-gray-600 mt-1">第五步：使用LR0分析表分析输入字符串</p>
        </div>
      </div>
    </div>

    <div class="step-content">
      <!-- 说明区域和文法信息 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- LR0分析过程说明 -->
        <div class="bg-green-50 border border-green-200 rounded-lg p-6">
          <div class="flex items-start">
            <Icon icon="lucide:info" class="w-5 h-5 text-green-600 mt-0.5 mr-3" />
            <div>
              <h3 class="text-lg font-semibold text-green-900 mb-2">LR0分析过程</h3>
              <ul class="space-y-1 text-sm text-green-800">
                <li>• <strong>移进：</strong>将输入符号压入符号栈，状态压入状态栈</li>
                <li>• <strong>规约：</strong>根据产生式弹出栈中符号和状态，压入左部符号</li>
                <li>• <strong>接受：</strong>当遇到接受动作时，输入串被成功分析</li>
                <li>• <strong>错误：</strong>无对应动作时，分析失败</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 文法信息 -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div class="flex items-start">
            <Icon icon="lucide:file-text" class="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-blue-900 mb-2">当前文法</h3>
              <div v-if="grammarInfo" class="space-y-2">
                                <div class="bg-white/60 rounded-lg p-3 border border-blue-200">
                  <div class="text-sm text-blue-800 font-medium mb-2">产生式：</div>
                  <div class="space-y-1">
                    <div
                      v-for="production in grammarInfo.formulas_list"
                      :key="production"
                      class="text-xs font-mono text-blue-700"
                    >
                      {{ production }}
                    </div>
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-3 text-xs">
                  <div class="bg-white/60 rounded p-2 border border-blue-200">
                    <span class="text-blue-600 font-medium">开始符号：</span>
                    <span class="font-mono font-semibold text-blue-800">{{ grammarInfo.S }}</span>
                  </div>
                  <div class="bg-white/60 rounded p-2 border border-blue-200">
                    <span class="text-blue-600 font-medium">非终结符：</span>
                    <span class="font-mono text-blue-800">{{ grammarInfo.Vn.join(', ') }}</span>
                  </div>
                </div>
              </div>
              <div v-else class="text-sm text-blue-600 italic">
                暂无文法信息，请先完成前面的步骤
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 检查前置条件 -->
      <div v-if="!analysisData" class="text-center py-20">
        <Icon icon="lucide:arrow-left" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-gray-600 mb-2">请先完成前面的步骤</h3>
        <p class="text-gray-500">需要先完成文法分析和分析表构造才能进行字符串分析</p>
      </div>

      <div v-else class="space-y-8">
        <!-- 输入字符串 -->
        <div class="bg-white border border-gray-200 rounded-lg p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">输入待分析字符串</h3>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                输入字符串（单字符，系统自动添加结束符#）
              </label>
              <div class="flex gap-2">
                <input
                  v-model="inputString"
                  placeholder="例如: ab"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  @keydown.enter="analyzeString"
                />
                <button
                  @click="analyzeString"
                  :disabled="!inputString.trim() || isAnalyzing"
                  class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                >
                  <Icon
                    :icon="isAnalyzing ? 'lucide:loader-2' : 'lucide:play'"
                    :class="['w-4 h-4', isAnalyzing ? 'animate-spin' : '']"
                  />
                  {{ isAnalyzing ? '分析中...' : '开始分析' }}
                </button>
                <button
                  @click="resetAnalysis"
                  class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  重置
                </button>
              </div>
            </div>

            <!-- 输入提示 -->
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div class="flex items-start gap-2 text-sm text-blue-700">
                <Icon icon="lucide:info" class="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p class="font-medium mb-1">💡 输入建议</p>
                  <p class="text-xs">• 建议使用单字符（如：a、b、c、1、2、+、-、(、)等）</p>
                  <p class="text-xs">• 系统会自动添加结束符 #，无需手动输入</p>
                  <p class="text-xs">• 支持各种符号，如运算符、括号等</p>
                </div>
              </div>
            </div>

            <!-- 示例字符串 -->
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center gap-2 mb-3">
                <Icon icon="lucide:list" class="w-4 h-4 text-gray-500" />
                <span class="text-sm font-semibold text-gray-800">示例字符串</span>
                <span class="text-xs text-gray-500">(点击使用)</span>
              </div>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="example in exampleStrings"
                  :key="example"
                  @click="inputString = example"
                  class="px-3 py-1.5 text-sm bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 hover:border-gray-300 font-mono"
                >
                  {{ example }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 分析结果 -->
        <div v-if="analysisResult" class="bg-white border border-gray-200 rounded-lg p-6">
          <div
            :class="[
              'p-4 rounded-lg border',
              analysisResult.info_res === 'Success!'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800',
            ]"
          >
            <div class="flex items-start gap-2">
              <Icon
                :icon="
                  analysisResult.info_res === 'Success!'
                    ? 'lucide:check-circle'
                    : 'lucide:alert-circle'
                "
                class="w-5 h-5 mt-0.5 flex-shrink-0"
              />
              <div class="flex-1">
                <p class="font-medium">
                  {{ analysisResult.info_res === 'Success!' ? '字符串分析成功' : '字符串分析失败' }}
                </p>
                <p class="text-sm mt-1">{{ analysisResult.info_res }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 分析过程表 -->
        <div
          v-if="analysisSteps.length > 0"
          class="bg-white border border-gray-200 rounded-lg overflow-hidden"
        >
          <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">分析过程</h3>
            <p class="text-sm text-gray-600 mt-1">LR0移进-规约分析表</p>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-900 border-b">
                    步骤
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-900 border-b">
                    状态栈
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-900 border-b">
                    符号栈
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-900 border-b">
                    输入串
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-900 border-b">
                    动作
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(step, index) in analysisSteps"
                  :key="index"
                  :class="[
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50',
                    step.isAccept ? 'bg-green-50' : '',
                    step.isError ? 'bg-red-50' : '',
                  ]"
                >
                  <td class="px-4 py-3 text-sm border-b">{{ index + 1 }}</td>
                  <td class="px-4 py-3 text-sm font-mono border-b">{{ step.stateStack }}</td>
                  <td class="px-4 py-3 text-sm font-mono border-b">{{ step.symbolStack }}</td>
                  <td class="px-4 py-3 text-sm font-mono border-b">{{ step.inputString }}</td>
                  <td class="px-4 py-3 text-sm border-b">
                    <span
                      :class="[
                        'px-2 py-1 rounded text-xs font-medium',
                        step.isAccept
                          ? 'bg-green-100 text-green-800'
                          : step.isError
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800',
                      ]"
                    >
                      {{ step.action }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- 步骤操作栏 -->
    <div class="step-actions">
      <div class="flex justify-between items-center">
        <button
          @click="$emit('prev-step')"
          class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Icon icon="lucide:chevron-left" class="w-4 h-4 inline mr-2" />
          上一步
        </button>

        <div class="text-sm text-gray-500">步骤 5 / 5</div>

        <button
          @click="complete"
          :disabled="!isStepComplete"
          :class="[
            'px-6 py-2 rounded-lg transition-colors',
            isStepComplete
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed',
          ]"
        >
          完成分析
          <Icon icon="lucide:check" class="w-4 h-4 inline ml-2" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useLR0Store } from '@/stores/lr0'
import { useCommonStore } from '@/stores/common'
import type { AnalysisStepInfo } from '@/types'

const emit = defineEmits<{
  'next-step': []
  'prev-step': []
  complete: [data: {
    analysisSteps: {
      step: number
      stateStack: string
      symbolStack: string
      inputString: string
      action: string
      isError: boolean
      isAccept: boolean
    }[]
    analysisResult: AnalysisStepInfo | null
    inputString: string
    timestamp: string
  }]
}>()

const lr0Store = useLR0Store()
const commonStore = useCommonStore()

// 组件状态
const inputString = ref('')

// 示例字符串（单字符格式，不包含#）
const exampleStrings = ['ab', 'a+b', 'a*b', '(a)', 'a', 'b']

// 从store获取状态
const analysisData = computed(() => lr0Store.analysisResult)
const isAnalyzing = computed(() => commonStore.loading)
const analysisResult = computed(() => lr0Store.inputAnalysisResult)
const grammarInfo = computed(() => lr0Store.analysisResult)
const analysisSteps = computed(() => {
  if (lr0Store.inputAnalysisResult) {
    // 构造分析步骤数据
    const steps: {
      step: number
      stateStack: string
      symbolStack: string
      inputString: string
      action: string
      isError: boolean
      isAccept: boolean
    }[] = []
    const result = lr0Store.inputAnalysisResult

    for (let i = 0; i < result.info_step.length; i++) {
      steps.push({
        step: result.info_step[i],
        stateStack: result.info_state_stack?.[i] || '',
        symbolStack: result.info_symbol_stack?.[i] || '',
        inputString: result.info_str?.[i] || '',
        action: result.info_action?.[i] || result.info_msg?.[i] || '',
        isError: false,
        isAccept: result.info_msg?.[i]?.includes('成功') || false,
      })
    }

    return steps
  }
  return []
})

const isStepComplete = computed(() => lr0Store.inputAnalysisResult !== null)

// 分析字符串
const analyzeString = async () => {
  if (!inputString.value?.trim()) {
    commonStore.setError('请输入要分析的字符串')
    return
  }

  if (!lr0Store.analysisResult) {
    commonStore.setError('请先完成文法分析')
    return
  }

  try {
    // 更新store中的输入串
    lr0Store.setInputString(inputString.value.trim())

    // 执行分析
    const success = await lr0Store.analyzeInputString()

    if (success) {
      console.log('LR0字符串分析完成！')
      console.log('分析结果数据:', lr0Store.inputAnalysisResult)
    }
  } catch (error) {
    console.error('分析失败:', error)
    commonStore.setError('分析过程中发生错误')
  }
}

// 重置分析
const resetAnalysis = () => {
  lr0Store.setInputString('')
  commonStore.clearError()
}

// 完成分析
const complete = () => {
  const completionData = {
    analysisSteps: analysisSteps.value,
    analysisResult: analysisResult.value,
    inputString: inputString.value,
    timestamp: new Date().toISOString(),
  }

  emit('complete', completionData)
}
</script>

<style scoped>
.step-header {
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid #e5e7eb;
}
.step-icon {
  width: 3rem;
  height: 3rem;
  background: #dcfce7;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.step-content {
  padding: 2rem;
}
.step-actions {
  padding: 1rem 2rem 2rem;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}
</style>
