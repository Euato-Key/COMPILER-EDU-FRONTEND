<template>
  <div class="string-analysis-step" :style="animationSpeedStyle">
    <div class="step-header">
      <div class="flex items-center gap-4">
        <div class="step-icon">
          <Icon icon="lucide:play-circle" class="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-900">字符串分析</h2>
          <p class="text-gray-600 mt-1">第四步：使用LL1分析表分析输入字符串</p>
        </div>
      </div>
    </div>

    <div class="step-content">
      <div class="max-w-6xl mx-auto">
        <!-- 当前文法分析结果 -->
        <GrammarAnalysisResult v-if="originalData" :data="originalData" class="mb-6" />

        <!-- 输入串分析区域 -->
        <StringInputSection
          v-if="originalData"
          v-model="inputString"
          :analyzing="analyzing"
          :example-strings="exampleStrings"
          @analyze="analyzeString"
          @reset="resetAnalysis"
        />

        <!-- LL1分析表和答题区域 -->
        <div
          v-if="originalData?.table && inputString && inputAnalysisResult"
          class="grid grid-cols-1 lg:grid-cols-5 gap-8"
        >
          <!-- 左侧：LL1分析表 -->
          <div class="lg:col-span-3">
            <StringAnalysisTable
              :non-terminals="originalData.Vn"
              :terminals="VtAll"
              :table="originalData.table"
              :is-analysis-complete="isAnalysisComplete"
              :hint-active="hintActive"
              :hint-row="hintRow"
              :hint-col="hintCol"
              @cell-dblclick="onLL1CellDblClick"
            />
          </div>

          <!-- 右侧：答题区域 -->
          <div class="lg:col-span-2">
            <AnalysisStepTable
              :steps="userSteps"
              :hint-active="hintActive"
              :hint-type="hintType"
            >
              <template #controls>
                <AnalysisAnimationSpeed
                  :speed="animationSpeed"
                  @increase="increaseAnimationSpeed"
                  @decrease="decreaseAnimationSpeed"
                  @reset="resetAnimationSpeed"
                />
                <AnalysisControls
                  :undo-disabled="userSteps.length <= 1"
                  :show-answer="showAnswer"
                  @match="onMatch"
                  @undo="onUndo"
                  @toggle-answer="onShowAnswer"
                  @redo="onResetUserSteps"
                  @hint="onHint"
                  @validate="onValidate"
                />
              </template>
            </AnalysisStepTable>
          </div>
        </div>
      </div>
    </div>

    <!-- 标准答案分析表 -->
    <StandardAnswerSection
      v-if="inputAnalysisResult && showAnswer"
      :result="inputAnalysisResult"
    />

    <div v-if="isStepComplete" class="mt-8">
      <CompilerAnalyzer algorithm="LL1" />
    </div>

    <div class="step-actions">
      <div class="flex justify-between items-center">
        <button
          @click="$emit('prev-step')"
          class="px-6 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-300 text-gray-700 rounded-xl hover:from-gray-100 hover:to-gray-200 hover:border-gray-400 transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-md flex items-center gap-2 font-semibold"
        >
          <Icon icon="lucide:chevron-left" class="w-5 h-5" />
          上一步
        </button>
        <div class="text-sm text-gray-500 font-medium">步骤 4 / 4</div>
        <button
          @click="complete"
          class="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-md flex items-center gap-2 font-semibold"
        >
          完成
          <Icon icon="lucide:check" class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- 动画提示弹窗 -->
    <AnimationHintModal
      :visible="hintModalVisible"
      :type="hintModalConfig.type"
      :title="hintModalConfig.title"
      :message="hintModalConfig.message"
      :details="hintModalConfig.details"
      :action="hintModalConfig.action"
      :duration="hintModalConfig.duration"
      :position="hintModalConfig.position"
      @close="closeHintModal"
    />

    <!-- 消息提示 -->
    <transition name="fade">
      <div
        v-if="message"
        class="fixed bottom-8 right-8 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2"
        :class="messageType === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'"
      >
        <Icon
          :icon="messageType === 'success' ? 'lucide:check-circle' : 'lucide:alert-circle'"
          class="w-5 h-5"
        />
        <span>{{ message }}</span>
      </div>
    </transition>

    <!-- 飞行动画元素 -->
    <div
      v-for="flyingSymbol in flyingSymbols"
      :key="`${flyingSymbol.symbol}-${flyingSymbol.target}`"
      class="fixed z-50 pointer-events-none"
      :style="{
        left: flyingSymbol.x + 'px',
        top: flyingSymbol.y + 'px',
        transform: 'translate(-50%, -50%)',
      }"
    >
      <div
        class="bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-mono shadow-lg border border-orange-600"
      >
        {{ flyingSymbol.symbol }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { Icon } from '@iconify/vue'
import CompilerAnalyzer from '@/animation/components/CompilerAnalyzer.vue'
import AnimationHintModal from '@/components/shared/AnimationHintModal.vue'

// 导入提取的组件
import GrammarAnalysisResult from '../components/GrammarAnalysisResult.vue'
import StringInputSection from '../components/StringInputSection.vue'
import StringAnalysisTable from '../components/StringAnalysisTable.vue'
import AnalysisStepTable from '../components/AnalysisStepTable.vue'
import AnalysisControls from '../components/AnalysisControls.vue'
import AnalysisAnimationSpeed from '../components/AnalysisAnimationSpeed.vue'
import StandardAnswerSection from '../components/StandardAnswerSection.vue'

// 导入提取的工具函数
import {
  initAnalysisSteps,
  performDeduction,
  performMatch,
  getAnalysisHint,
  validateUserAnalysis
} from '../utils/string-analysis'

// 组件事件
const emit = defineEmits<{ 'next-step': []; 'prev-step': []; complete: [data: any] }>()

// 获取 Store 实例
import { useLL1Store, useCommonStore } from '@/stores'
const ll1Store = useLL1Store()
const commonStore = useCommonStore()

// 从 Store 获取数据
const { originalData, inputString, inputAnalysisResult } = storeToRefs(ll1Store)
const { loading } = storeToRefs(commonStore)

// 本地状态
const analyzing = computed(() => loading.value)
const isStepComplete = computed(() => inputAnalysisResult.value !== null)

// 示例字符串
const exampleStrings = ['ab', 'i', 'i+i', 'i*i', 'c', 'bc', 'abc']

// 答题相关状态
const userSteps = ref<{ stack: string; input: string }[]>([])

// 监听并在变化时存入 store
watch(userSteps, () => {
  ll1Store.saveStep4Data(userSteps.value)
}, { deep: true })
const showAnswer = ref(false)
const hintActive = ref(false)
const hintRow = ref('')
const hintCol = ref('')
const hintType = ref<'ll1' | 'match' | ''>('')
const message = ref<string | null>(null)
const messageType = ref<'success' | 'error'>('success')
let messageTimer: number | null = null

// 动画提示弹窗状态
const hintModalVisible = ref(false)
const hintModalConfig = ref({
  type: 'hint' as 'success' | 'error' | 'warning' | 'info' | 'hint',
  title: '',
  message: '',
  details: '',
  action: '',
  duration: 3000,
  position: 'top-right' as 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center'
})

// 动画速度控制
const animationSpeed = ref(1.0)

// 飞行动画状态
const flyingSymbols = ref<
  Array<{
    symbol: string
    target: string
    x: number
    y: number
  }>
>([])

// 计算属性
const VtAll = computed(() => {
  const vt = originalData.value?.Vt || []
  return [...vt, '#']
})

const animationSpeedStyle = computed(() => ({
  '--animation-speed': animationSpeed.value
}))

const isAnalysisComplete = computed(() => {
  if (userSteps.value.length === 0) return false
  const last = userSteps.value[userSteps.value.length - 1]
  return last.stack === '#' && last.input === '#'
})

// 初始化用户答题步骤（需要在 watch 之前定义）
const handleInitUserSteps = () => {
  showAnswer.value = false
  
  if (ll1Store.step4Data && ll1Store.step4Data.userSteps.length > 0) {
    userSteps.value = JSON.parse(JSON.stringify(ll1Store.step4Data.userSteps))
    return
  }

  if (originalData.value && inputString.value && inputAnalysisResult.value) {
    const startSymbol = originalData.value.Vn[0] || ''
    const initialInput = inputAnalysisResult.value.info_str[0] || ''
    userSteps.value = initAnalysisSteps(startSymbol, initialInput)
  } else {
    userSteps.value = []
  }
}

// 监听分析完成状态
watch(isAnalysisComplete, (newValue) => {
  if (newValue) {
    setTimeout(() => {
      showHintModal(
        'success',
        'LL1分析完成！',
        '恭喜！您已成功完成LL1语法分析！',
        '所有步骤都已正确执行，输入串被成功分析。您可以查看标准答案对比分析过程，或继续学习其他内容。',
        '分析过程完成',
        5000,
        'center'
      )
    }, 500)
  }
})

// 监听分析结果变化
watch(
  inputAnalysisResult,
  (newResult) => {
    if (newResult && inputString.value) {
      handleInitUserSteps()
    }
  },
  { immediate: true },
)

// 分析字符串
const analyzeString = async () => {
  if (!inputString.value?.trim()) {
    commonStore.setError('请输入要分析的字符串')
    return
  }

  try {
    const success = await ll1Store.analyzeInputString()
    if (success) {
      handleInitUserSteps()
    }
  } catch (error) {
    console.error('分析失败:', error)
    commonStore.setError('分析过程中发生错误')
  }
}

// 重置分析
const resetAnalysis = () => {
  ll1Store.setInputString('')
  commonStore.clearError()
  userSteps.value = []
  showAnswer.value = false
  hintActive.value = false
  hintRow.value = ''
  hintCol.value = ''
  hintType.value = ''
  flyingSymbols.value = []
}

// LL1表双击
const onLL1CellDblClick = (row: string, col: string) => {
  if (hintActive.value) {
    hintActive.value = false
    hintRow.value = ''
    hintCol.value = ''
    hintType.value = ''
  }
  
  const prod = originalData.value?.table?.[row + '|' + col]
  if (!prod) return
  
  const last = userSteps.value[userSteps.value.length - 1]
  if (!last) return

  if (last.stack === '#' && last.input === '#') {
    showMessage('分析已完成！', 'success')
    return
  }

  try {
    const newStack = performDeduction(last.stack, row, prod)
    userSteps.value.push({ stack: newStack, input: last.input })

    showHintModal(
      'success',
      '推导成功',
      `成功使用产生式 "${row}->${prod}" 进行推导。`,
      `栈顶符号 "${row}" 被替换为 "${prod}"，分析继续进行。`,
      '推导操作完成',
      2500,
      'center'
    )

    if (newStack === '#' && last.input === '#') {
      showMessage('分析完成！', 'success')
    }
    
    // 每次动作成功都保存一次进度
    ll1Store.saveToHistory()
  } catch (error: any) {
    showHintModal(
      'error',
      '操作错误',
      error.message,
      '请先处理栈顶符号，或使用提示功能获取正确的操作指导。',
      '请检查栈顶符号',
      3000,
      'center'
    )
  }
}

// 匹配按钮
const onMatch = () => {
  const last = userSteps.value[userSteps.value.length - 1]
  if (!last) return

  if (last.stack === '#' && last.input === '#') {
    showMessage('分析已完成！', 'success')
    return
  }

  const result = performMatch(last.stack, last.input)
  if (result) {
    userSteps.value.push(result)

    const stackArr = last.stack.split('')
    const top = stackArr[stackArr.length - 1]
    const cur = last.input[0]

    showHintModal(
      'success',
      '匹配成功',
      `成功匹配栈顶符号 "${top}" 与输入串首字符 "${cur}"。`,
      '栈顶符号被弹出，输入串首字符被消耗，分析继续进行。',
      '匹配操作完成',
      2500,
      'center'
    )

    if (result.stack === '#' && result.input === '#') {
      showMessage('分析完成！', 'success')
    }
    
    // 每次动作成功都保存一次进度
    ll1Store.saveToHistory()
  } else {
    const stackArr = last.stack.split('')
    const top = stackArr[stackArr.length - 1]
    const cur = last.input[0]
    
    showHintModal(
      'error',
      '匹配失败',
      `栈顶符号 "${top}" 与输入串首字符 "${cur}" 不匹配。`,
      '请检查当前状态，或使用提示功能获取正确的操作指导。',
      '请检查符号匹配',
      3000,
      'center'
    )
  }
}

// 回退按钮
const onUndo = () => {
  if (userSteps.value.length > 1) {
    userSteps.value.pop()
    showHintModal('info', '操作回退', '已回退到上一步操作。', '您可以重新执行正确的操作。', '回退操作完成', 2000, 'center')
    // 回退也保存一次
    ll1Store.saveToHistory()
  } else {
    showHintModal('warning', '无法回退', '当前已是第一步，无法继续回退。', '请继续进行分析操作。', '无法回退', 2000, 'center')
  }
}

// 查看答案
const onShowAnswer = () => {
  showAnswer.value = !showAnswer.value
}

// 重做
const onResetUserSteps = () => {
  // 直接重置为初始状态，不从 store 读取
  if (originalData.value && inputString.value && inputAnalysisResult.value) {
    const startSymbol = originalData.value.Vn[0] || ''
    const initialInput = inputAnalysisResult.value.info_str[0] || ''
    userSteps.value = initAnalysisSteps(startSymbol, initialInput)
  }
  
  hintActive.value = false
  hintRow.value = ''
  hintCol.value = ''
  hintType.value = ''
  flyingSymbols.value = []
  showHintModal('info', '重新开始', '已重置分析步骤，重新开始分析。', '您可以重新执行LL1分析过程。', '重置操作完成', 2000, 'center')
}

// 提示按钮
const onHint = async () => {
  const last = userSteps.value[userSteps.value.length - 1]
  if (!last || !originalData.value) return

  const hint = getAnalysisHint(last.stack, last.input, originalData.value.table)
  
  if (hint.type === 'complete') {
    showMessage('分析已完成！', 'success')
    return
  }

  if (hint.type === 'match') {
    const { symbol } = hint.data
    const cur = last.input[0]
    hintActive.value = true
    hintType.value = 'match'

    showHintModal(
      'hint',
      '匹配操作提示',
      `当前栈顶符号 "${symbol}" 与输入串首字符 "${cur}" 相同，可以进行匹配操作。`,
      '匹配操作会将栈顶符号弹出，同时消耗输入串的首字符，这是LL1分析中的基本操作之一。',
      '点击"匹配"按钮执行操作',
      4000,
      'bottom-left'
    )

    await executeMatchFlyingAnimation(symbol, cur)

    setTimeout(() => {
      onMatch()
      hintActive.value = false
      hintType.value = ''
    }, 1200 / animationSpeed.value)
    return
  }

  if (hint.type === 'll1') {
    const { row, col, production } = hint.data
    hintActive.value = true
    hintRow.value = row
    hintCol.value = col
    hintType.value = 'll1'

    showHintModal(
      'hint',
      'LL1推导提示',
      `当前栈顶符号 "${row}" 是非终结符，输入串首字符是 "${col}"。`,
      `根据LL1分析表，应该使用产生式 "${row}->${production}" 进行推导。双击表格中对应的单元格执行推导操作。`,
      '双击表格单元格执行推导',
      4000,
      'bottom-left'
    )

    await executeLL1FlyingAnimation(row, col, production)

    setTimeout(() => {
      onLL1CellDblClick(row, col)
      hintActive.value = false
      hintRow.value = ''
      hintCol.value = ''
      hintType.value = ''
    }, 1200 / animationSpeed.value)
    return
  }

  if (hint.type === 'error') {
    const top = last.stack[last.stack.length - 1]
    const cur = last.input[0]
    showHintModal(
      'warning',
      '无法找到操作',
      `当前栈顶符号 "${top}" 与输入串首字符 "${cur}" 无法匹配，且LL1分析表中没有对应的产生式。`,
      '请检查您的分析步骤是否正确，或者查看标准答案了解正确的分析过程。',
      '请检查分析步骤',
      4000,
      'center'
    )
  }
}
// 验证按钮
const onValidate = () => {
  if (!inputAnalysisResult.value) {
    showHintModal('warning', '无法验证', '未获取到标准答案分析结果，请稍后再试。', '', '检查数据', 3000, 'center')
    return
  }

  const result = validateUserAnalysis(userSteps.value, inputAnalysisResult.value)
  
  if (result.valid) {
    if (result.message.includes('未完成')) {
      showHintModal('info', '验证通过', result.message, '请继续执行后续步骤。', '继续分析', 3000, 'center')
    } else {
      showHintModal('success', '验证通过', result.message, '恭喜你，所有步骤都正确！', '太棒了', 3000, 'center')
    }
  } else {
    showHintModal('error', '验证失败', result.message, '请检查该步骤的操作是否符合LL1文法规则。', '检查错误', 4000, 'center')
  }
}

// 执行匹配飞行动画 (DOM 操作保留在主组件)
const executeMatchFlyingAnimation = async (symbol: string, target: string) => {
  const symbolElement = document.querySelector(`[data-symbol="${symbol}"]`) as HTMLElement
  const stackElement = document.querySelector('.user-steps-table tbody tr:last-child td:nth-child(2)') as HTMLElement
  const inputElement = document.querySelector('.user-steps-table tbody tr:last-child td:nth-child(3)') as HTMLElement

  if (!symbolElement || !stackElement || !inputElement) return

  const symbolRect = symbolElement.getBoundingClientRect()
  const stackRect = stackElement.getBoundingClientRect()
  const inputRect = inputElement.getBoundingClientRect()

  flyingSymbols.value.push({
    symbol: symbol,
    target: 'stack',
    x: symbolRect.left + symbolRect.width / 2,
    y: symbolRect.top + symbolRect.height / 2,
  })

  await new Promise((resolve) => setTimeout(resolve, 100))

  const flyingSymbolData = flyingSymbols.value.find(fs => fs.symbol === symbol && fs.target === 'stack')
  if (flyingSymbolData) {
    flyingSymbolData.x = stackRect.left + stackRect.width / 2
    flyingSymbolData.y = stackRect.top + stackRect.height / 2
  }

  await new Promise((resolve) => setTimeout(resolve, 1500 / animationSpeed.value))
  flyingSymbols.value = flyingSymbols.value.filter(fs => !(fs.symbol === symbol && fs.target === 'stack'))

  flyingSymbols.value.push({
    symbol: target,
    target: 'input',
    x: inputRect.left + inputRect.width / 2,
    y: inputRect.top + inputRect.height / 2,
  })

  await new Promise((resolve) => setTimeout(resolve, 100 / animationSpeed.value))

  const flyingSymbolData2 = flyingSymbols.value.find(fs => fs.symbol === target && fs.target === 'input')
  if (flyingSymbolData2) {
    flyingSymbolData2.x = inputRect.left + inputRect.width / 2
    flyingSymbolData2.y = -100
  }

  await new Promise((resolve) => setTimeout(resolve, 1000 / animationSpeed.value))
  flyingSymbols.value = flyingSymbols.value.filter(fs => !(fs.symbol === target && fs.target === 'input'))
}

// 执行LL1推导飞行动画
const executeLL1FlyingAnimation = async (nonTerminal: string, terminal: string, production: string) => {
  const tableCellElement = document.querySelector(`[data-table-cell="${nonTerminal}|${terminal}"]`) as HTMLElement
  const stackElement = document.querySelector('.user-steps-table tbody tr:last-child td:nth-child(2)') as HTMLElement

  if (!tableCellElement || !stackElement) return

  const tableCellRect = tableCellElement.getBoundingClientRect()
  const stackRect = stackElement.getBoundingClientRect()

  flyingSymbols.value.push({
    symbol: production,
    target: 'stack',
    x: tableCellRect.left + tableCellRect.width / 2,
    y: tableCellRect.top + tableCellRect.height / 2,
  })

  await new Promise((resolve) => setTimeout(resolve, 100 / animationSpeed.value))

  const flyingSymbolData = flyingSymbols.value.find(fs => fs.symbol === production && fs.target === 'stack')
  if (flyingSymbolData) {
    flyingSymbolData.x = stackRect.left + stackRect.width / 2
    flyingSymbolData.y = stackRect.top + stackRect.height / 2
  }

  await new Promise((resolve) => setTimeout(resolve, 1500 / animationSpeed.value))
  flyingSymbols.value = flyingSymbols.value.filter(fs => !(fs.symbol === production && fs.target === 'stack'))
}

const showHintModal = (
  type: 'success' | 'error' | 'warning' | 'info' | 'hint',
  title: string,
  message: string,
  details?: string,
  action?: string,
  duration = 3000,
  position = 'top-right' as 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center'
) => {
  hintModalConfig.value = { type, title, message, details: details || '', action: action || '', duration, position }
  hintModalVisible.value = true
}

const closeHintModal = () => { hintModalVisible.value = false }

const increaseAnimationSpeed = () => { if (animationSpeed.value < 2.0) animationSpeed.value = Math.min(2.0, animationSpeed.value + 0.25) }
const decreaseAnimationSpeed = () => { if (animationSpeed.value > 0.25) animationSpeed.value = Math.max(0.25, animationSpeed.value - 0.25) }
const resetAnimationSpeed = () => { animationSpeed.value = 1.0 }

const showMessage = (msg: string, type: 'success' | 'error' = 'success') => {
  message.value = msg
  messageType.value = type
  if (messageTimer) clearTimeout(messageTimer)
  messageTimer = window.setTimeout(() => { message.value = null }, 2000)
}

const complete = () => {
  const data = {
    inputString: inputString.value,
    analysisResult: inputAnalysisResult.value,
    success: inputAnalysisResult.value?.info_res === 'Success!',
    steps: inputAnalysisResult.value?.info_step || [],
    messages: inputAnalysisResult.value?.info_msg || [],
    userSteps: userSteps.value,
  }
  window.scrollTo({ top: 0, behavior: 'smooth' })
  emit('complete', data)
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
  background: #dcfce7;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fixed {
  transition: all 1.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.fixed[style*="transition"] {
  transition-duration: calc(1.5s / var(--animation-speed, 1));
}
</style>
