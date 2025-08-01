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
        @speed-change="animationControl.setSpeed"
      />
    </div>

    <!-- 分析器内容区域 - 自适应高度 -->
    <div class="flex-1 overflow-hidden">
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
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, watch, onMounted } from 'vue'
import { useLL1Store, useLR0Store, useSLR1Store } from '@/stores'
import ControlPanel from './ControlPanel.vue'
import LL1Analyzer from './LL1Analyzer.vue'
import LRAnalyzer from './LRAnalyzer.vue'
import { useEnhancedAnimationControl } from '../composables/useEnhancedAnimationControl'

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

const animationControl = useEnhancedAnimationControl(totalSteps)

const setupEnhancedAnimationTimeline = () => {
  // 添加数据有效性检查
  if (totalSteps.value <= 0) {
    console.log('No steps available for animation')
    return
  }

  if (props.algorithm === 'LL1' && ll1Data.value) {
    // LL1 栈分析器
    const stackAnalyzer = (step: number) => {
      const stack = ll1Data.value?.info_symbol_stack?.[step]
      if (!stack) return []

      if (typeof stack === 'string') {
        return stack
          .split('')
          .filter((c: string) => c !== '')
          .reverse()
      }
      return []
    }

    // LL1 输入分析器
    const inputAnalyzer = (step: number) => {
      const all = ll1Data.value?.info_str?.[0]?.length || 0
      const now = ll1Data.value?.info_str?.[step]?.length || 0
      const pointer = all - now

      // 检查当前消息是否为匹配操作
      const msg = ll1Data.value?.info_msg?.[step] || ''
      const isMatching = msg.includes('符号匹配') || msg.includes('match')

      return { pointer, isMatching }
    }

    // LL1 产生式分析器
    const productionAnalyzer = (step: number) => {
      const msg = ll1Data.value?.info_msg?.[step] || ''

      // 解析LL1消息
      if (msg.includes('→')) {
        const parts = msg.split('→')
        if (parts.length === 2) {
          return {
            type: 'production',
            left: parts[0].trim(),
            right: parts[1].trim(),
          }
        }
      } else if (msg.includes('符号匹配')) {
        const match = msg.match(/符号匹配[：:]\s*['"]([^'"]+)['"]/)
        return {
          type: 'match',
          symbol: match ? match[1] : '',
        }
      } else if (msg.includes('ε')) {
        return {
          type: 'epsilon',
          left: msg.split('→')[0]?.trim() || '',
          right: 'ε',
        }
      }

      return { type: 'message', message: msg }
    }

    // 创建协调动画时间线
    animationControl.createCoordinatedTimeline(
      ll1Data.value,
      stackAnalyzer,
      inputAnalyzer,
      productionAnalyzer,
    )
  } else if ((props.algorithm === 'LR0' || props.algorithm === 'SLR1') && lrData.value) {
    // LR 栈分析器（状态栈）
    const stackAnalyzer = (step: number) => {
      const stack = lrData.value?.info_state_stack?.[step]
      return stack ? stack.split('').reverse() : []
    }

    // LR 输入分析器
    const inputAnalyzer = (step: number) => {
      const all = lrData.value?.info_str?.[0]?.length || 0
      const now = lrData.value?.info_str?.[step]?.length || 0
      const pointer = all - now

      // 检查当前消息是否为移进操作
      const msg = lrData.value?.info_msg?.[step] || ''
      const isMatching = msg.includes('移进') || msg.includes('shift')

      return { pointer, isMatching }
    }

    // LR 动作分析器
    const productionAnalyzer = (step: number) => {
      const msg = lrData.value?.info_msg?.[step] || ''

      // 解析LR消息
      if (msg.includes('移进') || msg.includes('shift')) {
        // 移进操作
        const stateMatch = msg.match(/状态\s*(\d+)\s*[→-]\s*(\d+)/)
        const symbolMatch = msg.match(/符号\s*['"]([^'"]+)['"]/)

        return {
          type: 'shift',
          currentState: stateMatch ? stateMatch[1] : '',
          newState: stateMatch ? stateMatch[2] : '',
          symbol: symbolMatch ? symbolMatch[1] : '',
        }
      } else if (msg.includes('归约') || msg.includes('reduce')) {
        // 归约操作
        const ruleMatch = msg.match(/r(\d+)/)
        const productionMatch = msg.match(/用\s*([^(]+)/)

        return {
          type: 'reduce',
          ruleNumber: ruleMatch ? ruleMatch[1] : '',
          production: productionMatch ? productionMatch[1].trim() : msg,
        }
      } else if (msg.includes('接受') || msg.includes('acc')) {
        return {
          type: 'accept',
        }
      }

      return { type: 'message', message: msg }
    }

    // 创建协调动画时间线
    animationControl.createCoordinatedTimeline(
      lrData.value,
      stackAnalyzer,
      inputAnalyzer,
      productionAnalyzer,
    )
  }
}

// 监听数据变化，重新创建动画时间线
watch(
  [ll1Data, lrData, totalSteps],
  () => {
    if (totalSteps.value > 0) {
      console.log('Data changed, setting up enhanced animation timeline')
      setupEnhancedAnimationTimeline()
    }
  },
  { immediate: false },
)

onMounted(() => {
  setupEnhancedAnimationTimeline()
})
</script>
