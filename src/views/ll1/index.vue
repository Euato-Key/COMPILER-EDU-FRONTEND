<template>
  <div class="ll1-layout min-h-screen theme-main-bg theme-transition">
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
            <h1 class="text-xl font-semibold text-gray-800">LL1 语法分析</h1>
            
            <!-- 状态显示栏 -->
            <div v-if="ll1Store.productions.length" class="hidden md:flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg border border-gray-200 text-xs">
              <div class="flex items-center gap-1">
                <span class="text-gray-500">ID:</span>
                <span v-if="ll1Store.currentRecordId" class="font-mono text-blue-600 font-bold">
                  {{ ll1Store.currentRecordId }}
                </span>
                <span v-else class="text-green-600 font-bold">新会话</span>
              </div>
              <span class="text-gray-300">|</span>
              <div class="flex items-center gap-1 max-w-[300px]">
                <span class="text-gray-500">文法:</span>
                <span class="font-mono text-gray-900 truncate" :title="ll1Store.grammar">
                  {{ ll1Store.productions[0] }}{{ ll1Store.productions.length > 1 ? '...' : '' }}
                </span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <ThemeSelector />
            <router-link
              to="/record/ll1"
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
              to="/lr0"
              class="px-4 py-2 text-sm theme-btn-primary rounded-lg hover:opacity-90 transition-colors"
            >
              LR0 分析 →
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
          :steps="ll1Steps"
          :current-step="currentStep"
          @step-click="handleStepClick"
        />
      </div>

      <!-- 步骤内容 -->
      <div class="theme-content-bg rounded-xl shadow-lg overflow-hidden theme-transition">
        <Transition name="step-slide" mode="out-in">
          <component
            :is="currentStepComponent"
            :key="currentStep"
            @next-step="handleNextStep"
            @prev-step="prevStep"
            @complete="completeAnalysis"
          />
        </Transition>
      </div>
    </main>

    <!-- AI聊天组件 -->
    <AIChatWidget
      page-type="ll1"
      :context="chatContext"
    />

    <!-- 返回顶部按钮 -->
    <ScrollToTop theme="green" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { Icon } from '@iconify/vue'
import StepFlowChart from '@/components/shared/StepFlowChart.vue'
import ScrollToTop from '@/components/shared/ScrollToTop.vue'
import ThemeSelector from '@/components/shared/ThemeSelector.vue'
import { AIChatWidget } from '@/components/ai'
import { useLL1Store, useCommonStore, useLL1ChatStore, buildLL1Context } from '@/stores'
import type { ChatContext } from '@/components/ai/types'

// 导入步骤组件
import GrammarInput from './steps/01-GrammarInput.vue'
import FirstFollowSets from './steps/02-FirstFollowSets.vue'
import LL1TableBuild from './steps/03-LL1TableBuild.vue'
import StringAnalysis from './steps/04-StringAnalysis.vue'

const router = useRouter()
const route = useRoute()

// 获取 Store 实例
const ll1Store = useLL1Store()
const commonStore = useCommonStore()

// 立即尝试加载持久化数据
try {
  ll1Store.persistence.load()
} catch (err) {
  console.warn('Failed to load persisted data:', err)
}

// 使用LL1 AI聊天store
const ll1ChatStore = useLL1ChatStore()

// 聊天上下文
const chatContext = ref<ChatContext>({
  currentPage: 'll1',
  userInput: {},
  backendData: {},
  userAnswers: {},
  pageContext: 'LL1语法分析学习页面'
})

// 解构响应式状态（用于模板绑定）
const { productions, originalData, inputString } = storeToRefs(ll1Store)
const { error } = storeToRefs(commonStore)

// LL1流程步骤定义
const ll1Steps = [
  {
    id: 1,
    name: '输入文法',
    title: '输入文法',
    description: '定义上下文无关文法',
    color: '#10B981',
    component: 'GrammarInput',
  },
  {
    id: 2,
    name: 'First/Follow集',
    title: 'First集和Follow集',
    description: '集合提取',
    color: '#059669',
    component: 'FirstFollowSets',
  },
  {
    id: 3,
    name: 'LL1分析表',
    title: 'LL1分析表',
    description: '表格构建',
    color: '#047857',
    component: 'LL1TableBuild',
  },
  {
    id: 4,
    name: '字符串分析',
    title: '字符串分析结果',
    description: '语法分析',
    color: '#065f46',
    component: 'StringAnalysis',
  },
]

// 组件映射
const componentMap = {
  GrammarInput,
  FirstFollowSets,
  LL1TableBuild,
  StringAnalysis,
}

// 当前步骤
const currentStep = ref(1)

// 计算当前步骤组件
const currentStepComponent = computed(() => {
  const step = ll1Steps.find((s) => s.id === currentStep.value)
  return step ? componentMap[step.component as keyof typeof componentMap] : GrammarInput
})

// 导航到指定步骤
const navigateToStep = (stepId: number) => {
  currentStep.value = stepId
  router.push({ query: { step: stepId } })

  // 滚动到页面顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 下一步
const nextStep = () => {
  if (currentStep.value < ll1Steps.length) {
    navigateToStep(currentStep.value + 1)
  }
}

// 处理步骤完成和数据传递
const handleNextStep = (data?: any) => {
  // 第一步完成后，数据已经在 Store 中了，不需要手动传递
  // 直接进入下一步
  nextStep()
}

// 上一步
const prevStep = () => {
  if (currentStep.value > 1) {
    navigateToStep(currentStep.value - 1)
  }
}

// 步骤完成回调
const completeAnalysis = (data: any) => {
  console.log('LL1 Step completed:', currentStep.value, data)
  // 更新聊天上下文
  updateChatContext()
  // 可以在这里添加完成分析后的逻辑，比如显示完成提示
}

// 处理步骤点击
const handleStepClick = (stepId: number) => {
  // 根据数据状态判断是否允许跳转
  if (stepId === 1) {
    navigateToStep(stepId)
  } else if (stepId > 1 && originalData.value) {
    // 只有在第一步完成（有分析数据）后才允许跳转到后续步骤
    navigateToStep(stepId)
  } else {
    // 显示提示，需要先完成前面的步骤
    commonStore.setError('请先完成文法输入步骤')
  }
}



// 更新聊天上下文
const updateChatContext = () => {
  // 直接使用 Store 中的方法构建 AI 上下文
  const aiContext = ll1Store.buildAIContext(currentStep.value)

  // 转换为 ChatContext 格式 - 完整传递所有上下文信息
  chatContext.value = {
    currentPage: 'll1',
    recordId: aiContext.recordId,
    currentStep: currentStep.value,
    stepName: ll1Steps[currentStep.value - 1]?.name || '',
    userInput: {
      ...aiContext.userInput,
      currentStep: currentStep.value,
      stepName: ll1Steps[currentStep.value - 1]?.name || '',
    },
    backendData: aiContext.backendData,
    userAnswers: aiContext.userAnswers,
    correctAnswers: aiContext.correctAnswers,
    errorLogs: aiContext.errorLogs,
    pageContext: `LL1语法分析 - ${ll1Steps[currentStep.value - 1]?.name || ''}`,
  }

  // 更新store中的上下文
  ll1ChatStore.updateContext(chatContext.value)
}

// 重置进度
// === 核心逻辑：尝试恢复会话 ===
const isRecovering = ref(false)
const handleRecovery = async () => {
  if (isRecovering.value) return
  
  if (ll1Store.productions.length > 0 && !ll1Store.originalData) {
    isRecovering.value = true
    try {
      console.log('[LL1-RECOVERY] 检测到文法记录，正在静默恢复分析结果...', ll1Store.productions)
      const success = await ll1Store.performLL1Analysis(true)
      if (success) {
        console.log('[LL1-RECOVERY] 分析结果恢复成功')
        if (ll1Store.inputString) {
          await ll1Store.analyzeInputString()
        }
      }
    } catch (err) {
      console.error('[LL1-RECOVERY] 恢复失败:', err)
    } finally {
      isRecovering.value = false
      updateChatContext()
    }
  }
}

// 重置进度
const resetProgress = () => {
  if (confirm('确定要新建答题吗？这将清空当前所有进度。')) {
    ll1Store.resetAll()
    navigateToStep(1)
    // 清空AI聊天上下文
    ll1ChatStore.clearChat()
    updateChatContext()
    console.log('Progress reset')
  }
}

// 清除错误
const clearError = () => {
  commonStore.clearError()
}

// 监听当前步骤变化
watch(currentStep, () => {
  updateChatContext()
})

// 组件挂载时的初始化
onMounted(async () => {
  // 从路由获取步骤
  const step = Number(route.query.step) || 1
  if (step >= 1 && step <= ll1Steps.length) {
    currentStep.value = step
  }

  await handleRecovery()
  // 初始化聊天上下文
  updateChatContext()
})

// 监听路由变化，同步步骤状态
watch(
  () => route.query.step,
  (newStep) => {
    const step = Number(newStep) || 1
    if (step >= 1 && step <= ll1Steps.length && step !== currentStep.value) {
      currentStep.value = step
    }
  },
)

// 使用 $subscribe 监听 Pinia store 的所有变化
ll1Store.$subscribe((mutation, state) => {
  // 防抖保存
  ll1Store.persistence.save()
  // 更新聊天上下文
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
</style>
