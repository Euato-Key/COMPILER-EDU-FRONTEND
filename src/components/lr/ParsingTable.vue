<template>
  <div class="parsing-table-component">
    <!-- A区域：用户填写的分析表 -->
    <div class="user-input-section">
      <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">{{ tableType }}分析表</h3>
              <p class="text-sm text-gray-600 mt-1">请在下方表格中填写正确的ACTION和GOTO值</p>
            </div>
            <button
              @click="validateTable"
              :disabled="isValidating"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors text-sm"
            >
              <Icon
                :icon="isValidating ? 'lucide:loader-2' : 'lucide:check-circle'"
                :class="['w-4 h-4 inline mr-2', isValidating ? 'animate-spin' : '']"
              />
              {{ isValidating ? '验证中...' : '格检验' }}
            </button>
          </div>
        </div>

        <div class="p-6">
          <!-- 表格头部信息 -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
            <div class="bg-blue-50 p-3 rounded">
              <span class="font-medium text-blue-900">状态数量：</span>
              <span class="text-blue-700">{{ stateCount }}</span>
            </div>
            <div class="bg-green-50 p-3 rounded">
              <span class="font-medium text-green-900">终结符：</span>
              <span class="text-green-700">{{ terminals.join(', ') }}</span>
            </div>
            <div class="bg-purple-50 p-3 rounded">
              <span class="font-medium text-purple-900">非终结符：</span>
              <span class="text-purple-700">{{ nonterminals.join(', ') }}</span>
            </div>
          </div>

          <!-- 分析表 -->
          <div class="overflow-x-auto">
            <table class="min-w-full border border-gray-300">
              <!-- 表头 -->
              <thead class="bg-gray-50">
                <!-- 分组表头行 -->
                <tr>
                  <th
                    rowspan="2"
                    class="px-3 py-2 border border-gray-300 text-xs font-medium text-gray-900 bg-gray-100"
                  >
                    State
                  </th>
                  <th
                    :colspan="terminals.length + 1"
                    class="px-3 py-2 border border-gray-300 text-xs font-bold text-blue-900 bg-blue-100 text-center"
                  >
                    ACTION
                  </th>
                  <th
                    :colspan="nonterminals.length"
                    class="px-3 py-2 border border-gray-300 text-xs font-bold text-green-900 bg-green-100 text-center"
                  >
                    GOTO
                  </th>
                </tr>
                <!-- 具体列名行 -->
                <tr>
                  <!-- ACTION列 -->
                  <th
                    v-for="terminal in terminals"
                    :key="terminal"
                    class="px-3 py-2 border border-gray-300 text-xs font-medium text-gray-900 bg-blue-50"
                  >
                    {{ terminal }}
                  </th>
                  <th
                    class="px-3 py-2 border border-gray-300 text-xs font-medium text-gray-900 bg-blue-50"
                  >
                    #
                  </th>
                  <!-- GOTO列 -->
                  <th
                    v-for="nonterminal in nonterminals"
                    :key="nonterminal"
                    class="px-3 py-2 border border-gray-300 text-xs font-medium text-gray-900 bg-green-50"
                  >
                    {{ nonterminal }}
                  </th>
                </tr>
              </thead>

              <!-- 表体 -->
              <tbody>
                <tr v-for="stateIndex in stateCount" :key="stateIndex - 1" class="hover:bg-gray-50">
                  <td
                    class="px-3 py-2 border border-gray-300 text-xs font-bold bg-gray-50 text-center"
                  >
                    {{ stateIndex - 1 }}
                  </td>

                  <!-- ACTION单元格 -->
                  <td
                    v-for="terminal in [...terminals, '#']"
                    :key="`action-${stateIndex - 1}-${terminal}`"
                    class="px-2 py-1 border border-gray-300 text-xs"
                  >
                    <input
                      v-model="userInputs.actions[`${stateIndex - 1},${terminal}`]"
                      @blur="validateCell(`${stateIndex - 1},${terminal}`, 'action')"
                      @input="clearValidation(`${stateIndex - 1},${terminal}`, 'action')"
                      :class="getCellStyle(`${stateIndex - 1},${terminal}`, 'action')"
                      class="w-full px-1 py-0.5 text-xs text-center border-0 focus:ring-1 focus:ring-cyan-500 rounded transition-colors"
                      placeholder="-"
                    />
                  </td>

                  <!-- GOTO单元格 -->
                  <td
                    v-for="nonterminal in nonterminals"
                    :key="`goto-${stateIndex - 1}-${nonterminal}`"
                    class="px-2 py-1 border border-gray-300 text-xs"
                  >
                    <input
                      v-model="userInputs.gotos[`${stateIndex - 1},${nonterminal}`]"
                      @blur="validateCell(`${stateIndex - 1},${nonterminal}`, 'goto')"
                      @input="clearValidation(`${stateIndex - 1},${nonterminal}`, 'goto')"
                      :class="getCellStyle(`${stateIndex - 1},${nonterminal}`, 'goto')"
                      class="w-full px-1 py-0.5 text-xs text-center border-0 focus:ring-1 focus:ring-cyan-500 rounded transition-colors"
                      placeholder="-"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 填表说明 -->
          <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div class="bg-blue-50 p-3 rounded">
              <h4 class="font-medium text-blue-900 mb-1">ACTION动作</h4>
              <ul class="text-xs text-blue-700 space-y-1">
                <li>• Si: 移进到状态i</li>
                <li>• rj: 用产生式j规约</li>
                <li>• acc: 接受</li>
              </ul>
            </div>
            <div class="bg-green-50 p-3 rounded">
              <h4 class="font-medium text-green-900 mb-1">GOTO函数</h4>
              <ul class="text-xs text-green-700 space-y-1">
                <li>• 数字: 转移到对应状态</li>
                <li>• 空白: 无转移</li>
              </ul>
            </div>
            <div class="bg-purple-50 p-3 rounded">
              <h4 class="font-medium text-purple-900 mb-1">验证状态</h4>
              <div class="text-xs text-purple-700">
                <div class="flex items-center gap-2 mb-1">
                  <div class="w-3 h-3 bg-yellow-200 border border-yellow-400 rounded"></div>
                  <span>未填写</span>
                </div>
                <div class="flex items-center gap-2 mb-1">
                  <div class="w-3 h-3 bg-red-200 border border-red-400 rounded"></div>
                  <span>错误</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 bg-green-200 border border-green-400 rounded"></div>
                  <span>正确</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- B区域：答案展示区域 -->
    <div class="answer-section mt-6">
      <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">标准答案</h3>
            <button
              @click="toggleAnswerDisplay"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              <Icon
                :icon="showAnswers ? 'lucide:eye-off' : 'lucide:eye'"
                class="w-4 h-4 inline mr-2"
              />
              {{ showAnswers ? '隐藏答案' : '显示答案' }}
            </button>
          </div>
        </div>

        <div v-if="!showAnswers && !hasValidationResults" class="p-8 text-center text-gray-500">
          <Icon icon="lucide:help-circle" class="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p class="text-lg font-medium">等待验证</p>
          <p class="text-sm mt-1">点击"格检验"按钮或"显示答案"按钮查看结果</p>
        </div>

        <div v-else-if="showAnswers || hasValidationResults" class="p-6">
          <!-- 标准答案表格 -->
          <div v-if="showAnswers">
            <div class="overflow-x-auto">
              <table class="min-w-full border border-gray-300 text-xs">
                <thead class="bg-gray-50">
                  <!-- 分组表头行 -->
                  <tr>
                    <th
                      rowspan="2"
                      class="px-3 py-2 border border-gray-300 font-medium text-gray-900 bg-gray-100"
                    >
                      State
                    </th>
                    <th
                      :colspan="terminals.length + 1"
                      class="px-3 py-2 border border-gray-300 font-bold text-blue-900 bg-blue-100 text-center"
                    >
                      ACTION
                    </th>
                    <th
                      :colspan="nonterminals.length"
                      class="px-3 py-2 border border-gray-300 font-bold text-green-900 bg-green-100 text-center"
                    >
                      GOTO
                    </th>
                  </tr>
                  <!-- 具体列名行 -->
                  <tr>
                    <!-- ACTION列 -->
                    <th
                      v-for="terminal in terminals"
                      :key="terminal"
                      class="px-3 py-2 border border-gray-300 font-medium text-gray-900 bg-blue-50"
                    >
                      {{ terminal }}
                    </th>
                    <th
                      class="px-3 py-2 border border-gray-300 font-medium text-gray-900 bg-blue-50"
                    >
                      #
                    </th>
                    <!-- GOTO列 -->
                    <th
                      v-for="nonterminal in nonterminals"
                      :key="nonterminal"
                      class="px-3 py-2 border border-gray-300 font-medium text-gray-900 bg-green-50"
                    >
                      {{ nonterminal }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="stateIndex in stateCount" :key="stateIndex - 1">
                    <td class="px-3 py-2 border border-gray-300 font-bold bg-gray-50 text-center">
                      {{ stateIndex - 1 }}
                    </td>
                    <!-- ACTION答案 -->
                    <td
                      v-for="terminal in [...terminals, '#']"
                      :key="`ans-action-${stateIndex - 1}-${terminal}`"
                      class="px-3 py-2 border border-gray-300 text-center"
                    >
                      {{ getCorrectAnswer(`${stateIndex - 1},${terminal}`, 'action') || '-' }}
                    </td>
                    <!-- GOTO答案 -->
                    <td
                      v-for="nonterminal in nonterminals"
                      :key="`ans-goto-${stateIndex - 1}-${nonterminal}`"
                      class="px-3 py-2 border border-gray-300 text-center"
                    >
                      {{ getCorrectAnswer(`${stateIndex - 1},${nonterminal}`, 'goto') || '-' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { Icon } from '@iconify/vue'

// Props 定义
interface Props {
  tableType: 'LR0' | 'SLR1'
  analysisData: any
  terminals: string[]
  nonterminals: string[]
  correctAnswers: {
    actions: Record<string, string>
    gotos: Record<string, string>
  }
}

// Events 定义
interface ValidationResult {
  isValid: boolean
  errors: any[]
}

const props = withDefaults(defineProps<Props>(), {
  tableType: 'LR0',
  terminals: () => [],
  nonterminals: () => [],
  correctAnswers: () => ({ actions: {}, gotos: {} }),
})

const emit = defineEmits<{
  'validation-complete': [result: ValidationResult]
  'step-complete': [isComplete: boolean]
}>()

// 响应式数据
const userInputs = reactive({
  actions: {} as Record<string, string>,
  gotos: {} as Record<string, string>,
})

const validationResults = reactive({
  actions: {} as Record<
    string,
    { type: 'empty' | 'incorrect' | 'correct'; correctAnswer?: string }
  >,
  gotos: {} as Record<string, { type: 'empty' | 'incorrect' | 'correct'; correctAnswer?: string }>,
})

const isValidating = ref(false)
const showAnswers = ref(false)
const hasValidationResults = ref(false)

// 计算属性
const stateCount = computed(() => {
  if (!props.analysisData?.all_dfa) return 0
  return props.analysisData.all_dfa.length
})

const validationStats = computed(() => {
  const allResults = [
    ...Object.values(validationResults.actions),
    ...Object.values(validationResults.gotos),
  ]
  const correct = allResults.filter((r) => r.type === 'correct').length
  const total = allResults.length

  return { correct, total }
})

const isTableComplete = computed(() => {
  // 如果显示答案，直接返回true
  if (showAnswers.value) {
    return true
  }

  const allResults = [
    ...Object.values(validationResults.actions),
    ...Object.values(validationResults.gotos),
  ]

  if (allResults.length === 0) return false

  // 计算总单元格数量（ACTION + GOTO）
  const totalCells = stateCount.value * (props.terminals.length + 1 + props.nonterminals.length)

  // 检查是否所有单元格都已验证且正确
  const correctResults = allResults.filter((r) => r.type === 'correct').length
  const hasErrors = allResults.some((result) => result.type === 'incorrect')

  return allResults.length === totalCells && correctResults === totalCells && !hasErrors
})

// 方法
const validateCell = (key: string, type: 'action' | 'goto') => {
  const userInput = (type === 'action' ? userInputs.actions[key] : userInputs.gotos[key]) || ''
  const correctAnswer = getCorrectAnswer(key, type)

  let result: { type: 'empty' | 'incorrect' | 'correct'; correctAnswer?: string }

  // 空白位置的验证逻辑
  if (!correctAnswer) {
    // 这是应该为空的位置
    if (!userInput.trim()) {
      // 用户没有填写，验证成功
      result = { type: 'correct' }
    } else {
      // 用户填写了内容，验证失败
      result = { type: 'incorrect', correctAnswer: '' }
    }
  } else {
    // 这是应该有内容的位置
    if (!userInput.trim()) {
      result = { type: 'empty', correctAnswer }
    } else if (userInput.trim() !== correctAnswer) {
      result = { type: 'incorrect', correctAnswer }
    } else {
      result = { type: 'correct' }
    }
  }

  if (type === 'action') {
    validationResults.actions[key] = result
  } else {
    validationResults.gotos[key] = result
  }

  hasValidationResults.value = true
}

const clearValidation = (key: string, type: 'action' | 'goto') => {
  if (type === 'action') {
    delete validationResults.actions[key]
  } else {
    delete validationResults.gotos[key]
  }
}

const validateTable = async () => {
  isValidating.value = true

  try {
    // 验证所有 ACTION 单元格
    for (let stateIndex = 0; stateIndex < stateCount.value; stateIndex++) {
      for (const terminal of [...props.terminals, '#']) {
        const key = `${stateIndex},${terminal}`
        validateCell(key, 'action')
      }
    }

    // 验证所有 GOTO 单元格
    for (let stateIndex = 0; stateIndex < stateCount.value; stateIndex++) {
      for (const nonterminal of props.nonterminals) {
        const key = `${stateIndex},${nonterminal}`
        validateCell(key, 'goto')
      }
    }

    hasValidationResults.value = true

    // 发出验证完成事件
    const allResults = [
      ...Object.values(validationResults.actions),
      ...Object.values(validationResults.gotos),
    ]
    const hasErrors = allResults.some(
      (result) => result.type === 'incorrect' || result.type === 'empty',
    )
    const isValid = !hasErrors

    emit('validation-complete', { isValid, errors: [] })
    emit('step-complete', isTableComplete.value)
  } finally {
    isValidating.value = false
  }
}

const getCorrectAnswer = (key: string, type: 'action' | 'goto'): string => {
  // 转换键值格式：从 "state,symbol" 到 "state|symbol"
  const convertedKey = key.replace(',', '|')
  const actionsData = props.correctAnswers.actions
  const gotosData = props.correctAnswers.gotos

  if (type === 'action') {
    const answer = actionsData[convertedKey]
    return answer !== undefined && answer !== null ? String(answer) : ''
  } else {
    const answer = gotosData[convertedKey]
    return answer !== undefined && answer !== null ? String(answer) : ''
  }
}

const getCellStyle = (key: string, type: 'action' | 'goto'): string => {
  const result = type === 'action' ? validationResults.actions[key] : validationResults.gotos[key]

  if (!result) return 'bg-white'

  switch (result.type) {
    case 'empty':
      return 'bg-yellow-50 border border-yellow-400'
    case 'incorrect':
      return 'bg-red-50 border border-red-400'
    case 'correct':
      return 'bg-green-50 border border-green-400'
    default:
      return 'bg-white'
  }
}

const toggleAnswerDisplay = () => {
  showAnswers.value = !showAnswers.value

  // 当显示答案时，自动触发步骤完成状态
  if (showAnswers.value) {
    // 模拟验证所有单元格为正确状态
    for (let stateIndex = 0; stateIndex < stateCount.value; stateIndex++) {
      for (const terminal of [...props.terminals, '#']) {
        const key = `${stateIndex},${terminal}`
        validationResults.actions[key] = { type: 'correct' }
      }
      for (const nonterminal of props.nonterminals) {
        const key = `${stateIndex},${nonterminal}`
        validationResults.gotos[key] = { type: 'correct' }
      }
    }
    hasValidationResults.value = true
  } else {
    // 隐藏答案时，清空验证结果
    Object.keys(validationResults.actions).forEach((key) => {
      delete validationResults.actions[key]
    })
    Object.keys(validationResults.gotos).forEach((key) => {
      delete validationResults.gotos[key]
    })
    hasValidationResults.value = false
  }
}

// 初始化用户输入数据结构
const initializeUserInputs = () => {
  // 清空验证结果，避免初始化时显示验证状态
  Object.keys(validationResults.actions).forEach((key) => {
    delete validationResults.actions[key]
  })
  Object.keys(validationResults.gotos).forEach((key) => {
    delete validationResults.gotos[key]
  })
  hasValidationResults.value = false

  // 初始化 ACTION 输入
  for (let stateIndex = 0; stateIndex < stateCount.value; stateIndex++) {
    for (const terminal of [...props.terminals, '#']) {
      const key = `${stateIndex},${terminal}`
      if (!(key in userInputs.actions)) {
        userInputs.actions[key] = ''
      }
    }
  }

  // 初始化 GOTO 输入
  for (let stateIndex = 0; stateIndex < stateCount.value; stateIndex++) {
    for (const nonterminal of props.nonterminals) {
      const key = `${stateIndex},${nonterminal}`
      if (!(key in userInputs.gotos)) {
        userInputs.gotos[key] = ''
      }
    }
  }
}

// 监听数据变化
watch(
  () => [stateCount.value, props.terminals, props.nonterminals],
  () => {
    initializeUserInputs()
  },
  { immediate: true },
)

watch(
  () => isTableComplete.value,
  (newValue) => {
    emit('step-complete', newValue)
  },
)

// 组件挂载
onMounted(() => {
  initializeUserInputs()
})
</script>

<style scoped>
.parsing-table-component {
  width: 100%;
}

.user-input-section {
  animation: fadeInUp 0.6s ease-out;
}

.answer-section {
  animation: fadeInUp 0.6s ease-out 0.2s both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 自定义滚动条 */
.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* 输入框样式优化 */
input:focus {
  outline: none;
}

/* 表格hover效果 */
tbody tr:hover {
  background-color: #f8fafc;
}

/* 错误状态的特殊样式 */
.border-yellow-400 {
  border-width: 2px;
}

.border-red-400 {
  border-width: 2px;
}

.border-green-400 {
  border-width: 2px;
}
</style>
