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
                  <p v-if="originalStateCount > 0" class="text-sm text-gray-600 mb-4">
                    请将状态集
                    {{
                      faStore.originalData?.table_to_num_min?.['S']?.join(', ') ||
                      Array.from({ length: originalStateCount }, (_, i) => i).join(', ')
                    }}
                    最小化
                  </p>
                  <span class="text-xs text-gray-500">(每一行输入一个化简后的状态子集)</span>

                  <!-- P集合输入 -->
                  <div class="space-y-3 mt-4">
                    <div v-for="(pItem, index) in localPSets" :key="pItem.id" class="space-y-1">
                      <div class="flex items-center gap-2">
                        <input
                          v-model="pItem.text"
                          :class="getPSetFieldClass(pItem)"
                          :disabled="pItem.category === 'onlyRead' || step6Open"
                          @focus="handlePSetFocus(pItem)"
                          @input="handlePSetInput(pItem)"
                          @blur="handlePSetBlur(pItem)"
                          placeholder="输入状态子集，如：123"
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
                      <!-- P集合状态提示 -->
                      <div v-if="pItem.check === 'empty'" class="text-xs text-yellow-600 ml-2">
                        请输入状态子集
                      </div>
                      <div v-else-if="pItem.check === 'isError'" class="text-xs text-red-600 ml-2">
                        {{ isDuplicateAnswer(pItem) ? '答案重复' : '答案不正确' }}
                      </div>
                      <div
                        v-else-if="pItem.check === 'isCorrect'"
                        class="text-xs text-green-600 ml-2"
                      >
                        ✓ 正确
                      </div>
                    </div>
                  </div>

                  <div class="mt-6">
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
                  </div>

                  <!-- P集合错误信息显示 -->
                  <div
                    v-if="showPSetErrors && Object.keys(pSetValidationErrors).length > 0"
                    class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <div class="flex items-start gap-2">
                      <Icon
                        icon="lucide:alert-circle"
                        class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
                      />
                      <div>
                        <h4 class="font-medium text-red-800 mb-2">化简DFA状态子集填写错误</h4>
                        <ul class="text-sm text-red-700 space-y-1">
                          <li v-for="(errors, fieldKey) in pSetValidationErrors" :key="fieldKey">
                            <strong>{{ formatFieldKey(fieldKey, 'pset') }}：</strong>
                            <span v-for="(error, index) in errors" :key="index">
                              {{ error }}{{ index < errors.length - 1 ? '，' : '' }}
                            </span>
                          </li>
                        </ul>
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
                        {{ pSet.join('') }}
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
                  <div v-if="step6Open && minimizedMatrix.length">
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
                                v-model="getMatrixCell(rowIndex, colIndex)!.value"
                                :class="getMatrixFieldClass(getMatrixCell(rowIndex, colIndex)!)"
                                :disabled="step7Open"
                                @focus="handleMatrixCellFocus(getMatrixCell(rowIndex, colIndex)!)"
                                @input="handleMatrixCellInput(getMatrixCell(rowIndex, colIndex)!)"
                                @blur="handleMatrixCellBlur(getMatrixCell(rowIndex, colIndex)!)"
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

                    <div class="mt-4">
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
                    <p>请先完成左侧化简DFA状态子集的填写</p>
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
                headers: ['S', ...alphabetSymbols],
                rows: Array.from({ length: originalStateCount }, (_, rowIndex) => [
                  faStore.originalData?.table_to_num_min?.['S']?.[rowIndex] ?? rowIndex,
                  ...alphabetSymbols.map(symbol => faStore.originalData?.table_to_num_min[symbol]?.[rowIndex] ?? '-')
                ])
              }"
              :columns="[{ key: 'S', title: 'S', type: 'state' as const, editable: false }, ...alphabetSymbols.map(symbol => ({ key: symbol, title: symbol, type: 'transition' as const, editable: false }))]"
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
              <h4 class="font-medium text-green-800">DFA 最小化完成</h4>
              <div class="text-sm text-green-700 mt-2 space-y-1">
                <p>• 最小化状态数: {{ originalStateCount }}</p>
                <p>• 状态分区数: {{ localPSets.length }}</p>
                <p>• 状态转换矩阵已完成</p>
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
import { ref, computed, onMounted } from 'vue'
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

// 最小化DFA的接受状态集合
const minimizedAcceptingStates = ref<Set<string>>(new Set())

// 验证状态管理
const pSetValidationErrors = ref<Record<string, string[]>>({}) // P集合错误信息
const matrixValidationErrors = ref<Record<string, string[]>>({}) // 矩阵错误信息
const pSetFieldValidation = ref<Record<string, 'valid' | 'invalid' | 'normal'>>({}) // P集合字段验证状态
const matrixFieldValidation = ref<Record<string, 'valid' | 'invalid' | 'normal'>>({}) // 矩阵字段验证状态
const showPSetErrors = ref(false) // 是否显示P集合错误
const showMatrixErrors = ref(false) // 是否显示矩阵错误

// 计算属性
const isComplete = computed(() => {
  return step6Open.value && step7Open.value
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
  return !showSetsAnswer.value
})

// 答案显示控制函数
const toggleSetsAnswer = () => {
  showSetsAnswer.value = !showSetsAnswer.value
}

const toggleMatrixAnswerStep5 = () => {
  showMatrixAnswerStep5.value = !showMatrixAnswerStep5.value
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
    }
  } catch (error) {
    console.error('处理FA数据失败：', error)
  }
})

// P集合相关方法
const handlePSetFocus = (pItem: PSetItem) => {
  // 焦点时不清除错误状态，让用户看到错误信息
  // 只有在用户开始输入时才清除错误状态
}

// 添加失焦处理函数
const handlePSetBlur = (pItem: PSetItem) => {
  if (step6Open.value) return

  // 失焦时进行验证
  validatePSetField(pItem)
}

// P集合输入处理：实时状态更新 + 防抖检验
const handlePSetInput = (pItem: PSetItem) => {
  if (step6Open.value) return

  const inputText = pItem.text.trim()

  // 用户开始输入时，清除错误状态，设置为正常状态
  if (pItem.check === ValidationState.ERROR) {
    pItem.check = inputText ? ValidationState.NORMAL : ValidationState.EMPTY
  } else {
    pItem.check = inputText ? ValidationState.NORMAL : ValidationState.EMPTY
  }

  // 使用新的验证逻辑
  validatePSetField(pItem)
}



const removePSet = (index: number) => {
  if (step6Open.value || localPSets.value.length <= 1) return
  localPSets.value.splice(index, 1)

  // 清除错误状态
  pSetValidationErrors.value = {}
  pSetFieldValidation.value = {}
  showPSetErrors.value = false
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

  // 清除错误状态
  pSetValidationErrors.value = {}
  pSetFieldValidation.value = {}
  showPSetErrors.value = false
}

// 字符集比较函数
const areCharacterSetsEqual = (str1: string, str2: string): boolean => {
  const set1 = new Set(str1)
  const set2 = new Set(str2)

  if (set1.size !== set2.size) {
    return false
  }

  for (const char of set1) {
    if (!set2.has(char)) {
      return false
    }
  }
  return true
}

// 检查是否为重复答案
const isDuplicateAnswer = (pItem: PSetItem): boolean => {
  const inputText = pItem.text.trim()
  if (!inputText) return false

  const currentIndex = localPSets.value.findIndex(item => item.id === pItem.id)
  const otherInputs = localPSets.value
    .filter((item, index) => index !== currentIndex && item.text.trim())
    .map(item => item.text.trim())

  return otherInputs.some(otherInput =>
    areCharacterSetsEqual(inputText, otherInput)
  )
}

// P集合匹配验证
const matchPSetsValue = (answerList: string[], inputList: PSetItem[]) => {
  const answerSet = new Set(answerList)

  for (const item of inputList) {
    const itemText = item.text.replace(/\s+/g, '')
    const answerItem = answerList.find((answer) => areCharacterSetsEqual(answer, itemText))

    if (answerItem) {
      item.check = 'isCorrect'
      answerSet.delete(answerItem)
    } else {
      item.check = 'isError'
    }
  }

  return answerSet.size === 0 && inputList.every((item) => item.check === 'isCorrect')
}

// 校验P集合
const validatePSets = () => {
  if (step6Open.value || !faStore.originalData?.P) return

  // 检验所有P集合项
  localPSets.value.forEach((item) => {
    validatePSetField(item)
  })

  // 检查是否所有答案都正确且完整匹配
  const answerList = faStore.originalData.P.map((pSet: string[]) => pSet.join(''))
  if (matchPSetsValue(answerList, localPSets.value)) {
    step6Open.value = true
    initMinimizedMatrix()
    // success message
  }
}

// 初始化最小化矩阵
const initMinimizedMatrix = () => {
  if (!faStore.originalData?.table_to_num_min) return

  const tableToNumMin = faStore.originalData.table_to_num_min
  const symbols = alphabetSymbols.value // 已排除S列
  const rowCount = originalStateCount.value

  console.log('initMinimizedMatrix - rowCount:', rowCount)
  console.log('initMinimizedMatrix - symbols:', symbols)

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

  // 清除矩阵错误状态
  matrixValidationErrors.value = {}
  matrixFieldValidation.value = {}
  showMatrixErrors.value = false
}

// 矩阵单元格焦点处理
const handleMatrixCellFocus = (cell: MatrixCell) => {
  if (cell.check === ValidationState.ERROR) {
    cell.check = cell.value.trim() ? ValidationState.NORMAL : ValidationState.EMPTY
  }
}

// 矩阵单元格失焦处理
const handleMatrixCellBlur = (cell: MatrixCell) => {
  if (step7Open.value) return

  // 失焦时进行验证
  validateMatrixField(cell)
}

// 矩阵单元格输入处理
const handleMatrixCellInput = (cell: MatrixCell) => {
  if (step7Open.value) return

  const inputValue = cell.value.trim()
  cell.check = inputValue ? ValidationState.NORMAL : ValidationState.EMPTY

  // 使用新的验证逻辑
  validateMatrixField(cell)
}



// 获取矩阵单元格
const getMatrixCell = (row: number, col: number): MatrixCell | undefined => {
  return minimizedMatrix.value.find((cell) => cell.rowIndex === row && cell.colIndex === col)
}

// 校验矩阵
const validateMatrix = () => {
  if (step7Open.value || !faStore.originalData?.table_to_num_min) return

  // 检验所有矩阵单元格
  minimizedMatrix.value.forEach((cell) => {
    if (cell.category === 'onlyRead') return

    validateMatrixField(cell)
  })

  // 检查是否所有答案都正确
  const hasErrors = Object.keys(matrixValidationErrors.value).length > 0
  if (!hasErrors) {
  step7Open.value = true
  // success message
  }
}

// 进入下一步
const proceedToNext = () => {
  if (isComplete.value) {
    const stepData = {
      localPSets: localPSets.value,
      minimizedMatrix: minimizedMatrix.value,
      step6Open: step6Open.value,
      step7Open: step7Open.value,
      timestamp: new Date().toISOString(),
    }

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
    const answerList = faStore.originalData.P.map((pSet: string[]) => pSet.join(''))
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

const validateMatrixField = (cell: MatrixCell) => {
  const fieldKey = `matrix-${cell.rowIndex}-${cell.colIndex}`
  const errors: string[] = []

  const fieldValue = cell.value.trim()

  console.log('Validating matrix field:', { fieldKey, fieldValue })

  // 1. 检查是否为空
  if (!fieldValue) {
    errors.push('转换关系不能为空')
  }

  // 2. 检查答案正确性
  if (fieldValue && faStore.originalData?.table_to_num_min) {
    const tableToNumMin = faStore.originalData.table_to_num_min
    const symbol = alphabetSymbols.value[cell.colIndex]
    const correctAnswer = tableToNumMin[symbol]?.[cell.rowIndex] || ''

    if (fieldValue !== correctAnswer) {
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
  const fieldKey = `pset-${pItem.id}`
  const validationStatus = pSetFieldValidation.value[fieldKey]

  const baseClass = 'flex-1 px-3 py-2 border rounded text-sm'

  if (validationStatus === 'valid') {
    return `${baseClass} border-green-500 bg-green-50`
  } else if (validationStatus === 'invalid') {
    return `${baseClass} border-red-500 bg-red-50`
  } else {
    return `${baseClass} border-gray-300`
  }
}

// 获取矩阵字段的CSS类
const getMatrixFieldClass = (cell: MatrixCell) => {
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
const formatFieldKey = (fieldKey: string, fieldType: 'pset' | 'matrix') => {
  const parts = fieldKey.split('-')
  if (parts.length >= 2) {
    if (fieldType === 'pset') {
      // P集合：显示行号
      const rowIndex = localPSets.value.findIndex(item => item.id === parts[1]) + 1
      return `第${rowIndex}行`
    } else {
      // 矩阵：显示行列位置
      const rowIndex = parseInt(parts[1]) + 1
      const colIndex = parseInt(parts[2]) + 1
      const symbol = alphabetSymbols.value[parseInt(parts[2])] || ''
      return `第${rowIndex}行${symbol}列`
    }
  }
  return fieldKey
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
