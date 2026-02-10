<template>
  <div class="grammar-input-step">
    <div class="step-header">
      <div class="flex items-center gap-4">
        <div class="step-icon">
          <Icon icon="lucide:edit-3" class="w-6 h-6 text-pink-600" />
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-900">文法输入</h2>
          <p class="text-gray-600 mt-1">第一步：输入SLR1文法并进行预处理验证</p>
        </div>
      </div>
    </div>

    <div class="step-content">
      <!-- 说明区域 -->
      <div class="bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 border border-pink-200 rounded-xl p-6 mb-6 shadow-sm">
        <div class="flex items-start">
          <div class="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow-md">
            <Icon icon="lucide:info" class="w-5 h-5 text-white" />
          </div>
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-3">
              <h3 class="text-xl font-bold text-pink-900">SLR1文法输入格式</h3>
              <span class="px-2 py-1 bg-pink-100 text-pink-700 text-xs font-medium rounded-full">标准格式</span>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 class="font-semibold text-pink-800 mb-2 flex items-center">
                  <Icon icon="lucide:check-circle" class="w-4 h-4 mr-2 text-pink-600" />
                  基本规则
                </h4>
                <ul class="space-y-1.5 text-base text-pink-800">
                  <li>• 每行一个产生式，格式：<code class="bg-pink-100 px-1.5 rounded font-semibold">A -> αβγ</code></li>
                  <li>• 左侧为非终结符，右侧为产生式体</li>
                  <li>• 使用 <code class="bg-pink-100 px-1.5 rounded font-semibold">-></code> 表示产生</li>
                </ul>
              </div>
              <div>
                <h4 class="font-semibold text-pink-800 mb-2 flex items-center">
                  <Icon icon="lucide:settings" class="w-4 h-4 mr-2 text-pink-600" />
                  特殊符号
                </h4>
                <ul class="space-y-1.5 text-base text-pink-800">
                  <li>• 使用 <code class="bg-pink-100 px-1.5 rounded font-semibold">|</code> 表示或者关系</li>
                  <li>• 使用 <code class="bg-pink-100 px-1.5 rounded font-semibold">ε</code> 表示空串</li>
                  <li>• 支持多候选式：<code class="bg-pink-100 px-1.5 rounded font-semibold">A -> α | β | γ</code></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 文法输入区域 -->
      <div class="space-y-6">
        <!-- 文法输入区域 -->
        <div class="bg-gradient-to-br from-pink-50 to-purple-50 border-2 border-pink-200 rounded-xl p-6 shadow-sm">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
              <Icon icon="lucide:edit-3" class="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 class="text-xl font-bold text-pink-900">输入SLR1文法产生式</h3>
              <p class="text-pink-600 text-sm">请输入符合SLR1文法规范的产生式</p>
            </div>
          </div>

          <div class="bg-white rounded-lg p-4 border border-pink-100 shadow-inner">
            <textarea
              v-model="grammarInput"
              placeholder="请输入文法产生式，例如：&#10;S -> E&#10;E -> E + T | T&#10;T -> T * F | F&#10;F -> ( E ) | i"
              class="w-full h-40 px-4 py-3 border-2 rounded-lg focus:ring-4 focus:ring-pink-100 focus:border-pink-400 resize-none font-mono text-base transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
              :class="[inputErrors.length > 0 ? 'border-red-300' : 'border-gray-200']"
              @input="onInputChange"
            ></textarea>
          </div>

          <!-- 输入错误提示 -->
          <div v-if="inputErrors.length > 0" class="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <div class="flex items-start gap-2">
              <Icon icon="lucide:alert-circle" class="w-5 h-5 text-red-500 mt-0.5" />
              <div>
                <p class="font-medium text-red-800">输入格式错误</p>
                <ul class="mt-1 space-y-1">
                  <li v-for="error in inputErrors" :key="error" class="text-sm text-red-600">{{ error }}</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- 分析按钮 -->
          <div class="flex justify-center mt-4">
            <button
              @click="analyzeGrammar"
              :disabled="!canAnalyze"
              class="px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl hover:from-pink-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
            >
              <Icon
                :icon="isAnalyzing ? 'lucide:loader-2' : 'lucide:play'"
                :class="['w-5 h-5 inline mr-2', isAnalyzing ? 'animate-spin' : '']"
              />
              <span class="font-semibold">{{ isAnalyzing ? '分析中...' : '分析文法' }}</span>
            </button>
          </div>
        </div>

        <!-- 分析结果 -->
        <transition name="slide-fade" mode="out-in">
          <div v-if="analysisResult" class="mt-6">
            <div
              :class="[
                'p-6 rounded-xl border-2 transition-all duration-200 shadow-sm',
                analysisResult.success
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 text-green-800'
                  : 'bg-gradient-to-br from-red-50 to-pink-50 border-red-200 text-red-800',
              ]"
            >
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                  <Icon
                    :icon="analysisResult.success ? 'lucide:check-circle' : 'lucide:alert-circle'"
                    class="w-6 h-6 text-white"
                  />
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-3">
                    <h3 class="text-xl font-bold">
                      {{ analysisResult.success ? '文法分析成功' : '文法分析失败' }}
                    </h3>
                    <span
                      :class="[
                        'px-3 py-1 text-xs font-medium rounded-full',
                        analysisResult.success
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      ]"
                    >
                      {{ analysisResult.success ? 'SLR1文法' : '分析失败' }}
                    </span>
                  </div>
                  <p class="text-sm mb-4">{{ analysisResult.message }}</p>

                  <!-- 成功时显示文法信息 -->
                  <div v-if="analysisResult.success && analysisResult.data" class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div class="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-green-200/50">
                        <div class="font-medium text-green-700 mb-1">开始符号</div>
                        <div class="text-lg font-mono text-green-800">{{ analysisResult.data.S }}</div>
                      </div>
                      <div class="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-green-200/50">
                        <div class="font-medium text-green-700 mb-1">非终结符</div>
                        <div class="text-sm font-mono text-green-800">{{ analysisResult.data.Vn?.join(', ') }}</div>
                      </div>
                      <div class="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-green-200/50">
                        <div class="font-medium text-green-700 mb-1">终结符</div>
                        <div class="text-sm font-mono text-green-800">{{ analysisResult.data.Vt?.join(', ') }}</div>
                      </div>
                    </div>

                    <div class="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-green-200/50">
                      <div class="font-medium text-green-700 mb-3">原始文法</div>
                      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        <div
                          v-for="(prod, index) in slr1Store.productions"
                          :key="index"
                          class="text-base bg-white px-3 py-2 rounded-lg border border-green-200 font-mono text-green-800 shadow-sm font-semibold"
                        >
                          {{ prod }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>

        <!-- 示例文法 -->
        <div class="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6 shadow-sm">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Icon icon="lucide:book-open" class="w-4 h-4 text-white" />
            </div>
            <h3 class="text-lg font-bold text-purple-900">示例文法</h3>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              v-for="example in EXAMPLE_GRAMMARS"
              :key="example.id"
              class="bg-white rounded-lg p-4 border border-purple-100 shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <div class="flex items-center gap-2 mb-3">
                <div class="w-6 h-6 bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {{ example.id }}
                </div>
                <h4 class="font-semibold text-gray-900">{{ example.name }}</h4>
              </div>
              <div class="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded p-3 mb-3 flex-1">
                <pre class="text-sm font-mono text-pink-800 font-semibold whitespace-pre-wrap">{{ example.grammar }}</pre>
              </div>
              <button
                @click="loadExample(example.id)"
                class="w-full text-xs px-3 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200 shadow-sm"
              >
                使用此示例
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="step-actions">
      <div class="flex justify-between items-center">
        <div class="text-sm text-gray-500">步骤 1 / 5</div>
        <button
          @click="nextStep"
          :disabled="!isStepComplete"
          :class="[
            'px-6 py-2 rounded-lg transition-colors',
            isStepComplete
              ? 'bg-pink-600 text-white hover:bg-pink-700'
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
import { ref, computed, watch, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useSLR1StoreNew } from '@/stores'
import { useCommonStore } from '@/stores/common'
import { validateOnInput, validateOnSubmit, EXAMPLE_GRAMMARS } from '../utils/validation'

const emit = defineEmits<{
  'next-step': []
  'prev-step': []
}>()

// 使用新的 SLR1 Store
const slr1Store = useSLR1StoreNew()
const commonStore = useCommonStore()

// 组件状态
const grammarInput = ref('')
const inputErrors = ref<string[]>([])
const isAnalyzing = computed(() => commonStore.loading)

// 分析结果显示
const analysisResult = computed(() => {
  if (!slr1Store.originalData) {
    if (commonStore.error) {
      return {
        success: false,
        message: commonStore.error,
        data: null,
      }
    }
    return null
  }
  
  return {
    success: true,
    message: slr1Store.isSLR1Grammar
      ? '文法分析完成，符合SLR1文法！'
      : '文法存在冲突，不是SLR1文法',
    data: slr1Store.originalData,
  }
})

// 是否可以分析
const canAnalyze = computed(() => {
  return grammarInput.value.trim().length > 0 && 
         inputErrors.value.length === 0 && 
         !isAnalyzing.value
})

// 步骤完成状态
const isStepComplete = computed(() => {
  return slr1Store.originalData !== null && slr1Store.isSLR1Grammar === true
})

// === 核心逻辑：尝试恢复会话 ===
const isRecovering = ref(false)
const handleRecovery = async () => {
  if (isRecovering.value) return
  
  if (slr1Store.productions.length > 0 && !slr1Store.originalData) {
    isRecovering.value = true
    console.log('[SLR1-STEP1-RECOVERY] 检测到文法记录，正在静默恢复分析结果...', slr1Store.productions)
    
    try {
      const success = await slr1Store.performSLR1Analysis(true)
      if (success) {
        console.log('[SLR1-STEP1-RECOVERY] 分析结果恢复成功')
      }
    } catch (err) {
      console.error('[SLR1-STEP1-RECOVERY] 恢复失败:', err)
    } finally {
      isRecovering.value = false
    }
  }
}

// 监听持久化数据的异步加载
watch(
  () => slr1Store.grammar,
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

// 组件挂载时加载持久化数据
onMounted(() => {
  // 确保挂载时同步一次
  if (slr1Store.grammar && !grammarInput.value) {
    grammarInput.value = slr1Store.grammar
  }
  handleRecovery()
})

// 输入变化处理
const onInputChange = () => {
  inputErrors.value = validateOnInput(grammarInput.value)
  // 清除错误状态
  commonStore.clearError()
}

// 加载示例文法
const loadExample = (exampleId: number) => {
  const example = EXAMPLE_GRAMMARS.find(e => e.id === exampleId)
  if (example) {
    grammarInput.value = example.grammar
    // 触发输入校验
    onInputChange()
    // 清除之前的分析结果
    commonStore.clearError()
  }
}

// 分析文法
const analyzeGrammar = async () => {
  if (!grammarInput.value.trim()) return

  try {
    // 深度校验
    const validation = validateOnSubmit(grammarInput.value)
    if (!validation.isValid) {
      inputErrors.value = validation.errors
      return
    }

    // 更新store中的产生式
    slr1Store.setProductions(validation.processedLines)

    // 执行SLR1分析
    const success = await slr1Store.performSLR1Analysis()

    if (success) {
      // 保存到历史记录
      slr1Store.saveToHistory()
      console.log('[SLR1-STEP1] 文法分析成功，已保存到历史记录')
    } else {
      console.error('[SLR1-STEP1] SLR1 analysis failed')
    }
  } catch (error: unknown) {
    console.error('[SLR1-STEP1] Grammar analysis error:', error)
    commonStore.setError(error instanceof Error ? error.message : '文法分析失败，请检查输入格式')
  }
}

// 处理下一步
const nextStep = () => {
  if (isStepComplete.value) {
    // 滚动到页面顶部
    window.scrollTo({ top: 0, behavior: 'smooth' })
    emit('next-step')
  }
}

// 监听grammarInput变化，同步到store（用于显示）
watch(grammarInput, (newValue) => {
  if (newValue.trim()) {
    const lines = newValue.split('\n').filter(line => line.trim())
    slr1Store.setProductions(lines)
  } else {
    slr1Store.setProductions([])
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
  background: #fce7f3;
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

/* 过渡动画 */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
