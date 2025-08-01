<template>
  <div class="item-set-construction-step">
    <div class="step-header">
      <div class="flex items-center gap-4">
        <div class="step-icon">
          <Icon icon="lucide:git-merge" class="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-900">构造DFA</h2>
          <p class="text-gray-600 mt-1">第三步：构造SLR1项目集规范族DFA</p>
        </div>
      </div>
    </div>

    <!-- 操作说明 -->
    <div class="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6 mx-6 mt-4 shadow-sm">
      <div class="flex items-start gap-4">
        <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <Icon icon="lucide:mouse-pointer-click" class="w-5 h-5 text-white" />
        </div>
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-purple-800 mb-3">操作指南</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-purple-700">
            <div class="space-y-2">
              <h4 class="font-medium text-purple-800 flex items-center gap-2">
                <Icon icon="lucide:circle-dot" class="w-4 h-4" />
                项目集管理
              </h4>
              <ul class="space-y-1 ml-6">
                <li>• 双击画布空白处创建新项目集</li>
                <li>• 点击项目集节点可编辑LR项目内容</li>
                <li>• 拖拽节点调整位置</li>
              </ul>
            </div>
            <div class="space-y-2">
              <h4 class="font-medium text-purple-800 flex items-center gap-2">
                <Icon icon="lucide:arrow-right-left" class="w-4 h-4" />
                转移关系
              </h4>
              <ul class="space-y-1 ml-6">
                <li>• 拖拽节点连接创建转移边</li>
                <li>• 点击边可编辑转移符号</li>
                <li>• 右键删除不需要的连接</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="step-content">
      <div class="space-y-6">
        <!-- 文法参考区域 -->
        <div class="grammar-reference">
          <div class="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl shadow-sm">
            <div class="border-b border-blue-200 p-5">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Icon icon="lucide:file-text" class="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 class="font-semibold text-blue-800 text-lg">增广文法参考</h3>
                  <p class="text-sm text-blue-600 mt-1">来自第二步的增广文法，用于构造SLR1项目集</p>
                </div>
              </div>
            </div>
            <div class="p-6">
              <div v-if="grammarInfo" class="space-y-5">
                <!-- 编号产生式 -->
                <div v-if="grammarInfo.productions?.length" class="mt-5">
                  <div class="flex items-center gap-2 mb-4">
                    <Icon icon="lucide:list-ordered" class="w-5 h-5 text-blue-600" />
                    <h4 class="font-semibold text-blue-800">编号产生式</h4>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div
                      v-for="(production, index) in grammarInfo.productions"
                      :key="index"
                      class="flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 hover:shadow-md"
                      :class="
                        index === 0
                          ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300 shadow-sm'
                          : 'bg-white border-blue-200 hover:border-blue-300'
                      "
                    >
                      <span
                        class="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shadow-sm"
                        :class="
                          index === 0
                            ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white'
                            : 'bg-gradient-to-br from-blue-400 to-indigo-500 text-white'
                        "
                      >
                        {{ index }}
                      </span>
                      <span class="font-mono text-sm flex-1">{{ production }}</span>
                      <span
                        v-if="index === 0"
                        class="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full font-medium"
                      >
                        增广
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-12 text-gray-500">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon icon="lucide:arrow-left" class="w-8 h-8 text-gray-400" />
                </div>
                <p class="text-lg font-medium text-gray-600">暂无文法数据</p>
                <p class="text-sm mt-2 text-gray-500">请先完成前面的步骤</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 用户画图区域 -->
        <div class="user-draw-area">
          <div class="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl shadow-sm">
            <div class="border-b border-green-200 p-5">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Icon icon="lucide:pencil" class="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 class="font-semibold text-green-800 text-lg">DFA构造画布</h3>
                  <p class="text-sm text-green-600 mt-1">在下方画布中构造SLR1项目集规范族DFA</p>
                </div>
              </div>
            </div>
            <!-- 用户画布 -->
            <div class="h-[700px] p-6">
              <SLR1DrawDFA :check_DFA="slr1Store.dfaStates as any" @open_step4="onStep4Open" />
            </div>
          </div>

          <!-- 构造提示 -->
          <div class="mt-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5 shadow-sm">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon icon="lucide:lightbulb" class="w-5 h-5 text-white" />
              </div>
              <div class="flex-1">
                <h4 class="font-semibold text-amber-800 text-lg mb-3">构造提示</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-amber-700">
                  <div class="space-y-2">
                    <h5 class="font-medium text-amber-800 flex items-center gap-2">
                      <Icon icon="lucide:circle-dot" class="w-4 h-4" />
                      初始构造
                    </h5>
                    <ul class="space-y-1 ml-6">
                      <li>• 从增广文法的初始项目 [S' -> .S] 开始构造 I₀</li>
                      <li>• 使用 CLOSURE 函数求闭包，添加所有相关项目</li>
                    </ul>
                  </div>
                  <div class="space-y-2">
                    <h5 class="font-medium text-amber-800 flex items-center gap-2">
                      <Icon icon="lucide:arrow-right-left" class="w-4 h-4" />
                      状态转移
                    </h5>
                    <ul class="space-y-1 ml-6">
                      <li>• 使用 GOTO 函数计算状态转移</li>
                      <li>• 继续构造直到没有新的项目集产生</li>
                      <li>• 确保所有项目集和转移关系都正确标记</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      <!-- 答案区域 -->
      <div class="answer-area">
        <div class="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl shadow-sm">
          <!-- 答案区域头部 -->
          <div class="border-b border-purple-200 p-5">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <Icon icon="lucide:check-square" class="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 class="font-semibold text-purple-800 text-lg">标准答案</h3>
                  <p class="text-sm text-purple-600 mt-1">查看正确的SLR1项目集规范族DFA</p>
                </div>
              </div>
              <button
                @click="toggleAnswer"
                :class="[
                  'px-6 py-3 rounded-lg transition-all duration-200 font-medium shadow-sm',
                  showAnswerFlag
                    ? 'bg-gradient-to-br from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700 hover:shadow-md'
                    : 'bg-gradient-to-br from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700 hover:shadow-md',
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
          <div class="h-120 p-6">
            <div v-if="!showAnswerFlag" class="h-full flex items-center justify-center">
              <div class="text-center text-purple-500">
                <div class="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon icon="lucide:lock" class="w-10 h-10 text-purple-400" />
                </div>
                <p class="text-xl font-semibold text-purple-700">答案已隐藏</p>
                <p class="text-sm mt-2 text-purple-600">完成你的构造后点击"查看答案"按钮</p>
              </div>
            </div>

            <div v-else class="h-full">
              <!-- 答案DFA -->
              <div class="h-full">
                <div
                  ref="answerCanvasContainer"
                  class="h-full w-full flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-lg border border-purple-200/50"
                >
                </div>
              </div>
            </div>
          </div>

          <!-- 答案分析 -->
            <div
              v-if="showAnswerFlag && hasDFAData"
              class="border-t border-purple-200 bg-gradient-to-br from-green-50 to-emerald-50 p-5"
            >
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon icon="lucide:check-circle" class="w-5 h-5 text-white" />
              </div>
              <div class="flex-1">
                <h4 class="font-semibold text-green-800 text-lg mb-3">SLR1项目集规范族构造分析</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-700">
                  <div class="space-y-2">
                    <div class="flex items-center gap-2">
                      <Icon icon="lucide:hash" class="w-4 h-4" />
                      <span>项目集数量: <span class="font-mono font-bold">{{ answerData?.itemSets?.length || 0 }}</span></span>
                    </div>
                    <div class="flex items-center gap-2">
                      <Icon icon="lucide:arrow-right-left" class="w-4 h-4" />
                      <span>转移关系数量: <span class="font-mono font-bold">{{ answerData?.transitions?.length || 0 }}</span></span>
                    </div>
                  </div>
                  <div class="space-y-2">
                    <div class="flex items-center gap-2">
                      <Icon icon="lucide:check" class="w-4 h-4" />
                      <span>GOTO函数构造完成</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <Icon icon="lucide:arrow-right" class="w-4 h-4" />
                      <span>可进行下一步SLR1分析表构建</span>
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

