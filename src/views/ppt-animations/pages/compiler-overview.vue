<template>
  <div class="compiler-overview-page min-h-screen theme-main-bg theme-transition">
    <!-- 头部导航 -->
    <header class="fixed top-0 left-0 right-0 z-50 theme-header-bg backdrop-blur-sm border-b theme-header-border">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <router-link to="/ppt-animations" class="flex items-center gap-2 theme-header-text hover:opacity-80 transition-colors">
              <Icon icon="lucide:arrow-left" class="w-5 h-5" />
              返回PPT主页
            </router-link>
            <h1 class="text-2xl font-bold theme-header-text">编译原理概述</h1>
          </div>
          <div class="flex items-center gap-2">
            <ThemeSelector />
            <div class="flex items-center gap-2 text-sm text-gray-600">
              <span>{{ currentStep + 1 }} / {{ totalSteps }}</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容 -->
    <main class="max-w-6xl mx-auto px-4 py-16 mt-20">
      <!-- 动画内容区域 -->
      <div class="bg-white rounded-xl shadow-lg p-8 mb-8 min-h-[600px] relative overflow-hidden">
        <!-- 步骤1: 标题页 -->
        <div v-if="currentStep === 0" class="text-center h-full flex flex-col justify-center items-center">
          <div class="mb-8">
            <Icon icon="lucide:book-open" class="w-24 h-24 text-blue-600 mb-6" />
            <h2 class="text-4xl font-bold text-gray-900 mb-4 animate-fade-in">
              编译原理概述
            </h2>
            <p class="text-xl text-gray-600 animate-slide-up">
              从源代码到目标代码的完整流程
            </p>
          </div>
          <div class="text-sm text-gray-500 animate-fade-in-delay">
            点击下一步开始了解编译过程
          </div>
        </div>

        <!-- 步骤2: 编译流程概览 -->
        <div v-if="currentStep === 1" class="h-full flex flex-col justify-center">
          <h3 class="text-2xl font-bold text-gray-900 mb-8 text-center">编译流程概览</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="(stage, index) in compilationStages"
              :key="stage.name"
              class="stage-card"
              :class="{ 'animate-stage': index <= currentStageIndex }"
            >
              <div class="stage-icon">
                <Icon :icon="stage.icon" class="w-8 h-8" />
              </div>
              <h4 class="font-semibold text-gray-900 mb-2">{{ stage.name }}</h4>
              <p class="text-sm text-gray-600">{{ stage.description }}</p>
            </div>
          </div>
        </div>

        <!-- 步骤3: 词法分析 -->
        <div v-if="currentStep === 2" class="h-full flex flex-col justify-center">
          <h3 class="text-2xl font-bold text-gray-900 mb-8 text-center">词法分析 (Lexical Analysis)</h3>
          <div class="flex items-center justify-center space-x-8 mb-8">
            <div class="text-center">
              <div class="bg-blue-100 rounded-lg p-4 mb-4">
                <p class="text-sm font-mono">int x = 10;</p>
              </div>
              <p class="text-sm text-gray-600">源代码</p>
            </div>
            <Icon icon="lucide:arrow-right" class="w-8 h-8 text-gray-400" />
            <div class="text-center">
              <div class="bg-green-100 rounded-lg p-4 mb-4">
                <div class="space-y-1 text-sm">
                  <div class="flex justify-between">
                    <span>int</span>
                    <span class="text-gray-500">关键字</span>
                  </div>
                  <div class="flex justify-between">
                    <span>x</span>
                    <span class="text-gray-500">标识符</span>
                  </div>
                  <div class="flex justify-between">
                    <span>=</span>
                    <span class="text-gray-500">赋值符</span>
                  </div>
                  <div class="flex justify-between">
                    <span>10</span>
                    <span class="text-gray-500">数字</span>
                  </div>
                </div>
              </div>
              <p class="text-sm text-gray-600">词法单元 (Token)</p>
            </div>
          </div>
        </div>

        <!-- 步骤4: 语法分析 -->
        <div v-if="currentStep === 3" class="h-full flex flex-col justify-center">
          <h3 class="text-2xl font-bold text-gray-900 mb-8 text-center">语法分析 (Syntax Analysis)</h3>
          <div class="flex items-center justify-center space-x-8 mb-8">
            <div class="text-center">
              <div class="bg-green-100 rounded-lg p-4 mb-4">
                <p class="text-sm">int x = 10;</p>
              </div>
              <p class="text-sm text-gray-600">词法单元流</p>
            </div>
            <Icon icon="lucide:arrow-right" class="w-8 h-8 text-gray-400" />
            <div class="text-center">
              <div class="bg-purple-100 rounded-lg p-4 mb-4">
                <div class="text-sm">
                  <div class="text-center mb-2">声明语句</div>
                  <div class="border-l-2 border-purple-300 pl-2">
                    <div>类型: int</div>
                    <div>变量: x</div>
                    <div>初始值: 10</div>
                  </div>
                </div>
              </div>
              <p class="text-sm text-gray-600">语法树 (AST)</p>
            </div>
          </div>
        </div>

        <!-- 步骤5: 语义分析 -->
        <div v-if="currentStep === 4" class="h-full flex flex-col justify-center">
          <h3 class="text-2xl font-bold text-gray-900 mb-8 text-center">语义分析 (Semantic Analysis)</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="text-center">
              <h4 class="font-semibold text-gray-900 mb-4">类型检查</h4>
              <div class="bg-blue-100 rounded-lg p-4">
                <div class="text-sm space-y-2">
                  <div class="flex justify-between">
                    <span>int x = 10;</span>
                    <span class="text-green-600">✓ 正确</span>
                  </div>
                  <div class="flex justify-between">
                    <span>int y = "hello";</span>
                    <span class="text-red-600">✗ 类型错误</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="text-center">
              <h4 class="font-semibold text-gray-900 mb-4">作用域检查</h4>
              <div class="bg-green-100 rounded-lg p-4">
                <div class="text-sm space-y-2">
                  <div class="flex justify-between">
                    <span>变量声明</span>
                    <span class="text-green-600">✓ 有效</span>
                  </div>
                  <div class="flex justify-between">
                    <span>重复声明</span>
                    <span class="text-red-600">✗ 错误</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 步骤6: 中间代码生成 -->
        <div v-if="currentStep === 5" class="h-full flex flex-col justify-center">
          <h3 class="text-2xl font-bold text-gray-900 mb-8 text-center">中间代码生成 (Intermediate Code Generation)</h3>
          <div class="flex items-center justify-center space-x-8 mb-8">
            <div class="text-center">
              <div class="bg-purple-100 rounded-lg p-4 mb-4">
                <p class="text-sm">语法树</p>
              </div>
              <p class="text-sm text-gray-600">抽象语法树</p>
            </div>
            <Icon icon="lucide:arrow-right" class="w-8 h-8 text-gray-400" />
            <div class="text-center">
              <div class="bg-orange-100 rounded-lg p-4 mb-4">
                <div class="text-sm font-mono space-y-1">
                  <div>1: DECLARE x, int</div>
                  <div>2: LOAD 10</div>
                  <div>3: STORE x</div>
                </div>
              </div>
              <p class="text-sm text-gray-600">三地址码</p>
            </div>
          </div>
        </div>

        <!-- 步骤7: 代码优化 -->
        <div v-if="currentStep === 6" class="h-full flex flex-col justify-center">
          <h3 class="text-2xl font-bold text-gray-900 mb-8 text-center">代码优化 (Code Optimization)</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="text-center">
              <h4 class="font-semibold text-gray-900 mb-4">优化前</h4>
              <div class="bg-gray-100 rounded-lg p-4">
                <div class="text-sm font-mono space-y-1">
                  <div>1: LOAD 5</div>
                  <div>2: LOAD 3</div>
                  <div>3: ADD</div>
                  <div>4: STORE temp</div>
                  <div>5: LOAD temp</div>
                  <div>6: STORE x</div>
                </div>
              </div>
            </div>
            <div class="text-center">
              <h4 class="font-semibold text-gray-900 mb-4">优化后</h4>
              <div class="bg-green-100 rounded-lg p-4">
                <div class="text-sm font-mono space-y-1">
                  <div>1: LOAD 8</div>
                  <div>2: STORE x</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 步骤8: 目标代码生成 -->
        <div v-if="currentStep === 7" class="h-full flex flex-col justify-center">
          <h3 class="text-2xl font-bold text-gray-900 mb-8 text-center">目标代码生成 (Code Generation)</h3>
          <div class="flex items-center justify-center space-x-8 mb-8">
            <div class="text-center">
              <div class="bg-orange-100 rounded-lg p-4 mb-4">
                <div class="text-sm font-mono space-y-1">
                  <div>1: LOAD 8</div>
                  <div>2: STORE x</div>
                </div>
              </div>
              <p class="text-sm text-gray-600">优化后的中间代码</p>
            </div>
            <Icon icon="lucide:arrow-right" class="w-8 h-8 text-gray-400" />
            <div class="text-center">
              <div class="bg-red-100 rounded-lg p-4 mb-4">
                <div class="text-sm font-mono space-y-1">
                  <div>mov eax, 8</div>
                  <div>mov [x], eax</div>
                </div>
              </div>
              <p class="text-sm text-gray-600">汇编代码</p>
            </div>
          </div>
        </div>

        <!-- 步骤9: 总结 -->
        <div v-if="currentStep === 8" class="text-center h-full flex flex-col justify-center items-center">
          <div class="mb-8">
            <Icon icon="lucide:check-circle" class="w-24 h-24 text-green-600 mb-6" />
            <h2 class="text-3xl font-bold text-gray-900 mb-4">
              编译原理概述完成
            </h2>
            <p class="text-lg text-gray-600 mb-6">
              我们了解了从源代码到目标代码的完整编译流程
            </p>
            <div class="bg-blue-50 rounded-lg p-6 max-w-2xl">
              <h3 class="font-semibold text-gray-900 mb-4">编译流程总结：</h3>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>词法分析</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>语法分析</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>语义分析</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>中间代码生成</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>代码优化</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>目标代码生成</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 控制按钮 -->
      <div class="flex items-center justify-center gap-4">
        <button
          @click="previousStep"
          :disabled="currentStep === 0"
          class="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          <Icon icon="lucide:chevron-left" class="w-4 h-4" />
          上一步
        </button>
        <button
          @click="nextStep"
          :disabled="currentStep === totalSteps - 1"
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          下一步
          <Icon icon="lucide:chevron-right" class="w-4 h-4" />
        </button>
      </div>

      <!-- 进度条 -->
      <div class="mt-8">
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="bg-blue-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${((currentStep + 1) / totalSteps) * 100}%` }"
          ></div>
        </div>
        <div class="flex justify-between text-sm text-gray-600 mt-2">
          <span>步骤 {{ currentStep + 1 }} / {{ totalSteps }}</span>
          <span>{{ Math.round(((currentStep + 1) / totalSteps) * 100) }}%</span>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import ThemeSelector from '@/components/shared/ThemeSelector.vue'

// 定义组件名称
defineOptions({
  name: 'CompilerOverviewPage'
})

// 当前步骤
const currentStep = ref(0)
const totalSteps = 9

// 编译阶段数据
const compilationStages = [
  {
    name: '词法分析',
    description: '将源代码转换为词法单元序列',
    icon: 'lucide:scissors'
  },
  {
    name: '语法分析',
    description: '构建抽象语法树',
    icon: 'lucide:git-branch'
  },
  {
    name: '语义分析',
    description: '类型检查和语义验证',
    icon: 'lucide:check-circle'
  },
  {
    name: '中间代码生成',
    description: '生成平台无关的中间代码',
    icon: 'lucide:code'
  },
  {
    name: '代码优化',
    description: '优化中间代码提高效率',
    icon: 'lucide:zap'
  },
  {
    name: '目标代码生成',
    description: '生成目标平台的机器代码',
    icon: 'lucide:cpu'
  }
]

// 当前显示的阶段索引
const currentStageIndex = computed(() => {
  if (currentStep.value === 1) {
    return Math.min(Math.floor((Date.now() - startTime.value) / 500), 5)
  }
  return 5
})

const startTime = ref(0)

// 下一步
const nextStep = () => {
  if (currentStep.value < totalSteps - 1) {
    currentStep.value++
    if (currentStep.value === 1) {
      startTime.value = Date.now()
    }
  }
}

// 上一步
const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

// 键盘事件处理
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowRight' || event.key === ' ') {
    event.preventDefault()
    nextStep()
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault()
    previousStep()
  }
}

// 组件挂载和卸载
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  console.log('编译原理概述页面已加载')
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.stage-card {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.5s ease;
  opacity: 0.3;
  transform: translateY(20px);
}

.stage-card.animate-stage {
  opacity: 1;
  transform: translateY(0);
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.stage-icon {
  width: 3rem;
  height: 3rem;
  background: #dbeafe;
  color: #2563eb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.animate-fade-in {
  animation: fadeIn 1s ease-out;
}

.animate-slide-up {
  animation: slideUp 1s ease-out 0.3s both;
}

.animate-fade-in-delay {
  animation: fadeIn 1s ease-out 0.6s both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
