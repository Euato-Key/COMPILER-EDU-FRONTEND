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
      <div class="bg-pink-50 border border-pink-200 rounded-lg p-6 mb-6">
        <div class="flex items-start">
          <Icon icon="lucide:info" class="w-5 h-5 text-pink-600 mt-0.5 mr-3" />
          <div>
            <h3 class="text-lg font-semibold text-pink-900 mb-2">SLR1文法输入格式</h3>
            <ul class="space-y-1 text-sm text-pink-800">
              <li>• 每行一个产生式，格式：A → αβγ</li>
              <li>• 左侧为非终结符，右侧为产生式体</li>
              <li>• 使用 → 或 -> 表示产生</li>
              <li>• 使用 | 表示或者关系</li>
              <li>• 使用 ε 或 epsilon 表示空串</li>
              <li>• SLR1要求文法无二义性，无左递归</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 文法输入区域 -->
      <div class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            输入SLR1文法产生式
          </label>
          <textarea
            v-model="grammarInput"
            placeholder="请输入文法产生式，例如：&#10;S → E&#10;E → E + T | T&#10;T → T * F | F&#10;F → ( E ) | id"
            class="w-full h-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 resize-none font-mono text-sm"
            @input="onInputChange"
          ></textarea>
        </div>

        <!-- 示例文法 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 class="font-medium text-gray-900 mb-2">示例文法1（算术表达式）</h4>
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <pre class="text-xs font-mono text-gray-700">S → E
E → E + T | T
T → T * F | F
F → ( E ) | id</pre>
              <button
                @click="loadExample(1)"
                class="mt-2 text-xs px-2 py-1 bg-pink-500 text-white rounded hover:bg-pink-600 transition-colors"
              >
                使用此示例
              </button>
            </div>
          </div>

          <div>
            <h4 class="font-medium text-gray-900 mb-2">示例文法2（简单文法）</h4>
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <pre class="text-xs font-mono text-gray-700">S → A a | b
A → c</pre>
              <button
                @click="loadExample(2)"
                class="mt-2 text-xs px-2 py-1 bg-pink-500 text-white rounded hover:bg-pink-600 transition-colors"
              >
                使用此示例
              </button>
            </div>
          </div>
        </div>

        <!-- 分析按钮 -->
        <div class="flex justify-center">
          <button
            @click="analyzeGrammar"
            :disabled="!grammarInput.trim() || isAnalyzing"
            class="px-8 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <Icon
              :icon="isAnalyzing ? 'lucide:loader-2' : 'lucide:play'"
              :class="['w-4 h-4 inline mr-2', isAnalyzing ? 'animate-spin' : '']"
            />
            {{ isAnalyzing ? '分析中...' : '分析文法' }}
          </button>
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
              <div class="flex-1">
                <p class="font-medium">{{ analysisResult.success ? '文法分析成功' : '文法分析失败' }}</p>
                <p class="text-sm mt-1">{{ analysisResult.message }}</p>

                <!-- 成功时显示文法信息 -->
                <div v-if="analysisResult.success && analysisResult.data" class="mt-4 space-y-3">
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span class="font-medium">开始符号：</span>{{ analysisResult.data.S }}
                    </div>
                    <div>
                      <span class="font-medium">非终结符：</span>{{ analysisResult.data.Vn?.join(', ') }}
                    </div>
                    <div>
                      <span class="font-medium">终结符：</span>{{ analysisResult.data.Vt?.join(', ') }}
                    </div>
                  </div>

                  <div>
                    <span class="font-medium">产生式：</span>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
                      <div
                        v-for="(prod, index) in analysisResult.data.formulas_list"
                        :key="index"
                        class="text-xs bg-white px-2 py-1 rounded border font-mono"
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
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useSLR1API } from '@/composables/api/useSLR1API'

const emit = defineEmits<{
  'next-step': []
  'prev-step': []
}>()

const slr1API = useSLR1API()

// 组件状态
const grammarInput = ref('')
const isAnalyzing = ref(false)
const analysisResult = ref<any>(null)

// 步骤完成状态
const isStepComplete = computed(() =>
  analysisResult.value?.success && analysisResult.value?.data
)

// 输入变化处理
const onInputChange = () => {
  if (analysisResult.value) {
    analysisResult.value = null
  }
}

// 加载示例文法
const loadExample = (exampleId: number) => {
  const examples = {
    1: `S → E
E → E + T | T
T → T * F | F
F → ( E ) | id`,
    2: `S → A a | b
A → c`
  }

  grammarInput.value = examples[exampleId as keyof typeof examples] || ''
  analysisResult.value = null
}

// 分析文法
const analyzeGrammar = async () => {
  if (!grammarInput.value.trim()) return

  isAnalyzing.value = true
  analysisResult.value = null

  try {
    // 处理输入的产生式
    const productions = grammarInput.value
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => line.replace(/\s*->\s*/, ' → '))

    const result = await slr1API.analyseGrammar(productions)

    analysisResult.value = {
      success: true,
      message: 'SLR1文法分析完成，可以进行下一步',
      data: result.data
    }

    // 保存分析结果供其他步骤使用
    localStorage.setItem('slr1-analysis-result', JSON.stringify(result.data))

  } catch (error: any) {
    analysisResult.value = {
      success: false,
      message: error.message || 'SLR1文法分析失败，请检查输入格式',
      data: null
    }
    console.error('Grammar analysis error:', error)
  } finally {
    isAnalyzing.value = false
  }
}

const nextStep = () => {
  if (isStepComplete.value) {
    emit('next-step')
  }
}
</script>

<style scoped>
.step-header { padding: 2rem 2rem 1rem; border-bottom: 1px solid #e5e7eb; }
.step-icon { width: 3rem; height: 3rem; background: #fce7f3; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; }
.step-content { padding: 2rem; }
.step-actions { padding: 1rem 2rem 2rem; border-top: 1px solid #e5e7eb; background: #f9fafb; }
</style>
