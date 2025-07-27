<template>
  <div class="dfa-draw-step">
    <div class="step-header">
      <div class="flex items-center gap-4">
        <div class="step-icon">
          <Icon icon="lucide:share-2" class="w-6 h-6 text-orange-600" />
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-900">绘制 DFA</h2>
          <p class="text-gray-600 mt-1">第四步：根据转换表绘制确定有限自动机</p>
        </div>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="step-content">
      <div class="space-y-6">
        <!-- 转换表参考区域 -->
        <div class="transition-tables-reference">
          <div class="bg-white border border-gray-200 rounded-lg">
            <div class="border-b border-gray-200 p-4">
              <h3 class="font-semibold text-gray-900 flex items-center gap-2">
                <Icon icon="lucide:table" class="w-5 h-5 text-green-600" />
                转换表参考（来自第三步）
              </h3>
              <p class="text-sm text-gray-600 mt-1">根据这些表格绘制 DFA 图</p>
            </div>
            <div class="p-6">
              <div
                v-if="conversionTableColumns.length || Object.keys(answerTransitionMatrix).length > 0"
                class="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                <!-- 转换表 -->
                <div v-if="conversionTableColumns.length" class="conversion-table">
                  <h4 class="font-medium text-gray-800 mb-3">NFA → DFA 转换表</h4>
                              <TransitionTable
              :data="{
                headers: conversionTableColumns,
                rows: Array.from({ length: Math.max(...conversionTableColumns.map(col => conversionTable[col]?.length || 0)) }, (_, rowIndex) =>
                  conversionTableColumns.map(col => conversionTable[col]?.[rowIndex] || '-')
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

                <!-- 状态转换矩阵 -->
                <div v-if="Object.keys(answerTransitionMatrix).length > 0" class="transition-matrix">
                  <h4 class="font-medium text-gray-800 mb-3">状态转换矩阵</h4>
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
              </div>
              <div v-else class="text-center py-8 text-gray-500">
                <Icon icon="lucide:table-2" class="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>暂无转换表数据</p>
                <p class="text-sm mt-1">请先完成第三步的子集构造</p>
              </div>



              <!-- 高亮说明 -->
              <div class="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                <div class="flex items-start gap-3">
                  <Icon icon="lucide:zap" class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 class="font-medium text-green-800">高亮说明</h4>
                    <div class="text-sm text-green-700 mt-2 space-y-1">
                      <p>• <span class="font-semibold">绿色发光单元格</span>：表示终态（包含Y的状态集合）</p>
                      <p>• 转换表中含Y的单元格会高亮显示</p>
                      <p>• 状态转换矩阵中对应位置的单元格也会高亮</p>
                      <p>• 这些高亮状态在DFA中应标记为接受状态</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 上方：用户画图区域 -->
        <div class="user-draw-area">
          <div class="bg-white border border-gray-200 rounded-lg">
            <!-- 用户画布 -->
            <div class="h-[700px] p-4">
              <FACanvas ref="dfaCanvasRef" mode="dfa" />
            </div>
          </div>

          <!-- DFA 信息面板 -->
          <div class="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div class="flex items-start gap-3">
              <Icon icon="lucide:info" class="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 class="font-medium text-orange-800">DFA 绘制区域</h4>
                <div class="text-sm text-orange-700 mt-2 space-y-1">
                  <p>• 在上方画布中手动绘制DFA</p>
                  <p>• 根据转换表添加状态和转换</p>
                  <p>• 完成绘制后可进入下一步</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 绘制提示 -->
          <div class="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex items-start gap-3">
              <Icon icon="lucide:lightbulb" class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 class="font-medium text-blue-800">绘制提示</h4>
                <div class="text-sm text-blue-700 mt-2 space-y-1">
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p class="font-medium">正则表达式:</p>
                      <code class="block mt-1 p-2 bg-white rounded border font-mono text-xs">{{
                        faStore.inputRegex
                      }}</code>
                    </div>
                    <div>
                      <p class="font-medium">DFA 状态数: {{ dfaStates.length }}</p>
                      <p>转换数: {{ totalTransitions }}</p>
                    </div>
                    <div>
                      <p class="font-medium">字母表: {{ alphabetSymbols.join(', ') }}</p>
                    </div>
                  </div>
                  <ul class="mt-3 space-y-1">
                    <li>• 根据第三步的转换表构造 DFA</li>
                    <li>• 确保每个状态都有明确的转换</li>
                    <li>• 标记初始状态和接受状态</li>
                    <li>• 验证 DFA 的确定性</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 下方：答案区域 -->
        <div class="answer-area">
          <div class="bg-white border border-gray-200 rounded-lg">
            <!-- 答案区域头部 -->
            <div class="border-b border-gray-200 p-4">
              <div class="flex items-center justify-between">
                <h3 class="font-semibold text-gray-900">标准答案</h3>
                <div class="flex items-center gap-2">
                  <button
                    @click="toggleAnswer"
                    class="px-4 py-2 rounded-lg transition-colors bg-blue-600 text-white hover:bg-blue-700"
                  >
                    <Icon
                      :icon="showAnswer ? 'lucide:eye-off' : 'lucide:eye'"
                      class="w-4 h-4 inline mr-2"
                    />
                    {{ showAnswer ? '隐藏答案' : '查看答案' }}
                  </button>
                </div>
              </div>
            </div>

            <!-- 答案内容 -->
            <div class="h-80 p-4">
              <div v-if="!showAnswer" class="h-full flex items-center justify-center">
                <div class="text-center text-gray-500">
                  <Icon icon="lucide:lock" class="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p class="text-lg font-medium">答案已隐藏</p>
                  <p class="text-sm mt-1">完成你的绘制后点击"查看答案"查看标准答案</p>
                </div>
              </div>

              <div v-else class="h-full overflow-auto">
                <div class="space-y-6">
                  <!-- SVG 渲染的答案 -->
                  <div v-if="faStore.dfaDotString" class="answer-svg">
                    <h4 class="font-medium text-gray-800 mb-3">DFA 图形（标准答案）</h4>
                    <div
                      ref="answerSvgContainer"
                      class="h-64 w-full flex items-center justify-center bg-gray-50 rounded border"
                    >
                      <!-- SVG 内容将通过 JavaScript 渲染到这里 -->
                    </div>
                  </div>
                </div>

                <div
                  v-if="!faStore.dfaDotString"
                  class="h-full flex items-center justify-center text-gray-500"
                >
                  <div class="text-center">
                    <Icon icon="lucide:alert-circle" class="w-8 h-8 mx-auto mb-2" />
                    <p>暂无答案数据</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- DOT 字符串显示 -->
            <div
              v-if="showAnswer && faStore.dfaDotString"
              class="border-t border-gray-200 bg-green-50 p-4"
            >
              <div class="flex items-start gap-3">
                <Icon
                  icon="lucide:check-circle"
                  class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
                />
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <h4 class="font-medium text-green-800">DFA 构造分析</h4>
                    <div class="flex items-center gap-2">
                      <button
                        @click="showDotString = !showDotString"
                        class="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                      >
                        <Icon icon="lucide:code" class="w-3 h-3 inline mr-1" />
                        {{ showDotString ? '隐藏' : '显示' }} DOT
                      </button>
                      <button
                        v-if="showDotString"
                        @click="copyDotString"
                        class="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                      >
                        <Icon icon="lucide:copy" class="w-3 h-3 inline mr-1" />
                        复制
                      </button>
                    </div>
                  </div>
                  <div class="text-sm text-green-700 mt-2 space-y-1">
                    <p>
                      • 正则表达式:
                      <code class="font-mono bg-white px-1 rounded">{{ faStore.inputRegex }}</code>
                    </p>
                    <p>• DFA 构造完成</p>
                    <p>• 使用子集构造法生成</p>
                    <p>• 可进行下一步 DFA 最小化</p>
                  </div>
                  <!-- DOT 字符串显示 -->
                  <div
                    v-if="showDotString"
                    class="mt-3 bg-white border border-green-200 rounded p-3"
                  >
                    <pre class="text-xs font-mono overflow-auto max-h-32">{{
                      faStore.dfaDotString
                    }}</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="step-actions">
      <div class="flex justify-between items-center">
        <button
          @click="$emit('prev-step')"
          class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Icon icon="lucide:chevron-left" class="w-4 h-4 inline mr-2" />
          上一步
        </button>
        <div class="text-sm text-gray-500">步骤 4 / 6</div>
        <button
          @click="proceedToNext"
          :disabled="!isComplete"
          :class="[
            'px-6 py-2 rounded-lg transition-colors',
            isComplete
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed',
          ]"
          :title="!isComplete ? '请先查看标准答案后继续' : ''"
        >
          下一步
          <Icon icon="lucide:chevron-right" class="w-4 h-4 inline ml-2" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { Icon } from '@iconify/vue'
import FACanvas from '@/components/flow/canvas/FACanvas.vue'
import { useFAStore } from '@/stores'
import { instance } from '@viz-js/viz'
import { TransitionTable } from '@/components/fa'

// 转换表数据结构 - 按列组织（每个输入符号对应一列）
interface ConversionTableData {
  [inputSymbol: string]: string[] // 每个输入符号对应一列数据
}

const emit = defineEmits<{
  'next-step': []
  'prev-step': []
  complete: [data: any]
}>()

// 使用 FA Store
const faStore = useFAStore()

// 本地状态
const dfaStates = ref<string[]>([])
const alphabetSymbols = ref<string[]>([])
const totalTransitions = ref(0)
const conversionTable = ref<ConversionTableData>({}) // 转换表：列布局
const conversionTableColumns = ref<string[]>([]) // 转换表列标题 ['I', 'Ia', 'Ib']
const matrixStateColumns = ref<string[]>([]) // 矩阵状态列 ['S', 'a', 'b']
const answerTransitionMatrix = ref<Record<string, Record<string, any>>>({}) // 标准答案的状态转换矩阵

// 终态位置列表（从转换表中提取的含Y单元格的位置）
const finalStatePositions = ref<Array<{row: number, col: string}>>([])

// 状态管理
const showDotString = ref(false)
const showAnswer = ref(false) // 默认隐藏答案
const hasRenderedAnswer = ref(false) // 记录是否已经渲染过答案

// DFA 画布引用
const dfaCanvasRef = ref<InstanceType<typeof FACanvas>>()
const answerSvgContainer = ref<HTMLElement>()

// 计算属性
const isComplete = computed(() => {
  // 检查用户是否已经查看过答案
  return hasRenderedAnswer.value
})



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

// 从localStorage获取数据
onMounted(() => {
  if (!faStore.hasResult()) {
    console.warn('No FA data found, please complete step 1 first')
    return
  }

  try {
    // 直接使用 store 中的数据
    const faResult = faStore.originalData
    if (faResult) {
      console.log('Step 4 loaded data from store')
      console.log('DFA DOT string:', faStore.dfaDotString)

      // 从后端数据中提取字母表符号
      extractAlphabetFromFAData(faResult)

      // 构建转换表（从 table 数据）
      buildConversionTable()

      // 构建状态转换矩阵（从 table_to_num 数据）
      buildAnswerTransitionMatrix()

      // 设置DFA状态
      if (faResult.table_to_num) {
        const allStates = Object.keys(faResult.table_to_num)
        const sKeys = allStates.filter((x) => x === 'S')
        const nonSKeys = allStates.filter((x) => x !== 'S').sort()
        dfaStates.value = [...sKeys, ...nonSKeys]
      }

      // 计算转换数量
      totalTransitions.value = conversionTableColumns.value.reduce((total, column) => {
        if (column !== 'I') {
          const columnData = conversionTable.value[column] || []
          return total + columnData.filter((cell) => cell && cell !== '-').length
        }
        return total
      }, 0)

      // 提取终态位置列表
      extractFinalStatePositions(conversionTable.value)
    }
  } catch (error) {
    console.error('处理FA数据失败：', error)
  }
})

// 从FA数据中提取字母表符号
const extractAlphabetFromFAData = (data: any) => {
  const symbols = new Set<string>()

  // 从转换表中提取符号
  if (data.table) {
    Object.keys(data.table).forEach((symbol) => {
      if (symbol !== 'I' && symbol !== 'ε' && symbol !== 'epsilon') {
        symbols.add(symbol)
      }
    })
  }

  alphabetSymbols.value = Array.from(symbols).sort()
}

// 从后端数据构建标准答案的状态转换矩阵
const buildAnswerTransitionMatrix = () => {
  if (!faStore.hasResult() || !faStore.originalData?.table_to_num) return

  console.log(
    'Building answer transition matrix from backend data:',
    faStore.originalData.table_to_num,
  )

  const tableToNum = faStore.originalData.table_to_num

  // 获取所有状态名，按照旧前端的逻辑排序：先取'S'状态，然后其他状态排序
  const allStates = Object.keys(tableToNum)
  const sKeys = allStates.filter((x) => x === 'S')
  const nonSKeys = allStates.filter((x) => x !== 'S').sort()
  const stateKeys = [...sKeys, ...nonSKeys]

  // 设置矩阵状态列
  matrixStateColumns.value = stateKeys
  console.log('Matrix state columns:', matrixStateColumns.value)

  // 构建矩阵 - 使用与03相同的数据结构
  const result: any = {}

  // 获取最大行数（数组长度）
  const maxRows = Math.max(
    ...stateKeys.map((state) => {
      const stateData = tableToNum[state]
      return Array.isArray(stateData) ? stateData.length : 0
    })
  )
  console.log('Max rows:', maxRows)

  // 为每一行创建数据
  for (let rowIndex = 0; rowIndex < maxRows; rowIndex++) {
    const rowKey = rowIndex.toString()
    result[rowKey] = {}

    stateKeys.forEach((state) => {
      const stateData = tableToNum[state]
      if (stateData && Array.isArray(stateData) && stateData[rowIndex]) {
        result[rowKey][state] = stateData[rowIndex]
        console.log(`Matrix ${rowKey}-${state}:`, result[rowKey][state])
      } else {
        result[rowKey][state] = '-'
        console.log(`Matrix ${rowKey}-${state}: -`)
      }
    })
  }

  console.log('Built matrix:', result)
  answerTransitionMatrix.value = result
}

// 数据处理函数 - 转换表数据处理（列布局）
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

// 从后端数据构建转换表
const buildConversionTable = () => {
  if (!faStore.hasResult() || !faStore.originalData?.table) return

  console.log('Building conversion table from backend data:', faStore.originalData.table)

  const table = faStore.originalData.table

  // 使用与03相同的符号提取逻辑
  const symbols = new Set<string>()

  // 从转换表中提取符号
  Object.keys(table).forEach((symbol) => {
    if (symbol !== 'I' && symbol !== 'ε' && symbol !== 'epsilon') {
      // 从 Ia, Ib 中提取 a, b
      const extractedSymbol = symbol.replace('I', '')
      symbols.add(extractedSymbol)
    }
  })

  const symbolArray = Array.from(symbols).sort()
  console.log('提取的符号:', symbolArray)

  // 设置列标题
  conversionTableColumns.value = ['I', ...symbolArray.map((s) => `I${s}`)]

  // 使用与第3步相同的数据处理逻辑
  conversionTable.value = processTableDataToColumns(table, symbolArray)

  console.log('Built conversion table:', conversionTable.value)
  console.log('Conversion table columns:', conversionTableColumns.value)
}

// 切换答案显示/隐藏 - 采用06的正确方式
const toggleAnswer = async () => {
  console.log('Toggling answer display')

  // 如果是要显示答案
  if (!showAnswer.value) {
    console.log('Showing answer...')

    // 重新从后端数据构建转换表和矩阵（如果还没有构建过）
    if (faStore.hasResult() && conversionTableColumns.value.length === 0) {
      buildConversionTable()
      buildAnswerTransitionMatrix()
    }

    // 切换显示状态
    showAnswer.value = true

    // 渲染SVG（每次显示都重新渲染）
    if (faStore.dfaDotString) {
      await nextTick()
      console.log('Rendering SVG...')
      await renderDotToSvg()
      hasRenderedAnswer.value = true // 标记已经渲染过（用于完成状态判断）
    }
  } else {
    // 隐藏答案
    showAnswer.value = false
    console.log('Answer visibility toggled to:', showAnswer.value)
  }
}

// 渲染DOT字符串为SVG - 简化版本，参考06的实现
const renderDotToSvg = async () => {
  if (!answerSvgContainer.value || !faStore.dfaDotString) {
    console.warn('renderDotToSvg: 缺少必要条件')
    return
  }

  try {
    console.log('开始渲染DFA DOT...')

    // 清空容器
    answerSvgContainer.value.innerHTML = ''

    // 使用 viz.js 渲染 DOT 字符串
    const viz = await instance()
    const svg = viz.renderSVGElement(faStore.dfaDotString)

    // 添加样式使 SVG 适应容器
    svg.style.maxWidth = '100%'
    svg.style.maxHeight = '100%'
    svg.style.height = 'auto'
    svg.style.width = 'auto'

    // 将 SVG 添加到容器
    answerSvgContainer.value.appendChild(svg)

    console.log('DFA DOT rendered successfully')
  } catch (error) {
    console.error('渲染DOT图失败：', error)
    const errorMessage = error instanceof Error ? error.message : String(error)

    if (answerSvgContainer.value) {
      answerSvgContainer.value.innerHTML = `
        <div class="flex items-center justify-center h-full text-red-500">
          <div class="text-center">
            <Icon icon="lucide:alert-circle" class="w-8 h-8 mx-auto mb-2" />
            <p>渲染失败</p>
            <p class="text-sm mt-1">${errorMessage}</p>
          </div>
        </div>
      `
    }
  }
}

// 复制DOT字符串
const copyDotString = async () => {
  try {
    await navigator.clipboard.writeText(faStore.dfaDotString || '')
    // 这里可以添加一个提示
    console.log('DOT字符串已复制')
  } catch (error) {
    console.error('复制失败：', error)
  }
}

// 进入下一步
const proceedToNext = () => {
  if (isComplete.value) {
    const stepData = {
      dfaStates: dfaStates.value,
      dfaDotString: faStore.dfaDotString,
      timestamp: new Date().toISOString(),
    }

    // 保存数据
    localStorage.setItem('fa-step4-data', JSON.stringify(stepData))

    // 触发下一步事件
    emit('next-step')
  }
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
  background: #fed7aa;
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
