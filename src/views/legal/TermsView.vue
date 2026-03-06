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
        <h1 class="text-3xl font-bold text-gray-900 mb-8">用户协议</h1>
        
        <div class="prose prose-blue max-w-none">
          <p class="text-gray-600 mb-6">最后更新日期：2026年3月6日</p>

          <section class="mb-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">1. 接受条款</h2>
            <p class="text-gray-600 mb-4">
              欢迎使用编译原理可视化工具（以下简称"本平台"）。通过访问和使用本平台，您同意遵守本用户协议的所有条款和条件。
              如果您不同意这些条款，请勿使用本平台。
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">2. 服务说明</h2>
            <p class="text-gray-600 mb-4">
              本平台是一个面向教育学习的编译原理算法可视化工具，提供以下服务：
            </p>
            <ul class="list-disc list-inside text-gray-600 mb-4 space-y-2">
              <li>有限自动机（FA）算法可视化</li>
              <li>LL(1)语法分析可视化</li>
              <li>LR(0)语法分析可视化</li>
              <li>SLR(1)语法分析可视化</li>
              <li>学习统计和答题记录功能</li>
            </ul>
          </section>

          <section class="mb-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">3. 使用规范</h2>
            <p class="text-gray-600 mb-4">用户在使用本平台时，应当遵守以下规范：</p>
            <ul class="list-disc list-inside text-gray-600 mb-4 space-y-2">
              <li>不得利用本平台从事任何违法违规活动</li>
              <li>不得干扰、破坏本平台的正常运行</li>
              <li>不得恶意攻击、入侵本平台的服务器</li>
              <li>不得传播恶意软件、病毒等有害程序</li>
              <li>不得侵犯他人的知识产权或其他合法权益</li>
            </ul>
          </section>

          <section class="mb-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">4. 知识产权</h2>
            <p class="text-gray-600 mb-4">
              本平台的所有内容，包括但不限于文字、图片、图表、代码、界面设计等，均受知识产权法律保护。
              未经本平台书面许可，任何个人或组织不得复制、修改、传播、展示或用于商业目的。
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">5. 免责声明</h2>
            <p class="text-gray-600 mb-4">
              本平台提供的所有内容仅供教育学习参考，不构成专业建议。我们不对内容的准确性、完整性或适用性作出任何明示或暗示的保证。
              用户使用本平台产生的任何风险和后果由用户自行承担。
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">6. 协议修改</h2>
            <p class="text-gray-600 mb-4">
              我们保留随时修改本用户协议的权利。修改后的协议将在本页面公布，继续使用本平台即表示您接受修改后的协议。
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">7. 联系我们</h2>
            <p class="text-gray-600">
              如果您对本用户协议有任何疑问，请联系：
            </p>
            <p class="text-gray-600 mt-2">
              <strong>广州大学计算机科学与网络工程学院</strong>
            </p>
            <p class="text-gray-600 mt-1">
              地址：广东省广州市番禺区大学城外环西路230号
            </p>
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
  name: 'TermsView'
})

import ThemeSelector from '@/components/shared/ThemeSelector.vue'
import AppFooter from '@/components/shared/AppFooter.vue'
</script>
