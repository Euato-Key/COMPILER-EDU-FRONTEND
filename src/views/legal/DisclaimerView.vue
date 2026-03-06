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
        <h1 class="text-3xl font-bold text-gray-900 mb-8">免责声明</h1>
        
        <div class="prose prose-blue max-w-none">
          <p class="text-gray-600 mb-6">最后更新日期：2026年3月6日</p>

          <section class="mb-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">1. 教育目的声明</h2>
            <p class="text-gray-600 mb-4">
              编译原理可视化工具（以下简称"本平台"）是一个面向教育和学习目的的非营利性在线工具。
              本平台旨在帮助学习者更好地理解编译原理相关算法和概念，所有内容仅供学习参考使用。
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">2. 内容准确性</h2>
            <p class="text-gray-600 mb-4">
              尽管我们努力确保本平台提供的内容准确无误，但我们不对内容的完整性、准确性、可靠性或适用性作出任何明示或暗示的保证。
            </p>
            <ul class="list-disc list-inside text-gray-600 mb-4 space-y-2">
              <li>算法可视化结果仅供参考，可能不适用于所有特殊情况</li>
              <li>文法分析和自动机转换算法基于标准教科书实现，但可能存在边界情况未完全覆盖</li>
              <li>用户应结合教材和课堂学习，不应仅依赖本平台进行学习</li>
            </ul>
          </section>

          <section class="mb-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">3. 使用风险</h2>
            <p class="text-gray-600 mb-4">
              用户使用本平台即表示理解并同意承担以下风险：
            </p>
            <ul class="list-disc list-inside text-gray-600 mb-4 space-y-2">
              <li>技术故障、网络中断或服务器维护可能导致服务暂时不可用</li>
              <li>浏览器兼容性问题可能影响用户体验</li>
              <li>本地存储数据可能因浏览器清理而丢失</li>
              <li>算法可视化可能与实际编译器实现存在差异</li>
            </ul>
          </section>

          <section class="mb-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">4. 责任限制</h2>
            <p class="text-gray-600 mb-4">
              在法律允许的最大范围内，本平台及其开发者不对以下情况承担责任：
            </p>
            <ul class="list-disc list-inside text-gray-600 mb-4 space-y-2">
              <li>因使用或无法使用本平台而产生的任何直接、间接、附带、特殊或后果性损害</li>
              <li>因依赖本平台内容而导致的学术或商业损失</li>
              <li>因数据丢失或损坏而造成的损失</li>
              <li>因第三方行为或不可抗力导致的服务中断</li>
            </ul>
          </section>

          <section class="mb-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">5. 学术诚信</h2>
            <p class="text-gray-600 mb-4">
              本平台鼓励用户诚信学习，不应用于：
            </p>
            <ul class="list-disc list-inside text-gray-600 mb-4 space-y-2">
              <li>学术不端行为，如作弊或抄袭</li>
              <li>代替个人独立思考和完成作业</li>
              <li>违反学校或教育机构的学术规定</li>
            </ul>
            <p class="text-gray-600 mb-4">
              用户应遵守所在教育机构的学术诚信政策，合理使用本平台辅助学习。
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">6. 第三方链接</h2>
            <p class="text-gray-600 mb-4">
              本平台可能包含指向第三方网站或资源的链接。我们不对这些第三方网站的内容、隐私政策或做法负责。
              访问这些链接的风险由用户自行承担。
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">7. 知识产权</h2>
            <p class="text-gray-600 mb-4">
              本平台的算法实现和可视化设计受知识产权保护。用户可以：
            </p>
            <ul class="list-disc list-inside text-gray-600 mb-4 space-y-2">
              <li>个人学习和研究使用</li>
              <li>引用本平台内容时注明出处</li>
            </ul>
            <p class="text-gray-600 mb-4">
              但不得：
            </p>
            <ul class="list-disc list-inside text-gray-600 mb-4 space-y-2">
              <li>未经授权商业使用本平台内容</li>
              <li>复制、修改或分发本平台的核心代码</li>
              <li>将本平台内容声称为自己的作品</li>
            </ul>
          </section>

          <section class="mb-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">8. 免责声明更新</h2>
            <p class="text-gray-600 mb-4">
              我们保留随时更新本免责声明的权利。更新后的声明将在本页面公布，继续使用本平台即表示您接受更新后的声明。
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">9. 联系我们</h2>
            <p class="text-gray-600">
              如果您对本免责声明有任何疑问，请联系：
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
  name: 'DisclaimerView'
})

import ThemeSelector from '@/components/shared/ThemeSelector.vue'
import AppFooter from '@/components/shared/AppFooter.vue'
</script>
