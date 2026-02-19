<template>
  <div ref="chartRef" class="w-full h-full min-h-[300px]"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'

interface TrendData {
  date: string
  count: number
}

interface MultiTrendData {
  [module: string]: TrendData[]
}

const props = defineProps<{
  data: TrendData[]
  multiData?: MultiTrendData | null
  title?: string
  moduleName?: string
}>()

const chartRef = ref<HTMLDivElement>()
let chartInstance: echarts.ECharts | null = null

const initChart = () => {
  if (!chartRef.value) return

  chartInstance = echarts.init(chartRef.value)
  updateChart()

  window.addEventListener('resize', handleResize)
}

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

const updateChart = () => {
  if (!chartInstance) return

  // 如果是多模块模式
  if (props.multiData && Object.keys(props.multiData).length > 0) {
    updateMultiModuleChart()
    return
  }

  const dates = props.data.map(item => item.date)
  const counts = props.data.map(item => item.count)

  const option: echarts.EChartsOption = {
    title: {
      text: props.title || `${props.moduleName || ''}错误趋势`,
      left: 'center',
      textStyle: {
        fontSize: 14,
        fontWeight: 'normal'
      }
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const data = params[0]
        return `${data.name}<br/>错误次数: <b>${data.value}</b>`
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates,
      axisLabel: {
        fontSize: 11,
        rotate: dates.length > 10 ? 45 : 0
      }
    },
    yAxis: {
      type: 'value',
      name: '错误次数',
      axisLabel: {
        fontSize: 12
      }
    },
    series: [
      {
        name: '错误次数',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        sampling: 'average',
        itemStyle: {
          color: '#3b82f6'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
            { offset: 1, color: 'rgba(59, 130, 246, 0.05)' }
          ])
        },
        data: counts,
        lineStyle: {
          width: 2
        }
      }
    ]
  }

  chartInstance.setOption(option, true)
}

// 多模块模式图表更新
const updateMultiModuleChart = () => {
  if (!chartInstance || !props.multiData) return

  // 收集所有日期
  const allDates = new Set<string>()
  Object.values(props.multiData).forEach((moduleData) => {
    moduleData.forEach((item) => allDates.add(item.date))
  })
  const sortedDates = Array.from(allDates).sort()

  // 为每个模块创建 series
  const series: echarts.SeriesOption[] = Object.entries(props.multiData).map(([module, moduleData]) => {
    const color = moduleColors[module] || '#6b7280'
    const data = sortedDates.map((date) => {
      const item = moduleData.find((d) => d.date === date)
      return item?.count || 0
    })

    return {
      name: moduleNames[module] || module.toUpperCase(),
      type: 'line' as const,
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      itemStyle: {
        color: color
      },
      lineStyle: {
        width: 2
      },
      data: data
    }
  })

  const option: echarts.EChartsOption = {
    title: {
      text: '各模块错误趋势对比',
      left: 'center',
      textStyle: {
        fontSize: 14,
        fontWeight: 'normal'
      }
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        let result = `${params[0].name}<br/>`
        params.forEach((param: any) => {
          result += `${param.marker} ${param.seriesName}: <b>${param.value}</b><br/>`
        })
        return result
      }
    },
    legend: {
      data: series.map((s) => s.name).filter((name): name is string => typeof name === 'string'),
      bottom: 0,
      textStyle: {
        fontSize: 12
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: sortedDates,
      axisLabel: {
        fontSize: 11,
        rotate: sortedDates.length > 10 ? 45 : 0
      }
    },
    yAxis: {
      type: 'value',
      name: '错误次数',
      axisLabel: {
        fontSize: 12
      }
    },
    series: series
  }

  chartInstance.setOption(option, true)
}

const handleResize = () => {
  chartInstance?.resize()
}

// 获取图表图片数据
const getDataURL = (): string => {
  if (!chartInstance) return ''
  return chartInstance.getDataURL({
    type: 'png',
    pixelRatio: 2,
    backgroundColor: '#fff'
  })
}

onMounted(() => {
  initChart()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
})

watch(() => props.data, () => {
  updateChart()
}, { deep: true })

// 暴露方法给父组件
defineExpose({
  getDataURL
})
</script>
