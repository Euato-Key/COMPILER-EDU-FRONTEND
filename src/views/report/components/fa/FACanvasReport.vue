<template>
  <div class="fa-canvas-report">
    <div class="canvas-step-card bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Icon :icon="stepConfig.icon" class="w-5 h-5 text-purple-600" />
          {{ stepConfig.title }}
        </h3>
        <div v-if="hasUserData" class="flex items-center gap-1 text-green-600 text-sm font-medium">
          <Icon icon="lucide:check-circle" class="w-4 h-4" />
          已完成绘制
        </div>
        <div v-else class="flex items-center gap-1 text-gray-400 text-sm font-medium">
          <Icon icon="lucide:circle" class="w-4 h-4" />
          未绘制
        </div>
      </div>

      <div class="p-6">
        <div v-if="hasUserData || hasAnswerData" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- 用户答案 -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm font-semibold text-gray-500 uppercase tracking-wider">我的绘图</span>
              <span v-if="!hasUserData" class="text-xs text-red-500 font-medium italic">未提交绘图数据</span>
            </div>
            <div class="graph-container p-4 bg-gray-50 rounded-lg border border-gray-100 min-h-[300px] flex items-center justify-center relative overflow-hidden">
              <div v-if="!hasUserData" class="text-gray-300 flex flex-col items-center">
                <Icon icon="lucide:image-off" class="w-12 h-12 mb-2" />
                <p>暂无绘图</p>
              </div>
              <div v-else class="viz-wrapper w-full h-full flex items-center justify-center">
                <!-- SVG Loading State -->
                <div v-if="loading.user" class="animate-pulse w-full">
                   <div class="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
                   <div class="h-32 bg-gray-200 rounded w-full"></div>
                </div>
                <!-- SVG Content -->
                <div v-else v-html="renderedUserSvg" class="rendered-svg-container w-full h-full flex items-center justify-center"></div>
              </div>
            </div>
          </div>

          <!-- 标准答案 -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm font-semibold text-gray-500 uppercase tracking-wider">标准参考答案</span>
              <span v-if="!hasAnswerData" class="text-xs text-orange-500 font-medium italic">标准流程尚未生成</span>
            </div>
            <div class="graph-container p-4 bg-blue-50/30 rounded-lg border border-blue-100 min-h-[300px] flex items-center justify-center relative overflow-hidden">
              <div v-if="!hasAnswerData" class="text-gray-300 flex flex-col items-center">
                <Icon icon="lucide:help-circle" class="w-12 h-12 mb-2" />
                <p>暂无参考答案</p>
              </div>
              <div v-else class="viz-wrapper w-full h-full flex items-center justify-center">
                <!-- SVG Loading State -->
                <div v-if="loading.answer" class="animate-pulse w-full">
                   <div class="h-4 bg-blue-100 rounded w-3/4 mx-auto mb-4"></div>
                   <div class="h-32 bg-blue-100 rounded w-full"></div>
                </div>
                <!-- SVG Content -->
                <div v-else v-html="renderedAnswerSvg" class="rendered-svg-container w-full h-full flex items-center justify-center"></div>
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
import { ref, onMounted, watch, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { instance as viz } from '@viz-js/viz'
import { faToDot, enhanceDotString } from '@/utils/fa-to-dot'

interface Props {
  step: 2 | 4 | 6
  userData?: { nodes: any[]; edges: any[] }
  answerData?: string
}

const props = defineProps<Props>()

const stepConfigs = {
  2: { key: 'step2', title: '步骤 2：NFA 构造', icon: 'lucide:git-pull-request' },
  4: { key: 'step4', title: '步骤 4：子集构造法转化 DFA', icon: 'lucide:git-merge' },
  6: { key: 'step6', title: '步骤 6：DFA 最小化', icon: 'lucide:shrink' }
} as const

const stepConfig = computed(() => stepConfigs[props.step])

const loading = ref({
  user: false,
  answer: false
})

const renderedUserSvg = ref('')
const renderedAnswerSvg = ref('')

const hasUserData = computed(() => {
  return !!(props.userData && props.userData.nodes && props.userData.nodes.length > 0)
})

const hasAnswerData = computed(() => {
  return !!props.answerData && props.answerData.trim().length > 0
})

const renderGraphs = async () => {
  console.log('[FACanvasReport] Starting renderGraphs for step', props.step, {
    hasUserData: hasUserData.value,
    hasAnswerData: hasAnswerData.value
  })

  const vizInstance = await viz()

  // 渲染用户图表
  if (hasUserData.value) {
    loading.value.user = true
    try {
      const dot = faToDot(props.userData!.nodes, props.userData!.edges)
      const svgElement = await vizInstance.renderSVGElement(dot)
      svgElement.style.maxWidth = '100%'
      svgElement.style.height = 'auto'
      renderedUserSvg.value = svgElement.outerHTML
    } catch (e) {
      console.error(`[FACanvasReport] Failed to render user graph for step ${props.step}:`, e)
    } finally {
      loading.value.user = false
    }
  }

  // 渲染答案图表
  if (hasAnswerData.value) {
    loading.value.answer = true
    try {
      const enhancedDot = enhanceDotString(props.answerData!)
      const svgElement = await vizInstance.renderSVGElement(enhancedDot)
      svgElement.style.maxWidth = '100%'
      svgElement.style.height = 'auto'
      renderedAnswerSvg.value = svgElement.outerHTML
    } catch (e) {
      console.error(`[FACanvasReport] Failed to render answer graph for step ${props.step}:`, e)
    } finally {
      loading.value.answer = false
    }
  }
}

onMounted(() => {
  // 延迟一丢丢确保 DOM 稳定且数据传参到位
  setTimeout(() => {
    renderGraphs()
  }, 100)
})

// 监听数据变化重新渲染
watch(() => props.userData, () => {
  renderGraphs()
}, { deep: true })

watch(() => props.answerData, () => {
  renderGraphs()
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
</style>
