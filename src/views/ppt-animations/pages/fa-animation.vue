<template>
  <div class="fa-animation-page min-h-screen theme-main-bg theme-transition">
    <!-- 头部导航 -->
    <header class="fixed top-0 left-0 right-0 z-50 theme-header-bg backdrop-blur-sm border-b theme-header-border">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <router-link to="/ppt-animations" class="flex items-center gap-2 theme-header-text hover:opacity-80 transition-colors">
              <Icon icon="lucide:arrow-left" class="w-5 h-5" />
              返回PPT主页
            </router-link>
            <h1 class="text-2xl font-bold theme-header-text">有限自动机动画</h1>
          </div>
          <div class="flex items-center gap-2">
            <ThemeSelector />
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容 -->
    <main class="max-w-6xl mx-auto px-4 py-16 mt-20">
      <div class="bg-white rounded-xl shadow-lg p-8 text-center">
        <div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon icon="lucide:git-branch" class="w-12 h-12 text-green-600" />
        </div>
        <h2 class="text-3xl font-bold text-gray-900 mb-4">
          有限自动机动画演示
        </h2>
        <p class="text-lg text-gray-600 mb-8">
          展示从正则表达式到NFA，再到DFA最小化的完整转换过程
        </p>
        <div class="bg-blue-50 rounded-lg p-6 max-w-2xl mx-auto">
          <h3 class="font-semibold text-gray-900 mb-4">即将推出：</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>正则表达式解析</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>NFA构建过程</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>子集构造法</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span>DFA最小化</span>
            </div>
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
  name: 'FAAnimationPage'
})

console.log('有限自动机动画页面已加载')
</script>

