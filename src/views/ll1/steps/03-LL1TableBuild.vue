<template>
  <div class="ll1-table-build-step">
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
        <div class="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-xl p-6 mb-6 border border-green-100 shadow-sm">
          <div class="flex items-center mb-4">
            <div class="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center mr-3">
              <Icon icon="lucide:info" class="w-4 h-4 text-white" />
            </div>
            <h3 class="text-lg font-semibold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">构建说明</h3>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 bg-gray-200 rounded"></div>
              <span class="text-sm text-gray-700">已知信息</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 bg-gradient-to-r from-amber-300 to-orange-300 rounded"></div>
              <span class="text-sm text-gray-700">待填写</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 bg-green-200 rounded"></div>
              <span class="text-sm text-gray-700">校验正确</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 bg-red-200 rounded"></div>
              <span class="text-sm text-gray-700">校验错误</span>
            </div>
          </div>
          <div class="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-green-200/50">
            <div class="text-sm text-gray-700 space-y-2">
              <p>根据 First 集合和 Follow 集合，填写产生式，构造 LL1 分析表</p>
              <div class="flex items-start">
                <span class="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>对于产生式 A → α，将 <span class="font-mono text-green-600">A->α</span> 填入 <span class="font-mono text-green-600">M[A, a]</span>，其中 <span class="font-mono text-green-600">a ∈ First(α)</span></span>
              </div>
              <div class="flex items-start">
                <span class="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>如果 <span class="font-mono text-green-600">ε ∈ First(α)</span>，将 <span class="font-mono text-green-600">A->α</span> 填入 <span class="font-mono text-green-600">M[A, b]</span>，其中 <span class="font-mono text-green-600">b ∈ Follow(A)</span></span>
              </div>
            </div>
          </div>
        </div>

        <!-- First/Follow集摘要 -->
        <div class="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">First/Follow集摘要</h3>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 class="font-medium text-gray-800 mb-2">First集</h4>
              <div class="space-y-1 text-sm">
                <div v-for="(symbols, symbol) in firstSets" :key="`first-${symbol}`" class="flex">
                  <span class="w-16 font-mono text-emerald-700">{{ symbol }}:</span>
                  <span class="text-emerald-600">{ {{ symbols.join(', ') }} }</span>
                </div>
              </div>
            </div>
            <div>
              <h4 class="font-medium text-gray-800 mb-2">Follow集</h4>
              <div class="space-y-1 text-sm">
                <div v-for="(symbols, symbol) in followSets" :key="`follow-${symbol}`" class="flex">
                  <span class="w-16 font-mono text-blue-700">{{ symbol }}:</span>
                  <span class="text-blue-600">{ {{ symbols.join(', ') }} }</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 调试面板 -->
        <div class="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 rounded-xl p-4 mb-6 border border-orange-100 shadow-sm">
          <div class="flex items-center mb-3">
            <div class="w-6 h-6 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-lg flex items-center justify-center mr-2">
              <Icon icon="lucide:bug" class="w-3 h-3 text-white" />
            </div>
            <h4 class="text-sm font-semibold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">调试信息</h4>
          </div>
          <div class="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-orange-200/50">
            <div class="text-xs text-gray-700 space-y-1">
              <div><strong>Table 数据类型:</strong> {{ typeof originalData?.table }}</div>
              <div><strong>Table 内容:</strong> {{ JSON.stringify(originalData?.table) }}</div>
              <div><strong>所需填写项数量:</strong> {{ getRequiredTableEntries().length }}</div>
              <div>
                <strong>所需填写项:</strong> {{ getRequiredTableEntries().join(', ') || '无' }}
              </div>
              <div><strong>全部完成状态:</strong> {{ allCompleted }}</div>
            </div>
          </div>
        </div>

        <!-- 主要内容区域 -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          <!-- 左侧：产生式列表 -->
          <div class="lg:col-span-3">
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                  <Icon icon="lucide:list" class="w-5 h-5 mr-2 text-blue-500" />
                  产生式
                </h3>
                <div class="text-xs text-gray-500 flex items-center gap-2">
                  <span class="flex items-center gap-1">
                    <Icon icon="lucide:grip-vertical" class="w-3 h-3 text-blue-400" />
                    <span>拖拽到表格</span>
                  </span>
                  <span class="flex items-center gap-1">
                    <Icon icon="lucide:copy" class="w-3 h-3 text-blue-400" />
                    <span>双击复制</span>
                  </span>
                </div>
              </div>
              <div class="space-y-1.5">
                <div
                  v-for="(productions, nonTerminal) in originalData.formulas_dict"
                  :key="nonTerminal"
                  class="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-md border border-blue-200/50 p-1.5 shadow-sm"
                >
                  <div class="font-mono text-xs text-blue-700 font-medium mb-1 flex items-center">
                    <Icon icon="lucide:tag" class="w-2.5 h-2.5 mr-1 text-blue-500" />
                    {{ nonTerminal }}
                  </div>
                  <div class="space-y-0.5">
                    <div
                      v-for="(production, index) in productions"
                      :key="index"
                      class="flex items-center"
                    >
                      <div
                        class="flex-1 bg-white/80 backdrop-blur-sm rounded border border-blue-200/60 px-1.5 py-1 hover:border-blue-300 hover:bg-blue-50/80 hover:shadow-md transition-all duration-150 cursor-move select-none group shadow-sm"
                        draggable="true"
                        @dragstart="onProductionDragStart(`${nonTerminal}->${production}`, $event)"
                        @dblclick="onProductionDblClick(`${nonTerminal}->${production}`)"
                      >
                        <div class="flex items-center justify-between">
                          <span class="font-mono text-xs text-gray-700">
                            <span class="text-blue-700 font-semibold">{{ nonTerminal }}</span>
                            <span class="text-blue-400 mx-0.5">→</span>
                            <span class="text-gray-700">{{ production }}</span>
                          </span>
                          <div class="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Icon icon="lucide:grip-vertical" class="w-2 h-2 text-blue-400" title="拖拽" />
                            <Icon icon="lucide:copy" class="w-2 h-2 text-blue-400" title="双击复制" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧：LL1分析表 -->
          <div class="lg:col-span-9">
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                  <Icon icon="lucide:table" class="w-5 h-5 mr-2 text-green-600" />
                  LL1 分析表
                </h3>
                <button
                  @click="checkTable"
                  :disabled="checking"
                  class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                >
                  <Icon v-if="checking" icon="lucide:loader-2" class="w-4 h-4 animate-spin mr-2" />
                  校验分析表
                </button>
              </div>

              <!-- 操作提示 -->
              <div class="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-md">
                <div class="text-xs text-blue-700 flex items-center gap-4">
                  <span class="flex items-center gap-1">
                    <Icon icon="lucide:mouse-pointer" class="w-3 h-3" />
                    <span>从左侧拖拽产生式到表格中</span>
                  </span>
                  <span class="flex items-center gap-1">
                    <Icon icon="lucide:keyboard" class="w-3 h-3" />
                    <span>或直接手动输入产生式</span>
                  </span>
                </div>
              </div>

              <!-- LL1分析表 -->
              <div class="overflow-x-auto">
                <table class="min-w-full border border-gray-300">
                  <thead class="bg-green-50">
                    <tr>
                      <th
                        class="border border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase"
                      >
                        非终结符
                      </th>
                      <th
                        v-for="terminal in terminals"
                        :key="terminal"
                        class="border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-700 uppercase"
                      >
                        {{ terminal }}
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white">
                    <tr v-for="nonTerminal in nonTerminals" :key="nonTerminal">
                      <td
                        class="border border-gray-300 px-3 py-2 font-mono font-semibold text-green-700"
                      >
                        {{ nonTerminal }}
                      </td>
                      <td
                        v-for="terminal in terminals"
                        :key="`${nonTerminal}-${terminal}`"
                        class="border border-gray-300 px-1 py-1"
                      >
                        <input
                          v-model="userTable[`${nonTerminal}|${terminal}`]"
                          type="text"
                          placeholder="拖拽产生式到此处或手动输入"
                          :class="[
                            'w-full px-2 py-1 text-xs text-center border-0 focus:ring-2 focus:ring-green-500 transition-colors',
                            getTableCellClass(nonTerminal, terminal),
                          ]"
                          @focus="clearTableValidation(nonTerminal, terminal)"
                          @dragover.prevent
                          @drop="onTableDrop($event, nonTerminal, terminal)"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- 校验结果提示 -->
              <div
                v-if="tableValidated && !hasTableErrors"
                class="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg"
              >
                <div class="flex items-center">
                  <Icon icon="lucide:check-circle" class="w-5 h-5 text-green-500 mr-2" />
                  <p class="text-sm text-green-700 font-medium">
                    LL1 分析表校验成功！该文法是 LL1 文法。
                  </p>
                </div>
              </div>

              <div
                v-if="tableValidated && hasTableErrors"
                class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <div class="flex items-center mb-2">
                  <Icon icon="lucide:alert-triangle" class="w-5 h-5 text-red-500 mr-2" />
                  <p class="text-sm text-red-700 font-medium">分析表校验失败，请检查错误项目</p>
                </div>
                <p class="text-xs text-red-600">
                  剩余 {{ remainingAttempts }} 次尝试，超过限制将显示正确答案
                </p>
              </div>

              <!-- 显示答案 -->
              <div v-if="showAnswer" class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 class="text-sm font-medium text-blue-800 mb-3">正确答案：</h4>
                <div class="overflow-x-auto">
                  <table class="min-w-full border border-blue-300 text-xs">
                    <thead class="bg-blue-100">
                      <tr>
                        <th
                          class="border border-blue-300 px-2 py-1 text-left font-medium text-blue-700"
                        >
                          非终结符
                        </th>
                        <th
                          v-for="terminal in terminals"
                          :key="terminal"
                          class="border border-blue-300 px-2 py-1 text-center font-medium text-blue-700"
                        >
                          {{ terminal }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="nonTerminal in nonTerminals" :key="nonTerminal">
                        <td
                          class="border border-blue-300 px-2 py-1 font-mono font-semibold text-blue-700"
                        >
                          {{ nonTerminal }}
                        </td>
                        <td
                          v-for="terminal in terminals"
                          :key="`${nonTerminal}-${terminal}`"
                          class="border border-blue-300 px-2 py-1 text-center text-blue-600"
                        >
                          {{ getCorrectTableEntry(nonTerminal, terminal) || '-' }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 构建规则提示 -->
        <div class="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-6 mb-6 border border-indigo-100 shadow-sm">
          <div class="flex items-center mb-4">
            <div class="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
              <Icon icon="lucide:book-open" class="w-4 h-4 text-white" />
            </div>
            <h4 class="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">构建规则</h4>
          </div>
          <div class="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-indigo-200/50">
            <div class="text-sm text-gray-700 space-y-3">
              <div class="flex items-start">
                <span class="w-2 h-2 bg-indigo-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <div>
                  <span class="font-semibold text-indigo-800">步骤 1：</span>对于每个产生式 A → α，执行以下步骤：
                  <div class="ml-4 mt-2 space-y-2">
                    <div class="flex items-start">
                      <span class="w-1.5 h-1.5 bg-indigo-300 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      <span>对于 <span class="font-mono text-indigo-600">First(α)</span> 中的每个终结符 <span class="font-mono text-indigo-600">a</span>，将 <span class="font-mono text-indigo-600">A->α</span> 加入到 <span class="font-mono text-indigo-600">M[A, a]</span></span>
                    </div>
                    <div class="flex items-start">
                      <span class="w-1.5 h-1.5 bg-indigo-300 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      <span>如果 <span class="font-mono text-indigo-600">ε ∈ First(α)</span>，对于 <span class="font-mono text-indigo-600">Follow(A)</span> 中的每个终结符 <span class="font-mono text-indigo-600">b</span>，将 <span class="font-mono text-indigo-600">A->α</span> 加入到 <span class="font-mono text-indigo-600">M[A, b]</span></span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex items-start">
                <span class="w-2 h-2 bg-indigo-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span><span class="font-semibold text-indigo-800">步骤 2：</span>将所有无定义的条目标记为错误</span>
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
        <div class="text-sm text-gray-500">步骤 3 / 4</div>
        <button
          @click="$emit('next-step')"
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { Icon } from '@iconify/vue'
import { useLL1Store } from '@/stores/ll1'
import { useCommonStore } from '@/stores/common'

// 获取 Store 实例
const ll1Store = useLL1Store()
const commonStore = useCommonStore()

// 解构响应式状态（用于模板绑定）
const { originalData, parseTable, firstSets, followSets } = storeToRefs(ll1Store)
const { loading } = storeToRefs(commonStore)

// 定义 emits
defineEmits<{
  'next-step': []
  'prev-step': []
  complete: [data: any]
}>()

// 计算非终结符和终结符
const nonTerminals = computed(() => originalData.value?.Vn || [])
const terminals = computed(() => {
  if (!originalData.value?.Vt) return []
  // 添加 $ 符号
  const terminalSet = new Set([...originalData.value.Vt, '$'])
  return Array.from(terminalSet).sort()
})

// 用户输入的分析表
const userTable = ref<Record<string, string>>({})

// 校验状态
const tableValidation = ref<Record<string, 'correct' | 'incorrect' | ''>>({})
const checking = ref(false)
const tableValidated = ref(false)
const showAnswer = ref(false)
const attempts = ref(0)
const maxAttempts = 3

// 计算属性
const hasTableErrors = computed(() => {
  return Object.values(tableValidation.value).some((status) => status === 'incorrect')
})

const remainingAttempts = computed(() => Math.max(0, maxAttempts - attempts.value))

const allCompleted = computed(() => {
  if (!originalData.value) return false

  // 检查所有需要填写的表格项是否都正确
  const requiredEntries = getRequiredTableEntries()

  // 如果没有需要填写的项，需要至少完成一次校验且没有错误
  if (requiredEntries.length === 0) {
    return tableValidated.value && !hasTableErrors.value
  }

  // 检查是否所有需要填写的项都已正确校验
  return requiredEntries.every((key) => tableValidation.value[key] === 'correct')
})

// 复制提示
const copyTip = ref('')
let copyTipTimer: number | null = null

// 拖拽事件处理函数
function onProductionDragStart(production: string, event: DragEvent) {
  // 将产生式内容写入拖拽数据
  event.dataTransfer?.setData('text/plain', production)
}

// 双击产生式卡片复制到剪贴板并弹出提示
function onProductionDblClick(production: string) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(production).then(() => {
      showCopyTip(`已复制：${production}`)
    })
  } else {
    // 兼容性处理
    const textarea = document.createElement('textarea')
    textarea.value = production
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    showCopyTip(`已复制：${production}`)
  }
}

function showCopyTip(msg: string) {
  copyTip.value = msg
  if (copyTipTimer) clearTimeout(copyTipTimer)
  copyTipTimer = window.setTimeout(() => {
    copyTip.value = ''
  }, 1200)
}

// 拖拽放置处理函数
function onTableDrop(event: DragEvent, nonTerminal: string, terminal: string) {
  event.preventDefault()
  const production = event.dataTransfer?.getData('text/plain')
  if (production) {
    const key = `${nonTerminal}|${terminal}`
    userTable.value[key] = production
    // 清除验证状态，让用户重新校验
    tableValidation.value[key] = ''
  }
}

// 工具函数
const getRequiredTableEntries = (): string[] => {
  if (!originalData.value?.table) return []

  // table 是 Record<string, string> 格式，键为 "Vn|Vt" 形式（后端用|分隔）
  return Object.keys(originalData.value.table)
}

const getCorrectTableEntry = (nonTerminal: string, terminal: string): string => {
  if (!originalData.value?.table) return ''

  // 后端使用 | 作为分隔符
  const key = `${nonTerminal}|${terminal}`
  const rawValue = originalData.value.table[key] || ''

  // 如果后端返回的是产生式的右部（如 "AB"），需要转换为产生式格式（如 "S->AB"）
  if (rawValue && !rawValue.includes('->')) {
    return `${nonTerminal}->${rawValue}`
  }

  return rawValue
}

const getTableCellClass = (nonTerminal: string, terminal: string): string => {
  // 使用 | 分隔符匹配后端格式
  const key = `${nonTerminal}|${terminal}`
  const validation = tableValidation.value[key]

  if (validation === 'correct') {
    return 'bg-green-50 border-green-300'
  } else if (validation === 'incorrect') {
    return 'bg-red-50 border-red-300'
  }

  // 检查是否为需要填写的项
  const correctEntry = getCorrectTableEntry(nonTerminal, terminal)
  if (correctEntry) {
    return 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300' // 待填写
  }

  return 'bg-gray-100' // 不需要填写
}

const clearTableValidation = (nonTerminal: string, terminal: string) => {
  // 使用 | 分隔符匹配后端格式
  const key = `${nonTerminal}|${terminal}`
  if (tableValidation.value[key] !== 'correct') {
    tableValidation.value[key] = ''
  }
}

// 校验函数
const checkTable = async () => {
  if (!originalData.value?.table) return

  checking.value = true
  attempts.value++

  try {
    const requiredEntries = getRequiredTableEntries()

    // 如果没有需要填写的项，直接通过校验
    if (requiredEntries.length === 0) {
      tableValidated.value = true
      showAnswer.value = false
      console.log('No table entries required, validation passed automatically')
      return
    }

    let isAllCorrect = true

    // 校验所有需要填写的项
    for (const key of requiredEntries) {
      const [nonTerminal, terminal] = key.split('|')
      const userInput = (userTable.value[key] || '').trim()
      const correctEntry = getCorrectTableEntry(nonTerminal, terminal)

      // 检查用户输入是否为空
      if (userInput === '') {
        tableValidation.value[key] = 'incorrect'
        isAllCorrect = false
        continue
      }

      // 标准化用户输入和正确答案进行比较
      const normalizedUserInput = userInput.trim()
      const normalizedCorrectEntry = correctEntry.trim()

      // 检查用户输入是否匹配正确答案（支持多种格式）
      const isCorrect = normalizedUserInput === normalizedCorrectEntry ||
                       normalizedUserInput === correctEntry.replace('->', '') ||
                       normalizedUserInput === `${nonTerminal}->${correctEntry.replace('->', '')}`

      if (isCorrect) {
        tableValidation.value[key] = 'correct'
      } else {
        tableValidation.value[key] = 'incorrect'
        isAllCorrect = false
      }
    }

    tableValidated.value = true

    if (isAllCorrect) {
      showAnswer.value = false
      console.log('LL1 table validation completed successfully')
      // 可以在这里添加成功提示
    } else {
      if (attempts.value >= maxAttempts) {
        // 显示正确答案
        for (const key of requiredEntries) {
          const [nonTerminal, terminal] = key.split('|')
          const correctEntry = getCorrectTableEntry(nonTerminal, terminal)
          userTable.value[key] = correctEntry // 显示产生式格式
          tableValidation.value[key] = 'correct'
        }
        showAnswer.value = true
      }
    }
  } finally {
    checking.value = false
  }
}

// 初始化和重置函数
const initializeState = () => {
  if (originalData.value) {
    console.log('Initializing LL1 table state with:', originalData.value)
    console.log('Table data:', originalData.value.table)
    console.log('Required entries:', getRequiredTableEntries())

    // 初始化用户输入表格
    nonTerminals.value.forEach((nt) => {
      terminals.value.forEach((t) => {
        const key = `${nt}|${t}` // 使用 | 分隔符匹配后端格式
        userTable.value[key] = ''
        tableValidation.value[key] = ''
      })
    })
  }
}

// 监听原始数据变化，重新初始化状态
watch(
  () => originalData.value,
  (newData) => {
    if (newData) {
      initializeState()
    }
  },
  { immediate: true },
)

// 组件挂载时初始化
onMounted(() => {
  initializeState()
})
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
</style>
