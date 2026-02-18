<template>
  <div class="fa-report-page min-h-screen bg-gray-50">
    <ReportHeader
      title="FA 答题报告"
      subtitle="查看详细的答题进度和错误分析"
      back-link="/record/fa"
      @export-html="showStudentInfoModal('html')"
      @export-pdf="showStudentInfoModal('pdf')"
    />

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
          to="/record/fa"
          class="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          返回记录列表
        </router-link>
      </div>
    </div>

    <div v-else id="report-content" class="max-w-7xl mx-auto px-4 py-8">
      <div class="space-y-6">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <h2 class="text-sm font-semibold text-gray-500 mb-2">正则表达式</h2>
              <div class="p-3 bg-gray-50 rounded-lg font-mono text-sm text-gray-900 break-all">
                {{ reportData.regex }}
              </div>
            </div>
            <div>
              <h2 class="text-sm font-semibold text-gray-500 mb-2">记录 ID</h2>
              <div class="p-3 bg-blue-50 rounded-lg font-mono text-xs text-blue-800 break-all">
                {{ reportData.recordId }}
              </div>
            </div>
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

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ReportProgressCard
            title="步骤 3：子集构造法"
            icon="lucide:table-2"
            iconColor="text-green-600"
            :items="{
              conversionTable: {
                label: '转换表',
                progress: reportData.step3.conversionTable.progress,
                completed: reportData.step3.conversionTable.completed
              },
              transitionMatrix: {
                label: '状态转换矩阵',
                progress: reportData.step3.transitionMatrix.progress,
                completed: reportData.step3.transitionMatrix.completed
              }
            }"
            :stats="reportData.step3"
          />

          <ReportProgressCard
            title="步骤 5：DFA 最小化"
            icon="lucide:minimize-2"
            iconColor="text-red-600"
            :items="{
              pSets: {
                label: '化简 DFA 状态子集',
                progress: reportData.step5.pSets.progress,
                completed: reportData.step5.pSets.completed
              },
              minimizedMatrix: {
                label: '最小化状态转换矩阵',
                progress: reportData.step5.minimizedMatrix.progress,
                completed: reportData.step5.minimizedMatrix.completed
              }
            }"
            :stats="reportData.step5"
          />
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Icon icon="lucide:image" class="w-5 h-5 text-purple-600" />
            画图完成情况
          </h3>
          <div class="grid grid-cols-3 gap-4">
            <div
              class="p-4 rounded-lg border-2 text-center"
              :class="reportData.canvas.step2 ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50'"
            >
              <Icon 
                :icon="reportData.canvas.step2 ? 'lucide:check-circle' : 'lucide:circle'" 
                class="w-8 h-8 mx-auto mb-2"
                :class="reportData.canvas.step2 ? 'text-green-600' : 'text-gray-300'"
              />
              <div class="text-sm font-medium text-gray-700">步骤 2：NFA 图</div>
              <div class="text-xs mt-1" :class="reportData.canvas.step2 ? 'text-green-600' : 'text-gray-400'">
                {{ reportData.canvas.step2 ? '已绘制' : '未绘制' }}
              </div>
            </div>
            <div
              class="p-4 rounded-lg border-2 text-center"
              :class="reportData.canvas.step4 ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50'"
            >
              <Icon 
                :icon="reportData.canvas.step4 ? 'lucide:check-circle' : 'lucide:circle'" 
                class="w-8 h-8 mx-auto mb-2"
                :class="reportData.canvas.step4 ? 'text-green-600' : 'text-gray-300'"
              />
              <div class="text-sm font-medium text-gray-700">步骤 4：DFA 图</div>
              <div class="text-xs mt-1" :class="reportData.canvas.step4 ? 'text-green-600' : 'text-gray-400'">
                {{ reportData.canvas.step4 ? '已绘制' : '未绘制' }}
              </div>
            </div>
            <div
              class="p-4 rounded-lg border-2 text-center"
              :class="reportData.canvas.step6 ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50'"
            >
              <Icon 
                :icon="reportData.canvas.step6 ? 'lucide:check-circle' : 'lucide:circle'" 
                class="w-8 h-8 mx-auto mb-2"
                :class="reportData.canvas.step6 ? 'text-green-600' : 'text-gray-300'"
              />
              <div class="text-sm font-medium text-gray-700">步骤 6：最小化 DFA 图</div>
              <div class="text-xs mt-1" :class="reportData.canvas.step6 ? 'text-green-600' : 'text-gray-400'">
                {{ reportData.canvas.step6 ? '已绘制' : '未绘制' }}
              </div>
            </div>
          </div>
        </div>

        <!-- 步骤 2：NFA 构造 -->
        <div v-if="currentRecord && currentRecord.userData && currentRecord.userData.canvasData" class="space-y-6">
          <FACanvasReport
            :step="2"
            :user-data="currentRecord.userData.canvasData.step2"
            :answer-data="faStore.nfaDotString"
          />
        </div>

        <!-- 步骤 3：子集构造法 - 答题表格详情 -->
        <div v-if="currentRecord && currentRecord.userData && currentRecord.userData.step3Data && faStore.originalData" class="space-y-6">
          <FAStep3DetailedReport
            :standard-data="{
              table: faStore.originalData.table,
              table_to_num: faStore.originalData.table_to_num
            }"
            :user-data="currentRecord.userData.step3Data"
            :error-logs="currentRecord.errorLogs || []"
          />
        </div>

        <!-- 步骤 4：子集构造法转化 DFA -->
        <div v-if="currentRecord && currentRecord.userData && currentRecord.userData.canvasData" class="space-y-6">
          <FACanvasReport
            :step="4"
            :user-data="currentRecord.userData.canvasData.step4"
            :answer-data="faStore.dfaDotString"
          />
        </div>

        <!-- 步骤 5：DFA 最小化 - 答题表格详情 -->
        <div v-if="currentRecord && currentRecord.userData && currentRecord.userData.step5Data && faStore.originalData" class="space-y-6">
          <FAStep5DetailedReport
            :standard-data="{
              P: faStore.originalData.P,
              table_to_num_min: faStore.originalData.table_to_num_min
            }"
            :user-data="currentRecord.userData.step5Data"
            :error-logs="currentRecord.errorLogs || []"
          />
        </div>

        <!-- 步骤 6：DFA 最小化 -->
        <div v-if="currentRecord && currentRecord.userData && currentRecord.userData.canvasData" class="space-y-6">
          <FACanvasReport
            :step="6"
            :user-data="currentRecord.userData.canvasData.step6"
            :answer-data="faStore.minDfaDotString"
          />
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Icon icon="lucide:alert-circle" class="w-5 h-5 text-red-600" />
            错误统计
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="p-4 bg-red-50 rounded-lg border border-red-200">
              <div class="text-3xl font-bold text-red-600">{{ reportData.errors.total }}</div>
              <div class="text-sm text-red-700 mt-1">总错误数</div>
            </div>
            <div class="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div class="text-3xl font-bold text-orange-600">{{ reportData.errors.step3.total }}</div>
              <div class="text-sm text-orange-700 mt-1">步骤 3 错误</div>
            </div>
            <div class="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div class="text-3xl font-bold text-yellow-600">{{ reportData.errors.step5.total }}</div>
              <div class="text-sm text-yellow-700 mt-1">步骤 5 错误</div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ReportErrorList
            v-if="errorSummary"
            title="步骤 3 错误详情"
            :error-sections="{
              '转换表': errorSummary.step3.conversionTable,
              '状态转换矩阵': errorSummary.step3.transitionMatrix
            }"
            :total-count="reportData.errors.step3.total"
            :section-labels="{
              '转换表': '转换表',
              '状态转换矩阵': '状态转换矩阵'
            }"
          />

          <ReportErrorList
            v-if="errorSummary"
            title="步骤 5 错误详情"
            :error-sections="{
              '化简 DFA 状态子集': errorSummary.step5.pSets,
              '最小化状态转换矩阵': errorSummary.step5.minimizedMatrix
            }"
            :total-count="reportData.errors.step5.total"
            :section-labels="{
              '化简 DFA 状态子集': '化简 DFA 状态子集',
              '最小化状态转换矩阵': '最小化状态转换矩阵'
            }"
          />
        </div>

        <!-- AI 智能学习报告 -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <AIReportSection
            :context="aiReportContext"
            :initial-content="cachedAIReport?.content"
            :is-cached="!!cachedAIReport"
            :generated-at="cachedAIReport?.generatedAt"
            :generate-fn="generateAIReportFn"
            @generate="handleAIReportGenerated"
            @regenerate="handleAIReportRegenerated"
          />
        </div>
      </div>
    </div>

    <!-- 学生信息填写弹窗 -->
    <StudentInfoModal
      :visible="studentInfoModalVisible"
      :export-type="currentAction || 'html'"
      @close="studentInfoModalVisible = false"
      @confirm="handleStudentInfoConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useFAStoreNew } from '@/stores'
import { generateFAReport, getErrorSummary, type FAReportStats } from './utils/fa-report'
import { exportHTML } from './utils/html-export'
import { exportPDF } from './utils/pdf-export'
import { getOverallProgressBarClass } from './utils/report-helpers'
import ReportHeader from './components/ReportHeader.vue'
import ReportProgressCard from './components/ReportProgressCard.vue'
import ReportErrorList from './components/ReportErrorList.vue'
import StudentInfoModal from './components/StudentInfoModal.vue'
import FACanvasReport from './components/fa/FACanvasReport.vue'
import FAStep3DetailedReport from './components/fa/FAStep3DetailedReport.vue'
import FAStep5DetailedReport from './components/fa/FAStep5DetailedReport.vue'
import AIReportSection from './components/AIReportSection.vue'
import { formatDate } from '@/utils/date'

// AI报告相关导入
import {
  generateAIReport,
  regenerateAIReport,
  loadAIReport,
  type AIReportContext,
  type AIReportData,
  type AIReportGenerateResult,
} from './utils/ai-report'
import { buildFAReportContext } from './utils/fa-ai-report'

const route = useRoute()
const router = useRouter()
const faStore = useFAStoreNew()

const loading = ref(true)
const reportData = ref<FAReportStats | null>(null)
const currentRecord = ref<any>(null)
const studentInfoModalVisible = ref(false)
const currentAction = ref<'html' | 'pdf' | null>(null)

// AI报告相关状态
const aiReportContext = ref<AIReportContext | null>(null)
const cachedAIReport = ref<AIReportData | null>(null)

const errorSummary = computed(() => {
  if (!reportData.value) return null
  
  const recordId = route.params.id as string
  const record = faStore.historyList.find(r => r.id === recordId)
  
  if (!record) return null
  
  return getErrorSummary(record.errorLogs)
})

function showStudentInfoModal(action: 'html' | 'pdf') {
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
    if (currentAction.value === 'html') {
      await exportHTML({
        containerId: 'report-content',
        studentInfo,
        reportTitle: 'FA 答题报告',
        modelName: 'FA',
        recordId: route.params.id as string
      })
    } else if (currentAction.value === 'pdf') {
      await exportPDF({
        containerId: 'report-content',
        studentInfo,
        reportTitle: 'FA 答题报告',
        modelName: 'FA',
        recordId: route.params.id as string
      })
    }
  } catch (error) {
    console.error('操作失败:', error)
    alert('操作失败，请稍后重试')
  } finally {
    currentAction.value = null
  }
}

// AI报告生成函数
async function generateAIReportFn(context: AIReportContext, forceRegenerate = false): Promise<AIReportGenerateResult> {
  if (forceRegenerate) {
    return regenerateAIReport(context)
  }
  return generateAIReport(context)
}

// AI报告生成完成回调
function handleAIReportGenerated(result: AIReportGenerateResult) {
  if (result.success) {
    console.log('[FA Report] AI报告生成成功')
  } else {
    console.error('[FA Report] AI报告生成失败:', result.error)
  }
}

// AI报告重新生成完成回调
function handleAIReportRegenerated(result: AIReportGenerateResult) {
  if (result.success) {
    console.log('[FA Report] AI报告重新生成成功')
    // 更新缓存引用
    const recordId = route.params.id as string
    cachedAIReport.value = loadAIReport(recordId, 'fa')
  } else {
    console.error('[FA Report] AI报告重新生成失败:', result.error)
  }
}

onMounted(async () => {
  const recordId = route.params.id as string
  
  if (!recordId) {
    router.push('/record/fa')
    return
  }

  const record = faStore.historyList.find(r => r.id === recordId)
  
  if (!record) {
    loading.value = false
    return
  }

  currentRecord.value = record

  // 尝试加载缓存的AI报告
  cachedAIReport.value = loadAIReport(recordId, 'fa')

  // 重新获取后端数据以生成验证数据
  try {
    // 设置正则表达式
    faStore.setInputRegex(record.regex)
    // 执行分析（复现模式）
    await faStore.performFAAnalysis(true)
    
    // 使用后端数据生成报告
    reportData.value = generateFAReport(record, faStore.validationData || undefined, faStore.originalData)
    
    // 构建AI报告上下文
    aiReportContext.value = buildFAReportContext(
      record,
      faStore.validationData || undefined,
      faStore.originalData
    )
  } catch (error) {
    console.error('获取后端数据失败:', error)
    // 失败时使用默认方式生成报告
    reportData.value = generateFAReport(record, undefined, faStore.originalData)

    // 仍然尝试构建AI报告上下文
    aiReportContext.value = buildFAReportContext(record)
  } finally {
    loading.value = false
  }
})
</script>

<style>
/* 打印时保留背景颜色 - 使用全局样式 */
@import './styles/print-colors.css';
</style>
