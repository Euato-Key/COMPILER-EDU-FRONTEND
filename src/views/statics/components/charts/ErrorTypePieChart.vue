<template>
  <div ref="chartRef" class="w-full h-full min-h-[300px]"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'

interface ErrorTypeData {
  name: string
  value: number
}

const props = defineProps<{
  data: ErrorTypeData[]
  title?: string
  moduleName?: string
}>()

const chartRef = ref<HTMLDivElement>()
let chartInstance: echarts.ECharts | null = null

const formatErrorTypeName = (type: string): string => {
  const typeNames: Record<string, string> = {
    conversionTable: '转换表',
    transitionMatrix: '转移矩阵',
    pSets: '状态子集',
    minimizedMatrix: '最小化矩阵',
    firstSet: 'First集',
    followSet: 'Follow集',
    parsingTable: '分析表',
    analysisStep: '输入串分析',
    augmentedFormula: '增广文法',
    dfaState: 'DFA状态',
    gotoTransition: 'Goto转换',
    actionTable: 'Action表',
    gotoTable: 'Goto表'
  }
  return typeNames[type] || type
}

const initChart = () => {
  if (!chartRef.value) return

  chartInstance = echarts.init(chartRef.value)
  updateChart()

  window.addEventListener('resize', handleResize)
}

const updateChart = () => {
  if (!chartInstance) return

  const formattedData = props.data.map(item => ({
    name: formatErrorTypeName(item.name),
    value: item.value
  }))

  const option: echarts.EChartsOption = {
    title: {
      text: props.title || `${props.moduleName || ''}错误类型分布`,
      left: 'center',
      textStyle: {
        fontSize: 14,
        fontWeight: 'normal'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        return `${params.name}<br/>错误次数: <b>${params.value}</b><br/>占比: <b>${params.percent}%</b>`
      }
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'middle',
      itemWidth: 10,
      itemHeight: 10,
      textStyle: {
        fontSize: 11
      }
    },
    series: [
      {
        name: '错误类型',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['60%', '55%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 6,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: formattedData
      }
    ],
    color: [
      '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
      '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16',
      '#f97316', '#6366f1', '#14b8a6', '#f43f5e'
    ]
  }

  chartInstance.setOption(option)
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
