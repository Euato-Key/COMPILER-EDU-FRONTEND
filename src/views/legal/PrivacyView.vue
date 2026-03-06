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
        <h1 class="text-3xl font-bold text-gray-900 mb-8">隐私政策</h1>
        
        <div class="prose prose-blue max-w-none">
          <p class="text-gray-600 mb-6">最后更新日期：2026年3月6日</p>

          <section class="mb-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">1. 引言</h2>
            <p class="text-gray-600 mb-4">
              编译原理可视化工具（以下简称"本平台"）由广州大学计算机科学与网络工程学院开发，
              重视用户的隐私保护。本隐私政策说明了我们如何收集、使用、存储和保护您的个人信息。
              使用本平台即表示您同意本隐私政策的条款。
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">2. 信息收集</h2>
            <p class="text-gray-600 mb-4">本平台收集的信息如下：</p>
            
            <h3 class="text-lg font-medium text-gray-800 mb-3">2.1 本地存储数据（仅浏览器本地）</h3>
            <p class="text-gray-600 mb-4">
              以下数据<strong>仅存储在您的浏览器本地</strong>（使用 LocalStorage），我们不会上传到任何服务器：
            </p>
            <ul class="list-disc list-inside text-gray-600 mb-4 space-y-2">
              <li><strong>AI 聊天数据</strong> - 您与 AI 助手的对话记录</li>
              <li><strong>AI 生成的报告数据</strong> - 学习报告和分析结果</li>
              <li><strong>答题记录与错误记录</strong> - 您的练习历史和错误次数</li>
              <li><strong>主题偏好设置</strong> - 界面主题选择</li>
            </ul>

            <h3 class="text-lg font-medium text-gray-800 mb-3">2.2 学习统计数据（传输到服务器）</h3>
            <p class="text-gray-600 mb-4">
              为了在学习统计页面展示您的学习情况，以下数据会传输到广州大学服务器：
            </p>
            <ul class="list-disc list-inside text-gray-600 mb-4 space-y-2">
              <li><strong>错误次数</strong> - 用于统计学习进度和正确率</li>
              <li><strong>练习次数</strong> - 用于生成学习统计报告</li>
              <li><strong>答题时间</strong> - 用于分析学习时长</li>
            </ul>
            <p class="text-gray-600 mb-4">
              <strong>重要说明：</strong>这些数据仅用于学习统计分析，不会分享给第三方。我们仅收集学习统计数据，不收集个人身份信息。
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">3. 数据存储与安全</h2>
            <p class="text-gray-600 mb-4">
              <strong>本地存储：</strong>AI聊天数据、AI报告数据、答题记录等仅存储在您的浏览器本地存储中。
            </p>
            <p class="text-gray-600 mb-4">
              <strong>服务器存储：</strong>学习统计数据（错误次数、练习次数等）会传输并存储在广州大学服务器上，用于生成学习统计报告。
            </p>
            <p class="text-gray-600 mb-4">
              <strong>数据安全：</strong>我们采取合理的技术措施保护您的数据安全，包括数据加密传输和访问控制。
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">4. 我们不收集的信息</h2>
            <p class="text-gray-600 mb-4">为保护您的隐私，我们明确声明不收集以下信息：</p>
            <ul class="list-disc list-inside text-gray-600 mb-4 space-y-2">
              <li>个人身份信息（姓名、学号、身份证号等）</li>
              <li>联系方式（手机号、邮箱地址等）</li>
              <li>位置信息</li>
              <li>设备唯一标识符</li>
              <li>浏览历史记录</li>
            </ul>
          </section>

          <section class="mb-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">5. Cookie 使用</h2>
            <p class="text-gray-600 mb-4">
              <strong>本平台不使用 Cookie。</strong>我们仅使用浏览器本地存储（LocalStorage）来保存您的学习数据。
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">6. 用户权利</h2>
            <p class="text-gray-600 mb-4">您拥有以下权利：</p>
            <ul class="list-disc list-inside text-gray-600 mb-4 space-y-2">
              <li><strong>查看本地数据</strong> - 通过浏览器开发者工具查看本地存储数据</li>
              <li><strong>清除本地数据</strong> - 随时清除浏览器本地存储数据</li>
              <li><strong>查看服务器数据</strong> - 在学习统计页面查看已上传的学习统计数据</li>
              <li><strong>导出数据</strong> - 使用平台提供的导出功能保存学习记录</li>
              <li><strong>停止使用</strong> - 随时停止使用本平台</li>
            </ul>
          </section>

          <section class="mb-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">7. 第三方服务</h2>
            <p class="text-gray-600 mb-4">
              本平台使用以下第三方服务：
            </p>
            <ul class="list-disc list-inside text-gray-600 mb-4 space-y-2">
              <li><strong>Iconify</strong> - 图标库服务，仅用于显示界面图标</li>
            </ul>
            <p class="text-gray-600 mb-4">
              这些服务不会收集您的个人学习数据。
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">8. 隐私政策更新</h2>
            <p class="text-gray-600 mb-4">
              我们可能会不时更新本隐私政策。更新后的政策将在本页面公布，继续使用本平台即表示您接受更新后的政策。
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">9. 联系我们</h2>
            <p class="text-gray-600">
              如果您对本隐私政策有任何疑问或建议，请联系：
            </p>
            <p class="text-gray-600 mt-2">
              <strong>广州大学计算机科学与网络工程学院</strong>
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
  name: 'PrivacyView'
})

import ThemeSelector from '@/components/shared/ThemeSelector.vue'
import AppFooter from '@/components/shared/AppFooter.vue'
</script>
