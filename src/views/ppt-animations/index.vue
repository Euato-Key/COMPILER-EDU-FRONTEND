<template>
  <div class="ppt-animations-page min-h-screen theme-main-bg theme-transition">
    <!-- 头部导航 -->
    <header class="fixed top-0 left-0 right-0 z-50 theme-header-bg backdrop-blur-sm border-b theme-header-border">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
                         <router-link to="/" class="flex items-center gap-2 theme-header-text hover:opacity-80 transition-colors">
               <Icon icon="lucide:arrow-left" class="w-5 h-5" />
               返回首页
             </router-link>
            <h1 class="text-2xl font-bold theme-header-text">PPT动画演示</h1>
          </div>
          <div class="flex items-center gap-2">
            <ThemeSelector />
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容 -->
    <main class="max-w-7xl mx-auto px-4 py-16 mt-20">
      <!-- 欢迎区域 -->
      <div class="text-center mb-16">
                 <div class="w-24 h-24 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
           <Icon icon="lucide:presentation" class="w-12 h-12 text-white" />
         </div>
        <h2 class="text-4xl font-bold text-gray-900 mb-4">
          编译原理PPT动画演示
        </h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          通过精美的动画演示，深入理解编译原理的核心概念和算法流程
        </p>
      </div>

      <!-- 动画页面列表 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- 编译原理概述 -->
        <div class="animation-card group">
          <div class="animation-preview bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg p-8 mb-6 flex items-center justify-center">
                         <div class="text-center">
               <Icon icon="lucide:book-open" class="w-16 h-16 text-blue-600 mb-4" />
              <div class="space-y-2">
                <div class="w-20 h-2 bg-blue-300 rounded"></div>
                <div class="w-16 h-2 bg-blue-300 rounded"></div>
                <div class="w-24 h-2 bg-blue-300 rounded"></div>
              </div>
            </div>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">编译原理概述</h3>
          <p class="text-gray-600 text-sm mb-4">
            介绍编译原理的基本概念、编译流程和各个阶段的作用
          </p>
          <div class="text-xs text-gray-500 mb-4">
            词法分析 → 语法分析 → 语义分析 → 中间代码生成 → 代码优化 → 目标代码生成
          </div>
          <router-link
            to="/ppt-animations/compiler-overview"
            class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors group-hover:scale-105 transform duration-200"
          >
            开始演示
            <Icon icon="lucide:play" class="w-4 h-4 ml-2" />
          </router-link>
        </div>

        <!-- 有限自动机动画 -->
        <div class="animation-card group">
          <div class="animation-preview bg-gradient-to-br from-green-100 to-green-200 rounded-lg p-8 mb-6 flex items-center justify-center">
                         <div class="text-center">
               <Icon icon="lucide:git-branch" class="w-16 h-16 text-green-600 mb-4" />
              <div class="flex items-center justify-center space-x-2">
                <div class="w-3 h-3 bg-green-400 rounded-full"></div>
                <div class="w-8 h-0.5 bg-green-400"></div>
                <div class="w-3 h-3 bg-green-400 rounded-full"></div>
                <div class="w-8 h-0.5 bg-green-400"></div>
                <div class="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
            </div>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">有限自动机动画</h3>
          <p class="text-gray-600 text-sm mb-4">
            展示从正则表达式到NFA，再到DFA最小化的完整转换过程
          </p>
          <div class="text-xs text-gray-500 mb-4">
            正则表达式 → NFA → DFA → 最小化DFA
          </div>
          <router-link
            to="/ppt-animations/fa-animation"
            class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors group-hover:scale-105 transform duration-200"
          >
            开始演示
            <Icon icon="lucide:play" class="w-4 h-4 ml-2" />
          </router-link>
        </div>

        <!-- 语法分析动画 -->
        <div class="animation-card group">
          <div class="animation-preview bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg p-8 mb-6 flex items-center justify-center">
                         <div class="text-center">
               <Icon icon="lucide:layers" class="w-16 h-16 text-purple-600 mb-4" />
              <div class="space-y-1">
                <div class="w-24 h-1 bg-purple-300 rounded"></div>
                <div class="w-20 h-1 bg-purple-300 rounded"></div>
                <div class="w-28 h-1 bg-purple-300 rounded"></div>
                <div class="w-16 h-1 bg-purple-300 rounded"></div>
              </div>
            </div>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">语法分析动画</h3>
          <p class="text-gray-600 text-sm mb-4">
            演示LL1和LR分析算法的构建过程和分析表的生成
          </p>
          <div class="text-xs text-gray-500 mb-4">
            LL1分析 → LR0分析 → SLR1分析 → 分析表构建
          </div>
          <router-link
            to="/ppt-animations/parsing-animation"
            class="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors group-hover:scale-105 transform duration-200"
          >
            开始演示
            <Icon icon="lucide:play" class="w-4 h-4 ml-2" />
          </router-link>
        </div>
      </div>

      <!-- 视频开场 -->
      <div class="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 text-white">
        <div class="text-center mb-8">
          <div class="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon icon="lucide:video" class="w-10 h-10 text-white" />
          </div>
          <h3 class="text-3xl font-bold mb-4">视频开场动画</h3>
          <p class="text-xl opacity-90 mb-6">
            专为录制教学视频设计的精美开场动画
          </p>
          <router-link
            to="/ppt-animations/video-intro"
            class="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
          >
            <Icon icon="lucide:play" class="w-5 h-5 mr-2" />
            观看开场动画
          </router-link>
        </div>
      </div>

      <!-- 使用说明 -->
      <div class="mt-16 bg-white rounded-xl shadow-lg p-8">
        <h3 class="text-2xl font-bold text-gray-900 mb-6 text-center">使用说明</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center">
                         <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
               <Icon icon="lucide:mouse-pointer-click" class="w-8 h-8 text-blue-600" />
             </div>
            <h4 class="font-semibold text-gray-900 mb-2">点击演示</h4>
            <p class="text-gray-600 text-sm">
              点击任意动画卡片开始观看对应的PPT动画演示
            </p>
          </div>
          <div class="text-center">
                         <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
               <Icon icon="lucide:arrow-right-left" class="w-8 h-8 text-green-600" />
             </div>
            <h4 class="font-semibold text-gray-900 mb-2">交互控制</h4>
            <p class="text-gray-600 text-sm">
              使用键盘方向键或点击按钮控制动画播放进度
            </p>
          </div>
          <div class="text-center">
                         <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
               <Icon icon="lucide:video" class="w-8 h-8 text-purple-600" />
             </div>
            <h4 class="font-semibold text-gray-900 mb-2">录制分享</h4>
            <p class="text-gray-600 text-sm">
              支持录制动画演示视频，方便制作教学视频
            </p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import ThemeSelector from '@/components/shared/ThemeSelector.vue'

// 定义组件名称
defineOptions({
  name: 'PPTAnimationsPage'
})

// 组件挂载时的初始化
console.log('PPT动画演示页面已加载')
</script>

<style scoped>
.animation-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  border: 1px solid #e5e7eb;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.animation-card:hover {
  box-shadow: 0 25px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  transform: translateY(-4px);
}

.animation-preview {
  min-height: 200px;
  transition: all 0.3s ease;
}

.animation-card:hover .animation-preview {
  transform: scale(1.02);
}
</style>
