<template>
  <div class="ll1-layout h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- 头部导航 -->
    <header class="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <router-link
              to="/"
              class="text-2xl font-bold text-blue-600 hover:text-blue-800 transition-colors"
            >
              编译原理可视化
            </router-link>
            <span class="text-gray-400">|</span>
            <h1 class="text-xl font-semibold text-gray-800">LL1 语法分析</h1>
          </div>
          <div class="flex items-center gap-2">
            <!-- 持久化控制按钮 -->
            <button
              @click="saveProgress"
              class="px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
            >
              保存进度
            </button>
            <button
              @click="resetProgress"
              class="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              重置进度
            </button>
            <router-link
              to="/lr0"
              class="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
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
import { useLL1Store } from '@/stores/ll1'
import { useCommonStore } from '@/stores/common'

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

// 解构响应式状态（用于模板绑定）
const { productions, originalData, inputString } = storeToRefs(ll1Store)
const { error } = storeToRefs(commonStore)

// LL1流程步骤定义
const ll1Steps = [
  {
    id: 1,
    name: 'GRAMMAR',
    title: '输入文法',
    description: '定义上下文无关文法',
    color: '#10B981',
    component: 'GrammarInput',
  },
  {
    id: 2,
    name: 'FIRST/FOLLOW',
    title: 'First集和Follow集',
    description: '集合提取',
    color: '#059669',
    component: 'FirstFollowSets',
  },
  {
    id: 3,
    name: 'LL1-TABLE',
    title: 'LL1分析表',
    description: '表格构建',
    color: '#047857',
    component: 'LL1TableBuild',
  },
  {
    id: 4,
    name: 'ANALYSIS',
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

// 保存进度
const saveProgress = () => {
  try {
    ll1Store.persistence.save()
    commonStore.setError('') // 清除错误
    // 可以显示保存成功提示
    console.log('Progress saved successfully')
  } catch (err) {
    commonStore.setError('保存进度失败')
  }
}

// 重置进度
const resetProgress = () => {
  ll1Store.resetAll()
  navigateToStep(1)
  console.log('Progress reset')
}

// 清除错误
const clearError = () => {
  commonStore.clearError()
}

// 组件挂载时的初始化
onMounted(() => {
  // 从路由获取步骤
  const step = Number(route.query.step) || 1
  if (step >= 1 && step <= ll1Steps.length) {
    currentStep.value = step
  }

  // 尝试加载持久化数据
  try {
    ll1Store.persistence.load()
  } catch (err) {
    console.warn('Failed to load persisted data:', err)
  }
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

// 监听数据变化，自动保存
watch(
  [productions, inputString],
  () => {
    // 防抖保存
    ll1Store.persistence.save()
  },
  { deep: true },
)
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
