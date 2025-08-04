<template>
  <div class="animated-stack-container" :style="{ height: `${containerHeight}px` }">
    <div class="font-semibold mb-3 text-gray-700">{{ title }}</div>
    <div class="stack-wrapper" ref="stackWrapper">
      <transition-group
        name="stack-animation"
        tag="div"
        class="stack-container"
        @before-enter="beforeEnter"
        @enter="enter"
        @leave="leave"
        @before-leave="beforeLeave"
      >
        <div
          v-for="(item, index) in visibleStack"
          :key="item.id"
          :data-index="index"
          class="stack-item"
          :class="[
            item.state,
            {
              'stack-top': index === 0,
              'stack-entering': item.state === 'entering',
              'stack-leaving': item.state === 'leaving',
              'stack-highlighting': item.state === 'highlighting',
            },
          ]"
          :style="{
            zIndex: visibleStack.length - index,
            transform: `translateY(${index * stackItemHeight}px)`,
          }"
        >
          {{ item.value }}
        </div>
      </transition-group>
    </div>
    <div class="text-xs text-gray-400 mt-2">栈底 #</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { gsap } from 'gsap'

interface StackItem {
  id: string
  value: string
  state: 'normal' | 'entering' | 'leaving' | 'highlighting'
}

interface StackAnimation {
  type: 'push' | 'pop' | 'multiple-push' | 'multiple-pop'
  items: string | string[]
  delay?: number
}

const props = defineProps<{
  title: string
  stack: string[]
  highlightTop?: boolean
  highlightColor?: string
}>()

const emit = defineEmits<{
  animationComplete: []
}>()

// 响应式数据
const stackWrapper = ref<HTMLElement>()
const visibleStack = ref<StackItem[]>([])
const animationQueue = ref<StackAnimation[]>([])
const isAnimating = ref(false)

// 常量配置
const stackItemHeight = 32 // 1.8rem + gap
const baseHeight = 160 // 基础容器高度
const maxItems = 8 // 最大可见栈项数

// 计算属性
const containerHeight = computed(() => {
  const itemsCount = Math.min(visibleStack.value.length, maxItems)
  return baseHeight + itemsCount * stackItemHeight
})

// 生成唯一ID
let itemIdCounter = 0
const generateItemId = (value: string, index: number) => {
  return `stack-item-${itemIdCounter++}-${value}-${index}`
}

// 栈项状态管理
const createStackItem = (value: string, state: 'normal' | 'entering' = 'normal'): StackItem => ({
  id: generateItemId(value, visibleStack.value.length),
  value,
  state,
})

// 初始化栈
const initializeStack = (stack: string[]) => {
  visibleStack.value = stack.map((value) => createStackItem(value))
}

// 动画队列管理（简化版本）
const queueAnimation = (animation: StackAnimation) => {
  // 暂时禁用复杂的动画队列
  // animationQueue.value.push(animation)
  // if (!isAnimating.value) {
  //   processAnimationQueue()
  // }
}

// 分析栈变化（简化版本，暂时不使用）
const analyzeStackChanges = (oldStack: string[], newStack: string[]) => {
  // 暂时禁用复杂的差异分析
  /*
  const oldLength = oldStack.length
  const newLength = newStack.length

  if (newLength > oldLength) {
    // 入栈操作
    const newItems = newStack.slice(oldLength)
    if (newItems.length === 1) {
      queueAnimation({ type: 'push', items: newItems[0] })
    } else {
      queueAnimation({ type: 'multiple-push', items: newItems })
    }
  } else if (newLength < oldLength) {
    // 出栈操作
    const removedCount = oldLength - newLength
    if (removedCount === 1) {
      queueAnimation({ type: 'pop', items: '' })
    } else {
      queueAnimation({ type: 'multiple-pop', items: Array(removedCount).fill('') })
    }
  }
  */
}

// 监听栈数据变化
watch(
  () => props.stack,
  (newStack, oldStack) => {
    console.log('AnimatedStack: Stack changed from', oldStack, 'to', newStack)

    // 简化逻辑：直接更新显示，不做复杂的差异分析
    if (!oldStack || oldStack.length === 0) {
      // 初始化栈
      initializeStack(newStack)
    } else {
      // 直接更新栈显示，添加简单的过渡效果
      updateStackDirectly(newStack)
    }
  },
  { immediate: true },
)

// 直接更新栈显示
const updateStackDirectly = (newStack: string[]) => {
  // 直接替换整个栈，让Vue的transition-group处理动画
  visibleStack.value = newStack.map((value, index) => createStackItem(value))

  // 触发简单的完成回调
  nextTick(() => {
    emit('animationComplete')
  })
}

// 注释掉复杂的动画队列处理，使用简化版本
/*
const processAnimationQueue = async () => {
  if (animationQueue.value.length === 0 || isAnimating.value) return

  isAnimating.value = true

  while (animationQueue.value.length > 0) {
    const animation = animationQueue.value.shift()!
    await executeAnimation(animation)
    await new Promise((resolve) => setTimeout(resolve, animation.delay || 100))
  }

  isAnimating.value = false
  emit('animationComplete')
}

// 执行具体动画
const executeAnimation = async (animation: StackAnimation): Promise<void> => {
  switch (animation.type) {
    case 'push':
      return animatePush(animation.items as string)
    case 'pop':
      return animatePop()
    case 'multiple-push':
      return animateMultiplePush(animation.items as string[])
    case 'multiple-pop':
      return animateMultiplePop((animation.items as string[]).length)
  }
}
*/

// 入栈动画
const animatePush = async (value: string): Promise<void> => {
  return new Promise((resolve) => {
    // 第一阶段：创建新元素并准备入栈
    const newItem = createStackItem(value, 'entering')
    visibleStack.value.unshift(newItem)

    nextTick(() => {
      // 第二阶段：元素飞入动画
      const element = stackWrapper.value?.querySelector(`[data-index="0"]`) as HTMLElement
      if (element) {
        gsap.fromTo(
          element,
          {
            x: -60,
            y: -20,
            scale: 0.8,
            opacity: 0,
            rotationY: -15,
          },
          {
            x: 0,
            y: 0,
            scale: 1,
            opacity: 1,
            rotationY: 0,
            duration: 0.4,
            ease: 'back.out(1.7)',
            onComplete: () => {
              // 第三阶段：高亮显示
              newItem.state = 'highlighting'
              gsap.to(element, {
                backgroundColor: props.highlightColor || '#dbeafe',
                duration: 0.2,
                ease: 'power2.out',
                onComplete: () => {
                  // 第四阶段：恢复正常状态
                  setTimeout(() => {
                    newItem.state = 'normal'
                    gsap.to(element, {
                      backgroundColor: '#f9fafb',
                      duration: 0.3,
                      ease: 'power2.out',
                      onComplete: resolve,
                    })
                  }, 300)
                },
              })
            },
          },
        )
      } else {
        resolve()
      }
    })
  })
}

// 出栈动画
const animatePop = async (): Promise<void> => {
  return new Promise((resolve) => {
    if (visibleStack.value.length === 0) {
      resolve()
      return
    }

    // 第一阶段：高亮要出栈的元素
    const topItem = visibleStack.value[0]
    topItem.state = 'highlighting'

    const element = stackWrapper.value?.querySelector(`[data-index="0"]`) as HTMLElement
    if (element) {
      gsap.to(element, {
        backgroundColor: '#fef3c7',
        duration: 0.2,
        ease: 'power2.out',
        onComplete: () => {
          // 第二阶段：元素飞出动画
          topItem.state = 'leaving'
          gsap.to(element, {
            x: 60,
            y: -30,
            scale: 0.6,
            opacity: 0,
            rotationY: 15,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
              // 第三阶段：从数据中移除
              visibleStack.value.shift()
              resolve()
            },
          })
        },
      })
    } else {
      visibleStack.value.shift()
      resolve()
    }
  })
}

// 多元素入栈动画
const animateMultiplePush = async (values: string[]): Promise<void> => {
  for (let i = 0; i < values.length; i++) {
    await animatePush(values[i])
    if (i < values.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
  }
}

// 多元素出栈动画
const animateMultiplePop = async (count: number): Promise<void> => {
  for (let i = 0; i < count; i++) {
    await animatePop()
    if (i < count - 1) {
      await new Promise((resolve) => setTimeout(resolve, 80))
    }
  }
}

// Vue 过渡钩子
const beforeEnter = (el: Element) => {
  const element = el as HTMLElement
  gsap.set(element, {
    opacity: 0,
    scale: 0.8,
    y: -15,
  })
}

const enter = (el: Element, done: () => void) => {
  const element = el as HTMLElement
  gsap.to(element, {
    opacity: 1,
    scale: 1,
    y: 0,
    duration: 0.3,
    ease: 'back.out(1.7)',
    onComplete: done,
  })
}

const beforeLeave = (el: Element) => {
  const element = el as HTMLElement
  gsap.set(element, {
    position: 'absolute',
    width: element.offsetWidth,
    height: element.offsetHeight,
  })
}

const leave = (el: Element, done: () => void) => {
  const element = el as HTMLElement
  gsap.to(element, {
    opacity: 0,
    scale: 0.6,
    x: 60,
    y: -20,
    duration: 0.3,
    ease: 'power2.in',
    onComplete: done,
  })
}

// 组件挂载后初始化
onMounted(() => {
  // 设置容器的will-change属性以优化性能
  if (stackWrapper.value) {
    stackWrapper.value.style.willChange = 'transform'
  }
})
</script>

<style scoped>
.animated-stack-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  padding: 1rem;
  min-width: 100px;
  max-width: 140px;
  transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: height;
}

.stack-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 100px;
  max-height: 300px;
  overflow: hidden;
  position: relative;
  width: 100%;
}

.stack-container {
  position: relative;
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  gap: 2px;
}

.stack-item {
  width: 3rem;
  height: 1.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e5e7eb;
  font-size: 1rem;
  font-family: ui-monospace, SFMono-Regular, monospace;
  border-radius: 0.375rem;
  background-color: #f9fafb;
  position: relative;
  will-change: transform, opacity, background-color;
  user-select: none;
}

.stack-item.stack-top {
  border-color: #9ca3af;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stack-item.stack-entering {
  background-color: #dbeafe;
  border-color: #3b82f6;
}

.stack-item.stack-highlighting {
  background-color: #fef3c7;
  border-color: #f59e0b;
  box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2);
}

.stack-item.stack-leaving {
  background-color: #fee2e2;
  border-color: #ef4444;
}

/* Vue过渡动画类 */
.stack-animation-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.stack-animation-leave-active {
  transition: all 0.3s cubic-bezier(0.55, 0.06, 0.68, 0.19);
}

.stack-animation-enter-from {
  opacity: 0;
  transform: translateX(-60px) translateY(-20px) scale(0.8) rotateY(-15deg);
}

.stack-animation-leave-to {
  opacity: 0;
  transform: translateX(60px) translateY(-30px) scale(0.6) rotateY(15deg);
}

.stack-animation-move {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 响应式调整 */
@media (max-width: 1024px) {
  .stack-item {
    width: 2.5rem;
    height: 1.6rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 768px) {
  .stack-item {
    width: 2.2rem;
    height: 1.5rem;
    font-size: 0.85rem;
  }
}
</style>
