<template>
  <div class="subset-construction-step">
    <!-- 步骤头部 -->
    <div class="p-8 pb-4 border-b border-gray-200">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
          <Icon icon="lucide:table" class="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-900">子集构造法</h2>
          <p class="text-gray-600 mt-1">第三步：使用子集构造法生成转换表和状态转换矩阵</p>
        </div>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="p-8">
      <div class="space-y-6">
        <!-- NFA 参考图 -->
        <div class="nfa-reference">
          <div class="bg-white border border-gray-200 rounded-lg">
            <div class="border-b border-gray-200 p-4">
              <h3 class="font-semibold text-gray-900 flex items-center gap-2">
                <Icon icon="lucide:share-2" class="w-5 h-5 text-blue-600" />
                NFA 图（参考）
              </h3>
              <p class="text-sm text-gray-600 mt-1">根据此 NFA 图填写下方的转换表和状态转换矩阵</p>
            </div>
            <div class="p-6">
              <div
                v-if="faStore.nfaDotString"
                class="nfa-svg-container bg-gray-50 rounded-lg p-4 overflow-auto"
              >
                <div v-html="nfaSvg" class="flex justify-center"></div>
              </div>
              <div v-else class="text-center py-8 text-gray-500">
                <Icon icon="lucide:image-off" class="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>暂无 NFA 图数据</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 转换表区域 -->
        <div class="conversion-table-section">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- 左侧：用户填写转换表 -->
            <div class="user-table-section">
              <div class="bg-white border border-gray-200 rounded-lg">
                <div class="border-b border-gray-200 p-4">
                  <div class="flex items-center justify-between">
                    <h3 class="font-semibold text-gray-900">NFA → DFA 转换表（用户填写）</h3>
                    <div class="flex items-center gap-2">
                      <button
                        @click="addTableRow"
                        class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        <Icon icon="lucide:plus" class="w-4 h-4 inline mr-1" />
                        添加行
                      </button>
                      <button
                        @click="clearUserTable"
                        class="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                      >
                        <Icon icon="lucide:eraser" class="w-4 h-4 inline mr-1" />
                        清空
                      </button>
                      <button
                        @click="handleValidateTable"
                        class="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                      >
                        <Icon icon="lucide:check-circle" class="w-4 h-4 inline mr-1" />
                        检验答案
                      </button>
                    </div>
                  </div>
                </div>

                <div class="p-4">
                  <div
                    v-if="conversionTableColumns.length === 0"
                    class="text-center py-8 text-gray-500"
                  >
                    <Icon icon="lucide:edit" class="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>点击"添加行"开始填写转换表</p>
                  </div>

                  <div v-else class="overflow-x-auto">
                    <table class="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr class="bg-gray-50">
                          <!-- 转换表：列标题为 I, Ia, Ib 等输入符号 -->
                          <th
                            v-for="column in conversionTableColumns"
                            :key="column"
                            class="border border-gray-300 px-3 py-2 text-center font-semibold"
                          >
                            {{ column }}
                          </th>
                          <th class="border border-gray-300 px-3 py-2 text-center font-semibold">
                            操作
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <!-- 每行代表一个状态集合 -->
                        <tr
                          v-for="(_, rowIndex) in conversionTableRowCount"
                          :key="rowIndex"
                          :class="rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
                        >
                          <td
                            v-for="column in conversionTableColumns"
                            :key="column"
                            class="border border-gray-300 px-3 py-2"
                          >
                            <input
                              v-model="userConversionTable[column][rowIndex]"
                              type="text"
                              :placeholder="column === 'I' ? '状态集合' : '符号间用空格分隔'"
                              :class="getFieldClass(rowIndex, column, 'table') + ' text-center'"
                              @blur="
                                () =>
                                  validateField(
                                    userConversionTable[column][rowIndex],
                                    rowIndex,
                                    column,
                                    'table',
                                  )
                              "
                            />
                          </td>
                          <td class="border border-gray-300 px-3 py-2 text-center">
                            <button
                              @click="removeTableRow(rowIndex)"
                              class="text-red-600 hover:text-red-800 transition-colors"
                            >
                              <Icon icon="lucide:trash-2" class="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <!-- 转换表错误信息显示 -->
                  <div
                    v-if="showTableErrors && Object.keys(tableValidationErrors).length > 0"
                    class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <div class="flex items-start gap-2">
                      <Icon
                        icon="lucide:alert-circle"
                        class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
                      />
                      <div>
                        <h4 class="font-medium text-red-800 mb-2">转换表填写错误</h4>
                        <ul class="text-sm text-red-700 space-y-1">
                          <li v-for="(errors, fieldKey) in tableValidationErrors" :key="fieldKey">
                            <strong>{{ formatFieldKey(fieldKey, 'table') }}：</strong>
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
            <div class="answer-table-section">
              <div class="bg-white border border-gray-200 rounded-lg">
                <div class="border-b border-gray-200 p-4">
                  <div class="flex items-center justify-between">
                    <h3 class="font-semibold text-gray-900">标准答案</h3>
                    <button
                      @click="toggleTableAnswer"
                      :class="[
                        'px-4 py-2 rounded-lg transition-colors',
                        showTableAnswer
                          ? 'bg-gray-600 text-white hover:bg-gray-700'
                          : 'bg-green-600 text-white hover:bg-green-700',
                      ]"
                    >
                      <Icon
                        :icon="showTableAnswer ? 'lucide:eye-off' : 'lucide:eye'"
                        class="w-4 h-4 inline mr-2"
                      />
                      {{ showTableAnswer ? '隐藏答案' : '查看答案' }}
                    </button>
                  </div>
                </div>

                <div class="p-4">
                  <div v-if="!showTableAnswer" class="text-center py-8 text-gray-500">
                    <Icon icon="lucide:lock" class="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p class="text-lg font-medium">答案已隐藏</p>
                    <p class="text-sm mt-1">完成填写后点击"查看答案"按钮</p>
                  </div>

                  <div
                    v-else-if="Object.keys(answerConversionTable).length > 0"
                    class="overflow-x-auto"
                  >
                    <TransitionTable
                      :data="{
                        headers: conversionTableColumns,
                        rows: Array.from({ length: Math.max(...conversionTableColumns.map(col => answerConversionTable[col]?.length || 0)) }, (_, rowIndex) =>
                          conversionTableColumns.map(col => answerConversionTable[col]?.[rowIndex] || '-')
                        )
                      }"
                      :columns="conversionTableColumns.map(col => ({
                        key: col,
                        title: col,
                        type: col === 'I' ? 'state' as const : 'transition' as const,
                        editable: false
                      }))"
                      :editable="false"
                      :show-answer="true"
                      :final-state-config="{
                        isFinalState: (row: number, col: string, value: any) => value && value.includes('Y')
                      }"
                    />
                  </div>

                  <div v-else class="text-center py-8 text-gray-500">
                    <Icon icon="lucide:alert-circle" class="w-8 h-8 mx-auto mb-2" />
                    <p>暂无答案数据</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 状态转换矩阵区域 -->
        <div class="transition-matrix-section relative">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- 左侧：用户填写状态转换矩阵 -->
            <div class="user-matrix-section">
              <div class="bg-white border border-gray-200 rounded-lg">
                <div class="border-b border-gray-200 p-4">
                  <div class="flex items-center justify-between">
                    <h3 class="font-semibold text-gray-900">状态转换矩阵（用户填写）</h3>
                    <div class="flex items-center gap-2">
                      <button
                        @click="clearUserMatrix"
                        class="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                      >
                        <Icon icon="lucide:eraser" class="w-4 h-4 inline mr-1" />
                        清空
                      </button>
                      <button
                        @click="handleValidateMatrix"
                        class="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                      >
                        <Icon icon="lucide:check-circle" class="w-4 h-4 inline mr-1" />
                        检验答案
                      </button>
                    </div>
                  </div>
                </div>

                <div class="p-4">
                  <div v-if="alphabetSymbols.length === 0" class="text-center py-8 text-gray-500">
                    <Icon icon="lucide:grid-3x3" class="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>初始化完成后开始填写状态转换矩阵</p>
                  </div>

                  <div v-else class="overflow-x-auto">
                    <table class="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr class="bg-purple-50">
                          <!-- 矩阵：列标题为状态名 S, a, b 等 -->
                          <th
                            v-for="state in matrixStateColumns"
                            :key="state"
                            class="border border-gray-300 px-3 py-2 text-center font-semibold"
                          >
                            {{ state }}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <!-- 每行代表一个状态转换 -->
                        <tr
                          v-for="(rowData, rowKey) in userTransitionMatrix"
                          :key="String(rowKey)"
                          :class="(parseInt(String(rowKey)) % 2 === 0) ? 'bg-white' : 'bg-purple-50'"
                        >
                          <td
                            v-for="state in matrixStateColumns"
                            :key="state"
                            class="border border-gray-300 px-3 py-2"
                          >
                            <input
                              v-model="userTransitionMatrix[String(rowKey)][state]"
                              type="text"
                              placeholder="-"
                              :class="
                                getFieldClass(Number(rowKey), state, 'matrix') +
                                ' text-center'
                              "
                              @blur="
                                () =>
                                  validateField(
                                    userTransitionMatrix[String(rowKey)][state],
                                    Number(rowKey),
                                    state,
                                    'matrix',
                                  )
                              "
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
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
              </div>
            </div>

            <!-- 右侧：答案区域 -->
            <div class="answer-matrix-section">
              <div class="bg-white border border-gray-200 rounded-lg">
                <div class="border-b border-gray-200 p-4">
                  <div class="flex items-center justify-between">
                    <h3 class="font-semibold text-gray-900">标准答案</h3>
                    <button
                      @click="toggleMatrixAnswer"
                      :class="[
                        'px-4 py-2 rounded-lg transition-colors',
                        showMatrixAnswer
                          ? 'bg-gray-600 text-white hover:bg-gray-700'
                          : 'bg-green-600 text-white hover:bg-green-700',
                      ]"
                    >
                      <Icon
                        :icon="showMatrixAnswer ? 'lucide:eye-off' : 'lucide:eye'"
                        class="w-4 h-4 inline mr-2"
                      />
                      {{ showMatrixAnswer ? '隐藏答案' : '查看答案' }}
                    </button>
                  </div>
                </div>

                <div class="p-4">
                  <div v-if="!showMatrixAnswer" class="text-center py-8 text-gray-500">
                    <Icon icon="lucide:lock" class="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p class="text-lg font-medium">答案已隐藏</p>
                    <p class="text-sm mt-1">完成填写后点击"查看答案"按钮</p>
                  </div>

                  <div
                    v-else-if="Object.keys(answerTransitionMatrix).length > 0"
                    class="overflow-x-auto"
                  >
                    <TransitionTable
                      :data="{
                        headers: matrixStateColumns,
                        rows: Object.keys(answerTransitionMatrix).map(rowKey =>
                          matrixStateColumns.map(state => answerTransitionMatrix[rowKey]?.[state] || '-')
                        )
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
                        isFinalState: (row: number, col: string, value: any) => {
                          const columnMapping: Record<string, string> = {
                            'S': 'I', 'a': 'Ia', 'b': 'Ib', 'c': 'Ic'
                          }
                          const mappedColumn = columnMapping[col] || col
                          return finalStatePositions.some((pos: {row: number, col: string}) => pos.row === row && pos.col === mappedColumn)
                        }
                      }"
                    />
                  </div>

                  <div v-else class="text-center py-8 text-gray-500">
                    <Icon icon="lucide:alert-circle" class="w-8 h-8 mx-auto mb-2" />
                    <p>暂无答案数据</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 大毛玻璃覆盖层 - 覆盖整个状态转换矩阵区域 -->
          <div
            v-if="isMatrixLocked"
            class="absolute inset-0 z-50 backdrop-blur-xl backdrop-saturate-150 bg-gradient-to-br from-white/85 via-white/75 to-white/70 rounded-lg border border-white/50 flex items-center justify-center animate-[glassAppear_0.3s_ease-out]"
          >
            <div class="flex flex-col items-center justify-center h-full w-full px-8 py-12">
              <!-- 锁图标 -->
              <div class="flex items-center justify-center mb-8 animate-pulse">
                <Icon icon="lucide:lock" class="w-16 h-16 text-blue-100 drop-shadow-lg" />
              </div>

              <!-- 文字内容 -->
              <div class="text-center space-y-4 max-w-md">
                <h3 class="text-xl font-bold text-gray-900 drop-shadow-md">需要先查看转换表答案</h3>
                <p class="text-base text-gray-800 leading-relaxed drop-shadow-sm">
                  请先查看上方 NFA → DFA 转换表的标准答案后再填写状态转换矩阵
                </p>

                <!-- 引导按钮 -->
                <div class="mt-8 animate-bounce">
                  <div
                    class="inline-flex items-center px-5 py-3 bg-blue-600/90 hover:bg-blue-700/90 rounded-xl shadow-lg backdrop-blur-sm border border-blue-400/30 transition-all duration-300 cursor-pointer group"
                  >
                    <Icon
                      icon="lucide:arrow-up"
                      class="w-5 h-5 text-white mr-2 group-hover:animate-pulse"
                    />
                    <span class="text-white font-medium text-sm">点击上方转换表"查看答案"按钮</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 填写提示 -->
        <div class="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div class="flex items-start gap-3">
            <Icon icon="lucide:lightbulb" class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 class="font-medium text-blue-800">填写提示</h4>
              <ul class="text-sm text-blue-700 mt-2 space-y-1">
                <li>• 转换表：记录从NFA状态集合到新DFA状态的映射关系</li>
                <li>• <strong>多个符号之间必须用空格分隔（如：1 2 3）</strong></li>
                <li>• 状态转换矩阵：用数字编号表示状态间的转换关系</li>
                <li>• 无转换的格子可以填写"-"或留空</li>
                <li>• 完成填写后可以查看标准答案进行对比</li>
                <li>• <strong>必须查看转换表和状态转换矩阵的标准答案后才能进入下一步</strong></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 步骤操作栏 -->
    <div class="p-4 px-8 pb-8 border-t border-gray-200 bg-gray-50">
      <div class="flex justify-between items-center">
        <button
          @click="$emit('prev-step')"
          class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Icon icon="lucide:chevron-left" class="w-4 h-4 inline mr-2" />
          上一步
        </button>

        <div class="text-sm text-gray-500">步骤 3 / 6</div>

        <button
          @click="proceedToNext"
          :disabled="!constructionComplete"
          :class="[
            'px-6 py-2 rounded-lg transition-colors',
            constructionComplete
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed',
          ]"
          :title="!constructionComplete ? '请完成填写并查看任一标准答案后继续' : ''"
        >
          下一步
          <Icon icon="lucide:chevron-right" class="w-4 h-4 inline ml-2" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, type Ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useFAStore } from '@/stores'
import { instance } from '@viz-js/viz'
import { TransitionTable } from '@/components/fa'

// 类型定义
interface TableRow {
  state: string
  transitions: Record<string, string>
}

// 新的转换表结构 - 按列组织（每列一个输入符号）
interface ConversionTableData {
  [inputSymbol: string]: string[] // 每个输入符号对应一列数据
}

// 新的状态转换矩阵结构 - 按行组织（每行一个输入符号）
interface TransitionMatrixData {
  [rowIndex: string]: Record<string, string> // 每行对应一个状态转换
}

type TableType = 'table' | 'matrix'

const emit = defineEmits<{
  'next-step': []
  'prev-step': []
  complete: [data: any]
}>()

// 使用 FA Store
const faStore = useFAStore()

// NFA SVG 渲染
const nfaSvg = ref('')

// 用户填写的表格 - 新的数据结构
const userConversionTable = ref<ConversionTableData>({}) // 转换表：列布局
const userTransitionMatrix = ref<TransitionMatrixData>({}) // 状态转换矩阵：行布局

// 答案数据 - 新的数据结构
const answerConversionTable = ref<ConversionTableData>({})
const answerTransitionMatrix = ref<TransitionMatrixData>({})

// 答案显示控制
const showTableAnswer = ref(false)
const showMatrixAnswer = ref(false)

// 字母表符号和状态信息
const alphabetSymbols = ref<string[]>([]) // 输入符号 ['a', 'b']
const conversionTableColumns = ref<string[]>([]) // 转换表列标题 ['I', 'Ia', 'Ib']
const matrixStateColumns = ref<string[]>([]) // 矩阵状态列 ['S', 'a', 'b']
const dfaStates = ref<string[]>([])

// 表格行数控制
const conversionTableRowCount = ref(0) // 转换表的行数（动态调整）

// 验证状态管理
const tableValidationErrors = ref<Record<string, string[]>>({}) // 每个字段的错误信息
const matrixValidationErrors = ref<Record<string, string[]>>({})
const tableFieldValidation = ref<Record<string, 'valid' | 'invalid' | 'normal'>>({}) // 字段验证状态
const matrixFieldValidation = ref<Record<string, 'valid' | 'invalid' | 'normal'>>({})
const showTableErrors = ref(false) // 是否显示转换表错误
const showMatrixErrors = ref(false) // 是否显示矩阵错误

// 计算属性
const constructionComplete = computed(() => {
  const hasTableContent =
    conversionTableRowCount.value > 0 && conversionTableColumns.value.length > 0
  const hasMatrixContent = alphabetSymbols.value.length > 0 && matrixStateColumns.value.length > 0
  const hasNoErrors =
    Object.keys(tableValidationErrors.value).length === 0 &&
    Object.keys(matrixValidationErrors.value).length === 0
  // 至少查看过一个答案
  const hasViewedAnyAnswer = showTableAnswer.value || showMatrixAnswer.value
  // return hasTableContent && hasMatrixContent && hasNoErrors && hasViewedAnyAnswer
  return hasViewedAnyAnswer
})

const totalTransitions = computed(() => {
  let total = 0
  conversionTableColumns.value.forEach((column) => {
    const columnData = answerConversionTable.value[column] || []
    total += columnData.filter((cell) => cell && cell !== '-').length
  })
  return total
})

// 矩阵锁定状态：只有查看了转换表答案后才能操作矩阵
const isMatrixLocked = computed(() => {
  return !showTableAnswer.value && !showMatrixAnswer.value
})

// 新的表格操作函数
const addTableRow = () => {
  conversionTableRowCount.value++
  console.log('添加转换表行，当前行数:', conversionTableRowCount.value)

  // 确保每列都有足够的数据
  conversionTableColumns.value.forEach((column) => {
    if (!userConversionTable.value[column]) {
      userConversionTable.value[column] = []
    }
    // 填充到新的行数
    while (userConversionTable.value[column].length < conversionTableRowCount.value) {
      userConversionTable.value[column].push('')
    }
  })
}

const removeTableRow = (rowIndex: number) => {
  if (conversionTableRowCount.value > 0) {
    conversionTableRowCount.value--
    // 从每列中删除指定行
    conversionTableColumns.value.forEach((column) => {
      if (userConversionTable.value[column]) {
        userConversionTable.value[column].splice(rowIndex, 1)
      }
    })
  }
}

const clearUserTable = () => {
  conversionTableRowCount.value = 0
  userConversionTable.value = {}
  tableValidationErrors.value = {}
  tableFieldValidation.value = {}
  showTableErrors.value = false
}

// 矩阵操作函数 - 矩阵是固定结构，不需要添加/删除行
const clearUserMatrix = () => {
  // 重新初始化矩阵数据
  Object.keys(userTransitionMatrix.value).forEach((rowKey) => {
    userTransitionMatrix.value[rowKey] = {}
    matrixStateColumns.value.forEach((state) => {
      userTransitionMatrix.value[rowKey][state] = ''
    })
  })
  matrixValidationErrors.value = {}
  matrixFieldValidation.value = {}
  showMatrixErrors.value = false
}

// 初始化数据结构
const initializeDataStructures = () => {
  console.log('初始化数据结构')
  console.log('转换表列:', conversionTableColumns.value)
  console.log('字母表符号:', alphabetSymbols.value)
  console.log('矩阵状态列:', matrixStateColumns.value)

  // 初始化转换表数据结构
  conversionTableColumns.value.forEach((column) => {
    if (!userConversionTable.value[column]) {
      userConversionTable.value[column] = []
    }
  })

  // 转换表初始为空，用户需要手动添加行
  conversionTableRowCount.value = 0
  console.log('转换表初始化为空，用户需要手动添加行')

    // 初始化矩阵数据结构
  Object.keys(answerTransitionMatrix.value).forEach((rowKey) => {
    if (!userTransitionMatrix.value[rowKey]) {
      userTransitionMatrix.value[rowKey] = {}
    }
    matrixStateColumns.value.forEach((state) => {
      if (!userTransitionMatrix.value[rowKey][state]) {
        userTransitionMatrix.value[rowKey][state] = ''
      }
    })
  })
}

// 验证功能
const validateField = (
  value: string | undefined,
  rowIndex: number,
  field: string,
  tableType: 'table' | 'matrix',
) => {
  const fieldKey = `${tableType}-${rowIndex}-${field}`
  const errors: string[] = []

    // 确保value是字符串
  const fieldValue = value || ''

  console.log('Validating field:', { fieldKey, fieldValue, rowIndex, field, tableType })

  // 更新验证状态
  const validationRef = tableType === 'table' ? tableValidationErrors : matrixValidationErrors
  const fieldValidationRef = tableType === 'table' ? tableFieldValidation : matrixFieldValidation

  // 1. 检查是否为空
  if (!fieldValue || fieldValue.trim() === '') {
    if (field === 'state') {
      errors.push('状态名称不能为空')
    } else {
      errors.push('转换关系不能为空')
    }
  }

  // 2. 检查输入格式：确保符号之间用空格隔开
  if (tableType === 'table' && fieldValue && fieldValue.trim() !== '') {
    const trimmedValue = fieldValue.trim()
    if (trimmedValue && trimmedValue !== '-') {
      const hasMultipleChars = trimmedValue.length > 1
      const hasSpaces = trimmedValue.includes(' ')
      if (hasMultipleChars && !hasSpaces) {
        errors.push('多个符号之间需要用空格隔开')
      }
    }
  }

  // 3. 如果是状态字段，检查状态来源合法性
  if (field === 'state' && fieldValue && fieldValue.trim() !== '') {
    const isValidState = validateStateSource(fieldValue.trim(), rowIndex, tableType)
    if (!isValidState) {
      errors.push('新状态必须来源于之前行的转换结果')
    }
  }

  // 4. 如果是转换字段，检查转换正确性
  if (field !== 'state' && fieldValue && fieldValue.trim() !== '') {
    const isValidTransition = validateTransition(rowIndex, field, fieldValue.trim(), tableType)
    if (!isValidTransition) {
      errors.push('转换结果与标准答案不符')
    }
  }

  if (errors.length > 0) {
    console.log('Setting errors for field:', fieldKey, errors)
    validationRef.value[fieldKey] = errors
    fieldValidationRef.value[fieldKey] = 'invalid'
    // 失焦验证时也要显示错误信息
    if (tableType === 'table') {
      showTableErrors.value = true
      console.log('Table errors after setting:', tableValidationErrors.value)
      console.log('showTableErrors:', showTableErrors.value)
    } else {
      showMatrixErrors.value = true
      console.log('Matrix errors after setting:', matrixValidationErrors.value)
      console.log('showMatrixErrors:', showMatrixErrors.value)
    }
  } else {
    console.log('Clearing errors for field:', fieldKey)
    delete validationRef.value[fieldKey]
    fieldValidationRef.value[fieldKey] = 'valid'
    // 检查是否还有其他错误，如果没有则隐藏错误面板
    if (Object.keys(validationRef.value).length === 0) {
      if (tableType === 'table') {
        showTableErrors.value = false
      } else {
        showMatrixErrors.value = false
      }
    }
  }

  console.log('Validation complete for field:', fieldKey, 'Errors count:', errors.length)
}

// 验证状态来源合法性 - 更新为新数据结构
const validateStateSource = (
  stateName: string,
  currentRowIndex: number,
  tableType: 'table' | 'matrix',
): boolean => {
  // 第一行的状态（通常是初始状态）总是合法的
  if (currentRowIndex === 0) return true

  if (tableType === 'table') {
    // 转换表：检查该状态是否在之前的行中作为转换结果出现过
    for (let rowIndex = 0; rowIndex < currentRowIndex; rowIndex++) {
      for (const column of conversionTableColumns.value) {
        const cellValue = userConversionTable.value[column]?.[rowIndex]?.trim()
        if (cellValue && cellValue !== '-' && cellValue.includes(stateName)) {
          return true
        }
      }
    }
  } else {
    // 矩阵：不需要验证状态来源，因为状态列是固定的
    return matrixStateColumns.value.includes(stateName)
  }

  return false
}

// 比较状态集合是否相等（考虑顺序无关性）
const compareStateSets = (set1: string, set2: string): boolean => {
  // 如果都是空值或'-'，认为相等
  if ((!set1 || set1.trim() === '' || set1.trim() === '-') &&
      (!set2 || set2.trim() === '' || set2.trim() === '-')) {
    return true
  }

  // 如果只有一个为空，不相等
  if (!set1 || set1.trim() === '' || set1.trim() === '-' ||
      !set2 || set2.trim() === '' || set2.trim() === '-') {
    return false
  }

  // 分割状态集合，去除空格并排序
  const states1 = set1.trim().split(/\s+/).sort()
  const states2 = set2.trim().split(/\s+/).sort()

  // 比较长度
  if (states1.length !== states2.length) {
    return false
  }

  // 逐个比较状态
  for (let i = 0; i < states1.length; i++) {
    if (states1[i] !== states2[i]) {
      return false
    }
  }

  return true
}

// 验证转换正确性 - 更新为新数据结构
const validateTransition = (
  rowIndex: number,
  field: string,
  userValue: string,
  tableType: 'table' | 'matrix',
): boolean => {
  if (tableType === 'table') {
    // 转换表验证：根据列名找到对应的答案数据
    const answerColumn = answerConversionTable.value[field]
    if (!answerColumn || !answerColumn[rowIndex]) {
      console.log(`转换表验证失败：找不到答案数据 ${field}[${rowIndex}]`)
      return false
    }

    const correctValue = answerColumn[rowIndex] || '-'

    // 使用状态集合比较函数（考虑顺序无关性）
    const isEqual = compareStateSets(userValue, correctValue)

    console.log(`转换表验证：${field}[${rowIndex}] 用户值:"${userValue}" 正确答案:"${correctValue}" 相等:${isEqual}`)
    return isEqual
  } else {
    // 矩阵验证：字段名直接是状态名，行索引通过参数传递
    const answerRow = answerTransitionMatrix.value[rowIndex.toString()]
    if (!answerRow) {
      console.log(`矩阵验证失败：找不到行 ${rowIndex} 的答案数据`)
      return false
    }

    const correctValue = answerRow[field] || '-'

    // 对于矩阵，也使用状态集合比较函数
    const isEqual = compareStateSets(userValue, correctValue)

    console.log(`矩阵验证：${rowIndex}-${field} 用户值:"${userValue}" 正确答案:"${correctValue}" 相等:${isEqual}`)
    return isEqual
  }
}

// 验证整个表格 - 更新为新数据结构
const validateTable = (tableType: 'table' | 'matrix') => {
  console.log(`开始验证${tableType === 'table' ? '转换表' : '矩阵'}`)

  if (tableType === 'table') {
    // 验证转换表
    for (let rowIndex = 0; rowIndex < conversionTableRowCount.value; rowIndex++) {
      conversionTableColumns.value.forEach((column) => {
        const value = userConversionTable.value[column]?.[rowIndex] || ''
        validateField(value, rowIndex, column, tableType)
      })
    }
  } else {
    // 验证矩阵
    Object.keys(userTransitionMatrix.value).forEach((rowKey) => {
      matrixStateColumns.value.forEach((state) => {
        const value = userTransitionMatrix.value[rowKey]?.[state] || ''
        validateField(value, Number(rowKey), state, tableType)
      })
    })
  }

  // 显示错误信息
  if (tableType === 'table') {
    showTableErrors.value = Object.keys(tableValidationErrors.value).length > 0
    console.log('转换表验证完成，错误数量:', Object.keys(tableValidationErrors.value).length)
  } else {
    showMatrixErrors.value = Object.keys(matrixValidationErrors.value).length > 0
    console.log('矩阵验证完成，错误数量:', Object.keys(matrixValidationErrors.value).length)
  }
}

// 获取字段的CSS类
const getFieldClass = (rowIndex: number, field: string, tableType: 'table' | 'matrix') => {
  const fieldKey = `${tableType}-${rowIndex}-${field}`
  const fieldValidationRef = tableType === 'table' ? tableFieldValidation : matrixFieldValidation
  const validationStatus = fieldValidationRef.value[fieldKey]

  const baseClass = 'w-full px-2 py-1 border rounded text-sm focus:outline-none focus:ring-1'

  if (validationStatus === 'valid') {
    return `${baseClass} border-green-500 bg-green-50 focus:ring-green-500`
  } else if (validationStatus === 'invalid') {
    return `${baseClass} border-red-500 bg-red-50 focus:ring-red-500`
  } else {
    const ringColor = tableType === 'table' ? 'focus:ring-blue-500' : 'focus:ring-purple-500'
    return `${baseClass} border-gray-300 ${ringColor}`
  }
}

// 手动验证按钮处理
const handleValidateTable = () => {
  validateTable('table')
}

const handleValidateMatrix = () => {
  validateTable('matrix')
}

// 格式化错误信息的辅助函数
const formatFieldKey = (fieldKey: string, tableType: 'table' | 'matrix') => {
  const parts = fieldKey.split('-')
  if (parts.length >= 3) {
    const rowIndex = parseInt(parts[1]) + 1 // 转换为1-based索引
    const fieldName = parts[2]

    if (tableType === 'table') {
      // 转换表：显示列名
      return `第${rowIndex}行${fieldName}列`
    } else {
      // 矩阵：字段名直接是状态名（如 "S", "a", "b"）
      return `第${rowIndex}行${fieldName}列`
    }
  }
  return fieldKey
}

// 终态位置列表（从转换表中提取的含Y单元格的位置）
const finalStatePositions = ref<Array<{row: number, col: string}>>([])



// 提取终态位置（从转换表中含Y的单元格位置）
const extractFinalStatePositions = (conversionTable: ConversionTableData) => {
  const positions: Array<{row: number, col: string}> = []

  console.log('开始提取终态位置，转换表数据:', conversionTable)

  // 遍历转换表的所有列
  Object.keys(conversionTable).forEach((column) => {
    const columnData = conversionTable[column]
    console.log(`检查列 ${column}:`, columnData)

    if (Array.isArray(columnData)) {
      columnData.forEach((cellValue, rowIndex) => {
        console.log(`检查单元格 [${rowIndex}][${column}]: ${cellValue}`)
        // 如果单元格包含Y，记录这个位置
        if (cellValue && cellValue.includes('Y')) {
          positions.push({row: rowIndex, col: column})
          console.log(`找到终态位置: 行${rowIndex}, 列${column} -> ${cellValue}`)
        }
      })
    }
  })

  finalStatePositions.value = positions
  console.log('提取的终态位置列表:', finalStatePositions.value)
}

// 渲染 NFA SVG
const renderNFASvg = async () => {
  if (faStore.nfaDotString) {
    try {
      const viz = await instance()
      const svg = viz.renderSVGElement(faStore.nfaDotString)
      nfaSvg.value = svg.outerHTML
    } catch (error) {
      console.error('渲染 NFA SVG 失败：', error)
      nfaSvg.value = ''
    }
  }
}

// 从FA数据中提取字母表符号
const extractAlphabetFromFAData = (data: any) => {
  const symbols = new Set<string>()

  // 从转换表中提取符号
  if (data.table) {
    Object.keys(data.table).forEach((symbol) => {
      if (symbol !== 'I' && symbol !== 'ε' && symbol !== 'epsilon') {
        // 从 Ia, Ib 中提取 a, b
        const extractedSymbol = symbol.replace('I', '')
        symbols.add(extractedSymbol)
      }
    })
  }

  // 如果从table中没有提取到符号，尝试从table_to_num中提取
  if (symbols.size === 0 && data.table_to_num) {
    Object.keys(data.table_to_num).forEach((symbol) => {
      if (symbol !== 'S') {
        symbols.add(symbol)
      }
    })
  }

  alphabetSymbols.value = Array.from(symbols).sort()
  console.log('提取的字母表符号:', alphabetSymbols.value)
}

// 新的数据处理函数 - 转换表数据处理（列布局）
const processTableDataToColumns = (table: any, symbols: string[]): ConversionTableData => {
  const result: ConversionTableData = {}

  if (!table) return result

  console.log('处理转换表数据，原始table:', table)
  console.log('符号列表:', symbols)

  // 创建列数据结构 - 使用后端返回的原始列名
  const allColumns = ['I', ...symbols.map((s) => `I${s}`)]
  console.log('所有列名:', allColumns)

  // 初始化每列
  allColumns.forEach((column) => {
    result[column] = []
  })

  // 获取最大行数
  const maxRows = Math.max(
    ...allColumns.map((col) => {
      const colData = table[col]
      return Array.isArray(colData) ? colData.length : 0
    })
  )
  console.log('最大行数:', maxRows)

  // 填充数据
  for (let rowIndex = 0; rowIndex < maxRows; rowIndex++) {
    allColumns.forEach((column) => {
      const colData = table[column]
      console.log(`处理列 ${column} 第 ${rowIndex} 行:`, colData?.[rowIndex])

      if (colData && Array.isArray(colData) && colData[rowIndex]) {
        const cellData = colData[rowIndex]
        if (Array.isArray(cellData)) {
          // 如果是嵌套数组，将其转换为字符串，符号之间用空格隔开
          const cellValue = cellData.join(' ') || '-'
          result[column].push(cellValue)
          console.log(`列 ${column} 第 ${rowIndex} 行结果:`, cellValue)
        } else {
          const cellValue = String(cellData) || '-'
          result[column].push(cellValue)
          console.log(`列 ${column} 第 ${rowIndex} 行结果:`, cellValue)
        }
      } else {
        result[column].push('-')
        console.log(`列 ${column} 第 ${rowIndex} 行结果: -`)
      }
    })
  }

  console.log('最终转换表结果:', result)
  return result
}

// 新的数据处理函数 - 矩阵数据处理（行布局）
const processMatrixDataToRows = (tableToNum: any, symbols: string[]): TransitionMatrixData => {
  const result: TransitionMatrixData = {}

  if (!tableToNum) return result

  console.log('处理矩阵数据，原始tableToNum:', tableToNum)
  console.log('符号列表:', symbols)

  // 获取所有状态（S, a, b）
  const allStates = Object.keys(tableToNum)
  const sKeys = allStates.filter((x) => x === 'S')
  const nonSKeys = allStates.filter((x) => x !== 'S').sort()
  const stateKeys = [...sKeys, ...nonSKeys]
  console.log('状态键:', stateKeys)

  // 获取最大行数（数组长度）
  const maxRows = Math.max(
    ...stateKeys.map((state) => {
      const stateData = tableToNum[state]
      return Array.isArray(stateData) ? stateData.length : 0
    })
  )
  console.log('最大行数:', maxRows)

  // 为每一行创建数据
  for (let rowIndex = 0; rowIndex < maxRows; rowIndex++) {
    const rowKey = rowIndex.toString()
    result[rowKey] = {}

    stateKeys.forEach((state) => {
      const stateData = tableToNum[state]
      if (stateData && Array.isArray(stateData) && stateData[rowIndex]) {
        result[rowKey][state] = stateData[rowIndex]
        console.log(`矩阵 ${rowKey}-${state}:`, result[rowKey][state])
      } else {
        result[rowKey][state] = '-'
        console.log(`矩阵 ${rowKey}-${state}: -`)
      }
    })
  }

  console.log('最终矩阵结果:', result)
  return result
}

// 生成答案数据（更新为新数据结构）
const generateAnswerData = (data: any) => {
  console.log('原始数据:', data)

  // 使用与extractAlphabetFromFAData相同的逻辑提取符号
  const symbols = new Set<string>()

  // 从转换表中提取符号
  if (data.table) {
    Object.keys(data.table).forEach((symbol) => {
      if (symbol !== 'I' && symbol !== 'ε' && symbol !== 'epsilon') {
        // 从 Ia, Ib 中提取 a, b
        const extractedSymbol = symbol.replace('I', '')
        symbols.add(extractedSymbol)
      }
    })
  }

  // 如果从table中没有提取到符号，尝试从table_to_num中提取
  if (symbols.size === 0 && data.table_to_num) {
    Object.keys(data.table_to_num).forEach((symbol) => {
      if (symbol !== 'S') {
        symbols.add(symbol)
      }
    })
  }

  const symbolArray = Array.from(symbols).sort()
  console.log('提取的符号:', symbolArray)

  // 生成转换表答案（列布局）
  answerConversionTable.value = processTableDataToColumns(data.table, symbolArray)
  console.log('转换表答案:', answerConversionTable.value)

  // 生成状态转换矩阵答案（行布局）
  answerTransitionMatrix.value = processMatrixDataToRows(data.table_to_num, symbolArray)

  // 设置列信息 - 使用后端返回的原始列名
  conversionTableColumns.value = ['I', ...symbolArray.map((s) => `I${s}`)]
  console.log('转换表列名:', conversionTableColumns.value)

  // 设置矩阵状态列 - 根据后端数据动态确定表头
  if (data.table_to_num) {
    const allStates = Object.keys(data.table_to_num)
    console.log('table_to_num的所有键:', allStates)
    const sKeys = allStates.filter((x) => x === 'S')
    const nonSKeys = allStates.filter((x) => x !== 'S').sort()
    matrixStateColumns.value = [...sKeys, ...nonSKeys]
    console.log('矩阵状态列:', matrixStateColumns.value)

    // 强制触发响应式更新
    matrixStateColumns.value = [...matrixStateColumns.value]
  }

  // 更新DFA状态（从转换表的I列获取）
  dfaStates.value = answerConversionTable.value['I'] || []

  // 提取终态位置列表
  extractFinalStatePositions(answerConversionTable.value)
}

// 答案显示控制
const toggleTableAnswer = () => {
  showTableAnswer.value = !showTableAnswer.value
}

const toggleMatrixAnswer = () => {
  showMatrixAnswer.value = !showMatrixAnswer.value
}

// 进入下一步
const proceedToNext = () => {
  if (constructionComplete.value) {
    const stepData = {
      conversionTable: answerConversionTable.value,
      transitionMatrix: answerTransitionMatrix.value,
      dfaStates: dfaStates.value,
      alphabetSymbols: alphabetSymbols.value,
      conversionTableColumns: conversionTableColumns.value,
      matrixStateColumns: matrixStateColumns.value,
      totalTransitions: totalTransitions.value,
      userConversionTable: userConversionTable.value,
      userTransitionMatrix: userTransitionMatrix.value,
      timestamp: new Date().toISOString(),
    }

    localStorage.setItem('fa-step3-data', JSON.stringify(stepData))
    emit('next-step')
  }
}

// 组件挂载时的初始化
onMounted(() => {
  if (!faStore.hasResult()) {
    console.warn('No FA data found, please complete step 1 first')
    return
  }

  try {
    const faResult = faStore.originalData
    if (faResult) {
      console.log('开始初始化FA数据')

      // 1. 提取字母表符号
      extractAlphabetFromFAData(faResult)

      // 2. 生成答案数据
      generateAnswerData(faResult)

      // 3. 初始化用户数据结构（必须在生成答案数据之后）
      initializeDataStructures()

      // 4. 渲染NFA SVG
      renderNFASvg()

      console.log('FA数据初始化完成')
    }
  } catch (error) {
    console.error('处理FA数据失败：', error)
  }
})
</script>

<style scoped>
/* 自定义动画 - 这些无法用Tailwind实现，需要保留 */
@keyframes glassAppear {
  from {
    opacity: 0;
    backdrop-filter: blur(0px) saturate(100%);
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    backdrop-filter: blur(12px) saturate(150%);
    transform: scale(1);
  }
}


</style>
