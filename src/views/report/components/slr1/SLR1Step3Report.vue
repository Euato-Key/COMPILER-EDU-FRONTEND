<template>
  <div class="slr1-step3-report space-y-6">
    <!-- DFA状态集分析 -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
      <div class="px-6 py-4 bg-purple-50 border-b border-purple-100 flex items-center justify-between">
        <h3 class="text-lg font-bold text-purple-900 flex items-center gap-2">
          <Icon icon="lucide:git-branch" class="w-5 h-5 text-purple-600" />
          DFA 状态集分析
        </h3>
        <span class="text-xs font-medium px-2 py-1 bg-white text-purple-600 rounded-lg border border-purple-100">Step 3</span>
      </div>

      <div class="p-6">
        <!-- 统计信息 -->
        <div class="grid grid-cols-4 gap-4 mb-6">
          <div class="bg-purple-50 rounded-lg border border-purple-200 p-4">
            <div class="text-2xl font-bold text-purple-600">{{ answerItemCount }}</div>
            <div class="text-sm text-purple-700">项目集数量</div>
          </div>
          <div class="bg-indigo-50 rounded-lg border border-indigo-200 p-4">
            <div class="text-2xl font-bold text-indigo-600">{{ answerTransitionCount }}</div>
            <div class="text-sm text-indigo-700">转移关系数量</div>
          </div>
          <div class="bg-green-50 rounded-lg border border-green-200 p-4">
            <div class="text-2xl font-bold text-green-600">{{ userItemCount }}</div>
            <div class="text-sm text-green-700">用户绘制节点</div>
          </div>
          <div class="bg-blue-50 rounded-lg border border-blue-200 p-4">
            <div class="text-2xl font-bold text-blue-600">{{ userEdgeCount }}</div>
            <div class="text-sm text-blue-700">用户绘制连线</div>
          </div>
        </div>

        <!-- SLR1特性提示 -->
        <div v-if="isSLR1Grammar === false" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div class="flex items-start gap-3">
            <Icon icon="lucide:alert-triangle" class="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div class="text-sm text-red-700">
              <p class="font-medium mb-1">⚠️ 该文法不是 SLR1 文法</p>
              <p class="text-xs">检测到移进-规约冲突或规约-规约冲突，需要修改文法以消除冲突。</p>
            </div>
          </div>
        </div>

        <!-- DFA对比展示 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- 左侧：用户绘制的DFA -->
          <div class="space-y-4">
            <div class="flex items-center gap-2 mb-3">
              <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Icon icon="lucide:user" class="w-4 h-4 text-blue-600" />
              </div>
              <h4 class="text-base font-semibold text-gray-900">学生绘图</h4>
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

            <div class="graph-container p-4 bg-gray-50 rounded-lg border border-gray-200 min-h-[400px] flex items-center justify-center relative overflow-hidden">
              <div v-if="!hasUserData" class="text-gray-400 flex flex-col items-center">
                <Icon icon="lucide:image-off" class="w-16 h-16 mb-3 opacity-50" />
                <p>未提交绘图数据</p>
              </div>
              <div v-else-if="loading.user" class="animate-pulse w-full text-center">
                <Icon icon="lucide:loader-2" class="w-12 h-12 mx-auto mb-2 animate-spin text-gray-300" />
                <div class="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
              </div>
              <div v-else class="viz-wrapper w-full h-full flex items-center justify-center">
                <div v-html="renderedUserSvg" class="rendered-svg-container w-full h-full flex items-center justify-center"></div>
              </div>
            </div>

            <!-- 用户数据详情 -->
            <div v-if="hasUserData && userNodes.length > 0" class="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h5 class="text-sm font-semibold text-gray-700 mb-3">节点详情</h5>
              <div class="space-y-2 max-h-40 overflow-y-auto">
                <div
                  v-for="(node, index) in userNodes.slice(0, 5)"
                  :key="`node-${index}`"
                  class="flex items-center gap-2 text-sm"
                >
                  <span class="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                    {{ index + 1 }}
                  </span>
                  <span class="font-mono text-gray-600 truncate">{{ node.id }}</span>
                  <span class="text-gray-400">-</span>
                  <span class="text-gray-500 truncate">{{ node.data?.label || '未标记' }}</span>
                </div>
                <div v-if="userNodes.length > 5" class="text-xs text-gray-400 text-center">
                  还有 {{ userNodes.length - 5 }} 个节点...
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧：标准答案DFA -->
          <div class="space-y-4">
            <div class="flex items-center gap-2 mb-3">
              <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Icon icon="lucide:check-square" class="w-4 h-4 text-green-600" />
              </div>
              <h4 class="text-base font-semibold text-gray-900">标准答案</h4>
              <span
                v-if="hasAnswerData"
                class="ml-auto px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full border border-green-200"
              >
                Graphviz DOT
              </span>
            </div>

            <div class="graph-container p-4 bg-green-50/30 rounded-lg border border-green-200 min-h-[400px] flex items-center justify-center relative overflow-hidden">
              <div v-if="!hasAnswerData" class="text-gray-400 flex flex-col items-center">
                <Icon icon="lucide:help-circle" class="w-16 h-16 mb-3 opacity-50" />
                <p>暂无参考答案</p>
              </div>
              <div v-else-if="loading.answer" class="animate-pulse w-full text-center">
                <Icon icon="lucide:loader-2" class="w-12 h-12 mx-auto mb-2 animate-spin text-green-200" />
                <div class="h-4 bg-green-100 rounded w-3/4 mx-auto mb-4"></div>
              </div>
              <div v-else class="viz-wrapper w-full h-full flex items-center justify-center">
                <div v-html="renderedAnswerSvg" class="rendered-svg-container w-full h-full flex items-center justify-center"></div>
              </div>
            </div>

          </div>
        </div>

        <!-- 历史错误记录 -->
        <div v-if="itemHistoryErrors.length > 0 || gotoHistoryErrors.length > 0" class="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div class="flex items-start gap-3">
            <Icon icon="lucide:history" class="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div class="flex-1">
              <p class="font-medium text-amber-800 mb-3">历史错误记录：</p>
              
              <!-- Item校验错误 -->
              <div v-if="itemHistoryErrors.length > 0" class="mb-4">
                <p class="text-sm text-amber-700 font-medium mb-2">Item校验失败（{{ itemHistoryErrors.length }}个）：</p>
                <div class="space-y-3">
                  <div
                    v-for="(err, idx) in itemHistoryErrors"
                    :key="`item-${idx}`"
                    class="bg-white/70 rounded-lg p-3 border border-amber-100"
                  >
                    <div class="flex items-center justify-between mb-3">
                      <span class="text-amber-700 font-mono text-xs">{{ err.timestamp }}</span>
                    </div>
                    <!-- Item产生式方块 -->
                    <div class="flex-shrink-0 bg-red-50 border-2 border-red-200 rounded-lg p-2 min-w-[120px]">
                      <div class="text-xs text-red-600 font-medium mb-1 border-b border-red-200 pb-1 flex items-center justify-between">
                        <span>Item节点</span>
                        <span class="bg-red-200 text-red-700 px-1.5 py-0.5 rounded text-[10px]">{{ err.nodeId }}</span>
                      </div>
                      <div class="space-y-0.5">
                        <div
                          v-for="(pro, pIdx) in err.productions"
                          :key="`pro-${pIdx}`"
                          class="text-xs font-mono text-red-800 whitespace-nowrap"
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
                <p class="text-sm text-amber-700 font-medium mb-2">Goto校验失败：</p>
                <div class="space-y-4">
                  <div
                    v-for="(err, idx) in gotoHistoryErrors"
                    :key="`goto-${idx}`"
                    class="bg-white/70 rounded-lg p-3 border border-amber-100"
                  >
                    <div class="flex items-center gap-2 mb-3">
                      <span class="text-amber-700 font-mono text-xs">{{ err.timestamp }}</span>
                    </div>
                    <!-- 解析并渲染Goto连线 -->
                    <div class="space-y-3">
                      <div
                        v-for="(transition, tIdx) in parseGotoTransitions(err.wrongValue)"
                        :key="`trans-${tIdx}`"
                        class="flex items-center gap-3 overflow-x-auto pb-2"
                      >
                        <!-- 起始Item方块 -->
                        <div class="flex-shrink-0 bg-blue-50 border-2 border-blue-200 rounded-lg p-2 min-w-[120px]">
                          <div class="text-xs text-blue-600 font-medium mb-1 border-b border-blue-200 pb-1 flex items-center justify-between">
                            <span>起始Item</span>
                            <span class="bg-blue-200 text-blue-700 px-1.5 py-0.5 rounded text-[10px]">{{ transition.sourceItemId }}</span>
                          </div>
                          <div class="space-y-0.5">
                            <div
                              v-for="(pro, pIdx) in transition.sourcePros"
                              :key="`src-${pIdx}`"
                              class="text-xs font-mono text-blue-800 whitespace-nowrap"
                            >
                              {{ pro }}
                            </div>
                          </div>
                        </div>
                        
                        <!-- 连线和符号 -->
                        <div class="flex-shrink-0 flex items-center">
                          <div class="flex items-center">
                            <div class="w-6 h-0.5 bg-amber-400"></div>
                            <div class="bg-amber-100 text-amber-700 text-xs font-mono px-2 py-0.5 rounded border border-amber-300 flex items-center gap-1">
                              <span>{{ transition.symbol }}</span>
                              <Icon icon="lucide:arrow-right" class="w-3 h-3 text-amber-600" />
                            </div>
                            <div class="w-6 h-0.5 bg-amber-400"></div>
                          </div>
                        </div>
                        
                        <!-- 终点Item方块 -->
                        <div class="flex-shrink-0 bg-green-50 border-2 border-green-200 rounded-lg p-2 min-w-[120px]">
                          <div class="text-xs text-green-600 font-medium mb-1 border-b border-green-200 pb-1 flex items-center justify-between">
                            <span>终点Item</span>
                            <span class="bg-green-200 text-green-700 px-1.5 py-0.5 rounded text-[10px]">{{ transition.targetItemId }}</span>
                          </div>
                          <div class="space-y-0.5">
                            <div
                              v-for="(pro, pIdx) in transition.targetPros"
                              :key="`tgt-${pIdx}`"
                              class="text-xs font-mono text-green-800 whitespace-nowrap"
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

        <!-- FOLLOW集展示（SLR1特有） -->
        <div v-if="followSets && Object.keys(followSets).length > 0" class="mt-6 p-4 bg-cyan-50 border border-cyan-200 rounded-lg">
          <div class="flex items-start gap-3">
            <Icon icon="lucide:book-open" class="w-5 h-5 text-cyan-500 mt-0.5 flex-shrink-0" />
            <div class="flex-1">
              <p class="font-medium text-cyan-800 mb-2">FOLLOW 集（SLR1 分析使用）：</p>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div
                  v-for="(followSet, nonTerminal) in followSets"
                  :key="nonTerminal"
                  class="text-xs bg-white border border-cyan-200 rounded p-2"
                >
                  <span class="font-mono font-bold text-cyan-700">FOLLOW({{ nonTerminal }})</span>
                  <span class="text-cyan-600"> = {{ followSet.join(', ') }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 构造提示 -->
        <div class="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div class="flex items-start gap-3">
            <Icon icon="lucide:lightbulb" class="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div class="text-sm text-amber-700">
              <p class="font-medium mb-2">SLR1 DFA构造要点：</p>
              <ul class="space-y-1 text-xs">
                <li>• 从增广文法的初始项目 [S' -> .S] 开始构造 I₀</li>
                <li>• 使用 CLOSURE 函数求闭包，添加所有相关项目</li>
                <li>• 使用 GOTO 函数计算状态转移</li>
                <li>• 对于规约项目 A → α·，需要查看 FOLLOW(A) 来解决冲突</li>
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
  id: number
  pros: string[]
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
    SLR1_dot_str?: string
    isSLR1?: boolean
  }
  followSets?: Record<string, string[]>
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
const dotString = computed(() => props.originalData?.SLR1_dot_str || '')
const isSLR1Grammar = computed(() => props.originalData?.isSLR1)
const followSets = computed(() => props.followSets || {})

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

  let dot = 'digraph SLR1DFA {\n'
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
        svgElement.classList.add('slr1-user-dfa-svg')
        renderedUserSvg.value = svgElement.outerHTML
      }
    } catch (e) {
      console.error('[SLR1Step3Report] Failed to render user graph:', e)
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
      svgElement.classList.add('slr1-answer-dfa-svg')
      renderedAnswerSvg.value = svgElement.outerHTML
    } catch (e) {
      console.error('[SLR1Step3Report] Failed to render answer graph:', e)
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
.slr1-step3-report {
  width: 100%;
}

.graph-container {
  min-height: 400px;
}

.viz-wrapper {
  min-height: 350px;
}

:deep(.rendered-svg-container) svg {
  max-width: 100%;
  height: auto;
  max-height: 380px;
  filter: drop-shadow(0 4px 6px -1px rgb(0 0 0 / 0.1));
}

:deep(.slr1-user-dfa-svg) {
  max-width: 100%;
  height: auto;
}

:deep(.slr1-answer-dfa-svg) {
  max-width: 100%;
  height: auto;
}
</style>
