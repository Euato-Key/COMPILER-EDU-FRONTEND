<template>
  <div class="animated-input-container">
    <div class="font-semibold mb-3 text-gray-700">输入串</div>
    <div class="input-string-wrapper" ref="inputWrapper">
      <transition-group
        name="input-animation"
        tag="div"
        class="input-container"
        @before-enter="beforeEnter"
        @enter="enter"
        @leave="leave"
      >
        <div
          v-for="(char, index) in visibleInput"
          :key="char.id"
          :data-index="index"
          class="input-symbol"
          :class="[
            char.state,
            {
              'input-current': index === currentPointer,
              'input-consumed': index < currentPointer,
              'input-upcoming': index > currentPointer,
              'input-matching': char.state === 'matching',
              'input-error': char.state === 'error',
            },
          ]"
        >
          {{ char.value }}
        </div>
      </transition-group>
    </div>
    <div class="mt-3 text-xs text-gray-400 text-center">
      当前位置: {{ currentPointer + 1 }}/{{ visibleInput.length }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { gsap } from 'gsap'

interface InputChar {
  id: string
  value: string
  state: 'normal' | 'matching' | 'error' | 'consumed'
}

const props = defineProps<{
  input: string[]
  pointer: number
  isMatching?: boolean
  hasError?: boolean
}>()

const emit = defineEmits<{
  animationComplete: []
}>()

// 响应式数据
const inputWrapper = ref<HTMLElement>()
const visibleInput = ref<InputChar[]>([])
const currentPointer = ref(0)
const animationTimeline = ref<gsap.core.Timeline | null>(null)

// 生成唯一ID
let charIdCounter = 0
const generateCharId = (value: string, index: number) => {
  return `input-char-${charIdCounter++}-${value}-${index}`
}

// 创建输入字符项
const createInputChar = (
  value: string,
  state: 'normal' | 'matching' | 'error' | 'consumed' = 'normal',
): InputChar => ({
  id: generateCharId(value, visibleInput.value.length),
  value,
  state,
})

// 监听输入字符串变化
watch(
  () => props.input,
  (newInput) => {
    if (newInput && newInput.length > 0) {
      visibleInput.value = newInput.map((char, index) =>
        createInputChar(char, index < props.pointer ? 'consumed' : 'normal'),
      )
    } else {
      visibleInput.value = []
    }
  },
  { immediate: true },
)

// 监听指针变化
watch(
  () => props.pointer,
  (newPointer, oldPointer) => {
    if (newPointer !== oldPointer) {
      animatePointerMove(oldPointer || 0, newPointer)
    }
  },
  { immediate: true },
)

// 监听匹配状态
watch(
  () => props.isMatching,
  (isMatching) => {
    if (isMatching && currentPointer.value < visibleInput.value.length) {
      animateCharacterMatch(currentPointer.value)
    }
  },
)

// 监听错误状态
watch(
  () => props.hasError,
  (hasError) => {
    if (hasError && currentPointer.value < visibleInput.value.length) {
      animateCharacterError(currentPointer.value)
    }
  },
)

// 指针移动动画
const animatePointerMove = async (oldPointer: number, newPointer: number) => {
  if (animationTimeline.value) {
    animationTimeline.value.kill()
  }

  currentPointer.value = newPointer

  // 创建新的时间线
  const tl = gsap.timeline()
  animationTimeline.value = tl

  // 如果指针向前移动（消费字符）
  if (newPointer > oldPointer) {
    for (let i = oldPointer; i < newPointer; i++) {
      if (i < visibleInput.value.length) {
        const char = visibleInput.value[i]
        char.state = 'consumed'

        const element = inputWrapper.value?.querySelector(`[data-index="${i}"]`) as HTMLElement
        if (element) {
          // 高亮当前字符
          tl.to(
            element,
            {
              scale: 1.2,
              backgroundColor: '#10b981',
              color: '#ffffff',
              duration: 0.2,
              ease: 'power2.out',
            },
            0,
          )

          // 缩放回正常并标记为已消费
          tl.to(
            element,
            {
              scale: 1,
              backgroundColor: '#f3f4f6',
              color: '#6b7280',
              duration: 0.3,
              ease: 'power2.out',
            },
            0.2,
          )
        }
      }
    }
  }

  // 高亮当前指针位置
  if (newPointer < visibleInput.value.length) {
    const currentElement = inputWrapper.value?.querySelector(
      `[data-index="${newPointer}"]`,
    ) as HTMLElement
    if (currentElement) {
      tl.to(
        currentElement,
        {
          scale: 1.15,
          backgroundColor: '#fbbf24',
          boxShadow: '0 0 0 2px rgba(251, 191, 36, 0.3)',
          duration: 0.3,
          ease: 'power2.out',
        },
        0.4,
      )
    }
  }

  tl.call(() => {
    emit('animationComplete')
  })
}

// 字符匹配动画
const animateCharacterMatch = async (index: number) => {
  const char = visibleInput.value[index]
  if (!char) return

  char.state = 'matching'

  const element = inputWrapper.value?.querySelector(`[data-index="${index}"]`) as HTMLElement
  if (element) {
    const tl = gsap.timeline()

    // 成功匹配效果
    tl.to(element, {
      scale: 1.3,
      backgroundColor: '#10b981',
      color: '#ffffff',
      boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)',
      duration: 0.3,
      ease: 'back.out(1.7)',
    })

    // 回到正常状态
    tl.to(
      element,
      {
        scale: 1,
        backgroundColor: '#f3f4f6',
        color: '#6b7280',
        boxShadow: 'none',
        duration: 0.2,
        ease: 'power2.out',
      },
      0.5,
    )

    tl.call(() => {
      char.state = 'consumed'
      emit('animationComplete')
    })
  }
}

// 字符错误动画
const animateCharacterError = async (index: number) => {
  const char = visibleInput.value[index]
  if (!char) return

  char.state = 'error'

  const element = inputWrapper.value?.querySelector(`[data-index="${index}"]`) as HTMLElement
  if (element) {
    const tl = gsap.timeline()

    // 错误抖动效果
    tl.to(element, {
      x: -5,
      backgroundColor: '#ef4444',
      color: '#ffffff',
      duration: 0.1,
      ease: 'power2.out',
    })

    tl.to(element, {
      x: 5,
      duration: 0.1,
      ease: 'power2.out',
    })

    tl.to(element, {
      x: -3,
      duration: 0.1,
      ease: 'power2.out',
    })

    tl.to(element, {
      x: 0,
      duration: 0.1,
      ease: 'power2.out',
    })

    // 保持错误状态一段时间
    tl.to(
      element,
      {
        backgroundColor: '#fef2f2',
        color: '#ef4444',
        duration: 0.3,
        ease: 'power2.out',
      },
      0.8,
    )

    tl.call(() => {
      emit('animationComplete')
    })
  }
}

// Vue 过渡钩子
const beforeEnter = (el: Element) => {
  const element = el as HTMLElement
  gsap.set(element, {
    opacity: 0,
    scale: 0.5,
    y: 10,
  })
}

const enter = (el: Element, done: () => void) => {
  const element = el as HTMLElement
  const index = parseInt(element.dataset.index || '0')

  gsap.to(element, {
    opacity: 1,
    scale: 1,
    y: 0,
    duration: 0.4,
    delay: index * 0.05,
    ease: 'back.out(1.7)',
    onComplete: done,
  })
}

const leave = (el: Element, done: () => void) => {
  const element = el as HTMLElement
  gsap.to(element, {
    opacity: 0,
    scale: 0.5,
    y: -10,
    duration: 0.3,
    ease: 'power2.in',
    onComplete: done,
  })
}

// 组件挂载后优化性能
onMounted(() => {
  if (inputWrapper.value) {
    inputWrapper.value.style.willChange = 'transform'
  }
})
</script>

<style scoped>
.animated-input-container {
  flex: 1;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  padding: 1rem;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.input-string-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60px;
}

.input-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  justify-content: center;
  align-items: center;
}

.input-symbol {
  width: 1.8rem;
  height: 1.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-family: ui-monospace, SFMono-Regular, monospace;
  background-color: #f9fafb;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform, background-color, color, box-shadow;
  user-select: none;
  position: relative;
}

.input-symbol:hover {
  border-color: #9ca3af;
}

.input-symbol.input-current {
  background-color: #fbbf24;
  border-color: #f59e0b;
  color: #ffffff;
  box-shadow: 0 0 0 2px rgba(251, 191, 36, 0.3);
  transform: scale(1.15);
  z-index: 10;
}

.input-symbol.input-consumed {
  background-color: #f3f4f6;
  border-color: #e5e7eb;
  color: #6b7280;
  opacity: 0.7;
}

.input-symbol.input-upcoming {
  background-color: #f9fafb;
  border-color: #d1d5db;
  color: #374151;
}

.input-symbol.input-matching {
  background-color: #10b981;
  border-color: #059669;
  color: #ffffff;
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);
  transform: scale(1.3);
}

.input-symbol.input-error {
  background-color: #ef4444;
  border-color: #dc2626;
  color: #ffffff;
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.3);
}

/* Vue过渡动画类 */
.input-animation-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.input-animation-leave-active {
  transition: all 0.3s cubic-bezier(0.55, 0.06, 0.68, 0.19);
}

.input-animation-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.5);
}

.input-animation-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.5);
}

.input-animation-move {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 响应式调整 */
@media (max-width: 1024px) {
  .input-symbol {
    width: 1.6rem;
    height: 1.6rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 768px) {
  .input-symbol {
    width: 1.5rem;
    height: 1.5rem;
    font-size: 0.85rem;
  }
}
</style>
