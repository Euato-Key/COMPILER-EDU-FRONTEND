<template>
  <div class="animated-input-container">
    <div class="font-semibold mb-3 text-gray-700">{{ title }}</div>
    <div class="input-wrapper" ref="inputWrapper">
      <div class="input-display">
        <div
          v-for="(char, index) in visibleInput"
          :key="`char-${index}`"
          :ref="(el) => setCharRef(el, index)"
          :class="cn(
            charVariants({
              state: charStates[index]
            }),
            'input-char'
          )"
        >
          {{ char }}
        </div>

        <!-- 指针元素 -->
        <div
          v-if="pointerVisible && currentCharIndex < visibleInput.length"
          ref="pointerRef"
          :class="cn(
            pointerVariants({
              style: currentPointerStyle,
              size: 'md'
            }),
            'input-pointer'
          )"
          :style="{ left: getPointerPosition() }"
        >
          <Icon icon="material-symbols:arrow-upward" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { gsap } from 'gsap'
import { cva } from 'class-variance-authority'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Icon } from '@iconify/vue'

// 工具函数：合并类名
const cn = (...inputs: (string | undefined | null | boolean)[]) => twMerge(clsx(inputs))

// 指针样式变体
const pointerVariants = cva(
  "absolute transition-all duration-300 z-10 pointer-events-none select-none",
  {
    variants: {
      style: {
        normal: "text-blue-500",
        matching: "text-green-500 animate-pulse",
        error: "text-red-500 animate-bounce"
      },
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg"
      }
    },
    defaultVariants: {
      style: "normal",
      size: "md"
    }
  }
)

// 字符样式变体
const charVariants = cva(
  "flex items-center justify-center min-w-6 h-8 padding-1 border-radius-1 font-weight-600 transition-all duration-200 will-change-transform user-select-none cursor-default",
  {
    variants: {
      state: {
        consumed: "bg-gray-100 text-gray-400 opacity-60 scale-90",
        current: "bg-orange-100 text-orange-600 border-2 border-orange-500 shadow-lg scale-110",
        pending: "bg-transparent text-gray-700",
        matching: "bg-green-100 text-green-700 border-2 border-green-500 shadow-lg scale-115",
        error: "bg-red-100 text-red-600 border border-red-500 shadow-red-200"
      }
    },
    defaultVariants: {
      state: "pending"
    }
  }
)

const props = defineProps<{
  title: string
  input: string[]           // 完整输入串
  consumedCount: number     // 已消费字符数量
  isMatching?: boolean      // 是否正在执行匹配动作
  hasError?: boolean        // 是否有错误状态
  showPointer?: boolean     // 是否显示指针
  pointerStyle?: 'normal' | 'matching' | 'error'  // 指针样式
}>()

const emit = defineEmits<{
  animationComplete: []
}>()

// 响应式数据
const inputWrapper = ref<HTMLElement>()
const pointerRef = ref<HTMLElement>()
const charRefs = ref<(HTMLElement | null)[]>([])
const currentPointer = ref(0) // 当前指针位置（基于已消费数量）
const isCurrentMatching = ref(false)
const hasErrorState = ref(false)
const animationTimeline = ref<gsap.core.Timeline | null>(null)
const pointerVisible = ref(true) // 指针可见性

// 计算属性
const visibleInput = computed(() => props.input || [])

// 计算各字符的状态
const charStates = computed(() => {
  return visibleInput.value.map((_, index) => {
    if (index < props.consumedCount) {
      return 'consumed'
    } else if (index === props.consumedCount) {
      if (hasErrorState.value) return 'error'
      if (isCurrentMatching.value) return 'matching'
      return 'current'
    } else {
      return 'pending'
    }
  })
})

// 当前字符位置
const currentCharIndex = computed(() => props.consumedCount)

// 指针样式
const currentPointerStyle = computed(() => {
  if (hasErrorState.value) return 'error'
  if (isCurrentMatching.value) return 'matching'
  return props.pointerStyle || 'normal'
})

// 工具函数
const setCharRef = (el: unknown, index: number) => {
  const element = el as HTMLElement | { $el: HTMLElement } | null
  if (element && typeof element === 'object' && '$el' in element) {
    charRefs.value[index] = element.$el as HTMLElement
  } else if (element && 'nodeType' in (element as Node)) {
    charRefs.value[index] = element as HTMLElement
  }
}

// 计算指针位置
const getPointerPosition = () => {
  if (currentCharIndex.value >= charRefs.value.length) {
    return '0px'
  }

  const targetChar = charRefs.value[currentCharIndex.value]
  if (!targetChar || !inputWrapper.value) {
    return '0px'
  }

  const containerRect = inputWrapper.value.getBoundingClientRect()
  const charRect = targetChar.getBoundingClientRect()

  // 计算相对于容器的位置，指针放在字符中央下方
  const relativeLeft = charRect.left - containerRect.left + (charRect.width / 2)
  return `${relativeLeft}px`
}

// 匹配动画时间线
const createMatchingTimeline = () => {
  const tl = gsap.timeline()

  if (!pointerRef.value || currentCharIndex.value >= charRefs.value.length) {
    return tl
  }

  const currentCharRef = charRefs.value[currentCharIndex.value]
  if (!currentCharRef) return tl

  // 阶段1：指针激活
  tl.to(pointerRef.value, {
    scale: 1.2,
    color: '#10b981',
    duration: 0.1,
    ease: 'power2.out'
  })

  // 阶段2：字符匹配反馈
  tl.to(currentCharRef, {
    backgroundColor: '#dcfce7',
    scale: 1.1,
    duration: 0.2,
    ease: 'back.out(1.2)'
  }, '-=0.05')

  // 阶段3：状态转换
  tl.to(currentCharRef, {
    opacity: 0.5,
    scale: 0.9,
    duration: 0.2,
    ease: 'power2.out'
  })

  // 计算下一个字符位置并移动指针
  const nextIndex = currentCharIndex.value + 1
  if (nextIndex < charRefs.value.length) {
    const nextCharRef = charRefs.value[nextIndex]
    if (nextCharRef && inputWrapper.value) {
      const containerRect = inputWrapper.value.getBoundingClientRect()
      const nextCharRect = nextCharRef.getBoundingClientRect()
      const nextPosition = nextCharRect.left - containerRect.left + (nextCharRect.width / 2)

      tl.to(pointerRef.value, {
        x: nextPosition,
        duration: 0.3,
        ease: 'power2.inOut'
      }, '-=0.1')
    }
  }

  // 阶段4：状态稳定
  tl.to(pointerRef.value, {
    scale: 1,
    color: '#3b82f6',
    duration: 0.1,
    ease: 'power2.out'
  })

  return tl
}

// 指针移动动画
const animatePointerMove = async (targetIndex: number) => {
  if (animationTimeline.value) {
    animationTimeline.value.kill()
  }

  const tl = gsap.timeline()
  animationTimeline.value = tl

  if (!pointerRef.value || targetIndex >= charRefs.value.length) {
    emit('animationComplete')
    return
  }

  const targetChar = charRefs.value[targetIndex]
  if (!targetChar || !inputWrapper.value) {
    emit('animationComplete')
    return
  }

  // 计算目标位置
  const containerRect = inputWrapper.value.getBoundingClientRect()
  const targetRect = targetChar.getBoundingClientRect()
  const targetPosition = targetRect.left - containerRect.left + (targetRect.width / 2)

  // 移动指针到新位置
  tl.to(pointerRef.value, {
    x: targetPosition,
    duration: 0.3,
    ease: 'power2.inOut',
    onComplete: () => {
      emit('animationComplete')
    }
  })
}

// 显示指针高亮
const showPointerHighlight = async () => {
  pointerVisible.value = true

  if (currentCharIndex.value >= 0 && currentCharIndex.value < charRefs.value.length) {
    const currentChar = charRefs.value[currentCharIndex.value]
    if (currentChar) {
      await new Promise<void>((resolve) => {
        gsap.to(currentChar, {
          scale: 1.2,
          opacity: 1,
          backgroundColor: '#fef3c7',
          duration: 0.3,
          ease: 'back.out(1.7)',
          onComplete: () => resolve(),
        })
      })
    }
  }

  emit('animationComplete')
}

// 隐藏指针高亮
const hidePointerHighlight = async () => {
  if (
    pointerVisible.value &&
    currentCharIndex.value >= 0 &&
    currentCharIndex.value < charRefs.value.length
  ) {
    const currentChar = charRefs.value[currentCharIndex.value]
    if (currentChar) {
      await new Promise<void>((resolve) => {
        gsap.to(currentChar, {
          scale: 1,
          opacity: 1,
          backgroundColor: 'transparent',
          duration: 0.2,
          ease: 'power2.out',
          onComplete: () => resolve(),
        })
      })
    }
  }

  pointerVisible.value = false
  emit('animationComplete')
}

// 执行匹配动画
const animateMatching = async () => {
  if (currentCharIndex.value < 0 || currentCharIndex.value >= charRefs.value.length) return

  const currentChar = charRefs.value[currentCharIndex.value]
  if (!currentChar) return

  isCurrentMatching.value = true

  // 创建并执行匹配时间线
  const tl = createMatchingTimeline()

  await new Promise<void>((resolve) => {
    tl.call(() => {
      isCurrentMatching.value = false
      resolve()
    })
  })

  emit('animationComplete')
}

// 错误动画
const animateError = async () => {
  if (currentCharIndex.value < 0 || currentCharIndex.value >= charRefs.value.length) return

  const currentChar = charRefs.value[currentCharIndex.value]
  if (!currentChar) return

  hasErrorState.value = true

  // 错误抖动动画
  await new Promise<void>((resolve) => {
    gsap.to(currentChar, {
      backgroundColor: '#fee2e2',
      color: '#dc2626',
      x: '-=5',
      duration: 0.1,
      ease: 'power2.out',
      repeat: 5,
      yoyo: true,
      onComplete: () => {
        gsap.set(currentChar, { x: 0 })
        hasErrorState.value = false
        resolve()
      },
    })
  })

  emit('animationComplete')
}

// 初始化输入串
const initializeInput = () => {
  currentPointer.value = props.consumedCount
  isCurrentMatching.value = !!props.isMatching
  hasErrorState.value = !!props.hasError
  pointerVisible.value = props.showPointer ?? true
}

// 监听器
watch(
  () => props.consumedCount,
  (newConsumedCount, oldConsumedCount) => {
    if (newConsumedCount !== oldConsumedCount) {
      animatePointerMove(newConsumedCount)
    }
  },
)

watch(
  () => props.showPointer,
  (newShowPointer) => {
    if (newShowPointer) {
      showPointerHighlight()
    } else {
      hidePointerHighlight()
    }
  },
)

watch(
  () => props.isMatching,
  (newMatching) => {
    if (newMatching) {
      animateMatching()
    }
  },
)

watch(
  () => props.hasError,
  (newError) => {
    if (newError) {
      animateError()
    }
  },
)

watch(
  () => props.input,
  (newInput) => {
    if (newInput && newInput.length > 0) {
      nextTick(() => {
        initializeInput()
      })
    }
  },
  { immediate: true },
)

// 组件挂载
onMounted(() => {
  // 初始化字符引用数组
  charRefs.value = Array.from({ length: visibleInput.value.length }, () => null)

  nextTick(() => {
    initializeInput()

    // 设置性能优化
    if (inputWrapper.value) {
      inputWrapper.value.style.willChange = 'transform'
    }
  })
})

// 导出方法供父组件调用
defineExpose({
  showPointerHighlight,
  hidePointerHighlight,
  animateMatching,
  animateError,
})
</script>

<style scoped>
.animated-input-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  padding: 1rem;
  min-width: 200px;
  max-width: 400px;
}

.input-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80px;
  width: 100%;
  position: relative;
}

.input-display {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.75rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-size: 1.125rem;
  min-height: 3rem;
  overflow-x: auto;
  position: relative;
}

.input-char {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 1.5rem;
  height: 2rem;
  padding: 0.25rem;
  border-radius: 0.25rem;
  font-weight: 600;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform, opacity, background-color, color;
  user-select: none;
  cursor: default;
}

.input-pointer {
  bottom: -1.5rem;
  transform: translateX(-50%);
  animation-duration: 0.3s;
}

/* 指针动画效果 */
@keyframes pointer-pulse {
  0%, 100% {
    opacity: 1;
    transform: translateX(-50%) scale(1);
  }
  50% {
    opacity: 0.7;
    transform: translateX(-50%) scale(1.1);
  }
}

@keyframes pointer-bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translateX(-50%) translateY(0);
  }
  40%, 43% {
    transform: translateX(-50%) translateY(-6px);
  }
  70% {
    transform: translateX(-50%) translateY(-3px);
  }
  90% {
    transform: translateX(-50%) translateY(-1px);
  }
}

/* 字符状态样式覆盖（CVA 无法处理的复杂样式） */
.input-char[data-state="consumed"] {
  background-color: #f3f4f6 !important;
  color: #9ca3af !important;
  opacity: 0.6 !important;
  transform: scale(0.9) !important;
}

.input-char[data-state="current"] {
  background-color: #fed7aa !important;
  color: #ea580c !important;
  border: 2px solid #ea580c !important;
  box-shadow: 0 0 15px rgba(234, 88, 12, 0.4) !important;
  transform: scale(1.1) !important;
}

.input-char[data-state="pending"] {
  background-color: transparent !important;
  color: #374151 !important;
}

.input-char[data-state="matching"] {
  background-color: #bbf7d0 !important;
  color: #15803d !important;
  border: 2px solid #15803d !important;
  box-shadow: 0 0 15px rgba(21, 128, 61, 0.4) !important;
  transform: scale(1.15) !important;
}

.input-char[data-state="error"] {
  background-color: #fee2e2 !important;
  color: #dc2626 !important;
  border: 1px solid #dc2626 !important;
  box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.2) !important;
}

/* 响应式调整 */
@media (max-width: 1024px) {
  .input-char {
    min-width: 1.25rem;
    height: 1.75rem;
    font-size: 1rem;
  }

  .input-pointer {
    bottom: -1.25rem;
    font-size: 0.875rem;
  }
}

@media (max-width: 768px) {
  .input-char {
    min-width: 1rem;
    height: 1.5rem;
    font-size: 0.9rem;
  }

  .input-pointer {
    bottom: -1rem;
    font-size: 0.75rem;
  }
}
</style>
