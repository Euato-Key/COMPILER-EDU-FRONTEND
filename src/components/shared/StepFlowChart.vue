<template>
  <div class="step-flow-chart">
    <!-- 简化的时间线导航 -->
    <div ref="timelineContainerRef" class="timeline-container relative">
      <!-- 背景进度条 -->
      <div
        ref="progressBackgroundRef"
        class="progress-background absolute h-1 bg-gray-200 rounded-full"
        style="transform: translateY(-50%)"
      ></div>

      <!-- 激活的进度条 -->
      <div
        ref="progressActiveRef"
        class="progress-active absolute h-1 rounded-full transition-all duration-700 ease-out"
        :style="{
          background: `linear-gradient(to right, var(--theme-primary), ${getCurrentStep()?.color || '#10B981'})`,
          transform: 'translateY(-50%)'
        }"
      ></div>

      <!-- 步骤按钮 -->
      <div class="flex items-center justify-between px-4 py-4">
        <button
          v-for="step in steps"
          :key="step.id"
          @click="$emit('step-click', step.id)"
          :class="[
            'step-button relative transition-all duration-300 ease-out',
            'flex flex-col items-center cursor-pointer group z-10',
            'hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-200',
            {
              'active': isStepActive(step.id),
              'completed': isStepCompleted(step.id)
            }
          ]"
        >
          <!-- 步骤圆圈 -->
          <div
            :class="[
              'step-circle w-8 h-8 rounded-full border-3 flex items-center justify-center transition-all duration-300',
              'text-xs font-bold relative',
              {
                'text-white scale-110 shadow-lg': isStepActive(step.id),
                'text-white': isStepCompleted(step.id),
                'bg-white border-gray-300 text-gray-500 hover:border-gray-400': !isStepActive(step.id) && !isStepCompleted(step.id)
              }
            ]"
            :style="{
              backgroundColor: isStepActive(step.id) ? 'var(--theme-primary)' : isStepCompleted(step.id) ? '#10B981' : 'white',
              borderColor: isStepActive(step.id) ? 'var(--theme-primary)' : isStepCompleted(step.id) ? '#10B981' : '#D1D5DB'
            }"
          >
            <!-- 完成状态图标 -->
            <Icon
              v-if="isStepCompleted(step.id)"
              icon="lucide:check"
              class="w-4 h-4"
            />
            <!-- 当前步骤脉冲效果 -->
            <div
              v-else-if="isStepActive(step.id)"
              class="absolute inset-0 rounded-full animate-ping opacity-30"
              :style="{ backgroundColor: 'var(--theme-primary)' }"
            />
            <!-- 步骤编号 -->
            <span v-else>{{ step.id }}</span>
          </div>

          <!-- 步骤标签 -->
          <span
            :class="[
              'step-label text-xs font-medium mt-2 transition-colors duration-300 text-center max-w-20',
              {
                'font-semibold': isStepActive(step.id),
                'text-green-600': isStepCompleted(step.id),
                'text-gray-500': !isStepActive(step.id) && !isStepCompleted(step.id)
              }
            ]"
            :style="{
              color: isStepActive(step.id) ? 'var(--theme-primary)' : isStepCompleted(step.id) ? '#10B981' : '#6B7280'
            }"
          >
            {{ step.name }}
          </span>
        </button>
      </div>

      <!-- 动态指示器球 -->
      <div
        ref="ballRef"
        class="progress-ball absolute w-3 h-3 rounded-full shadow-lg transition-all duration-500 ease-out z-20"
        :style="{
          background: `linear-gradient(to right, var(--theme-primary), ${getCurrentStep()?.color || '#8B5CF6'})`
        }"
      >
        <div
          class="absolute inset-0 rounded-full animate-ping opacity-25"
          :style="{
            background: `linear-gradient(to right, var(--theme-primary), ${getCurrentStep()?.color || '#8B5CF6'})`
          }"
        ></div>
      </div>
    </div>

    <!-- 当前步骤信息 -->
    <div class="step-info mt-6 text-center">
      <div v-if="getCurrentStep()" class="space-y-2">
        <h3 class="text-lg font-semibold text-gray-900">
          {{ getCurrentStep()?.title }}
        </h3>
        <p class="text-sm text-gray-600">
          {{ getCurrentStep()?.description }}
        </p>
      </div>
      <div v-else class="text-sm text-gray-500">
        请选择一个步骤开始
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { Icon } from '@iconify/vue'
import { gsap } from 'gsap'

interface Step {
  id: number
  name: string
  title: string
  description: string
  color: string
  component: string
}

interface Props {
  steps: Step[]
  currentStep: number
}

const props = defineProps<Props>()

defineEmits<{
  'step-click': [stepId: number]
}>()

const ballRef = ref<HTMLElement>()
const timelineContainerRef = ref<HTMLElement>()
const progressBackgroundRef = ref<HTMLElement>()
const progressActiveRef = ref<HTMLElement>()

// 强制更新位置的函数
const updatePositions = () => {
  if (!ballRef.value || !timelineContainerRef.value) return

  // 强制重新计算并设置球的位置
  const newLeft = getButtonPosition(props.currentStep)
  const newTop = getButtonVerticalCenter()
  ballRef.value.style.left = `${newLeft}%`
  ballRef.value.style.top = `${newTop}px`
  ballRef.value.style.transform = 'translate(-50%, -50%)'

  // 强制重新计算进度条位置
  if (progressBackgroundRef.value) {
    progressBackgroundRef.value.style.left = `${getFirstButtonPosition()}%`
    progressBackgroundRef.value.style.width = `${getProgressBarWidth()}%`
    progressBackgroundRef.value.style.top = `${getButtonVerticalCenter()}px`
  }

  if (progressActiveRef.value) {
    progressActiveRef.value.style.left = `${getFirstButtonPosition()}%`
    progressActiveRef.value.style.width = `${getActiveProgressWidth()}%`
    progressActiveRef.value.style.top = `${getButtonVerticalCenter()}px`
  }
}

// 基于布局计算按钮位置（不依赖DOM查询，避免动画影响）
const getButtonPositionByLayout = (stepId: number) => {
  if (props.steps.length <= 1) return 50

  // 基于 justify-between 布局计算位置
  // 第一个按钮在 4px padding 之后，最后一个按钮在 4px padding 之前
  const paddingPercent = 4 // px-4 对应 1rem = 16px，这里简化为百分比估算

  if (stepId === 1) {
    return paddingPercent
  } else if (stepId === props.steps.length) {
    return 100 - paddingPercent
  } else {
    // 中间按钮均匀分布
    const progress = (stepId - 1) / (props.steps.length - 1)
    return paddingPercent + progress * (100 - 2 * paddingPercent)
  }
}

// 动态计算按钮位置（正确移除所有变换效果）
const getButtonPosition = (stepId: number) => {
  if (!timelineContainerRef.value) return getButtonPositionByLayout(stepId)

  try {
    const container = timelineContainerRef.value
    const buttons = container.querySelectorAll('.step-button')
    const targetButton = buttons[stepId - 1] as HTMLElement

    if (!targetButton || !container) return getButtonPositionByLayout(stepId)

    // 保存原始样式
    const originalTransform = targetButton.style.transform
    const originalTransition = targetButton.style.transition
    const originalClassName = targetButton.className

    // 临时移除所有变换和过渡效果
    targetButton.style.transform = 'none'
    targetButton.style.transition = 'none'
    targetButton.classList.remove('active', 'completed')

    // 强制重新计算布局
    void targetButton.offsetHeight

    const containerRect = container.getBoundingClientRect()
    const buttonRect = targetButton.getBoundingClientRect()

    // 计算按钮中心相对于容器的位置百分比
    const buttonCenter = buttonRect.left + buttonRect.width / 2
    const containerLeft = containerRect.left
    const containerWidth = containerRect.width

    const relativePosition = (buttonCenter - containerLeft) / containerWidth
    const result = Math.max(0, Math.min(100, relativePosition * 100))

    // 恢复原始样式
    targetButton.style.transform = originalTransform
    targetButton.style.transition = originalTransition
    targetButton.className = originalClassName

    return result
  } catch (error) {
    console.warn('DOM查询失败，使用布局计算:', error)
    return getButtonPositionByLayout(stepId)
  }
}

// 基于样式计算垂直中心位置（不依赖DOM查询）
const getButtonVerticalCenterByLayout = () => {
  // 基于已知的样式计算：
  // py-4 = 1rem = 16px top padding
  // step-circle h-8 = 2rem = 32px
  // 所以圆圈中心大约在 16px + 16px = 32px 的位置
  return 32
}

// 动态获取按钮圆圈的垂直中心位置（正确移除所有变换效果）
const getButtonVerticalCenter = () => {
  if (!timelineContainerRef.value) return getButtonVerticalCenterByLayout()

  try {
    const container = timelineContainerRef.value
    const firstButton = container.querySelector('.step-button') as HTMLElement
    const firstCircle = firstButton?.querySelector('.step-circle')

    if (!firstButton || !firstCircle || !container) return getButtonVerticalCenterByLayout()

    // 保存原始样式
    const originalTransform = firstButton.style.transform
    const originalTransition = firstButton.style.transition
    const originalClassName = firstButton.className

    // 临时移除所有变换和过渡效果
    firstButton.style.transform = 'none'
    firstButton.style.transition = 'none'
    firstButton.classList.remove('active', 'completed')

    // 强制重新计算布局
    void firstButton.offsetHeight

    const containerRect = container.getBoundingClientRect()
    const circleRect = firstCircle.getBoundingClientRect()

    // 计算圆圈中心相对于容器顶部的像素位置
    const circleCenter = circleRect.top + circleRect.height / 2
    const containerTop = containerRect.top
    const result = circleCenter - containerTop

    // 恢复原始样式
    firstButton.style.transform = originalTransform
    firstButton.style.transition = originalTransition
    firstButton.className = originalClassName

    return result
  } catch (error) {
    console.warn('DOM查询失败，使用布局计算:', error)
    return getButtonVerticalCenterByLayout()
  }
}

// 动态获取第一个按钮的位置
const getFirstButtonPosition = () => {
  return getButtonPosition(1)
}

// 动态获取最后一个按钮的位置
const getLastButtonPosition = () => {
  return getButtonPosition(props.steps.length)
}

// 获取进度条总宽度
const getProgressBarWidth = () => {
  const firstPos = getFirstButtonPosition()
  const lastPos = getLastButtonPosition()
  return lastPos - firstPos
}

// 获取当前激活进度条的宽度
const getActiveProgressWidth = () => {
  if (props.steps.length <= 1) return 0
  const currentPos = getButtonPosition(props.currentStep)
  const firstPos = getFirstButtonPosition()
  return Math.max(0, currentPos - firstPos)
}

// 颜色配置已移至主题系统

// 判断步骤状态
const isStepActive = (stepId: number) => stepId === props.currentStep
const isStepCompleted = (stepId: number) => stepId < props.currentStep

// 获取当前步骤对象
const getCurrentStep = () => {
  return props.steps.find(s => s.id === props.currentStep)
}

// 步骤切换动画
watch(() => props.currentStep, (newStep, oldStep) => {
  nextTick(() => {
    // 先更新位置（在动画开始前）
    updatePositions()

    // 球形指示器动画
    if (ballRef.value) {
      gsap.to(ballRef.value, {
        scale: 1.2,
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        ease: "power2.out"
        // 移除 onComplete 中的位置更新，避免在动画过程中重新计算
      })
    }

    // 进度条动画
    if (progressActiveRef.value) {
      gsap.to(progressActiveRef.value, {
        scaleX: 1.02,
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        ease: "power2.out"
      })
    }

    // 步骤按钮动画
    const stepButtons = document.querySelectorAll('.step-button')
    stepButtons.forEach((button, index) => {
      const stepId = index + 1
      if (stepId === newStep) {
        // 当前步骤的激活动画
        gsap.to(button, {
          scale: 1.1,
          y: -4,
          duration: 0.4,
          ease: "back.out(1.7)"
        })
      } else if (stepId === oldStep) {
        // 之前步骤的退出动画
        gsap.to(button, {
          scale: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out"
        })
      }
    })
  })
})

// 监听步骤变化，重新计算位置
watch([() => props.currentStep, () => props.steps.length], () => {
  nextTick(() => {
    // 确保DOM渲染完成后再计算位置
    setTimeout(() => {
      updatePositions()
    }, 10) // 给一个小延迟确保DOM完全更新
  })
}, { flush: 'post' })

onMounted(() => {
  // 初始化动画序列
  nextTick(() => {
    const timeline = gsap.timeline()

    // 1. 容器淡入
    timeline.fromTo('.step-flow-chart',
      { opacity: 0, y: 20, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: "power2.out"
      }
    )

    // 2. 背景进度条出现
    timeline.fromTo('.progress-background',
      { scaleX: 0, transformOrigin: 'left' },
      {
        scaleX: 1,
        duration: 0.5,
        ease: "power2.out"
      },
      "-=0.3"
    )

    // 3. 步骤按钮依次出现
    const stepButtons = document.querySelectorAll('.step-button')
    timeline.fromTo(stepButtons,
      {
        opacity: 0,
        y: 30,
        scale: 0.8
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.4,
        stagger: 0.1,
        ease: "back.out(1.7)"
      },
      "-=0.2"
    )

    // 4. 激活进度条出现
    timeline.fromTo('.progress-active',
      { scaleX: 0, transformOrigin: 'left' },
      {
        scaleX: 1,
        duration: 0.6,
        ease: "power2.out"
      },
      "-=0.3"
    )

    // 5. 球形指示器出现
    if (ballRef.value) {
      timeline.fromTo(ballRef.value,
        {
          opacity: 0,
          scale: 0
        },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "back.out(2)"
        },
        "-=0.4"
      )
    }

    // 6. 步骤信息淡入
    timeline.fromTo('.step-info',
      { opacity: 0, y: 15 },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out"
      },
      "-=0.2"
    )

    // 在动画完成后，立即更新位置
    timeline.call(() => {
      // 延迟一下确保所有DOM都渲染完成
      setTimeout(() => {
        updatePositions()
        // 再次确保位置正确，多次调用确保准确性
        setTimeout(updatePositions, 100)
        setTimeout(updatePositions, 300)
      }, 50)
    })
  })

  // 监听窗口大小变化
  const handleResize = () => {
    setTimeout(updatePositions, 100)
  }
  window.addEventListener('resize', handleResize)

  // 清理事件监听器
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })
})
</script>

<style scoped>
.step-flow-chart {
  background: var(--theme-step-bg, #F8FAFC);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow:
    0 10px 15px -3px rgb(0 0 0 / 0.1),
    0 4px 6px -2px rgb(0 0 0 / 0.05);
  border: 1px solid var(--theme-step-border, rgb(226 232 240));
  position: relative;
  transition: all 0.3s ease-in-out;
}

.timeline-container {
  position: relative;
  min-height: 120px;
  overflow: hidden; /* 防止子元素溢出 */
}

/* 背景进度条 */
.progress-background {
  z-index: 1;
}

/* 激活进度条 */
.progress-active {
  z-index: 2;
  box-shadow: 0 0 8px rgb(59 130 246 / 0.3);
}

/* 步骤按钮样式 */
.step-button {
  position: relative;
  padding: 0.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
  z-index: 10;
}

.step-button:hover {
  transform: scale(1.05) translateY(-2px);
}

.step-button.active {
  transform: scale(1.1) translateY(-4px);
}

.step-button.completed {
  opacity: 0.9;
}

/* 步骤圆圈 */
.step-circle {
  position: relative;
  z-index: 15;
}

.step-button.active .step-circle {
  animation: pulse-glow 2s ease-in-out infinite;
}

/* 步骤标签 */
.step-label {
  line-height: 1.2;
}

/* 进度球 */
.progress-ball {
  z-index: 20;
  animation: ball-glow 3s ease-in-out infinite;
  /* 确保球不会超出容器边界 */
  max-width: calc(100% - 1rem);
}

/* 步骤信息区域 */
.step-info {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);
}

/* 动画定义 */
@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 0 0 rgb(59 130 246 / 0.4);
  }
  50% {
    box-shadow: 0 0 0 8px rgb(59 130 246 / 0);
  }
}

@keyframes ball-glow {
  0%, 100% {
    box-shadow:
      0 4px 12px rgb(66 133 244 / 0.3),
      0 0 20px rgb(139 92 246 / 0.2);
  }
  50% {
    box-shadow:
      0 6px 16px rgb(66 133 244 / 0.4),
      0 0 30px rgb(139 92 246 / 0.3);
  }
}

/* 深色主题特殊动画 */
.theme-dark .step-button.active .step-circle {
  animation: dark-pulse-glow 2s ease-in-out infinite;
}

.theme-dark .progress-ball {
  animation: dark-ball-glow 3s ease-in-out infinite;
}

@keyframes dark-pulse-glow {
  0%, 100% {
    box-shadow:
      0 0 0 0 rgb(96 165 250 / 0.6),
      0 0 20px rgb(96 165 250 / 0.3);
  }
  50% {
    box-shadow:
      0 0 0 12px rgb(96 165 250 / 0),
      0 0 30px rgb(96 165 250 / 0.5);
  }
}

@keyframes dark-ball-glow {
  0%, 100% {
    box-shadow:
      0 4px 16px rgb(96 165 250 / 0.5),
      0 0 30px rgb(168 85 247 / 0.4),
      0 0 50px rgb(96 165 250 / 0.2);
  }
  50% {
    box-shadow:
      0 6px 20px rgb(96 165 250 / 0.7),
      0 0 40px rgb(168 85 247 / 0.6),
      0 0 70px rgb(96 165 250 / 0.4);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .step-flow-chart {
    padding: 1rem;
  }

  .step-button {
    padding: 0.25rem;
  }

  .step-label {
    font-size: 0.625rem;
  }

  .timeline-container {
    min-height: 100px;
  }

  .step-circle {
    width: 1.5rem;
    height: 1.5rem;
  }
}

/* 减少动画模式支持 */
@media (prefers-reduced-motion: reduce) {
  .step-button,
  .progress-active,
  .progress-ball {
    transition: none;
    animation: none;
  }
}
</style>
