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
      <!-- 说明区域 -->
      <div class="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
        <div class="flex items-start">
          <Icon icon="lucide:info" class="w-5 h-5 text-purple-600 mt-0.5 mr-3" />
          <div>
            <h3 class="text-lg font-semibold text-purple-900 mb-2">增广文法构造规则</h3>
            <ul class="space-y-1 text-sm text-purple-800">
              <li>• 为原文法添加新的开始符号{{ startSymbol }}'</li>
              <li>• 添加产生式：{{ startSymbol }}' → {{ startSymbol }}</li>
              <li>• 将含有多个候选式的产生式分解为多个单独的产生式</li>
              <li>• 例如：A → α|β 分解为 A → α 和 A → β</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 原文法显示 -->
      <div v-if="originalGrammar.length > 0" class="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">原文法</h3>
        <div class="space-y-2">
          <div
            v-for="(production, index) in originalGrammar"
            :key="index"
            class="font-mono text-sm bg-gray-50 px-3 py-2 rounded border"
          >
            {{ production }}
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
        <div class="bg-white border border-gray-200 rounded-lg p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">增广文法产生式</h3>
          <p class="text-sm text-gray-600 mb-4">请填写增广后的文法产生式（每个产生式右侧只有一个候选式）</p>
          
          <div class="space-y-3">
            <div
              v-for="(formula, index) in augmentedFormulas"
              :key="formula.id"
              class="flex items-center gap-3"
            >
              <!-- 产生式输入框 -->
              <div class="flex-1">
                <input
                  v-model="formula.text"
                  type="text"
                  :placeholder="`产生式 ${index + 1}`"
                  :class="[
                    'w-full px-3 py-2 border rounded-lg transition-colors',
                    getInputClass(formula.status)
                  ]"
                  @input="checkFormCompletion"
                  :readonly="formula.readonly"
                />
              </div>

              <!-- 操作按钮 -->
              <div class="flex items-center gap-1">
                <button
                  @click="removeFormula(index)"
                  :disabled="augmentedFormulas.length <= 1 || formula.readonly"
                  class="w-8 h-8 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center text-lg"
                  title="删除产生式"
                >
                  ×
                </button>
                <button
                  @click="addFormula(index)"
                  :disabled="isStepComplete"
                  class="w-8 h-8 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 transition-colors flex items-center justify-center text-lg"
                  title="添加产生式"
                >
                  +
                </button>
              </div>
            </div>
          </div>
          
          <!-- 提示信息 -->
          <div class="mt-4 text-sm text-gray-600">
            <p><strong>填写提示：</strong></p>
            <ul class="mt-1 space-y-1">
              <li>• 首先添加增广产生式：{{ startSymbol }}' → {{ startSymbol }}</li>
              <li>• 然后将多候选式产生式分解为单个候选式</li>
              <li>• 例如：S → aB|bA 分解为 S → aB 和 S → bA</li>
            </ul>
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
                : 'bg-red-50 border-red-200 text-red-800'
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
        <button @click="$emit('prev-step')" class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
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
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
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
import { ref, computed, onMounted } from 'vue'
import { Icon } from '@iconify/vue'

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

// 响应式数据
const grammarData = ref<any>(null)
const augmentedFormulas = ref<AugmentedFormula[]>([])
const formulaCounter = ref(1)
const isValidating = ref(false)
const validationMessage = ref('')
const validationSuccess = ref(false)
const originalGrammar = ref<string[]>([])

// 计算属性
const startSymbol = computed(() => {
  return grammarData.value?.S || 'S'
})

const isStepComplete = computed(() => {
  return validationSuccess.value
})

// 获取输入框样式类
const getInputClass = (status: string) => {
  switch (status) {
    case 'correct':
      return 'border-green-500 bg-green-50'
    case 'error':
      return 'border-red-500 bg-red-50'
    default:
      return 'border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200'
  }
}

// 检查表单完成度
const checkFormCompletion = () => {
  // 重置验证状态
  validationMessage.value = ''
  validationSuccess.value = false
  augmentedFormulas.value.forEach(formula => {
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
    readonly: false
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
    const correctFormulas = grammarData.value.formulas_list.map((item: any) => item.text || item)
    const userFormulas = augmentedFormulas.value.map(f => f.text.trim()).filter(t => t)
    
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
      
      // 保存验证结果
      localStorage.setItem('slr1_augmented_data', JSON.stringify({
        formulas: augmentedFormulas.value,
        timestamp: Date.now()
      }))
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

  const correctFormulas = grammarData.value.formulas_list.map((item: any) => item.text || item)
  
  // 清空当前输入
  augmentedFormulas.value = []
  
  // 填充正确答案
  correctFormulas.forEach((formula: string, index: number) => {
    augmentedFormulas.value.push({
      id: `formula_${formulaCounter.value++}`,
      text: formula,
      status: 'correct',
      readonly: false
    })
  })
  
  validationMessage.value = '已显示标准答案'
  validationSuccess.value = true
}

// 下一步
const nextStep = () => {
  if (isStepComplete.value) {
    emit('next-step')
  }
}

// 初始化
const initializeFormulas = () => {
  if (augmentedFormulas.value.length === 0) {
    // 添加第一个空的产生式
    augmentedFormulas.value.push({
      id: `formula_${formulaCounter.value++}`,
      text: startSymbol.value ? `${startSymbol.value}' -> ${startSymbol.value}` : '',
      status: 'normal',
      readonly: false
    })
  }
}

// 加载数据
const loadData = () => {
  // 从localStorage加载前面步骤的数据
  const grammarStorageData = localStorage.getItem('slr1_grammar_data')
  
  if (grammarStorageData) {
    grammarData.value = JSON.parse(grammarStorageData)
    
    // 设置原文法显示
    if (grammarData.value.original_productions) {
      originalGrammar.value = grammarData.value.original_productions
    }
    
    initializeFormulas()
  }
  
  // 加载之前保存的增广文法数据
  const savedAugmentedData = localStorage.getItem('slr1_augmented_data')
  if (savedAugmentedData) {
    const augmentedData = JSON.parse(savedAugmentedData)
    if (augmentedData.formulas) {
      augmentedFormulas.value = augmentedData.formulas
      // 检查是否已验证成功
      if (augmentedFormulas.value.every(f => f.status === 'correct')) {
        validationSuccess.value = true
        validationMessage.value = '增广文法构造正确！'
      }
    }
  }
}

// 组件挂载时加载数据
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.step-header { padding: 2rem 2rem 1rem; border-bottom: 1px solid #e5e7eb; }
.step-icon { width: 3rem; height: 3rem; background: #faf5ff; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; }
.step-content { padding: 2rem; }
.step-actions { padding: 1rem 2rem 2rem; border-top: 1px solid #e5e7eb; background: #f9fafb; }
</style>
