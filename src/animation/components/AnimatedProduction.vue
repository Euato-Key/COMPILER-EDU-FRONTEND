<template>
  <div class="animated-production-container">
    <div class="font-semibold mb-3 text-gray-700">{{ title }}</div>
    <div class="production-wrapper" ref="productionWrapper">
      <transition name="production-fade" mode="out-in">
        <div v-if="currentProduction" :key="productionKey" class="production-content">
          <!-- LL1 产生式格式 -->
          <div v-if="type === 'll1'" class="production-display">
            <div v-if="currentProduction.type === 'production'" class="flex items-center gap-2">
              <span class="production-left">{{ currentProduction.left }}</span>
              <span class="production-arrow">→</span>
              <span class="production-right">{{
                Array.isArray(currentProduction.right)
                  ? currentProduction.right.join(' ')
                  : currentProduction.right
              }}</span>
            </div>
            <div v-else-if="currentProduction.type === 'epsilon'" class="flex items-center gap-2">
              <span class="production-left">{{ currentProduction.left }}</span>
              <span class="production-arrow">→</span>
              <span class="production-epsilon">ε (不入栈)</span>
            </div>
            <div v-else-if="currentProduction.type === 'match'">
              <span class="production-match">符号匹配: '{{ currentProduction.symbol }}'</span>
            </div>
            <div v-else>
              <span class="production-message">{{ currentProduction.message }}</span>
            </div>
          </div>

          <!-- LR 动作格式 -->
          <div v-else-if="type === 'lr'" class="production-display">
            <div v-if="currentProduction.type === 'shift'" class="flex items-center gap-2">
              <span class="action-type shift">移进</span>：
              <span class="state-transition">
                状态 {{ currentProduction.currentState }} → {{ currentProduction.newState }} </span
              >，
              <span class="symbol-action">符号 '{{ currentProduction.symbol }}' 入栈</span>
            </div>
            <div v-else-if="currentProduction.type === 'reduce'" class="flex items-center gap-2">
              <span class="action-type reduce">归约</span>：
              <span class="reduction-info">
                用 {{ currentProduction.production }} (r{{ currentProduction.ruleNumber }})
              </span>
            </div>
            <div v-else-if="currentProduction.type === 'accept'">
              <span class="action-type accept">接受 acc</span>
            </div>
            <div v-else>
              <span class="production-message">{{ currentProduction.message }}</span>
            </div>
          </div>

          <!-- 通用文本格式 -->
          <div v-else class="production-display">
            <span class="production-message">{{ currentProduction }}</span>
          </div>
        </div>
        <div v-else class="production-empty">
          <span class="text-gray-400">等待分析...</span>
        </div>
      </transition>
    </div>

    <!-- 动画效果容器 -->
    <div v-if="showParticles" class="particles-container" ref="particlesContainer">
      <div
        v-for="particle in particles"
        :key="particle.id"
        class="particle"
        :style="{
          left: `${particle.x}px`,
          top: `${particle.y}px`,
          backgroundColor: particle.color,
        }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { gsap } from 'gsap'

interface Particle {
  id: string
  x: number
  y: number
  color: string
}

const props = defineProps<{
  title: string
  type: 'll1' | 'lr' | 'text'
  production: any
  isActive?: boolean
}>()

const emit = defineEmits<{
  animationComplete: []
}>()

// 响应式数据
const productionWrapper = ref<HTMLElement>()
const particlesContainer = ref<HTMLElement>()
const currentProduction = ref<any>(null)
const showParticles = ref(false)
const particles = ref<Particle[]>([])
const animationTimeline = ref<gsap.core.Timeline | null>(null)

// 计算属性
const productionKey = computed(() => {
  if (!currentProduction.value) return 'empty'
  if (typeof currentProduction.value === 'string') return currentProduction.value
  return JSON.stringify(currentProduction.value)
})

// 产生式变化动画
const animateProductionChange = async (newProduction: any) => {
  if (animationTimeline.value) {
    animationTimeline.value.kill()
  }

  const tl = gsap.timeline()
  animationTimeline.value = tl

  // 如果有旧内容，先淡出
  if (currentProduction.value && productionWrapper.value) {
    tl.to(productionWrapper.value.querySelector('.production-content'), {
      opacity: 0,
      scale: 0.95,
      duration: 0.2,
      ease: 'power2.in',
    })
  }

  // 更新内容
  tl.call(() => {
    currentProduction.value = newProduction
  })

  // 等待DOM更新
  await nextTick()

  // 新内容淡入
  if (productionWrapper.value) {
    const newContent = productionWrapper.value.querySelector('.production-content')
    if (newContent) {
      tl.fromTo(
        newContent,
        {
          opacity: 0,
          scale: 0.95,
          y: 10,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.4,
          ease: 'back.out(1.7)',
        },
      )

      // 根据产生式类型添加特殊效果
      if (props.type === 'll1' && newProduction?.type === 'production') {
        animateProductionHighlight(newContent as HTMLElement)
      } else if (
        props.type === 'lr' &&
        (newProduction?.type === 'shift' || newProduction?.type === 'reduce')
      ) {
        animateActionHighlight(newContent as HTMLElement, newProduction.type)
      }
    }
  }

  tl.call(() => {
    emit('animationComplete')
  })
}

// 产生式高亮动画
const animateProductionHighlight = (element: HTMLElement) => {
  const leftSpan = element.querySelector('.production-left')
  const arrow = element.querySelector('.production-arrow')
  const rightSpan = element.querySelector('.production-right')

  if (leftSpan && arrow && rightSpan) {
    const tl = gsap.timeline({ delay: 0.2 })

    // 左侧符号动画
    tl.to(leftSpan, {
      scale: 1.1,
      color: '#3b82f6',
      duration: 0.3,
      ease: 'power2.out',
    })

    // 箭头动画
    tl.to(
      arrow,
      {
        scale: 1.2,
        rotation: 360,
        color: '#10b981',
        duration: 0.4,
        ease: 'back.out(1.7)',
      },
      0.1,
    )

    // 右侧符号动画
    tl.to(
      rightSpan,
      {
        scale: 1.1,
        color: '#059669',
        duration: 0.3,
        ease: 'power2.out',
      },
      0.2,
    )

    // 回归正常
    tl.to(
      [leftSpan, arrow, rightSpan],
      {
        scale: 1,
        color: '',
        rotation: 0,
        duration: 0.3,
        ease: 'power2.out',
      },
      1,
    )
  }
}

// 动作高亮动画
const animateActionHighlight = (element: HTMLElement, actionType: string) => {
  const actionSpan = element.querySelector('.action-type')

  if (actionSpan) {
    const color = actionType === 'shift' ? '#3b82f6' : '#059669'

    gsap.fromTo(
      actionSpan,
      {
        scale: 1,
        backgroundColor: 'transparent',
      },
      {
        scale: 1.1,
        backgroundColor: color,
        color: '#ffffff',
        borderRadius: '0.25rem',
        padding: '0.125rem 0.5rem',
        duration: 0.4,
        ease: 'power2.out',
        yoyo: true,
        repeat: 1,
      },
    )
  }
}

// 激活动画
const animateActivation = () => {
  if (!productionWrapper.value) return

  // 暂时禁用粒子效果，避免视觉干扰
  // createParticles()

  // 容器发光效果
  gsap.to(productionWrapper.value, {
    boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
    duration: 0.5,
    ease: 'power2.out',
    yoyo: true,
    repeat: 1,
  })
}

// 创建粒子效果
const createParticles = () => {
  showParticles.value = true
  particles.value = []

  const particleCount = 8
  const containerRect = productionWrapper.value?.getBoundingClientRect()

  if (!containerRect) return

  for (let i = 0; i < particleCount; i++) {
    const particle: Particle = {
      id: `particle-${i}`,
      x: containerRect.width / 2,
      y: containerRect.height / 2,
      color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'][i % 4],
    }
    particles.value.push(particle)
  }

  nextTick(() => {
    particles.value.forEach((particle, index) => {
      const element = particlesContainer.value?.querySelector(`[style*="${particle.x}px"]`)
      if (element) {
        const angle = (360 / particleCount) * index
        const radius = 30

        gsap.to(element, {
          x: Math.cos((angle * Math.PI) / 180) * radius,
          y: Math.sin((angle * Math.PI) / 180) * radius,
          opacity: 0,
          scale: 0,
          duration: 1,
          ease: 'power2.out',
          onComplete: () => {
            if (index === particleCount - 1) {
              showParticles.value = false
              particles.value = []
            }
          },
        })
      }
    })
  })
}

// 监听产生式变化 - 必须在函数定义之后
watch(
  () => props.production,
  (newProduction, oldProduction) => {
    if (newProduction !== oldProduction) {
      animateProductionChange(newProduction)
    }
  },
  { immediate: true },
)

// 监听激活状态
watch(
  () => props.isActive,
  (isActive) => {
    if (isActive) {
      animateActivation()
    }
  },
)

// 组件挂载后优化性能
onMounted(() => {
  if (productionWrapper.value) {
    productionWrapper.value.style.willChange = 'transform'
  }
})
</script>

<style scoped>
.animated-production-container {
  flex: 1;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  padding: 1rem;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.production-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60px;
  position: relative;
}

.production-content {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.production-display {
  font-size: 1.125rem;
  line-height: 1.5;
  text-align: center;
}

.production-left {
  color: #3b82f6;
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-weight: 600;
  display: inline-block;
}

.production-arrow {
  color: #6b7280;
  font-size: 1.25rem;
  margin: 0 0.5rem;
  display: inline-block;
}

.production-right {
  color: #059669;
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-weight: 600;
  display: inline-block;
}

.production-epsilon {
  color: #6b7280;
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-style: italic;
}

.production-match {
  color: #059669;
  font-weight: 600;
}

.production-message {
  color: #6b7280;
  font-size: 1rem;
}

.production-empty {
  color: #9ca3af;
  font-style: italic;
}

.action-type {
  font-weight: 600;
  display: inline-block;
  transition: all 0.3s ease;
}

.action-type.shift {
  color: #3b82f6;
}

.action-type.reduce {
  color: #059669;
}

.action-type.accept {
  color: #f59e0b;
  font-size: 1.25rem;
}

.state-transition {
  font-family: ui-monospace, SFMono-Regular, monospace;
  color: #374151;
}

.symbol-action {
  color: #3b82f6;
  font-family: ui-monospace, SFMono-Regular, monospace;
}

.reduction-info {
  font-family: ui-monospace, SFMono-Regular, monospace;
  color: #374151;
}

.particles-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  opacity: 0.8;
}

/* Vue过渡动画 */
.production-fade-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.production-fade-leave-active {
  transition: all 0.2s cubic-bezier(0.55, 0.06, 0.68, 0.19);
}

.production-fade-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.95);
}

.production-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

/* 响应式调整 */
@media (max-width: 1024px) {
  .production-display {
    font-size: 1rem;
  }

  .action-type.accept {
    font-size: 1.125rem;
  }
}

@media (max-width: 768px) {
  .production-display {
    font-size: 0.9rem;
  }

  .production-arrow {
    font-size: 1rem;
    margin: 0 0.25rem;
  }
}
</style>
