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

            <!-- 答案数据详情 -->
            <div v-if="hasAnswerData && answerItems.length > 0" class="bg-green-50 rounded-lg p-4 border border-green-200">
              <h5 class="text-sm font-semibold text-green-800 mb-3">项目集详情</h5>
              <div class="space-y-2 max-h-40 overflow-y-auto">
                <div
                  v-for="(item, index) in answerItems.slice(0, 5)"
                  :key="`answer-${index}`"
                  class="flex items-center gap-2 text-sm"
                >
                  <span class="w-6 h-6 bg-green-200 text-green-800 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                    {{ index }}
                  </span>
                  <span class="font-mono text-green-700">{{ item.id }}</span>
                  <span class="text-green-600">-</span>
                  <span class="text-green-600 truncate">{{ item.pros?.length || 0 }} 个项目</span>
                </div>
                <div v-if="answerItems.length > 5" class="text-xs text-green-600 text-center">
                  还有 {{ answerItems.length - 5 }} 个项目集...
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
