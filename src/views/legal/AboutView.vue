<template>
  <div class="min-h-screen theme-main-bg theme-transition">
    <!-- 头部导航 -->
    <header class="fixed top-0 left-0 right-0 z-50 theme-header-bg backdrop-blur-sm border-b theme-header-border">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <router-link to="/" class="text-2xl font-bold theme-header-text hover:opacity-80 transition-colors">
              编译原理可视化工具
            </router-link>
          </div>
          <div class="flex items-center gap-2">
            <ThemeSelector />
            <router-link to="/" class="px-3 py-2 theme-header-text hover:opacity-80 transition-colors">
              返回首页
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容 -->
    <main class="max-w-4xl mx-auto px-4 py-16 mt-20">
      <div class="bg-white rounded-xl shadow-lg p-8">
        <!-- 学院标识 -->
        <div class="flex flex-col md:flex-row items-center justify-center gap-8 mb-10">
          <img 
            src="/Guangzhou-University.webp" 
            alt="广州大学校徽" 
            class="h-24 w-auto object-contain"
          />
          <img 
            src="/OIP-C.webp" 
            alt="计算机科学与网络工程学院院徽" 
            class="h-24 w-auto object-contain"
          />
        </div>

        <h1 class="text-3xl font-bold text-gray-900 mb-8 text-center">关于我们</h1>
        
        <div class="prose prose-blue max-w-none">
          <section class="mb-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">项目背景</h2>
            <p class="text-gray-600 mb-4">
              编译原理可视化工具是由<strong>广州大学计算机科学与网络工程学院</strong>开发的教育学习平台，
              旨在为编译原理课程的学习提供直观、交互式的算法可视化辅助工具。
            </p>
            <p class="text-gray-600 mb-4">
              本项目完全免费，面向所有对编译原理感兴趣的学习者开放，帮助学习者更好地理解编译器构造的核心算法。
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">核心功能</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="p-4 bg-gray-50 rounded-lg">
                <h3 class="font-medium text-gray-900 mb-2">有限自动机 (FA)</h3>
                <p class="text-sm text-gray-600">正则表达式到 NFA、DFA 的转换及最小化过程可视化</p>
              </div>
              <div class="p-4 bg-gray-50 rounded-lg">
                <h3 class="font-medium text-gray-900 mb-2">LL(1) 分析</h3>
                <p class="text-sm text-gray-600">自顶向下语法分析，First/Follow 集计算可视化</p>
              </div>
              <div class="p-4 bg-gray-50 rounded-lg">
                <h3 class="font-medium text-gray-900 mb-2">LR(0) 分析</h3>
                <p class="text-sm text-gray-600">自底向上语法分析，项目集规范族构建可视化</p>
              </div>
              <div class="p-4 bg-gray-50 rounded-lg">
                <h3 class="font-medium text-gray-900 mb-2">SLR(1) 分析</h3>
                <p class="text-sm text-gray-600">简单 LR 分析，解决 LR(0) 冲突问题</p>
              </div>
            </div>
          </section>

          <section class="mb-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">技术栈</h2>
            <ul class="list-disc list-inside text-gray-600 mb-4 space-y-2">
              <li><strong>前端框架：</strong>Vue 3 + TypeScript</li>
              <li><strong>构建工具：</strong>Vite</li>
              <li><strong>样式框架：</strong>Tailwind CSS</li>
              <li><strong>可视化：</strong>自定义 SVG + Canvas</li>
              <li><strong>状态管理：</strong>Pinia</li>
              <li><strong>路由：</strong>Vue Router</li>
            </ul>
          </section>

          <section class="mb-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">知识产权与开源协议</h2>

            <h3 class="text-lg font-medium text-gray-800 mb-3">软件著作权</h3>
            <div class="bg-gray-50 p-4 rounded-lg mb-4">
              <p class="text-sm text-gray-600 mb-2">
                <strong>著作权人：</strong>广州大学计算机科学与网络工程学院
              </p>
              <p class="text-sm text-gray-600">
                <strong>登记号：</strong>2026SR0059602
              </p>
            </div>

            <h3 class="text-lg font-medium text-gray-800 mb-3">开源协议</h3>
            <p class="text-gray-600 mb-4">
              本项目采用 MIT 开源协议。您可以自由使用、修改和分发本项目代码，
              但请遵守 MIT 协议的相关条款。
            </p>

            <h3 class="text-lg font-medium text-gray-800 mb-3">前端主要依赖</h3>
            <div class="bg-gray-50 p-4 rounded-lg mb-4">
              <p class="text-sm text-gray-600 mb-2">
                <strong>核心框架：</strong>Vue 3, Vue Router, Pinia, TypeScript
              </p>
              <p class="text-sm text-gray-600 mb-2">
                <strong>构建工具：</strong>Vite, Tailwind CSS, Sass
              </p>
              <p class="text-sm text-gray-600 mb-2">
                <strong>可视化：</strong>ECharts, Mermaid, Vue Flow
              </p>
              <p class="text-sm text-gray-600 mb-2">
                <strong>AI 功能：</strong>OpenAI API
              </p>
              <p class="text-sm text-gray-600 mb-2">
                <strong>其他：</strong>Axios, Iconify, GSAP, KaTeX, Marked
              </p>
            </div>

            <h3 class="text-lg font-medium text-gray-800 mb-3">后端主要依赖</h3>
            <div class="bg-gray-50 p-4 rounded-lg mb-4">
              <p class="text-sm text-gray-600 mb-2">
                <strong>核心框架：</strong>Flask, Flask-CORS, Flask-Limiter
              </p>
              <p class="text-sm text-gray-600 mb-2">
                <strong>数据处理：</strong>NumPy, Pandas, Graphviz
              </p>
              <p class="text-sm text-gray-600 mb-2">
                <strong>AI 功能：</strong>OpenAI
              </p>
              <p class="text-sm text-gray-600">
                <strong>其他：</strong>Requests, Python-dateutil, Pygments
              </p>
            </div>

            <p class="text-gray-600 text-sm">
              完整的依赖列表请参阅项目的 package.json 和 requirements.txt 文件。
              感谢所有开源项目的贡献者！
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">联系我们</h2>
            <div class="bg-gray-50 p-6 rounded-lg">
              <p class="text-gray-600 mb-2">
                <strong>开发单位：</strong>广州大学计算机科学与网络工程学院
              </p>
              <p class="text-gray-600 mb-2">
                <strong>地址：</strong>广东省广州市番禺区大学城外环西路230号
              </p>
              <p class="text-gray-600">
                如果您有任何建议、问题或反馈，欢迎与我们联系。
              </p>
            </div>
          </section>

          <section class="mb-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">致谢</h2>
            <p class="text-gray-600 mb-4">
              感谢广州大学计算机科学与网络工程学院的支持，感谢所有为本项目提供建议、测试和反馈的用户。
              特别感谢编译原理教育领域的专家学者，他们的著作和课程为本项目的设计提供了重要参考。
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">更新日志</h2>
            <div class="space-y-4">
              <div class="border-l-4 border-blue-500 pl-4">
                <h3 class="font-medium text-gray-900">v1.0.0 - 2026年3月</h3>
                <ul class="list-disc list-inside text-gray-600 mt-2 text-sm">
                  <li>初始版本发布</li>
                  <li>支持 FA、LL1、LR0、SLR1 算法可视化</li>
                  <li>学习统计和答题记录功能</li>
                  <li>AI 辅助学习功能</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>

    <!-- 页脚 -->
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'AboutView'
})

import ThemeSelector from '@/components/shared/ThemeSelector.vue'
import AppFooter from '@/components/shared/AppFooter.vue'
</script>
