<template>
  <div class="record-page min-h-screen theme-main-bg theme-transition">
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
            <h1 class="text-xl font-semibold text-gray-800">答题记录</h1>
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
      <h1 class="text-3xl font-bold text-center theme-content-text mb-8">答题记录</h1>
      
      <!-- 答题记录卡片列表 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- FA 答题记录卡片 -->
        <router-link 
          to="/record/fa" 
          class="record-card group"
        >
          <div class="record-icon fa-icon">
            <Icon icon="lucide:git-branch" class="w-8 h-8" />
          </div>
          <h3 class="text-xl font-semibold theme-content-text mb-2">有限自动机 (FA) 答题记录</h3>
          <p class="text-sm theme-content-placeholder mb-4">
            查看您在FA算法中的答题记录和得分情况
          </p>
          <div class="flex items-center justify-center mt-4">
            <span class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              查看答题记录
              <Icon icon="lucide:arrow-right" class="w-4 h-4 ml-2" />
            </span>
          </div>
        </router-link>

        <!-- LL1 答题记录卡片 -->
        <router-link 
          to="/record/ll1" 
          class="record-card group"
        >
          <div class="record-icon ll1-icon">
            <Icon icon="lucide:layers" class="w-8 h-8" />
          </div>
          <h3 class="text-xl font-semibold theme-content-text mb-2">LL1 分析答题记录</h3>
          <p class="text-sm theme-content-placeholder mb-4">
            查看您在LL1分析算法中的答题记录和得分情况
          </p>
          <div class="flex items-center justify-center mt-4">
            <span class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              查看答题记录
              <Icon icon="lucide:arrow-right" class="w-4 h-4 ml-2" />
            </span>
          </div>
        </router-link>

        <!-- LR0 答题记录卡片 -->
        <router-link 
          to="/record/lr0" 
          class="record-card group"
        >
          <div class="record-icon lr0-icon">
            <Icon icon="lucide:workflow" class="w-8 h-8" />
          </div>
          <h3 class="text-xl font-semibold theme-content-text mb-2">LR0 分析答题记录</h3>
          <p class="text-sm theme-content-placeholder mb-4">
            查看您在LR0分析算法中的答题记录和得分情况
          </p>
          <div class="flex items-center justify-center mt-4">
            <span class="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
              查看答题记录
              <Icon icon="lucide:arrow-right" class="w-4 h-4 ml-2" />
            </span>
          </div>
        </router-link>

        <!-- SLR1 答题记录卡片 -->
        <router-link 
          to="/record/slr1" 
          class="record-card group"
        >
          <div class="record-icon slr1-icon">
            <Icon icon="lucide:zap" class="w-8 h-8" />
          </div>
          <h3 class="text-xl font-semibold theme-content-text mb-2">SLR1 分析答题记录</h3>
          <p class="text-sm theme-content-placeholder mb-4">
            查看您在SLR1分析算法中的答题记录和得分情况
          </p>
          <div class="flex items-center justify-center mt-4">
            <span class="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              查看答题记录
              <Icon icon="lucide:arrow-right" class="w-4 h-4 ml-2" />
            </span>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 定义组件名称
defineOptions({
  name: 'RecordPage'
})

import { Icon } from '@iconify/vue'
import ThemeSelector from '@/components/shared/ThemeSelector.vue'
</script>

<style scoped>
.record-card {
  background: var(--theme-content-bg);
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  border: 1px solid var(--theme-content-border);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.record-card:hover {
  box-shadow: 0 25px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  transform: translateY(-2px);
}

.record-icon {
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
</style>
