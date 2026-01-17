<template>
  <div class="lr0-record-page min-h-screen theme-main-bg theme-transition">
    <!-- 头部导航 -->
    <header class="theme-header-bg backdrop-blur-sm border-b sticky top-0 z-50 theme-transition">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <router-link
              to="/"
              class="text-2xl font-bold theme-header-text hover:opacity-80 transition-colors"
            >
              编译原理可视化
            </router-link>
            <span class="text-gray-400">|</span>
            <router-link to="/record" class="text-xl font-semibold text-gray-600 hover:text-gray-800">答题记录</router-link>
            <span class="text-gray-400">|</span>
            <h1 class="text-xl font-semibold text-gray-800">LR0 分析</h1>
          </div>
          <div class="flex items-center gap-2">
            <ThemeSelector />
            <router-link
              to="/"
              class="px-3 py-2 theme-header-text hover:opacity-80 transition-colors"
            >
              首页
            </router-link>
            <router-link
              to="/docs"
              class="px-3 py-2 theme-header-text hover:opacity-80 transition-colors"
            >
              官方文档
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 py-8 pt-20">
      <div class="flex items-center gap-4 mb-8">
        <router-link to="/record" class="text-gray-500 hover:text-gray-700">
          <Icon icon="lucide:arrow-left" class="w-6 h-6" />
        </router-link>
        <h1 class="text-3xl font-bold theme-content-text">LR0 分析答题记录</h1>
      </div>
      
      <!-- 占位内容 -->
      <div class="bg-white rounded-xl shadow-lg p-12 text-center">
        <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon icon="lucide:workflow" class="w-12 h-12 text-gray-400" />
        </div>
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">功能开发中</h2>
        <p class="text-gray-500 mb-8">
          LR0分析算法的答题记录功能正在开发中，敬请期待！
        </p>
        <router-link
          to="/record"
          class="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          返回答题记录首页
          <Icon icon="lucide:arrow-left" class="w-4 h-4 ml-2" />
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 定义组件名称
defineOptions({
  name: 'Lr0RecordPage'
})

import { Icon } from '@iconify/vue'
import ThemeSelector from '@/components/shared/ThemeSelector.vue'
</script>
