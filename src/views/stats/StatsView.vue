<template>
  <div class="stats-view">
    <div class="stats-header">
      <h1>学习统计</h1>
      <p class="subtitle">各模块答题错误统计分析</p>
    </div>

    <!-- 整体统计卡片 -->
    <div class="overall-stats" v-if="overallStats">
      <div class="stat-card total">
        <div class="stat-value">{{ overallStats?.total_errors ?? 0 }}</div>
        <div class="stat-label">总错误次数</div>
      </div>
      <div class="stat-card records">
        <div class="stat-value">{{ overallStats?.total_records ?? 0 }}</div>
        <div class="stat-label">答题记录数</div>
      </div>
      <div class="stat-card today">
        <div class="stat-value">{{ overallStats?.today_stats?.errors ?? 0 }}</div>
        <div class="stat-label">今日错误</div>
      </div>
      <div class="stat-card today-records">
        <div class="stat-value">{{ overallStats?.today_stats?.records ?? 0 }}</div>
        <div class="stat-label">今日答题</div>
      </div>
    </div>

    <!-- 筛选器 -->
    <div class="filters">
      <div class="filter-group">
        <label>模块</label>
        <select v-model="selectedModule" @change="handleModuleChange">
          <option value="">全部模块</option>
          <option value="lr0">LR0</option>
          <option value="slr1">SLR1</option>
          <option value="ll1">LL1</option>
          <option value="fa">FA</option>
        </select>
      </div>
      <div class="filter-group">
        <label>步骤</label>
        <select v-model="selectedStep" :disabled="!selectedModule">
          <option value="">全部步骤</option>
          <option v-for="step in availableSteps" :key="step" :value="step">{{ step }}</option>
        </select>
      </div>
      <div class="filter-group">
        <label>开始日期</label>
        <input type="date" v-model="startDate" />
      </div>
      <div class="filter-group">
        <label>结束日期</label>
        <input type="date" v-model="endDate" />
      </div>
      <button class="btn-primary" @click="fetchData">查询</button>
      <button class="btn-secondary" @click="resetFilters">重置</button>
    </div>

    <!-- 模块统计图表 -->
    <div class="chart-section" v-if="moduleStats.length > 0">
      <h2>各模块错误分布</h2>
      <div class="module-chart">
        <div v-for="stat in moduleStats" :key="stat.module" class="module-bar">
          <div class="module-name">{{ stat.module.toUpperCase() }}</div>
          <div class="bar-container">
            <div class="bar" :style="{ width: getModuleBarWidth(stat.errors) + '%' }"></div>
            <span class="bar-value">{{ stat.errors }} 次</span>
          </div>
          <div class="module-records">{{ stat.records }} 条记录</div>
        </div>
      </div>
    </div>

    <!-- 步骤统计表格 -->
    <div class="table-section" v-if="summaryData.length > 0">
      <h2>各步骤错误统计</h2>
      <table class="stats-table">
        <thead>
          <tr>
            <th>模块</th>
            <th>步骤</th>
            <th>错误次数</th>
            <th>涉及记录数</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in summaryData" :key="`${item.module}-${item.step}`">
            <td>{{ item.module.toUpperCase() }}</td>
            <td>{{ item.step }}</td>
            <td class="error-count">{{ item.total_errors }}</td>
            <td>{{ item.affected_records }}</td>
            <td>
              <button class="btn-link" @click="showDistribution(item.module, item.step)">
                查看详情
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 错误类型分布弹窗 -->
    <div class="modal" v-if="showModal" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ selectedModuleForModal.toUpperCase() }} - {{ selectedStepForModal }} 错误分布</h3>
          <button class="btn-close" @click="closeModal">&times;</button>
        </div>
        <div class="modal-body">
          <div v-if="distributionData.length === 0" class="empty-state">
            暂无数据
          </div>
          <div v-else class="distribution-list">
            <div v-for="item in distributionData" :key="item.error_type" class="distribution-item">
              <div class="distribution-info">
                <span class="error-type">{{ item.error_type }}</span>
                <span class="error-count">{{ item.total_errors }} 次</span>
              </div>
              <div class="distribution-bar">
                <div class="bar" :style="{ width: item.percentage + '%' }"></div>
                <span class="percentage">{{ item.percentage }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 趋势图表 -->
    <div class="chart-section" v-if="trendData.length > 0">
      <h2>错误趋势（最近30天）</h2>
      <div class="trend-chart">
        <div class="trend-bars">
          <div v-for="item in trendData" :key="item.day" class="trend-bar-item">
            <div class="trend-bar-container">
              <div class="trend-bar" :style="{ height: getTrendBarHeight(item.daily_errors) + '%' }"></div>
            </div>
            <div class="trend-label">{{ formatDate(item.day) }}</div>
            <div class="trend-value">{{ item.daily_errors }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 管理功能 -->
    <div class="admin-section">
      <h2>数据管理</h2>
      <div class="admin-actions">
        <button class="btn-danger" @click="confirmClearAll">清空所有数据</button>
        <select v-model="moduleToDelete">
          <option value="">选择模块</option>
          <option value="lr0">LR0</option>
          <option value="slr1">SLR1</option>
          <option value="ll1">LL1</option>
          <option value="fa">FA</option>
        </select>
        <button class="btn-danger" :disabled="!moduleToDelete" @click="confirmDeleteModule">
          删除模块数据
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import {
  getOverallStatsAPI,
  getStatsSummaryAPI,
  getErrorDistributionAPI,
  getErrorTrendAPI,
  clearAllStatsAPI,
  deleteModuleStatsAPI,
  type StatsSummaryItem,
  type ErrorDistributionItem,
  type TrendItem,
  type OverallStats
} from '@/api/stats'

// 状态
const overallStats = ref<OverallStats | null>(null)
const summaryData = ref<StatsSummaryItem[]>([])
const distributionData = ref<ErrorDistributionItem[]>([])
const trendData = ref<TrendItem[]>([])
const moduleStats = computed(() => overallStats.value?.module_stats || [])

// 默认空对象，用于类型安全
const defaultOverallStats: OverallStats = {
  total_errors: 0,
  total_records: 0,
  module_stats: [],
  today_stats: { errors: 0, records: 0 }
}

// 筛选器状态
const selectedModule = ref('')
const selectedStep = ref('')
const startDate = ref('')
const endDate = ref('')
const moduleToDelete = ref('')

// 弹窗状态
const showModal = ref(false)
const selectedModuleForModal = ref('')
const selectedStepForModal = ref('')

// 可用步骤
const availableSteps = computed(() => {
  const stepsMap: Record<string, string[]> = {
    lr0: ['step2', 'step3', 'step4', 'step5'],
    slr1: ['step2', 'step3', 'step4', 'step5'],
    ll1: ['step2', 'step3', 'step4'],
    fa: ['step2', 'step3', 'step4', 'step5', 'step6']
  }
  return selectedModule.value ? stepsMap[selectedModule.value] || [] : []
})

// 获取数据
const fetchData = async () => {
  try {
    // 获取整体统计
    const overallRes = await getOverallStatsAPI()
    if (overallRes.data.code === 0 && overallRes.data.data) {
      overallStats.value = overallRes.data.data
    }

    // 获取摘要数据
    const summaryRes = await getStatsSummaryAPI({
      module: selectedModule.value || undefined,
      step: selectedStep.value || undefined,
      start_date: startDate.value || undefined,
      end_date: endDate.value || undefined
    })
    if (summaryRes.data.code === 0 && summaryRes.data.data) {
      summaryData.value = summaryRes.data.data
    }

    // 获取趋势数据（如果选择了模块）
    if (selectedModule.value) {
      const trendRes = await getErrorTrendAPI({
        module: selectedModule.value,
        step: selectedStep.value || undefined,
        days: 30
      })
      if (trendRes.data.code === 0 && trendRes.data.data) {
        trendData.value = trendRes.data.data.trend
      }
    } else {
      trendData.value = []
    }
  } catch (error) {
    console.error('获取统计数据失败:', error)
    alert('获取统计数据失败')
  }
}

// 显示错误分布
const showDistribution = async (module: string, step: string) => {
  selectedModuleForModal.value = module
  selectedStepForModal.value = step
  showModal.value = true

  try {
    const res = await getErrorDistributionAPI({
      module,
      step,
      start_date: startDate.value || undefined,
      end_date: endDate.value || undefined
    })
    if (res.data.code === 0 && res.data.data) {
      distributionData.value = res.data.data.distribution
    }
  } catch (error) {
    console.error('获取错误分布失败:', error)
  }
}

// 关闭弹窗
const closeModal = () => {
  showModal.value = false
  distributionData.value = []
}

// 重置筛选器
const resetFilters = () => {
  selectedModule.value = ''
  selectedStep.value = ''
  startDate.value = ''
  endDate.value = ''
  fetchData()
}

// 处理模块变化
const handleModuleChange = () => {
  selectedStep.value = ''
}

// 计算模块柱状图宽度
const getModuleBarWidth = (errors: number) => {
  const max = Math.max(...moduleStats.value.map(s => s.errors), 1)
  return (errors / max) * 100
}

// 计算趋势柱状图高度
const getTrendBarHeight = (errors: number) => {
  const max = Math.max(...trendData.value.map(t => t.daily_errors), 1)
  return (errors / max) * 100
}

// 格式化日期
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}/${date.getDate()}`
}

// 清空所有数据
const confirmClearAll = async () => {
  if (!confirm('确定要清空所有统计数据吗？此操作不可恢复！')) {
    return
  }
  try {
    const res = await clearAllStatsAPI()
    if (res.data.code === 0) {
      alert('数据已清空')
      fetchData()
    }
  } catch (error) {
    console.error('清空数据失败:', error)
    alert('清空数据失败')
  }
}

// 删除模块数据
const confirmDeleteModule = async () => {
  if (!moduleToDelete.value) return
  if (!confirm(`确定要删除 ${moduleToDelete.value.toUpperCase()} 模块的所有数据吗？`)) {
    return
  }
  try {
    const res = await deleteModuleStatsAPI(moduleToDelete.value)
    if (res.data.code === 0) {
      alert('模块数据已删除')
      moduleToDelete.value = ''
      fetchData()
    }
  } catch (error) {
    console.error('删除模块数据失败:', error)
    alert('删除模块数据失败')
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.stats-view {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.stats-header {
  margin-bottom: 24px;
}

.stats-header h1 {
  font-size: 28px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.subtitle {
  color: #666;
  font-size: 14px;
}

/* 整体统计卡片 */
.overall-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.stat-card.total {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.stat-card.records {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  color: white;
}

.stat-card.today {
  background: linear-gradient(135deg, #fc4a1a 0%, #f7b733 100%);
  color: white;
}

.stat-card.today-records {
  background: linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%);
  color: white;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  opacity: 0.9;
}

/* 筛选器 */
.filters {
  display: flex;
  gap: 16px;
  align-items: flex-end;
  background: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filter-group label {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.filter-group select,
.filter-group input {
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  min-width: 120px;
}

.btn-primary {
  background: #4a90d9;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.btn-primary:hover {
  background: #357abd;
}

.btn-secondary {
  background: #f0f0f0;
  color: #666;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.btn-secondary:hover {
  background: #e0e0e0;
}

/* 图表区域 */
.chart-section {
  background: white;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.chart-section h2 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #1a1a1a;
}

/* 模块柱状图 */
.module-chart {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.module-bar {
  display: flex;
  align-items: center;
  gap: 16px;
}

.module-name {
  width: 80px;
  font-weight: 600;
  color: #333;
}

.bar-container {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
}

.bar {
  height: 24px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  transition: width 0.3s ease;
}

.bar-value {
  font-size: 14px;
  color: #666;
  min-width: 60px;
}

.module-records {
  width: 100px;
  text-align: right;
  color: #999;
  font-size: 14px;
}

/* 表格 */
.table-section {
  background: white;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.table-section h2 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #1a1a1a;
}

.stats-table {
  width: 100%;
  border-collapse: collapse;
}

.stats-table th,
.stats-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}

.stats-table th {
  font-weight: 600;
  color: #666;
  font-size: 14px;
}

.stats-table td {
  font-size: 14px;
  color: #333;
}

.error-count {
  color: #e74c3c;
  font-weight: 600;
}

.btn-link {
  background: none;
  border: none;
  color: #4a90d9;
  cursor: pointer;
  font-size: 14px;
  padding: 0;
}

.btn-link:hover {
  text-decoration: underline;
}

/* 弹窗 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 600;
}

.btn-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
  max-height: 60vh;
}

.empty-state {
  text-align: center;
  color: #999;
  padding: 40px;
}

.distribution-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.distribution-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.distribution-info {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.error-type {
  font-weight: 500;
  color: #333;
}

.error-count {
  color: #666;
}

.distribution-bar {
  display: flex;
  align-items: center;
  gap: 12px;
}

.distribution-bar .bar {
  flex: 1;
  height: 20px;
  background: linear-gradient(90deg, #11998e 0%, #38ef7d 100%);
  border-radius: 10px;
}

.percentage {
  width: 50px;
  text-align: right;
  font-size: 14px;
  color: #666;
}

/* 趋势图 */
.trend-chart {
  overflow-x: auto;
}

.trend-bars {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  height: 200px;
  padding-bottom: 30px;
}

.trend-bar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 30px;
}

.trend-bar-container {
  width: 100%;
  height: 150px;
  display: flex;
  align-items: flex-end;
}

.trend-bar {
  width: 100%;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px 4px 0 0;
  transition: height 0.3s ease;
  min-height: 4px;
}

.trend-label {
  font-size: 10px;
  color: #999;
  margin-top: 4px;
  transform: rotate(-45deg);
  white-space: nowrap;
}

.trend-value {
  font-size: 10px;
  color: #666;
  margin-top: 2px;
}

/* 管理区域 */
.admin-section {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.admin-section h2 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #1a1a1a;
}

.admin-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.btn-danger {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.btn-danger:hover {
  background: #c0392b;
}

.btn-danger:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.admin-actions select {
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
}

@media (max-width: 768px) {
  .overall-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .filters {
    flex-wrap: wrap;
  }

  .module-bar {
    flex-wrap: wrap;
  }

  .module-name {
    width: 100%;
    margin-bottom: 4px;
  }
}
</style>
