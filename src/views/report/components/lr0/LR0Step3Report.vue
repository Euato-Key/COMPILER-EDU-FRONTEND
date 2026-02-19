<template>
  <div class="lr0-step3-report space-y-4">
    <!-- 步骤3标题 -->
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">3</div>
      <h2 class="text-xl font-bold text-gray-900">步骤 3：DFA 状态集构造</h2>
    </div>

    <!-- DFA状态集分析 -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
      <div class="p-4">
        <!-- 统计信息 - 紧凑布局 -->
        <div class="grid grid-cols-4 gap-3 mb-4">
          <div class="bg-purple-50 rounded-lg border border-purple-200 p-3">
            <div class="text-xl font-bold text-purple-600">{{ answerItemCount }}</div>
            <div class="text-xs text-purple-700">项目集数量</div>
          </div>
          <div class="bg-indigo-50 rounded-lg border border-indigo-200 p-3">
            <div class="text-xl font-bold text-indigo-600">{{ answerTransitionCount }}</div>
            <div class="text-xs text-indigo-700">转移关系数量</div>
          </div>
          <div class="bg-green-50 rounded-lg border border-green-200 p-3">
            <div class="text-xl font-bold text-green-600">{{ userItemCount }}</div>
            <div class="text-xs text-green-700">用户绘制节点</div>
          </div>
          <div class="bg-blue-50 rounded-lg border border-blue-200 p-3">
            <div class="text-xl font-bold text-blue-600">{{ userEdgeCount }}</div>
            <div class="text-xs text-blue-700">用户绘制连线</div>
          </div>
        </div>

        <!-- DFA对比展示 - 紧凑布局 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 print:grid-cols-2 gap-4 print:gap-2">
          <!-- 左侧：用户绘制的DFA -->
          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <div class="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
                <Icon icon="lucide:user" class="w-3.5 h-3.5 text-blue-600" />
              </div>
              <h4 class="text-sm font-semibold text-gray-900">学生绘图</h4>
              <span
                v-if="hasUserData"
                class="ml-auto px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full border border-green-200"
              >
                已绘制
              </span>
              <span
                v-else
                class="ml-auto px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full border border-gray-200"
              >
                未绘制
              </span>
            </div>

            <div class="graph-container p-2 bg-gray-50 rounded-lg border border-gray-200 min-h-[300px] flex items-center justify-center relative overflow-hidden">
              <div v-if="!hasUserData" class="text-gray-400 flex flex-col items-center">
                <Icon icon="lucide:image-off" class="w-12 h-12 mb-2 opacity-50" />
                <p class="text-sm">未提交绘图数据</p>
              </div>
              <div v-else-if="loading.user" class="animate-pulse w-full text-center">
                <Icon icon="lucide:loader-2" class="w-10 h-10 mx-auto mb-2 animate-spin text-gray-300" />
                <div class="h-3 bg-gray-200 rounded w-2/3 mx-auto"></div>
              </div>
              <div v-else class="viz-wrapper w-full h-full flex items-center justify-center">
                <div v-html="renderedUserSvg" class="rendered-svg-container w-full h-full flex items-center justify-center"></div>
              </div>
            </div>
          </div>

          <!-- 右侧：标准答案DFA -->
          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <div class="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center">
                <Icon icon="lucide:check-square" class="w-3.5 h-3.5 text-green-600" />
              </div>
              <h4 class="text-sm font-semibold text-gray-900">标准答案</h4>
              <span
                v-if="hasAnswerData"
                class="ml-auto px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full border border-green-200"
              >
                Graphviz DOT
              </span>
            </div>

            <div class="graph-container p-2 bg-green-50/30 rounded-lg border border-green-200 min-h-[300px] flex items-center justify-center relative overflow-hidden">
              <div v-if="!hasAnswerData" class="text-gray-400 flex flex-col items-center">
                <Icon icon="lucide:help-circle" class="w-12 h-12 mb-2 opacity-50" />
                <p class="text-sm">暂无参考答案</p>
              </div>
              <div v-else-if="loading.answer" class="animate-pulse w-full text-center">
                <Icon icon="lucide:loader-2" class="w-10 h-10 mx-auto mb-2 animate-spin text-green-200" />
                <div class="h-3 bg-green-100 rounded w-2/3 mx-auto"></div>
              </div>
              <div v-else class="viz-wrapper w-full h-full flex items-center justify-center">
                <div v-html="renderedAnswerSvg" class="rendered-svg-container w-full h-full flex items-center justify-center"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 历史错误记录 - 紧凑布局 -->
        <div v-if="itemHistoryErrors.length > 0 || gotoHistoryErrors.length > 0" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div class="flex items-start gap-2">
            <Icon icon="lucide:history" class="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
            <div class="flex-1">
              <p class="font-medium text-red-800 mb-2 text-sm">历史错误记录：</p>

              <!-- Item校验错误 -->
              <div v-if="itemHistoryErrors.length > 0" class="mb-3">
                <p class="text-xs text-red-700 font-medium mb-1.5">Item校验失败（{{ itemHistoryErrors.length }}个）：</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div
                    v-for="(err, idx) in itemHistoryErrors"
                    :key="`item-${idx}`"
                    class="bg-white/70 rounded-lg p-2 border border-red-100"
                  >
                    <div class="flex items-center justify-between mb-1.5">
                      <span class="text-red-700 font-mono text-[10px]">{{ err.timestamp }}</span>
                    </div>
                    <!-- Item产生式方块 -->
                    <div class="flex-shrink-0 bg-red-50 border border-red-200 rounded p-1.5 min-w-[100px]">
                      <div class="text-[10px] text-red-600 font-medium mb-0.5 border-b border-red-200 pb-0.5 flex items-center justify-between">
                        <span>Item节点</span>
                        <span class="bg-red-200 text-red-700 px-1 py-0 rounded text-[9px]">{{ err.nodeId }}</span>
                      </div>
                      <div class="space-y-0.5">
                        <div
                          v-for="(pro, pIdx) in err.productions"
                          :key="`pro-${pIdx}`"
                          class="text-[10px] font-mono text-red-800 whitespace-nowrap"
                        >
                          {{ pro }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Goto校验错误 -->
              <div v-if="gotoHistoryErrors.length > 0">
                <p class="text-xs text-red-700 font-medium mb-1.5">Goto校验失败：</p>
                <div class="space-y-2">
                  <div
                    v-for="(err, idx) in gotoHistoryErrors"
                    :key="`goto-${idx}`"
                    class="bg-white/70 rounded-lg p-2 border border-red-100 w-full"
                  >
                    <div class="flex items-center gap-2 mb-1.5">
                      <span class="text-red-700 font-mono text-[10px]">{{ err.timestamp }}</span>
                    </div>
                    <!-- 解析并渲染Goto连线 -->
                    <div class="grid grid-cols-2 gap-12">
                      <div
                        v-for="(transition, tIdx) in parseGotoTransitions(err.wrongValue)"
                        :key="`trans-${tIdx}`"
                        class="flex items-stretch gap-6"
                      >
                        <!-- 起始Item方块 -->
                        <div class="flex-1 bg-blue-50 border border-blue-200 rounded p-2 min-w-0">
                          <div class="text-xs text-blue-600 font-bold mb-1 border-b border-blue-200 pb-1 flex items-center justify-between">
                            <span>起始Item</span>
                            <span class="bg-blue-200 text-blue-700 px-1.5 py-0.5 rounded text-[10px] font-bold">{{ transition.sourceItemId }}</span>
                          </div>
                          <div class="space-y-1">
                            <div
                              v-for="(pro, pIdx) in transition.sourcePros"
                              :key="`src-${pIdx}`"
                              class="text-xs font-mono text-blue-800 font-medium"
                            >
                              {{ pro }}
                            </div>
                          </div>
                        </div>

                        <!-- 连线和符号 -->
                        <div class="flex-shrink-0 flex items-center">
                          <div class="flex items-center">
                            <div class="w-4 h-0.5 bg-amber-400"></div>
                            <div class="bg-amber-100 text-amber-700 text-xs font-bold font-mono px-2 py-0.5 rounded border border-amber-300 flex items-center gap-1">
                              <span>{{ transition.symbol }}</span>
                              <Icon icon="lucide:arrow-right" class="w-3 h-3 text-amber-600" />
                            </div>
                            <div class="w-4 h-0.5 bg-amber-400"></div>
                          </div>
                        </div>

                        <!-- 终点Item方块 -->
                        <div class="flex-1 bg-green-50 border border-green-200 rounded p-2 min-w-0">
                          <div class="text-xs text-green-600 font-bold mb-1 border-b border-green-200 pb-1 flex items-center justify-between">
                            <span>终点Item</span>
                            <span class="bg-green-200 text-green-700 px-1.5 py-0.5 rounded text-[10px] font-bold">{{ transition.targetItemId }}</span>
                          </div>
                          <div class="space-y-1">
                            <div
                              v-for="(pro, pIdx) in transition.targetPros"
                              :key="`tgt-${pIdx}`"
                              class="text-xs font-mono text-green-800 font-medium"
                            >
                              {{ pro }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 构造提示 - 紧凑布局 -->
        <div class="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div class="flex items-start gap-2">
            <Icon icon="lucide:lightbulb" class="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <div class="text-xs text-amber-700">
              <p class="font-medium mb-1">DFA构造要点：</p>
              <ul class="space-y-0.5 text-[11px]">
                <li>• 从增广文法的初始项目 [S' -> .S] 开始构造 I₀</li>
                <li>• 使用 CLOSURE 函数求闭包，添加所有相关项目</li>
                <li>• 使用 GOTO 函数计算状态转移</li>
                <li>• 继续构造直到没有新的项目集产生</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { instance as viz } from '@viz-js/viz'

interface DFAItem {
  id: string
  pros: Array<{ id: string; text: string }>
  next_ids: Record<string, number>
}

interface Props {
  step3Data?: {
    userDfaStates?: any[]
    userDotItems?: any[]
    userShowAnswer?: boolean
  }
  originalData?: {
    all_dfa?: DFAItem[]
    LR0_dot_str?: string
  }
  errorLogs?: any[]
}

const props = defineProps<Props>()

// 加载状态
const loading = ref({ user: false, answer: false })

// 渲染的SVG
const renderedUserSvg = ref('')
const renderedAnswerSvg = ref('')

// 用户数据
const userNodes = computed(() => props.step3Data?.userDfaStates || [])
const userEdges = computed(() => props.step3Data?.userDotItems || [])

// 答案数据
const answerItems = computed(() => props.originalData?.all_dfa || [])
const dotString = computed(() => props.originalData?.LR0_dot_str || '')

// 是否有用户数据
const hasUserData = computed(() => userNodes.value.length > 0)

// 是否有答案数据
const hasAnswerData = computed(() => !!dotString.value && dotString.value.trim().length > 0)

// 统计信息
const userItemCount = computed(() => userNodes.value.length)
const userEdgeCount = computed(() => userEdges.value.length)
const answerItemCount = computed(() => answerItems.value.length)
const answerTransitionCount = computed(() => {
  let count = 0
  answerItems.value.forEach((item: DFAItem) => {
    if (item.next_ids && typeof item.next_ids === 'object') {
      count += Object.keys(item.next_ids).length
    }
  })
  return count
})

// 将用户数据转换为DOT字符串
const userDataToDot = (nodes: any[], edges: any[]): string => {
  if (!nodes || nodes.length === 0) return ''

  let dot = 'digraph LR0DFA {\n'
  dot += '  rankdir=LR;\n'
  dot += '  node [shape=box, style=rounded, fontname="monospace"];\n'
  dot += '  edge [fontname="monospace"];\n\n'

  // 添加节点
  nodes.forEach((node, index) => {
    const nodeId = node.id || `node${index}`
    const label = node.data?.label || `I${index}`
    const pros = node.data?.pros || []
    const prosText = pros.map((p: any) => p.text).join('\\n')
    dot += `  "${nodeId}" [label="${label}\\n${prosText}"];\n`
  })

  dot += '\n'

  // 添加边
  edges.forEach((edge, index) => {
    const source = edge.source || ''
    const target = edge.target || ''
    const label = edge.data?.text || ''
    if (source && target) {
      dot += `  "${source}" -> "${target}" [label="${label}"];\n`
    }
  })

  dot += '}'
  return dot
}

// 渲染图表
const renderGraphs = async () => {
  const vizInstance = await viz()

  // 渲染用户图表
  if (hasUserData.value) {
    loading.value.user = true
    try {
      const userDot = userDataToDot(userNodes.value, userEdges.value)
      if (userDot) {
        const svgElement = await vizInstance.renderSVGElement(userDot)
        svgElement.style.maxWidth = '100%'
        svgElement.style.height = 'auto'
        svgElement.classList.add('lr0-user-dfa-svg')
        renderedUserSvg.value = svgElement.outerHTML
      }
    } catch (e) {
      console.error('[LR0Step3Report] Failed to render user graph:', e)
    } finally {
      loading.value.user = false
    }
  }

  // 渲染答案图表
  if (hasAnswerData.value) {
    loading.value.answer = true
    try {
      const svgElement = await vizInstance.renderSVGElement(dotString.value)
      svgElement.style.maxWidth = '100%'
      svgElement.style.height = 'auto'
      svgElement.classList.add('lr0-answer-dfa-svg')
      renderedAnswerSvg.value = svgElement.outerHTML
    } catch (e) {
      console.error('[LR0Step3Report] Failed to render answer graph:', e)
    } finally {
      loading.value.answer = false
    }
  }
}

onMounted(() => {
  setTimeout(() => {
    renderGraphs()
  }, 100)
})

// 监听数据变化重新渲染
watch(() => props.step3Data, () => {
  renderGraphs()
}, { deep: true })

watch(() => props.originalData, () => {
  renderGraphs()
}, { deep: true })

// Item历史错误记录（从 errorLogs 中提取 step3 的 dfaState 类型错误）
const itemHistoryErrors = computed(() => {
  if (!props.errorLogs) return []

  return props.errorLogs
    .filter(log => log.step === 'step3' && log.type === 'dfaState')
    .map(log => ({
      timestamp: new Date(log.timestamp).toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).replace(/\//g, '-'),
      wrongValue: log.wrongValue,
      hint: log.hint,
      nodeId: log.location?.col || '未知节点',
      productions: log.wrongValue ? log.wrongValue.split(';').map(p => p.trim()).filter(p => p) : []
    }))
})

// Goto历史错误记录（从 errorLogs 中提取 step3 的 gotoTransition 类型错误）
const gotoHistoryErrors = computed(() => {
  if (!props.errorLogs) return []

  return props.errorLogs
    .filter(log => log.step === 'step3' && log.type === 'gotoTransition')
    .map(log => ({
      timestamp: new Date(log.timestamp).toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).replace(/\//g, '-'),
      wrongValue: log.wrongValue,
      hint: log.hint
    }))
})

// 解析Goto过渡字符串为结构化数据
// 格式: Item0[产生式1, 产生式2] --符号--> Item1[产生式3, 产生式4]; [...]
interface GotoTransition {
  sourceItemId: string
  targetItemId: string
  sourcePros: string[]
  targetPros: string[]
  symbol: string
}

const parseGotoTransitions = (value: string): GotoTransition[] => {
  if (!value || value === '未绘制任何Goto连线') return []

  const transitions: GotoTransition[] = []
  // 按分号分割多个过渡
  const parts = value.split(';').map(p => p.trim()).filter(p => p)

  for (const part of parts) {
    // 匹配格式: ItemId[产生式列表] --符号--> ItemId[产生式列表]
    const match = part.match(/(\w+)\[(.*?)\]\s*--(.*?)-->\s*(\w+)\[(.*?)\]/)
    if (match) {
      const sourceItemId = match[1]
      const sourcePros = match[2].split(',').map(p => p.trim()).filter(p => p)
      const symbol = match[3].trim()
      const targetItemId = match[4]
      const targetPros = match[5].split(',').map(p => p.trim()).filter(p => p)
      transitions.push({ sourceItemId, targetItemId, sourcePros, targetPros, symbol })
    }
  }

  return transitions
}
</script>

<style scoped>
.lr0-step3-report {
  width: 100%;
}

.graph-container {
  min-height: 300px;
}

.viz-wrapper {
  min-height: 280px;
}

:deep(.rendered-svg-container) svg {
  max-width: 100%;
  height: auto;
  max-height: 280px;
  filter: drop-shadow(0 2px 4px -1px rgb(0 0 0 / 0.1));
}

:deep(.lr0-user-dfa-svg) {
  max-width: 100%;
  height: auto;
}

:deep(.lr0-answer-dfa-svg) {
  max-width: 100%;
  height: auto;
}

/* 打印时保持并排布局 */
@media print {
  .graph-container {
    min-height: 250px;
  }

  .viz-wrapper {
    min-height: 230px;
  }

  :deep(.rendered-svg-container) svg {
    max-height: 230px;
  }
}
</style>
