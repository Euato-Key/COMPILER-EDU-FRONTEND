<template>
  <div class="lr0-layout h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
    <!-- 头部导航 -->
    <header class="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <router-link to="/" class="text-2xl font-bold text-purple-600 hover:text-purple-800 transition-colors">
              编译原理可视化
            </router-link>
            <span class="text-gray-400">|</span>
            <h1 class="text-xl font-semibold text-gray-800">LR0 语法分析</h1>
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="resetProgress"
              class="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              重置进度
            </button>
            <router-link
              to="/slr1"
              class="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              SLR1分析 →
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
          :steps="lr0Steps"
          :current-step="currentStep"
          @step-click="handleStepClick"
        />
      </div>

      <!-- 步骤内容 -->
      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, defineAsyncComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import StepFlowChart from '@/components/shared/StepFlowChart.vue'

// 动态导入所有步骤组件
const stepComponents = {
  'GrammarInput': defineAsyncComponent(() => import('./steps/01-GrammarInput.vue')),
  'AugmentedGrammar': defineAsyncComponent(() => import('./steps/02-AugmentedGrammar.vue')),
  'ItemSetConstruction': defineAsyncComponent(() => import('./steps/03-ItemSetConstruction.vue')),
  'LR0TableBuild': defineAsyncComponent(() => import('./steps/04-LR0TableBuild.vue')),
  'StringAnalysis': defineAsyncComponent(() => import('./steps/05-StringAnalysis.vue'))
}

const lr0Steps = [
  { id: 1, name: '文法输入', title: '文法输入', key: 'GrammarInput', description: '输入LR0文法并进行预处理', color: '#3b82f6', component: 'GrammarInput' },
  { id: 2, name: '增广文法', title: '增广文法', key: 'AugmentedGrammar', description: '写出增广文法和产生式编号', color: '#8b5cf6', component: 'AugmentedGrammar' },
  { id: 3, name: '画DFA', title: '画DFA', key: 'ItemSetConstruction', description: '构造LR0项目集规范族DFA', color: '#10b981', component: 'ItemSetConstruction' },
  { id: 4, name: 'LR0分析表', title: 'LR0分析表', key: 'LR0TableBuild', description: '构建LR0分析表', color: '#f59e0b', component: 'LR0TableBuild' },
  { id: 5, name: '分析输入串', title: '分析输入串', key: 'StringAnalysis', description: '使用LR0分析表分析输入串', color: '#ef4444', component: 'StringAnalysis' }
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

// 监听路由变化
watch(() => route.params.step, (newStep) => {
  if (newStep) {
    const stepNumber = parseInt(newStep as string)
    if (stepNumber >= 1 && stepNumber <= lr0Steps.length) {
      currentStep.value = stepNumber
    }
  }
})

const currentStepComponent = computed(() => {
  const step = lr0Steps.find(s => s.id === currentStep.value)
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
}

const completeAnalysis = (data: any) => {
  console.log('LR0 Analysis completed:', data)
  // 可以添加完成后的逻辑
}

// 重置进度
const resetProgress = () => {
  if (confirm('确定要重置所有进度吗？')) {
    handleStepClick(1)
  }
}
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
