<template>
  <div class="first-follow-step">
    <div class="step-header">
      <div class="flex items-center gap-4">
        <div class="step-icon">
          <Icon icon="lucide:shuffle" class="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-900">求First集和Follow集</h2>
          <p class="text-gray-600 mt-1">第二步：计算文法中所有非终结符的First集和Follow集</p>
        </div>
      </div>
    </div>

    <div class="step-content">
      <div v-if="!originalData" class="max-w-4xl mx-auto text-center py-12">
        <div class="text-gray-500">
          <Icon icon="lucide:alert-circle" class="w-12 h-12 mx-auto mb-4" />
          <p class="text-lg">请先完成第一步：输入文法</p>
        </div>
      </div>
      <div v-else class="max-w-7xl mx-auto">
        <!-- 说明指引 -->
        <div class="bg-blue-50 rounded-lg p-6 mb-6">
          <div class="flex items-center mb-4">
            <Icon icon="lucide:info" class="w-5 h-5 text-blue-600 mr-2" />
            <h3 class="text-lg font-semibold text-gray-900">填写说明</h3>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 bg-gray-200 rounded"></div>
              <span class="text-sm text-gray-700">已知信息</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 bg-yellow-200 rounded"></div>
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
          <div class="text-sm text-gray-600">
            <p>根据非终结符、终结符和产生式等已知信息，填写First集和Follow集合。</p>
            <p class="mt-1">• 多个符号用空格分隔（如：a b c）</p>
            <p>• 空符号用 ε 表示</p>
            <p>• 注意字符的大小写</p>
            <p class="mt-1 text-blue-600 font-medium">• 可通过拖拽输入和双击符号卡片复制内容</p>
          </div>
        </div>

        <!-- 已知信息区域 -->
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <!-- 非终结符 -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-md font-semibold text-gray-900 mb-4 flex items-center">
              <Icon icon="lucide:tag" class="w-4 h-4 mr-2 text-purple-600" />
              非终结符 Vn
            </h3>
            <div class="flex flex-wrap gap-2">
              <!-- 拖拽：非终结符卡片 -->
              <span
                v-for="symbol in originalData.Vn"
                :key="'vn-' + symbol"
                class="flex items-center justify-center rounded-full bg-purple-100 text-purple-800 font-mono text-base w-10 h-10 cursor-move shadow hover:bg-purple-200 transition-all select-none"
                draggable="true"
                @dragstart="onDragStart(symbol, $event)"
                @dblclick="onSymbolDblClick(symbol)"
              >
                {{ symbol }}
              </span>
            </div>
          </div>

          <!-- 终结符 -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-md font-semibold text-gray-900 mb-4 flex items-center">
              <Icon icon="lucide:hash" class="w-4 h-4 mr-2 text-green-600" />
              终结符 Vt
            </h3>
            <div class="flex flex-wrap gap-2">
              <!-- 拖拽：终结符卡片 -->
              <span
                v-for="symbol in originalData.Vt"
                :key="'vt-' + symbol"
                class="flex items-center justify-center rounded-full bg-green-100 text-green-800 font-mono text-base w-10 h-10 cursor-move shadow hover:bg-green-200 transition-all select-none"
                draggable="true"
                @dragstart="onDragStart(symbol, $event)"
                @dblclick="onSymbolDblClick(symbol)"
              >
                {{ symbol }}
              </span>
            </div>
          </div>

          <!-- 其他符号 -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-md font-semibold text-gray-900 mb-4 flex items-center">
              <Icon icon="lucide:circle" class="w-4 h-4 mr-2 text-pink-600" />
              其他符号
            </h3>
            <div class="flex flex-wrap gap-2">
              <!-- 拖拽：空串ε -->
              <span
                class="flex items-center justify-center rounded-full bg-pink-100 text-pink-800 font-mono text-base w-10 h-10 cursor-move shadow hover:bg-pink-200 transition-all select-none"
                draggable="true"
                @dragstart="onDragStart('ε', $event)"
                @dblclick="onSymbolDblClick('ε')"
              >
                ε
              </span>
              <!-- 拖拽：输入结束符# -->
              <span
                class="flex items-center justify-center rounded-full bg-blue-100 text-blue-800 font-mono text-base w-10 h-10 cursor-move shadow hover:bg-blue-200 transition-all select-none"
                draggable="true"
                @dragstart="onDragStart('#', $event)"
                @dblclick="onSymbolDblClick('#')"
              >
                #
              </span>
            </div>
          </div>

          <!-- 产生式 -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-md font-semibold text-gray-900 mb-4 flex items-center">
              <Icon icon="lucide:list" class="w-4 h-4 mr-2 text-blue-600" />
              产生式
            </h3>
            <div class="space-y-1">
              <div
                v-for="(productions, nonTerminal) in originalData.formulas_dict"
                :key="'prod-' + nonTerminal"
                class="text-sm"
              >
                <span class="font-mono text-blue-600">{{ nonTerminal }}</span>
                <span class="text-gray-500 mx-1">→</span>
                <span class="font-mono text-gray-700">{{ productions.join(' | ') }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- First集和Follow集填写区域 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <!-- First集 -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                <Icon icon="lucide:arrow-right" class="w-5 h-5 mr-2 text-blue-600" />
                First集合
              </h3>
              <div class="flex gap-2">
                <button
                  @click="clearFirstSets"
                  class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Icon icon="lucide:refresh-cw" class="w-4 h-4 mr-2" />
                  清空重填
                </button>
                <button
                  @click="checkFirstSets"
                  :disabled="loading.first"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                >
                  <Icon v-if="loading.first" icon="lucide:loader-2" class="w-4 h-4 animate-spin mr-2" />
                  校验First集
                </button>
              </div>
            </div>

            <div class="space-y-3">
              <div
                v-for="symbol in originalData.Vn"
                :key="'first-' + symbol"
                class="flex items-center gap-3"
              >
                <span class="w-20 text-sm font-medium text-gray-700">
                  first(<span class="font-mono text-blue-600">{{ symbol }}</span>) =
                </span>
                <div class="flex-1 relative">
                  <input
                    v-model="userFirstSets[symbol]"
                    type="text"
                    placeholder="输入First集，用空格分隔"
                    :class="[
                      'w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors',
                      getInputClass('first', symbol)
                    ]"
                    @focus="clearValidation('first', symbol)"
                  />
                  <div class="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <Icon
                      v-if="firstValidation[symbol] === 'correct'"
                      icon="lucide:check"
                      class="w-5 h-5 text-green-500"
                    />
                    <Icon
                      v-else-if="firstValidation[symbol] === 'incorrect'"
                      icon="lucide:x"
                      class="w-5 h-5 text-red-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- First集答案提示 -->
            <div v-if="showFirstAnswer && firstAttempts >= maxAttempts" class="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 class="text-sm font-medium text-blue-800 mb-2">正确答案：</h4>
              <div class="space-y-1">
                <div
                  v-for="symbol in originalData.Vn"
                  :key="'answer-first-' + symbol"
                  class="text-sm"
                >
                  <span class="font-mono text-blue-600">{{ symbol }}:</span>
                  <span class="ml-2 text-blue-700">{{ correctFirstSets[symbol]?.join(' ') || 'ε' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Follow集 -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                <Icon icon="lucide:arrow-left" class="w-5 h-5 mr-2 text-green-600" />
                Follow集合
              </h3>
              <div class="flex gap-2">
                <button
                  @click="clearFollowSets"
                  class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Icon icon="lucide:refresh-cw" class="w-4 h-4 mr-2" />
                  清空重填
                </button>
                <button
                  @click="checkFollowSets"
                  :disabled="loading.follow || !firstStepCompleted"
                  class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                >
                  <Icon v-if="loading.follow" icon="lucide:loader-2" class="w-4 h-4 animate-spin mr-2" />
                  校验Follow集
                </button>
              </div>
            </div>

            <div class="space-y-3">
              <div
                v-for="symbol in originalData.Vn"
                :key="'follow-' + symbol"
                class="flex items-center gap-3"
              >
                <span class="w-20 text-sm font-medium text-gray-700">
                  follow(<span class="font-mono text-green-600">{{ symbol }}</span>) =
                </span>
                <div class="flex-1 relative">
                  <input
                    v-model="userFollowSets[symbol]"
                    type="text"
                    placeholder="输入Follow集，用空格分隔"
                    :disabled="!firstStepCompleted"
                    :class="[
                      'w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors',
                      getInputClass('follow', symbol),
                      !firstStepCompleted && 'bg-gray-100 cursor-not-allowed'
                    ]"
                    @focus="clearValidation('follow', symbol)"
                  />
                  <div class="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <Icon
                      v-if="followValidation[symbol] === 'correct'"
                      icon="lucide:check"
                      class="w-5 h-5 text-green-500"
                    />
                    <Icon
                      v-else-if="followValidation[symbol] === 'incorrect'"
                      icon="lucide:x"
                      class="w-5 h-5 text-red-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Follow集答案提示 -->
            <div v-if="showFollowAnswer && followAttempts >= maxAttempts" class="mt-4 p-4 bg-green-50 rounded-lg">
              <h4 class="text-sm font-medium text-green-800 mb-2">正确答案：</h4>
              <div class="space-y-1">
                <div
                  v-for="symbol in originalData.Vn"
                  :key="'answer-follow-' + symbol"
                  class="text-sm"
                >
                  <span class="font-mono text-green-600">{{ symbol }}:</span>
                  <span class="ml-2 text-green-700">{{ correctFollowSets[symbol]?.join(' ') || '$' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 计算提示 -->
        <div class="bg-yellow-50 rounded-lg p-6 mb-6">
          <h4 class="text-md font-semibold text-gray-900 mb-3">计算提示</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h5 class="font-medium text-gray-800 mb-2">First集计算规则:</h5>
              <ul class="space-y-1 text-gray-600">
                <li>• 若 X 是终结符，First(X) = {X}</li>
                <li>• 若 X→ε 是产生式，则 ε ∈ First(X)</li>
                <li>• 若 X→Y₁Y₂...Yₖ，则将 First(Y₁) 中非 ε 符号加入 First(X)</li>
                <li>• 若 ε ∈ First(Yi)，继续处理 Yi+1</li>
              </ul>
            </div>
            <div>
              <h5 class="font-medium text-gray-800 mb-2">Follow集计算规则:</h5>
              <ul class="space-y-1 text-gray-600">
                <li>• $ ∈ Follow(S)，S 为开始符号</li>
                <li>• 若 A→αBβ，将 First(β) 中非 ε 符号加入 Follow(B)</li>
                <li>• 若 A→αB 或 A→αBβ 且 ε ∈ First(β)，将 Follow(A) 加入 Follow(B)</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 进度提示 -->
        <div v-if="allCompleted" class="bg-green-50 border border-green-200 rounded-lg p-6">
          <div class="flex items-center">
            <Icon icon="lucide:check-circle" class="w-6 h-6 text-green-500 mr-3" />
            <div>
              <p class="text-lg font-medium text-green-800">恭喜！First集和Follow集验证成功</p>
              <p class="text-sm text-green-600 mt-1">可以进入下一步构建LL1分析表</p>
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
        <div class="text-sm text-gray-500">步骤 2 / 4</div>
        <button
          @click="$emit('next-step')"
          :disabled="!allCompleted"
          :class="[
            'px-6 py-2 rounded-lg transition-colors flex items-center gap-2',
            allCompleted
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          ]"
        >
          下一步
          <Icon icon="lucide:chevron-right" class="w-4 h-4" />
        </button>
      </div>
    </div>

    <transition name="fade">
      <div v-if="copyTip" class="fixed top-8 right-8 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 bg-green-600 text-white">
        <Icon icon="lucide:copy" class="w-5 h-5" />
        <span>{{ copyTip }}</span>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useLL1Store } from '@/stores/ll1'

defineEmits<{
  'next-step': []
  'prev-step': []
}>()

// 使用pinia store
const ll1Store = useLL1Store()

// 数据引用
const originalData = computed(() => ll1Store.originalData)
const correctFirstSets = computed(() => ll1Store.firstSets)
const correctFollowSets = computed(() => ll1Store.followSets)

// 用户输入的集合
const userFirstSets = ref<Record<string, string>>({})
const userFollowSets = ref<Record<string, string>>({})

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

// 尝试次数
const firstAttempts = ref(0)
const followAttempts = ref(0)
const maxAttempts = 3

// 完成状态
const firstStepCompleted = computed(() => {
  return originalData.value?.Vn.every(symbol => firstValidation.value[symbol] === 'correct') || false
})

const allCompleted = computed(() => {
  const firstCompleted = originalData.value?.Vn.every(symbol => firstValidation.value[symbol] === 'correct') || false
  const followCompleted = originalData.value?.Vn.every(symbol => followValidation.value[symbol] === 'correct') || false
  return firstCompleted && followCompleted
})

// 复制提示
const copyTip = ref('')
let copyTipTimer: number | null = null

// 工具函数
const areCharacterSetsEqual = (str1: string, str2: string): boolean => {
  const set1 = new Set(str1.replace(/\s+/g, '').split(''))
  const set2 = new Set(str2.replace(/\s+/g, '').split(''))

  if (set1.size !== set2.size) {
    return false
  }

  for (const char of set1) {
    if (!set2.has(char)) {
      return false
    }
  }
  return true
}

const getInputClass = (type: 'first' | 'follow', symbol: string): string => {
  const validation = type === 'first' ? firstValidation.value[symbol] : followValidation.value[symbol]

  if (validation === 'correct') {
    return 'border-green-300 bg-green-50'
  } else if (validation === 'incorrect') {
    return 'border-red-300 bg-red-50'
  }
  return 'border-gray-300'
}

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

  try {
    let isAllCorrect = true

    for (const symbol of originalData.value.Vn) {
      const userInput = userFirstSets.value[symbol] || ''
      const correctSet = correctFirstSets.value[symbol] || []
      const correctSetStr = correctSet.join(' ')

      if (areCharacterSetsEqual(userInput, correctSetStr)) {
        firstValidation.value[symbol] = 'correct'
      } else {
        firstValidation.value[symbol] = 'incorrect'
        isAllCorrect = false
      }
    }

    if (isAllCorrect) {
      showFirstAnswer.value = false
    } else {
      if (firstAttempts.value >= maxAttempts) {
        // 显示正确答案
        for (const symbol of originalData.value.Vn) {
          const correctSet = correctFirstSets.value[symbol] || []
          userFirstSets.value[symbol] = correctSet.join(' ')
          firstValidation.value[symbol] = 'correct'
        }
        showFirstAnswer.value = true
      }
    }
  } finally {
    loading.value.first = false
  }
}

const checkFollowSets = async () => {
  if (!originalData.value) return

  loading.value.follow = true
  followAttempts.value++

  try {
    let isAllCorrect = true

    for (const symbol of originalData.value.Vn) {
      const userInput = userFollowSets.value[symbol] || ''
      const correctSet = correctFollowSets.value[symbol] || []
      const correctSetStr = correctSet.join(' ')

      if (areCharacterSetsEqual(userInput, correctSetStr)) {
        followValidation.value[symbol] = 'correct'
      } else {
        followValidation.value[symbol] = 'incorrect'
        isAllCorrect = false
      }
    }

    if (isAllCorrect) {
      showFollowAnswer.value = false
    } else {
      if (followAttempts.value >= maxAttempts) {
        // 显示正确答案
        for (const symbol of originalData.value.Vn) {
          const correctSet = correctFollowSets.value[symbol] || []
          userFollowSets.value[symbol] = correctSet.join(' ')
          followValidation.value[symbol] = 'correct'
        }
        showFollowAnswer.value = true
      }
    }
  } finally {
    loading.value.follow = false
  }
}

// 清空用户输入
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
    followAttempts.value = 0
  }
}

// 拖拽事件处理函数，供所有卡片使用
function onDragStart(symbol: string, event: DragEvent) {
  // 将符号内容写入拖拽数据
  event.dataTransfer?.setData('text/plain', symbol)
}

// 双击符号卡片复制到剪贴板并弹出提示
function onSymbolDblClick(symbol: string) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(symbol).then(() => {
      showCopyTip(`已复制：${symbol}`)
    })
  } else {
    // 兼容性处理
    const textarea = document.createElement('textarea')
    textarea.value = symbol
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    showCopyTip(`已复制：${symbol}`)
  }
}

function showCopyTip(msg: string) {
  copyTip.value = msg
  if (copyTipTimer) clearTimeout(copyTipTimer)
  copyTipTimer = window.setTimeout(() => {
    copyTip.value = ''
  }, 1200)
}

// 初始化
onMounted(() => {
  if (originalData.value?.Vn) {
    originalData.value.Vn.forEach(symbol => {
      userFirstSets.value[symbol] = ''
      userFollowSets.value[symbol] = ''
      firstValidation.value[symbol] = ''
      followValidation.value[symbol] = ''
    })
  }
})
</script>

<style scoped>
.step-header {
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.step-content {
  padding: 2rem;
}

.step-actions {
  padding: 1rem 2rem 2rem;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

.step-icon {
  width: 3rem;
  height: 3rem;
  background-color: #dbeafe;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
