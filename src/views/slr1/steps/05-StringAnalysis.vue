<template>
  <div class="string-analysis-step">
    <div class="step-header">
      <div class="flex items-center gap-4">
        <div class="step-icon">
          <Icon icon="lucide:play-circle" class="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-900">字符串分析</h2>
          <p class="text-gray-600 mt-1">第五步：使用SLR1分析表分析输入字符串</p>
        </div>
      </div>
    </div>

    <div class="step-content">
      <!-- 说明区域 -->
      <div class="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
        <div class="flex items-start">
          <Icon icon="lucide:info" class="w-5 h-5 text-green-600 mt-0.5 mr-3" />
          <div>
            <h3 class="text-lg font-semibold text-green-900 mb-2">SLR1字符串分析</h3>
            <ul class="space-y-1 text-sm text-green-800">
              <li>• 使用构建好的SLR1分析表对输入字符串进行语法分析</li>
              <li>• 分析过程包括：状态栈、符号栈、输入串的变化</li>
              <li>• 根据ACTION表进行移进、规约或接受操作</li>
              <li>• 根据GOTO表进行状态转移</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 字符串输入区域 -->
      <div class="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">输入字符串</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              待分析的字符串（终结符序列）
            </label>
            <textarea
              v-model="inputString"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="请输入要分析的字符串，如：id+id*id"
            ></textarea>
          </div>

          <div class="flex gap-4">
            <button
              @click="analyzeString"
              :disabled="!inputString.trim() || isAnalyzing"
              class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
            >
              <Icon
                :icon="isAnalyzing ? 'lucide:loader-2' : 'lucide:play'"
                :class="['w-4 h-4 inline mr-2', isAnalyzing ? 'animate-spin' : '']"
              />
              {{ isAnalyzing ? '分析中...' : '开始分析' }}
            </button>

            <button
              @click="loadExample"
              class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Icon icon="lucide:file-text" class="w-4 h-4 inline mr-2" />
              加载示例
            </button>
          </div>
        </div>
      </div>

      <!-- 分析结果区域 -->
      <div v-if="analysisResult" class="space-y-6">
        <!-- 分析结果状态 -->
        <div class="bg-white border border-gray-200 rounded-lg p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">分析结果</h3>
            <div
              :class="[
                'px-3 py-1 rounded-full text-sm font-medium',
                analysisResult.success
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              ]"
            >
              {{ analysisResult.success ? '接受' : '拒绝' }}
            </div>
          </div>

          <div class="text-sm text-gray-600">
            <p><strong>输入串：</strong>{{ inputString }}</p>
            <p><strong>分析步数：</strong>{{ analysisSteps.length }}</p>
            <p v-if="analysisResult.message"><strong>结果：</strong>{{ analysisResult.message }}</p>
          </div>
        </div>

        <!-- 分析步骤表 -->
        <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">分析步骤</h3>
            <p class="text-sm text-gray-600 mt-1">展示SLR1分析的详细过程</p>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">步骤</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态栈</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">符号栈</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">输入串</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">动作</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="(step, index) in analysisSteps"
                  :key="index"
                  class="hover:bg-gray-50"
                >
                  <td class="px-4 py-2 text-sm text-gray-900">{{ index + 1 }}</td>
                  <td class="px-4 py-2 text-sm font-mono text-gray-900">{{ step.stateStack }}</td>
                  <td class="px-4 py-2 text-sm font-mono text-gray-900">{{ step.symbolStack }}</td>
                  <td class="px-4 py-2 text-sm font-mono text-gray-900">{{ step.inputString }}</td>
                  <td class="px-4 py-2 text-sm text-gray-900">{{ step.action }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 分析过程可视化 -->
        <div class="bg-white border border-gray-200 rounded-lg p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">分析过程可视化</h3>
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- 状态栈 -->
            <div>
              <h4 class="font-medium text-gray-700 mb-2">状态栈</h4>
              <div class="bg-gray-50 p-4 rounded-lg min-h-[200px]">
                <div v-if="currentStep" class="space-y-2">
                  <div
                    v-for="(state, index) in currentStep.stateStack.split(' ').reverse()"
                    :key="index"
                    class="bg-blue-100 border border-blue-300 rounded px-3 py-2 text-center font-mono"
                  >
                    {{ state }}
                  </div>
                </div>
              </div>
            </div>

            <!-- 符号栈 -->
            <div>
              <h4 class="font-medium text-gray-700 mb-2">符号栈</h4>
              <div class="bg-gray-50 p-4 rounded-lg min-h-[200px]">
                <div v-if="currentStep" class="space-y-2">
                  <div
                    v-for="(symbol, index) in currentStep.symbolStack.split(' ').reverse()"
                    :key="index"
                    class="bg-green-100 border border-green-300 rounded px-3 py-2 text-center font-mono"
                  >
                    {{ symbol }}
                  </div>
                </div>
              </div>
            </div>

            <!-- 输入串 -->
            <div>
              <h4 class="font-medium text-gray-700 mb-2">剩余输入</h4>
              <div class="bg-gray-50 p-4 rounded-lg min-h-[200px]">
                <div v-if="currentStep" class="bg-yellow-100 border border-yellow-300 rounded px-3 py-2 font-mono">
                  {{ currentStep.inputString }}
                </div>
              </div>
            </div>
          </div>

          <!-- 步骤控制 -->
          <div class="mt-6 flex items-center justify-center gap-4">
            <button
              @click="currentStepIndex = 0"
              :disabled="currentStepIndex === 0"
              class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
            >
              <Icon icon="lucide:skip-back" class="w-4 h-4" />
            </button>
            <button
              @click="currentStepIndex--"
              :disabled="currentStepIndex === 0"
              class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
            >
              <Icon icon="lucide:chevron-left" class="w-4 h-4" />
            </button>
            <span class="text-sm text-gray-600">
              步骤 {{ currentStepIndex + 1 }} / {{ analysisSteps.length }}
            </span>
            <button
              @click="currentStepIndex++"
              :disabled="currentStepIndex === analysisSteps.length - 1"
              class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
            >
              <Icon icon="lucide:chevron-right" class="w-4 h-4" />
            </button>
            <button
              @click="currentStepIndex = analysisSteps.length - 1"
              :disabled="currentStepIndex === analysisSteps.length - 1"
              class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
            >
              <Icon icon="lucide:skip-forward" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- 错误信息 -->
      <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex items-start gap-2">
          <Icon icon="lucide:alert-circle" class="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <p class="font-medium text-red-900">分析失败</p>
            <p class="text-sm text-red-700 mt-1">{{ errorMessage }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="step-actions">
      <div class="flex justify-between items-center">
        <button @click="$emit('prev-step')" class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          <Icon icon="lucide:chevron-left" class="w-4 h-4 inline mr-2" />
          上一步
        </button>
        <div class="text-sm text-gray-500">步骤 5 / 5</div>
        <button
          @click="complete"
          :disabled="!analysisResult"
          :class="[
            'px-6 py-2 rounded-lg transition-colors',
            analysisResult
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
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
import { ref, computed, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useSLR1API } from '@/composables/api/useSLR1API'

interface AnalysisStep {
  stateStack: string
  symbolStack: string
  inputString: string
  action: string
}

const emit = defineEmits<{
  'next-step': []
  'prev-step': []
  'complete': [data: any]
}>()

const { analyseInputString } = useSLR1API()

// 响应式数据
const inputString = ref('')
const isAnalyzing = ref(false)
const analysisResult = ref<any>(null)
const analysisSteps = ref<AnalysisStep[]>([])
const currentStepIndex = ref(0)
const errorMessage = ref('')
const grammarData = ref<any>(null)

// 计算属性
const currentStep = computed(() => {
  if (analysisSteps.value.length === 0) return null
  return analysisSteps.value[currentStepIndex.value]
})

// 分析字符串
const analyzeString = async () => {
  if (!inputString.value.trim() || !grammarData.value) return

  isAnalyzing.value = true
  errorMessage.value = ''
  analysisResult.value = null
  analysisSteps.value = []
  currentStepIndex.value = 0

  try {
    // 获取产生式列表
    const productions = grammarData.value.formulas_list?.map((item: any) => item.text || item) || []

    const response = await analyseInputString(productions, inputString.value.trim())

    if (response.data) {
      analysisResult.value = {
        success: response.data.info_res === '字符串匹配成功',
        message: response.data.info_res
      }

      // 构造分析步骤
      const steps: AnalysisStep[] = []
      for (let i = 0; i < response.data.info_step.length; i++) {
        steps.push({
          stateStack: response.data.info_state[i] || '',
          symbolStack: response.data.info_symbol[i] || '',
          inputString: response.data.info_str[i] || '',
          action: response.data.info_msg[i] || ''
        })
      }

      analysisSteps.value = steps
      currentStepIndex.value = 0

      // 保存分析结果
      localStorage.setItem('slr1_analysis_data', JSON.stringify({
        inputString: inputString.value,
        result: analysisResult.value,
        steps: analysisSteps.value,
        timestamp: Date.now()
      }))
    } else {
      errorMessage.value = '分析失败：未获取到分析结果'
    }
  } catch (error: any) {
    console.error('分析失败:', error)
    errorMessage.value = error.message || '分析失败，请检查网络连接'
  } finally {
    isAnalyzing.value = false
  }
}

// 加载示例
const loadExample = () => {
  if (grammarData.value?.Vt) {
    // 基于终结符构造一个简单的示例
    const terminals = grammarData.value.Vt.map((item: any) => item.text || item)
    if (terminals.includes('id') && terminals.includes('+') && terminals.includes('*')) {
      inputString.value = 'id+id*id'
    } else if (terminals.length > 0) {
      inputString.value = terminals.slice(0, 3).join('')
    } else {
      inputString.value = 'abc'
    }
  } else {
    inputString.value = 'id+id*id'
  }
}

// 完成分析
const complete = () => {
  const stepData = {
    completed: true,
    inputString: inputString.value,
    analysisResult: analysisResult.value,
    analysisSteps: analysisSteps.value,
    timestamp: new Date().toISOString()
  }

  localStorage.setItem('slr1-step5-data', JSON.stringify(stepData))
  emit('complete', stepData)
}

// 加载数据
const loadData = () => {
  // 从localStorage加载前面步骤的数据
  const grammarStorageData = localStorage.getItem('slr1_grammar_data')

  if (grammarStorageData) {
    grammarData.value = JSON.parse(grammarStorageData)
  }

  // 加载之前保存的分析数据
  const savedAnalysisData = localStorage.getItem('slr1_analysis_data')
  if (savedAnalysisData) {
    const analysisData = JSON.parse(savedAnalysisData)
    inputString.value = analysisData.inputString || ''
    analysisResult.value = analysisData.result
    analysisSteps.value = analysisData.steps || []
    currentStepIndex.value = 0
  }
}

// 组件挂载时加载数据
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.step-header { padding: 2rem 2rem 1rem; border-bottom: 1px solid #e5e7eb; }
.step-icon { width: 3rem; height: 3rem; background: #dcfce7; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; }
.step-content { padding: 2rem; }
.step-actions { padding: 1rem 2rem 2rem; border-top: 1px solid #e5e7eb; background: #f9fafb; }
</style>
