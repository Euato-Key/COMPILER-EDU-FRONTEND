<!-- COMPILER-EDU-FRONTEND\src\views\fa\steps\01-RegexInput.vue -->
<template>
  <div class="regex-input-step">
    <!-- 步骤头部 -->
    <div class="step-header">
      <div class="flex items-center gap-4">
        <div class="step-icon">
          <Icon icon="lucide:edit-3" class="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-900">输入正则表达式</h2>
          <p class="text-gray-600 mt-1">第一步：定义要转换为有限自动机的正则表达式</p>
        </div>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="step-content">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- 左侧：输入区域 -->
        <div class="input-section flex flex-col h-full">
          <!-- 正则表达式输入 -->
          <div class="bg-gray-50 rounded-lg p-6 flex-1">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">正则表达式输入</h3>

            <!-- 输入框 -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2"> 正则表达式 </label>
              <!-- 绑定到 localRegex，与 Store 分离 -->
              <input
                v-model="localRegex"
                type="text"
                placeholder="例如: (a|b)*abb"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                @keyup.enter="validateRegex"
                @input="onInputChange"
              />
            </div>

            <!-- 快速示例 -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2"> 快速示例 </label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="example in examples"
                  :key="example.pattern"
                  @click="applyExample(example.pattern)"
                  class="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                >
                  {{ example.pattern }}
                </button>
              </div>
            </div>

            <!-- 验证和操作 -->
            <div class="flex gap-3">
              <button
                @click="validateRegex"
                :disabled="!localRegex.trim() || commonStore.loading"
                class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Icon
                  :icon="commonStore.loading ? 'lucide:loader-2' : 'lucide:check-circle'"
                  :class="['w-4 h-4 inline mr-2', commonStore.loading ? 'animate-spin' : '']"
                />
                {{ commonStore.loading ? '分析中...' : '验证并生成' }}
              </button>
              <button
                @click="clearInput"
                class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Icon icon="lucide:x" class="w-4 h-4 inline mr-2" />
                清空
              </button>
            </div>

            <!-- 验证结果提示 -->
            <div v-if="validationResult" class="mt-4">
              <div
                :class="[
                  'p-3 rounded-lg',
                  validationResult.valid
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200',
                ]"
              >
                <div class="flex items-start gap-2">
                  <Icon
                    :icon="validationResult.valid ? 'lucide:check-circle' : 'lucide:alert-circle'"
                    :class="[
                      'w-5 h-5 flex-shrink-0 mt-0.5',
                      validationResult.valid ? 'text-green-600' : 'text-red-600',
                    ]"
                  />
                  <div>
                    <p
                      :class="[
                        'font-medium',
                        validationResult.valid ? 'text-green-800' : 'text-red-800',
                      ]"
                    >
                      {{ validationResult.title }}
                    </p>
                    <p
                      :class="[
                        'text-sm mt-1',
                        validationResult.valid ? 'text-green-600' : 'text-red-600',
                      ]"
                    >
                      {{ validationResult.message }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 当前已生效的输入预览 (Store中的数据) -->
          <div
            v-if="faStore.inputRegex"
            class="mt-4 bg-white border border-gray-200 rounded-lg p-6 flex-1"
          >
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold text-gray-900">当前已生效正则</h3>
              <span class="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-bold">
                <Icon icon="lucide:check" class="w-3 h-3 inline mr-1" />已验证
              </span>
            </div>
            
            <div class="font-mono text-lg bg-gray-100 p-3 rounded border text-blue-700 font-bold break-all">
              {{ faStore.inputRegex }}
            </div>
            
            <div v-if="parsedInfo" class="mt-4 text-sm text-gray-600">
              <p><strong>解析信息：</strong></p>
              <ul class="list-disc list-inside space-y-1 mt-2">
                <li>字符数：{{ parsedInfo.charCount }}</li>
                <li>操作符数：{{ parsedInfo.operatorCount }}</li>
                <li>最大嵌套深度：{{ parsedInfo.nestingDepth }}</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 右侧：说明 -->
        <div class="info-section">
          <div class="bg-blue-50 rounded-lg p-6 h-full">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">输入规则说明</h3>

            <!-- 运算符规定 -->
            <div class="mb-6">
              <h4 class="font-medium text-gray-900 mb-3">1. 运算符规定</h4>
              <div class="space-y-2 text-sm ml-4">
                <div class="flex items-start gap-3">
                  <code class="px-2 py-1 bg-white rounded text-blue-600 font-mono">•</code>
                  <span class="text-gray-700">连接运算符，可省略不写。例如：ab 等同于 a•b</span>
                </div>
                <div class="flex items-start gap-3">
                  <code class="px-2 py-1 bg-white rounded text-blue-600 font-mono">|</code>
                  <span class="text-gray-700"
                    >或运算符，用于表示多个选择。例如：a|b 表示匹配 a 或 b</span
                  >
                </div>
                <div class="flex items-start gap-3">
                  <code class="px-2 py-1 bg-white rounded text-blue-600 font-mono">*</code>
                  <span class="text-gray-700"
                    >闭包运算符，表示前面的元素可以出现0次或多次。例如：a* 表示可以匹配0个或多个
                    a</span
                  >
                </div>
                <div class="flex items-start gap-3">
                  <code class="px-2 py-1 bg-white rounded text-blue-600 font-mono">()</code>
                  <span class="text-gray-700">辅助括号，用来改变运算优先级。例如：(a|b)•c</span>
                </div>
                <div class="text-gray-600 text-xs mt-2">
                  <strong>运算优先级：</strong>括号内的表达式 > 闭包运算符 * > 连接运算符 • >
                  或运算符 |
                </div>
              </div>
            </div>

            <!-- 字符规定 -->
            <div class="mb-6">
              <h4 class="font-medium text-gray-900 mb-3">2. 字符规定</h4>
              <div class="space-y-2 text-sm ml-4">
                <div class="text-gray-700">
                  • 可输入字母、数字、标点符等ASCII表中编号范围为32-126的可显示字符
                </div>
                <div class="text-gray-700">
                  • 以及特殊字符
                  <code class="px-1 bg-white rounded text-blue-600 font-mono">ε</code>
                  和
                  <code class="px-1 bg-white rounded text-blue-600 font-mono">•</code>
                </div>
                <div class="text-gray-700">• 输入的空格不会被视为有效字符参与正则表达式匹配</div>
              </div>
            </div>

            <!-- 注意事项 -->
            <div>
              <h4 class="font-medium text-gray-900 mb-3">3. 注意事项</h4>
              <div class="text-sm text-gray-700 ml-4">• 请在英文键盘下输入正则表达式</div>
            </div>

            <!-- 示例 -->
            <div class="mt-6 pt-4 border-t border-blue-200">
              <h4 class="font-medium text-gray-900 mb-3">常用示例</h4>
              <div class="space-y-2 text-sm">
                <div class="flex items-start gap-3">
                  <code class="px-2 py-1 bg-white rounded text-blue-600 font-mono">(a|b)*abb</code>
                  <span class="text-gray-700">以 abb 结尾的字符串</span>
                </div>
                <div class="flex items-start gap-3">
                  <code class="px-2 py-1 bg-white rounded text-blue-600 font-mono">ab*c</code>
                  <span class="text-gray-700">a 后跟零个或多个 b 再跟 c</span>
                </div>
                <div class="flex items-start gap-3">
                  <code class="px-2 py-1 bg-white rounded text-blue-600 font-mono">(0|1)*101</code>
                  <span class="text-gray-700">二进制数以 101 结尾</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 步骤操作栏 -->
    <div class="step-actions">
      <div class="flex justify-between items-center">
        <button
          @click="$emit('prev-step')"
          disabled
          class="px-6 py-2 border border-gray-300 text-gray-400 rounded-lg cursor-not-allowed"
        >
          <Icon icon="lucide:chevron-left" class="w-4 h-4 inline mr-2" />
          上一步
        </button>

        <div class="text-sm text-gray-500">步骤 1 / 6</div>

        <!-- 只有当 Store 里有验证通过的结果时，才允许下一步 -->
        <button
          @click="proceedToNext"
          :disabled="!canProceed"
          :class="[
            'px-6 py-2 rounded-lg transition-colors',
            canProceed
              ? 'bg-blue-600 text-white hover:bg-blue-700'
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
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { Icon } from '@iconify/vue'
import { useFAStoreNew, useCommonStore } from '@/stores'

const emit = defineEmits<{
  'next-step': []
  'prev-step': []
  complete: [data: Record<string, unknown>]
}>()

const faStore = useFAStoreNew()
const commonStore = useCommonStore()

// 本地输入框绑定的变量
const localRegex = ref('')

// 状态恢复锁，防止重复请求
const isRecovering = ref(false)

// 验证结果提示
const validationResult = ref<{
  valid: boolean
  title: string
  message: string
} | null>(null)

const examples = [
  { pattern: '(a|b)*abb', description: '以 abb 结尾的字符串' },
  { pattern: '(a|b)*a(a|b)', description: '倒数第二个字符是 a' },
  { pattern: '(0|1)*101', description: '二进制数以 101 结尾' },
  { pattern: 'ab*c', description: 'a 后跟零个或多个 b 再跟 c' },
  { pattern: 'a(a|b)*', description: 'a 开头后跟任意 a 或 b' },
]

// === 核心逻辑：尝试恢复会话 ===
const handleRecovery = async () => {
  if (isRecovering.value) return
  
  // 如果 Store 里有正则，但没有分析结果，说明需要从后端找回数据
  if (faStore.inputRegex && !faStore.hasResult()) {
    isRecovering.value = true
    console.log('[FA-RECOVERY] 检测到正则记录，正在静默恢复分析结果...', faStore.inputRegex)
    
    try {
      // 传入 true 表示恢复模式：不清空 ID，不清空用户已填写的答案
      const success = await faStore.performFAAnalysis(true)
      
      if (success) {
        console.log('[FA-RECOVERY] 分析结果恢复成功')
        validationResult.value = {
          valid: true,
          title: '已恢复数据',
          message: `已找回记录 ${faStore.currentRecordId || ''} 的分析结果`,
        }
      }
    } catch (err) {
      console.error('[FA-RECOVERY] 恢复失败:', err)
    } finally {
      isRecovering.value = false
    }
  } else if (faStore.hasResult()) {
    // 已经有结果了（比如从步骤2退回）
    validationResult.value = {
      valid: true,
      title: '已生效',
      message: '正则表达式当前处于激活状态',
    }
  }
}

// === 监听器：处理持久化数据的延迟加载 ===
watch(
  () => faStore.inputRegex,
  (newVal) => {
    // 1. 当 Store 里的正则被加载出来时，同步给本地输入框
    if (newVal && !localRegex.value) {
      localRegex.value = newVal
    }
    // 2. 尝试执行恢复逻辑
    if (newVal) {
      handleRecovery()
    }
  },
  { immediate: true } // 立即执行，防止数据已经存在的情况
)

onMounted(async () => {
  console.log('[FA-DEBUG] 组件已挂载，当前 Store 状态:', {
    regex: faStore.inputRegex,
    hasResult: faStore.hasResult()
  })
  
  // 确保在挂载后再执行一次，处理极端情况
  await nextTick()
  handleRecovery()
})

// === 计算属性 ===
const parsedInfo = computed(() => {
  if (!faStore.inputRegex) return null
  const charCount = faStore.inputRegex.length
  const operatorCount = (faStore.inputRegex.match(/[|*()]/g) || []).length
  let depth = 0, maxDepth = 0
  for (const char of faStore.inputRegex) {
    if (char === '(') { depth++; maxDepth = Math.max(maxDepth, depth) }
    else if (char === ')') { depth-- }
  }
  return { charCount, operatorCount, nestingDepth: maxDepth }
})

const canProceed = computed(() => {
  return faStore.hasResult() && !commonStore.loading
})

// === 交互方法 ===
const onInputChange = () => {
  if (validationResult.value && !validationResult.value.valid) {
    validationResult.value = null
  }
}

const applyExample = (pattern: string) => {
  localRegex.value = pattern
}

const validateRegex = async () => {
  if (!localRegex.value.trim()) {
    validationResult.value = { valid: false, title: '输入为空', message: '请输入正则表达式' }
    return
  }

  try {
    const pattern = localRegex.value.replace(/ +/g, '')
    faStore.setInputRegex(pattern)

    // 新分析（非恢复模式）
    const success = await faStore.performFAAnalysis()

    if (success) {
      faStore.saveToHistory()
      validationResult.value = {
        valid: true,
        title: '验证成功',
        message: '已生成新分析结果并创建答题记录',
      }
    } else {
      validationResult.value = {
        valid: false,
        title: '验证失败',
        message: commonStore.error || '后端解析正则表达式失败',
      }
    }
  } catch (error) {
    validationResult.value = {
      valid: false,
      title: '格式错误',
      message: error instanceof Error ? error.message : '未知错误',
    }
  }
}

const clearInput = () => {
  localRegex.value = ''
  faStore.resetAll()
  validationResult.value = null
}

const proceedToNext = () => {
  if (!canProceed.value || !faStore.originalData) return
  window.scrollTo({ top: 0, behavior: 'smooth' })
  emit('next-step')
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
  background: #dbeafe;
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

/* 输入框焦点样式 */
input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* 代码样式 */
code {
  font-family:
    'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
}

/* 动画效果 */
.step-content {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 确保左右两侧高度一致 */
.step-content .grid {
  align-items: stretch;
}

.input-section {
  min-height: 0;
}

.info-section {
  min-height: 0;
}
</style>
