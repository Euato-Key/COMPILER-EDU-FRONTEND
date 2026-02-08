<template>
  <div class="lr0-table-build-step">
    <div class="step-header">
      <div class="flex items-center gap-4">
        <div class="step-icon">
          <Icon icon="lucide:table" class="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-900">LR0表构建</h2>
          <p class="text-gray-600 mt-1">第四步：构建LR0分析表</p>
        </div>
      </div>
    </div>

    <div class="step-content">
      <!-- 说明区域 -->
      <div class="bg-indigo-50 border border-indigo-200 rounded-lg p-6 mb-6">
        <div class="flex items-start">
          <Icon icon="lucide:info" class="w-5 h-5 text-indigo-600 mt-0.5 mr-3" />
          <div>
            <h3 class="text-lg font-semibold text-indigo-900 mb-2">LR0分析表构造规则</h3>
            <ul class="space-y-2 text-base text-indigo-900">
              <li class="flex items-start gap-2">
                <span class="text-indigo-600 font-bold">•</span>
                <span><strong class="text-indigo-800 bg-indigo-100 px-2 py-1 rounded">ACTION表：</strong>根据项目集中的项目填写移进和规约动作</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-indigo-600 font-bold">•</span>
                <span><strong class="text-indigo-800 bg-indigo-100 px-2 py-1 rounded">GOTO表：</strong>根据DFA的转移关系填写状态转移</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-indigo-600 font-bold">•</span>
                <span><strong class="text-indigo-800 bg-indigo-100 px-2 py-1 rounded">移进动作：</strong>A → α·aβ，则ACTION[i,a] = Sj（状态j包含A → αa·β）</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-indigo-600 font-bold">•</span>
                <span><strong class="text-indigo-800 bg-indigo-100 px-2 py-1 rounded">规约动作：</strong>A → α·，则对所有终结符a，ACTION[i,a] = rk（第k个产生式）</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-indigo-600 font-bold">•</span>
                <span><strong class="text-indigo-800 bg-indigo-100 px-2 py-1 rounded">接受动作：</strong>S' → S·，则ACTION[i,#] = acc</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- DFA图和产生式编号显示区域 -->
      <div v-if="hasDFAData" class="bg-white border border-gray-200 rounded-lg mb-6">
        <div class="border-b border-gray-200 p-4">
          <h3 class="font-semibold text-gray-900 flex items-center gap-2">
            <Icon icon="lucide:git-merge" class="w-5 h-5 text-indigo-600" />
            LR0项目集规范族DFA图
          </h3>
          <p class="text-sm text-gray-600 mt-1">参考此DFA图填写分析表</p>
        </div>
        <div class="p-4">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- 左侧：DFA图 -->
            <div class="lg:col-span-1">
              <div class="h-80 w-full bg-gray-50 rounded flex items-center justify-center">
                <div v-if="dfaSvg" class="dfa-svg-container w-full h-full flex justify-center items-center overflow-auto p-4">
                  <div v-html="dfaSvg" class="flex justify-center w-full h-full"></div>
                </div>
                <div v-else class="text-center text-gray-500">
                  <Icon icon="lucide:loader-2" class="w-8 h-8 mx-auto mb-2 animate-spin text-indigo-500" />
                  <p class="text-sm">正在渲染DFA图...</p>
                </div>
              </div>
            </div>

            <!-- 右侧：产生式编号 -->
            <div class="lg:col-span-1">
              <div class="h-80 bg-purple-50 rounded-lg p-4 border border-purple-200 flex flex-col">
                <div class="flex items-center gap-2 mb-4 flex-shrink-0">
                  <Icon icon="lucide:list" class="w-5 h-5 text-purple-600" />
                  <h4 class="font-medium text-purple-900">产生式编号</h4>
                </div>

                <!-- 产生式列表区域 - 可滚动 -->
                <div class="flex-1 overflow-y-auto mb-4">
                  <div class="grid grid-cols-2 gap-2">
                    <div
                      v-for="(production, index) in numberedProductions"
                      :key="production"
                      :data-production="index + 1"
                      class="bg-white border border-purple-200 rounded p-2 shadow-sm"
                    >
                      <div class="text-sm font-mono text-purple-800 font-semibold">
                        <span class="font-bold text-purple-900">r{{ index + 1 }}:</span> {{ production }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 底部说明文字 - 固定位置 -->
                <div class="text-sm text-purple-700 font-medium flex-shrink-0 border-t border-purple-200 pt-3">
                  <p>• 用于ACTION表中的规约动作</p>
                  <p>• r1, r2, r3... 对应产生式编号</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 替换原有表格区域为ParsingTable组件 -->
      <div v-if="tableProps" class="mt-6">
        <ParsingTable
          v-bind="tableProps"
          @validation-complete="handleValidation"
          @step-complete="handleStepComplete"
          @cell-blur="handleCellBlur"
        />
      </div>

      <!-- 数据格式异常的后备显示 -->
      <div v-else class="text-center py-12">
        <Icon icon="lucide:alert-triangle" class="w-12 h-12 mx-auto mb-3 text-yellow-500" />
        <p class="text-lg font-medium text-gray-600">数据加载异常</p>
        <p class="text-sm text-gray-500 mt-1">请检查前面的步骤是否正确完成</p>
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
        <div class="text-sm text-gray-500">步骤 4 / 5</div>
        <button
          @click="nextStep"
          :disabled="!isStepComplete"
          class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          下一步
          <Icon icon="lucide:chevron-right" class="w-4 h-4 inline ml-2" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, watch, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { Icon } from '@iconify/vue'
import { useLR0StoreNew } from '@/stores'
import ParsingTable from '@/components/lr/ParsingTable.vue'
import { instance } from '@viz-js/viz'

const emit = defineEmits<{
  'next-step': []
  'prev-step': []
}>()

// 使用新 store
const lr0Store = useLR0StoreNew()
const { originalData } = storeToRefs(lr0Store)

// 步骤完成状态
const stepCompleteStatus = ref(false)
const isInitialized = ref(false) // 防止重复初始化

// 用户填写的表格数据（用于 watch 自动保存）
const userActionTable = ref<Record<string, string>>({})
const userGotoTable = ref<Record<string, string>>({})

// 用于控制是否跳过保存的标志（避免初始化时触发保存）
const skipSave = ref(false)

// DFA图渲染相关
const dfaSvg = ref('')
const dfaRendered = ref(false)

// 计算属性
const hasDFAData = computed(() => originalData.value !== null && lr0Store.dotString !== '')
const lr0DotString = computed(() => lr0Store.dotString)

// 带编号的产生式（去除S'->S）
const numberedProductions = computed(() => {
  if (!originalData.value?.formulas_list) return []
  return originalData.value.formulas_list.filter((production) => {
    // 过滤掉S'->S的产生式
    return !production.includes("'") && !production.includes('S->S')
  })
})

// 渲染DFA图
const renderDFA = async () => {
  if (!hasDFAData.value || !lr0DotString.value) return

  try {
    dfaRendered.value = false

    // 渲染SVG
    const viz = await instance()
    const svg = viz.renderSVGElement(lr0DotString.value)

    // 添加样式类
    svg.classList.add('lr0-dfa-svg')
    dfaSvg.value = svg.outerHTML
    dfaRendered.value = true

  } catch (error) {
    console.error('LR0 DFA render failed:', error)
    dfaSvg.value = `
      <div class="text-center text-red-500 p-4">
        <p>DFA图渲染失败: ${error instanceof Error ? error.message : String(error)}</p>
      </div>
    `
  }
}

// 为ParsingTable组件准备数据
const tableProps = computed(() => {
  try {
    if (!originalData.value) return null

    // 验证必要的数据字段
    if (!originalData.value.Vt || !originalData.value.Vn) {
      console.warn('缺少终结符或非终结符数据')
      return null
    }

    // 准备传递给 ParsingTable 的数据
    const answers = {
      actions: lr0Store.actionTable || {},
      gotos: lr0Store.gotoTable || {},
    }

    // 处理终结符和非终结符数据格式
    const terminals = Array.isArray(originalData.value.Vt)
      ? originalData.value.Vt.map((item: any) =>
          typeof item === 'object' ? item.text || item.value : item,
        )
      : []

    const nonterminals = Array.isArray(originalData.value.Vn)
      ? originalData.value.Vn.filter((item: any) => {
          const text = typeof item === 'object' ? item.text || item.value : item
          return text !== (originalData.value?.S || '') + "'"
        }).map((item: any) => (typeof item === 'object' ? item.text || item.value : item))
      : []

    console.log('=== LR0TableBuild 传递给 ParsingTable 的数据 ===')
    console.log('tableType: LR0')
    console.log('原始 Vt:', originalData.value.Vt)
    console.log('处理后 terminals:', terminals)
    console.log('原始 Vn:', originalData.value.Vn)
    console.log('处理后 nonterminals:', nonterminals)
    console.log('actions数据:', answers.actions)
    console.log('gotos数据:', answers.gotos)
    console.log('actions键值数量:', Object.keys(answers.actions).length)
    console.log('gotos键值数量:', Object.keys(answers.gotos).length)

    return {
      tableType: 'LR0' as const,
      analysisData: originalData.value,
      terminals: terminals,
      nonterminals: nonterminals,
      correctAnswers: answers,
      savedActionTable: userActionTable.value,
      savedGotoTable: userGotoTable.value,
    }
  } catch (error) {
    console.error('准备表格数据时出错:', error)
    return null
  }
})

// 计算属性 - 步骤完成状态
const isStepComplete = computed(() => {
  return stepCompleteStatus.value && originalData.value !== null
})

// 保存到 store（防抖）
let saveTimer: any = null
const saveToStore = (userActionTable: any, userGotoTable: any) => {
  lr0Store.saveStep4Data(userActionTable, userGotoTable)
}

// 立即保存到历史记录
const saveToHistoryImmediate = () => {
  if (saveTimer) {
    clearTimeout(saveTimer)
    saveTimer = null
  }
  lr0Store.saveToHistory()
}

// 核心初始化逻辑
const initializeState = () => {
  // 防止重复初始化
  if (isInitialized.value) {
    return
  }

  // 设置跳过保存标志，避免初始化时触发 watcher
  skipSave.value = true

  // 如果有保存的 step4Data，恢复数据到本地响应式数据
  if (lr0Store.step4Data) {
    console.log('恢复 step4Data:', lr0Store.step4Data)
    if (lr0Store.step4Data.userActionTable) {
      userActionTable.value = { ...lr0Store.step4Data.userActionTable }
    }
    if (lr0Store.step4Data.userGotoTable) {
      userGotoTable.value = { ...lr0Store.step4Data.userGotoTable }
    }
  }

  isInitialized.value = true

  // 重置跳过保存标志
  nextTick(() => {
    skipSave.value = false
  })
}

// 处理验证完成事件
const handleValidation = (result: { isValid: boolean; errors: any[]; userActionTable?: any; userGotoTable?: any }) => {
  console.log('LR0验证结果:', result)
  
  // 记录错误日志
  if (!result.isValid && result.errors.length > 0) {
    result.errors.forEach((error) => {
      const [state, symbol] = error.key.split(',')
      lr0Store.addErrorLog({
        step: 'step4',
        type: error.type === 'action' ? 'actionTable' : 'gotoTable',
        location: { 
          row: state, 
          col: symbol, 
          fieldKey: `${error.type}-${error.key}` 
        },
        wrongValue: error.userValue,
        correctValue: error.correctValue,
        hint: '答案错误'
      })
    })
  }
  
  // 保存用户填写的表格数据
  if (result.userActionTable && result.userGotoTable) {
    saveToStore(result.userActionTable, result.userGotoTable)
    
    // 防抖保存到历史记录
    if (saveTimer) clearTimeout(saveTimer)
    saveTimer = setTimeout(() => {
      lr0Store.saveToHistory()
    }, 1000)
  }
}

// 处理单元格失焦事件 - 更新本地数据，由 watch 自动保存
const handleCellBlur = (newActionTable: Record<string, string>, newGotoTable: Record<string, string>) => {
  console.log('单元格失焦，更新本地数据:', newActionTable, newGotoTable)
  // 更新本地响应式数据，watch 会自动触发保存
  userActionTable.value = { ...newActionTable }
  userGotoTable.value = { ...newGotoTable }
}

// 处理步骤完成状态
const handleStepComplete = (isComplete: boolean) => {
  stepCompleteStatus.value = isComplete
}

// 监听用户答案变化，自动保存到 store（模仿 Step5 的实现）
watch(
  [userActionTable, userGotoTable],
  () => {
    // 如果设置了跳过保存标志，则不执行保存
    if (skipSave.value) {
      return
    }
    // 保存到 store
    saveToStore(userActionTable.value, userGotoTable.value)
    
    // 防抖保存到历史记录
    if (saveTimer) clearTimeout(saveTimer)
    saveTimer = setTimeout(() => {
      lr0Store.saveToHistory()
    }, 1000)
  },
  { deep: true }
)

// 组件挂载时初始化
onMounted(async () => {
  // 延迟执行，确保 persistence 已经从 localStorage 加载数据
  await new Promise(resolve => setTimeout(resolve, 100))
  await initializeState()
  
  // 渲染DFA图
  if (hasDFAData.value) {
    await renderDFA()
  }
})

// 清理定时器
onUnmounted(() => {
  if (saveTimer) {
    clearTimeout(saveTimer)
    saveTimer = null
  }
})

const nextStep = () => {
  if (isStepComplete.value) {
    // 立即保存当前状态
    saveToHistoryImmediate()

    // 滚动到页面顶部
    window.scrollTo({ top: 0, behavior: 'smooth' })
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

/* LR0 DFA SVG 样式 */
:deep(.lr0-dfa-svg) {
  max-width: 100%;
  max-height: 100%;
  height: auto;
  width: auto;
  transform-origin: center;
}

.dfa-svg-container {
  max-width: 100%;
  max-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dfa-svg-container svg {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
}

/* 产生式盒子响应式样式 */
@media (max-width: 1024px) {
  .grid-cols-2 {
    grid-template-columns: 1fr;
  }
}

/* 确保产生式文字不会溢出 */
.text-sm {
  word-break: break-word;
  overflow-wrap: break-word;
}

/* 产生式卡片样式优化 */
.bg-white.border.border-purple-200.rounded.p-2 {
  min-height: 2.5rem;
  display: flex;
  align-items: center;
}
</style>
