<template>
  <div class="item-set-construction-step">
    <div class="step-header">
      <div class="flex items-center gap-4">
        <div class="step-icon">
          <Icon icon="lucide:git-merge" class="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-900">画DFA</h2>
          <p class="text-gray-600 mt-1">第三步：构造SLR1项目集规范族DFA</p>
        </div>
      </div>
    </div>

    <!-- 操作说明 -->
    <div class="bg-purple-50 border border-purple-200 rounded-lg p-4 mx-6 mt-4">
      <h3 class="text-lg font-semibold text-purple-800 mb-3">操作流程</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-700">
        <div>
          <h4 class="font-medium mb-2">1. 项目集管理：</h4>
          <ul class="space-y-1">
            <li>• 双击画布空白处创建新项目集</li>
            <li>• 点击"添加项目集"按钮手动添加</li>
            <li>• 点击项目集节点可编辑LR项目内容</li>
          </ul>
        </div>
        <div>
          <h4 class="font-medium mb-2">2. 转移关系：</h4>
          <ul class="space-y-1">
            <li>• 拖拽节点连接创建转移边</li>
            <li>• 选择两个节点后点击"连接项目集"</li>
            <li>• 点击边可编辑转移符号</li>
          </ul>
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
              <p class="text-sm text-gray-600 mt-1">根据这些产生式构造SLR1项目集</p>
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
                      :class="
                        index === 0
                          ? 'bg-yellow-50 border border-yellow-200'
                          : 'bg-gray-50 border border-gray-200'
                      "
                    >
                      <span
                        class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                        :class="
                          index === 0
                            ? 'bg-yellow-200 text-yellow-800'
                            : 'bg-gray-200 text-gray-700'
                        "
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
            <div class="h-[700px] p-4">
              <SLR1DrawDFA :check_DFA="slr1Store.dfaStates as any" @open_step4="onStep4Open" />
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
                    : 'bg-green-600 text-white hover:bg-green-700',
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
          <div class="h-120 p-4">
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
                  class="h-full flex items-center justify-center bg-gray-50 rounded"
                >
                </div>
              </div>
            </div>
          </div>

          <!-- 答案分析 -->
            <div
              v-if="showAnswerFlag && hasDFAData"
              class="border-t border-gray-200 bg-green-50 p-4"
            >
            <div class="flex items-start gap-3">
              <Icon
                icon="lucide:check-circle"
                class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
              />
              <div>
                <h4 class="font-medium text-green-800">SLR1项目集规范族构造分析</h4>
                <div class="text-sm text-green-700 mt-2 space-y-1">
                  <p>• 项目集数量: {{ answerData?.itemSets?.length || 0 }}</p>
                  <p>• 转移关系数量: {{ answerData?.transitions?.length || 0 }}</p>
                  <p>• GOTO函数构造完成</p>
                  <p>• 可进行下一步SLR1分析表构建</p>
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

        <div class="text-sm text-gray-500">步骤 3 / 5</div>

        <button
          @click="proceedToNext"
          class="px-6 py-2 rounded-lg transition-colors bg-purple-600 text-white hover:bg-purple-700"
        >
          下一步
          <Icon icon="lucide:chevron-right" class="w-4 h-4 inline ml-2" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { Icon } from '@iconify/vue'
import SLR1DrawDFA from '@/components/lr/SLR1DrawDFA.vue'
import { useSLR1Store } from '@/stores/slr1'
import { instance } from '@viz-js/viz'

const emit = defineEmits<{
  'next-step': []
  'prev-step': []
  complete: [data: unknown]
}>()

const slr1Store = useSLR1Store()

// 本地状态
const showAnswerFlag = ref(false)
const hasRendered = ref(false) // 防重复渲染
const isStepComplete = ref(false)

// 画布相关
const answerCanvasContainer = ref<HTMLElement>()

// 计算属性
const slr1DotString = computed(() => slr1Store.dotString)
const hasDFAData = computed(() => slr1Store.analysisResult !== null && slr1Store.dotString !== '')

// 从store获取文法数据
const grammarInfo = computed(() => {
  if (slr1Store.analysisResult) {
    // 构造增广产生式
    const augmentedProductions = [
      `S' -> ${slr1Store.analysisResult.S}`,
      ...slr1Store.analysisResult.formulas_list,
    ]

    return {
      startSymbol: "S'",
      productions: augmentedProductions,
    }
  }
  return null
})

// 答案数据 - 从store获取
const answerData = computed(() => {
  if (slr1Store.dfaStates && slr1Store.dfaStates.length > 0) {
    return {
      itemSets: slr1Store.dfaStates,
      transitions: [], // 可以从dfaStates中提取转移关系
    }
  }
  return null
})

// 处理步骤4开启事件
const onStep4Open = () => {
      isStepComplete.value = true
  console.log('SLR1 DFA构造完成，可以进入下一步')
}

// 答案控制 - 参考LR0组件的SVG渲染实现
const toggleAnswer = async () => {
  showAnswerFlag.value = !showAnswerFlag.value

  if (showAnswerFlag.value && slr1DotString.value) {
    await nextTick()

    // 清理之前的内容
    if (answerCanvasContainer.value) {
      answerCanvasContainer.value.innerHTML = ''
    }

    // 重新渲染SVG
    if (answerCanvasContainer.value) {
      try {
        const viz = await instance()
        const svg = viz.renderSVGElement(slr1DotString.value)

        // 模仿FA组件：直接添加SVG，添加样式类
        svg.classList.add('slr1-dfa-svg')
        answerCanvasContainer.value.appendChild(svg)
        hasRendered.value = true
      } catch (error) {
        console.error('SLR1 DFA render failed:', error)
        // 简单错误处理：在容器中显示错误信息
        if (answerCanvasContainer.value) {
          answerCanvasContainer.value.innerHTML = `
            <div class="text-center text-red-500 p-4">
              <p>渲染失败: ${error instanceof Error ? error.message : String(error)}</p>
            </div>
          `
        }
      }
    }
  } else if (!showAnswerFlag.value) {
    // 隐藏答案时清理容器并重置渲染标志
    if (answerCanvasContainer.value) {
      answerCanvasContainer.value.innerHTML = ''
    }
    hasRendered.value = false
  }
}

// 进入下一步
const proceedToNext = () => {
  // 触发下一步事件
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

/* SLR1 DFA SVG 样式 */
:deep(.slr1-dfa-svg) {
  max-width: 100%;
  max-height: 100%;
  height: auto;
  width: auto;
}
</style>
