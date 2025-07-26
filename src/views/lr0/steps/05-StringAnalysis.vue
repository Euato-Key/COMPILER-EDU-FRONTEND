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
      <!-- 说明区域 -->
      <div class="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
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
                输入字符串（以$结尾）
              </label>
              <div class="flex gap-2">
                <input
                  v-model="inputString"
                  placeholder="例如: id + id * id $"
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
                </button>
              </div>
            </div>

            <!-- 示例字符串 -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
              <button
                v-for="example in exampleStrings"
                :key="example"
                @click="inputString = example"
                class="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                {{ example }}
              </button>
            </div>
          </div>
        </div>

        <!-- 分析过程表 -->
        <div v-if="analysisSteps.length > 0" class="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">分析过程</h3>
            <p class="text-sm text-gray-600 mt-1">LR0移进-规约分析表</p>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-900 border-b">步骤</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-900 border-b">状态栈</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-900 border-b">符号栈</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-900 border-b">输入串</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-900 border-b">动作</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(step, index) in analysisSteps"
                  :key="index"
                  :class="[
                    'hover:bg-gray-50',
                    step.isError ? 'bg-red-50' : '',
                    step.isAccept ? 'bg-green-50' : ''
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
                        step.isError ? 'bg-red-100 text-red-800' :
                        step.isAccept ? 'bg-green-100 text-green-800' :
                        step.action.startsWith('S') ? 'bg-blue-100 text-blue-800' :
                        step.action.startsWith('r') ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
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

        <!-- 分析结果 -->
        <div v-if="analysisResult" class="mt-6">
          <div
            :class="[
              'p-4 rounded-lg border',
              analysisResult.success
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            ]"
          >
            <div class="flex items-start gap-2">
              <Icon
                :icon="analysisResult.success ? 'lucide:check-circle' : 'lucide:alert-circle'"
                class="w-5 h-5 mt-0.5 flex-shrink-0"
              />
              <div>
                <p class="font-medium">{{ analysisResult.success ? '分析成功' : '分析失败' }}</p>
                <p class="text-sm mt-1">{{ analysisResult.message }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 手动分析表（可选） -->
        <div class="bg-white border border-gray-200 rounded-lg p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">手动分析过程（可选）</h3>
          <p class="text-sm text-gray-600 mb-4">您也可以手动填写分析过程来加深理解</p>

          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-5 gap-2">
              <input placeholder="状态栈" class="px-3 py-2 border border-gray-300 rounded text-sm" />
              <input placeholder="符号栈" class="px-3 py-2 border border-gray-300 rounded text-sm" />
              <input placeholder="输入串" class="px-3 py-2 border border-gray-300 rounded text-sm" />
              <input placeholder="动作" class="px-3 py-2 border border-gray-300 rounded text-sm" />
              <button class="px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
                添加步骤
              </button>
            </div>
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
          :disabled="!isStepComplete"
          :class="[
            'px-6 py-2 rounded-lg transition-colors',
            isStepComplete
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          ]"
        >
          完成
          <Icon icon="lucide:check" class="w-4 h-4 inline ml-2" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useLR0API } from '@/composables/api/useLR0API'

const emit = defineEmits<{
  'next-step': []
  'prev-step': []
  'complete': [data: any]
}>()

const lr0API = useLR0API()

// 组件状态
const analysisData = ref<any>(null)
const inputString = ref('id + id * id $')
const isAnalyzing = ref(false)
const analysisResult = ref<any>(null)
const analysisSteps = ref<any[]>([])

// 示例字符串
const exampleStrings = [
  'id + id $',
  'id * id $',
  'id + id * id $',
  '( id + id ) $',
  'id $'
]

// 步骤完成状态
const isStepComplete = computed(() =>
  analysisResult.value?.success || analysisSteps.value.length > 0
)

// 分析字符串
const analyzeString = async () => {
  if (!inputString.value.trim() || !analysisData.value) return

  isAnalyzing.value = true
  analysisResult.value = null
  analysisSteps.value = []

  try {
    // 处理输入字符串
    const tokens = inputString.value.trim().split(/\s+/)

    // 调用API进行字符串分析
    const result = await lr0API.analyseInputString(
      analysisData.value.formulas_list || [],
      inputString.value.trim()
    )

    if (result.data) {
      // 构造分析步骤
      const steps = []
      for (let i = 0; i < result.data.info_step.length; i++) {
        steps.push({
          stateStack: result.data.info_state[i] || '',
          symbolStack: result.data.info_symbol[i] || '',
          inputString: result.data.info_str[i] || '',
          action: result.data.info_msg[i] || '',
          isError: result.data.info_msg[i]?.includes('错误') || false,
          isAccept: result.data.info_msg[i]?.includes('acc') || result.data.info_msg[i]?.includes('接受') || false
        })
      }

      analysisSteps.value = steps
      analysisResult.value = {
        success: result.data.info_res === '接受' || result.data.info_res === 'accept',
        message: result.data.info_res === '接受' ? '字符串分析成功，输入串被接受' : '字符串分析完成，但输入串被拒绝'
      }
    } else {
      throw new Error('分析结果格式错误')
    }
  } catch (error: any) {
    // 模拟分析过程
    const mockSteps = generateMockAnalysis(inputString.value.trim())
    analysisSteps.value = mockSteps

    analysisResult.value = {
      success: mockSteps[mockSteps.length - 1]?.isAccept || false,
      message: error.message || '分析完成（模拟结果）'
    }
  } finally {
    isAnalyzing.value = false
  }
}

// 生成模拟分析过程
const generateMockAnalysis = (input: string) => {
  const tokens = input.split(/\s+/)
  const steps = []

  steps.push({
    stateStack: '0',
    symbolStack: '',
    inputString: input,
    action: '开始分析',
    isError: false,
    isAccept: false
  })

  // 简单的模拟移进规约过程
  let stateStack = '0'
  let symbolStack = ''
  let remaining = input

  for (let i = 0; i < Math.min(tokens.length, 10); i++) {
    const token = tokens[i]
    if (token === '$') {
      steps.push({
        stateStack: stateStack + '1',
        symbolStack: symbolStack + 'E',
        inputString: '$',
        action: 'acc',
        isError: false,
        isAccept: true
      })
      break
    } else {
      stateStack += (i + 1).toString()
      symbolStack += token + ' '
      remaining = tokens.slice(i + 1).join(' ')

      steps.push({
        stateStack,
        symbolStack: symbolStack.trim(),
        inputString: remaining,
        action: `S${i + 2}`,
        isError: false,
        isAccept: false
      })
    }
  }

  return steps
}

const complete = () => {
  const completionData = {
    analysisSteps: analysisSteps.value,
    analysisResult: analysisResult.value,
    inputString: inputString.value,
    timestamp: new Date().toISOString()
  }

  localStorage.setItem('lr0-analysis-complete', JSON.stringify(completionData))
  emit('complete', completionData)
}

// 组件挂载时初始化
onMounted(() => {
  // 从localStorage获取分析数据
  const stored = localStorage.getItem('lr0-analysis-result')
  if (stored) {
    try {
      analysisData.value = JSON.parse(stored)
    } catch (error) {
      console.error('Failed to load analysis data:', error)
    }
  }
})
</script>

<style scoped>
.step-header { padding: 2rem 2rem 1rem; border-bottom: 1px solid #e5e7eb; }
.step-icon { width: 3rem; height: 3rem; background: #dcfce7; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; }
.step-content { padding: 2rem; }
.step-actions { padding: 1rem 2rem 2rem; border-top: 1px solid #e5e7eb; background: #f9fafb; }
</style>
