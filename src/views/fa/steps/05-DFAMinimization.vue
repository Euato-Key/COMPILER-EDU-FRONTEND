<template>
  <div class="dfa-minimization-step">
    <div class="step-header">
      <div class="flex items-center gap-4">
        <div class="step-icon">
          <Icon icon="lucide:minimize-2" class="w-6 h-6 text-red-600" />
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-900">DFA 最小化</h2>
          <p class="text-gray-600 mt-1">第五步：最小化 DFA</p>
        </div>
      </div>
    </div>

    <div class="step-content">
      <!-- DFA 参考图 -->
      <div class="dfa-reference mb-6">
        <div class="bg-white border border-gray-200 rounded-lg">
          <div class="border-b border-gray-200 p-4">
            <h3 class="font-semibold text-gray-900 flex items-center gap-2">
              <Icon icon="lucide:share-2" class="w-5 h-5 text-orange-600" />
              DFA 图（参考）
            </h3>
            <p class="text-sm text-gray-600 mt-1">根据此 DFA 图进行最小化操作</p>
          </div>
          <div class="p-6">
            <div v-if="dfaSvg" class="dfa-svg-container bg-gray-50 rounded-lg p-4 overflow-auto">
              <div v-html="dfaSvg" class="flex justify-center"></div>
            </div>
            <div v-else class="text-center py-8 text-gray-500">
              <Icon icon="lucide:image-off" class="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>暂无 DFA 图数据</p>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-8 mt-6">
        <!-- A区域：化简DFA状态子集 -->
        <div class="minimization-sets-section">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- 左侧：用户填写 -->
            <div class="user-sets-section">
              <div class="bg-white border border-gray-200 rounded-lg">
                <div class="border-b border-gray-200 p-4">
                  <h3 class="font-semibold text-gray-900">化简DFA状态子集（用户填写）</h3>
                </div>
                <div class="p-6">
                  <p v-if="originalStateCount > 0" class="text-sm text-blue-700 font-medium mb-4">
                    请将状态集
                    <span class="font-bold text-blue-800">{{
                      getOriginalStateSet()
                    }}</span>
                    最小化
                  </p>
                  <span class="text-xs text-blue-600 font-medium">(每一行输入一个化简后的状态子集)</span>

                  <!-- P集合输入 -->
                  <div class="space-y-3 mt-4">
                    <div v-for="(pItem, index) in localPSets" :key="pItem.id" class="space-y-1">
                      <div class="flex items-center gap-2">
                        <input
                          v-model="pItem.text"
                          :class="getPSetFieldClass(pItem)"
                          :disabled="step6Open"
                          @input="handlePSetInput(pItem)"
                          @blur="handlePSetBlur(pItem)"
                          placeholder="输入状态子集，如：1 2 3"
                        />
                        <button
                          v-if="!step6Open && localPSets.length > 1"
                          @click="removePSet(index)"
                          class="px-2 py-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Icon icon="lucide:x" class="w-4 h-4" />
                        </button>
                        <button
                          v-if="!step6Open"
                          @click="addPSet(index)"
                          class="px-2 py-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Icon icon="lucide:plus" class="w-4 h-4" />
                        </button>
                        <div v-if="step6Open" class="text-sm text-gray-500">=> {{ index }}</div>
                      </div>
                      <!-- 状态提示 -->
                      <div v-if="pItem.check === 'isError'" class="text-xs text-red-600 ml-2">
                        {{ pItem.errorMessage || '答案不正确' }}
                      </div>
                      <div
                        v-else-if="pItem.check === 'isCorrect'"
                        class="text-xs text-green-600 ml-2"
                      >
                        ✓ 正确
                      </div>
                    </div>
                  </div>

                  <div class="mt-6 flex gap-3">
                    <button
                      @click="validatePSets"
                      :disabled="step6Open"
                      :class="[
                        'px-4 py-2 rounded-lg transition-colors',
                        step6Open
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700',
                      ]"
                    >
                      校验
                    </button>
                    <button
                      @click="resetPSets"
                      :class="[
                        'px-4 py-2 rounded-lg transition-colors',
                        'bg-gray-600 text-white hover:bg-gray-700',
                      ]"
                    >
                      重置
                    </button>
                  </div>

                  <!-- 校验结果提示 -->
                  <div v-if="pSetValidationResult.show" class="mt-4">
                    <div
                      :class="[
                        'p-3 rounded-lg border',
                        pSetValidationResult.success
                          ? 'bg-green-50 border-green-200'
                          : 'bg-red-50 border-red-200'
                      ]"
                  >
                    <div class="flex items-start gap-2">
                      <Icon
                          :icon="pSetValidationResult.success ? 'lucide:check-circle' : 'lucide:x-circle'"
                          :class="[
                            'w-5 h-5 flex-shrink-0 mt-0.5',
                            pSetValidationResult.success ? 'text-green-600' : 'text-red-600'
                          ]"
                      />
                      <div>
                          <h4
                            :class="[
                              'font-medium mb-1',
                              pSetValidationResult.success ? 'text-green-800' : 'text-red-800'
                            ]"
                          >
                            {{ pSetValidationResult.success ? '校验成功' : '校验失败' }}
                          </h4>
                          <p
                            :class="[
                              'text-sm',
                              pSetValidationResult.success ? 'text-green-700' : 'text-red-700'
                            ]"
                          >
                            {{ pSetValidationResult.message }}
                          </p>
                      </div>
                    </div>
                  </div>
                  </div>


                </div>
              </div>
            </div>

            <!-- 右侧：答案区域 -->
            <div class="answer-sets-section">
              <div class="bg-white border border-gray-200 rounded-lg">
                <div class="border-b border-gray-200 p-4">
                  <div class="flex items-center justify-between">
                    <h3 class="font-semibold text-gray-900">标准答案</h3>
                    <button
                      @click="toggleSetsAnswer"
                      :class="[
                        'px-3 py-1 text-sm rounded-lg transition-colors',
                        showSetsAnswer
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200',
                      ]"
                    >
                      {{ showSetsAnswer ? '隐藏答案' : '查看答案' }}
                    </button>
                  </div>
                </div>
                <div class="p-6">
                  <div v-if="showSetsAnswer && faStore.originalData?.P" class="space-y-3">
                    <div
                      v-for="(pSet, index) in faStore.originalData.P"
                      :key="index"
                      class="flex items-center gap-2"
                    >
                      <div
                        class="flex-1 px-3 py-2 bg-green-50 border border-green-300 rounded text-sm"
                      >
                        {{ Array.isArray(pSet) ? pSet.join(' ') : pSet }}
                      </div>
                      <div class="text-sm text-gray-500">=> {{ index }}</div>
                    </div>
                  </div>
                  <div v-else class="text-center py-8 text-gray-500">
                    <Icon icon="lucide:eye-off" class="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>点击"查看答案"按钮显示标准答案</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- B区域：状态转换矩阵 -->
        <div class="transition-matrix-section relative">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- 左侧：用户填写 -->
            <div class="user-matrix-section">
              <div class="bg-white border border-gray-200 rounded-lg">
                <div class="border-b border-gray-200 p-4">
                  <h3 class="font-semibold text-gray-900">状态转换矩阵（用户填写）</h3>
                </div>
                <div class="p-6">
                  <div v-if="showSetsAnswer && minimizedMatrix.length">
                    <!-- 转换矩阵表格 -->
                    <div class="overflow-x-auto">
                      <table class="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr class="bg-purple-50">
                            <th class="border border-gray-300 px-3 py-2 font-semibold">S</th>
                            <th
                              v-for="symbol in alphabetSymbols"
                              :key="symbol"
                              class="border border-gray-300 px-3 py-2 font-semibold"
                            >
                              {{ symbol }}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="(_, rowIndex) in Array(originalStateCount)"
                            :key="rowIndex"
                            :class="rowIndex % 2 === 0 ? 'bg-white' : 'bg-purple-50'"
                          >
                            <td class="border border-gray-300 px-3 py-2 font-medium bg-gray-50">
                              {{
                                faStore.originalData?.table_to_num_min?.['S']?.[rowIndex] ||
                                rowIndex
                              }}
                            </td>
                            <td
                              v-for="(symbol, colIndex) in alphabetSymbols"
                              :key="symbol"
                              class="border border-gray-300 px-3 py-2 text-center"
                            >
                              <input
                                v-if="getMatrixCell(rowIndex, colIndex)?.category !== 'onlyRead'"
                                :value="getMatrixCell(rowIndex, colIndex)?.value || ''"
                                @input="(event) => updateMatrixCell(rowIndex, colIndex, event.target.value)"
                                :class="getMatrixFieldClass(getMatrixCell(rowIndex, colIndex))"
                                :disabled="step7Open"
                                @focus="handleMatrixCellFocus(getMatrixCell(rowIndex, colIndex))"
                                @blur="handleMatrixCellBlur(getMatrixCell(rowIndex, colIndex))"
                                placeholder="-"
                              />
                              <span v-else class="text-gray-600">{{
                                getMatrixCell(rowIndex, colIndex)?.value
                              }}</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div class="mt-4 flex gap-3">
                      <button
                        @click="validateMatrix"
                        :disabled="step7Open"
                        :class="[
                          'px-4 py-2 rounded-lg transition-colors',
                          step7Open
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700',
                        ]"
                      >
                        校验
                      </button>
                      <button
                        @click="resetMatrix"
                        :class="[
                          'px-4 py-2 rounded-lg transition-colors',
                          'bg-gray-600 text-white hover:bg-gray-700',
                        ]"
                      >
                        重置
                      </button>
                    </div>

                    <!-- 矩阵校验结果提示 -->
                    <div v-if="matrixValidationResult.show" class="mt-4">
                      <div
                        :class="[
                          'p-3 rounded-lg border',
                          matrixValidationResult.success
                            ? 'bg-green-50 border-green-200'
                            : 'bg-red-50 border-red-200'
                        ]"
                      >
                        <div class="flex items-start gap-2">
                          <Icon
                            :icon="matrixValidationResult.success ? 'lucide:check-circle' : 'lucide:x-circle'"
                            :class="[
                              'w-5 h-5 flex-shrink-0 mt-0.5',
                              matrixValidationResult.success ? 'text-green-600' : 'text-red-600'
                            ]"
                          />
                          <div>
                            <h4
                              :class="[
                                'font-medium mb-1',
                                matrixValidationResult.success ? 'text-green-800' : 'text-red-800'
                              ]"
                            >
                              {{ matrixValidationResult.success ? '校验成功' : '校验失败' }}
                            </h4>
                            <p
                              :class="[
                                'text-sm',
                                matrixValidationResult.success ? 'text-green-700' : 'text-red-700'
                              ]"
                            >
                              {{ matrixValidationResult.message }}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- 矩阵错误信息显示 -->
                    <div
                      v-if="showMatrixErrors && Object.keys(matrixValidationErrors).length > 0"
                      class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg"
                    >
                      <div class="flex items-start gap-2">
                        <Icon
                          icon="lucide:alert-circle"
                          class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
                        />
                        <div>
                          <h4 class="font-medium text-red-800 mb-2">状态转换矩阵填写错误</h4>
                          <ul class="text-sm text-red-700 space-y-1">
                            <li v-for="(errors, fieldKey) in matrixValidationErrors" :key="fieldKey">
                              <strong>{{ formatFieldKey(fieldKey, 'matrix') }}：</strong>
                              <span v-for="(error, index) in errors" :key="index">
                                {{ error }}{{ index < errors.length - 1 ? '，' : '' }}
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div v-else class="text-center text-gray-500 py-8">
                    <p>请先完成上方化简DFA状态子集的填写</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- 右侧：答案区域 -->
            <div class="answer-matrix-section">
              <div class="bg-white border border-gray-200 rounded-lg">
                <div class="border-b border-gray-200 p-4">
                  <div class="flex items-center justify-between">
                    <h3 class="font-semibold text-gray-900">标准答案</h3>
                    <button
                      @click="toggleMatrixAnswerStep5"
                      :class="[
                        'px-3 py-1 text-sm rounded-lg transition-colors',
                        showMatrixAnswerStep5
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200',
                      ]"
                    >
                      {{ showMatrixAnswerStep5 ? '隐藏答案' : '查看答案' }}
                    </button>
                  </div>
                </div>
                <div class="p-6">
                  <div
                    v-if="
                      showMatrixAnswerStep5 &&
                      faStore.originalData?.table_to_num_min &&
                      alphabetSymbols.length
                    "
                  >
                    <!-- 答案矩阵表格 -->
                    <TransitionTable
                      :data="{
                        headers: matrixStateColumns,
                        rows: matrixData
                      }"
                      :columns="matrixStateColumns.map(state => ({
                        key: state,
                        title: state,
                        type: state === 'S' ? 'state' as const : 'transition' as const,
                        editable: false
                      }))"
                      :editable="false"
                      :show-answer="true"
                      :final-state-config="{
                        isFinalState: (row, col, value) => minimizedAcceptingStates.has(String(value))
                      }"
                    />
                  </div>
                  <div v-else class="text-center py-8 text-gray-500">
                    <Icon icon="lucide:eye-off" class="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>点击"查看答案"按钮显示标准答案</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 毛玻璃锁定层 -->
          <div
            v-if="isMatrixLocked"
            class="absolute inset-0 z-50 backdrop-blur-xl backdrop-saturate-150 bg-gradient-to-br from-white/85 via-white/75 to-white/70 rounded-lg border border-white/50 flex items-center justify-center animate-in fade-in duration-300"
          >
            <div class="flex flex-col items-center justify-center h-full w-full px-8 py-12">
              <div class="flex items-center justify-center mb-8 animate-pulse">
                <Icon icon="lucide:lock" class="w-16 h-16 text-blue-100 drop-shadow-lg" />
              </div>
              <div class="text-center space-y-4 max-w-md">
                <h3 class="text-xl font-bold text-gray-900 drop-shadow-md">
                  需要先查看状态子集答案
                </h3>
                <p class="text-base text-gray-800 leading-relaxed drop-shadow-sm">
                  请先查看上方化简DFA状态子集的标准答案后再填写状态转换矩阵
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 最小化完成信息 -->
        <div v-if="isComplete" class="bg-green-50 border border-green-200 rounded-lg p-4">
          <div class="flex items-start gap-3">
            <Icon icon="lucide:check-circle" class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 class="font-medium text-green-800">DFA 最小化答案已显示</h4>
              <div class="text-sm text-green-700 mt-2 space-y-1">
                <p>• 最小化状态数: {{ originalStateCount }}</p>
                <p>• 状态分区数: {{ localPSets.length }}</p>
                <p>• 状态转换矩阵答案已显示</p>
                <p class="text-blue-600 font-medium">• 可以进入下一步查看最小化DFA图</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="step-actions">
      <div class="flex justify-between items-center">
        <button
          @click="emit('prev-step')"
          class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Icon icon="lucide:chevron-left" class="w-4 h-4 inline mr-2" />
          上一步
        </button>
        <div class="text-sm text-gray-500">步骤 5 / 6</div>
        <button
          @click="proceedToNext"
          :disabled="!isComplete"
          :class="[
            'px-6 py-2 rounded-lg transition-colors',
            isComplete
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed',
          ]"
        >
          下一步
          <Icon icon="lucide:chevron-right" class="w-4 h-4 inline ml-2" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { useFAStore } from '@/stores'
import { instance } from '@viz-js/viz'
import { TransitionTable } from '@/components/fa'

const emit = defineEmits<{
  'next-step': []
  'prev-step': []
  complete: [data: any]
}>()

// 检验状态枚举
enum ValidationState {
  EMPTY = 'empty', // 未键入内容
  NORMAL = 'normal', // 正常状态（有内容但未检验）
  CORRECT = 'isCorrect', // 答案正确
  ERROR = 'isError', // 答案错误
}



// 数据类型定义
interface PSetItem {
  id: string
  category: string
  state: string
  check: string
  text: string
  errorMessage?: string
}

interface MatrixCell {
  id: string
  category: string
  check: string
  value: string
  rowIndex: number
  colIndex: number
  isRowHeader?: boolean
}

// 使用 FA Store
const faStore = useFAStore()

// 本地状态
const alphabetSymbols = ref<string[]>([])
const originalStateCount = ref(0) // 最小化后的状态数量
const dfaSvg = ref('')

// 状态管理
const step6Open = ref(false) // P集合校验完成
const step7Open = ref(false) // 矩阵校验完成

// 答案显示状态
const showSetsAnswer = ref(false) // A区域答案显示
const showMatrixAnswerStep5 = ref(false) // B区域答案显示

// P集合相关
const localPSets = ref<PSetItem[]>([
  {
    id: 'localp_list0',
    category: 'blank',
    state: 'normal',
    check: ValidationState.EMPTY,
    text: '',
  },
])
let localPSetsCnt = 1

// 矩阵相关
const minimizedMatrix = ref<MatrixCell[]>([])
const tableView = {
  cellWidth: 80,
  cellHeight: 40,
  gap: 10,
}

// 矩阵状态列和数据
const matrixStateColumns = ref<string[]>([])
const matrixData = ref<string[][]>([])

// 最小化DFA的接受状态集合
const minimizedAcceptingStates = ref<Set<string>>(new Set())

// 验证状态管理
const matrixValidationErrors = ref<Record<string, string[]>>({}) // 矩阵错误信息
const matrixFieldValidation = ref<Record<string, 'valid' | 'invalid' | 'normal'>>({}) // 矩阵字段验证状态
const showMatrixErrors = ref(false) // 是否显示矩阵错误

// P集合校验结果状态
const pSetValidationResult = ref<{
  show: boolean
  success: boolean
  message: string
}>({
  show: false,
  success: false,
  message: ''
})

// 矩阵校验结果状态
const matrixValidationResult = ref<{
  show: boolean
  success: boolean
  message: string
}>({
  show: false,
  success: false,
  message: ''
})

// 计算属性
const isComplete = computed(() => {
  // 修改为：只要显示了答案就可以进入下一步，不需要完成校验
  return showSetsAnswer.value && showMatrixAnswerStep5.value
})

const reductionPercentage = computed(() => {
  if (originalStateCount.value === 0) return 0
  return (
    ((originalStateCount.value - localPSets.value.length) / originalStateCount.value) *
    100
  ).toFixed(1)
})

// 锁定逻辑：只有查看了A区域答案才能操作B区域
const isMatrixLocked = computed(() => {
  return false // 移除锁定逻辑，用户查看答案后即可填写矩阵
})

// 答案显示控制函数
const toggleSetsAnswer = () => {
  showSetsAnswer.value = !showSetsAnswer.value

  // 如果显示答案，自动初始化矩阵
  if (showSetsAnswer.value && minimizedMatrix.value.length === 0) {
    console.log('自动初始化矩阵')
    initMinimizedMatrix()
  }
}

const toggleMatrixAnswerStep5 = () => {
  showMatrixAnswerStep5.value = !showMatrixAnswerStep5.value
}

// 获取原始状态集
const getOriginalStateSet = () => {
  // 尝试从原始DFA数据中获取状态集
  if (faStore.originalData?.table_to_num?.['S']) {
    const originalStates = faStore.originalData.table_to_num['S']
    if (Array.isArray(originalStates)) {
      return originalStates.join(', ')
    }
  }

  // 如果无法从原始数据获取，尝试从最小化数据推断原始状态数量
  if (faStore.originalData?.table_to_num_min?.['S']) {
    const minimizedStates = faStore.originalData.table_to_num_min['S']
    if (Array.isArray(minimizedStates)) {
      // 从最小化状态推断原始状态数量
      const maxState = Math.max(...minimizedStates.map(s => parseInt(s) || 0))
      const originalStates = Array.from({ length: maxState + 1 }, (_, i) => i)
      return originalStates.join(', ')
    }
  }

  // 最后的备选方案
  return Array.from({ length: originalStateCount.value }, (_, i) => i).join(', ')
}

// DFA SVG渲染函数
const renderDFASvg = async () => {
  if (faStore.originalData?.DFA_dot_str) {
    try {
      const viz = await instance()
      const svg = viz.renderSVGElement(faStore.originalData.DFA_dot_str)
      dfaSvg.value = svg.outerHTML
    } catch (error) {
      console.error('渲染 DFA SVG 失败：', error)
      dfaSvg.value = ''
    }
  }
}

onMounted(() => {
  // 确保校验结果提示隐藏
  pSetValidationResult.value = {
    show: false,
    success: false,
    message: ''
  }

  matrixValidationResult.value = {
    show: false,
    success: false,
    message: ''
  }

  if (!faStore.hasResult()) {
    console.warn('No FA data found, please complete step 1 first')
    return
  }

  try {
    // 直接使用 store 中的数据
    const faResult = faStore.originalData
    if (faResult) {
      console.log('Step 5 loaded data from store')
      console.log('Step 5 - P data structure:', faResult.P)
      console.log('Step 5 - P data type check:', faResult.P?.map((p: any) => ({ value: p, type: typeof p, isArray: Array.isArray(p) })))
      console.log('Step 5 - table_to_num_min:', faResult.table_to_num_min)

      // 详细打印最小化转换表数据
      if (faResult.table_to_num_min) {
        console.log('=== 最小化转换表详细数据 ===')
        Object.entries(faResult.table_to_num_min).forEach(([symbol, transitions]) => {
          console.log(`Symbol ${symbol}:`, transitions)
        })
      }

      // 渲染DFA SVG
      renderDFASvg()

      // 统一使用最小化DFA数据
      if (faResult.table_to_num_min) {
        // 获取最小化后的状态数量
        const sColumn = faResult.table_to_num_min['S']
        if (Array.isArray(sColumn)) {
          originalStateCount.value = sColumn.length
          console.log('Step 5 - State count from table_to_num_min:', originalStateCount.value)
        }

        // 从最小化数据中提取字母表符号
        const symbols = new Set<string>()
        Object.keys(faResult.table_to_num_min).forEach((symbol) => {
          if (symbol !== 'S') {
            symbols.add(symbol)
          }
        })
        alphabetSymbols.value = Array.from(symbols).sort()
        console.log('Step 5 - Alphabet symbols:', alphabetSymbols.value)
      }

      // 构建最小化DFA的接受状态集合
      buildMinimizedAcceptingStatesSet(faResult)

      // 构建最小化状态转换矩阵数据
      buildMinimizedTransitionMatrix()

      // 尝试恢复05页面的用户数据
      const savedStep5Data = faStore.loadStep5Data()
      if (savedStep5Data) {
        console.log('恢复05页面数据:', savedStep5Data)
        localPSets.value = savedStep5Data.userPSets || []

        // 确保矩阵数据有正确的结构
        if (savedStep5Data.userMinimizedMatrix && savedStep5Data.userMinimizedMatrix.length > 0) {
        minimizedMatrix.value = savedStep5Data.userMinimizedMatrix
        } else {
          // 如果没有保存的矩阵数据，初始化矩阵
          initMinimizedMatrix()
        }
      } else {
        // 如果没有保存的数据，初始化矩阵
        initMinimizedMatrix()
      }
    }
  } catch (error) {
    console.error('处理FA数据失败：', error)
  }
})

// 监听数据变化，自动保存
watch(
  [localPSets, minimizedMatrix],
  () => {
    // 延迟保存，避免频繁保存
    setTimeout(() => {
      saveStep5Data()
    }, 1000)
  },
  { deep: true }
)



// P集合相关方法
const resetPSets = () => {
  // 重置所有输入
  localPSets.value.forEach(item => {
    item.text = ''
    item.check = ValidationState.EMPTY
    item.errorMessage = undefined
  })

  // 隐藏校验结果
  pSetValidationResult.value = {
    show: false,
    success: false,
    message: ''
  }

  // 重置步骤状态
  step6Open.value = false
}

// 实时检验处理函数
const handlePSetInput = (pItem: PSetItem) => {
  if (step6Open.value) return

  const inputText = pItem.text.trim()

  // 清除之前的错误状态
  if (pItem.check === ValidationState.ERROR) {
    pItem.check = inputText ? ValidationState.NORMAL : ValidationState.EMPTY
    pItem.errorMessage = undefined
  }

  // 隐藏校验结果提示
  if (pSetValidationResult.value.show) {
    pSetValidationResult.value.show = false
  }
}

const handlePSetBlur = (pItem: PSetItem) => {
  if (step6Open.value) return

  const inputText = pItem.text.trim()

  // 如果输入为空，不进行检验
  if (!inputText) {
    pItem.check = ValidationState.EMPTY
    pItem.errorMessage = undefined
    return
  }

  // 先检查是否有重复（使用和整体检验相同的逻辑）
  if (hasDuplicateStateSets()) {
    pItem.check = ValidationState.ERROR
    pItem.errorMessage = '存在重复的状态子集'
    return
  }

  // 再检查是否匹配标准答案
  if (faStore.originalData?.P) {
    const answerList = faStore.originalData.P.map((pSet: any) => {
      if (Array.isArray(pSet)) {
        return pSet.join(' ')
      } else if (typeof pSet === 'string') {
        return pSet
      }
      return String(pSet)
    })

    const matchedAnswer = answerList.find(answer => areStateSetsEqual(answer, inputText))

    if (matchedAnswer) {
      pItem.check = ValidationState.CORRECT
      pItem.errorMessage = undefined
    } else {
      pItem.check = ValidationState.ERROR
      pItem.errorMessage = '答案不正确'
    }
  }
}



const removePSet = (index: number) => {
  if (step6Open.value || localPSets.value.length <= 1) return
  localPSets.value.splice(index, 1)
}

const addPSet = (index: number) => {
  if (step6Open.value) return
  localPSets.value.splice(index + 1, 0, {
    id: 'localp_list' + ++localPSetsCnt,
    category: 'blank',
    state: 'normal',
    check: ValidationState.EMPTY,
    text: '',
  })
}

// 状态集合比较函数
const areStateSetsEqual = (str1: string, str2: string): boolean => {
  // 将字符串转换为状态集合
  const states1 = new Set(str1.split(/\s+/).filter(s => s.trim()))
  const states2 = new Set(str2.split(/\s+/).filter(s => s.trim()))

  // 检查两个集合是否完全相同
  if (states1.size !== states2.size) return false

  for (const state of states1) {
    if (!states2.has(state)) return false
  }

  return true
}

// 检查是否有重复的状态子集
const hasDuplicateStateSets = (): boolean => {
  const allInputs = localPSets.value.map(item => item.text.trim())

  console.log('hasDuplicateStateSets - allInputs:', allInputs)

  for (let i = 0; i < allInputs.length; i++) {
    for (let j = i + 1; j < allInputs.length; j++) {
      if (areStateSetsEqual(allInputs[i], allInputs[j])) {
        console.log(`hasDuplicateStateSets - found duplicate: "${allInputs[i]}" and "${allInputs[j]}"`)
        return true
      }
    }
  }

  return false
}

// P集合匹配验证
const validatePSetsAgainstAnswers = (answerList: string[], inputList: PSetItem[]): boolean => {
  console.log('validatePSetsAgainstAnswers - answerList:', answerList)
  console.log('validatePSetsAgainstAnswers - inputList:', inputList.map(item => ({ id: item.id, text: item.text })))

  // 重置所有状态
  inputList.forEach(item => {
    item.check = ValidationState.NORMAL
    item.errorMessage = undefined
  })

  // 检查是否有重复的状态子集（包括空集）
  if (hasDuplicateStateSets()) {
    inputList.forEach(item => {
      if (item.text.trim()) {
        item.check = ValidationState.ERROR
        item.errorMessage = '存在重复的状态子集'
      }
    })
    return false
  }

  // 检查每个输入是否匹配答案（包括空行）
  const usedAnswers = new Set<string>()
  let allCorrect = true

  for (const item of inputList) {
    const itemText = item.text.trim()
    const matchedAnswer = answerList.find(answer => areStateSetsEqual(answer, itemText))

    if (matchedAnswer && !usedAnswers.has(matchedAnswer)) {
      item.check = ValidationState.CORRECT
      usedAnswers.add(matchedAnswer)
    } else {
      item.check = ValidationState.ERROR
      item.errorMessage = '答案不正确'
      allCorrect = false
    }
  }

  // 检查是否所有答案都被使用
  const allAnswersUsed = answerList.every(answer => usedAnswers.has(answer))

  console.log('validatePSetsAgainstAnswers - result:', allCorrect && allAnswersUsed)
  return allCorrect && allAnswersUsed
}

// 校验P集合
const validatePSets = () => {
  if (step6Open.value || !faStore.originalData?.P) return

  // 准备答案列表
  const answerList = faStore.originalData.P.map((pSet: any) => {
    if (Array.isArray(pSet)) {
      return pSet.join(' ')
    } else if (typeof pSet === 'string') {
      return pSet
    }
    return String(pSet)
  })

  console.log('validatePSets - answerList:', answerList)
  console.log('validatePSets - localPSets:', localPSets.value.map(item => item.text))

  // 检查是否有重复的状态子集
  if (hasDuplicateStateSets()) {
    pSetValidationResult.value = {
      show: true,
      success: false,
      message: '存在重复的状态子集，请检查输入。'
    }
    console.log('P集合验证失败 - 重复状态子集')
    return
  }

  // 执行验证
  if (validatePSetsAgainstAnswers(answerList, localPSets.value)) {
    step6Open.value = true
    pSetValidationResult.value = {
      show: true,
      success: true,
      message: '恭喜！化简DFA状态子集填写正确，可以进入下一步。'
    }
    console.log('P集合验证成功')
  } else {
    // 分析失败原因
    const filledInputs = localPSets.value.filter(item => item.text.trim())
    const errorItems = localPSets.value.filter(item => item.check === ValidationState.ERROR)

    let message = ''
    if (filledInputs.length === 0) {
      message = '请至少填写一个状态子集。'
    } else if (errorItems.length > 0) {
      message = `有 ${errorItems.length} 个状态子集填写错误，请检查后重新校验。`
    } else {
      message = '状态子集填写不完整或格式错误，请检查后重新校验。'
    }

    pSetValidationResult.value = {
      show: true,
      success: false,
      message: message
    }
    console.log('P集合验证失败')
  }
}

// 初始化最小化矩阵
const initMinimizedMatrix = () => {
  if (!faStore.originalData?.table_to_num_min) {
    console.log('initMinimizedMatrix: 没有table_to_num_min数据')
    return
  }

  const tableToNumMin = faStore.originalData.table_to_num_min
  const symbols = alphabetSymbols.value // 已排除S列
  const rowCount = originalStateCount.value

  console.log('initMinimizedMatrix - rowCount:', rowCount)
  console.log('initMinimizedMatrix - symbols:', symbols)
  console.log('initMinimizedMatrix - tableToNumMin:', tableToNumMin)

  if (rowCount === 0) {
    console.log('initMinimizedMatrix: rowCount为0，无法初始化矩阵')
    return
  }

  if (symbols.length === 0) {
    console.log('initMinimizedMatrix: symbols为空，无法初始化矩阵')
    return
  }

  minimizedMatrix.value = []

  // 创建矩阵单元格（不包含S列）
  for (let row = 0; row < rowCount; row++) {
    for (let col = 0; col < symbols.length; col++) {
      const symbol = symbols[col]
      const cellId = `${row} ${symbol}`

      minimizedMatrix.value.push({
        id: cellId,
        category: 'blank', // 所有输入符号列都可以填写
        check: ValidationState.EMPTY,
        value: '',
        rowIndex: row,
        colIndex: col,
        isRowHeader: false,
      })
    }
  }

  console.log('initMinimizedMatrix - 创建的矩阵单元格数量:', minimizedMatrix.value.length)

  // 清除矩阵错误状态
  matrixValidationErrors.value = {}
  matrixFieldValidation.value = {}
  showMatrixErrors.value = false
}

// 矩阵单元格焦点处理
const handleMatrixCellFocus = (cell: MatrixCell | undefined) => {
  if (!cell) return

  if (cell.check === ValidationState.ERROR) {
    cell.check = cell.value.trim() ? ValidationState.NORMAL : ValidationState.EMPTY
  }
}

// 矩阵单元格失焦处理
const handleMatrixCellBlur = (cell: MatrixCell | undefined) => {
  if (!cell || step7Open.value) return

  // 失焦时进行验证
  validateMatrixField(cell)
}

// 更新矩阵单元格值
const updateMatrixCell = (rowIndex: number, colIndex: number, value: string) => {
  const cell = getMatrixCell(rowIndex, colIndex)
  if (!cell || step7Open.value) return

  cell.value = value
  // 留空和填写"-"都视为有效输入
  const inputValue = cell.value.trim()
  cell.check = (inputValue || inputValue === '') ? ValidationState.NORMAL : ValidationState.EMPTY

  // 隐藏校验结果提示
  if (matrixValidationResult.value.show) {
    matrixValidationResult.value.show = false
  }

  // 使用新的验证逻辑
  validateMatrixField(cell)
}

// 矩阵单元格输入处理
const handleMatrixCellInput = (cell: MatrixCell | undefined) => {
  if (!cell || step7Open.value) return

  const inputValue = cell.value.trim()
  // 留空和填写"-"都视为有效输入
  cell.check = (inputValue || inputValue === '') ? ValidationState.NORMAL : ValidationState.EMPTY

  // 使用新的验证逻辑
  validateMatrixField(cell)
}



// 获取矩阵单元格
const getMatrixCell = (row: number, col: number): MatrixCell | undefined => {
  return minimizedMatrix.value.find((cell) => cell.rowIndex === row && cell.colIndex === col)
}

// 重置矩阵
const resetMatrix = () => {
  // 重置所有矩阵单元格
  minimizedMatrix.value.forEach(cell => {
    cell.value = ''
    cell.check = ValidationState.EMPTY
  })

  // 清除错误状态
  matrixValidationErrors.value = {}
  matrixFieldValidation.value = {}
  showMatrixErrors.value = false

  // 隐藏校验结果
  matrixValidationResult.value = {
    show: false,
    success: false,
    message: ''
  }

  // 重置步骤状态
  step7Open.value = false
}

// 校验矩阵
const validateMatrix = () => {
  if (step7Open.value || !faStore.originalData?.table_to_num_min) return

  console.log('开始校验矩阵，当前矩阵数据:', minimizedMatrix.value.map(cell => ({ row: cell.rowIndex, col: cell.colIndex, value: cell.value })))

  // 检验所有矩阵单元格
  minimizedMatrix.value.forEach((cell) => {
    if (cell.category === 'onlyRead') return

    validateMatrixField(cell)
  })

  // 检查是否所有答案都正确
  const hasErrors = Object.keys(matrixValidationErrors.value).length > 0
  if (!hasErrors) {
  step7Open.value = true
    matrixValidationResult.value = {
      show: true,
      success: true,
      message: '恭喜！状态转换矩阵填写正确，DFA最小化完成。'
    }
    console.log('矩阵校验成功')
  } else {
    matrixValidationResult.value = {
      show: true,
      success: false,
      message: `状态转换矩阵填写有误，共有 ${Object.keys(matrixValidationErrors.value).length} 个错误，请检查后重新校验。`
    }
    console.log('矩阵校验失败，错误数量:', Object.keys(matrixValidationErrors.value).length)
  }
}

// 进入下一步
const proceedToNext = () => {
  if (isComplete.value) {
    // 保存当前数据
    saveStep5Data()

    const stepData = {
      localPSets: localPSets.value,
      minimizedMatrix: minimizedMatrix.value,
      step6Open: step6Open.value,
      step7Open: step7Open.value,
      timestamp: new Date().toISOString(),
    }

    // 滚动到页面顶部
    window.scrollTo({ top: 0, behavior: 'smooth' })

    // 触发下一步事件
    emit('next-step')
  }
}

// 验证功能
const validatePSetField = (pItem: PSetItem) => {
  const fieldKey = `pset-${pItem.id}`
  const errors: string[] = []

  const fieldValue = pItem.text.trim()

  console.log('Validating PSet field:', { fieldKey, fieldValue })

  // 1. 检查是否为空
  if (!fieldValue) {
    errors.push('状态子集不能为空')
  }

  // 2. 检查是否有重复输入
  const currentIndex = localPSets.value.findIndex(item => item.id === pItem.id)
  const otherInputs = localPSets.value
    .filter((item, index) => index !== currentIndex && item.text.trim())
    .map(item => item.text.trim())

  const isDuplicate = otherInputs.some(otherInput =>
    areCharacterSetsEqual(fieldValue, otherInput)
  )

  if (isDuplicate) {
    errors.push('答案重复')
  }

  // 3. 检查答案正确性
  if (fieldValue && !isDuplicate && faStore.originalData?.P) {
    const answerList = faStore.originalData.P.map((pSet: any) => {
      if (Array.isArray(pSet)) {
        return pSet.join(' ')
      } else if (typeof pSet === 'string') {
        // 如果是字符串，尝试添加空格分隔
        return pSet.split('').join(' ')
      }
      return String(pSet)
    })
    const answerItem = answerList.find((answer: string) => areCharacterSetsEqual(answer, fieldValue))

    if (!answerItem) {
      errors.push('答案不正确')
    }
  }

  if (errors.length > 0) {
    console.log('Setting errors for PSet field:', fieldKey, errors)
    pSetValidationErrors.value[fieldKey] = errors
    pSetFieldValidation.value[fieldKey] = 'invalid'
    showPSetErrors.value = true
  } else {
    console.log('Clearing errors for PSet field:', fieldKey)
    delete pSetValidationErrors.value[fieldKey]
    pSetFieldValidation.value[fieldKey] = 'valid'

    // 检查是否还有其他错误，如果没有则隐藏错误面板
    if (Object.keys(pSetValidationErrors.value).length === 0) {
      showPSetErrors.value = false
    }
  }

  console.log('PSet validation complete for field:', fieldKey, 'Errors count:', errors.length)
}

const validateMatrixField = (cell: MatrixCell | undefined) => {
  if (!cell) return

  const fieldKey = `matrix-${cell.rowIndex}-${cell.colIndex}`
  const errors: string[] = []

  const fieldValue = cell.value.trim()

  console.log('Validating matrix field:', { fieldKey, fieldValue, rowIndex: cell.rowIndex, colIndex: cell.colIndex })

  // 1. 检查是否为空（留空和填写"-"都视为有效输入，不需要检查空值）
  // 移除空值检查，因为留空和填写"-"都是有效的

  // 2. 检查答案正确性
  if (faStore.originalData?.table_to_num_min) {
    const tableToNumMin = faStore.originalData.table_to_num_min
    const symbol = alphabetSymbols.value[cell.colIndex]
    const rawAnswer = tableToNumMin[symbol]?.[cell.rowIndex]

    // 处理标准答案：null、undefined、空字符串都视为'-'
    const correctAnswer = rawAnswer === null || rawAnswer === undefined || rawAnswer === '' ? '-' : String(rawAnswer)

    // 处理用户输入：留空和填写"-"都视为'-'
    const normalizedFieldValue = fieldValue === '' ? '-' : fieldValue

    console.log('校验详情:', {
      symbol,
      rowIndex: cell.rowIndex,
      colIndex: cell.colIndex,
      fieldValue,
      normalizedFieldValue,
      rawAnswer,
      correctAnswer,
      tableToNumMin: tableToNumMin[symbol],
      alphabetSymbols: alphabetSymbols.value
    })

    if (normalizedFieldValue !== correctAnswer) {
      errors.push('转换结果与标准答案不符')
    }
  }

  if (errors.length > 0) {
    console.log('Setting errors for matrix field:', fieldKey, errors)
    matrixValidationErrors.value[fieldKey] = errors
    matrixFieldValidation.value[fieldKey] = 'invalid'
    showMatrixErrors.value = true
  } else {
    console.log('Clearing errors for matrix field:', fieldKey)
    delete matrixValidationErrors.value[fieldKey]
    matrixFieldValidation.value[fieldKey] = 'valid'

    // 检查是否还有其他错误，如果没有则隐藏错误面板
    if (Object.keys(matrixValidationErrors.value).length === 0) {
      showMatrixErrors.value = false
    }
  }

  console.log('Matrix validation complete for field:', fieldKey, 'Errors count:', errors.length)
}

// 获取P集合字段的CSS类
const getPSetFieldClass = (pItem: PSetItem) => {
  const baseClass = 'flex-1 px-3 py-2 border rounded text-sm'

  if (pItem.check === ValidationState.CORRECT) {
    return `${baseClass} border-green-500 bg-green-50`
  } else if (pItem.check === ValidationState.ERROR) {
    return `${baseClass} border-red-500 bg-red-50`
  } else {
    return `${baseClass} border-gray-300`
  }
}

// 获取矩阵字段的CSS类
const getMatrixFieldClass = (cell: MatrixCell | undefined) => {
  if (!cell) {
    return 'w-full text-center border-none bg-transparent text-sm focus:outline-none focus:ring-1 rounded focus:ring-gray-500'
  }

  const fieldKey = `matrix-${cell.rowIndex}-${cell.colIndex}`
  const validationStatus = matrixFieldValidation.value[fieldKey]

  const baseClass = 'w-full text-center border-none bg-transparent text-sm focus:outline-none focus:ring-1 rounded'

  if (validationStatus === 'valid') {
    return `${baseClass} focus:ring-green-500`
  } else if (validationStatus === 'invalid') {
    return `${baseClass} focus:ring-red-500`
  } else {
    return `${baseClass} focus:ring-blue-500`
  }
}

// 格式化错误信息的辅助函数
const formatFieldKey = (fieldKey: string, fieldType: 'matrix') => {
  const parts = fieldKey.split('-')
  if (parts.length >= 2) {
    // 矩阵：显示行列位置（不需要+1，因为rowIndex已经是正确的索引）
    const rowIndex = parseInt(parts[1])
    const colIndex = parseInt(parts[2])
    const symbol = alphabetSymbols.value[colIndex] || ''
      return `第${rowIndex}行${symbol}列`
  }
  return fieldKey
}

// 保存05页面数据
const saveStep5Data = () => {
  faStore.saveStep5Data(localPSets.value, minimizedMatrix.value)
  console.log('05页面数据已保存')
}

// 构建最小化状态转换矩阵数据
const buildMinimizedTransitionMatrix = () => {
  if (!faStore.hasResult() || !faStore.originalData?.table_to_num_min) return

  console.log('Building minimized transition matrix from backend data:', faStore.originalData.table_to_num_min)

  const tableToNumMin = faStore.originalData.table_to_num_min

  // 获取所有状态标题，按照与步骤4相同的逻辑排序
  const allStates = Object.keys(tableToNumMin)
  const sKeys = allStates.filter((x) => x === 'S')
  const nonSKeys = allStates.filter((x) => x !== 'S').sort()
  const stateKeys = [...sKeys, ...nonSKeys]

  console.log('Matrix state keys:', stateKeys)

  // 设置矩阵列标题
  matrixStateColumns.value = stateKeys

  // 获取矩阵行数（以S状态的数组长度为准）
  const matrixRowCount = tableToNumMin['S'] ? tableToNumMin['S'].length : 0
  console.log('矩阵行数（状态数量）:', matrixRowCount)

  // 构建矩阵数据
  matrixData.value = []
  for (let rowIndex = 0; rowIndex < matrixRowCount; rowIndex++) {
    const row: string[] = []

    stateKeys.forEach((state) => {
      const stateArray = tableToNumMin[state] || []
      const cellValue = stateArray[rowIndex]
      row.push(cellValue !== undefined ? String(cellValue) : '-')
    })

    matrixData.value.push(row)
    console.log(`行 ${rowIndex}:`, row)
  }

  console.log('Built minimized matrix:', matrixData.value)
  console.log('Matrix state columns:', matrixStateColumns.value)
}

// 构建最小化DFA的接受状态集合
const buildMinimizedAcceptingStatesSet = (faData: any) => {
  console.log('开始构建最小化DFA接受状态集合')
  console.log('原始FA数据:', faData)

  // 方法1: 从后端数据中查找最小化DFA的接受状态信息
  if (faData.min_accepting_states && Array.isArray(faData.min_accepting_states)) {
    const minAcceptingStates = faData.min_accepting_states.map(String)
    minimizedAcceptingStates.value = new Set(minAcceptingStates)
    console.log('从 min_accepting_states 获取最小化接受状态:', minimizedAcceptingStates.value)
    return
  }

  // 方法2: 从最小化状态转换矩阵中推断终态
  if (faData.table_to_num_min && faData.accepting_states) {
    const originalAcceptingStates = new Set(faData.accepting_states.map(String))
    const minimizedStates = new Set<string>()

    console.log('原始接受状态:', originalAcceptingStates)
    console.log('最小化转换矩阵:', faData.table_to_num_min)

    // 检查最小化矩阵中的每个状态
    if (faData.table_to_num_min.S && Array.isArray(faData.table_to_num_min.S)) {
      faData.table_to_num_min.S.forEach((state: any, index: number) => {
        const stateStr = String(state)
        console.log(`检查最小化状态 ${index}: ${stateStr}`)

        // 如果这个最小化状态对应的原始状态是接受状态，则它也是接受状态
        if (originalAcceptingStates.has(stateStr)) {
          minimizedStates.add(stateStr)
          console.log(`状态 ${stateStr} 是最小化DFA的接受状态`)
        }
      })
    }

    minimizedAcceptingStates.value = minimizedStates
    console.log('推断的最小化接受状态:', minimizedAcceptingStates.value)
    return
  }

  // 方法3: 尝试分析DOT字符串获取接受状态信息
  if (faStore.minDfaDotString) {
    const dotString = faStore.minDfaDotString
    const doubleCircleRegex = /(\w+)\s*\[.*shape\s*=\s*doublecircle.*\]/gi
    const matches = [...dotString.matchAll(doubleCircleRegex)]

    if (matches.length > 0) {
      const statesFromDot = matches.map(match => match[1])
      minimizedAcceptingStates.value = new Set(statesFromDot)
      console.log('从DOT字符串提取的最小化接受状态:', minimizedAcceptingStates.value)
      return
    }
  }

  // 方法4: 保守方法 - 假设状态编号连续，检查哪些状态应该是终态
  // 这需要更多的业务逻辑分析，先记录日志
  console.warn('无法确定最小化DFA的接受状态，请检查后端数据结构')
  console.log('可用的数据字段:', Object.keys(faData))
}

</script>

<style scoped>
.step-header {
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid #e5e7eb;
}
.step-icon {
  width: 3rem;
  height: 3rem;
  background: #fecaca;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.step-content {
  padding: 2rem;
}
.step-actions {
  padding: 1rem 2rem 2rem;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

</style>
