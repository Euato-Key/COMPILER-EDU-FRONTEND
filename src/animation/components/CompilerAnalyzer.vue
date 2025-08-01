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
import { computed, defineProps } from 'vue'
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
</script>
