<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- 控制面板 -->
    <ControlPanel
      :is-playing="animationControl.isPlaying.value"
      :current-step="animationControl.currentStep.value"
      :total-steps="totalSteps"
      :speed="animationControl.speed.value"
      @play="animationControl.play"
      @pause="animationControl.pause"
      @reset="animationControl.reset"
      @step="animationControl.step"
      @speed-change="animationControl.setSpeed"
    />

    <!-- LL1 分析器 -->
    <LL1Analyzer
      v-if="algorithm === 'LL1'"
      :analysis-data="ll1Data"
      :current-step="animationControl.currentStep.value"
      :is-playing="animationControl.isPlaying.value"
    />

    <!-- LR 分析器 -->
    <LRAnalyzer
      v-else
      :algorithm="algorithm"
      :analysis-data="lrData"
      :current-step="animationControl.currentStep.value"
      :is-playing="animationControl.isPlaying.value"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, watch, onMounted } from 'vue'
import { useLL1Store, useLR0Store, useSLR1Store } from '@/stores'
import ControlPanel from './ControlPanel.vue'
import LL1Analyzer from './LL1Analyzer.vue'
import LRAnalyzer from './LRAnalyzer.vue'
import { useAnimationControl } from '../composables/useAnimationControl'

const props = defineProps<{ algorithm: 'LL1' | 'LR0' | 'SLR1' }>()

const ll1Store = useLL1Store()
const lr0Store = useLR0Store()
const slr1Store = useSLR1Store()

const ll1Data = computed(() => ll1Store.inputAnalysisResult)
const lrData = computed(() =>
  props.algorithm === 'LR0' ? lr0Store.inputAnalysisResult : slr1Store.inputAnalysisResult,
)

const totalSteps = computed(() => {
  if (props.algorithm === 'LL1') {
    return ll1Data.value?.info_step?.length || 0
  } else {
    return lrData.value?.info_step?.length || 0
  }
})

const animationControl = useAnimationControl(totalSteps)

const setupAnimationTimeline = () => {
  // 添加数据有效性检查
  if (totalSteps.value <= 0) {
    console.log('No steps available for animation')
    return
  }

  if (props.algorithm === 'LL1' && ll1Data.value) {
    // 简化的 LL1 动画逻辑
    console.log('Setting up LL1 animation with data:', ll1Data.value)
    // 创建一个基础的 GSAP 时间线来测试动画控制
    import('gsap').then(({ gsap }) => {
      const tl = gsap.timeline({
        paused: true,
        onUpdate: () => {
          // 根据时间线进度更新当前步骤
          const progress = tl.progress()
          const newStep = Math.floor(progress * totalSteps.value)
          if (newStep !== animationControl.currentStep.value && newStep < totalSteps.value) {
            animationControl.currentStep.value = newStep
          }
        },
      })

      // 为每一步创建简单的动画
      for (let i = 0; i < totalSteps.value; i++) {
        tl.to(
          {},
          {
            duration: 1,
            onStart: () => {
              console.log(`LL1 Animation step ${i + 1}:`, ll1Data.value?.info_msg?.[i])
              animationControl.currentStep.value = i
            },
          },
        )
      }

      animationControl.timeline.value = tl
    })
  } else if ((props.algorithm === 'LR0' || props.algorithm === 'SLR1') && lrData.value) {
    // 简化的 LR 动画逻辑
    console.log('Setting up LR animation with data:', lrData.value)
    import('gsap').then(({ gsap }) => {
      const tl = gsap.timeline({
        paused: true,
        onUpdate: () => {
          // 根据时间线进度更新当前步骤
          const progress = tl.progress()
          const newStep = Math.floor(progress * totalSteps.value)
          if (newStep !== animationControl.currentStep.value && newStep < totalSteps.value) {
            animationControl.currentStep.value = newStep
          }
        },
      })

      // 为每一步创建简单的动画
      for (let i = 0; i < totalSteps.value; i++) {
        tl.to(
          {},
          {
            duration: 1,
            onStart: () => {
              console.log(`LR Animation step ${i + 1}:`, lrData.value?.info_msg?.[i])
              animationControl.currentStep.value = i
            },
          },
        )
      }

      animationControl.timeline.value = tl
    })
  }
}

// 监听数据变化，重新创建动画时间线
watch(
  [ll1Data, lrData, totalSteps],
  () => {
    if (totalSteps.value > 0) {
      console.log('Data changed, setting up new animation timeline')
      setupAnimationTimeline()
    }
  },
  { immediate: false },
)

onMounted(() => {
  setupAnimationTimeline()
})
</script>
