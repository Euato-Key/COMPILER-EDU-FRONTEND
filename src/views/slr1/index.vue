<template>
  <div class="slr1-layout min-h-screen theme-main-bg theme-transition">
    <!-- 头部导航 -->
    <header class="theme-header-bg backdrop-blur-sm border-b sticky top-0 z-50 theme-transition">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <router-link
              to="/"
              class="text-2xl font-bold theme-header-text hover:opacity-80 transition-colors"
            >
              编译原理可视化
            </router-link>
            <span class="text-gray-400">|</span>
            <h1 class="text-xl font-semibold text-gray-800">SLR1 语法分析</h1>
          </div>
          <div class="flex items-center gap-2">
            <ThemeSelector />
            <button
              @click="resetProgress"
              class="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              重置进度
            </button>
            <router-link
              to="/fa"
              class="px-4 py-2 text-sm theme-btn-primary rounded-lg hover:opacity-90 transition-colors"
            >
              有限自动机 →
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="max-w-7xl mx-auto px-4 py-8">
      <!-- 流程图导航 -->
      <div class="mb-8">
        <StepFlowChart
          :steps="slr1Steps"
          :current-step="currentStep"
          @step-click="handleStepClick"
        />
      </div>

      <!-- 步骤内容 -->
      <div class="theme-content-bg rounded-xl shadow-lg overflow-hidden theme-transition">
        <Transition name="step-slide" mode="out-in">
          <component
            v-if="currentStepComponent"
            :is="currentStepComponent"
            :key="currentStep"
            @next-step="nextStep"
            @prev-step="prevStep"
            @complete="completeAnalysis"
          />
          <div v-else class="p-8 text-center text-gray-500">
            <Icon icon="lucide:loader-2" class="w-8 h-8 animate-spin mx-auto mb-4" />
            <p>加载中...</p>
          </div>
        </Transition>
      </div>
    </main>

    <!-- AI聊天组件 -->
    <AIChatWidget
      page-type="slr1"
      :context="chatContext"
    />

    <!-- 返回顶部按钮 -->
    <ScrollToTop theme="emerald" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, defineAsyncComponent, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import StepFlowChart from '@/components/shared/StepFlowChart.vue'
import ScrollToTop from '@/components/shared/ScrollToTop.vue'
import ThemeSelector from '@/components/shared/ThemeSelector.vue'
import { AIChatWidget } from '@/components/ai'
import { useSLR1Store } from '@/stores/slr1'
import { useSLR1ChatStore } from '@/stores'
import type { ChatContext } from '@/components/ai/types'

const slr1Store = useSLR1Store()

// 使用SLR1 AI聊天store
const slr1ChatStore = useSLR1ChatStore()

// 聊天上下文
const chatContext = ref<ChatContext>({
  currentPage: 'slr1',
  userInput: {},
  backendData: {},
  userAnswers: {},
  pageContext: 'SLR1语法分析学习页面'
})

// 动态导入所有步骤组件
const stepComponents = {
  GrammarInput: defineAsyncComponent(() => import('./steps/01-GrammarInput.vue')),
  AugmentedGrammar: defineAsyncComponent(() => import('./steps/02-AugmentedGrammar.vue')),
  ItemSetConstruction: defineAsyncComponent(() => import('./steps/03-ItemSetConstruction.vue')),
  SLR1TableBuild: defineAsyncComponent(() => import('./steps/04-SLR1TableBuild.vue')),
  StringAnalysis: defineAsyncComponent(() => import('./steps/05-StringAnalysis.vue')),
}

const slr1Steps = [
  {
    id: 1,
    name: '输入文法',
    title: '输入文法',
    key: 'GrammarInput',
    description: '输入SLR1文法并进行预处理',
    color: '#3b82f6',
    component: 'GrammarInput',
  },
  {
    id: 2,
    name: '写出增广文法',
    title: '写出增广文法',
    key: 'AugmentedGrammar',
    description: '构造增广文法并分解产生式',
    color: '#8b5cf6',
    component: 'AugmentedGrammar',
  },
  {
    id: 3,
    name: '画DFA',
    title: '画DFA',
    key: 'ItemSetConstruction',
    description: '构造LR0项目集规范族',
    color: '#10b981',
    component: 'ItemSetConstruction',
  },
  {
    id: 4,
    name: '构建SLR1分析表',
    title: '构建SLR1分析表',
    key: 'SLR1TableBuild',
    description: '构建SLR1分析表',
    color: '#f59e0b',
    component: 'SLR1TableBuild',
  },
  {
    id: 5,
    name: '分析输入串',
    title: '分析输入串',
    key: 'StringAnalysis',
    description: '使用SLR1分析表分析字符串',
    color: '#ef4444',
    component: 'StringAnalysis',
  },
]

const route = useRoute()
const router = useRouter()

// 根据路由参数初始化当前步骤
const initializeCurrentStep = () => {
  const stepParam = route.params.step as string
  if (stepParam) {
    const stepNumber = parseInt(stepParam)
    if (stepNumber >= 1 && stepNumber <= slr1Steps.length) {
      return stepNumber
    }
  }
  return 1
}

const currentStep = ref(initializeCurrentStep())

// 监听当前步骤变化
watch(currentStep, () => {
  updateChatContext()
})

// 监听路由变化
watch(
  () => route.params.step,
  (newStep) => {
    if (newStep) {
      const stepNumber = parseInt(newStep as string)
      if (stepNumber >= 1 && stepNumber <= slr1Steps.length) {
        currentStep.value = stepNumber
      }
    }
  },
)

const currentStepComponent = computed(() => {
  const step = slr1Steps.find((s) => s.id === currentStep.value)
  return step ? stepComponents[step.key as keyof typeof stepComponents] : null
})

const nextStep = () => {
  if (currentStep.value < slr1Steps.length) {
    const nextStepNum = currentStep.value + 1
    router.push(`/slr1/${nextStepNum}`)
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    const prevStepNum = currentStep.value - 1
    router.push(`/slr1/${prevStepNum}`)
  }
}

const handleStepClick = (stepId: number) => {
  router.push(`/slr1/${stepId}`)

  // 滚动到页面顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 更新聊天上下文
const updateChatContext = () => {
  // 获取SLR1 store中的数据
  const slr1Data = slr1Store

  // 更新聊天上下文
  chatContext.value = {
    currentPage: 'slr1',
    userInput: {
      productions: slr1Data.productions || [],
      currentStep: currentStep.value,
      stepName: slr1Steps[currentStep.value - 1]?.name || ''
    },
    backendData: {
      productions: slr1Data.productions || [],
      analysisResult: slr1Data.analysisResult || null,
      actionTable: slr1Data.actionTable || {},
      gotoTable: slr1Data.gotoTable || {},
      dfaStates: slr1Data.dfaStates || [],
      dotItems: slr1Data.dotItems || [],
      firstSets: slr1Data.firstSets || {},
      followSets: slr1Data.followSets || {},
      isSLR1Grammar: slr1Data.isSLR1Grammar || null
    },
    userAnswers: {},
    pageContext: `SLR1语法分析 - ${slr1Steps[currentStep.value - 1]?.name || ''}`
  }

  // 更新store中的上下文
  slr1ChatStore.updateContext(chatContext.value)
}

const completeAnalysis = (data: any) => {
  console.log('SLR1 Analysis completed:', data)
  // 更新聊天上下文
  updateChatContext()
}

const resetProgress = () => {
  router.push('/slr1/1')
  // 清空AI聊天上下文
  slr1ChatStore.clearChat()
  updateChatContext()
}

// 组件挂载时的初始化
onMounted(() => {
  // 初始化聊天上下文
  updateChatContext()
})
</script>

<style scoped>
/* 页面切换动画 */
.step-slide-enter-active,
.step-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.step-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.step-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* 按钮悬停效果 */
button:hover,
a:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .flex {
    flex-direction: column;
    gap: 1rem;
  }

  .text-2xl {
    font-size: 1.5rem;
  }
}
.step-slide-leave-active {
  transition: all 0.3s ease;
}

.step-slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.step-slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
