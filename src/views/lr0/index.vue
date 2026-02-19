<template>
  <div class="lr0-layout min-h-screen theme-main-bg theme-transition">
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
            <h1 class="text-xl font-semibold text-gray-800">LR0 语法分析</h1>

            <!-- 状态显示栏 -->
            <div v-if="lr0Store.productions.length" class="hidden md:flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg border border-gray-200 text-xs">
              <div class="flex items-center gap-1">
                <span class="text-gray-500">ID:</span>
                <span v-if="lr0Store.currentRecordId" class="font-mono text-blue-600 font-bold">
                  {{ lr0Store.currentRecordId }}
                </span>
                <span v-else class="text-green-600 font-bold">新会话</span>
              </div>
              <span class="text-gray-300">|</span>
              <div class="flex items-center gap-1 max-w-[300px]">
                <span class="text-gray-500">文法:</span>
                <span class="font-mono text-gray-900 truncate" :title="lr0Store.grammar">
                  {{ lr0Store.productions[0] }}{{ lr0Store.productions.length > 1 ? '...' : '' }}
                </span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <ThemeSelector />
            <router-link
              to="/record/lr0"
              class="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1"
            >
              <Icon icon="lucide:history" class="w-4 h-4" />
              历史记录
            </router-link>
            <router-link
              to="/statics"
              class="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1"
            >
              <Icon icon="lucide:bar-chart-2" class="w-4 h-4" />
              学习统计
            </router-link>
            <button
              @click="resetProgress"
              class="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1"
            >
              <span class="text-lg">+</span> 新建答题
            </button>
            <router-link
              to="/slr1"
              class="px-4 py-2 text-sm theme-btn-primary rounded-lg hover:opacity-90 transition-colors"
            >
              SLR1分析 →
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <!-- 错误提示 -->
    <div
      v-if="error"
      class="fixed top-20 right-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg shadow-lg z-50"
    >
      <div class="flex items-center gap-2">
        <Icon icon="lucide:alert-circle" class="w-5 h-5" />
        <span>{{ error }}</span>
        <button @click="clearError" class="ml-2 hover:bg-red-100 rounded p-1">
          <Icon icon="lucide:x" class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <main class="max-w-7xl mx-auto px-4 py-8">
      <!-- 流程图导航 -->
      <div class="mb-8">
        <StepFlowChart
          :steps="lr0Steps"
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
      page-type="lr0"
      :context="chatContext"
    />

    <!-- 返回顶部按钮 -->
    <ScrollToTop theme="purple" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, defineAsyncComponent, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { Icon } from '@iconify/vue'
import StepFlowChart from '@/components/shared/StepFlowChart.vue'
import ScrollToTop from '@/components/shared/ScrollToTop.vue'
import ThemeSelector from '@/components/shared/ThemeSelector.vue'
import { AIChatWidget } from '@/components/ai'
import { useLR0StoreNew, useCommonStore, useLR0ChatStore, buildLR0Context } from '@/stores'
import type { ChatContext } from '@/components/ai/types'

// 获取 Store 实例
const lr0Store = useLR0StoreNew()
const commonStore = useCommonStore()

// 立即尝试加载持久化数据
try {
  lr0Store.persistence.load()
} catch (err) {
  console.warn('Failed to load persisted data:', err)
}

// 使用LR0 AI聊天store
const lr0ChatStore = useLR0ChatStore()

// 聊天上下文
const chatContext = ref<ChatContext>({
  currentPage: 'lr0',
  userInput: {},
  backendData: {},
  userAnswers: {},
  pageContext: 'LR0语法分析学习页面'
})

// 解构响应式状态（用于模板绑定）
const { productions, originalData } = storeToRefs(lr0Store)
const { error } = storeToRefs(commonStore)

// 动态导入所有步骤组件
const stepComponents = {
  GrammarInput: defineAsyncComponent(() => import('./steps/01-GrammarInput.vue')),
  AugmentedGrammar: defineAsyncComponent(() => import('./steps/02-AugmentedGrammar.vue')),
  ItemSetConstruction: defineAsyncComponent(() => import('./steps/03-ItemSetConstruction.vue')),
  LR0TableBuild: defineAsyncComponent(() => import('./steps/04-LR0TableBuild.vue')),
  StringAnalysis: defineAsyncComponent(() => import('./steps/05-StringAnalysis.vue')),
}

const lr0Steps = [
  {
    id: 1,
    name: '文法输入',
    title: '文法输入',
    key: 'GrammarInput',
    description: '输入LR0文法并进行预处理',
    color: '#3b82f6',
    component: 'GrammarInput',
  },
  {
    id: 2,
    name: '增广文法',
    title: '增广文法',
    key: 'AugmentedGrammar',
    description: '写出增广文法和产生式编号',
    color: '#8b5cf6',
    component: 'AugmentedGrammar',
  },
  {
    id: 3,
    name: '画DFA',
    title: '画DFA',
    key: 'ItemSetConstruction',
    description: '构造LR0项目集规范族DFA',
    color: '#10b981',
    component: 'ItemSetConstruction',
  },
  {
    id: 4,
    name: 'LR0分析表',
    title: 'LR0分析表',
    key: 'LR0TableBuild',
    description: '构建LR0分析表',
    color: '#f59e0b',
    component: 'LR0TableBuild',
  },
  {
    id: 5,
    name: '分析输入串',
    title: '分析输入串',
    key: 'StringAnalysis',
    description: '使用LR0分析表分析输入串',
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
    if (stepNumber >= 1 && stepNumber <= lr0Steps.length) {
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
      if (stepNumber >= 1 && stepNumber <= lr0Steps.length) {
        currentStep.value = stepNumber
      }
    }
  },
)

const currentStepComponent = computed(() => {
  const step = lr0Steps.find((s) => s.id === currentStep.value)
  return step ? stepComponents[step.key as keyof typeof stepComponents] : null
})

const nextStep = () => {
  if (currentStep.value < lr0Steps.length) {
    const nextStepNum = currentStep.value + 1
    router.push(`/lr0/${nextStepNum}`)
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    const prevStepNum = currentStep.value - 1
    router.push(`/lr0/${prevStepNum}`)
  }
}

const handleStepClick = (stepId: number) => {
  router.push(`/lr0/${stepId}`)

  // 滚动到页面顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 更新聊天上下文
const updateChatContext = () => {
  // 直接使用 Store 中的方法构建 AI 上下文
  const aiContext = lr0Store.buildAIContext(currentStep.value)

  // 转换为 ChatContext 格式 - 完整传递所有上下文信息
  chatContext.value = {
    currentPage: 'lr0',
    recordId: aiContext.recordId,
    currentStep: currentStep.value,
    stepName: lr0Steps[currentStep.value - 1]?.name || '',
    userInput: {
      ...aiContext.userInput,
      currentStep: currentStep.value,
      stepName: lr0Steps[currentStep.value - 1]?.name || '',
    },
    backendData: aiContext.backendData,
    userAnswers: aiContext.userAnswers,
    correctAnswers: aiContext.correctAnswers,
    errorLogs: aiContext.errorLogs,
    pageContext: `LR0语法分析 - ${lr0Steps[currentStep.value - 1]?.name || ''}`,
  }

  // 更新store中的上下文
  lr0ChatStore.updateContext(chatContext.value)
}

const completeAnalysis = (data: any) => {
  console.log('LR0 Analysis completed:', data)
  // 更新聊天上下文
  updateChatContext()
}

// 清除错误
const clearError = () => {
  commonStore.clearError()
}

// === 核心逻辑：尝试恢复会话 ===
const isRecovering = ref(false)
const handleRecovery = async () => {
  if (isRecovering.value) return

  if (lr0Store.productions.length > 0 && !lr0Store.originalData) {
    isRecovering.value = true
    try {
      console.log('[LR0-RECOVERY] 检测到文法记录，正在静默恢复分析结果...', lr0Store.productions)
      const success = await lr0Store.performLR0Analysis(true)
      if (success) {
        console.log('[LR0-RECOVERY] 分析结果恢复成功')
        if (lr0Store.inputString) {
          await lr0Store.analyzeInputString()
        }
      }
    } catch (err) {
      console.error('[LR0-RECOVERY] 恢复失败:', err)
    } finally {
      isRecovering.value = false
      updateChatContext()
    }
  }
}

// 重置进度
const resetProgress = () => {
  if (confirm('确定要新建答题吗？这将清空当前所有进度。')) {
    lr0Store.resetAll()
    handleStepClick(1)
    // 清空AI聊天上下文
    lr0ChatStore.clearChat()
    updateChatContext()
  }
}

// 组件挂载时的初始化
onMounted(async () => {
  // 初始化聊天上下文
  updateChatContext()

  // 尝试恢复会话
  await handleRecovery()
})

// 使用 $subscribe 监听 Pinia store 的所有变化
lr0Store.$subscribe((mutation, state) => {
  // 防抖保存
  lr0Store.persistence.save()
  // 更新聊天上下文
  updateChatContext()
})
</script>

<style scoped>
/* 页面切换动画 */
.step-slide-enter-active,
.step-slide-leave-active {
  transition: all 0.3s ease-out;
}

.step-slide-enter-from {
  transform: translateX(20px);
  opacity: 0;
}

.step-slide-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}
</style>
