<template>
  <div class="statics-page min-h-screen theme-main-bg theme-transition">
    <!-- 头部导航 - 与主页呼应 -->
    <header class="fixed top-0 left-0 right-0 z-50 theme-header-bg backdrop-blur-sm border-b theme-header-border">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <router-link to="/" class="text-2xl font-bold theme-header-text hover:opacity-80 transition-colors">
              编译原理可视化工具
            </router-link>
          </div>
          <div class="flex items-center gap-2">
            <router-link
              to="/statics"
              class="px-3 py-2 theme-header-text hover:opacity-80 transition-colors font-semibold"
            >
              学习统计
            </router-link>
            <router-link
              to="/record"
              class="px-3 py-2 theme-header-text hover:opacity-80 transition-colors"
            >
              答题记录
            </router-link>
            <ThemeSelector />
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
    <main class="max-w-7xl mx-auto px-4 py-8 mt-20">
      <!-- 页面标题 -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          学习统计
        </h1>
        <p class="text-gray-600">
          查看所有用户的学习错误统计，了解各模块的掌握情况
        </p>
      </div>

      <!-- 时间轴选择器 -->
      <TimeRangeSelector
        v-model:start-date="startDate"
        v-model:end-date="endDate"
        @change="handleTimeRangeChange"
      />

      <!-- 总统计卡片 -->
      <div class="stats-overview mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="stat-card bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-blue-100 text-sm mb-1">总错误次数</p>
                <p class="text-3xl font-bold">{{ totalStats.totalErrors }}</p>
              </div>
              <Icon icon="lucide:alert-circle" class="w-10 h-10 text-blue-200" />
            </div>
          </div>

          <div class="stat-card bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-green-100 text-sm mb-1">答题记录数</p>
                <p class="text-3xl font-bold">{{ totalStats.totalRecords }}</p>
              </div>
              <Icon icon="lucide:file-text" class="w-10 h-10 text-green-200" />
            </div>
          </div>

          <div class="stat-card bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-purple-100 text-sm mb-1">平均错误次数</p>
                <p class="text-3xl font-bold">{{ totalStats.avgErrors }}</p>
              </div>
              <Icon icon="lucide:bar-chart-2" class="w-10 h-10 text-purple-200" />
            </div>
          </div>

          <div class="stat-card bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-6 shadow-lg">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-orange-100 text-sm mb-1">活跃模块数</p>
                <p class="text-3xl font-bold">{{ totalStats.activeModules }}</p>
              </div>
              <Icon icon="lucide:layers" class="w-10 h-10 text-orange-200" />
            </div>
          </div>
        </div>
      </div>

      <!-- 各模块统计 -->
      <ModulesStats :module-stats="moduleStats" />

      <!-- 加载状态 -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- 错误提示 -->
      <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-center text-red-600">
        {{ error }}
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { Icon } from '@iconify/vue'
import ThemeSelector from '@/components/shared/ThemeSelector.vue'
import TimeRangeSelector from './components/TimeRangeSelector.vue'
import ModulesStats from './components/ModulesStats.vue'
import type { ModuleStat as ModuleStatsType } from './utils/types'
import {
  getOverallStatsAPI,
  getStatsSummaryAPI,
  getErrorDistributionAPI,
  type StatsSummaryItem
} from '@/api/stats'

// 加载状态
const loading = ref(false)
const error = ref('')

// 时间范围
const startDate = ref('')
const endDate = ref('')

// 总统计数据
const totalStats = reactive({
  totalErrors: 0,
  totalRecords: 0,
  avgErrors: 0,
  activeModules: 0
})

// 各模块统计
const moduleStats = reactive<{
  fa: ModuleStatsType | null
  ll1: ModuleStatsType | null
  lr0: ModuleStatsType | null
  slr1: ModuleStatsType | null
}>({
  fa: null,
  ll1: null,
  lr0: null,
  slr1: null
})

// 获取统计数据
const fetchStats = async () => {
  loading.value = true
  error.value = ''

  try {
    // 获取整体统计（带时间范围）
    const overallRes = await getOverallStatsAPI({
      start_date: startDate.value || undefined,
      end_date: endDate.value || undefined
    })

    if (overallRes.data.code === 0 && overallRes.data.data) {
      const data = overallRes.data.data
      totalStats.totalErrors = data.total_errors
      totalStats.totalRecords = data.total_records
      totalStats.activeModules = data.module_stats?.length || 0
      totalStats.avgErrors = data.total_records > 0
        ? Math.round((data.total_errors / data.total_records) * 10) / 10
        : 0
    }

    // 获取各模块详细统计
    const summaryRes = await getStatsSummaryAPI({
      start_date: startDate.value || undefined,
      end_date: endDate.value || undefined
    })

    if (summaryRes.data.code === 0 && summaryRes.data.data) {
      await processModuleStats(summaryRes.data.data)
    }
  } catch (err) {
    console.error('获取统计数据失败:', err)
    error.value = '获取统计数据失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 处理模块统计数据
const processModuleStats = async (summaryData: StatsSummaryItem[]) => {
  // 重置模块统计
  moduleStats.fa = null
  moduleStats.ll1 = null
  moduleStats.lr0 = null
  moduleStats.slr1 = null

  // 按模块分组
  const groupedByModule: Record<string, StatsSummaryItem[]> = {}
  summaryData.forEach(item => {
    if (!groupedByModule[item.module]) {
      groupedByModule[item.module] = []
    }
    groupedByModule[item.module].push(item)
  })

  // 处理每个模块的数据
  for (const [module, items] of Object.entries(groupedByModule)) {
    const totalErrors = items.reduce((sum, item) => sum + item.total_errors, 0)
    const records = items.reduce((sum, item) => sum + item.affected_records, 0)

    // 获取该模块的错误类型分布
    let distribution: { step: string; error_type: string; total_errors: number }[] = []
    try {
      const distRes = await getErrorDistributionAPI({
        module,
        start_date: startDate.value || undefined,
        end_date: endDate.value || undefined
      })
      if (distRes.data.code === 0 && distRes.data.data) {
        distribution = distRes.data.data.distribution
      }
    } catch {
      // 获取失败则使用空数组
    }

    // 按步骤组织数据
    const steps = items.map(item => {
      // 获取该步骤的错误类型分布
      const stepTypes = distribution
        .filter(d => d.step === item.step)
        .map(d => ({
          type: d.error_type,
          count: d.total_errors
        }))

      return {
        step: item.step,
        errors: item.total_errors,
        types: stepTypes
      }
    })

    moduleStats[module] = {
      totalErrors,
      records,
      steps
    }
  }
}

// 时间范围变化处理
const handleTimeRangeChange = () => {
  fetchStats()
}

onMounted(() => {
  // 设置默认时间范围为最近30天
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - 30)

  endDate.value = end.toISOString().split('T')[0]
  startDate.value = start.toISOString().split('T')[0]

  fetchStats()
})
</script>

<style scoped>
.statics-page {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.stat-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}


</style>
