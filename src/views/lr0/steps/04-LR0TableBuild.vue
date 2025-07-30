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
            <ul class="space-y-1 text-sm text-indigo-800">
              <li>• <strong>ACTION表：</strong>根据项目集中的项目填写移进和规约动作</li>
              <li>• <strong>GOTO表：</strong>根据DFA的转移关系填写状态转移</li>
              <li>
                • <strong>移进动作：</strong>A → α·aβ，则ACTION[i,a] = Sj（状态j包含A → αa·β）
              </li>
              <li>
                • <strong>规约动作：</strong>A → α·，则对所有终结符a，ACTION[i,a] =
                rk（第k个产生式）
              </li>
              <li>• <strong>接受动作：</strong>S' → S·，则ACTION[i,#] = acc</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- DFA图显示区域 -->
      <div v-if="hasDFAData" class="bg-white border border-gray-200 rounded-lg mb-6">
        <div class="border-b border-gray-200 p-4">
          <h3 class="font-semibold text-gray-900 flex items-center gap-2">
            <Icon icon="lucide:git-merge" class="w-5 h-5 text-indigo-600" />
            LR0项目集规范族DFA图
          </h3>
          <p class="text-sm text-gray-600 mt-1">参考此DFA图填写分析表</p>
        </div>
        <div class="p-4">
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
      </div>

      <!-- 从前面步骤获取数据 -->
      <div v-if="!lr0Store.analysisResult" class="text-center py-20">
        <Icon icon="lucide:arrow-left" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-gray-600 mb-2">请先完成前面的步骤</h3>
        <p class="text-gray-500">需要先完成文法分析和DFA构造才能建立分析表</p>
      </div>

      <!-- 替换原有表格区域为ParsingTable组件 -->
      <div v-else-if="tableProps" class="mt-6">
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
import { ref, computed, nextTick, onMounted, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { useLR0Store } from '@/stores/lr0'
import ParsingTable from '@/components/lr/ParsingTable.vue'
import { instance } from '@viz-js/viz'

const emit = defineEmits<{
  'next-step': []
  'prev-step': []
}>()

const lr0Store = useLR0Store()

// 步骤完成状态
const stepCompleteStatus = ref(false)

// DFA图渲染相关
const dfaSvg = ref('')
const dfaRendered = ref(false)

// 计算属性
const hasDFAData = computed(() => lr0Store.analysisResult !== null && lr0Store.dotString !== '')
const lr0DotString = computed(() => lr0Store.dotString)

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

// 为ParsingTable组件准备数据
const tableProps = computed(() => {
  try {
    if (!lr0Store.analysisResult) return null

    // 验证必要的数据字段
    if (!lr0Store.analysisResult.Vt || !lr0Store.analysisResult.Vn) {
      console.warn('缺少终结符或非终结符数据')
      return null
    }

    // 准备传递给 ParsingTable 的数据
    const answers = {
      actions: lr0Store.actionTable || {},
      gotos: lr0Store.gotoTable || {},
    }

    // 处理终结符和非终结符数据格式
    const terminals = Array.isArray(lr0Store.analysisResult.Vt)
      ? lr0Store.analysisResult.Vt.map((item: any) =>
          typeof item === 'object' ? item.text || item.value : item,
        )
      : []

    const nonterminals = Array.isArray(lr0Store.analysisResult.Vn)
      ? lr0Store.analysisResult.Vn.filter((item: any) => {
          const text = typeof item === 'object' ? item.text || item.value : item
          return text !== (lr0Store.analysisResult?.S || '') + "'"
        }).map((item: any) => (typeof item === 'object' ? item.text || item.value : item))
      : []

    console.log('=== LR0TableBuild 传递给 ParsingTable 的数据 ===')
    console.log('tableType: LR0')
    console.log('原始 Vt:', lr0Store.analysisResult.Vt)
    console.log('处理后 terminals:', terminals)
    console.log('原始 Vn:', lr0Store.analysisResult.Vn)
    console.log('处理后 nonterminals:', nonterminals)
    console.log('actions数据:', answers.actions)
    console.log('gotos数据:', answers.gotos)
    console.log('actions键值数量:', Object.keys(answers.actions).length)
    console.log('gotos键值数量:', Object.keys(answers.gotos).length)

    return {
      tableType: 'LR0' as const,
      analysisData: lr0Store.analysisResult,
      terminals: terminals,
      nonterminals: nonterminals,
      correctAnswers: answers,
    }
  } catch (error) {
    console.error('准备表格数据时出错:', error)
    return null
  }
})

// 计算属性 - 步骤完成状态
const isStepComplete = computed(() => {
  return stepCompleteStatus.value && lr0Store.analysisResult !== null
})

// 处理验证完成事件
const handleValidation = (result: { isValid: boolean; errors: any[] }) => {
  console.log('LR0验证结果:', result)
  // 可以在这里添加额外的验证逻辑
}

// 处理步骤完成状态
const handleStepComplete = (isComplete: boolean) => {
  stepCompleteStatus.value = isComplete
}

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
</style>
