<template>
  <div class="home-page min-h-screen theme-main-bg theme-transition">
    <!-- 头部导航 -->
    <header class="fixed top-0 left-0 right-0 z-50 theme-header-bg backdrop-blur-sm border-b theme-header-border">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <h1 class="text-2xl font-bold theme-header-text">编译原理可视化工具</h1>
          </div>
          <div class="flex items-center gap-2">
            <ThemeSelector />
            <router-link
              to="/ppt-animations"
              class="px-3 py-2 theme-header-text hover:opacity-80 transition-colors flex items-center gap-1 ppt-animation-link"
            >
              <Icon icon="lucide:presentation" class="w-4 h-4" />
              PPT动画
            </router-link>
            <router-link
              to="/docs"
              class="px-3 py-2 theme-header-text hover:opacity-80 transition-colors"
            >
              官方文档
            </router-link>
            <router-link
              to="/"
              class="px-3 py-2 theme-header-text hover:opacity-80 transition-colors"
            >
              首页
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容 -->
    <main class="max-w-7xl mx-auto px-4 py-16 mt-20">
      <!-- 欢迎区域 -->
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">
          编译原理算法可视化平台
        </h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          通过交互式步骤和可视化图表，深入理解有限自动机、语法分析等编译原理核心概念
        </p>
      </div>

      <!-- 算法卡片网格 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <!-- FA 卡片 -->
        <div class="algorithm-card group">
          <div class="algorithm-icon fa-icon">
            <Icon icon="lucide:git-branch" class="w-8 h-8" />
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">有限自动机 (FA)</h3>
          <p class="text-gray-600 text-sm mb-4">
            从正则表达式到NFA，再到DFA最小化的完整流程
          </p>
          <div class="text-xs text-gray-500 mb-4">
            正则表达式 → NFA → DFA → 最小化DFA
          </div>
          <router-link
            to="/fa"
            class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors group-hover:scale-105 transform duration-200"
          >
            开始学习
            <Icon icon="lucide:arrow-right" class="w-4 h-4 ml-2" />
          </router-link>
        </div>

        <!-- LL1 卡片 -->
        <div class="algorithm-card group">
          <div class="algorithm-icon ll1-icon">
            <Icon icon="lucide:layers" class="w-8 h-8" />
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">LL1 分析</h3>
          <p class="text-gray-600 text-sm mb-4">
            自顶向下语法分析，构建LL1分析表
          </p>
          <div class="text-xs text-gray-500 mb-4">
            文法 → First/Follow集 → 分析表 → 字符串分析
          </div>
          <router-link
            to="/ll1"
            class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors group-hover:scale-105 transform duration-200"
          >
            开始学习
            <Icon icon="lucide:arrow-right" class="w-4 h-4 ml-2" />
          </router-link>
        </div>

        <!-- LR0 卡片 -->
        <div class="algorithm-card group">
          <div class="algorithm-icon lr0-icon">
            <Icon icon="lucide:workflow" class="w-8 h-8" />
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">LR0 分析</h3>
          <p class="text-gray-600 text-sm mb-4">
            自底向上语法分析，构建LR0分析表
          </p>
          <div class="text-xs text-gray-500 mb-4">
            文法 → 增广文法 → DFA → 分析表 → 字符串分析
          </div>
          <router-link
            to="/lr0"
            class="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors group-hover:scale-105 transform duration-200"
          >
            开始学习
            <Icon icon="lucide:arrow-right" class="w-4 h-4 ml-2" />
          </router-link>
        </div>

        <!-- SLR1 卡片 -->
        <div class="algorithm-card group">
          <div class="algorithm-icon slr1-icon">
            <Icon icon="lucide:zap" class="w-8 h-8" />
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">SLR1 分析</h3>
          <p class="text-gray-600 text-sm mb-4">
            改进的LR分析，解决LR0冲突问题
          </p>
          <div class="text-xs text-gray-500 mb-4">
            文法 → 增广文法 → DFA → SLR1分析表 → 字符串分析
          </div>
          <router-link
            to="/slr1"
            class="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors group-hover:scale-105 transform duration-200"
          >
            开始学习
            <Icon icon="lucide:arrow-right" class="w-4 h-4 ml-2" />
          </router-link>
        </div>


      </div>

      <!-- 特性展示 -->
      <div class="bg-white rounded-xl shadow-lg p-8 mb-16">
        <h3 class="text-2xl font-bold text-gray-900 mb-6 text-center">平台特性</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon icon="lucide:eye" class="w-8 h-8 text-blue-600" />
            </div>
            <h4 class="font-semibold text-gray-900 mb-2">可视化步骤</h4>
            <p class="text-gray-600 text-sm">
              每个算法步骤都有详细的可视化展示，帮助理解复杂概念
            </p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon icon="lucide:mouse-pointer-click" class="w-8 h-8 text-green-600" />
            </div>
            <h4 class="font-semibold text-gray-900 mb-2">交互式学习</h4>
            <p class="text-gray-600 text-sm">
              通过交互式画布和步骤操作，动手实践每个算法流程
            </p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon icon="lucide:zap" class="w-8 h-8 text-purple-600" />
            </div>
            <h4 class="font-semibold text-gray-900 mb-2">实时反馈</h4>
            <p class="text-gray-600 text-sm">
              实时验证输入，提供即时反馈和错误提示
            </p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon icon="lucide:bot" class="w-8 h-8 text-orange-600" />
            </div>
            <h4 class="font-semibold text-gray-900 mb-2">AI教学助手</h4>
            <p class="text-gray-600 text-sm">
              智能AI助手提供个性化学习指导，解答疑问和提供学习建议
            </p>
          </div>
        </div>
      </div>


    </main>

    <!-- AI聊天组件 -->
    <AIChatWidget
      page-type="home"
      :context="chatContext"
    />
  </div>
</template>

<script setup lang="ts">
// 定义组件名称
defineOptions({
  name: 'HomePage'
})

import { Icon } from '@iconify/vue'
import ThemeSelector from '@/components/shared/ThemeSelector.vue'
import { AIChatWidget } from '@/components/ai'
import { useHomeChatStore } from '@/stores/homeChat'
import type { ChatContext } from '@/components/ai/types'
import { ref, onMounted } from 'vue'

// 使用主页AI聊天store
const homeChatStore = useHomeChatStore()

// 聊天上下文
const chatContext = ref<ChatContext>({
  currentPage: 'home',
  userInput: {},
  backendData: {},
  userAnswers: {},
  pageContext: '编译原理可视化工具主页'
})

// 组件挂载时的初始化
onMounted(() => {
  // 初始化聊天上下文
  homeChatStore.updateContext(chatContext.value)
})
</script>

<style scoped>
.algorithm-card {
  background: var(--theme-content-bg);
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  border: 1px solid var(--theme-content-border);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.algorithm-card:hover {
  box-shadow: 0 25px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  transform: translateY(-2px);
}

.algorithm-icon {
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.fa-icon {
  background: rgb(219 234 254);
  color: rgb(37 99 235);
}

.ll1-icon {
  background: rgb(220 252 231);
  color: rgb(22 163 74);
}

.lr0-icon {
  background: rgb(254 215 170);
  color: rgb(234 88 12);
}

.slr1-icon {
  background: rgb(237 233 254);
  color: rgb(147 51 234);
}

/* PPT动画链接特殊样式 */
.ppt-animation-link {
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white !important;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem !important;
  font-weight: 500;
  transition: all 0.3s ease;
}

.ppt-animation-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  opacity: 1 !important;
}

.ppt-animation-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 0.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.ppt-animation-link:hover::before {
  opacity: 1;
}
</style>
