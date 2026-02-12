<!-- COMPILER-EDU-FRONTEND\src\views\fa\index.vue -->
<template>
  <div class="fa-layout min-h-screen theme-main-bg theme-transition">
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
            <h1 class="text-xl font-semibold text-gray-800">有限自动机 (FA)</h1>
            
            <!-- 新增：状态显示栏 -->
            <div class="hidden md:flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg border border-gray-200 text-xs">
              <div class="flex items-center gap-1">
                <span class="text-gray-500">ID:</span>
                <span v-if="faStore.currentRecordId" class="font-mono text-blue-600 font-bold">
                  {{ faStore.currentRecordId }}
                </span>
                <span v-else class="text-green-600 font-bold">新会话</span>
              </div>
              <span class="text-gray-300">|</span>
              <div class="flex items-center gap-1 max-w-[200px]">
                <span class="text-gray-500">正则:</span>
                <span v-if="faStore.inputRegex" class="font-mono text-gray-900 truncate" :title="faStore.inputRegex">
                  {{ faStore.inputRegex }}
                </span>
                <span v-else class="text-gray-400 italic">未设置</span>
              </div>
            </div>
          </div>
          
          <div class="flex items-center gap-2">
            <ThemeSelector />
            <router-link
              to="/record/fa"
              class="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1"
            >
              <Icon icon="lucide:history" class="w-4 h-4" />
              答题记录
            </router-link>
            <button
              @click="resetProgress"
              class="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1"
            >
              <span class="text-lg">+</span> 新建答题
            </button>
            <router-link
              to="/ll1"
              class="px-4 py-2 text-sm theme-btn-primary rounded-lg hover:opacity-90 transition-colors"
            >
              LL1分析 →
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="max-w-7xl mx-auto px-4 py-8">
      <!-- 流程图导航 -->
      <div class="mb-8">
        <StepFlowChart :steps="faSteps" :current-step="currentStep" @step-click="navigateToStep" />
      </div>

      <!-- 步骤内容 -->
      <div class="theme-content-bg rounded-xl shadow-lg overflow-hidden theme-transition">
        <Transition name="slide-fade" mode="out-in">
          <component
            :is="currentStepComponent"
            :key="currentStep"
            @next-step="nextStep"
            @prev-step="prevStep"
            @complete="onStepComplete"
          />
        </Transition>
      </div>
    </main>

    <!-- AI聊天组件 -->
    <AIChatWidget
      page-type="fa"
      :context="chatContext"
    />

    <!-- 返回顶部按钮 -->
    <ScrollToTop theme="blue" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
// 修改引入：使用新的 Store
import { useFAStoreNew, useFAChatStore } from '@/stores'
import StepFlowChart from '@/components/shared/StepFlowChart.vue'
import ScrollToTop from '@/components/shared/ScrollToTop.vue'
import ThemeSelector from '@/components/shared/ThemeSelector.vue'
import { AIChatWidget } from '@/components/ai'
import type { ChatContext } from '@/components/ai/types'

// 导入步骤组件
import RegexInput from './steps/01-RegexInput.vue'
import NFADraw from './steps/02-NFADraw.vue'
import SubsetConstruction from './steps/03-SubsetConstruction.vue'
import DFADraw from './steps/04-DFADraw.vue'
import DFAMinimization from './steps/05-DFAMinimization.vue'
import MinimizedDFADraw from './steps/06-MinimizedDFADraw.vue'

const router = useRouter()
const route = useRoute()

// 修改：使用新的 FA Store
const faStore = useFAStoreNew()

// 使用FA AI聊天store
const faChatStore = useFAChatStore()

// 聊天上下文
const chatContext = ref<ChatContext>({
  currentPage: 'fa',
  userInput: {},
  backendData: {},
  userAnswers: {},
  pageContext: '有限自动机学习页面'
})

// FA流程步骤定义
const faSteps = [
  {
    id: 1,
    name: '正则表达式',
    title: '正则表达式',
    description: '输入正则表达式',
    color: '#3B82F6',
    component: 'RegexInput',
  },
  {
    id: 2,
    name: '构造NFA',
    title: '非确定有限自动机',
    description: 'Thompson构造',
    color: '#8B5CF6',
    component: 'NFADraw',
  },
  {
    id: 3,
    name: '子集构造',
    title: '转换表和状态矩阵',
    description: '子集构造法',
    color: '#10B981',
    component: 'SubsetConstruction',
  },
  {
    id: 4,
    name: '构造DFA',
    title: '确定有限自动机',
    description: '转换构造',
    color: '#F59E0B',
    component: 'DFADraw',
  },
  {
    id: 5,
    name: 'DFA最小化',
    title: '最小化DFA',
    description: 'Hopcroft算法',
    color: '#EF4444',
    component: 'DFAMinimization',
  },
  {
    id: 6,
    name: '最小化结果',
    title: '最小化DFA图',
    description: '可视化绘制',
    color: '#6366F1',
    component: 'MinimizedDFADraw',
  },
]

// 组件映射
const componentMap = {
  RegexInput,
  NFADraw,
  SubsetConstruction,
  DFADraw,
  DFAMinimization,
  MinimizedDFADraw,
}

// 当前步骤
const currentStep = ref(1)

// 计算当前步骤组件
const currentStepComponent = computed(() => {
  const step = faSteps.find((s) => s.id === currentStep.value)
  return step ? componentMap[step.component as keyof typeof componentMap] : RegexInput
})

// 导航到指定步骤
const navigateToStep = (stepId: number) => {
  currentStep.value = stepId
  router.push({ query: { step: stepId } })
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 下一步
const nextStep = () => {
  if (currentStep.value < faSteps.length) {
    navigateToStep(currentStep.value + 1)
  }
}

// 上一步
const prevStep = () => {
  if (currentStep.value > 1) {
    navigateToStep(currentStep.value - 1)
  }
}

// 步骤完成回调
const onStepComplete = (data: Record<string, unknown>) => {
  console.log('Step completed:', currentStep.value, data)
  updateChatContext()
}

// 重置进度 (新建答题)
const resetProgress = () => {
  if (confirm('确定要新建答题吗？这将清空当前进度并开始一个新的会话。')) {
    faStore.resetAll() // 这会清空数据并将 currentRecordId 置为 null
    navigateToStep(1)
    faChatStore.clearChat()
    updateChatContext()
  }
}

// 更新聊天上下文
const updateChatContext = () => {
  // 直接使用 Store 中的方法构建 AI 上下文
  const aiContext = faStore.buildAIContext(currentStep.value)

  // 转换为 ChatContext 格式 - 完整传递所有上下文信息
  chatContext.value = {
    currentPage: 'fa',
    recordId: aiContext.recordId,
    currentStep: currentStep.value,
    stepName: faSteps[currentStep.value - 1]?.name || '',
    userInput: {
      ...aiContext.userInput,
      currentStep: currentStep.value,
      stepName: faSteps[currentStep.value - 1]?.name || '',
    },
    backendData: aiContext.backendData,
    userAnswers: aiContext.userAnswers,
    correctAnswers: aiContext.correctAnswers,
    errorLogs: aiContext.errorLogs,
    pageContext: `有限自动机 - ${faSteps[currentStep.value - 1]?.name || ''}`,
  }
  faChatStore.updateContext(chatContext.value)
}

// 使用 $subscribe 监听 Pinia store 的所有变化
faStore.$subscribe((mutation, state) => {
  updateChatContext()
})

// 监听当前步骤变化
watch(currentStep, () => {
  updateChatContext()
})

// 组件挂载时从路由获取步骤
onMounted(() => {
  const step = Number(route.query.step) || 1
  if (step >= 1 && step <= faSteps.length) {
    currentStep.value = step
  }
  updateChatContext()
})

onUnmounted(() => {
  // FA数据会保留在store中
})
</script>

<style scoped>
/* 页面切换动画 */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease-out;
}

.slide-fade-enter-from {
  transform: translateX(20px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}
</style>
