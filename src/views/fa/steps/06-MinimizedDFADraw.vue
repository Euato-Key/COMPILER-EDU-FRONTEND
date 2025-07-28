<template>
  <div class="minimized-dfa-draw-step">
    <div class="step-header">
      <div class="flex items-center gap-4">
        <div class="step-icon">
          <Icon icon="lucide:check-circle-2" class="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-900">最小化 DFA 结果</h2>
          <p class="text-gray-600 mt-1">第六步：可视化绘制最小化后的 DFA</p>
        </div>
      </div>
    </div>

    <div class="step-content">
      <div class="space-y-6">
        <!-- 🟢 新增区域：最小化状态转换矩阵参考 -->
        <div class="minimized-transition-matrix-reference">
          <div class="bg-white border border-gray-200 rounded-lg">
            <div class="border-b border-gray-200 p-4">
              <h3 class="font-semibold text-gray-900 flex items-center gap-2">
                <Icon icon="lucide:table" class="w-5 h-5 text-green-600" />
                最小化状态转换矩阵（来自第五步）
              </h3>
              <p class="text-sm text-gray-600 mt-1">根据这个矩阵绘制最小化 DFA 图</p>
            </div>
            <div class="p-6">
              <!-- 矩阵显示区域 -->
              <div v-if="matrixStateColumns.length && originalStateCount > 0" class="minimized-matrix">
                <h4 class="font-medium text-gray-800 mb-3">最小化状态转换矩阵</h4>
                            <TransitionTable
              :data="{
                headers: matrixStateColumns,
                rows: matrixData
              }"
              :columns="matrixStateColumns.map(state => ({
                key: state,
                title: state,
                type: state === 'S' ? 'state' : 'transition',
                editable: false
              }))"
              :editable="false"
              :show-answer="true"
              :final-state-config="{
                isFinalState: (row, col, value) => minimizedAcceptingStates.has(String(value))
              }"
            />
              </div>

              <!-- 无数据状态 -->
              <div v-else class="text-center py-8 text-gray-500">
                <Icon icon="lucide:table-2" class="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>暂无最小化矩阵数据</p>
                <p class="text-sm mt-1">请先完成第五步的 DFA 最小化</p>
              </div>

              <!-- 🟢 新增：高亮说明 - 与第四步保持一致 -->
              <div class="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                <div class="flex items-start gap-3">
                  <Icon icon="lucide:zap" class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 class="font-medium text-green-800">高亮说明</h4>
                    <div class="text-sm text-green-700 mt-2 space-y-1">
                      <p>• <span class="font-semibold">绿色发光单元格</span>：表示终态（接受状态）</p>
                      <p>• 最小化矩阵中的终态会高亮显示</p>
                      <p>• 这些高亮状态在最小化DFA中应标记为接受状态</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 上方：最小化DFA画布区域 -->
        <div class="minimized-dfa-draw-area">
          <!-- 画图工具选择 -->
          <div class="mb-4">
            <div class="flex space-x-2">
              <button
                @click="activeCanvas = 'original'"
                :class="[
                  'px-4 py-2 rounded-lg transition-colors',
                  activeCanvas === 'original'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                ]"
              >
                <Icon icon="lucide:edit-3" class="w-4 h-4 inline mr-2" />
                原始编辑器
              </button>
              <button
                @click="activeCanvas = 'new'"
                :class="[
                  'px-4 py-2 rounded-lg transition-colors',
                  activeCanvas === 'new'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                ]"
              >
                <Icon icon="lucide:git-branch" class="w-4 h-4 inline mr-2" />
                新FA画图组件
              </button>
            </div>
          </div>

          <!-- 原始编辑器 -->
          <div v-if="activeCanvas === 'original'" class="bg-white border border-gray-200 rounded-lg">
            <div class="h-[700px] p-4">
              <FACanvas ref="minimizedDFACanvasRef" mode="dfa" title="最小化 DFA" />
            </div>
          </div>

          <!-- 新FA画图组件 -->
          <div v-if="activeCanvas === 'new'" class="bg-white border border-gray-200 rounded-lg">
            <div class="h-[700px] p-4">
              <div class="w-full h-full">
                <FA_vueflow ref="newMinimizedDFACanvasRef" FA_type="Min_DFA" />
              </div>
            </div>
          </div>

          <!-- 🟢 修改：简化的绘制提示区域 -->
          <div class="mt-4 bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <div class="flex items-start gap-3">
              <Icon icon="lucide:lightbulb" class="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 class="font-medium text-indigo-800">最小化 DFA 绘制提示</h4>
                <div class="text-sm text-indigo-700 mt-2 space-y-1">
                  <ul class="space-y-1">
                    <li>• 根据上方最小化状态转换矩阵绘制 DFA</li>
                    <li>• 确保每个状态的转换都按照矩阵中的数据进行连接</li>
                    <li>• 标记初始状态和接受状态（注意高亮的终态）</li>
                    <li>• 验证最小化 DFA 的正确性</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- 新FA画图组件使用说明 -->
            <div v-if="activeCanvas === 'new'" class="mt-4 pt-4 border-t border-indigo-200">
              <h5 class="font-medium text-indigo-800 mb-3">新FA画图工具使用说明</h5>
              <div class="text-xs text-indigo-600 space-y-1">
                <p>• 使用画布上方的工具栏按钮进行操作</p>
                <p>• 点击"添加节点"按钮或双击画布添加新状态</p>
                <p>• 选择节点后点击"设置初态"或"设置终态"</p>
                <p>• 拖拽节点边缘的连接点创建转换</p>
                <p>• 点击边上的输入框编辑转换标签</p>
                <p>• 支持自环和复杂的最小化DFA结构</p>
                <p>• 使用鼠标滚轮缩放画布，拖拽平移画布</p>
                <p>• 右下角控制面板可快速调整视图</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 下方：标准答案 -->
        <div class="answer-area">
          <div class="bg-white border border-gray-200 rounded-lg">
            <!-- 答案区域头部 -->
            <div class="border-b border-gray-200 p-4">
              <div class="flex items-center justify-between">
                <h3 class="font-semibold text-gray-900">标准答案</h3>
                <button
                  @click="toggleAnswer"
                  :class="[
                    'px-4 py-2 rounded-lg transition-colors',
                    showAnswer
                      ? 'bg-gray-600 text-white hover:bg-gray-700'
                      : 'bg-green-600 text-white hover:bg-green-700',
                  ]"
                >
                  <Icon
                    :icon="showAnswer ? 'lucide:eye-off' : 'lucide:eye'"
                    class="w-4 h-4 inline mr-2"
                  />
                  {{ showAnswer ? '隐藏答案' : '查看答案' }}
                </button>
              </div>
            </div>

            <!-- 答案内容 -->
            <div class="h-80 p-4">
              <div v-if="showAnswer" class="w-full h-full flex items-center justify-center">
                <div
                  v-if="faStore.minDfaDotString"
                  ref="answerSvgContainer"
                  class="w-full h-full overflow-auto bg-gray-50 rounded border"
                >
                  <!-- SVG 将在这里渲染 -->
                </div>
                <div v-else class="text-gray-500 text-center">
                  <Icon icon="lucide:image-off" class="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>暂无答案图像</p>
                </div>
              </div>
              <div v-else class="w-full h-full flex items-center justify-center text-gray-500">
                <div class="text-center">
                  <Icon icon="lucide:eye-off" class="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>点击"查看答案"显示最小化 DFA</p>
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
        <div class="text-sm text-gray-500">步骤 6 / 6</div>
        <button
          @click="complete"
          class="px-6 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors"
        >
          完成
          <Icon icon="lucide:check" class="w-4 h-4 inline ml-2" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { Icon } from '@iconify/vue'
import FACanvas from '@/components/flow/canvas/FACanvas.vue'
import { useFAStore } from '@/stores'
import { instance } from '@viz-js/viz'
import { TransitionTable, FA_vueflow } from '@/components/fa'

const emit = defineEmits<{
  'next-step': []
  'prev-step': []
  complete: [data: any]
}>()

// 使用 FA Store
const faStore = useFAStore()

// 本地状态
const dfaStateCount = ref(0)
const minimizedStateCount = ref(0)

// 🟢 新增：与第四步保持一致的矩阵相关状态
const originalStateCount = ref(0)
const matrixStateColumns = ref<string[]>([]) // 矩阵列标题 ['S', 'a', 'b']
const matrixData = ref<string[][]>([]) // 矩阵数据

// 🟢 新增：最小化DFA的接受状态映射
const minimizedAcceptingStates = ref<Set<string>>(new Set())

// 状态管理
const showAnswer = ref(false)

// 画布选择状态
const activeCanvas = ref<'original' | 'new'>('new')

// 最小化DFA画布引用
const minimizedDFACanvasRef = ref<InstanceType<typeof FACanvas>>()
const newMinimizedDFACanvasRef = ref<InstanceType<typeof FA_vueflow>>()
const answerSvgContainer = ref<HTMLElement>()



onMounted(() => {
  if (!faStore.hasResult()) {
    console.warn('No FA data found, please complete step 1 first')
    return
  }

  try {
    // 直接使用 store 中的数据
    const faResult = faStore.originalData
    if (faResult) {
      console.log('Step 6 loaded data from store')
      console.log('原始数据:', faResult)

      // 从后端数据中获取状态数量
      if (faResult.table_to_num) {
        dfaStateCount.value = Object.keys(faResult.table_to_num).length
      }
      if (faResult.table_to_num_min) {
        const minStates = Math.max(
          ...Object.values(faResult.table_to_num_min).map((arr: any) =>
            Array.isArray(arr) ? arr.length : 0,
          ),
        )
        minimizedStateCount.value = minStates
        originalStateCount.value = minStates
      }

      // 🟢 修改：先构建矩阵数据，再构建接受状态集合
      buildMinimizedTransitionMatrix()

      // 🟢 修改：基于最小化数据构建接受状态集合
      buildMinimizedAcceptingStatesSet(faResult)
    }
  } catch (error) {
    console.error('处理FA数据失败：', error)
  }
})

// 🟢 新增：构建最小化DFA的接受状态集合
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



// 🟢 新增：构建最小化状态转换矩阵（与第四步保持一致的结构）
const buildMinimizedTransitionMatrix = () => {
  if (!faStore.hasResult() || !faStore.originalData?.table_to_num_min) return

  console.log('Building minimized transition matrix from backend data:', faStore.originalData.table_to_num_min)

  const tableToNumMin = faStore.originalData.table_to_num_min

  // 🟢 获取所有状态标题，按照与第四步相同的逻辑排序
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



  // 构建矩阵数据（与第四步保持一致的结构）
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

// 切换答案显示
const toggleAnswer = async () => {
  showAnswer.value = !showAnswer.value

  if (showAnswer.value && faStore.minDfaDotString) {
    await nextTick()
    renderSvgAnswer()
  }
}

// 渲染SVG答案
const renderSvgAnswer = async () => {
  if (!answerSvgContainer.value || !faStore.minDfaDotString) return

  try {
    // 使用 viz.js 渲染 DOT 字符串
    const viz = await instance()

    // 渲染DOT为SVG
    const svg = viz.renderSVGElement(faStore.minDfaDotString)

    // 清空容器并添加SVG
    answerSvgContainer.value.innerHTML = ''
    if (svg) {
      answerSvgContainer.value.appendChild(svg)
    }
  } catch (error) {
    console.error('渲染SVG失败：', error)
    if (answerSvgContainer.value) {
      answerSvgContainer.value.innerHTML = `
        <div class="flex items-center justify-center h-full text-gray-500">
          <div class="text-center">
            <p>SVG 渲染失败</p>
            <p class="text-sm mt-1">请检查DOT字符串格式</p>
          </div>
        </div>
      `
    }
  }
}

// 完成整个流程
const complete = () => {
  const stepData = {
    completed: true,
    regexPattern: faStore.inputRegex,
    finalResults: {
      dfaStateCount: dfaStateCount.value,
      minimizedStateCount: minimizedStateCount.value,
    },
    timestamp: new Date().toISOString(),
  }

  // 触发完成事件
  emit('complete', stepData)
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
  background: #e0e7ff;
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
