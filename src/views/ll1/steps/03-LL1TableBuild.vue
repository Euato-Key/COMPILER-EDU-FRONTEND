<template>
  <div class="ll1-table-build-step" :style="animationSpeedStyle">
    <div class="step-header">
      <div class="flex items-center gap-4">
        <div class="step-icon">
          <Icon icon="lucide:table" class="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-900">构建LL1分析表</h2>
          <p class="text-gray-600 mt-1">第三步：根据First集和Follow集构建LL1分析表</p>
        </div>
      </div>
    </div>

    <div class="step-content">
      <div v-if="!originalData" class="max-w-4xl mx-auto text-center py-12">
        <div class="text-gray-500">
          <Icon icon="lucide:alert-circle" class="w-12 h-12 mx-auto mb-4" />
          <p class="text-lg">请先完成前面步骤的文法分析</p>
        </div>
      </div>
      <div v-else class="max-w-7xl mx-auto">
        <!-- 说明指引 -->
        <TableBuildInstruction />

        <!-- First/Follow集摘要和构建规则 -->
        <FirstFollowSummary
          :first-sets="firstSets"
          :follow-sets="followSets"
          :vn="originalData.Vn"
          :symbol-highlight-state="symbolHighlightState"
          :rule-highlight-state="ruleHighlightState"
        />

        <!-- 主要内容区域 -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          <!-- 左侧：产生式列表 -->
          <div class="lg:col-span-3">
            <ProductionList
              :formulas-dict="originalData.formulas_dict"
              :production-highlight-state="productionHighlightState"
              @drag-start="onProductionDragStart"
              @dbl-click="onProductionDblClick"
            />
          </div>

          <!-- 右侧：LL1分析表 -->
          <div class="lg:col-span-9">
            <!-- 动画速度控制 & 提示状态 -->
            <TableAnimationController
              :speed="animationSpeed"
              :hint-active="hintState.isActive"
              :current-step="hintState.currentStep"
              :total-steps="hintState.totalSteps"
              @increase-speed="increaseAnimationSpeed"
              @decrease-speed="decreaseAnimationSpeed"
              @reset-speed="resetAnimationSpeed"
            />

            <!-- LL1分析表主组件 -->
            <LL1ParsingTable
              :non-terminals="nonTerminals"
              :terminals="terminals"
              :user-table="userTable"
              :table-validation="tableValidation"
              :table-cell-highlight-state="tableCellHighlightState"
              :checking="checking"
              :hint-active="hintState.isActive"
              :table-validated="tableValidated"
              :has-errors="hasTableErrors"
              :remaining-attempts="remainingAttempts"
              :show-answer="showAnswer"
              :get-correct-entry="getCorrectEntry"
              @cell-change="validateTableCell"
              @cell-focus="clearTableValidation"
              @cell-drop="onTableDrop"
              @check="checkTable"
              @hint="executeTableHintAnimation"
              @clear="clearAllStates"
            />
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
        <div class="text-sm text-gray-500">步骤 3 / 4</div>
        <button
          @click="handleNextStep"
          :disabled="!allCompleted"
          :class="[
            'px-6 py-2 rounded-lg transition-colors flex items-center gap-2',
            allCompleted
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed',
          ]"
        >
          下一步
          <Icon icon="lucide:chevron-right" class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- 复制提示 -->
    <transition
      enter-active-class="transition-opacity duration-300"
      leave-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div v-if="copyTip" class="fixed top-8 right-8 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 bg-green-600 text-white">
        <Icon icon="lucide:copy" class="w-5 h-5" />
        <span>{{ copyTip }}</span>
      </div>
    </transition>

    <!-- 飞行动画元素 -->
    <div v-for="flyingSymbol in flyingSymbols" :key="`${flyingSymbol.symbol}-${flyingSymbol.target}`"
         class="fixed z-50 pointer-events-none"
         :style="{
           left: flyingSymbol.x + 'px',
           top: flyingSymbol.y + 'px',
           transform: 'translate(-50%, -50%)',
           transitionDuration: `calc(2s / ${animationSpeed})`
         }">
      <div class="bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-mono shadow-lg border border-orange-600">
        {{ flyingSymbol.symbol }}
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { Icon } from '@iconify/vue'
import { useLL1Store } from '@/stores'
import AnimationHintModal from '@/components/shared/AnimationHintModal.vue'

// 导入提取的组件
import TableBuildInstruction from '../components/TableBuildInstruction.vue'
import FirstFollowSummary from '../components/FirstFollowSummary.vue'
import ProductionList from '../components/ProductionList.vue'
import LL1ParsingTable from '../components/LL1ParsingTable.vue'
import TableAnimationController from '../components/TableAnimationController.vue'

// 导入提取的工具函数
import {
  calculateTableHint,
  getCorrectTableEntry,
  validateTableCell as validateCellLogic,
  calculateFirstSetForProduction
} from '../utils/ll1-table-build'

// 获取 Store 实例
const ll1Store = useLL1Store()

// 解构响应式状态
const { originalData, firstSets, followSets } = storeToRefs(ll1Store)

// 定义 emits
const emit = defineEmits<{
  'next-step': []
  'prev-step': []
  complete: [data: Record<string, unknown>]
}>()

// 计算非终结符和终结符
const nonTerminals = computed(() => originalData.value?.Vn || [])
const terminals = computed(() => {
  if (!originalData.value?.Vt) return []
  const sortedVt = [...originalData.value.Vt].sort()
  return [...sortedVt, '#']
})

// 用户输入的分析表
const userTable = ref<Record<string, string>>({})

// 监听并在变化时存入 store
let saveTimer: any = null
watch(userTable, () => {
  ll1Store.saveStep3Data(userTable.value)
  
  // 实时保存到历史记录（带防抖）
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    ll1Store.saveToHistory()
  }, 1000)
}, { deep: true })

// 校验状态
const tableValidation = ref<Record<string, 'correct' | 'incorrect' | ''>>({})
const checking = ref(false)
const tableValidated = ref(false)
const showAnswer = ref(false)
const attempts = ref(0)
const maxAttempts = 3

// 提示动画状态
const hintState = ref({
  isActive: false,
  currentStep: 0,
  totalSteps: 0
})

// 高亮状态
const productionHighlightState = ref<Record<string, boolean>>({})
const ruleHighlightState = ref<Record<string, boolean>>({})
const symbolHighlightState = ref<Record<string, boolean>>({})
const tableCellHighlightState = ref<Record<string, boolean>>({})

// 飞行动画状态
const flyingSymbols = ref<Array<{
  symbol: string,
  target: string,
  x: number,
  y: number
}>>([])

// 动画提示弹窗状态
const hintModalVisible = ref(false)
const hintModalConfig = ref({
  type: 'hint' as 'success' | 'error' | 'warning' | 'info' | 'hint',
  title: '',
  message: '',
  details: '',
  action: '',
  duration: 3000,
  position: 'bottom-left' as 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center'
})

// 动画速度控制
const animationSpeed = ref(1.0)
const animationSpeedStyle = computed(() => ({
  '--animation-speed': animationSpeed.value
}))

const hasTableErrors = computed(() => {
  return Object.values(tableValidation.value).some((status) => status === 'incorrect')
})

const remainingAttempts = computed(() => Math.max(0, maxAttempts - attempts.value))

const allCompleted = computed(() => {
  return attempts.value >= maxAttempts && showAnswer.value
})

const copyTip = ref('')
let copyTipTimer: number | null = null

// 显示动画提示弹窗
const showHintModal = (
  type: 'success' | 'error' | 'warning' | 'info' | 'hint',
  title: string,
  message: string,
  details?: string,
  action?: string,
  duration = 3000,
  position = 'bottom-left' as 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center'
) => {
  hintModalConfig.value = {
    type,
    title,
    message,
    details: details || '',
    action: action || '',
    duration,
    position
  }
  hintModalVisible.value = true
}

const closeHintModal = () => {
  hintModalVisible.value = false
}

// 动画速度控制函数
const increaseAnimationSpeed = () => {
  if (animationSpeed.value < 2.0) {
    animationSpeed.value = Math.min(2.0, animationSpeed.value + 0.25)
  }
}

const decreaseAnimationSpeed = () => {
  if (animationSpeed.value > 0.25) {
    animationSpeed.value = Math.max(0.25, animationSpeed.value - 0.25)
  }
}

const resetAnimationSpeed = () => {
  animationSpeed.value = 1.0
}

// 拖拽事件处理函数
const onProductionDragStart = (production: string, event: DragEvent) => {
  event.dataTransfer?.setData('text/plain', production)
}

// 双击产生式卡片
const onProductionDblClick = (production: string) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(production).then(() => {
      showCopyTip(`已复制：${production}`)
    })
  } else {
    const textarea = document.createElement('textarea')
    textarea.value = production
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    showCopyTip(`已复制：${production}`)
  }
}

const showCopyTip = (msg: string) => {
  copyTip.value = msg
  if (copyTipTimer) clearTimeout(copyTipTimer)
  copyTipTimer = window.setTimeout(() => {
    copyTip.value = ''
  }, 1200)
}

// 拖拽放置处理函数
const onTableDrop = (nonTerminal: string, terminal: string, production: string) => {
  const key = `${nonTerminal}|${terminal}`
  userTable.value[key] = production
  validateTableCell(nonTerminal, terminal)
}

// 工具函数包装
const getCorrectEntry = (nonTerminal: string, terminal: string): string => {
  return getCorrectTableEntry(nonTerminal, terminal, originalData.value?.table || {})
}

const clearTableValidation = (nonTerminal: string, terminal: string) => {
  const key = `${nonTerminal}|${terminal}`
  if (tableValidation.value[key] !== 'correct') {
    tableValidation.value[key] = ''
  }
}

const validateTableCell = (nonTerminal: string, terminal: string) => {
  const key = `${nonTerminal}|${terminal}`
  const userValue = userTable.value[key] || ''
  const correctValue = originalData.value?.table[key] || ''

  tableValidation.value[key] = validateCellLogic(userValue, correctValue, nonTerminal)
}

// 校验函数
const checkTable = async () => {
  if (!originalData.value?.table) return

  checking.value = true
  attempts.value++

  try {
    const tableData = originalData.value.table
    const requiredEntries = Object.keys(tableData)

    if (requiredEntries.length === 0) {
      tableValidated.value = true
      showAnswer.value = false
      return
    }

    let isAllCorrect = true

    for (const key of requiredEntries) {
      const [nt, t] = key.split('|')
      const userInput = (userTable.value[key] || '').trim()
      const correctEntry = getCorrectEntry(nt, t)

      const status = validateCellLogic(userInput, correctEntry, nt)
      tableValidation.value[key] = status
      if (status !== 'correct') {
        isAllCorrect = false

        // 生成提示信息
        let hintText = ''
        const correctProd = getCorrectEntry(nt, t)
        if (correctProd) { // 只有标准答案不为空时才去解释为什么是这个答案
           // correctProd 格式可能为 "S->aB"
           // 1. 如果是 First集规则: specific first char or non-terminal
           // 提取右部
           const parts = correctProd.split('->')
           if (parts.length === 2) {
             const rightPart = parts[1]
             // 计算该右部的 First 集
             // 注意: originalData.value 需要传递给 calculateFirstSetForProduction
             // 此时 originalData.value 结构包含 {Vn, Vt, first...}
             const firstSet = calculateFirstSetForProduction(rightPart, originalData.value as any) 
             
             if (firstSet.includes(t)) {
                hintText = `根据First集规则：\n因为终结符 ${t} ∈ First(${rightPart})，\n所以 M[${nt}, ${t}] = ${correctProd}`
             } else if (firstSet.includes('ε') && originalData.value.follow[nt]?.includes(t)) {
                hintText = `根据Follow集规则：\n因为 ε ∈ First(${rightPart}) 且 ${t} ∈ Follow(${nt})，\n所以 M[${nt}, ${t}] = ${correctProd}`
             } else {
                 // 兜底
                hintText = `M[${nt}, ${t}] 应填入 ${correctProd}`
             }
           }
        } else {
             hintText = `该单元格 M[${nt}, ${t}] 应为空（Error）`
        }

        ll1Store.addErrorLog({
            step: 'step3',
            type: 'parsingTable',
            location: { row: nt, col: t, fieldKey: key },
            wrongValue: userInput,
            correctValue: correctEntry,
            hint: hintText
        })
      }
    }

    tableValidated.value = true

    if (isAllCorrect) {
      showAnswer.value = false
      const correctEntries = Object.values(tableValidation.value).filter(v => v === 'correct').length
      const totalEntries = Object.keys(tableValidation.value).length

      showHintModal(
        'success',
        '校验成功',
        'LL1分析表校验成功！该文法是LL1文法。',
        `恭喜！您已正确构建了LL1分析表，所有产生式都按照First集和Follow集规则正确填写。\n\n正确填写项：${correctEntries}/${totalEntries}`,
        '分析表构建完成',
        5000,
        'center'
      )
    } else {
      if (attempts.value >= maxAttempts) {
        for (const key of requiredEntries) {
          userTable.value[key] = getCorrectEntry(key.split('|')[0], key.split('|')[1])
          tableValidation.value[key] = 'correct'
        }
        showAnswer.value = true
        showHintModal(
          'warning',
          '显示答案',
          '已达到最大尝试次数，已显示正确答案。',
          '请仔细对比您的答案与正确答案，理解First集和Follow集规则的应用。',
          '答案已显示',
          6000,
          'center'
        )
      } else {
        const correctEntries = Object.values(tableValidation.value).filter(v => v === 'correct').length
        showHintModal(
          'error',
          '校验失败',
          `LL1分析表校验失败，还有${remainingAttempts.value}次尝试机会。`,
          `请检查错误项目，确保按照First集和Follow集规则正确填写产生式。\n\n正确填写项：${correctEntries}/${requiredEntries.length}`,
          '请修正错误',
          5000,
          'center'
        )
      }
    }

    // 取消防抖定时器，立即保存
    if (saveTimer) {
      clearTimeout(saveTimer)
      saveTimer = null
    }
    ll1Store.saveToHistory()
  } finally {
    checking.value = false
  }
}

// 初始化
const initializeState = () => {
  if (ll1Store.step3Data) {
    userTable.value = JSON.parse(JSON.stringify(ll1Store.step3Data.userTable))
    // 同时也需要恢复校验状态（可选，或者让用户重新校验）
    return
  }

  if (originalData.value) {
    userTable.value = {}
    tableValidation.value = {}
    nonTerminals.value.forEach((nt) => {
      terminals.value.forEach((t) => {
        const key = `${nt}|${t}`
        userTable.value[key] = ''
        tableValidation.value[key] = ''
      })
    })
  }
}

watch(() => originalData.value, (newData) => {
  if (newData) initializeState()
}, { immediate: true })

onMounted(() => {
  initializeState()
})

// 清理定时器
onUnmounted(() => {
  if (saveTimer) {
    clearTimeout(saveTimer)
    saveTimer = null
  }
  if (copyTipTimer) {
    clearTimeout(copyTipTimer)
    copyTipTimer = null
  }
})

// 提示动画逻辑
const currentHintStepIndex = ref(0)

const executeTableHintAnimation = async () => {
  if (!originalData.value) return

  const hint = calculateTableHint(originalData.value)
  if (!hint || hint.steps.length === 0) return

  if (currentHintStepIndex.value >= hint.steps.length) {
    currentHintStepIndex.value = 0
  }

  hintState.value.isActive = true
  hintState.value.currentStep = currentHintStepIndex.value + 1
  hintState.value.totalSteps = hint.steps.length

  const step = hint.steps[currentHintStepIndex.value]

  // 构建提示详情
  const stepType = step.type === 'first' ? 'First集规则' : 'Follow集规则'
  const production = step.productions[0]
  const [nonTerminal, rightPart] = production.split('->')

  let setInfo = ''
  if (step.type === 'first') {
    const firstSet = calculateFirstSetForProduction(rightPart, originalData.value)
    setInfo = `First(${rightPart}) = {${firstSet.join(', ')}}`
  } else {
    const followSet = originalData.value.follow[nonTerminal] || []
    setInfo = `Follow(${nonTerminal}) = {${followSet.join(', ')}}`
  }

  const details = `当前处理产生式：${production}\n${setInfo}\n\n将在表格中填写：${step.tableEntries.map(e => `M[${e.nonTerminal}, ${e.terminal}] = ${e.production}`).join(', ')}`

  showHintModal('hint', `${stepType}提示`, step.description, details, '观察高亮区域，理解构建依据', 5000, 'bottom-left')

  // 清除和设置高亮
  const resetHighlights = () => {
    productionHighlightState.value = {}
    ruleHighlightState.value = {}
    symbolHighlightState.value = {}
    tableCellHighlightState.value = {}
  }
  resetHighlights()

  step.productions.forEach(p => productionHighlightState.value[p] = true)
  step.rules.forEach(r => ruleHighlightState.value[r] = true)
  step.symbols.forEach(s => symbolHighlightState.value[s] = true)

  await new Promise(resolve => setTimeout(resolve, 1500 / animationSpeed.value))

  // 飞行
  for (const entry of step.tableEntries) {
    tableCellHighlightState.value[`${entry.nonTerminal}|${entry.terminal}`] = true
    await executeTableFlyingAnimation(entry.nonTerminal, entry.terminal, entry.production)
    tableCellHighlightState.value[`${entry.nonTerminal}|${entry.terminal}`] = false
    await new Promise(resolve => setTimeout(resolve, 500 / animationSpeed.value))
  }

  resetHighlights()
  currentHintStepIndex.value++

  if (currentHintStepIndex.value >= hint.steps.length) {
    setTimeout(() => {
      showHintModal('success', '提示完成', '所有LL1分析表构建步骤已完成！', '您已经了解了所有产生式的First集和Follow集规则应用过程。', '提示步骤全部完成', 5000, 'center')
    }, 800)
  }

  hintState.value.isActive = false
}

const executeTableFlyingAnimation = async (nonTerminal: string, terminal: string, production: string) => {
  const productionElement = document.querySelector(`[data-production="${production}"]`) as HTMLElement
  const tableCellElement = document.querySelector(`[data-table-cell="${nonTerminal}|${terminal}"]`) as HTMLElement

  if (!productionElement || !tableCellElement) {
    userTable.value[`${nonTerminal}|${terminal}`] = production
    return
  }

  const pRect = productionElement.getBoundingClientRect()
  const cRect = tableCellElement.getBoundingClientRect()

  flyingSymbols.value.push({
    symbol: production,
    target: `${nonTerminal}|${terminal}`,
    x: pRect.left + pRect.width / 2,
    y: pRect.top + pRect.height / 2
  })

  await new Promise(resolve => setTimeout(resolve, 100))
  const fs = flyingSymbols.value.find(f => f.symbol === production && f.target === `${nonTerminal}|${terminal}`)
  if (fs) {
    fs.x = cRect.left + cRect.width / 2
    fs.y = cRect.top + cRect.height / 2
  }

  await new Promise(resolve => setTimeout(resolve, 2000 / animationSpeed.value))
  userTable.value[`${nonTerminal}|${terminal}`] = production
  validateTableCell(nonTerminal, terminal)
  flyingSymbols.value = flyingSymbols.value.filter(f => !(f.symbol === production && f.target === `${nonTerminal}|${terminal}`))
}

const handleNextStep = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  emit('next-step')
}

const clearAllStates = () => {
  userTable.value = {}
  tableValidation.value = {}
  tableValidated.value = false
  attempts.value = 0
  showAnswer.value = false
  hintState.value.isActive = false
  currentHintStepIndex.value = 0
  productionHighlightState.value = {}
  ruleHighlightState.value = {}
  symbolHighlightState.value = {}
  tableCellHighlightState.value = {}
  flyingSymbols.value = []

  showHintModal('info', '状态已清空', '所有用户输入和提示状态已重置。', '', '状态重置完成', 3000, 'center')
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

.fixed {
  transition: all 2s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
