<template>
  <div class="p-8 space-y-8">
    <h1 class="text-2xl font-bold text-gray-800">AnimatedStack 组件测试</h1>

    <!-- 控制面板 -->
    <div class="bg-white p-4 rounded-lg shadow border">
      <h2 class="text-lg font-semibold mb-4">控制面板</h2>
      <div class="flex flex-wrap gap-4 items-center">
        <button
          @click="pushElement"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          入栈 (Push)
        </button>

        <button
          @click="popElement"
          class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          :disabled="testStack.length === 0"
        >
          出栈 (Pop)
        </button>

        <button
          @click="clearStack"
          class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          清空栈
        </button>

        <button
          @click="setComplexStack"
          class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          设置复杂栈
        </button>

        <div class="flex items-center gap-2">
          <label class="text-sm font-medium">尺寸:</label>
          <select v-model="selectedSize" class="px-2 py-1 border rounded">
            <option value="sm">小</option>
            <option value="md">中</option>
            <option value="lg">大</option>
          </select>
        </div>

        <div class="flex items-center gap-2">
          <label class="text-sm font-medium">主题:</label>
          <select v-model="selectedTheme" class="px-2 py-1 border rounded">
            <option value="default">默认</option>
            <option value="primary">主要</option>
            <option value="success">成功</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 栈测试区域 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <!-- 基础栈 -->
      <div class="space-y-4">
        <h3 class="text-lg font-semibold">基础栈测试</h3>
        <AnimatedStack
          title="测试栈"
          :stack="testStack"
          :size="selectedSize"
          :theme="selectedTheme"
          :highlight-top="true"
          highlight-color="#dbeafe"
          @animation-complete="onAnimationComplete"
        />
        <div class="text-sm text-gray-600">
          当前栈: {{ testStack.join(', ') || '空' }}
        </div>
      </div>

      <!-- 自动变化栈 -->
      <div class="space-y-4">
        <h3 class="text-lg font-semibold">自动变化栈</h3>
        <AnimatedStack
          title="自动栈"
          :stack="autoStack"
          :size="selectedSize"
          theme="primary"
          :highlight-top="true"
          highlight-color="#dcfce7"
        />
        <div class="flex gap-2">
          <button
            @click="startAutoDemo"
            class="px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600"
            :disabled="isAutoRunning"
          >
            开始自动演示
          </button>
          <button
            @click="stopAutoDemo"
            class="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
            :disabled="!isAutoRunning"
          >
            停止演示
          </button>
        </div>
      </div>

      <!-- 比较栈 -->
      <div class="space-y-4">
        <h3 class="text-lg font-semibold">比较测试</h3>
        <AnimatedStack
          title="比较栈"
          :stack="compareStack"
          :size="selectedSize"
          theme="success"
          :highlight-top="true"
          highlight-color="#fef3c7"
        />
        <button
          @click="toggleCompareStack"
          class="px-3 py-1 bg-orange-500 text-white text-sm rounded hover:bg-orange-600"
        >
          切换状态
        </button>
      </div>
    </div>

    <!-- 日志区域 -->
    <div class="bg-gray-50 p-4 rounded-lg">
      <h3 class="text-lg font-semibold mb-2">动画日志</h3>
      <div class="text-sm text-gray-700 space-y-1 max-h-32 overflow-y-auto">
        <div v-for="(log, index) in animationLogs" :key="index">
          {{ log }}
        </div>
      </div>
      <button
        @click="clearLogs"
        class="mt-2 px-2 py-1 bg-gray-400 text-white text-xs rounded hover:bg-gray-500"
      >
        清空日志
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import AnimatedStack from '@/animation/components/AnimatedStack.vue'

// 响应式数据
const testStack = ref<string[]>(['#'])
const autoStack = ref<string[]>(['0'])
const compareStack = ref<string[]>(['A', 'B'])
const selectedSize = ref<'sm' | 'md' | 'lg'>('md')
const selectedTheme = ref<'default' | 'primary' | 'success'>('default')
const animationLogs = ref<string[]>([])
const isAutoRunning = ref(false)

// 自动演示相关
let autoInterval: number | null = null
const autoElements = ['0', '1', '2', 'A', 'B', 'C', 'X', 'Y', 'Z']
let autoStep = 0

// 添加日志
const addLog = (message: string) => {
  const timestamp = new Date().toLocaleTimeString()
  animationLogs.value.unshift(`[${timestamp}] ${message}`)
  if (animationLogs.value.length > 50) {
    animationLogs.value = animationLogs.value.slice(0, 50)
  }
}

// 栈操作方法
const pushElement = () => {
  const elements = ['A', 'B', 'C', 'D', 'E', 'F', '0', '1', '2', '3', 'X', 'Y', 'Z']
  const randomElement = elements[Math.floor(Math.random() * elements.length)]
  testStack.value = [randomElement, ...testStack.value]
  addLog(`入栈元素: ${randomElement}`)
}

const popElement = () => {
  if (testStack.value.length > 0) {
    const popped = testStack.value[0]
    testStack.value = testStack.value.slice(1)
    addLog(`出栈元素: ${popped}`)
  }
}

const clearStack = () => {
  testStack.value = []
  addLog('清空栈')
}

const setComplexStack = () => {
  testStack.value = ['E', 'D', 'C', 'B', 'A', '#']
  addLog('设置复杂栈: E, D, C, B, A, #')
}

// 自动演示
const startAutoDemo = () => {
  if (isAutoRunning.value) return

  isAutoRunning.value = true
  autoStep = 0
  addLog('开始自动演示')

  autoInterval = window.setInterval(() => {
    const shouldPush = Math.random() > 0.3 || autoStack.value.length < 2

    if (shouldPush) {
      // 入栈操作
      const element = autoElements[autoStep % autoElements.length]
      autoStack.value = [element, ...autoStack.value]
      addLog(`自动入栈: ${element}`)
      autoStep++
    } else {
      // 出栈操作
      if (autoStack.value.length > 1) {
        const popped = autoStack.value[0]
        autoStack.value = autoStack.value.slice(1)
        addLog(`自动出栈: ${popped}`)
      }
    }
  }, 2000)
}

const stopAutoDemo = () => {
  if (autoInterval) {
    clearInterval(autoInterval)
    autoInterval = null
  }
  isAutoRunning.value = false
  addLog('停止自动演示')
}

// 比较栈切换
const toggleCompareStack = () => {
  if (compareStack.value.length === 2) {
    compareStack.value = ['X', 'Y', 'Z', 'A', 'B']
    addLog('切换比较栈到: X, Y, Z, A, B')
  } else {
    compareStack.value = ['A', 'B']
    addLog('切换比较栈到: A, B')
  }
}

// 动画完成回调
const onAnimationComplete = () => {
  addLog('动画完成')
}

// 清空日志
const clearLogs = () => {
  animationLogs.value = []
}

// 组件卸载时清理
onUnmounted(() => {
  stopAutoDemo()
})
</script>

<style scoped>
/* 测试页面样式 */
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
