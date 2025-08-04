<template>
  <div class="h-full bg-gray-50 flex flex-col">
    <!-- 控制面板 -->
    <div class="flex-shrink-0">
      <ControlPanel
        :is-playing="animationControl.isPlaying.value"
        :current-step="animationControl.currentStep.value"
        :total-steps="totalSteps"
        :speed="animationControl.speed.value"
        @play="animationControl.play"
        @pause="animationControl.pause"
        @reset="animationControl.reset"
        @step="animationControl.step"
        @step-back="animationControl.stepBack"
        @speed-change="animationControl.setSpeed"
      />
    </div>

    <!-- 分析器内容区域 - 自适应高度 -->
    <div class="flex-1 overflow-hidden">
      <!-- LL1 分析器 -->
      <LL1Analyzer
        v-if="algorithm === 'LL1'"
        :algorithm="algorithm"
        :current-step="animationControl.currentStep.value"
        :is-playing="animationControl.isPlaying.value"
      />

      <!-- LR 分析器 -->
      <LRAnalyzer
        v-else
        :algorithm="algorithm"
        :current-step="animationControl.currentStep.value"
        :is-playing="animationControl.isPlaying.value"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, watch, onMounted } from 'vue'
import { useLL1Store, useLR0Store, useSLR1Store } from '@/stores'
import { AnimationStoreFactory } from '@/animation/store/animationStoreFactory'
import ControlPanel from './ControlPanel.vue'
import LL1Analyzer from './LL1Analyzer.vue'
import LRAnalyzer from './LRAnalyzer.vue'
import { useEnhancedAnimationControl } from '../composables/useEnhancedAnimationControl'

const props = defineProps<{ algorithm: 'LL1' | 'LR0' | 'SLR1' }>()

// 原始数据Store（仅用于获取分析结果）
const ll1Store = useLL1Store()
const lr0Store = useLR0Store()
const slr1Store = useSLR1Store()

// 动画Store（用于动画控制）
const animationStore = AnimationStoreFactory.getStore(props.algorithm)

// 获取原始数据用于解析
const getRawAnalysisData = () => {
  if (props.algorithm === 'LL1') {
    return ll1Store.inputAnalysisResult
  } else if (props.algorithm === 'LR0') {
    return lr0Store.inputAnalysisResult
  } else {
    return slr1Store.inputAnalysisResult
  }
}

// 基于Store的总步数
const totalSteps = computed(() => animationStore.totalSteps)

// 使用基于Store的动画控制器
const animationControl = useEnhancedAnimationControl(animationStore)

// 数据状态监控
const hasValidData = computed(() => {
  const rawData = getRawAnalysisData()
  return rawData && rawData.info_step && rawData.info_step.length > 0
})

// 初始化动画系统
const setupAnimationData = async () => {
  try {
    const rawData = getRawAnalysisData()

    if (!rawData) {
      console.log('CompilerAnalyzer: No analysis data available')
      return
    }

    console.log('CompilerAnalyzer: Raw analysis data:', rawData)

    // 检查Store是否已解析数据
    if (animationStore.parseStatus !== 'ready') {
      console.log('CompilerAnalyzer: Parsing animation data for', props.algorithm)
      await animationStore.parseAnimationData(rawData)
      console.log('CompilerAnalyzer: Parse status after parsing:', animationStore.parseStatus)
    }

    console.log('CompilerAnalyzer: Animation setup complete, total steps:', totalSteps.value)
    console.log(
      'CompilerAnalyzer: Animation store hasAnimationData:',
      animationStore.hasAnimationData,
    )
  } catch (error) {
    console.error('CompilerAnalyzer: Failed to setup animation data:', error)
  }
}

// 监听数据变化，重新设置动画
watch(
  [() => getRawAnalysisData(), () => props.algorithm],
  async () => {
    if (hasValidData.value) {
      console.log('Data changed, setting up animation system')
      await setupAnimationData()
    }
  },
  { immediate: false },
)

onMounted(async () => {
  if (hasValidData.value) {
    await setupAnimationData()
  }
})
</script>
