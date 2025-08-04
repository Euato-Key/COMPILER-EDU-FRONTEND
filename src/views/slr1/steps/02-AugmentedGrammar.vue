<template>
  <div class="augmented-grammar-step">
    <div class="step-header">
      <div class="flex items-center gap-4">
        <div class="step-icon">
          <Icon icon="lucide:file-text" class="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-900">增广文法</h2>
          <p class="text-gray-600 mt-1">第二步：构造增广文法</p>
        </div>
      </div>
    </div>

    <div class="step-content">
      <!-- 说明区域和原文法并排显示 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- 左侧：增广文法构造规则 -->
        <div class="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <div class="flex items-start">
            <Icon icon="lucide:info" class="w-5 h-5 text-purple-600 mt-0.5 mr-3" />
            <div>
              <div class="flex items-center gap-3 mb-3">
                <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Icon icon="lucide:file-text" class="w-5 h-5 text-purple-600" />
                </div>
                <h3 class="text-xl font-bold text-purple-900">增广文法构造规则</h3>
              </div>
              <ul class="space-y-1 text-sm text-purple-800">
                <li>• 为原文法添加新的开始符号{{ startSymbol }}'</li>
                <li>• 添加产生式：{{ startSymbol }}'->{{ startSymbol }}</li>
                <li>• 将含有多个候选式的产生式分解为多个单独的产生式</li>
                <li>• 例如：A -> α|β 分解为 A -> α 和 A -> β</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 右侧：原文法显示 -->
        <div
          v-if="originalGrammar.length > 0"
          class="bg-white border border-gray-200 rounded-lg p-6"
        >
          <div class="flex items-center gap-3 mb-4">
            <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Icon icon="lucide:list" class="w-5 h-5 text-purple-600" />
            </div>
            <h3 class="text-xl font-bold text-purple-900">原文法</h3>
          </div>
          <div class="space-y-2">
            <div
              v-for="(production, index) in originalGrammar"
              :key="index"
              class="font-mono text-sm bg-purple-50 border border-purple-200 px-3 py-2 rounded-lg text-purple-800"
            >
              {{ production }}
            </div>
          </div>
        </div>
      </div>

      <!-- 从前面步骤获取数据 -->
      <div v-if="!grammarData" class="text-center py-20">
        <Icon icon="lucide:arrow-left" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-gray-600 mb-2">请先完成前面的步骤</h3>
        <p class="text-gray-500">需要先完成文法输入才能构造增广文法</p>
      </div>

      <div v-else class="space-y-6">
        <!-- 增广文法输入区域 -->
        <div class="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6 shadow-sm">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
              <Icon icon="lucide:edit-3" class="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 class="text-2xl font-bold text-purple-900">增广文法产生式</h3>
              <p class="text-purple-600 text-sm">请填写增广后的文法产生式（每个产生式右侧只有一个候选式）</p>
            </div>
          </div>

          <!-- 答题区域 -->
          <div class="bg-white rounded-lg p-4 border border-purple-100 shadow-inner">
            <div class="space-y-4">
              <div
                v-for="(formula, index) in augmentedFormulas"
                :key="formula.id"
                class="flex items-center gap-3 group"
              >
                <!-- 序号标签 -->
                <div class="w-8 h-8 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  {{ index + 1 }}
                </div>

                <!-- 产生式输入框 -->
                <div class="flex-1">
                  <input
                    v-model="formula.text"
                    type="text"
                    :placeholder="`请输入产生式 ${index + 1}，例如：S'->S`"
                    :class="[
                      'w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 font-mono text-sm',
                      'focus:ring-4 focus:ring-purple-100 focus:border-purple-400',
                      getInputClass(formula.status),
                    ]"
                    @input="checkFormCompletion"
                    :readonly="formula.readonly"
                  />
                </div>

                <!-- 操作按钮 -->
                <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    @click="removeFormula(index)"
                    :disabled="augmentedFormulas.length <= 1 || formula.readonly"
                    class="w-8 h-8 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center text-lg shadow-sm"
                    title="删除产生式"
                  >
                    ×
                  </button>
                  <button
                    @click="addFormula(index)"
                    :disabled="isStepComplete"
                    class="w-8 h-8 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 transition-colors flex items-center justify-center text-lg shadow-sm"
                    title="添加产生式"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 提示信息 -->
          <div class="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex items-start gap-3">
              <Icon icon="lucide:lightbulb" class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p class="font-semibold text-blue-900 mb-2">填写提示：</p>
                <ul class="space-y-1 text-sm text-blue-800">
                  <li>• 首先添加增广产生式：<code class="bg-blue-100 px-1 rounded">{{ startSymbol }}'->{{ startSymbol }}</code></li>
                  <li>• 然后将多候选式产生式分解为单个候选式</li>
                  <li>• 例如：<code class="bg-blue-100 px-1 rounded">S -> aB|bA</code> 分解为 <code class="bg-blue-100 px-1 rounded">S -> aB</code> 和 <code class="bg-blue-100 px-1 rounded">S -> bA</code></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- 验证按钮 -->
        <div class="flex justify-center gap-4">
          <button
            @click="validateFormulas"
            :disabled="isValidating"
            class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition-colors"
          >
            <Icon
              :icon="isValidating ? 'lucide:loader-2' : 'lucide:check-circle'"
              :class="['w-4 h-4 inline mr-2', isValidating ? 'animate-spin' : '']"
            />
            {{ isValidating ? '验证中...' : '验证增广文法' }}
          </button>

          <button
            @click="showAnswer"
            class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Icon icon="lucide:eye" class="w-4 h-4 inline mr-2" />
            显示答案
          </button>
        </div>

        <!-- 验证结果 -->
        <div v-if="validationMessage" class="mt-4">
          <div
            :class="[
              'p-4 rounded-lg border',
              validationSuccess
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800',
            ]"
          >
            <div class="flex items-start gap-2">
              <Icon
                :icon="validationSuccess ? 'lucide:check-circle' : 'lucide:alert-circle'"
                class="w-5 h-5 mt-0.5 flex-shrink-0"
              />
              <div>
                <p class="font-medium">{{ validationSuccess ? '验证成功' : '验证失败' }}</p>
                <p class="text-sm mt-1">{{ validationMessage }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="step-actions">
      <div class="flex justify-between items-center">
        <button
          @click="$emit('prev-step')"
          class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Icon icon="lucide:chevron-left" class="w-4 h-4 inline mr-2" />
          上一步
        </button>
        <div class="text-sm text-gray-500">步骤 2 / 5</div>
        <button
          @click="nextStep"
          :disabled="!isStepComplete"
          :class="[
            'px-6 py-2 rounded-lg transition-colors',
            isStepComplete
              ? 'bg-purple-600 text-white hover:bg-purple-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed',
          ]"
        >
          下一步
          <Icon icon="lucide:chevron-right" class="w-4 h-4 inline ml-2" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { useSLR1Store } from '@/stores/slr1'

interface AugmentedFormula {
  id: string
  text: string
  status: 'normal' | 'correct' | 'error'
  readonly: boolean
}

const emit = defineEmits<{
  'next-step': []
  'prev-step': []
}>()

const slr1Store = useSLR1Store()

// 响应式数据
const augmentedFormulas = ref<AugmentedFormula[]>([])
const formulaCounter = ref(1)
const isValidating = ref(false)
const validationMessage = ref('')
const validationSuccess = ref(false)

// 计算属性
const startSymbol = computed(() => {
  return slr1Store.analysisResult?.S || 'S'
})

const grammarData = computed(() => slr1Store.analysisResult)

const originalGrammar = computed(() => {
  return slr1Store.productions || []
})

const isStepComplete = computed(() => {
  return validationSuccess.value
})

// 获取输入框样式类
const getInputClass = (status: string) => {
  switch (status) {
    case 'correct':
      return 'border-green-500 bg-green-50 focus:ring-green-100 focus:border-green-400'
    case 'error':
      return 'border-red-500 bg-red-50 focus:ring-red-100 focus:border-red-400'
    default:
      return 'border-gray-300'
  }
}

// 检查表单完成度
const checkFormCompletion = () => {
  // 重置验证状态
  validationMessage.value = ''
  validationSuccess.value = false
  augmentedFormulas.value.forEach((formula) => {
    formula.status = 'normal'
  })
}

// 添加产生式
const addFormula = (index: number) => {
  if (isStepComplete.value) return

  augmentedFormulas.value.splice(index + 1, 0, {
    id: `formula_${formulaCounter.value++}`,
    text: '',
    status: 'normal',
    readonly: false,
  })
}

// 删除产生式
const removeFormula = (index: number) => {
  if (augmentedFormulas.value.length <= 1 || augmentedFormulas.value[index].readonly) return

  augmentedFormulas.value.splice(index, 1)
  checkFormCompletion()
}

// 验证增广文法
const validateFormulas = async () => {
  if (!grammarData.value || !grammarData.value.formulas_list) return

  isValidating.value = true
  validationMessage.value = ''

  try {
    // 获取正确答案
    const correctFormulas = grammarData.value.formulas_list
    const userFormulas = augmentedFormulas.value.map((f) => f.text.trim()).filter((t) => t)

    // 验证每个产生式
    const correctSet = new Set(correctFormulas)
    let allCorrect = true

    for (const formula of augmentedFormulas.value) {
      const trimmedText = formula.text.trim()
      if (!trimmedText) {
        formula.status = 'error'
        allCorrect = false
        continue
      }

      if (correctSet.has(trimmedText)) {
        formula.status = 'correct'
        correctSet.delete(trimmedText)
      } else {
        formula.status = 'error'
        allCorrect = false
      }
    }

    if (allCorrect && correctSet.size === 0 && userFormulas.length === correctFormulas.length) {
      validationSuccess.value = true
      validationMessage.value = '增广文法构造正确！'
    } else {
      validationSuccess.value = false
      if (correctSet.size > 0) {
        validationMessage.value = `还缺少 ${correctSet.size} 个产生式，或某些产生式不正确`
      } else if (userFormulas.length !== correctFormulas.length) {
        validationMessage.value = '产生式数量不正确'
      } else {
        validationMessage.value = '某些产生式不正确，请检查'
      }
    }
  } catch (error) {
    console.error('验证失败:', error)
    validationSuccess.value = false
    validationMessage.value = '验证失败，请检查输入'
  } finally {
    isValidating.value = false
  }
}

// 显示答案
const showAnswer = () => {
  if (!grammarData.value || !grammarData.value.formulas_list) return

  const correctFormulas = grammarData.value.formulas_list

  // 清空当前输入
  augmentedFormulas.value = []

  // 填充正确答案
  correctFormulas.forEach((formula: string) => {
    augmentedFormulas.value.push({
      id: `formula_${formulaCounter.value++}`,
      text: formula,
      status: 'correct',
      readonly: false,
    })
  })

  validationMessage.value = '已显示标准答案'
  validationSuccess.value = true
}

// 下一步
const nextStep = () => {
  if (isStepComplete.value) {
    // 滚动到页面顶部
    window.scrollTo({ top: 0, behavior: 'smooth' })
    emit('next-step')
  }
}

// 初始化
const initializeFormulas = () => {
  if (augmentedFormulas.value.length === 0) {
    // 添加第一个空的产生式 - 移除空格以匹配后端格式
    augmentedFormulas.value.push({
      id: `formula_${formulaCounter.value++}`,
      text: startSymbol.value ? `${startSymbol.value}'->${startSymbol.value}` : '',
      status: 'normal',
      readonly: false,
    })
  }
}

// 监听store中的分析结果变化
watch(
  () => slr1Store.analysisResult,
  (newValue) => {
    if (newValue && augmentedFormulas.value.length === 0) {
      initializeFormulas()
    }
  },
  { immediate: true },
)

// 组件挂载时初始化
onMounted(() => {
  if (slr1Store.analysisResult) {
    initializeFormulas()
  }
})
</script>

<style scoped>
.step-header {
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid #e5e7eb;
}
.step-icon {
  width: 3rem;
  height: 3rem;
  background: #faf5ff;
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
