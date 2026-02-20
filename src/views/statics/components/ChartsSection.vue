<template>
  <div class="charts-section mb-10">
    <div class="section-header flex items-center gap-3 mb-6">
      <div class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
        <Icon icon="lucide:pie-chart" class="w-5 h-5 text-white" />
      </div>
      <div>
        <h2 class="text-2xl font-bold text-gray-900">数据可视化分析</h2>
        <p class="text-sm text-gray-500">多维度图表展示错误分布与趋势</p>
      </div>
    </div>

    <!-- 图表网格 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 模块错误对比柱状图 -->
      <div class="chart-card bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <ModuleBarChart
          ref="barChartRef"
          :data="moduleBarData"
          title="各模块错误对比"
        />
      </div>

      <!-- 错误类型分布饼图 -->
      <div class="chart-card bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-medium text-gray-600">错误类型分布</h3>
          <select
            v-model="selectedModule"
            class="text-sm border border-gray-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部模块</option>
            <option value="fa">FA</option>
            <option value="ll1">LL1</option>
            <option value="lr0">LR0</option>
            <option value="slr1">SLR1</option>
          </select>
        </div>
        <ErrorTypePieChart
          ref="pieChartRef"
          :data="errorTypeData"
          :module-name="selectedModuleName"
        />
      </div>

      <!-- 错误趋势折线图 -->
      <div class="chart-card bg-white rounded-xl p-6 shadow-lg border border-gray-100 lg:col-span-2">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-medium text-gray-600">错误趋势</h3>
          <div class="flex items-center gap-2">
            <select
              v-model="trendModule"
              class="text-sm border border-gray-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">全部模块</option>
              <option value="fa">FA</option>
              <option value="ll1">LL1</option>
              <option value="lr0">LR0</option>
              <option value="slr1">SLR1</option>
            </select>
            <select
              v-model="trendDays"
              class="text-sm border border-gray-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option :value="7">最近7天</option>
              <option :value="30">最近30天</option>
              <option :value="90">最近90天</option>
            </select>
          </div>
        </div>
        <TrendLineChart
          ref="lineChartRef"
          :data="trendData"
          :multi-data="trendModule === '' ? allModulesTrendData : null"
          :module-name="trendModuleName"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Icon } from '@iconify/vue'
import ModuleBarChart from './charts/ModuleBarChart.vue'
import ErrorTypePieChart from './charts/ErrorTypePieChart.vue'
import TrendLineChart from './charts/TrendLineChart.vue'
import { getErrorTrendAPI, type TrendItem } from '@/api/stats'

interface ModuleStat {
  totalErrors: number
  records: number
  steps: Array<{
    step: string
    errors: number
    types: Array<{
      type: string
      count: number
    }>
  }>
}

interface ModuleStats {
  fa: ModuleStat | null
  ll1: ModuleStat | null
  lr0: ModuleStat | null
  slr1: ModuleStat | null
}

const props = defineProps<{
  moduleStats: ModuleStats
  startDate?: string
  endDate?: string
}>()

// 图表组件引用
const barChartRef = ref<InstanceType<typeof ModuleBarChart> | null>(null)
const pieChartRef = ref<InstanceType<typeof ErrorTypePieChart> | null>(null)
const lineChartRef = ref<InstanceType<typeof TrendLineChart> | null>(null)

// 获取所有图表图片
const getChartImages = () => {
  return {
    barChart: barChartRef.value?.getDataURL() || '',
    pieChart: pieChartRef.value?.getDataURL() || '',
    lineChart: lineChartRef.value?.getDataURL() || ''
  }
}

// 暴露方法给父组件
defineExpose({
  getChartImages
})

// 选择的模块（饼图）
const selectedModule = ref('')

// 趋势图配置
const trendModule = ref('')
const trendDays = ref(30)
const trendData = ref<Array<{ date: string; count: number }>>([])

// 模块颜色配置
const moduleColors: Record<string, string> = {
  fa: '#3b82f6',
  ll1: '#10b981',
  lr0: '#8b5cf6',
  slr1: '#f59e0b'
}

const moduleNames: Record<string, string> = {
  fa: 'FA',
  ll1: 'LL1',
  lr0: 'LR0',
  slr1: 'SLR1'
}

interface BarDataItem {
  name: string
  value: number
  color: string
}

// 柱状图数据
const moduleBarData = computed<BarDataItem[]>(() => {
  const data: BarDataItem[] = []
  for (const [key, stat] of Object.entries(props.moduleStats)) {
    if (stat) {
      data.push({
        name: moduleNames[key] || key.toUpperCase(),
        value: stat.totalErrors,
        color: moduleColors[key] || '#6b7280'
      })
    }
  }
  return data
})

// 饼图数据
const errorTypeData = computed(() => {
  const typeCount: Record<string, number> = {}

  for (const [moduleKey, stat] of Object.entries(props.moduleStats)) {
    if (!stat) continue
    if (selectedModule.value && selectedModule.value !== moduleKey) continue

    for (const step of stat.steps) {
      for (const type of step.types) {
        if (!typeCount[type.type]) {
          typeCount[type.type] = 0
        }
        typeCount[type.type] += type.count
      }
    }
  }

  return Object.entries(typeCount).map(([name, value]) => ({
    name,
    value
  }))
})

const selectedModuleName = computed(() => {
  return selectedModule.value ? moduleNames[selectedModule.value] : ''
})

const trendModuleName = computed(() => {
  return trendModule.value ? moduleNames[trendModule.value] : '全部模块'
})

// 所有模块的趋势数据
const allModulesTrendData = ref<Record<string, { date: string; count: number }[]>>({})

// 获取趋势数据
const fetchTrendData = async () => {
  // 如果选择了全部模块，获取所有模块的数据
  if (trendModule.value === '') {
    await fetchAllModulesTrendData()
    return
  }

  try {
    const res = await getErrorTrendAPI({
      module: trendModule.value,
      days: trendDays.value
    })

    if (res.data.code === 0 && res.data.data) {
      trendData.value = res.data.data.trend.map((item: TrendItem) => ({
        date: item.day,
        count: item.daily_errors
      }))
    }
  } catch (err) {
    console.error('获取趋势数据失败:', err)
    trendData.value = []
  }
}

// 获取所有模块的趋势数据
const fetchAllModulesTrendData = async () => {
  const modules = ['fa', 'll1', 'lr0', 'slr1']
  const newData: Record<string, { date: string; count: number }[]> = {}

  await Promise.all(
    modules.map(async (module) => {
      try {
        const res = await getErrorTrendAPI({
          module,
          days: trendDays.value
        })

        if (res.data.code === 0 && res.data.data) {
          newData[module] = res.data.data.trend.map((item: TrendItem) => ({
            date: item.day,
            count: item.daily_errors
          }))
        }
      } catch (err) {
        console.error(`获取${module}趋势数据失败:`, err)
        newData[module] = []
      }
    })
  )

  allModulesTrendData.value = newData

  // 计算总和作为默认显示
  const allDates = new Set<string>()
  Object.values(newData).forEach((moduleData) => {
    moduleData.forEach((item) => allDates.add(item.date))
  })

  const sortedDates = Array.from(allDates).sort()
  trendData.value = sortedDates.map((date) => {
    const totalCount = Object.values(newData).reduce((sum, moduleData) => {
      const item = moduleData.find((d) => d.date === date)
      return sum + (item?.count || 0)
    }, 0)
    return { date, count: totalCount }
  })
}

// 监听趋势配置变化
watch([trendModule, trendDays], () => {
  fetchTrendData()
}, { immediate: true })
</script>

<style scoped>
.chart-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.chart-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}
</style>
