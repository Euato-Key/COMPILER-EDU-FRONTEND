<template>
  <div class="string-analysis-step">
    <div class="step-header">
      <div class="flex items-center gap-4">
        <div class="step-icon">
          <Icon icon="lucide:play-circle" class="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-900">字符串分析</h2>
          <p class="text-gray-600 mt-1">第五步：使用LR0分析表分析输入字符串</p>
        </div>
      </div>
    </div>

    <div class="step-content">
      <!-- 说明区域和文法信息 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- LR0分析过程说明 -->
        <div class="bg-green-50 border border-green-200 rounded-lg p-6">
          <div class="flex items-start">
            <Icon icon="lucide:info" class="w-5 h-5 text-green-600 mt-0.5 mr-3" />
            <div>
              <h3 class="text-lg font-semibold text-green-900 mb-2">LR0分析过程</h3>
              <ul class="space-y-1 text-sm text-green-800">
                <li>• <strong>移进：</strong>将输入符号压入符号栈，状态压入状态栈</li>
                <li>• <strong>规约：</strong>根据产生式弹出栈中符号和状态，压入左部符号</li>
                <li>• <strong>接受：</strong>当遇到接受动作时，输入串被成功分析</li>
                <li>• <strong>错误：</strong>无对应动作时，分析失败</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 文法信息 -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div class="flex items-start">
            <Icon icon="lucide:file-text" class="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-blue-900 mb-2">当前文法</h3>
              <div v-if="grammarInfo" class="space-y-2">
                <div class="bg-white/60 rounded-lg p-3 border border-blue-200">
                  <div class="text-sm text-blue-800 font-medium mb-2">产生式：</div>
                  <div class="space-y-1">
                    <div
                      v-for="(production, index) in numberedProductions"
                      :key="production"
                      class="text-xs font-mono text-blue-700"
                    >
                      r{{ index + 1 }}: {{ production }}
                    </div>
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-3 text-xs">
                  <div class="bg-white/60 rounded p-2 border border-blue-200">
                    <span class="text-blue-600 font-medium">开始符号：</span>
                    <span class="font-mono font-semibold text-blue-800">{{ grammarInfo.S }}</span>
                  </div>
                  <div class="bg-white/60 rounded p-2 border border-blue-200">
                    <span class="text-blue-600 font-medium">非终结符：</span>
                    <span class="font-mono text-blue-800">{{ grammarInfo.Vn.join(', ') }}</span>
                  </div>
                </div>
              </div>
              <div v-else class="text-sm text-blue-600 italic">
                暂无文法信息，请先完成前面的步骤
              </div>
            </div>
          </div>
        </div>
      </div>



      <!-- 检查前置条件 -->
      <div v-if="!analysisData" class="text-center py-20">
        <Icon icon="lucide:arrow-left" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-gray-600 mb-2">请先完成前面的步骤</h3>
        <p class="text-gray-500">需要先完成文法分析和分析表构造才能进行字符串分析</p>
      </div>

      <div v-else class="space-y-8">
        <!-- 输入字符串 -->
        <div class="bg-white border border-gray-200 rounded-lg p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">输入待分析字符串</h3>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                输入字符串（单字符，系统自动添加结束符#）
              </label>
              <div class="flex gap-2">
                <input
                  v-model="inputString"
                  placeholder="例如: ab"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  @keydown.enter="analyzeString"
                />
                <button
                  @click="analyzeString"
                  :disabled="!inputString.trim() || isAnalyzing"
                  class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                >
                  <Icon
                    :icon="isAnalyzing ? 'lucide:loader-2' : 'lucide:play'"
                    :class="['w-4 h-4', isAnalyzing ? 'animate-spin' : '']"
                  />
                  {{ isAnalyzing ? '分析中...' : '开始分析' }}
                </button>
                <button
                  @click="resetAnalysis"
                  class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  重置
                </button>
              </div>
            </div>

            <!-- 输入提示 -->
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div class="flex items-start gap-2 text-sm text-blue-700">
                <Icon icon="lucide:info" class="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p class="font-medium mb-1">💡 输入建议</p>
                  <p class="text-xs">• 建议使用单字符（如：a、b、c、1、2、+、-、(、)等）</p>
                  <p class="text-xs">• 系统会自动添加结束符 #，无需手动输入</p>
                  <p class="text-xs">• 支持各种符号，如运算符、括号等</p>
                </div>
              </div>
            </div>

            <!-- 示例字符串 -->
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center gap-2 mb-3">
                <Icon icon="lucide:list" class="w-4 h-4 text-gray-500" />
                <span class="text-sm font-semibold text-gray-800">示例字符串</span>
                <span class="text-xs text-gray-500">(点击使用)</span>
              </div>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="example in exampleStrings"
                  :key="example"
                  @click="inputString = example"
                  class="px-3 py-1.5 text-sm bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 hover:border-gray-300 font-mono"
                >
                  {{ example }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- LR0分析表 -->
        <div v-if="analysisResult" class="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">LR0分析表</h3>
            <p class="text-sm text-gray-600 mt-1">用于字符串分析的Action表和Goto表</p>
          </div>

          <div class="p-6">
            <!-- 分析表 -->
            <div class="overflow-x-auto">
              <table class="min-w-full border border-gray-300">
                <!-- 表头 -->
                <thead class="bg-gray-50">
                  <!-- 分组表头行 -->
                  <tr>
                    <th
                      rowspan="2"
                      class="px-3 py-2 border border-gray-300 text-xs font-medium text-gray-900 bg-gray-100"
                    >
                      State
                    </th>
                    <th
                      :colspan="terminals.length + 1"
                      class="px-3 py-2 border border-gray-300 text-xs font-bold text-blue-900 bg-blue-100 text-center"
                    >
                      ACTION
                    </th>
                    <th
                      :colspan="nonterminals.length"
                      class="px-3 py-2 border border-gray-300 text-xs font-bold text-green-900 bg-green-100 text-center"
                    >
                      GOTO
                    </th>
                  </tr>
                  <!-- 具体列名行 -->
                  <tr>
                    <!-- ACTION列 -->
                    <th
                      v-for="terminal in terminals"
                      :key="terminal"
                      class="px-3 py-2 border border-gray-300 text-xs font-medium text-gray-900 bg-blue-50"
                    >
                      {{ terminal }}
                    </th>
                    <th
                      class="px-3 py-2 border border-gray-300 text-xs font-medium text-gray-900 bg-blue-50"
                    >
                      #
                    </th>
                    <!-- GOTO列 -->
                    <th
                      v-for="nonterminal in nonterminals"
                      :key="nonterminal"
                      class="px-3 py-2 border border-gray-300 text-xs font-medium text-gray-900 bg-green-50"
                    >
                      {{ nonterminal }}
                    </th>
                  </tr>
                </thead>

                <!-- 表体 -->
                <tbody>
                  <tr v-for="stateIndex in stateCount" :key="stateIndex - 1" class="hover:bg-gray-50">
                    <td
                      class="px-3 py-2 border border-gray-300 text-xs font-bold bg-gray-50 text-center"
                    >
                      I{{ stateIndex - 1 }}
                    </td>

                    <!-- ACTION单元格 -->
                    <td
                      v-for="terminal in [...terminals, '#']"
                      :key="`action-${stateIndex - 1}-${terminal}`"
                      class="px-2 py-1 border border-gray-300 text-xs text-center"
                    >
                      {{ getActionValue(stateIndex - 1, terminal) }}
                    </td>

                    <!-- GOTO单元格 -->
                    <td
                      v-for="nonterminal in nonterminals"
                      :key="`goto-${stateIndex - 1}-${nonterminal}`"
                      class="px-2 py-1 border border-gray-300 text-xs text-center"
                    >
                      {{ getGotoValue(stateIndex - 1, nonterminal) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 表说明 -->
            <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div class="bg-blue-50 p-3 rounded">
                <h4 class="font-medium text-blue-900 mb-1">ACTION动作</h4>
                <ul class="text-xs text-blue-700 space-y-1">
                  <li>• Si: 移进到状态i</li>
                  <li>• rj: 用产生式j规约</li>
                  <li>• acc: 接受</li>
                </ul>
              </div>
              <div class="bg-green-50 p-3 rounded">
                <h4 class="font-medium text-green-900 mb-1">GOTO函数</h4>
                <ul class="text-xs text-green-700 space-y-1">
                  <li>• 数字: 转移到对应状态</li>
                  <li>• 空白: 无转移</li>
                </ul>
              </div>
              <div class="bg-purple-50 p-3 rounded">
                <h4 class="font-medium text-purple-900 mb-1">产生式编号</h4>
                <ul class="text-xs text-purple-700 space-y-1">
                  <li v-for="(production, index) in numberedProductions" :key="production">
                    • r{{ index + 1 }}: {{ production }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- LR0移进-规约分析答题表 -->
        <div v-if="analysisResult" class="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">LR0移进-规约分析答题表</h3>
            <p class="text-sm text-gray-600 mt-1">请手动填写分析步骤</p>
          </div>

          <div class="p-6">
            <!-- 答题表 -->
            <div class="overflow-x-auto">
              <table class="min-w-full border border-gray-300">
                <!-- 表头 -->
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-3 py-2 border border-gray-300 text-xs font-medium text-gray-900 bg-gray-100">
                      步骤
                    </th>
                    <th class="px-3 py-2 border border-gray-300 text-xs font-medium text-gray-900 bg-gray-100">
                      状态栈
                    </th>
                    <th class="px-3 py-2 border border-gray-300 text-xs font-medium text-gray-900 bg-gray-100">
                      符号栈
                    </th>
                    <th class="px-3 py-2 border border-gray-300 text-xs font-medium text-gray-900 bg-gray-100">
                      输入串
                    </th>
                  </tr>
                </thead>

                <!-- 表体 -->
                <tbody>
                  <tr v-for="(step, index) in analysisSteps" :key="index" class="hover:bg-gray-50">
                    <!-- 步骤 -->
                    <td class="px-3 py-2 border border-gray-300 text-xs font-bold bg-gray-50 text-center">
                      {{ index + 1 }}
                    </td>

                    <!-- 状态栈 -->
                    <td class="px-2 py-1 border border-gray-300 text-xs">
                      <input
                        v-model="userAnswers.stateStack[index]"
                        @blur="validateCell(index, 'stateStack')"
                        @input="clearValidation(index, 'stateStack')"
                        :class="getCellStyle(index, 'stateStack')"
                        class="w-full px-1 py-0.5 text-xs text-center border-0 focus:ring-1 focus:ring-blue-500 rounded transition-colors"
                        placeholder="如: 0"
                      />
                    </td>

                    <!-- 符号栈 -->
                    <td class="px-2 py-1 border border-gray-300 text-xs">
                      <input
                        v-model="userAnswers.symbolStack[index]"
                        @blur="validateCell(index, 'symbolStack')"
                        @input="clearValidation(index, 'symbolStack')"
                        :class="getCellStyle(index, 'symbolStack')"
                        class="w-full px-1 py-0.5 text-xs text-center border-0 focus:ring-1 focus:ring-blue-500 rounded transition-colors"
                        placeholder="如: #"
                      />
                    </td>

                    <!-- 输入串 -->
                    <td class="px-2 py-1 border border-gray-300 text-xs">
                      <input
                        v-model="userAnswers.inputString[index]"
                        @blur="validateCell(index, 'inputString')"
                        @input="clearValidation(index, 'inputString')"
                        :class="getCellStyle(index, 'inputString')"
                        class="w-full px-1 py-0.5 text-xs text-center border-0 focus:ring-1 focus:ring-blue-500 rounded transition-colors"
                        placeholder="如: abb#"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 验证状态说明 -->
            <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div class="bg-yellow-50 p-3 rounded">
                <h4 class="font-medium text-yellow-900 mb-1">验证状态</h4>
                <div class="text-xs text-yellow-700 space-y-1">
                  <div class="flex items-center gap-2 mb-1">
                    <div class="w-3 h-3 bg-yellow-200 border border-yellow-400 rounded"></div>
                    <span>未填写</span>
                  </div>
                  <div class="flex items-center gap-2 mb-1">
                    <div class="w-3 h-3 bg-red-200 border border-red-400 rounded"></div>
                    <span>错误</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="w-3 h-3 bg-green-200 border border-green-400 rounded"></div>
                    <span>正确</span>
                  </div>
                </div>
              </div>
              <div class="bg-blue-50 p-3 rounded">
                <h4 class="font-medium text-blue-900 mb-1">填写说明</h4>
                <ul class="text-xs text-blue-700 space-y-1">
                  <li>• 状态栈：当前状态序列</li>
                  <li>• 符号栈：当前符号序列</li>
                  <li>• 输入串：剩余输入字符串</li>
                </ul>
              </div>
              <div class="bg-green-50 p-3 rounded">
                <h4 class="font-medium text-green-900 mb-1">操作</h4>
                <div class="space-y-2">
                  <button
                    @click="validateAll"
                    class="w-full px-3 py-1.5 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    验证答案
                  </button>
                  <button
                    @click="showCorrectAnswers"
                    class="w-full px-3 py-1.5 text-xs border border-green-300 text-green-700 rounded hover:bg-green-50 transition-colors"
                  >
                    {{ showAnswers ? '隐藏答案' : '查看答案' }}
                  </button>
                  <button
                    @click="clearAll"
                    class="w-full px-3 py-1.5 text-xs border border-red-300 text-red-700 rounded hover:bg-red-50 transition-colors"
                  >
                    一键清除
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 分析结果 -->
        <div v-if="analysisResult" class="bg-white border border-gray-200 rounded-lg p-6">
          <div
            :class="[
              'p-4 rounded-lg border',
              analysisResult.info_res === 'Success!'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800',
            ]"
          >
            <div class="flex items-start gap-2">
              <Icon
                :icon="
                  analysisResult.info_res === 'Success!'
                    ? 'lucide:check-circle'
                    : 'lucide:alert-circle'
                "
                class="w-5 h-5 mt-0.5 flex-shrink-0"
              />
              <div class="flex-1">
                <p class="font-medium">
                  {{ analysisResult.info_res === 'Success!' ? '字符串分析成功' : '字符串分析失败' }}
                </p>
                <p class="text-sm mt-1">{{ analysisResult.info_res }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 分析过程表（答案参考） -->
        <div
          v-if="analysisSteps.length > 0 && showAnswers"
          class="bg-white border border-gray-200 rounded-lg overflow-hidden"
        >
          <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">标准答案参考</h3>
            <p class="text-sm text-gray-600 mt-1">LR0移进-规约分析过程</p>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-900 border-b">
                    步骤
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-900 border-b">
                    状态栈
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-900 border-b">
                    符号栈
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-900 border-b">
                    输入串
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-900 border-b">
                    动作
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(step, index) in analysisSteps"
                  :key="index"
                  :class="[
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50',
                    step.isAccept ? 'bg-green-50' : '',
                    step.isError ? 'bg-red-50' : '',
                  ]"
                >
                  <td class="px-4 py-3 text-sm border-b">{{ index + 1 }}</td>
                  <td class="px-4 py-3 text-sm font-mono border-b">{{ step.stateStack }}</td>
                  <td class="px-4 py-3 text-sm font-mono border-b">{{ step.symbolStack }}</td>
                  <td class="px-4 py-3 text-sm font-mono border-b">{{ step.inputString }}</td>
                  <td class="px-4 py-3 text-sm border-b">
                    <span
                      :class="[
                        'px-2 py-1 rounded text-xs font-medium',
                        step.isAccept
                          ? 'bg-green-100 text-green-800'
                          : step.isError
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800',
                      ]"
                    >
                      {{ step.action }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- 步骤操作栏 -->
    <div class="step-actions">
      <div class="flex justify-between items-center">
        <button
          @click="$emit('prev-step')"
          class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Icon icon="lucide:chevron-left" class="w-4 h-4 inline mr-2" />
          上一步
        </button>

        <div class="text-sm text-gray-500">步骤 5 / 5</div>

        <button
          @click="complete"
          :disabled="!isStepComplete"
          :class="[
            'px-6 py-2 rounded-lg transition-colors',
            isStepComplete
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed',
          ]"
        >
          完成分析
          <Icon icon="lucide:check" class="w-4 h-4 inline ml-2" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { useLR0Store } from '@/stores/lr0'
import { useCommonStore } from '@/stores/common'
import type { AnalysisStepInfo } from '@/types'

const emit = defineEmits<{
  'next-step': []
  'prev-step': []
  complete: [data: {
    analysisSteps: {
      step: number
      stateStack: string
      symbolStack: string
      inputString: string
      action: string
      isError: boolean
      isAccept: boolean
    }[]
    analysisResult: AnalysisStepInfo | null
    inputString: string
    timestamp: string
  }]
}>()

const lr0Store = useLR0Store()
const commonStore = useCommonStore()

// 组件状态
const inputString = ref('')

// 示例字符串（单字符格式，不包含#）
const exampleStrings = ['ab', 'a+b', 'a*b', '(a)', 'a', 'b']

// 答题相关状态
const userAnswers = ref<{
  stateStack: string[]
  symbolStack: string[]
  inputString: string[]
}>({
  stateStack: [],
  symbolStack: [],
  inputString: []
})

// 验证状态
const validationStatus = ref<{
  stateStack: { [key: number]: 'empty' | 'correct' | 'error' }
  symbolStack: { [key: number]: 'empty' | 'correct' | 'error' }
  inputString: { [key: number]: 'empty' | 'correct' | 'error' }
}>({
  stateStack: {},
  symbolStack: {},
  inputString: {}
})

// 是否显示正确答案
const showAnswers = ref(false)

// 从store获取状态
const analysisData = computed(() => lr0Store.analysisResult)
const isAnalyzing = computed(() => commonStore.loading)
const analysisResult = computed(() => lr0Store.inputAnalysisResult)
const grammarInfo = computed(() => lr0Store.analysisResult)
const analysisSteps = computed(() => {
  if (lr0Store.inputAnalysisResult) {
    // 构造分析步骤数据
    const steps: {
      step: number
      stateStack: string
      symbolStack: string
      inputString: string
      action: string
      isError: boolean
      isAccept: boolean
    }[] = []
    const result = lr0Store.inputAnalysisResult

    for (let i = 0; i < result.info_step.length; i++) {
      steps.push({
        step: result.info_step[i],
        stateStack: result.info_state_stack?.[i] || '',
        symbolStack: result.info_symbol_stack?.[i] || '',
        inputString: result.info_str?.[i] || '',
        action: result.info_action?.[i] || result.info_msg?.[i] || '',
        isError: false,
        isAccept: result.info_msg?.[i]?.includes('成功') || false,
      })
    }

    return steps
  }
  return []
})

const isStepComplete = computed(() => lr0Store.inputAnalysisResult !== null)

// 带编号的产生式（去除S'->S）
const numberedProductions = computed(() => {
  if (!grammarInfo.value?.formulas_list) return []
  return grammarInfo.value.formulas_list.filter(production => {
    // 过滤掉S'->S的产生式
    return !production.includes("'") && !production.includes('S->S')
  })
})

// 状态数量
const stateCount = computed(() => {
  if (!lr0Store.actionTable) return 0
  const states = new Set<string>()
  Object.keys(lr0Store.actionTable).forEach(key => {
    const state = key.split('|')[0]  // 使用 | 分隔符
    states.add(state)
  })
  return Math.max(...Array.from(states).map(s => parseInt(s))) + 1
})

// 终结符
const terminals = computed(() => {
  if (!grammarInfo.value?.Vt) return []
  return Array.isArray(grammarInfo.value.Vt)
    ? grammarInfo.value.Vt.map((item: string | { text?: string; value?: string }) =>
        typeof item === 'object' ? item.text || item.value || '' : item
      )
    : []
})

// 非终结符（去除S'）
const nonterminals = computed(() => {
  if (!grammarInfo.value?.Vn) return []
  return Array.isArray(grammarInfo.value.Vn)
    ? grammarInfo.value.Vn
        .filter((item: string | { text?: string; value?: string }) => {
          const text = typeof item === 'object' ? item.text || item.value || '' : item
          return text !== (grammarInfo.value?.S || '') + "'"
        })
        .map((item: string | { text?: string; value?: string }) =>
          typeof item === 'object' ? item.text || item.value || '' : item
        )
    : []
})

// 获取Action值
const getActionValue = (state: number, terminal: string) => {
  // 使用正确的键格式：用 | 分隔符
  const key = `${state}|${terminal}`
  // 尝试从store的actionTable获取
  let value = lr0Store.actionTable[key]

  // 如果store中没有，尝试从analysisResult中获取
  if (!value && grammarInfo.value?.actions) {
    value = grammarInfo.value.actions[key]
  }

  return value || '-'
}

// 获取Goto值
const getGotoValue = (state: number, nonterminal: string) => {
  // 使用正确的键格式：用 | 分隔符
  const key = `${state}|${nonterminal}`
  // 尝试从store的gotoTable获取
  let value = lr0Store.gotoTable[key]

  // 如果store中没有，尝试从analysisResult中获取
  if (!value && grammarInfo.value?.gotos) {
    value = grammarInfo.value.gotos[key]
  }

  return value || '-'
}

// 验证单个单元格
const validateCell = (index: number, field: 'stateStack' | 'symbolStack' | 'inputString') => {
  if (!analysisSteps.value[index]) return

  const userValue = userAnswers.value[field][index] || ''
  const correctValue = analysisSteps.value[index][field] || ''

  if (!userValue.trim()) {
    validationStatus.value[field][index] = 'empty'
  } else if (userValue.trim() === correctValue.trim()) {
    validationStatus.value[field][index] = 'correct'
  } else {
    validationStatus.value[field][index] = 'error'
  }
}

// 清除验证状态
const clearValidation = (index: number, field: 'stateStack' | 'symbolStack' | 'inputString') => {
  delete validationStatus.value[field][index]
}

// 获取单元格样式
const getCellStyle = (index: number, field: 'stateStack' | 'symbolStack' | 'inputString') => {
  const status = validationStatus.value[field][index]

  if (showAnswers.value) {
    return 'bg-green-100 border-green-300'
  }

  switch (status) {
    case 'correct':
      return 'bg-green-100 border-green-300'
    case 'error':
      return 'bg-red-100 border-red-300'
    case 'empty':
      return 'bg-yellow-100 border-yellow-300'
    default:
      return 'bg-white border-gray-300'
  }
}

// 验证所有答案
const validateAll = () => {
  analysisSteps.value.forEach((_, index) => {
    validateCell(index, 'stateStack')
    validateCell(index, 'symbolStack')
    validateCell(index, 'inputString')
  })
}

// 显示正确答案
const showCorrectAnswers = () => {
  showAnswers.value = !showAnswers.value
}

// 一键清除所有答案
const clearAll = () => {
  // 清空用户答案
  userAnswers.value = {
    stateStack: new Array(analysisSteps.value.length).fill(''),
    symbolStack: new Array(analysisSteps.value.length).fill(''),
    inputString: new Array(analysisSteps.value.length).fill('')
  }

  // 清空验证状态
  validationStatus.value = {
    stateStack: {},
    symbolStack: {},
    inputString: {}
  }

  // 隐藏答案
  showAnswers.value = false
}

// 监听分析步骤变化，初始化答题数组
const initUserAnswers = () => {
  if (analysisSteps.value.length > 0) {
    userAnswers.value = {
      stateStack: new Array(analysisSteps.value.length).fill(''),
      symbolStack: new Array(analysisSteps.value.length).fill(''),
      inputString: new Array(analysisSteps.value.length).fill('')
    }
    validationStatus.value = {
      stateStack: {},
      symbolStack: {},
      inputString: {}
    }
    showAnswers.value = false
  }
}

// 监听分析步骤变化
watch(analysisSteps, () => {
  initUserAnswers()
}, { immediate: true })

// 分析字符串
const analyzeString = async () => {
  if (!inputString.value?.trim()) {
    commonStore.setError('请输入要分析的字符串')
    return
  }

  if (!lr0Store.analysisResult) {
    commonStore.setError('请先完成文法分析')
    return
  }

  try {
    // 更新store中的输入串
    lr0Store.setInputString(inputString.value.trim())

    // 执行分析
    const success = await lr0Store.analyzeInputString()

    if (success) {
      console.log('LR0字符串分析完成！')
      console.log('分析结果数据:', lr0Store.inputAnalysisResult)
    }
  } catch (error) {
    console.error('分析失败:', error)
    commonStore.setError('分析过程中发生错误')
  }
}

// 重置分析
const resetAnalysis = () => {
  lr0Store.setInputString('')
  commonStore.clearError()
}

// 完成分析
const complete = () => {
  const completionData = {
    analysisSteps: analysisSteps.value,
    analysisResult: analysisResult.value,
    inputString: inputString.value,
    timestamp: new Date().toISOString(),
  }

  emit('complete', completionData)
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
</style>
