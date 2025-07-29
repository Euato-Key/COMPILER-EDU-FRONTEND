<template>
  <div class="grammar-input-step">
    <div class="step-header">
      <div class="flex items-center gap-4">
        <div class="step-icon">
          <Icon icon="lucide:edit-3" class="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-900">文法输入</h2>
          <p class="text-gray-600 mt-1">第一步：输入LR0文法并进行预处理验证</p>
        </div>
      </div>
    </div>

    <div class="step-content">
      <!-- 说明区域 -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <div class="flex items-start">
          <Icon icon="lucide:info" class="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
          <div>
            <h3 class="text-lg font-semibold text-blue-900 mb-2">LR0文法输入格式</h3>
            <ul class="space-y-1 text-sm text-blue-800">
              <li>• 每行一个产生式，格式：A -> αβγ</li>
              <li>• 左侧为非终结符，右侧为产生式体</li>
              <li>• 使用 -> 表示产生</li>
              <li>• 使用 | 表示或者关系</li>
              <li>• 使用 ε 或 epsilon 表示空串</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 文法输入区域 -->
      <div class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"> 输入LR0文法产生式 </label>
          <textarea
            v-model="grammarInput"
            placeholder="请输入文法产生式，例如：&#10;S -> aAb&#10;A -> c&#10;A -> ε"
            :class="[
              'w-full h-40 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm transition-colors',
              lr0Store.validationErrors.length > 0
                ? 'border-red-300 focus:border-red-500 bg-red-50'
                : lr0Store.isValidGrammar === true
                  ? 'border-green-300 focus:border-green-500 bg-green-50'
                  : 'border-gray-300 focus:border-blue-500',
            ]"
            @input="onInputChange"
          ></textarea>
        </div>

        <!-- 示例文法 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="flex flex-col">
            <h4 class="font-medium text-gray-900 mb-2">示例文法1</h4>
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-3 flex-1 flex flex-col">
              <pre class="text-xs font-mono text-gray-700 flex-1">
S -> Aa
A -> BD
B -> b
D -> d
</pre>
              <button
                @click="loadExample(1)"
                class="mt-2 text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                使用此示例
              </button>
            </div>
          </div>

          <div class="flex flex-col">
            <h4 class="font-medium text-gray-900 mb-2">示例文法2</h4>
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-3 flex-1 flex flex-col">
              <pre class="text-xs font-mono text-gray-700 flex-1">
S -> BB
B -> aB
B -> b
</pre>
              <button
                @click="loadExample(2)"
                class="mt-2 text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                使用此示例
              </button>
            </div>
          </div>

          <div class="flex flex-col">
            <h4 class="font-medium text-gray-900 mb-2">示例文法3</h4>
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-3 flex-1 flex flex-col">
              <pre class="text-xs font-mono text-gray-700 flex-1">
S -> aSd
S -> bAc
A -> e
A -> f
</pre>
              <button
                @click="loadExample(3)"
                class="mt-2 text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                使用此示例
              </button>
            </div>
          </div>

          <div class="flex flex-col">
            <h4 class="font-medium text-gray-900 mb-2">示例文法4</h4>
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-3 flex-1 flex flex-col">
              <pre class="text-xs font-mono text-gray-700 flex-1">
S -> aX
S -> bY
X -> c
X -> dS
Y -> c
Y -> eS
</pre>
              <button
                @click="loadExample(4)"
                class="mt-2 text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                使用此示例
              </button>
            </div>
          </div>
        </div>

        <!-- 校验错误显示 -->
        <div v-if="lr0Store.validationErrors.length > 0" class="mt-4">
          <div class="bg-red-50 border border-red-200 rounded-lg p-4">
            <div class="flex items-start">
              <Icon icon="lucide:alert-circle" class="w-5 h-5 text-red-600 mt-0.5 mr-3" />
              <div>
                <h4 class="text-sm font-medium text-red-900 mb-2">输入校验错误</h4>
                <ul class="text-sm text-red-800 space-y-1">
                  <li v-for="error in lr0Store.validationErrors" :key="error">• {{ error }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- 校验警告显示 -->
        <div v-if="lr0Store.validationWarnings.length > 0" class="mt-4">
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div class="flex items-start">
              <Icon icon="lucide:alert-triangle" class="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
              <div>
                <h4 class="text-sm font-medium text-yellow-900 mb-2">警告</h4>
                <ul class="text-sm text-yellow-800 space-y-1">
                  <li v-for="warning in lr0Store.validationWarnings" :key="warning">
                    • {{ warning }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- 分析按钮 -->
        <div class="flex justify-center">
          <button
            @click="analyzeGrammar"
            :disabled="!grammarInput.trim()"
            class="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <Icon icon="lucide:play" class="w-4 h-4 inline mr-2" />
            分析文法
          </button>
        </div>

        <!-- 分析结果 -->
        <transition name="slide-fade" mode="out-in">
          <div v-if="analysisResult" class="mt-6">
            <div
              :class="[
                'p-4 rounded-lg border transition-all duration-200',
                analysisResult.success
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : analysisResult.hasConflicts
                    ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
                    : 'bg-red-50 border-red-200 text-red-800',
              ]"
            >
              <div class="flex items-start gap-2">
                <Icon
                  :icon="
                    analysisResult.success
                      ? 'lucide:check-circle'
                      : analysisResult.hasConflicts
                        ? 'lucide:alert-triangle'
                        : 'lucide:alert-circle'
                  "
                  class="w-5 h-5 mt-0.5 flex-shrink-0"
                />
                <div class="flex-1">
                  <p class="font-medium">
                    {{
                      analysisResult.success
                        ? '文法分析成功'
                        : analysisResult.hasConflicts
                          ? '文法分析完成（存在冲突）'
                          : '文法分析失败'
                    }}
                  </p>
                  <p class="text-sm mt-1">{{ analysisResult.message }}</p>

                  <!-- 成功或有冲突时显示文法信息 -->
                  <div
                    v-if="
                      (analysisResult.success || analysisResult.hasConflicts) && analysisResult.data
                    "
                    class="mt-4 space-y-3"
                  >
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span class="font-medium">开始符号：</span>{{ analysisResult.data.S }}
                      </div>
                      <div>
                        <span class="font-medium">非终结符：</span
                        >{{ analysisResult.data.Vn?.join(', ') }}
                      </div>
                      <div>
                        <span class="font-medium">终结符：</span
                        >{{ analysisResult.data.Vt?.join(', ') }}
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
        </transition>
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
              ? 'bg-blue-600 text-white hover:bg-blue-700'
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
import { ref, computed, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useLR0Store } from '@/stores/lr0'
import { useCommonStore } from '@/stores/common'

const emit = defineEmits<{
  'next-step': []
  'prev-step': []
}>()

const lr0Store = useLR0Store()
const commonStore = useCommonStore()

// 组件状态
const grammarInput = ref('')

// 从store获取状态
const analysisResult = computed(() => {
  if (lr0Store.analysisResult) {
    const hasConflicts = !lr0Store.isLR0Grammar
    return {
      success: !hasConflicts,
      hasConflicts: hasConflicts,
      message: hasConflicts
        ? '文法存在冲突，不是LR0文法。后续功能不支持有冲突的文法。'
        : '文法分析完成，符合LR0文法！',
      data: lr0Store.analysisResult,
    }
  }
  if (commonStore.error) {
    return {
      success: false,
      hasConflicts: false,
      message: commonStore.error,
      data: null,
    }
  }
  return null
})

// 步骤完成状态 - 只有真正的LR0文法才能进入下一步
const isStepComplete = computed(() => lr0Store.analysisResult && lr0Store.isLR0Grammar === true)

// 组件挂载时加载持久化数据
onMounted(() => {
  // 从store加载持久化的产生式
  if (lr0Store.productions.length > 0) {
    grammarInput.value = lr0Store.productions.join('\n')
  }
})

// 输入变化处理 - 添加实时校验
const onInputChange = () => {
  // 清除错误状态
  commonStore.clearError()

  // 实时校验（使用防抖）
  if (grammarInput.value.trim()) {
    // 简单的实时格式检查
    const lines = grammarInput.value.split('\n').filter((line) => line.trim())
    const hasFormatError = lines.some((line) => {
      const cleanLine = line.replace(/\s+/g, '')
      return cleanLine && !cleanLine.match(/^[A-Z]->.+$/)
    })

    if (hasFormatError) {
      lr0Store.validationErrors = ['产生式格式不正确，应为 "A->abc" 的形式']
    } else {
      lr0Store.validationErrors = []
    }
  } else {
    lr0Store.validationErrors = []
  }
}

// 加载示例文法
const loadExample = (exampleId: number) => {
  const examples = {
    1: [
      'S -> Aa',
      'A -> BD',
      'B -> b',
      'D -> d'
    ].join('\n'),
    2: [
      'S -> BB',
      'B -> aB',
      'B -> b'
    ].join('\n'),
    3: [
      'S -> aSd',
      'S -> bAc',
      'A -> e',
      'A -> f'
    ].join('\n'),
    4: [
      'S -> aX',
      'S -> bY',
      'X -> c',
      'X -> dS',
      'Y -> c',
      'Y -> eS'
    ].join('\n'),
  }

  grammarInput.value = examples[exampleId as keyof typeof examples] || ''
  commonStore.clearError()
}

// 分析文法 - 使用新的校验功能
const analyzeGrammar = async () => {
  if (!grammarInput.value.trim()) return

  try {
    // 使用新的校验和分析方法
    const success = await lr0Store.performLR0AnalysisFromText(grammarInput.value)

    if (success) {
      console.log('LR0 analysis completed successfully')
    } else {
      console.error('LR0 analysis failed - validation errors or analysis issues')
    }
  } catch (error: unknown) {
    console.error('Grammar analysis error:', error)
    const errorMessage = error instanceof Error ? error.message : '文法分析失败，请检查输入格式'
    commonStore.setError(errorMessage)
  }
}

const nextStep = () => {
  if (isStepComplete.value) {
    emit('next-step')
  }
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
  background: #dbeafe;
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

/* 平滑过渡效果 */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.2s ease-out;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
