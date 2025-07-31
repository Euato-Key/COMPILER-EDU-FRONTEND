<template>
  <div class="slr1-table-build-step">
    <div class="step-header">
      <div class="flex items-center gap-4">
        <div class="step-icon">
          <Icon icon="lucide:table" class="w-6 h-6 text-cyan-600" />
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-900">SLR1表构建</h2>
          <p class="text-gray-600 mt-1">第四步：构建SLR1分析表</p>
        </div>
      </div>
    </div>

    <div class="step-content">
      <!-- 说明区域 -->
      <div class="bg-cyan-50 border border-cyan-200 rounded-lg p-6 mb-6">
        <div class="flex items-start">
          <Icon icon="lucide:info" class="w-5 h-5 text-cyan-600 mt-0.5 mr-3" />
          <div>
            <h3 class="text-lg font-semibold text-cyan-900 mb-2">SLR1分析表构造规则</h3>
            <ul class="space-y-1 text-sm text-cyan-800">
              <li>• <strong>ACTION表：</strong>根据项目集中的项目和FOLLOW集填写移进和规约动作</li>
              <li>• <strong>GOTO表：</strong>根据DFA的转移关系填写状态转移</li>
              <li>
                • <strong>移进动作：</strong>A → α·aβ，则ACTION[i,a] = Sj（状态j包含A → αa·β）
              </li>
              <li>
                • <strong>规约动作：</strong>A → α·且a∈FOLLOW(A)，则ACTION[i,a] = rk（第k个产生式）
              </li>
              <li>• <strong>接受动作：</strong>S' → S·，则ACTION[i,#] = acc</li>
              <li>• <strong>SLR1特点：</strong>使用FOLLOW集解决LR0的规约/规约冲突</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- DFA图和FOLLOW集并排显示 -->
      <div v-if="hasDFAData" class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- DFA图显示区域 -->
        <div class="bg-white border border-gray-200 rounded-lg">
          <div class="border-b border-gray-200 p-4">
            <h3 class="font-semibold text-gray-900 flex items-center gap-2">
              <Icon icon="lucide:git-merge" class="w-5 h-5 text-cyan-600" />
              SLR1项目集规范族DFA图
            </h3>
            <p class="text-sm text-gray-600 mt-1">参考此DFA图填写分析表</p>
          </div>
          <div class="p-4">
            <div class="h-80 w-full bg-gray-50 rounded flex items-center justify-center">
              <div v-if="dfaSvg" class="dfa-svg-container w-full h-full flex justify-center items-center overflow-auto p-4">
                <div v-html="dfaSvg" class="flex justify-center w-full h-full"></div>
              </div>
              <div v-else class="text-center text-gray-500">
                <Icon icon="lucide:loader-2" class="w-8 h-8 mx-auto mb-2 animate-spin text-cyan-500" />
                <p class="text-sm">正在渲染DFA图...</p>
              </div>
            </div>
          </div>
        </div>

        <!-- FOLLOW集显示区域 -->
        <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div class="flex items-center gap-3 mb-6">
            <div class="flex items-center gap-2">
              <Icon icon="lucide:list" class="w-5 h-5 text-cyan-600" />
              <h3 class="text-xl font-bold text-gray-900">FOLLOW集</h3>
            </div>
            <p class="text-sm text-gray-600">SLR1使用FOLLOW集来解决规约冲突</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              v-for="(followSet, symbol) in followSets"
              :key="symbol"
              class="group relative bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 rounded-lg p-3 hover:shadow-md transition-all duration-200 hover:scale-105"
            >
              <div class="flex items-center gap-2 flex-1 min-w-0">
                <div class="text-xs font-medium text-cyan-700 bg-cyan-100 px-2 py-1 rounded-full whitespace-nowrap">
                  FOLLOW({{ symbol }})
                </div>
                <div class="text-sm font-mono text-gray-800 bg-white/60 rounded px-2 py-1 border border-cyan-100 flex-1 truncate">
                  {{ followSet.join(', ') || '∅' }}
                </div>
              </div>
            </div>

            <!-- 如果没有FOLLOW集数据，显示提示 -->
            <div
              v-if="Object.keys(followSets).length === 0"
              class="col-span-full text-center py-12 text-gray-500"
            >
              <Icon icon="lucide:loader-2" class="w-8 h-8 mx-auto mb-2 animate-spin text-cyan-500" />
              <p class="text-sm">FOLLOW集计算中...</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 从前面步骤获取数据 -->
      <div v-if="!analysisData" class="text-center py-20">
        <Icon icon="lucide:arrow-left" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-gray-600 mb-2">请先完成前面的步骤</h3>
        <p class="text-gray-500">需要先完成文法分析和DFA构造才能建立分析表</p>
      </div>

      <div v-else class="space-y-8">

        <!-- 替换原有分析表区域为ParsingTable组件 -->
        <div v-if="tableProps" class="mt-6">
          <ParsingTable
            v-bind="tableProps"
            @validation-complete="handleValidation"
            @step-complete="handleStepComplete"
          />
        </div>

        <!-- 数据格式异常的后备显示 -->
        <div v-else-if="!tableProps" class="text-center py-12">
          <Icon icon="lucide:alert-triangle" class="w-12 h-12 mx-auto mb-3 text-yellow-500" />
          <p class="text-lg font-medium text-gray-600">数据加载异常</p>
          <p class="text-sm text-gray-500 mt-1">请检查前面的步骤是否正确完成</p>
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
        <div class="text-sm text-gray-500">步骤 4 / 5</div>
        <button
          @click="nextStep"
          :disabled="!isStepComplete"
          :class="[
            'px-6 py-2 rounded-lg transition-colors',
            isStepComplete
              ? 'bg-cyan-600 text-white hover:bg-cyan-700'
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
import { ref, computed, nextTick, onMounted, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { useSLR1Store } from '@/stores/slr1'
import ParsingTable from '@/components/lr/ParsingTable.vue'
import { instance } from '@viz-js/viz'

const emit = defineEmits<{
  'next-step': []
  'prev-step': []
}>()

const slr1Store = useSLR1Store()

// 步骤完成状态
const stepCompleteStatus = ref(false)

// DFA图渲染相关
const dfaSvg = ref('')
const dfaRendered = ref(false)

// 从store获取分析数据
const analysisData = computed(() => slr1Store.analysisResult)

// 计算属性
const hasDFAData = computed(() => slr1Store.analysisResult !== null && slr1Store.dotString !== '')
const slr1DotString = computed(() => slr1Store.dotString)

// 渲染DFA图
const renderDFA = async () => {
  if (!hasDFAData.value || !slr1DotString.value) return

  try {
    dfaRendered.value = false

    // 渲染SVG
    const viz = await instance()
    const svg = viz.renderSVGElement(slr1DotString.value)

    // 添加样式类
    svg.classList.add('slr1-dfa-svg')
    dfaSvg.value = svg.outerHTML
    dfaRendered.value = true

  } catch (error) {
    console.error('SLR1 DFA render failed:', error)
    dfaSvg.value = `
      <div class="text-center text-red-500 p-4">
        <p>DFA图渲染失败: ${error instanceof Error ? error.message : String(error)}</p>
      </div>
    `
  }
}

// 组件挂载时渲染DFA图
onMounted(async () => {
  await nextTick()
  if (hasDFAData.value) {
    await renderDFA()
  }
})

// 监听DFA数据变化，重新渲染
watch(hasDFAData, async (newValue) => {
  if (newValue) {
    await nextTick()
    await renderDFA()
  }
})

// FOLLOW集数据 - 从store获取
const followSets = computed(() => slr1Store.followSets)

// 计算属性
const terminals = computed(() => {
  if (!analysisData.value?.Vt) return []
  return analysisData.value.Vt.map((item: any) => item.text || item)
})

const nonterminals = computed(() => {
  if (!analysisData.value?.Vn) return []
  return analysisData.value.Vn.filter((item: any) => {
    const text = item.text || item
    return text !== analysisData.value?.S + "'"
  }).map((item: any) => item.text || item)
})

// 数据转换函数 - 将SLR1数据格式转换为ParsingTable组件期望的格式
const convertSLR1CorrectAnswers = () => {
  if (!analysisData.value) return { actions: {}, gotos: {} }

  const actions: Record<string, string> = {}
  const gotos: Record<string, string> = {}

  console.log('=== SLR1 数据转换调试 ===')
  console.log('原始 actions 数据:', analysisData.value.actions)
  console.log('原始 gotos 数据:', analysisData.value.gotos)

  // 处理actions数据（SLR1 store中actions已经是Record<string, string>格式）
  if (analysisData.value.actions && typeof analysisData.value.actions === 'object') {
    // 直接使用后端返回的数据，后端已经使用正确的格式（state|symbol）
    Object.entries(analysisData.value.actions).forEach(([key, value]) => {
      // 后端返回的键值格式应该已经是 state|# 的形式
      actions[key] = value
      console.log(`Action: ${key} = ${value}`)
    })
  }

  // 处理gotos数据
  if (analysisData.value.gotos && typeof analysisData.value.gotos === 'object') {
    Object.entries(analysisData.value.gotos).forEach(([key, value]) => {
      gotos[key] = value
      console.log(`Goto: ${key} = ${value}`)
    })
  }

  console.log('转换后的 actions:', actions)
  console.log('转换后的 gotos:', gotos)

  return { actions, gotos }
}

// 为ParsingTable组件准备数据
const tableProps = computed(() => {
  try {
    if (!analysisData.value) return null

    // 验证必要的数据字段
    if (!analysisData.value.Vt || !analysisData.value.Vn) {
      console.warn('缺少终结符或非终结符数据')
      return null
    }

    const answers = convertSLR1CorrectAnswers()

    console.log('=== SLR1TableBuild 传递给 ParsingTable 的数据 ===')
    console.log('tableType: SLR1')
    console.log('terminals:', terminals.value)
    console.log('nonterminals:', nonterminals.value)
    console.log('answers:', answers)
    console.log('actions键值数量:', Object.keys(answers.actions).length)
    console.log('gotos键值数量:', Object.keys(answers.gotos).length)

    return {
      tableType: 'SLR1' as const,
      analysisData: analysisData.value,
      terminals: terminals.value,
      nonterminals: nonterminals.value,
      correctAnswers: answers,
    }
  } catch (error) {
    console.error('准备表格数据时出错:', error)
    return null
  }
})

// 计算属性 - 步骤完成状态
const isStepComplete = computed(() => {
  return stepCompleteStatus.value && analysisData.value !== null
})

// 处理验证完成事件
const handleValidation = (result: { isValid: boolean; errors: any[] }) => {
  console.log('SLR1验证结果:', result)
  // 可以在这里添加额外的验证逻辑
}

// 处理步骤完成状态
const handleStepComplete = (isComplete: boolean) => {
  stepCompleteStatus.value = isComplete
}

// 下一步
const nextStep = () => {
  if (isStepComplete.value) {
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
  background: #cffafe;
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

/* SLR1 DFA SVG 样式 */
:deep(.slr1-dfa-svg) {
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
</style>
