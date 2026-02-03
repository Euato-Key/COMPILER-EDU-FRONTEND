<template>
  <div class="ll1-report-page min-h-screen bg-gray-50">
    <header class="bg-white border-b sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <router-link
              to="/record/ll1"
              class="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
            >
              <Icon icon="lucide:arrow-left" class="w-6 h-6" />
            </router-link>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">LL1 答题报告</h1>
              <p class="text-sm text-gray-500 mt-1">查看详细的答题进度和错误分析</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <button
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              @click="showStudentInfoModal('html')"
            >
              <Icon icon="lucide:download" class="w-4 h-4" />
              导出报告
            </button>
          </div>
        </div>
      </div>
    </header>

    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="text-center">
        <Icon icon="lucide:loader-2" class="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
        <p class="text-gray-500">加载报告数据中...</p>
      </div>
    </div>

    <div v-else-if="!reportData" class="flex items-center justify-center py-20">
      <div class="text-center">
        <Icon icon="lucide:file-x" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p class="text-gray-500 text-lg">未找到报告数据</p>
        <router-link
          to="/record/ll1"
          class="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          返回记录列表
        </router-link>
      </div>
    </div>

    <div v-else id="report-content" class="max-w-7xl mx-auto px-4 py-8">
      <div class="space-y-6">
        <!-- 基础信息卡片 -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div class="col-span-2">
              <h2 class="text-sm font-semibold text-gray-500 mb-2">文法产生式</h2>
              <div class="p-3 bg-gray-50 rounded-lg font-mono text-sm text-gray-900 whitespace-pre-wrap max-h-40 overflow-y-auto">
                {{ reportData.grammar }}
              </div>
            </div>
            <div>
              <h2 class="text-sm font-semibold text-gray-500 mb-2">记录 ID</h2>
              <div class="p-3 bg-blue-50 rounded-lg font-mono text-xs text-blue-800 break-all">
                {{ reportData.recordId }}
              </div>
            </div>
            <div class="space-y-4">
              <div>
                <h2 class="text-sm font-semibold text-gray-500 mb-2">创建时间</h2>
                <div class="p-3 bg-gray-50 rounded-lg text-xs text-gray-700">
                  {{ formatDate(reportData.createdAt) }}
                </div>
              </div>
              <div>
                <h2 class="text-sm font-semibold text-gray-500 mb-2">最后修改</h2>
                <div class="p-3 bg-gray-50 rounded-lg text-xs text-gray-700">
                  {{ formatDate(reportData.lastModified) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 总体进度条 -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Icon icon="lucide:bar-chart-2" class="w-5 h-5 text-blue-600" />
              总体完成进度
            </h3>
            <div class="flex items-center gap-2">
              <span class="text-3xl font-bold" :class="reportData.overall.completed ? 'text-green-600' : 'text-gray-900'">
                {{ reportData.overall.progress }}%
              </span>
              <div v-if="reportData.overall.completed" class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-1">
                <Icon icon="lucide:check-circle" class="w-4 h-4" />
                已完成
              </div>
            </div>
          </div>
          <div class="h-4 bg-gray-100 rounded-full overflow-hidden">
            <div 
              class="h-full rounded-full transition-all duration-700 ease-out"
              :class="getOverallProgressBarClass(reportData.overall.progress)"
              :style="{ width: reportData.overall.progress + '%' }"
            />
          </div>
        </div>

        <!-- 步骤进度卡片 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ReportProgressCard
            title="步骤 2：First & Follow 集合"
            icon="lucide:list-checks"
            iconColor="text-indigo-600"
            :items="{
              firstSets: {
                label: 'First 集合构造',
                progress: reportData.step2.firstSets.progress,
                completed: reportData.step2.firstSets.completed
              },
              followSets: {
                label: 'Follow 集合构造',
                progress: reportData.step2.followSets.progress,
                completed: reportData.step2.followSets.completed
              }
            }"
            :stats="reportData.step2"
          />

          <ReportProgressCard
            title="步骤 3：LL1 预测分析表"
            icon="lucide:table"
            iconColor="text-pink-600"
            :items="{
              parsingTable: {
                label: '分析表填充',
                progress: reportData.step3.parsingTable.progress,
                completed: reportData.step3.parsingTable.completed
              }
            }"
            :stats="reportData.step3"
          />
        </div>
        
        <!-- Step 4 单独展示 (如果有输入串) -->
        <div v-if="currentRecord && currentRecord.userData.inputString" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
             <ReportProgressCard
                title="步骤 4：输入串分析"
                icon="lucide:play-circle"
                iconColor="text-orange-600"
                :items="{
                  analysisSteps: {
                    label: '分析步骤验证',
                    progress: reportData.step4.analysisSteps.progress,
                    completed: reportData.step4.analysisSteps.completed
                  }
                }"
                :stats="reportData.step4"
             />
             <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-center">
                 <h3 class="text-sm font-semibold text-gray-500 mb-2">输入串</h3>
                 <div class="p-4 bg-orange-50 rounded-lg text-lg font-mono text-orange-900 break-all">
                     {{ currentRecord.userData.inputString }}
                 </div>
             </div>
        </div>


        <!-- 错误统计概览 -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Icon icon="lucide:alert-circle" class="w-5 h-5 text-red-600" />
            错误统计
          </h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div class="p-4 bg-red-50 rounded-lg border border-red-200">
              <div class="text-3xl font-bold text-red-600">{{ reportData.errors.total }}</div>
              <div class="text-sm text-red-700 mt-1">总错误数</div>
            </div>
            <div class="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <div class="text-3xl font-bold text-indigo-600">{{ reportData.errors.step2.total }}</div>
              <div class="text-sm text-indigo-700 mt-1">步骤 2 错误</div>
            </div>
            <div class="p-4 bg-pink-50 rounded-lg border border-pink-200">
              <div class="text-3xl font-bold text-pink-600">{{ reportData.errors.step3.total }}</div>
              <div class="text-sm text-pink-700 mt-1">步骤 3 错误</div>
            </div>
            <div class="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div class="text-3xl font-bold text-orange-600">{{ reportData.errors.step4.total }}</div>
              <div class="text-sm text-orange-700 mt-1">步骤 4 错误</div>
            </div>
          </div>
        </div>

        <!-- 详细错误列表 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ReportErrorList
            v-if="errorSummary"
            title="步骤 2 错误详情"
            :error-sections="{
              'First 集合': errorSummary.step2.firstSets,
              'Follow 集合': errorSummary.step2.followSets
            }"
            :total-count="reportData.errors.step2.total"
            :section-labels="{
              'First 集合': 'First Set',
              'Follow 集合': 'Follow Set'
            }"
          />

          <ReportErrorList
             v-if="errorSummary"
             title="步骤 3 错误详情"
             :error-sections="{
               '分析表': errorSummary.step3.parsingTable
             }"
             :total-count="reportData.errors.step3.total"
             :section-labels="{
               '分析表': 'Parsing Table'
             }"
          />

          <ReportErrorList
             v-if="errorSummary"
             title="步骤 4 错误详情"
             :error-sections="{
               '分析步骤': errorSummary.step4.analysisSteps
             }"
             :total-count="reportData.errors.step4.total"
             :section-labels="{
               '分析步骤': 'Analysis Steps'
             }"
          />
        </div>
      </div>
    </div>

    <!-- 学生信息填写弹窗 -->
    <StudentInfoModal
      :visible="studentInfoModalVisible"
      @close="studentInfoModalVisible = false"
      @confirm="handleStudentInfoConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useLL1Store } from '@/stores'
import { generateLL1Report, getLL1ErrorSummary, type LL1ReportStats } from './utils/ll1-report'
import { exportHTML } from './utils/html-export'
import ReportProgressCard from './components/ReportProgressCard.vue'
import ReportErrorList from './components/ReportErrorList.vue'
import StudentInfoModal from './components/StudentInfoModal.vue'

const route = useRoute()
const router = useRouter()
const ll1Store = useLL1Store()

const loading = ref(true)
const reportData = ref<LL1ReportStats | null>(null)
const currentRecord = ref<any>(null)
const studentInfoModalVisible = ref(false)
const currentAction = ref<'html' | null>(null)

const errorSummary = computed(() => {
  if (!reportData.value) return null
  
  const recordId = route.params.id as string
  const record = ll1Store.historyList.find(r => r.id === recordId)
  
  if (!record) return null
  
  return getLL1ErrorSummary(record.errorLogs)
})

function getOverallProgressBarClass(progress: number) {
  if (progress === 100) return 'bg-green-500'
  if (progress >= 80) return 'bg-blue-500'
  if (progress >= 50) return 'bg-yellow-500'
  return 'bg-orange-500'
}

function formatDate(timestamp: string) {
  if (!timestamp) return '-'
  try {
    let date = new Date(timestamp)
    
    // Handle timestamp format inconsistencies if any
    if (isNaN(date.getTime())) {
        // Simple fallback parsing for common locale strings
        return timestamp
    }
    
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  } catch (e) {
    return timestamp
  }
}

function showStudentInfoModal(action: 'html') {
  currentAction.value = action
  studentInfoModalVisible.value = true
}

async function handleStudentInfoConfirm(studentInfo: {
  name: string
  studentId: string
  className: string
}) {
  studentInfoModalVisible.value = false
  
  try {
    await exportHTML({
      containerId: 'report-content',
      studentInfo,
      reportTitle: 'LL1 答题报告',
      modelName: 'LL1',
      recordId: route.params.id as string
    })
  } catch (error) {
    console.error('操作失败:', error)
    alert('操作失败，请稍后重试')
  } finally {
    currentAction.value = null
  }
}

onMounted(async () => {
  const recordId = route.params.id as string
  
  if (!recordId) {
    router.push('/record/ll1')
    return
  }

  const record = ll1Store.historyList.find(r => r.id === recordId)
  
  if (!record) {
    loading.value = false
    return
  }

  currentRecord.value = record

  try {
    // 复现历史记录数据，触发后端计算以获得验证数据
    ll1Store.setProductions(record.productions)
    
    // 执行分析（复现模式），这会 populate originalData
    const isGrammarValid = await ll1Store.performLL1Analysis(true)
    
    if (isGrammarValid && record.userData.inputString) {
      ll1Store.setInputString(record.userData.inputString)
      await ll1Store.analyzeInputString()
    }
    
    // 生成报告
    reportData.value = generateLL1Report(record, {
      originalData: ll1Store.originalData,
      inputAnalysisResult: ll1Store.inputAnalysisResult
    })
  } catch (error) {
    console.error('获取后端验证数据失败:', error)
    // Fallback: 仅使用记录数据，无验证数据（进度可能不准）
    reportData.value = generateLL1Report(record)
  } finally {
    loading.value = false
  }
})
</script>
