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
              <input
                v-model="faStore.inputRegex"
                type="text"
                placeholder="例如: (a|b)*abb"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                @keyup.enter="validateRegex"
              />
            </div>

            <!-- 快速示例 -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2"> 快速示例 </label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="example in examples"
                  :key="example.pattern"
                  @click="faStore.setInputRegex(example.pattern)"
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
                :disabled="!faStore.inputRegex.trim() || commonStore.loading"
                class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Icon
                  :icon="commonStore.loading ? 'lucide:loader-2' : 'lucide:check-circle'"
                  :class="['w-4 h-4 inline mr-2', commonStore.loading ? 'animate-spin' : '']"
                />
                {{ commonStore.loading ? '验证中...' : '验证正则' }}
              </button>
              <button
                @click="clearInput"
                class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Icon icon="lucide:x" class="w-4 h-4 inline mr-2" />
                清空
              </button>
            </div>

            <!-- 验证结果 -->
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
                      {{ validationResult.valid ? '正则表达式有效' : '正则表达式无效' }}
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

          <!-- 当前输入预览 -->
          <div
            v-if="faStore.inputRegex"
            class="mt-4 bg-white border border-gray-200 rounded-lg p-6 flex-1"
          >
            <h3 class="text-lg font-semibold text-gray-900 mb-4">当前输入</h3>
            <div class="font-mono text-lg bg-gray-100 p-3 rounded border">
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

        <button
          @click="proceedToNext"
          :disabled="!isValidAndReady"
          :class="[
            'px-6 py-2 rounded-lg transition-colors',
            isValidAndReady
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
import { ref, computed, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { useFAStore, useCommonStore } from '@/stores'

const emit = defineEmits<{
  'next-step': []
  'prev-step': []
  complete: [data: Record<string, unknown>]
}>()

// 使用 Pinia stores
const faStore = useFAStore()
const commonStore = useCommonStore()

// 本地状态（用于表单验证等临时状态）
const validationResult = ref<{
  valid: boolean
  message: string
} | null>(null)

// 示例正则表达式
const examples = [
  { pattern: '(a|b)*abb', description: '以 abb 结尾的字符串' },
  { pattern: '(a|b)*a(a|b)', description: '倒数第二个字符是 a' },
  { pattern: '(0|1)*101', description: '二进制数以 101 结尾' },
  { pattern: 'ab*c', description: 'a 后跟零个或多个 b 再跟 c' },
  { pattern: 'a(a|b)*', description: 'a 开头后跟任意 a 或 b' },
]

// 解析信息
const parsedInfo = computed(() => {
  if (!faStore.inputRegex) return null

  const charCount = faStore.inputRegex.length
  const operatorCount = (faStore.inputRegex.match(/[|*()]/g) || []).length

  // 计算嵌套深度
  let depth = 0
  let maxDepth = 0
  for (const char of faStore.inputRegex) {
    if (char === '(') {
      depth++
      maxDepth = Math.max(maxDepth, depth)
    } else if (char === ')') {
      depth--
    }
  }

  return {
    charCount,
    operatorCount,
    nestingDepth: maxDepth,
  }
})

// 是否验证通过且准备就绪
const isValidAndReady = computed(() => {
  return validationResult.value?.valid === true && faStore.hasResult() && !commonStore.loading
})

// 验证正则表达式
const validateRegex = async () => {
  if (!faStore.inputRegex.trim()) {
    validationResult.value = {
      valid: false,
      message: '请输入正则表达式',
    }
    return
  }

  // 基本语法检查
  try {
    // 关键修改：像旧代码一样处理空格，只消除空格但不消除换行
    const pattern = faStore.inputRegex.replace(/ +/g, '')

    console.log('经过处理后的输入Regex：', pattern) // 调试用

    // 检查是否包含中文
    if (/[\u4e00-\u9fa5]/.test(pattern)) {
      validationResult.value = {
        valid: false,
        message: '输入不能包含中文字符',
      }
      return
    }

    // 检查ASCII字符范围（32-126）、特殊字符ε和•符号
    for (const char of pattern) {
      const charCode = char.charCodeAt(0)
      if (char !== 'ε' && char !== '•' && (charCode < 32 || charCode > 126)) {
        validationResult.value = {
          valid: false,
          message: `字符 "${char}" 不在允许范围内。只能输入ASCII字符(32-126)、特殊字符ε和•符号`,
        }
        return
      }
    }

    // 检查括号匹配
    let openCount = 0
    for (const char of pattern) {
      if (char === '(') openCount++
      else if (char === ')') openCount--
      if (openCount < 0) {
        throw new Error('括号不匹配：右括号多于左括号')
      }
    }
    if (openCount > 0) {
      throw new Error('括号不匹配：左括号多于右括号')
    }

    // 检查空操作符
    if (pattern.includes('||') || pattern.includes('**') || pattern.includes('••')) {
      throw new Error('不允许连续的操作符')
    }

    // 检查开头结尾的操作符
    if (/^[|*•]/.test(pattern)) {
      throw new Error('正则表达式不能以操作符开头')
    }
    if (/[|•]$/.test(pattern)) {
      throw new Error('正则表达式不能以操作符结尾')
    }

    // 重要：更新store中的正则表达式为处理后的版本（去空格）
    faStore.setInputRegex(pattern)

    // 调用store的分析方法
    const success = await faStore.performFAAnalysis()

    if (success) {
      validationResult.value = {
        valid: true,
        message: '正则表达式验证成功，已生成 NFA/DFA',
      }
    } else {
      validationResult.value = {
        valid: false,
        message: commonStore.error || '分析失败',
      }
    }
  } catch (error) {
    validationResult.value = {
      valid: false,
      message: error instanceof Error ? error.message : '未知错误',
    }
  }
}

// 清空输入
const clearInput = () => {
  faStore.resetAll()
  validationResult.value = null
}

// 进入下一步
const proceedToNext = () => {
  if (!isValidAndReady.value || !faStore.originalData) return

  // 发送完成事件，传递正则表达式数据和FA结果
  const stepData = {
    regex: faStore.inputRegex,
    parsedInfo: parsedInfo.value,
    faResult: faStore.originalData,
    validationData: faStore.validationData,
    timestamp: new Date().toISOString(),
  }

  console.log('Step 1 completed with data:', stepData)

  // 滚动到页面顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })

  // 直接进入下一步，数据已经保存在 Pinia store 中
  emit('complete', stepData)
  emit('next-step')
}

// 监听输入变化，自动验证
watch(
  () => faStore.inputRegex,
  (newValue) => {
    if (newValue && validationResult.value) {
      // 清空之前的验证结果，用户修改时重新验证
      validationResult.value = null
      faStore.clearAnalysis()
    }
  },
)
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
