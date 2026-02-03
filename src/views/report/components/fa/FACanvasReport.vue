<template>
  <div class="fa-canvas-report space-y-8">
    <div v-for="step in steps" :key="step.key" class="canvas-step-card bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Icon :icon="step.icon" class="w-5 h-5 text-purple-600" />
          {{ step.title }}
        </h3>
        <div v-if="hasUserData(step.key)" class="flex items-center gap-1 text-green-600 text-sm font-medium">
          <Icon icon="lucide:check-circle" class="w-4 h-4" />
          已完成绘制
        </div>
        <div v-else class="flex items-center gap-1 text-gray-400 text-sm font-medium">
          <Icon icon="lucide:circle" class="w-4 h-4" />
          未绘制
        </div>
      </div>

      <div class="p-6">
        <div v-if="hasUserData(step.key) || hasAnswerData(step.key)" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- 用户答案 -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm font-semibold text-gray-500 uppercase tracking-wider">我的绘图</span>
              <span v-if="!hasUserData(step.key)" class="text-xs text-red-500 font-medium italic">未提交绘图数据</span>
            </div>
            <div class="graph-container p-4 bg-gray-50 rounded-lg border border-gray-100 min-h-[300px] flex items-center justify-center relative overflow-hidden">
              <div v-if="!hasUserData(step.key)" class="text-gray-300 flex flex-col items-center">
                <Icon icon="lucide:image-off" class="w-12 h-12 mb-2" />
                <p>暂无绘图</p>
              </div>
              <div v-else class="viz-wrapper w-full h-full flex items-center justify-center">
                <!-- SVG Loading State -->
                <div v-if="loading[step.key].user" class="animate-pulse w-full">
                   <div class="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
                   <div class="h-32 bg-gray-200 rounded w-full"></div>
                </div>
                <!-- SVG Content -->
                <div v-else v-html="renderedUserSvgs[step.key]" class="rendered-svg-container w-full h-full flex items-center justify-center"></div>
              </div>
            </div>
          </div>

          <!-- 标准答案 -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm font-semibold text-gray-500 uppercase tracking-wider">标准参考答案</span>
              <span v-if="!hasAnswerData(step.key)" class="text-xs text-orange-500 font-medium italic">标准流程尚未生成</span>
            </div>
            <div class="graph-container p-4 bg-blue-50/30 rounded-lg border border-blue-100 min-h-[300px] flex items-center justify-center relative overflow-hidden">
              <div v-if="!hasAnswerData(step.key)" class="text-gray-300 flex flex-col items-center">
                <Icon icon="lucide:help-circle" class="w-12 h-12 mb-2" />
                <p>暂无参考答案</p>
              </div>
              <div v-else class="viz-wrapper w-full h-full flex items-center justify-center">
                <!-- SVG Loading State -->
                <div v-if="loading[step.key].answer" class="animate-pulse w-full">
                   <div class="h-4 bg-blue-100 rounded w-3/4 mx-auto mb-4"></div>
                   <div class="h-32 bg-blue-100 rounded w-full"></div>
                </div>
                <!-- SVG Content -->
                <div v-else v-html="renderedAnswerSvgs[step.key]" class="rendered-svg-container w-full h-full flex items-center justify-center"></div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="py-12 text-center text-gray-400">
           <Icon icon="lucide:layout" class="w-16 h-16 mx-auto mb-4 opacity-20" />
           <p>当前步骤没有可显示的绘图数据</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import { Icon } from '@iconify/vue'
import { instance as viz } from '@viz-js/viz'
import { faToDot, enhanceDotString } from '@/utils/fa-to-dot'

interface Props {
  userData: {
    step2?: { nodes: any[]; edges: any[] }
    step4?: { nodes: any[]; edges: any[] }
    step6?: { nodes: any[]; edges: any[] }
  }
  answerData: {
    nfaDot?: string
    dfaDot?: string
    minDfaDot?: string
  }
}

const props = defineProps<Props>()

const steps = [
  { key: 'step2', title: '步骤 2：NFA 构造', icon: 'lucide:git-pull-request', answerKey: 'nfaDot' },
  { key: 'step4', title: '步骤 4：子集构造法转化 DFA', icon: 'lucide:git-merge', answerKey: 'dfaDot' },
  { key: 'step6', title: '步骤 6：DFA 最小化', icon: 'lucide:shrink', answerKey: 'minDfaDot' }
] as const

const loading = ref({
  step2: { user: false, answer: false },
  step4: { user: false, answer: false },
  step6: { user: false, answer: false }
})

const renderedUserSvgs = ref<Record<string, string>>({ step2: '', step4: '', step6: '' })
const renderedAnswerSvgs = ref<Record<string, string>>({ step2: '', step4: '', step6: '' })

const hasUserData = (step: 'step2' | 'step4' | 'step6') => {
  return !!(props.userData && props.userData[step] && props.userData[step].nodes && props.userData[step].nodes.length > 0)
}

const hasAnswerData = (step: 'step2' | 'step4' | 'step6') => {
  const stepConfig = steps.find(s => s.key === step)
  if (!stepConfig) return false
  const dot = (props.answerData as any)[stepConfig.answerKey]
  return !!dot && dot.trim().length > 0
}

const renderAllGraphs = async () => {
  console.log('[FACanvasReport] Starting renderAllGraphs', { 
    hasUserData2: hasUserData('step2'), 
    hasAnswer2: hasAnswerData('step2'),
    answerData: props.answerData 
  })
  
  const vizInstance = await viz()

  for (const step of steps) {
    // 渲染用户图表
    if (hasUserData(step.key)) {
      loading.value[step.key].user = true
      try {
        const dot = faToDot(props.userData[step.key]!.nodes, props.userData[step.key]!.edges)
        const svgElement = await vizInstance.renderSVGElement(dot)
        svgElement.style.maxWidth = '100%'
        svgElement.style.height = 'auto'
        renderedUserSvgs.value[step.key] = svgElement.outerHTML
      } catch (e) {
        console.error(`[FACanvasReport] Failed to render user graph for ${step.key}:`, e)
      } finally {
        loading.value[step.key].user = false
      }
    }

    // 渲染答案图表
    const answerDot = (props.answerData as any)[step.answerKey]
    if (answerDot && answerDot.trim()) {
      loading.value[step.key].answer = true
      try {
        const enhancedDot = enhanceDotString(answerDot)
        const svgElement = await vizInstance.renderSVGElement(enhancedDot)
        svgElement.style.maxWidth = '100%'
        svgElement.style.height = 'auto'
        renderedAnswerSvgs.value[step.key] = svgElement.outerHTML
      } catch (e) {
        console.error(`[FACanvasReport] Failed to render answer graph for ${step.key}:`, e)
      } finally {
        loading.value[step.key].answer = false
      }
    } else {
      console.warn(`[FACanvasReport] No answer dot found for ${step.key} (key: ${step.answerKey})`)
    }
  }
}

onMounted(() => {
  // 延迟一丢丢确保 DOM 稳定且数据传参到位
  setTimeout(() => {
    renderAllGraphs()
  }, 100)
})

// 监听数据变化重新渲染
watch(() => props.userData, () => {
  renderAllGraphs()
}, { deep: true })

watch(() => props.answerData, () => {
  renderAllGraphs()
}, { deep: true })
</script>

<style scoped>
.fa-canvas-report {
  width: 100%;
}

:deep(.rendered-svg-container) svg {
  max-width: 100%;
  height: auto;
  filter: drop-shadow(0 4px 6px -1px rgb(0 0 0 / 0.1));
}

.canvas-step-card {
  transition: all 0.3s ease;
}

.canvas-step-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}

.viz-wrapper {
  min-height: 200px;
}
</style>
