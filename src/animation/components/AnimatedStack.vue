<template>
  <div
    :class="cn(
      stackContainerVariants({
        size: size || 'md',
        theme: theme || 'default'
      }),
      'animated-stack-container'
    )"
    :style="{ height: `${containerHeight}px` }"
  >
    <!-- 栈标题 -->
    <div class="font-semibold mb-3 text-gray-700 text-sm">{{ title }}</div>

    <!-- 栈容器外壳 -->
    <div class="stack-shell" ref="stackWrapper">
      <!-- 栈底座 -->
      <div class="stack-base"></div>

      <!-- 栈内容区域 -->
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
          :class="cn(
            stackItemVariants({
              state: item.state,
              isTop: index === 0 && props.highlightTop,
              size: size || 'md'
            }),
            'stack-item'
          )"
          :style="{
            zIndex: visibleStack.length - index,
            position: 'absolute',
            bottom: `${(visibleStack.length - 1 - index) * (stackItemHeight + stackItemGap)}px`,
            left: '50%',
            transform: 'translateX(-50%)',
          }"
          :title="`Item ${index}: ${item.value}`"
        >
          {{ item.value }}
        </div>
      </transition-group>

      <!-- 栈侧边引导线 -->
      <div class="stack-guides">
        <div class="stack-guide-left"></div>
        <div class="stack-guide-right"></div>
      </div>
    </div>

    <!-- 栈顶指示器 -->
    <div class="text-xs text-gray-400 mt-2 flex items-center gap-1">
      <span>栈顶</span>
      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { gsap } from 'gsap'
import { cva } from 'class-variance-authority'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// 工具函数：合并类名
const cn = (...inputs: (string | undefined | null | boolean)[]) => twMerge(clsx(inputs))

// 栈元素样式变体
const stackItemVariants = cva(
  "flex items-center justify-center border font-mono transition-all will-change-transform select-none",
  {
    variants: {
      state: {
        normal: "bg-gray-50 border-gray-300",
        entering: "bg-blue-50 border-blue-400 shadow-blue-200 shadow-md",
        leaving: "bg-red-50 border-red-400 shadow-red-200 shadow-md",
        highlighting: "bg-yellow-50 border-yellow-400 shadow-yellow-200 shadow-md",
      },
      isTop: {
        true: "border-gray-400 shadow-sm ring-1 ring-blue-100",
        false: "border-gray-300"
      },
      size: {
        sm: "w-9 h-6 text-xs rounded-sm",
        md: "w-12 h-7 text-sm rounded-md",
        lg: "w-14 h-8 text-base rounded-md"
      }
    },
    defaultVariants: {
      state: "normal",
      isTop: false,
      size: "md"
    }
  }
)

// 栈容器样式变体
const stackContainerVariants = cva(
  "relative flex flex-col items-center bg-white rounded-lg shadow-sm border transition-all duration-300",
  {
    variants: {
      theme: {
        default: "border-gray-200 bg-white",
        primary: "border-blue-200 bg-blue-50/20",
        success: "border-green-200 bg-green-50/20"
      },
      size: {
        sm: "min-w-20 max-w-28 p-3",
        md: "min-w-24 max-w-32 p-4",
        lg: "min-w-28 max-w-36 p-5"
      }
    },
    defaultVariants: {
      theme: "default",
      size: "md"
    }
  }
)

interface StackItem {
  id: string
  value: string
  state: 'normal' | 'entering' | 'leaving' | 'highlighting'
  isStable?: boolean // 新增：标记是否为稳定元素
}

/*
interface StackAnimation {
  type: 'push' | 'pop' | 'multiple-push' | 'multiple-pop'
  items: string | string[]
  delay?: number
}
*/

interface StackDiff {
  toRemove: string[]
  toAdd: string[]
  unchanged: string[]
}

const props = defineProps<{
  title: string
  stack: string[]
  highlightTop?: boolean
  highlightColor?: string
  size?: 'sm' | 'md' | 'lg'
  theme?: 'default' | 'primary' | 'success'
  animationSpeed?: 'fast' | 'normal' | 'slow' | 'none'  // 新增：动画速度控制
  enablePhysics?: boolean  // 新增：是否启用物理效果
}>()

const emit = defineEmits<{
  animationComplete: []
  stackChange: [{ oldStack: string[], newStack: string[], diff: StackDiff }]  // 新增：栈变化事件
}>()

// 响应式数据
const stackWrapper = ref<HTMLElement>()
const visibleStack = ref<StackItem[]>([])
const previousStack = ref<string[]>([]) // 新增：追踪上一次的栈状态

// 动画配置
const animationConfig = computed(() => {
  const speed = props.animationSpeed || 'normal'
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (speed === 'none' || reducedMotion) {
    return {
      enterDuration: 0,
      leaveDuration: 0,
      highlightDuration: 0,
      enableBounce: false,
      enablePhysics: false
    }
  }

  const configs = {
    fast: {
      enterDuration: 0.2,
      leaveDuration: 0.15,
      highlightDuration: 0.1,
      enableBounce: false,
      enablePhysics: props.enablePhysics ?? false
    },
    normal: {
      enterDuration: 0.45,
      leaveDuration: 0.35,
      highlightDuration: 0.15,
      enableBounce: true,
      enablePhysics: props.enablePhysics ?? true
    },
    slow: {
      enterDuration: 0.8,
      leaveDuration: 0.6,
      highlightDuration: 0.25,
      enableBounce: true,
      enablePhysics: props.enablePhysics ?? true
    }
  }

  return configs[speed]
})

// 常量配置
const stackItemHeight = 28.8 // 1.8rem 实际像素值
const stackItemGap = 2 // 元素间距
const baseHeight = 160 // 基础容器高度
const maxItems = 8 // 最大可见栈项数

// 计算属性
const containerHeight = computed(() => {
  const itemsCount = Math.min(visibleStack.value.length, maxItems)
  if (itemsCount === 0) return baseHeight
  // 计算实际需要的高度：基础高度 + 元素高度 * 数量 + 间距 * (数量-1)
  const stackHeight = itemsCount * stackItemHeight + (itemsCount - 1) * stackItemGap
  return baseHeight + stackHeight
})

// 生成稳定的元素ID
let itemIdCounter = 0
const generateStableId = (value: string, position: number) => {
  return `${value}-${position}`
}

// 栈项状态管理
const createStackItem = (value: string, state: 'normal' | 'entering' = 'normal', isStable = false): StackItem => ({
  id: isStable ? generateStableId(value, visibleStack.value.length) : `temp-${itemIdCounter++}`,
  value,
  state,
  isStable,
})

// 智能栈差异检测
const analyzeStackDifference = (oldStack: string[], newStack: string[]): StackDiff => {
  const oldSet = new Set(oldStack)
  const newSet = new Set(newStack)

  // 找到需要移除的元素（在旧栈中但不在新栈中）
  const toRemove = oldStack.filter(item => !newSet.has(item))

  // 找到需要添加的元素（在新栈中但不在旧栈中）
  const toAdd = newStack.filter(item => !oldSet.has(item))

  // 找到不变的元素
  const unchanged = newStack.filter(item => oldSet.has(item))

  return { toRemove, toAdd, unchanged }
}

// 检查栈是否真的发生了变化
const isStackReallyChanged = (oldStack: string[], newStack: string[]): boolean => {
  if (oldStack.length !== newStack.length) return true
  return !oldStack.every((item, index) => item === newStack[index])
}

// 注释掉未使用的旧代码
/*
const initializeStack = (stack: string[]) => {
  console.log('AnimatedStack: initializeStack called with:', stack)
  visibleStack.value = stack.map((value) => createStackItem(value))
  console.log('AnimatedStack: visibleStack after init:', visibleStack.value)

  // 调试容器高度
  nextTick(() => {
    console.log('AnimatedStack: containerHeight:', containerHeight.value)
    console.log('AnimatedStack: stackItemHeight:', stackItemHeight)
    console.log('AnimatedStack: visibleStack.length:', visibleStack.value.length)
    if (stackWrapper.value) {
      console.log('AnimatedStack: stackWrapper offsetHeight:', stackWrapper.value.offsetHeight)
      console.log('AnimatedStack: stackWrapper scrollHeight:', stackWrapper.value.scrollHeight)
    }
  })
}

// 动画队列管理（简化版本）
const queueAnimation = (animation: StackAnimation) => {
  // 暂时禁用复杂的动画队列
}

// 分析栈变化（简化版本，暂时不使用）
const analyzeStackChanges = (oldStack: string[], newStack: string[]) => {
  // 暂时禁用复杂的差异分析
}
*/

// 执行智能栈更新
const executeIntelligentStackUpdate = async (
  newStack: string[],
  diff: StackDiff
) => {
  console.log('AnimatedStack: Executing intelligent update')

  // 触发栈变化事件
  emit('stackChange', {
    oldStack: previousStack.value,
    newStack,
    diff
  })

  // 如果是初始化，直接设置栈状态
  if (visibleStack.value.length === 0) {
    visibleStack.value = newStack.map(value => createStackItem(value, 'normal', true))
    console.log('AnimatedStack: Initial stack set:', visibleStack.value)
    return
  }

  // 如果禁用动画，直接更新
  const config = animationConfig.value
  if (config.enterDuration === 0 && config.leaveDuration === 0) {
    visibleStack.value = newStack.map(value => createStackItem(value, 'normal', true))
    emit('animationComplete')
    return
  }

  // 准备动画序列
  const animationPromises: Promise<void>[] = []

  // 第一阶段：标记要移除的元素并启动离开动画
  for (const item of visibleStack.value) {
    if (diff.toRemove.includes(item.value)) {
      item.state = 'leaving'
      // 为每个离开的元素创建动画
      animationPromises.push(animateElementLeave(item))
    }
  }

  // 第二阶段：添加新元素并启动进入动画
  for (const newValue of diff.toAdd) {
    const newItem = createStackItem(newValue, 'entering')
    // 找到正确的插入位置
    const targetIndex = newStack.indexOf(newValue)
    visibleStack.value.splice(targetIndex, 0, newItem)
    // 为新元素创建动画
    animationPromises.push(animateElementEnter(newItem, targetIndex))
  }

  // 等待所有动画完成
  await Promise.all(animationPromises)

  // 第三阶段：清理离开的元素并稳定状态
  visibleStack.value = visibleStack.value.filter(item => item.state !== 'leaving')

  // 更新所有元素状态为正常
  visibleStack.value.forEach(item => {
    if (item.state === 'entering') {
      item.state = 'normal'
      item.isStable = true
    }
  })

  emit('animationComplete')
}

// 元素进入动画 - 优化版
const animateElementEnter = async (item: StackItem, targetIndex: number): Promise<void> => {
  return new Promise((resolve) => {
    const config = animationConfig.value

    // 等待DOM更新
    nextTick(() => {
      const element = stackWrapper.value?.querySelector(`[data-index="${targetIndex}"]`) as HTMLElement
      if (!element) {
        resolve()
        return
      }

      // 如果禁用动画，直接完成
      if (config.enterDuration === 0) {
        item.state = 'normal'
        resolve()
        return
      }

      // 三阶段入栈动画
      // 阶段1: 元素从栈上方开始，带有发光效果
      gsap.set(element, {
        opacity: 0,
        scale: 0.7,
        y: -40,
        rotationX: config.enablePhysics ? -20 : 0,
        transformOrigin: 'center center',
        filter: config.enablePhysics ? 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))' : 'none'
      })

      // 阶段2: 高亮显示阶段
      gsap.to(element, {
        opacity: 1,
        scale: config.enableBounce ? 1.1 : 1,
        y: config.enableBounce ? -15 : -5,
        rotationX: 0,
        duration: config.highlightDuration,
        ease: 'power2.out',
        onComplete: () => {
          // 阶段3: 下落到最终位置
          gsap.to(element, {
            scale: 1,
            y: 0,
            filter: config.enablePhysics ? 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))' : 'none',
            duration: config.enterDuration - config.highlightDuration,
            ease: config.enableBounce ? 'bounce.out' : 'power2.out',
            onComplete: () => {
              item.state = 'normal'
              resolve()
            }
          })
        }
      })
    })
  })
}

// 元素离开动画 - 优化版
const animateElementLeave = async (item: StackItem): Promise<void> => {
  return new Promise((resolve) => {
    const config = animationConfig.value
    const itemIndex = visibleStack.value.findIndex(stackItem => stackItem.id === item.id)

    if (itemIndex === -1) {
      resolve()
      return
    }

    const element = stackWrapper.value?.querySelector(`[data-index="${itemIndex}"]`) as HTMLElement
    if (!element) {
      resolve()
      return
    }

    // 如果禁用动画，直接完成
    if (config.leaveDuration === 0) {
      resolve()
      return
    }

    // 两阶段出栈动画
    // 阶段1: 高亮显示
    gsap.to(element, {
      scale: config.enableBounce ? 1.05 : 1,
      filter: config.enablePhysics ? 'drop-shadow(0 0 12px rgba(239, 68, 68, 0.6))' : 'none',
      backgroundColor: '#fef2f2',
      borderColor: '#fca5a5',
      duration: config.highlightDuration,
      ease: 'power2.out',
      onComplete: () => {
        // 阶段2: 飞出动画
        const randomX = config.enablePhysics ? Math.random() * 20 - 10 : 0
        const randomRotation = config.enablePhysics ? Math.random() * 30 - 15 : 0

        gsap.to(element, {
          opacity: 0,
          scale: 0.6,
          y: -50,
          x: randomX,
          rotationX: config.enablePhysics ? 25 : 0,
          rotationZ: randomRotation,
          filter: 'drop-shadow(0 0 0px rgba(239, 68, 68, 0))',
          duration: config.leaveDuration - config.highlightDuration,
          ease: 'power2.in',
          onComplete: resolve
        })
      }
    })
  })
}

// 智能栈更新系统
watch(
  () => props.stack,
  (newStack, oldStack = []) => {
    console.log('AnimatedStack: Stack changed from', oldStack, 'to', newStack)

    // 检查是否真的发生了变化
    if (!isStackReallyChanged(oldStack, newStack)) {
      console.log('AnimatedStack: No real change detected, skipping animation')
      return
    }

    // 分析栈的差异
    const diff = analyzeStackDifference(oldStack, newStack)
    console.log('AnimatedStack: Stack difference analysis:', diff)

    // 执行智能更新
    executeIntelligentStackUpdate(newStack, diff)

    // 更新上一次栈状态
    previousStack.value = [...newStack]
  },
  { immediate: true }
)

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

// 保留这些动画函数以备将来使用
/*
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
            x: 0,
            y: -60,
            scale: 0.8,
            opacity: 0,
            rotationX: -15,
          },
          {
            x: 0,
            y: 0,
            scale: 1,
            opacity: 1,
            rotationX: 0,
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
            x: 0,
            y: -60,
            scale: 0.6,
            opacity: 0,
            rotationX: 15,
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
*/

// 注释掉未使用的多元素动画方法
/*
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
*/

// Vue 过渡钩子 - 优化版
const beforeEnter = (el: Element) => {
  const element = el as HTMLElement
  // 为新进入的元素设置初始状态
  gsap.set(element, {
    opacity: 0,
    scale: 0.7,
    y: -40,
    rotationX: -20,
    transformOrigin: 'center center',
    filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))'
  })
}

const enter = (el: Element, done: () => void) => {
  const element = el as HTMLElement

  // 创建更自然的进入动画序列
  const tl = gsap.timeline({
    onComplete: done
  })

  // 第一阶段：快速显现并轻微放大
  tl.to(element, {
    opacity: 1,
    scale: 1.1,
    y: -15,
    rotationX: 0,
    duration: 0.15,
    ease: 'power2.out'
  })

  // 第二阶段：回弹到最终位置
  tl.to(element, {
    scale: 1,
    y: 0,
    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
    duration: 0.3,
    ease: 'back.out(1.2)'
  })
}

const beforeLeave = (el: Element) => {
  const element = el as HTMLElement
  // 为离开动画准备元素
  gsap.set(element, {
    position: 'absolute',
    width: element.offsetWidth,
    height: element.offsetHeight,
    transformOrigin: 'center center'
  })
}

const leave = (el: Element, done: () => void) => {
  const element = el as HTMLElement

  // 创建两阶段离开动画
  const tl = gsap.timeline({
    onComplete: done
  })

  // 第一阶段：高亮
  tl.to(element, {
    scale: 1.05,
    filter: 'drop-shadow(0 0 12px rgba(239, 68, 68, 0.6))',
    backgroundColor: '#fef2f2',
    borderColor: '#fca5a5',
    duration: 0.15,
    ease: 'power2.out'
  })

  // 第二阶段：飞出
  tl.to(element, {
    opacity: 0,
    scale: 0.6,
    y: -50,
    x: Math.random() * 20 - 10,
    rotationX: 25,
    rotationZ: Math.random() * 30 - 15,
    filter: 'drop-shadow(0 0 0px rgba(239, 68, 68, 0))',
    duration: 0.35,
    ease: 'power2.in'
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
/* 基础容器样式 - 使用CVA变体系统 */
.animated-stack-container {
  will-change: height;
}

/* 栈外壳容器 */
.stack-shell {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 100px;
  max-height: 300px;
  width: 100%;
  padding: 8px;

  /* 栈外壳边框 */
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background: linear-gradient(to bottom, #f9fafb 0%, #f3f4f6 100%);

  /* 内阴影营造深度感 */
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.06);
}

/* 栈底座 */
.stack-base {
  position: absolute;
  bottom: 6px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 16px);
  height: 4px;
  background: linear-gradient(to right, #d1d5db, #9ca3af, #d1d5db);
  border-radius: 2px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* 栈容器 */
.stack-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  z-index: 1;
}

/* 栈侧边引导线 */
.stack-guides {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  pointer-events: none;
}

.stack-guide-left,
.stack-guide-right {
  position: absolute;
  top: 8px;
  bottom: 12px;
  width: 2px;
  background: linear-gradient(to bottom, transparent 0%, #d1d5db 20%, #d1d5db 80%, transparent 100%);
  opacity: 0.6;
}

.stack-guide-left {
  left: 12px;
}

.stack-guide-right {
  right: 12px;
}

/* 栈元素基础样式由CVA变体系统处理，这里只处理特殊情况 */
.stack-item {
  /* 为GSAP动画提供基础定位点 */
  transform-origin: center center;
}

/* Vue过渡动画类 - 优化版 */
.stack-animation-enter-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.stack-animation-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0.06, 0.68, 0.19);
  position: absolute !important;
}

.stack-animation-enter-from {
  opacity: 0;
  transform: translateY(-50px) scale(0.7) rotateX(-20deg);
  filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.5));
}

.stack-animation-leave-to {
  opacity: 0;
  transform: translateY(-50px) scale(0.6) rotateX(25deg) rotateZ(10deg);
  filter: drop-shadow(0 0 0px rgba(239, 68, 68, 0));
}

.stack-animation-move {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 状态相关的动画效果 */
.stack-item[data-state="entering"] {
  animation: stack-item-enter 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.stack-item[data-state="leaving"] {
  animation: stack-item-leave 0.5s cubic-bezier(0.55, 0.06, 0.68, 0.19) forwards;
}

.stack-item[data-state="highlighting"] {
  animation: stack-item-highlight 0.3s ease-in-out infinite alternate;
}

@keyframes stack-item-enter {
  0% {
    opacity: 0;
    transform: translateY(-50px) scale(0.7) rotateX(-20deg);
    filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.5));
  }
  30% {
    opacity: 1;
    transform: translateY(-15px) scale(1.1) rotateX(0deg);
    filter: drop-shadow(0 0 12px rgba(59, 130, 246, 0.7));
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1) rotateX(0deg);
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  }
}

@keyframes stack-item-leave {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1) rotateX(0deg);
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  }
  30% {
    opacity: 1;
    transform: translateY(0) scale(1.05) rotateX(0deg);
    filter: drop-shadow(0 0 12px rgba(239, 68, 68, 0.6));
  }
  100% {
    opacity: 0;
    transform: translateY(-50px) scale(0.6) rotateX(25deg);
    filter: drop-shadow(0 0 0px rgba(239, 68, 68, 0));
  }
}

@keyframes stack-item-highlight {
  0% {
    filter: drop-shadow(0 0 8px rgba(251, 191, 36, 0.4));
    transform: scale(1);
  }
  100% {
    filter: drop-shadow(0 0 16px rgba(251, 191, 36, 0.8));
    transform: scale(1.02);
  }
}

/* 增强栈外壳视觉效果 */
.stack-shell {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 100px;
  max-height: 300px;
  width: 100%;
  padding: 8px;

  /* 增强的栈外壳边框 */
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: linear-gradient(to bottom, #f9fafb 0%, #f3f4f6 50%, #e5e7eb 100%);

  /* 更深的内阴影营造深度感 */
  box-shadow:
    inset 0 2px 6px rgba(0, 0, 0, 0.08),
    inset 0 0 0 1px rgba(255, 255, 255, 0.1),
    0 1px 3px rgba(0, 0, 0, 0.05);

  /* 微妙的纹理效果 */
  position: relative;
}

.stack-shell::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(0, 0, 0, 0.02) 0%, transparent 50%);
  border-radius: 10px;
  pointer-events: none;
}

/* 增强栈底座 */
.stack-base {
  position: absolute;
  bottom: 6px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 16px);
  height: 4px;
  background: linear-gradient(to right,
    #d1d5db 0%,
    #9ca3af 20%,
    #6b7280 50%,
    #9ca3af 80%,
    #d1d5db 100%
  );
  border-radius: 2px;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

/* 响应式调整 */
@media (max-width: 1024px) {
  .stack-shell {
    padding: 6px;
    min-height: 80px;
  }

  .stack-base {
    height: 3px;
    bottom: 4px;
  }

  .stack-guide-left,
  .stack-guide-right {
    width: 1.5px;
  }

  .stack-guide-left {
    left: 8px;
  }

  .stack-guide-right {
    right: 8px;
  }
}

@media (max-width: 768px) {
  .stack-shell {
    padding: 4px;
    min-height: 70px;
  }

  .stack-base {
    height: 2px;
    bottom: 3px;
  }

  .stack-guide-left,
  .stack-guide-right {
    width: 1px;
    top: 6px;
    bottom: 8px;
  }

  .stack-guide-left {
    left: 6px;
  }

  .stack-guide-right {
    right: 6px;
  }
}

/* 开发模式调试样式 */
@media (max-width: 0px) { /* 永远不会匹配，用于条件编译 */
  .debug-stack-item {
    outline: 1px dashed red;
  }
}
</style>
