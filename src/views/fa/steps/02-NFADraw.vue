<template>
  <div class="nfa-draw-step">
    <!-- 步骤头部 -->
    <div class="step-header">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="step-icon">
            <Icon icon="lucide:git-branch" class="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 class="text-2xl font-bold text-gray-900">构造 NFA (Thompson 构造法)</h2>
            <p class="text-gray-600 mt-1">
              第二步：使用 Thompson 构造法将正则表达式转换为非确定有限自动机
            </p>
          </div>
        </div>
        <div class="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded">
          正则表达式: <code class="font-mono">{{ faStore.inputRegex }}</code>
        </div>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="step-content">
      <div class="space-y-6">
        <!-- 上方：用户画图区域 -->
        <div class="user-draw-area">
          <div class="bg-white border border-gray-200 rounded-lg">
            <!-- 用户画布 -->
            <div class="h-[700px] p-4">
              <FACanvas ref="userCanvasRef" mode="nfa" :readonly="false" />
            </div>
          </div>

          <!-- 画图提示 -->
          <div class="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex items-start gap-3">
              <Icon icon="lucide:lightbulb" class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 class="font-medium text-blue-800">绘制提示</h4>
                <ul class="text-sm text-blue-700 mt-2 space-y-1">
                  <li>• 使用 Thompson 构造法构造 NFA</li>
                  <li>• 为每个基本符号创建状态和转换</li>
                  <li>• 处理连接、选择和闭包操作</li>
                  <li>• 确保有明确的初始状态和接受状态</li>
                </ul>
              </div>
            </div>
            <!-- 集成ThompsonRules可视化 -->
            <!-- <div class="mt-6">
              <ThompsonRules />
            </div> -->
          </div>
        </div>

        <!-- 下方：答案区域 -->
        <div class="answer-area">
          <div class="bg-white border border-gray-200 rounded-lg">
            <!-- 答案区域头部 -->
            <div class="border-b border-gray-200 p-4">
              <div class="flex items-center justify-between">
                <h3 class="font-semibold text-gray-900">标准答案</h3>
                <button
                  @click="toggleAnswer"
                  :class="[
                    'px-4 py-2 rounded-lg transition-colors',
                    showAnswer
                      ? 'bg-gray-600 text-white hover:bg-gray-700'
                      : 'bg-green-600 text-white hover:bg-green-700',
                  ]"
                >
                  <Icon
                    :icon="showAnswer ? 'lucide:eye-off' : 'lucide:eye'"
                    class="w-4 h-4 inline mr-2"
                  />
                  {{ showAnswer ? '隐藏答案' : '查看答案' }}
                </button>
              </div>
            </div>

            <!-- 答案内容 -->
            <div class="h-80 p-4">
              <div v-if="!showAnswer" class="h-full flex items-center justify-center">
                <div class="text-center text-gray-500">
                  <Icon icon="lucide:lock" class="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p class="text-lg font-medium">答案已隐藏</p>
                  <p class="text-sm mt-1">完成你的绘制后点击"查看答案"按钮</p>
                </div>
              </div>

              <!-- 固定的SVG容器，避免条件渲染导致DOM销毁 -->
              <div
                v-else
                ref="answerSvgContainer"
                class="h-full w-full flex items-center justify-center bg-gray-50 rounded"
              >
                <!-- SVG内容将直接渲染到这里，不会被状态变化影响 -->
              </div>
            </div>

            <!-- 答案分析 -->
            <div v-if="showAnswer && hasNFAData" class="border-t border-gray-200 bg-green-50 p-4">
              <div class="flex items-start gap-3">
                <Icon
                  icon="lucide:check-circle"
                  class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
                />
                <div>
                  <h4 class="font-medium text-green-800">NFA 构造分析</h4>
                  <div class="text-sm text-green-700 mt-2 space-y-1">
                    <p>
                      • 正则表达式:
                      <code class="font-mono bg-white px-1 rounded">{{ faStore.inputRegex }}</code>
                    </p>
                    <p>• NFA 构造完成</p>
                    <p>• 使用 Thompson 构造法生成</p>
                    <p>• 可进行下一步 NFA → DFA 转换</p>
                  </div>
                </div>
              </div>
            </div>
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

        <div class="text-sm text-gray-500">步骤 2 / 6</div>

        <button
          @click="proceedToNext"
          :disabled="!isConstructionComplete"
          :class="[
            'px-6 py-2 rounded-lg transition-colors',
            isConstructionComplete
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
import { ref, computed, onMounted, nextTick } from 'vue'
import { Icon } from '@iconify/vue'
import FACanvas from '@/components/flow/canvas/FACanvas.vue'
import { useFAStore } from '@/stores'
import { instance } from '@viz-js/viz'

const emit = defineEmits<{
  'next-step': []
  'prev-step': []
  complete: [data: any]
}>()

// 使用 FA Store
const faStore = useFAStore()

// 本地状态
const showAnswer = ref(false)
const userCanvasRef = ref<InstanceType<typeof FACanvas>>()
const answerSvgContainer = ref<HTMLElement>()

// 计算属性
const nfaDotString = computed(() => faStore.nfaDotString)
const hasNFAData = computed(() => faStore.hasResult())

// 是否构造完成（用户查看答案后就可以进行下一步）
const isConstructionComplete = computed(() => {
  return (
    showAnswer.value || (userCanvasRef.value?.getNodes && userCanvasRef.value.getNodes().length > 0)
  )
})

// 组件初始化
onMounted(() => {
  if (!hasNFAData.value) {
    console.warn('No FA data found, please complete step 1 first')
  }
})

// 答案控制 - 采用06的正确方式
const toggleAnswer = async () => {
  showAnswer.value = !showAnswer.value

  if (showAnswer.value && nfaDotString.value) {
    await nextTick()
    renderSvgAnswer()
  }
}

// 渲染SVG答案 - 每次显示都重新渲染
const renderSvgAnswer = async () => {
  if (!answerSvgContainer.value || !nfaDotString.value) return

  try {
    // 使用 viz.js 渲染 DOT 字符串
    const viz = await instance()
    const svg = viz.renderSVGElement(nfaDotString.value)

    // 清空容器并添加SVG
    answerSvgContainer.value.innerHTML = ''
    if (svg) {
      svg.classList.add('nfa-svg')
      answerSvgContainer.value.appendChild(svg)
    }
  } catch (error) {
    console.error('NFA render failed:', error)
    if (answerSvgContainer.value) {
      answerSvgContainer.value.innerHTML = `
        <div class="flex items-center justify-center h-full text-red-500">
          <div class="text-center">
            <Icon icon="lucide:alert-circle" class="w-8 h-8 mx-auto mb-2" />
            <p>渲染失败</p>
            <p class="text-sm mt-1">${error instanceof Error ? error.message : String(error)}</p>
          </div>
        </div>
      `
    }
  }
}

// 进入下一步
const proceedToNext = () => {
  if (!isConstructionComplete.value) return

  const stepData = {
    nfa: {
      userDraw: {
        nodes: userCanvasRef.value?.getNodes() || [],
        edges: userCanvasRef.value?.getEdges() || [],
      },
      timestamp: new Date().toISOString(),
    },
  }

  emit('complete', stepData)
  emit('next-step')
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
  background: #f3e8ff;
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

/* NFA SVG 样式 */
:deep(.nfa-svg) {
  max-width: 100%;
  max-height: 100%;
  height: auto;
  width: auto;
}
</style>
