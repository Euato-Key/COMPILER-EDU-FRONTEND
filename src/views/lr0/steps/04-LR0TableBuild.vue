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
              <li>• <strong>移进动作：</strong>A → α·aβ，则ACTION[i,a] = Sj（状态j包含A → αa·β）</li>
              <li>• <strong>规约动作：</strong>A → α·，则对所有终结符a，ACTION[i,a] = rk（第k个产生式）</li>
              <li>• <strong>接受动作：</strong>S' → S·，则ACTION[i,$] = acc</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 从前面步骤获取数据 -->
      <div v-if="!grammarData || !dfaData" class="text-center py-20">
        <Icon icon="lucide:arrow-left" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-gray-600 mb-2">请先完成前面的步骤</h3>
        <p class="text-gray-500">需要先完成文法分析和DFA构造才能建立分析表</p>
      </div>

      <div v-else class="space-y-8">
        <!-- 分析表构建区域 -->
        <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">LR0分析表</h3>
            <p class="text-sm text-gray-600 mt-1">ACTION表和GOTO表的组合</p>
          </div>

          <div class="p-6">
            <!-- 表格头部信息 -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
              <div class="bg-blue-50 p-3 rounded">
                <span class="font-medium text-blue-900">状态数量：</span>
                <span class="text-blue-700">{{ parseTable.length }}</span>
              </div>
              <div class="bg-green-50 p-3 rounded">
                <span class="font-medium text-green-900">终结符：</span>
                <span class="text-green-700">{{ tableHeaders.Vt.join(', ') }}</span>
              </div>
              <div class="bg-purple-50 p-3 rounded">
                <span class="font-medium text-purple-900">非终结符：</span>
                <span class="text-purple-700">{{ tableHeaders.Vn.join(', ') }}</span>
              </div>
            </div>

            <!-- 分析表 -->
            <div class="overflow-x-auto">
              <table class="min-w-full border border-gray-300">
                <!-- 表头 -->
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-3 py-2 border border-gray-300 text-xs font-medium text-gray-900">状态</th>
                    <!-- ACTION列 -->
                    <th v-for="terminal in tableHeaders.Vt" :key="terminal"
                        class="px-3 py-2 border border-gray-300 text-xs font-medium text-gray-900 bg-blue-50">
                      {{ terminal }}
                    </th>
                    <!-- GOTO列 -->
                    <th v-for="nonterminal in tableHeaders.Vn" :key="nonterminal"
                        class="px-3 py-2 border border-gray-300 text-xs font-medium text-gray-900 bg-green-50">
                      {{ nonterminal }}
                    </th>
                  </tr>
                </thead>

                <!-- 表体 -->
                <tbody>
                  <tr v-for="(row, stateIndex) in parseTable" :key="stateIndex" class="hover:bg-gray-50">
                    <td class="px-3 py-2 border border-gray-300 text-xs font-medium text-center bg-gray-50">
                      {{ row.state }}
                    </td>

                    <!-- ACTION列 -->
                    <td v-for="terminal in tableHeaders.Vt" :key="terminal"
                        class="px-2 py-1 border border-gray-300 text-xs text-center">
                      <input
                        v-model="row.actions[terminal]"
                        class="w-full px-1 py-0.5 text-xs border-0 focus:ring-1 focus:ring-blue-500 rounded"
                        placeholder="--"
                      />
                    </td>

                    <!-- GOTO列 -->
                    <td v-for="nonterminal in tableHeaders.Vn" :key="nonterminal"
                        class="px-2 py-1 border border-gray-300 text-xs text-center">
                      <input
                        v-model="row.gotos[nonterminal]"
                        class="w-full px-1 py-0.5 text-xs border-0 focus:ring-1 focus:ring-blue-500 rounded"
                        placeholder="--"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 填表提示 -->
            <div class="mt-4 text-xs text-gray-600">
              <p><strong>填表说明：</strong></p>
              <ul class="mt-1 space-y-1">
                <li>• 移进动作：Sn（移进到状态n）</li>
                <li>• 规约动作：rn（用第n个产生式规约）</li>
                <li>• 接受动作：acc（接受输入串）</li>
                <li>• 状态转移：直接填写目标状态号</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 验证按钮 -->
        <div class="flex justify-center gap-4">
          <button
            @click="validateTable"
            :disabled="isValidating"
            class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-colors"
          >
            <Icon
              :icon="isValidating ? 'lucide:loader-2' : 'lucide:check-circle'"
              :class="['w-4 h-4 inline mr-2', isValidating ? 'animate-spin' : '']"
            />
            {{ isValidating ? '验证中...' : '验证分析表' }}
          </button>

          <button
            @click="showAnswer"
            class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Icon icon="lucide:eye" class="w-4 h-4 inline mr-2" />
            显示答案
          </button>
        </div>

        <!-- 验证结果 -->
        <div v-if="validationMessage" class="mt-4">
          <div
            :class="[
              'p-4 rounded-lg border',
              validationSuccess
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            ]"
          >
            <div class="flex items-start gap-2">
              <Icon
                :icon="validationSuccess ? 'lucide:check-circle' : 'lucide:alert-circle'"
                class="w-5 h-5 mt-0.5 flex-shrink-0"
              />
              <div>
                <p class="font-medium">{{ validationSuccess ? '验证成功' : '验证失败' }}</p>
                <p class="text-sm mt-1">{{ validationMessage }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="step-actions">
      <div class="flex justify-between items-center">
        <button @click="$emit('prev-step')" class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
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
              ? 'bg-indigo-600 text-white hover:bg-indigo-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
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
import { ref, computed, onMounted } from 'vue'
import { Icon } from '@iconify/vue'

const emit = defineEmits<{
  'next-step': []
  'prev-step': []
}>()

// 组件状态
const grammarData = ref<any>(null)
const dfaData = ref<any>(null)
const parseTable = ref<any[]>([])
const isValidating = ref(false)
const validationMessage = ref('')
const validationSuccess = ref(false)
const checkTableCount = ref(4)

// 表头数据（用于动态更新）
const dynamicHeaders = ref({
  Vt: [] as string[],
  Vn: [] as string[],
  State: [] as string[]
})

// 表格布局配置
const tableView = {
  cellWidth: 80,
  cellHeight: 40,
  gap: 2
}

// 计算属性
const isStepComplete = computed(() => {
  return validationSuccess.value
})

const tableHeaders = computed(() => {
  // 如果动态表头有数据，优先使用
  if (dynamicHeaders.value.Vt.length > 0 || dynamicHeaders.value.Vn.length > 0) {
    return dynamicHeaders.value
  }

  console.log('tableHeaders computed called')
  if (!grammarData.value) {
    console.log('tableHeaders: no grammarData')
    return { Vt: [], Vn: [], State: [] }
  }

  // 尝试从多个数据源获取终结符和非终结符
  let Vt = []
  let Vn = []

  if (grammarData.value.analysisResult) {
    Vt = grammarData.value.analysisResult.Vt || []
    Vn = grammarData.value.analysisResult.Vn || []
    console.log('tableHeaders: from analysisResult - Vt:', Vt, 'Vn:', Vn)
  } else {
    Vt = grammarData.value.Vt || []
    Vn = grammarData.value.Vn || []
    console.log('tableHeaders: from direct access - Vt:', Vt, 'Vn:', Vn)
  }

  const headers = {
    Vt: [...Vt, '$'], // 终结符 + $
    Vn: Vn.filter((vn: string) => !vn.includes("'")), // 非终结符（除了增广开始符）
    State: (dfaData.value?.userNodes || []).map((_: any, index: number) => `I${index}`) // 状态
  }

  console.log('tableHeaders final:', headers)
  return headers
})

// 检查表格完成状态
const checkTableCompletion = () => {
  let filledCells = 0
  let totalCells = 0

  for (const row of parseTable.value) {
    // ACTION列
    for (const terminal of tableHeaders.value.Vt) {
      totalCells++
      if (row.actions[terminal] && row.actions[terminal].trim() !== '') {
        filledCells++
      }
    }
    // GOTO列
    for (const nonterminal of tableHeaders.value.Vn) {
      totalCells++
      if (row.gotos[nonterminal] && row.gotos[nonterminal].trim() !== '') {
        filledCells++
      }
    }
  }

  // 至少填写一半的表格才算有内容
  return filledCells >= totalCells * 0.3
}

// 初始化分析表
const initializeTable = () => {
  console.log('initializeTable called')
  console.log('grammarData.value:', grammarData.value)
  console.log('dfaData.value:', dfaData.value)
  console.log('tableHeaders.value:', tableHeaders.value)

  if (!grammarData.value || !dfaData.value) {
    console.log('initializeTable: missing data')
    return
  }

  const stateCount = dfaData.value.userNodes?.length || 0
  console.log('stateCount:', stateCount)

  if (stateCount === 0) {
    console.log('initializeTable: no states found')
    return
  }

  parseTable.value = []

  for (let i = 0; i < stateCount; i++) {
    const row = {
      state: `I${i}`,
      actions: {} as Record<string, string>,
      gotos: {} as Record<string, string>
    }

    // 初始化ACTION列
    for (const terminal of tableHeaders.value.Vt) {
      row.actions[terminal] = ''
    }

    // 初始化GOTO列
    for (const nonterminal of tableHeaders.value.Vn) {
      row.gotos[nonterminal] = ''
    }

    parseTable.value.push(row)
  }

  console.log('Initialized parseTable with', parseTable.value.length, 'rows')
}

// 验证分析表
const validateTable = async () => {
  isValidating.value = true
  validationMessage.value = ''

  try {
    if (!checkTableCompletion()) {
      validationSuccess.value = false
      validationMessage.value = '请填写更多的表格单元格'
      return
    }

    // 简单的验证逻辑
    let hasValidEntries = false

    for (const row of parseTable.value) {
      // 检查ACTION列
      for (const [terminal, value] of Object.entries(row.actions)) {
        if (typeof value === 'string' && value.trim() !== '') {
          const trimmedValue = value.trim().toLowerCase()
          // 检查是否是有效的ACTION条目 (s数字, r数字, acc)
          if (trimmedValue.match(/^(s\d+|r\d+|acc)$/)) {
            hasValidEntries = true
          }
        }
      }

      // 检查GOTO列
      for (const [nonterminal, value] of Object.entries(row.gotos)) {
        if (typeof value === 'string' && value.trim() !== '') {
          const trimmedValue = value.trim()
          // 检查是否是有效的GOTO条目 (数字)
          if (trimmedValue.match(/^\d+$/)) {
            hasValidEntries = true
          }
        }
      }
    }

    if (!hasValidEntries) {
      validationSuccess.value = false
      if (checkTableCount.value > 1) {
        validationMessage.value = `请填写有效的表格条目 (剩余${--checkTableCount.value}次查看答案)`
      } else {
        validationMessage.value = '已达到最大尝试次数，可查看答案'
        showAnswer()
      }
    } else {
      validationSuccess.value = true
      validationMessage.value = 'LR0分析表验证通过！格式正确，可以进行下一步'
    }
  } catch (error) {
    validationSuccess.value = false
    validationMessage.value = '验证过程中发生错误，请重试'
    console.error('Validation error:', error)
  } finally {
    isValidating.value = false
  }
}

// 显示答案
const showAnswer = async () => {
  console.log('showAnswer called!')

  if (!grammarData.value) {
    console.log('Early return: no grammarData')
    validationMessage.value = '数据缺失：请确保完成前面的步骤'
    validationSuccess.value = false
    return
  }

  try {
    // 调用后端API获取真实的答案数据
    const { useLR0API } = await import('@/composables/api/useLR0API')
    const { analyseGrammar } = useLR0API()

    // 获取文法产生式数据
    console.log('Grammar data from localStorage:', grammarData.value)

    // 尝试多种方式获取产生式
    let productions = []
    if (grammarData.value.originalProductions) {
      productions = grammarData.value.originalProductions
    } else if (grammarData.value.analysisResult && grammarData.value.analysisResult.formulas_list) {
      productions = grammarData.value.analysisResult.formulas_list
    } else if (grammarData.value.productions) {
      productions = grammarData.value.productions
    }

    console.log('Productions to send to API:', productions)

    if (productions.length === 0) {
      validationMessage.value = '缺少文法产生式数据，无法获取答案'
      validationSuccess.value = false
      return
    }

    // 调用API获取完整的LR0分析数据
    const result = await analyseGrammar(productions)
    console.log('LR0 API result:', result)

    if (result.data && result.data.actions && result.data.gotos) {
      const apiData = result.data
      console.log('API actions:', apiData.actions)
      console.log('API gotos:', apiData.gotos)
      console.log('API Vt:', apiData.Vt)
      console.log('API Vn:', apiData.Vn)

      // 使用后端返回的数据重新构建表格头部
      const backendVt = [...(apiData.Vt || []), '$']
      const backendVn = (apiData.Vn || []).filter((vn: string) => !vn.includes("'"))

      // 从actions和gotos中推断状态数量
      const stateSet = new Set<number>()
      Object.keys(apiData.actions).forEach(key => {
        const stateIndex = parseInt(key.split('|')[0])
        if (!isNaN(stateIndex)) stateSet.add(stateIndex)
      })
      Object.keys(apiData.gotos).forEach(key => {
        const stateIndex = parseInt(key.split('|')[0])
        if (!isNaN(stateIndex)) stateSet.add(stateIndex)
      })

      console.log('States from actions/gotos:', Array.from(stateSet))
      const stateCount = stateSet.size > 0 ? Math.max(...Array.from(stateSet)) + 1 : 1
      console.log('Calculated stateCount:', stateCount)

      // 重新初始化表格
      parseTable.value = []
      console.log('Creating table with', stateCount, 'states')
      console.log('Terminals:', backendVt)
      console.log('Non-terminals:', backendVn)

      for (let i = 0; i < stateCount; i++) {
        const row = {
          state: `I${i}`,
          actions: {} as Record<string, string>,
          gotos: {} as Record<string, string>
        }

        // 初始化ACTION列
        for (const terminal of backendVt) {
          row.actions[terminal] = ''
        }

        // 初始化GOTO列
        for (const nonterminal of backendVn) {
          row.gotos[nonterminal] = ''
        }

        parseTable.value.push(row)
      }

      console.log('Initialized parseTable:', parseTable.value)

      // 填入ACTION答案
      console.log('Filling ACTION answers...')
      Object.entries(apiData.actions).forEach(([key, value]) => {
        console.log(`Processing ACTION: ${key} = ${value}`)
        const coords = key.split('|')
        if (coords.length === 2) {
          const stateIndex = parseInt(coords[0].trim())
          let symbol = coords[1].trim()

          // 处理符号映射：后端的 # 对应前端的 $
          if (symbol === '#') {
            symbol = '$'
          }

          if (stateIndex >= 0 && stateIndex < parseTable.value.length) {
            const row = parseTable.value[stateIndex]
            if (row.actions.hasOwnProperty(symbol)) {
              row.actions[symbol] = value as string
              console.log(`Set ACTION[${stateIndex}][${symbol}] = ${value}`)
            } else {
              console.log(`Symbol ${symbol} not found in row actions, available symbols:`, Object.keys(row.actions))
            }
          } else {
            console.log(`Invalid stateIndex: ${stateIndex}`)
          }
        }
      })

      // 填入GOTO答案
      console.log('Filling GOTO answers...')
      Object.entries(apiData.gotos).forEach(([key, value]) => {
        console.log(`Processing GOTO: ${key} = ${value}`)
        const coords = key.split('|')
        if (coords.length === 2) {
          const stateIndex = parseInt(coords[0].trim())
          const symbol = coords[1].trim()

          if (stateIndex >= 0 && stateIndex < parseTable.value.length) {
            const row = parseTable.value[stateIndex]
            if (row.gotos.hasOwnProperty(symbol)) {
              row.gotos[symbol] = value as string
              console.log(`Set GOTO[${stateIndex}][${symbol}] = ${value}`)
            } else {
              console.log(`Symbol ${symbol} not found in row gotos`)
            }
          } else {
            console.log(`Invalid stateIndex: ${stateIndex}`)
          }
        }
      })

      // 更新表头数据以匹配后端返回的数据
      dynamicHeaders.value = {
        Vt: backendVt,
        Vn: backendVn,
        State: parseTable.value.map((_, index) => `I${index}`)
      }

      console.log('Updated dynamicHeaders:', dynamicHeaders.value)
      console.log('Final parseTable:', parseTable.value)

      validationMessage.value = '已加载标准答案，注意格式：移进(s1)、规约(r1)、接受(acc)'
      validationSuccess.value = true
    } else {
      validationMessage.value = 'API返回数据格式错误，无法加载答案'
      validationSuccess.value = false
    }
  } catch (error) {
    console.error('获取答案失败:', error)
    validationMessage.value = '获取答案失败，请检查网络连接或重试'
    validationSuccess.value = false
  }
}

const nextStep = () => {
  if (isStepComplete.value) {
    // 保存表格数据
    const tableData = {
      parseTable: parseTable.value,
      timestamp: new Date().toISOString()
    }
    localStorage.setItem('lr0-step4-data', JSON.stringify(tableData))

    emit('next-step')
  }
}

// 组件挂载时初始化
onMounted(() => {
  try {
    // 从第1步获取文法数据
    const step1Data = localStorage.getItem('lr0-step1-data')
    if (step1Data) {
      grammarData.value = JSON.parse(step1Data)
    }

    // 从第3步获取DFA数据
    const step3Data = localStorage.getItem('lr0-step3-data')
    if (step3Data) {
      dfaData.value = JSON.parse(step3Data)
    }

    console.log('Step 4 loaded data:', { grammarData: grammarData.value, dfaData: dfaData.value })

    if (grammarData.value && dfaData.value) {
      initializeTable()
    }
  } catch (error) {
    console.error('Failed to load previous step data:', error)
  }
})
</script>

<style scoped>
.step-header { padding: 2rem 2rem 1rem; border-bottom: 1px solid #e5e7eb; }
.step-icon { width: 3rem; height: 3rem; background: #e0e7ff; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; }
.step-content { padding: 2rem; }
.step-actions { padding: 1rem 2rem 2rem; border-top: 1px solid #e5e7eb; background: #f9fafb; }
</style>
