<template>
  <div class="grammar-input-step">
    <div class="step-header">
      <div class="flex items-center gap-4">
        <div class="step-icon">
          <Icon icon="lucide:file-text" class="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-900">输入文法</h2>
          <p class="text-gray-600 mt-1">第一步：定义上下文无关文法规则</p>
        </div>
      </div>
    </div>

    <div class="step-content">
      <div class="max-w-4xl mx-auto">
        <!-- 文法输入区域 -->
        <div class="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 rounded-xl shadow-lg border border-blue-100 p-8 mb-8">
          <!-- 头部区域 -->
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Icon icon="lucide:file-text" class="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 class="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  输入产生式
                </h3>
                <p class="text-base text-gray-600 mt-1 font-medium">定义上下文无关文法规则</p>
              </div>
            </div>
            <div class="flex items-center gap-2 px-3 py-1.5 bg-blue-100 rounded-full">
              <Icon icon="lucide:info" class="w-4 h-4 text-blue-600" />
              <span class="text-sm font-medium text-blue-700">支持格式：A->α|β</span>
            </div>
          </div>

          <div class="space-y-6">
            <!-- 输入框区域 -->
            <div class="bg-white rounded-lg border border-blue-200 p-6 shadow-sm">
              <label class="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Icon icon="lucide:edit-3" class="w-4 h-4 text-blue-500" />
                文法规则
                <span class="text-red-500 text-lg">*</span>
                <span class="text-sm font-normal text-gray-600 ml-2">(每行一个产生式，使用单字符作为符号)</span>
              </label>
              <textarea
                v-model="grammarInput"
                placeholder="请输入文法产生式，例如：&#10;S->AB&#10;A->a|ε&#10;B->b"
                class="w-full h-36 px-4 py-3 border-2 border-blue-200 rounded-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-400 resize-y transition-all duration-200 font-mono text-sm bg-gradient-to-br from-gray-50 to-white"
                @input="handleInput"
              />
              <div class="mt-3 flex items-center justify-between text-sm">
                <div class="flex items-center gap-2 text-gray-600 font-medium">
                  <Icon icon="lucide:alert-triangle" class="w-3 h-3" />
                  <span>不支持中文字符，不能有重复产生式</span>
                </div>
                <div class="flex items-center gap-1 text-blue-700 font-medium">
                  <Icon icon="lucide:hash" class="w-3 h-3" />
                  <span>{{ grammarInput.length }} 字符</span>
                </div>
              </div>
            </div>

            <!-- 规范提示区域 -->
            <GrammarInputTips />

            <!-- 输入时错误提示 -->
            <div v-if="inputErrors.length > 0" class="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-xl p-6 shadow-lg">
              <div class="flex gap-4">
                <div class="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon icon="lucide:alert-triangle" class="w-6 h-6 text-white" />
                </div>
                <div class="flex-1">
                  <p class="text-lg font-semibold text-red-800 mb-3">输入格式错误</p>
                  <div class="bg-white/60 rounded-lg p-4 border border-red-200">
                    <ul class="space-y-2">
                      <li v-for="error in inputErrors" :key="error" class="flex items-start gap-3 text-sm">
                        <Icon icon="lucide:x-circle" class="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span class="text-red-700">{{ error }}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <!-- 验证按钮 -->
            <div class="flex justify-center">
              <button
                @click="handleValidateGrammar"
                :disabled="!canValidate || isValidating"
                :class="[
                  'flex items-center gap-3 px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105',
                  canValidate && !isValidating
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-xl hover:from-green-600 hover:to-emerald-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-md'
                ]"
              >
                <Icon
                  v-if="isValidating"
                  icon="lucide:loader-2"
                  class="w-5 h-5 animate-spin"
                />
                <Icon
                  v-else
                  icon="lucide:check-circle"
                  class="w-5 h-5"
                />
                <span>{{ isValidating ? '验证中...' : '验证文法' }}</span>
              </button>
            </div>

            <!-- 验证状态提示 -->
            <ValidationStatus
              :status="validationStatus"
              :message="validationMessage"
              :originalData="originalData"
              :productionCount="productions.length"
              :submitErrors="submitErrors"
            />
          </div>
        </div>

        <!-- 示例文法 -->
        <GrammarExamples
          :examples="EXAMPLE_GRAMMARS"
          @use="useExample"
        />

        <!-- 分析结果 -->
        <GrammarAnalysisResult :data="originalData" />
      </div>
    </div>

    <div class="step-actions">
      <div class="flex justify-between items-center">
        <button
          disabled
          class="flex items-center gap-2 px-6 py-2 border border-gray-300 text-gray-400 rounded-lg cursor-not-allowed"
        >
          <Icon icon="lucide:chevron-left" class="w-4 h-4" />
          <span>上一步</span>
        </button>
        <div class="text-sm text-gray-500">步骤 1 / 4</div>
        <button
          @click="handleNextStep"
          :disabled="!canProceed"
          :class="[
            'flex items-center gap-2 px-6 py-2 rounded-lg transition-colors',
            canProceed
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed',
          ]"
        >
          <span>下一步</span>
          <Icon icon="lucide:chevron-right" class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { Icon } from '@iconify/vue'
import { validateOnInput, validateOnSubmit } from '../utils/validation'
import { EXAMPLE_GRAMMARS, type GrammarExample } from '../utils/constants'
import GrammarInputTips from '../components/GrammarInputTips.vue'
import ValidationStatus from '../components/ValidationStatus.vue'
import GrammarExamples from '../components/GrammarExamples.vue'
import GrammarAnalysisResult from '../components/GrammarAnalysisResult.vue'

// 获取 Store 实例
import { useLL1Store, useCommonStore } from '@/stores'
const ll1Store = useLL1Store()

// 解构响应式状态（用于模板绑定）
const { productions, originalData } = storeToRefs(ll1Store)

// 定义 emits
const emit = defineEmits<{
  'next-step': []
  'prev-step': []
}>()

// 本地状态
const grammarInput = ref('')
const inputErrors = ref<string[]>([])
const submitErrors = ref<string[]>([])
const isValidating = ref(false)
const validationStatus = ref<'none' | 'ready' | 'success' | 'failed'>('none')
const validationMessage = ref('')

// 计算属性
const canValidate = computed(() => inputErrors.value.length === 0 && grammarInput.value.trim().length > 0)
const canProceed = computed(() => {
  return validationStatus.value === 'success' && productions.value.length > 0 && originalData.value !== null
})

// === 核心逻辑：尝试恢复会话 ===
const isRecovering = ref(false)
const handleRecovery = async () => {
  if (isRecovering.value) return
  
  if (ll1Store.productions.length > 0 && !ll1Store.originalData) {
    isRecovering.value = true
    console.log('[LL1-RECOVERY] 检测到文法记录，正在静默恢复分析结果...', ll1Store.productions)
    try {
      const success = await ll1Store.performLL1Analysis(true)
      if (success) {
        console.log('[LL1-RECOVERY] 分析结果恢复成功')
        validationStatus.value = 'success'
        validationMessage.value = '已恢复数据'
      }
    } catch (err) {
      console.error('[LL1-RECOVERY] 恢复失败:', err)
    } finally {
      isRecovering.value = false
    }
  } else if (ll1Store.originalData) {
    validationStatus.value = 'success'
    validationMessage.value = '文法当前处于激活状态'
  }
}

// 监听持久化数据的异步加载
watch(
  () => ll1Store.grammar,
  (newVal) => {
    // 如果本地输入框为空，尝试从 store 同步
    if (newVal && !grammarInput.value) {
      grammarInput.value = newVal
    }
    // 只要有文法，就尝试执行分析恢复（以获取 originalData）
    if (newVal) {
      handleRecovery()
    }
  },
  { immediate: true }
)

onMounted(() => {
  // 确保挂载时同步一次
  if (ll1Store.grammar && !grammarInput.value) {
    grammarInput.value = ll1Store.grammar
  }
  handleRecovery()
})

// 处理输入变化
function handleInput() {
  inputErrors.value = validateOnInput(grammarInput.value)

  // 根据输入状态更新验证状态
  if (inputErrors.value.length > 0) {
    validationStatus.value = 'none'
    validationMessage.value = ''
  } else if (grammarInput.value.trim()) {
    validationStatus.value = 'ready'
    validationMessage.value = '符合文法验证条件：可以进行文法验证'
  } else {
    validationStatus.value = 'none'
    validationMessage.value = ''
  }

  // 清除提交错误
  submitErrors.value = []
}

// 处理验证文法按钮点击
async function handleValidateGrammar() {
  if (!canValidate.value || isValidating.value) return

  submitErrors.value = []
  isValidating.value = true
  validationStatus.value = 'none'
  validationMessage.value = ''

  try {
    // 深度校验
    const validation = validateOnSubmit(grammarInput.value)
    if (!validation.isValid) {
      submitErrors.value = validation.errors
      validationStatus.value = 'failed'
      validationMessage.value = '不符合文法验证条件：' + validation.errors.join('；')
      return
    }

    // 设置文法到 store
    ll1Store.setProductions(validation.processedLines)

    // 提交后端
    const success = await ll1Store.performLL1Analysis()

    // 只要点击了验证且后端返回成功（得到了 originalData），就整体保存一次进度
    if (success) {
      ll1Store.saveToHistory()
    }

    // 检查后端验证结果
    if (success && ll1Store.isLL1Grammar === true) {
      validationStatus.value = 'success'
      validationMessage.value = '文法验证成功：符合LL(1)文法规范，已保存答题记录'
      // 清除错误
      submitErrors.value = []
    } else {
      // 后端验证失败
      validationStatus.value = 'failed'
      validationMessage.value = '文法验证失败：不符合LL(1)文法要求'
      submitErrors.value = ['后端验证失败：不符合LL(1)文法要求']
    }
  } catch (error) {
    console.error('验证失败:', error)
    validationStatus.value = 'failed'
    validationMessage.value = '文法验证失败：验证过程中发生错误，请重试'
    submitErrors.value = ['验证过程中发生错误，请重试']
  } finally {
    isValidating.value = false
  }
}

// 使用示例文法
function useExample(example: GrammarExample) {
  grammarInput.value = example.grammar
  // 触发输入校验
  handleInput()
  // 重置验证状态
  validationStatus.value = 'none'
  validationMessage.value = ''
  submitErrors.value = []
}

// 处理下一步
function handleNextStep() {
  if (canProceed.value) {
    // 滚动到页面顶部
    window.scrollTo({ top: 0, behavior: 'smooth' })
    emit('next-step')
  }
}

// 监听grammarInput变化，同步到store（用于显示）
watch(grammarInput, (newValue) => {
  if (newValue.trim()) {
    const lines = newValue.split('\n').filter(line => line.trim())
    ll1Store.setProductions(lines)
  } else {
    ll1Store.setProductions([])
  }
})
</script>

<style scoped>
.step-header {
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 2rem;
}

.step-content {
  padding: 2rem;
  margin-bottom: 2rem;
}

.step-actions {
  padding: 1rem 2rem 2rem;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

.step-icon {
  width: 3rem;
  height: 3rem;
  background-color: #dcfce7;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
</style>
