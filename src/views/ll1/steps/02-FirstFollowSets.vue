<template>
  <div class="first-follow-step" :style="animationSpeedStyle">
    <div class="px-8 py-8 pb-4 border-b border-gray-200">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
          <Icon icon="lucide:arrow-right-left" class="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-900">求First集和Follow集</h2>
          <p class="text-gray-600 mt-1">第二步：计算文法中所有非终结符的First集和Follow集</p>
        </div>
      </div>
    </div>

    <div class="px-8 py-8">
      <div v-if="!originalData" class="max-w-4xl mx-auto text-center py-12">
        <div class="text-gray-500">
          <Icon icon="lucide:alert-circle" class="w-12 h-12 mx-auto mb-4" />
          <p class="text-lg">请先完成第一步：输入文法</p>
        </div>
      </div>
      <div v-else class="max-w-7xl mx-auto">
        <!-- 说明指引 -->
        <FirstFollowLegend />

        <!-- 已知信息区域 -->
        <GrammarReference 
          :original-data="originalData"
          :symbol-highlight-state="symbolHighlightState"
          :production-highlight-state="productionHighlightState"
          @dragstart="onDragStart"
          @symbol-dblclick="onSymbolDblClick"
        />

        <!-- First集和Follow集填写区域 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <!-- First集 -->
          <FirstSetTable 
            :vn="originalData.Vn"
            :user-first-sets="userFirstSets"
            :first-validation="firstValidation"
            :loading="loading.first"
            :show-first-answer="showFirstAnswer"
            :correct-first-sets="correctFirstSets"
            :animation-speed="animationSpeed"
            @check="checkFirstSets"
            @clear="clearFirstSets"
            @toggle-answer="showFirstAnswer = !showFirstAnswer"
            @increase-speed="increaseAnimationSpeed"
            @decrease-speed="decreaseAnimationSpeed"
            @reset-speed="resetAnimationSpeed"
            @focus="clearValidation('first', $event)"
            @drop="(event, symbol) => onDrop(event, 'first', symbol)"
            @hint="executeHintAnimation"
          />

          <!-- Follow集 -->
          <FollowSetTable 
            :vn="originalData.Vn"
            :user-follow-sets="userFollowSets"
            :follow-validation="followValidation"
            :loading="loading.follow"
            :show-follow-answer="showFollowAnswer"
            :correct-follow-sets="correctFollowSets"
            :animation-speed="animationSpeed"
            :first-step-completed="firstStepCompleted"
            :hint-active="hintState.isActive"
            @check="checkFollowSets"
            @clear="clearFollowSets"
            @toggle-answer="showFollowAnswer = !showFollowAnswer"
            @increase-speed="increaseAnimationSpeed"
            @decrease-speed="decreaseAnimationSpeed"
            @reset-speed="resetAnimationSpeed"
            @focus="clearValidation('follow', $event)"
            @drop="(event, symbol) => onDrop(event, 'follow', symbol)"
            @hint="executeFollowHintAnimation"
          />
        </div>

        <!-- 计算提示 -->
        <FirstFollowRules :rule-highlight-state="ruleHighlightState" />

        <!-- 进度提示 -->
        <div v-if="allCompleted" class="bg-green-50 border border-green-200 rounded-lg p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <Icon icon="lucide:check-circle" class="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h4 class="text-lg font-bold text-green-900">任务已完成！</h4>
              <p class="text-base text-green-700 mt-1 font-medium">可以进入下一步构建LL1分析表</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="px-8 py-4 pb-8 border-t border-gray-200 bg-gray-50">
      <div class="flex justify-between items-center">
        <button
          @click="$emit('prev-step')"
          class="flex items-center px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all font-semibold shadow-sm"
        >
          <Icon icon="lucide:arrow-left" class="w-4 h-4 mr-2" />
          上一步：输入文法
        </button>
        <button
          @click="handleNextStep"
          :disabled="!firstStepCompleted"
          :class="[
            'flex items-center px-8 py-2.5 rounded-xl transition-all font-bold shadow-lg transform active:scale-95',
            firstStepCompleted
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
          ]"
        >
          下一步：构建LL1分析表
          <Icon icon="lucide:arrow-right" class="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>

    <!-- 复制提示 -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform translate-y-4 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform translate-y-4 opacity-0"
    >
      <div v-if="copyTip" class="fixed top-8 right-8 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 bg-green-600 text-white font-medium border border-green-500/20 backdrop-blur-sm">
        <Icon icon="lucide:copy" class="w-5 h-5 animate-bounce" />
        <span>{{ copyTip }}</span>
      </div>
    </transition>

    <!-- 飞行动画元素 -->
    <transition-group
      enter-active-class="transition-all duration-2000 ease-out"
      enter-from-class="opacity-0 scale-50"
      enter-to-class="opacity-100 scale-100"
    >
      <div
        v-for="flyingSymbol in hintState.flyingSymbols"
        :key="flyingSymbol.id"
        class="flying-symbol font-mono font-bold"
        :style="{
          left: `${flyingSymbol.x}px`,
          top: `${flyingSymbol.y}px`,
        }"
      >
        <div
          :class="[
            'px-3 py-1.5 rounded-lg shadow-xl border-2 transition-colors duration-500',
            flyingSymbol.symbol === 'ε' ? 'bg-pink-100 text-pink-800 border-pink-300' :
            flyingSymbol.symbol === '#' ? 'bg-blue-100 text-blue-800 border-blue-300' :
            'bg-green-100 text-green-800 border-green-300'
          ]"
        >
          {{ flyingSymbol.symbol }}
        </div>
      </div>
    </transition-group>

    <!-- 动画提示弹窗 -->
    <AnimationHintModal
      :visible="hintModalVisible"
      v-bind="hintModalConfig"
      @close="closeHintModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { Icon } from '@iconify/vue'
import { useLL1Store, useCommonStore } from '@/stores'
import AnimationHintModal from '@/components/shared/AnimationHintModal.vue'

// 新提取的 composables
import { useHintModal } from '@/composables/useHintModal'
import { useAnimationSpeed } from '@/composables/useAnimationSpeed'

// 新提取的组件
import FirstFollowLegend from '../components/FirstFollowLegend.vue'
import GrammarReference from '../components/GrammarReference.vue'
import FirstSetTable from '../components/FirstSetTable.vue'
import FollowSetTable from '../components/FollowSetTable.vue'
import FirstFollowRules from '../components/FirstFollowRules.vue'

// 新提取的工具函数
import { 
  areCharacterSetsEqual, 
  calculateFirstSetHint,
  calculateFollowSetHint,
} from '../utils/first-follow-sets'

// 使用 composables
const { hintModalVisible, hintModalConfig, showHintModal, closeHintModal } = useHintModal()
const { animationSpeed, animationSpeedStyle, increaseAnimationSpeed, decreaseAnimationSpeed, resetAnimationSpeed } = useAnimationSpeed()

const emit = defineEmits<{
  'next-step': []
  'prev-step': []
}>()

const ll1Store = useLL1Store()

// 数据引用
const originalData = computed(() => ll1Store.originalData)
const correctFirstSets = computed(() => ll1Store.firstSets)
const correctFollowSets = computed(() => ll1Store.followSets)

// 用户输入的集合
const userFirstSets = ref<Record<string, string>>({})
const userFollowSets = ref<Record<string, string>>({})

// 核心初始化逻辑
const initializeState = () => {
  if (ll1Store.step2Data) {
    userFirstSets.value = JSON.parse(JSON.stringify(ll1Store.step2Data.userFirstSets))
    userFollowSets.value = JSON.parse(JSON.stringify(ll1Store.step2Data.userFollowSets))
  } else if (originalData.value?.Vn) {
    const vn = originalData.value.Vn
    const newFirstSets: Record<string, string> = {}
    const newFollowSets: Record<string, string> = {}
    vn.forEach(symbol => {
      newFirstSets[symbol] = ''
      newFollowSets[symbol] = ''
    })
    userFirstSets.value = newFirstSets
    userFollowSets.value = newFollowSets
  }
}

// 监听并在变化时存入 store
let saveTimer: any = null
watch([userFirstSets, userFollowSets], () => {
  ll1Store.saveStep2Data(userFirstSets.value, userFollowSets.value)
  
  // 实时保存到历史记录（带防抖）
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    ll1Store.saveToHistory()
  }, 1000)
}, { deep: true })

// 监听 originalData 变化，用于刷新后的数据恢复
watch(() => originalData.value, (newVal) => {
  if (newVal && Object.keys(userFirstSets.value).length === 0) {
    initializeState()
  }
}, { immediate: true })

// 恢复数据
onMounted(() => {
  initializeState()

  // 初始化验证状态
  if (originalData.value?.Vn) {
    originalData.value.Vn.forEach(symbol => {
      firstValidation.value[symbol] = ''
      followValidation.value[symbol] = ''
    })
  }
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

// 验证状态
const firstValidation = ref<Record<string, 'correct' | 'incorrect' | ''>>({})
const followValidation = ref<Record<string, 'correct' | 'incorrect' | ''>>({})

// 加载状态
const loading = ref({
  first: false,
  follow: false
})

// 显示答案
const showFirstAnswer = ref(false)
const showFollowAnswer = ref(false)

// 提示功能相关状态
const hintState = ref({
  isActive: false,
  currentSymbol: '',
  highlightedSymbols: [] as string[],
  highlightedProductions: [] as string[],
  highlightedRules: [] as string[],
  flyingSymbols: [] as { id: number; symbol: string; target: string; x: number; y: number }[]
})

// 用于生成唯一的动画元素ID
let flyingIdCounter = 0;

// 高亮状态
const symbolHighlightState = ref<Record<string, boolean>>({})
const productionHighlightState = ref<Record<string, boolean>>({})
const ruleHighlightState = ref<Record<string, boolean>>({})

// 尝试次数
const firstAttempts = ref(0)
const maxAttempts = 3

// 完成状态
const firstStepCompleted = computed(() => {
  if (!originalData.value) return false
  return originalData.value.Vn.every(symbol => firstValidation.value[symbol] === 'correct') || firstAttempts.value >= maxAttempts
})

// 监听First集完成状态
watch(firstStepCompleted, (completed: boolean) => {
  if (!completed) {
    showFollowAnswer.value = false
  }
})

const allCompleted = computed(() => {
  return showFirstAnswer.value && showFollowAnswer.value
})

// 复制提示
const copyTip = ref('')
let copyTipTimer: number | null = null

const clearValidation = (type: 'first' | 'follow', symbol: string) => {
  if (type === 'first') {
    if (firstValidation.value[symbol] !== 'correct') {
      firstValidation.value[symbol] = ''
    }
  } else {
    if (followValidation.value[symbol] !== 'correct') {
      followValidation.value[symbol] = ''
    }
  }
}

// 校验函数
const checkFirstSets = async () => {
  if (!originalData.value) return

  loading.value.first = true
  firstAttempts.value++

  let correctCount = 0
  let totalCount = 0

  for (const symbol of originalData.value.Vn) {
    const userInput = userFirstSets.value[symbol] || ''
    const correctSet = correctFirstSets.value[symbol] || []
    const correctSetStr = correctSet.join(' ')
    totalCount++

    if (areCharacterSetsEqual(userInput, correctSetStr)) {
      firstValidation.value[symbol] = 'correct'
      correctCount++
    } else {
      firstValidation.value[symbol] = 'incorrect'
      
      // 生成提示信息
      let hintText = ''
      const hintData = calculateFirstSetHint(symbol, originalData.value.formulas_dict)
      if (hintData && hintData.steps) {
        hintText = hintData.steps.map((s, i) => `${i + 1}. ${s.description}`).join('\n')
      }

      ll1Store.addErrorLog({
        step: 'step2',
        type: 'firstSet',
        location: { row: symbol, fieldKey: `first-${symbol}` },
        wrongValue: userInput,
        correctValue: correctSetStr,
        hint: hintText
      })
    }
  }

  if (correctCount === totalCount) {
    showHintModal('success', 'First集校验成功', '恭喜！所有First集都填写正确。', `您已成功计算了所有非终结符的First集，共${totalCount}个符号全部正确。`, 'First集计算完成', 5000, 'top-center')
  } else {
    showHintModal('error', 'First集校验失败', `还有${totalCount - correctCount}个First集填写错误，请检查并修正。`, `正确填写：${correctCount}/${totalCount}`, '请修正错误', 5000, 'top-center')
  }
  
  // 取消防抖定时器，立即保存
  if (saveTimer) {
    clearTimeout(saveTimer)
    saveTimer = null
  }
  ll1Store.saveToHistory()
  loading.value.first = false
}

const checkFollowSets = async () => {
  if (!originalData.value) return

  loading.value.follow = true

  let correctCount = 0
  let totalCount = 0

  for (const symbol of originalData.value.Vn) {
    const userInput = userFollowSets.value[symbol] || ''
    const correctSet = correctFollowSets.value[symbol] || []
    const correctSetStr = correctSet.join(' ')
    totalCount++

    if (areCharacterSetsEqual(userInput, correctSetStr)) {
      followValidation.value[symbol] = 'correct'
      correctCount++
    } else {
      followValidation.value[symbol] = 'incorrect'

      // 生成提示信息
      let hintText = ''
      const hintData = calculateFollowSetHint(symbol, originalData.value)
      if (hintData && hintData.steps) {
        hintText = hintData.steps.map((s, i) => `${i + 1}. ${s.description}`).join('\n')
      }

      ll1Store.addErrorLog({
        step: 'step2',
        type: 'followSet',
        location: { row: symbol, fieldKey: `follow-${symbol}` },
        wrongValue: userInput,
        correctValue: correctSetStr,
        hint: hintText
      })
    }
  }

  if (correctCount === totalCount) {
    showHintModal('success', 'Follow集校验成功', '恭喜！所有Follow集都填写正确。', `您已成功计算了所有非终结符的Follow集，共${totalCount}个符号全部正确。`, 'Follow集计算完成', 5000, 'top-center')
  } else {
    showHintModal('error', 'Follow集校验失败', `还有${totalCount - correctCount}个Follow集填写错误，请检查并修正。`, `正确填写：${correctCount}/${totalCount}`, '请修正错误', 5000, 'top-center')
  }

  // 取消防抖定时器，立即保存
  if (saveTimer) {
    clearTimeout(saveTimer)
    saveTimer = null
  }
  ll1Store.saveToHistory()
  loading.value.follow = false
}

const clearFirstSets = () => {
  if (originalData.value?.Vn) {
    originalData.value.Vn.forEach(symbol => {
      userFirstSets.value[symbol] = ''
      firstValidation.value[symbol] = ''
    })
    showFirstAnswer.value = false
    firstAttempts.value = 0
  }
}

const clearFollowSets = () => {
  if (originalData.value?.Vn) {
    originalData.value.Vn.forEach(symbol => {
      userFollowSets.value[symbol] = ''
      followValidation.value[symbol] = ''
    })
    showFollowAnswer.value = false
  }
}

function onDragStart(symbol: string, event: DragEvent) {
  event.dataTransfer?.setData('text/plain', symbol)
}

function onDrop(event: DragEvent, type: 'first' | 'follow', symbol: string) {
  event.preventDefault()
  const draggedSymbol = event.dataTransfer?.getData('text/plain')
  if (!draggedSymbol) return

  const dataObject = type === 'first' ? userFirstSets : userFollowSets
  const currentValue = dataObject.value[symbol] || ''
  const currentSymbols = currentValue.split(' ').filter(s => s.trim())
  
  if (currentSymbols.includes(draggedSymbol)) return

  dataObject.value[symbol] = currentValue ? `${currentValue} ${draggedSymbol}` : draggedSymbol
}

function onSymbolDblClick(symbol: string) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(symbol).then(() => showCopyTip(`已复制：${symbol}`))
  }
}

function showCopyTip(msg: string) {
  copyTip.value = msg
  if (copyTipTimer) clearTimeout(copyTipTimer)
  copyTipTimer = window.setTimeout(() => { copyTip.value = '' }, 1200)
}

// 执行提示动画
const executeHintAnimation = async (symbol: string) => {
  if (!originalData.value) return

  hintState.value.isActive = true
  hintState.value.currentSymbol = symbol

  const hint = calculateFirstSetHint(symbol, originalData.value.formulas_dict)
  if (!hint) return

  showHintModal('hint', 'First集计算提示', `开始计算 ${symbol} 的First集`, `正在计算 ${symbol} 的First集...`, '观察高亮区域', 4000, 'bottom-left')

  symbolHighlightState.value[symbol] = true
  await new Promise(resolve => setTimeout(resolve, 1000 / animationSpeed.value))

  // 收集所有需要添加的符号（使用 Set 去重）
  const symbolsToAdd = new Set<string>()

  for (let i = 0; i < hint.steps.length; i++) {
    const step = hint.steps[i]
    showHintModal('hint', '计算步骤', step.description, step.description, '观察高亮和飞行动画', 3000, 'bottom-left')

    step.productions.forEach(prod => { productionHighlightState.value[prod] = true })
    step.rules.forEach(rule => { ruleHighlightState.value[rule] = true })

    // 先执行所有飞行动画，收集符号
    for (const flyingSymbol of step.finalSymbols) {
      // 只在尚未添加过的符号上执行动画
      if (!symbolsToAdd.has(flyingSymbol)) {
        await executeFlyingAnimation(symbol, flyingSymbol)
        symbolsToAdd.add(flyingSymbol)
      }
    }

    await new Promise(resolve => setTimeout(resolve, 1000 / animationSpeed.value))
    step.productions.forEach(prod => { productionHighlightState.value[prod] = false })
    step.rules.forEach(rule => { ruleHighlightState.value[rule] = false })
  }

  // 批量更新数据，避免触发多次 watch
  const currentVal = userFirstSets.value[symbol] || ''
  const currentSymbols = new Set(currentVal.split(' ').filter(s => s.trim()))
  const newSymbols = Array.from(symbolsToAdd).filter(s => !currentSymbols.has(s))
  if (newSymbols.length > 0) {
    userFirstSets.value[symbol] = currentVal ? `${currentVal} ${newSymbols.join(' ')}` : newSymbols.join(' ')
  }

  symbolHighlightState.value[symbol] = false
  hintState.value.isActive = false
  showHintModal('success', '提示完成', `${symbol} 的First集计算过程展示完毕`, '您可以继续填写其他符号或进行校验。', '提示结束', 3000, 'bottom-left')
}

const executeFlyingAnimation = async (targetSymbol: string, flyingSymbol: string) => {
  const sourceEl = document.querySelector(`[data-symbol="${flyingSymbol}"]`)
  const targetEl = document.querySelector(`[data-input="${targetSymbol}"]`)

  if (sourceEl && targetEl) {
    const sourceRect = sourceEl.getBoundingClientRect()
    const targetRect = targetEl.getBoundingClientRect()
    const flyingObj = { 
      id: flyingIdCounter++, 
      symbol: flyingSymbol, 
      target: targetSymbol, 
      x: sourceRect.left + sourceRect.width / 2, 
      y: sourceRect.top + sourceRect.height / 2 
    }
    
    // 添加到数组
    hintState.value.flyingSymbols.push(flyingObj)
    
    // 获取反应式对象
    await nextTick()
    const reactiveObj = hintState.value.flyingSymbols.find(s => s.id === flyingObj.id)
    if (!reactiveObj) return

    // 等待一小段时间确保初始位置渲染
    await new Promise(resolve => setTimeout(resolve, 50))
    
    // 更新到目标位置
    reactiveObj.x = targetRect.left + targetRect.width / 2
    reactiveObj.y = targetRect.top + targetRect.height / 2

    // 等待飞行动画完成
    await new Promise(resolve => setTimeout(resolve, 2000 / animationSpeed.value))
    hintState.value.flyingSymbols = hintState.value.flyingSymbols.filter(s => s.id !== flyingObj.id)
  }
}

const executeFollowHintAnimation = async (symbol: string) => {
  if (!originalData.value) return
  hintState.value.isActive = true
  
  const hint = calculateFollowSetHint(symbol, originalData.value)
  if (!hint) return

  showHintModal('hint', 'Follow集计算提示', `开始计算 ${symbol} 的Follow集`, `正在分析 ${symbol} 在各产生式中的位置...`, '观察高亮区域', 4000, 'bottom-left')

  symbolHighlightState.value[symbol] = true
  await new Promise(resolve => setTimeout(resolve, 1000 / animationSpeed.value))

  // 收集所有需要添加的符号（使用 Set 去重）
  const symbolsToAdd = new Set<string>()

  for (let i = 0; i < hint.steps.length; i++) {
    const step = hint.steps[i]
    showHintModal('hint', 'Follow计算步骤', step.description, step.description, '观察高亮和飞行动画', 3000, 'bottom-left')

    step.productions.forEach(prod => { productionHighlightState.value[prod] = true })
    step.rules.forEach(rule => { ruleHighlightState.value[rule] = true })

    // 先执行所有飞行动画，收集符号
    for (const flyingSymbol of step.finalSymbols) {
      // 只在尚未添加过的符号上执行动画
      if (!symbolsToAdd.has(flyingSymbol)) {
        await executeFollowFlyingAnimation(symbol, flyingSymbol)
        symbolsToAdd.add(flyingSymbol)
      }
    }

    await new Promise(resolve => setTimeout(resolve, 1000 / animationSpeed.value))
    step.productions.forEach(prod => { productionHighlightState.value[prod] = false })
    step.rules.forEach(rule => { ruleHighlightState.value[rule] = false })
  }

  // 批量更新数据，避免触发多次 watch
  const currentVal = userFollowSets.value[symbol] || ''
  const currentSymbols = new Set(currentVal.split(' ').filter(s => s.trim()))
  const newSymbols = Array.from(symbolsToAdd).filter(s => !currentSymbols.has(s))
  if (newSymbols.length > 0) {
    userFollowSets.value[symbol] = currentVal ? `${currentVal} ${newSymbols.join(' ')}` : newSymbols.join(' ')
  }

  symbolHighlightState.value[symbol] = false
  hintState.value.isActive = false
}

const executeFollowFlyingAnimation = async (targetSymbol: string, flyingSymbol: string) => {
  const sourceEl = document.querySelector(`[data-symbol="${flyingSymbol}"]`) || document.querySelector(`[data-input="follow-${flyingSymbol}"]`)
  const targetEl = document.querySelector(`[data-input="follow-${targetSymbol}"]`)

  if (sourceEl && targetEl) {
    const sourceRect = sourceEl.getBoundingClientRect()
    const targetRect = targetEl.getBoundingClientRect()
    const flyingObj = { 
      id: flyingIdCounter++, 
      symbol: flyingSymbol, 
      target: targetSymbol, 
      x: sourceRect.left + sourceRect.width / 2, 
      y: sourceRect.top + sourceRect.height / 2 
    }
    
    // 添加到数组
    hintState.value.flyingSymbols.push(flyingObj)
    
    // 获取反应式对象
    await nextTick()
    const reactiveObj = hintState.value.flyingSymbols.find(s => s.id === flyingObj.id)
    if (!reactiveObj) return

    // 等待一小段时间确保初始位置渲染
    await new Promise(resolve => setTimeout(resolve, 50))
    
    // 更新到目标位置
    reactiveObj.x = targetRect.left + targetRect.width / 2
    reactiveObj.y = targetRect.top + targetRect.height / 2

    // 等待飞行动画完成
    await new Promise(resolve => setTimeout(resolve, 2000 / animationSpeed.value))
    hintState.value.flyingSymbols = hintState.value.flyingSymbols.filter(s => s.id !== flyingObj.id)
  }
}

const handleNextStep = () => { ll1Store.inputString = ''; emit('next-step') }
</script>

<style scoped>
.flying-symbol {
  position: fixed;
  z-index: 1000;
  pointer-events: none;
  transition: all 2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform: translate(-50%, -50%);
  transition-duration: calc(2s / var(--animation-speed, 1));
}

@keyframes highlight-pulse {
  0%, 100% { transform: scale(1); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
  50% { transform: scale(1.05); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
}

.highlight-pulse { animation: highlight-pulse 1s ease-in-out infinite; }
</style>