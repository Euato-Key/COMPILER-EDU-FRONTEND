<template>
  <div class="animated-input-container">
    <div class="font-semibold mb-3 text-gray-700">{{ title }}</div>
    <div class="input-wrapper" ref="inputWrapper">
      <div class="input-display">
        <div
          v-for="(char, index) in visibleInput"
          :key="`char-${index}`"
          :ref="(el) => setCharRef(el, index)"
          class="input-char"
          :class="{
            'char-current': index === currentPointer,
            'char-consumed': index < currentPointer,
            'char-pending': index > currentPointer,
            'char-matching': index === currentPointer && isCurrentMatching,
            'char-error': hasError && index === currentPointer,
          }"
          :style="{
            transform: getCharTransform(index),
            opacity: getCharOpacity(index),
          }"
        >
          {{ char }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { gsap } from 'gsap'

const props = defineProps<{
  title: string
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
const charRefs = ref<(HTMLElement | null)[]>([])
const currentPointer = ref(0)
const isCurrentMatching = ref(false)
const hasError = ref(false)
const animationTimeline = ref<gsap.core.Timeline | null>(null)

// 计算属性
const visibleInput = computed(() => props.input || [])

// 工具函数
const setCharRef = (el: any, index: number) => {
  if (el && el.$el) {
    charRefs.value[index] = el.$el as HTMLElement
  } else if (el) {
    charRefs.value[index] = el as HTMLElement
  }
}

const getCharTransform = (index: number) => {
  if (index === currentPointer.value) {
    return 'scale(1.2)'
  } else if (index < currentPointer.value) {
    return 'scale(0.9)'
  }
  return 'scale(1)'
}

const getCharOpacity = (index: number) => {
  if (index < currentPointer.value) {
    return 0.5
  }
  return 1
}

// 动画函数（必须在watch之前定义）
const animatePointerMove = async (newPointer: number, oldPointer: number) => {
  if (animationTimeline.value) {
    animationTimeline.value.kill()
  }

  const tl = gsap.timeline()
  animationTimeline.value = tl

  // 如果有旧的当前字符，先恢复
  if (oldPointer >= 0 && oldPointer < charRefs.value.length) {
    const oldChar = charRefs.value[oldPointer]
    if (oldChar) {
      tl.to(oldChar, {
        scale: 0.9,
        opacity: 0.5,
        color: '#9ca3af',
        duration: 0.2,
        ease: 'power2.out',
      })
    }
  }

  // 更新指针位置
  tl.call(() => {
    currentPointer.value = newPointer
  })

  // 如果有新的当前字符，高亮显示
  if (newPointer >= 0 && newPointer < charRefs.value.length) {
    const newChar = charRefs.value[newPointer]
    if (newChar) {
      tl.to(
        newChar,
        {
          scale: 1.2,
          opacity: 1,
          color: '#f59e0b',
          backgroundColor: '#fef3c7',
          duration: 0.3,
          ease: 'back.out(1.7)',
        },
        '-=0.1',
      )
    }
  }

  tl.call(() => {
    emit('animationComplete')
  })
}

const animateMatching = async () => {
  if (currentPointer.value < 0 || currentPointer.value >= charRefs.value.length) return

  const currentChar = charRefs.value[currentPointer.value]
  if (!currentChar) return

  isCurrentMatching.value = true

  // 匹配成功动画
  await new Promise<void>((resolve) => {
    gsap.to(currentChar, {
      backgroundColor: '#dcfce7',
      color: '#16a34a',
      scale: 1.3,
      boxShadow: '0 0 10px rgba(34, 197, 94, 0.3)',
      duration: 0.3,
      ease: 'power2.out',
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        isCurrentMatching.value = false
        resolve()
      },
    })
  })

  emit('animationComplete')
}

const animateError = async () => {
  if (currentPointer.value < 0 || currentPointer.value >= charRefs.value.length) return

  const currentChar = charRefs.value[currentPointer.value]
  if (!currentChar) return

  hasError.value = true

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
        hasError.value = false
        resolve()
      },
    })
  })

  emit('animationComplete')
}

const initializeInput = () => {
  currentPointer.value = props.pointer
  isCurrentMatching.value = !!props.isMatching
  hasError.value = !!props.hasError
}

// 监听器（必须在函数定义之后）
watch(
  () => props.pointer,
  (newPointer, oldPointer) => {
    if (newPointer !== oldPointer) {
      animatePointerMove(newPointer, oldPointer || 0)
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
  min-height: 60px;
  width: 100%;
}

.input-display {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-size: 1.125rem;
  min-height: 3rem;
  overflow-x: auto;
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

.input-char.char-current {
  background-color: #fef3c7;
  color: #f59e0b;
  border: 1px solid #f59e0b;
  box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2);
}

.input-char.char-consumed {
  background-color: #f3f4f6;
  color: #9ca3af;
  opacity: 0.6;
}

.input-char.char-pending {
  background-color: transparent;
  color: #374151;
}

.input-char.char-matching {
  background-color: #dcfce7 !important;
  color: #16a34a !important;
  border: 1px solid #16a34a;
  box-shadow: 0 0 10px rgba(34, 197, 94, 0.3);
}

.input-char.char-error {
  background-color: #fee2e2 !important;
  color: #dc2626 !important;
  border: 1px solid #dc2626;
  box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.2);
}

/* 响应式调整 */
@media (max-width: 1024px) {
  .input-char {
    min-width: 1.25rem;
    height: 1.75rem;
    font-size: 1rem;
  }
}

@media (max-width: 768px) {
  .input-char {
    min-width: 1rem;
    height: 1.5rem;
    font-size: 0.9rem;
  }
}
</style>
