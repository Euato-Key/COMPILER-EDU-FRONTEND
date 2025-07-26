<template>
  <div class="item-set-construction-step">
    <div class="step-header">
      <div class="flex items-center gap-4">
        <div class="step-icon">
          <Icon icon="lucide:git-merge" class="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-900">画DFA</h2>
          <p class="text-gray-600 mt-1">第三步：构造LR0项目集规范族DFA</p>
        </div>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="step-content">
      <div class="space-y-6">
        <!-- 文法参考区域 -->
        <div class="grammar-reference">
          <div class="bg-white border border-gray-200 rounded-lg">
            <div class="border-b border-gray-200 p-4">
              <h3 class="font-semibold text-gray-900 flex items-center gap-2">
                <Icon icon="lucide:file-text" class="w-5 h-5 text-purple-600" />
                增广文法参考（来自第二步）
              </h3>
              <p class="text-sm text-gray-600 mt-1">根据这些产生式构造LR0项目集</p>
            </div>
            <div class="p-6">
              <div v-if="grammarInfo" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span class="font-medium text-gray-700">开始符号：</span>
                    <span class="text-purple-600 font-mono">{{ grammarInfo.startSymbol }}</span>
                  </div>
                  <div>
                    <span class="font-medium text-gray-700">产生式数量：</span>
                    <span class="text-purple-600">{{ grammarInfo.productions?.length || 0 }}</span>
                  </div>
                </div>

                <!-- 编号产生式 -->
                <div v-if="grammarInfo.productions?.length" class="mt-4">
                  <h4 class="font-medium text-gray-800 mb-3">编号产生式</h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    <div
                      v-for="(production, index) in grammarInfo.productions"
                      :key="index"
                      class="flex items-center space-x-2 p-2 rounded"
                      :class="index === 0 ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50 border border-gray-200'"
                    >
                      <span
                        class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                        :class="index === 0 ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-200 text-gray-700'"
                      >
                        {{ index }}
                      </span>
                      <span class="font-mono text-sm">{{ production }}</span>
                      <span v-if="index === 0" class="text-xs text-yellow-600">(增广)</span>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-8 text-gray-500">
                <Icon icon="lucide:arrow-left" class="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>暂无文法数据</p>
                <p class="text-sm mt-1">请先完成前面的步骤</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 用户画图区域 -->
        <div class="user-draw-area">
          <div class="bg-white border border-gray-200 rounded-lg">
            <!-- 用户画布 -->
            <div class="h-[700px]">
              <LRCanvas ref="canvasRef" />
            </div>
          </div>

          <!-- 构造提示 -->
          <div class="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex items-start gap-3">
              <Icon icon="lucide:lightbulb" class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 class="font-medium text-blue-800">构造提示</h4>
                <ul class="text-sm text-blue-700 mt-2 space-y-1">
                  <li>• 从增广文法的初始项目 [S' -> .S] 开始构造 I₀</li>
                  <li>• 使用 CLOSURE 函数求闭包，添加所有相关项目</li>
                  <li>• 使用 GOTO 函数计算状态转移</li>
                  <li>• 继续构造直到没有新的项目集产生</li>
                  <li>• 确保所有项目集和转移关系都正确标记</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- 答案区域 -->
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
                    showAnswerFlag
                      ? 'bg-gray-600 text-white hover:bg-gray-700'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  ]"
                >
                  <Icon
                    :icon="showAnswerFlag ? 'lucide:eye-off' : 'lucide:eye'"
                    class="w-4 h-4 inline mr-2"
                  />
                  {{ showAnswerFlag ? '隐藏答案' : '查看答案' }}
                </button>
              </div>
            </div>

            <!-- 答案内容 -->
            <div class="h-80 p-4">
              <div v-if="!showAnswerFlag" class="h-full flex items-center justify-center">
                <div class="text-center text-gray-500">
                  <Icon icon="lucide:lock" class="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p class="text-lg font-medium">答案已隐藏</p>
                  <p class="text-sm mt-1">完成你的构造后点击"查看答案"按钮</p>
                </div>
              </div>

              <div v-else class="h-full">
                <!-- 答案DFA -->
                <div class="h-full">
                  <div
                    ref="answerCanvasContainer"
                    class="h-full w-full flex items-center justify-center bg-gray-50 rounded"
                  >
                    <div class="text-center text-gray-600">
                      <Icon icon="lucide:diagram-project" class="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <p>LR0项目集规范族DFA</p>
                      <p class="text-sm mt-2">标准答案将在这里显示</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 答案分析 -->
            <div v-if="showAnswerFlag" class="border-t border-gray-200 bg-green-50 p-4">
              <div class="flex items-start gap-3">
                <Icon icon="lucide:check-circle" class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 class="font-medium text-green-800">LR0项目集规范族构造分析</h4>
                  <div class="text-sm text-green-700 mt-2 space-y-1">
                    <p>• 项目集数量: {{ answerData?.itemSets?.length || 0 }}</p>
                    <p>• 转移关系数量: {{ answerData?.transitions?.length || 0 }}</p>
                    <p>• GOTO函数构造完成</p>
                    <p>• 可进行下一步LR0分析表构建</p>
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

        <div class="text-sm text-gray-500">
          步骤 3 / 5
        </div>

        <button
          @click="proceedToNext"
          class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
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
import LRCanvas from '@/components/flow/canvas/LRCanvas.vue'

const emit = defineEmits<{
  'next-step': []
  'prev-step': []
  'complete': [data: any]
}>()

// 从上一步获取数据
const grammarInfo = ref<{
  startSymbol: string
  productions: string[]
} | null>(null)

// 答案显示控制
const showAnswerFlag = ref(false)

// 画布相关
const canvasRef = ref<InstanceType<typeof LRCanvas>>()
const answerCanvasContainer = ref<HTMLElement>()

// 答案数据
const answerData = ref<any>(null)

// 从localStorage获取上一步的数据
onMounted(() => {
  try {
    const savedData = localStorage.getItem('lr0-step2-data')
    if (savedData) {
      const stepData = JSON.parse(savedData)
      grammarInfo.value = {
        startSymbol: stepData.newStartSymbol || "S'",
        productions: stepData.augmentedProductions || []
      }

      console.log('Step 3 loaded data:', stepData)
    }
  } catch (error) {
    console.error('读取上一步数据失败：', error)
  }
})

// 答案控制
const toggleAnswer = () => {
  showAnswerFlag.value = !showAnswerFlag.value
}

// 是否构造完成 - 简化逻辑，允许用户直接进入下一步
const isConstructionComplete = computed(() => {
  return true // 允许用户随时进入下一步
})

// 进入下一步
const proceedToNext = () => {
  // 从画布获取用户绘制的数据
  const nodes = canvasRef.value?.getNodes() || []
  const edges = canvasRef.value?.getEdges() || []

  const stepData = {
    userNodes: nodes,
    userEdges: edges,
    itemSetsCount: nodes.length,
    transitionsCount: edges.length,
    timestamp: new Date().toISOString()
  }

  // 保存数据
  localStorage.setItem('lr0-step3-data', JSON.stringify(stepData))
  console.log('Step 3 saved data:', stepData)

  // 触发下一步事件 - 使用正确的Vue emit
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

.step-content {
  animation: fadeInUp 0.6s ease-out;
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
</style>
