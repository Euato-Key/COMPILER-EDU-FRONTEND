<template>
  <div class="ll1-report-page min-h-screen theme-main-bg theme-transition">
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
            <router-link to="/record/ll1" class="text-xl font-semibold text-gray-600 hover:text-gray-800">历史记录</router-link>
            <span class="text-gray-400">|</span>
            <h1 class="text-xl font-semibold text-gray-800">LL1 答题报告</h1>
          </div>
          <div class="flex items-center gap-2">
            <ThemeSelector />
            <button
              @click="handleExportPDF"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Icon icon="lucide:download" class="w-4 h-4" />
              导出 PDF
            </button>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-5xl mx-auto px-4 py-12 pt-28">
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <Icon icon="lucide:loader-2" class="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p class="text-gray-500">正在生成报告数据...</p>
      </div>

      <div v-else-if="record" class="space-y-8 report-box">
        <!-- 报告概览卡片 -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div class="flex justify-between items-start mb-6">
            <div>
              <h2 class="text-2xl font-bold text-gray-900 mb-2">LL1 语法分析答题报告</h2>
              <div class="flex items-center gap-4 text-sm text-gray-500">
                <span class="flex items-center gap-1">
                  <Icon icon="lucide:hash" class="w-4 h-4" />
                  ID: {{ record.id }}
                </span>
                <span class="flex items-center gap-1">
                  <Icon icon="lucide:calendar" class="w-4 h-4" />
                  时间: {{ record.timestamp }}
                </span>
              </div>
            </div>
            <div class="px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-bold border border-green-100 italic">
              COMPILER-EDU REPORT
            </div>
          </div>

          <!-- 文法展示 -->
          <div class="bg-gray-50 rounded-xl p-6 border border-gray-100">
            <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">输入文法</h3>
            <pre class="font-mono text-lg text-blue-900 whitespace-pre-wrap">{{ record.grammar }}</pre>
          </div>
        </div>

        <!-- 这里后续可以添加更多详细的报告组件 -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
          <Icon icon="lucide:construction" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 class="text-xl font-bold text-gray-900 mb-2">详细报告生成中</h3>
          <p class="text-gray-500 max-w-md mx-auto">
            详细的步骤可视化报告（First/Follow集对比、LL1分析表覆盖率等）正在开发中。
            您现在可以先查看基础答题信息或导出当前文法。
          </p>
        </div>
      </div>

      <div v-else class="bg-white rounded-xl shadow-lg p-20 text-center border border-dashed border-gray-300">
        <Icon icon="lucide:alert-circle" class="w-16 h-16 text-red-300 mx-auto mb-4" />
        <h2 class="text-xl font-bold text-gray-900 mb-2">未找到相关记录</h2>
        <p class="text-gray-500 mb-8">该报告 ID 不存在或已被删除。</p>
        <router-link to="/record/ll1" class="text-blue-600 hover:underline">返回历史记录</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import ThemeSelector from '@/components/shared/ThemeSelector.vue'
import { useLL1Store } from '@/stores'
import type { LL1HistoryRecord } from '@/stores/ll1-new'

const route = useRoute()
const ll1Store = useLL1Store()
const record = ref<LL1HistoryRecord | null>(null)
const loading = ref(true)

onMounted(() => {
  const recordId = route.params.id as string
  const found = ll1Store.historyList.find(r => r.id === recordId)
  
  // 模拟加载
  setTimeout(() => {
    if (found) {
      record.value = found
    }
    loading.value = false
  }, 500)
})

const handleExportPDF = () => {
  window.print()
}
</script>

<style scoped>
@media print {
  header {
    display: none !important;
  }
  .max-w-5xl {
    max-width: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
  }
  .pt-28 {
    padding-top: 0 !important;
  }
}
</style>
