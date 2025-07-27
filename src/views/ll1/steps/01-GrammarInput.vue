<template>
  <div class="grammar-input-step">
    <div class="step-header">
      <div class="flex items-center gap-4">
        <div class="step-icon">
          <Icon icon="lucide:file-text" class="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-900">输入文法</h2>
          <p class="text-gray-600 mt-1">第一步：定义上下文无关文法规则</p>
        </div>
      </div>
    </div>

    <div class="step-content">
      <div class="max-w-4xl mx-auto">
        <!-- 文法输入区域 -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">输入产生式</h3>
            <div class="flex items-center gap-1.5">
              <Icon icon="lucide:info" class="w-4 h-4 text-blue-500" />
              <span class="text-sm text-gray-600">支持格式：A->α|β</span>
            </div>
          </div>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                文法规则 <span class="text-red-500">*</span>
                <span class="text-xs text-gray-500 ml-2">(每行一个产生式，使用单字符作为符号)</span>
              </label>
              <textarea
                v-model="grammarInput"
                placeholder="请输入文法产生式，例如：&#10;S->AB&#10;A->a|ε&#10;B->b"
                class="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-y transition-colors"
                @input="handleInput"
              />
              <div class="mt-2 text-xs text-gray-500">
                <div class="flex items-center justify-between mb-1">
                  <span>提示：不支持中文字符，不能有重复产生式</span>
                  <span>{{ grammarInput.length }} 字符</span>
                </div>
                <div class="text-blue-600">
                  <p><strong>重要规范：</strong></p>
                  <p>• 开始符：第一个产生式的左侧大写字母为开始符</p>
                  <p>• 字符规定：每个符号必须是单个字符（如A、B、C，而非E1、id等）</p>
                  <p>• 产生式格式：必须为"大写字母->右部"格式（如：S->AB）</p>
                  <p>• 右部格式：可以是单个符号或由"|"分隔的多个候选式（如：A->a|ε）</p>
                  <p>• 限制条件：不能有左递归，每个非终结符必须有产生式定义</p>
                  <p>• 终结符规则：终结符不能连续出现，如A->ab是错误的，应为A->aB,B->b（ε除外）</p>
                  <p>• ε符号：ε只能单独作为一个候选式，如G->+TG|ε是正确的</p>
                </div>
              </div>
            </div>

            <!-- 输入时错误提示 -->
            <div v-if="inputErrors.length > 0" class="bg-red-50 border border-red-200 rounded-md p-3">
              <div class="flex gap-2">
                <Icon
                  icon="lucide:alert-circle"
                  class="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0"
                />
                <div>
                  <p class="text-sm text-red-700 font-medium">输入格式错误</p>
                  <div class="text-sm text-red-600 mt-1">
                    <ul class="list-disc list-inside space-y-1">
                      <li v-for="error in inputErrors" :key="error">{{ error }}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <!-- 验证按钮 -->
            <div class="flex justify-center">
              <button
                @click="handleValidateGrammar"
                :disabled="!canValidate || isValidating"
                :class="[
                  'flex items-center gap-2 px-8 py-3 rounded-lg font-medium transition-all duration-200',
                  canValidate && !isValidating
                    ? 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                ]"
              >
                <Icon
                  v-if="isValidating"
                  icon="lucide:loader-2"
                  class="w-4 h-4 animate-spin"
                />
                <Icon
                  v-else
                  icon="lucide:check-circle"
                  class="w-4 h-4"
                />
                <span>{{ isValidating ? '验证中...' : '验证文法' }}</span>
              </button>
            </div>

            <!-- 验证状态提示 -->
            <div v-if="validationStatus !== 'none'" class="rounded-md p-4 border">
              <!-- 准备验证状态 -->
              <div v-if="validationStatus === 'ready'" class="bg-blue-50 border-blue-200">
                <div class="flex gap-2">
                  <Icon
                    icon="lucide:info"
                    class="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0"
                  />
                  <div>
                    <p class="text-sm text-blue-700 font-medium">{{ validationMessage }}</p>
                    <p class="text-sm text-blue-600 mt-1">点击"验证文法"按钮进行深度校验</p>
                  </div>
                </div>
              </div>

              <!-- 验证成功状态 -->
              <div v-else-if="validationStatus === 'success'" class="bg-green-50 border-green-200">
                <div class="flex gap-2">
                  <Icon
                    icon="lucide:check-circle"
                    class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                  />
                  <div>
                    <p class="text-sm text-green-700 font-medium">{{ validationMessage }}</p>
                    <p class="text-sm text-green-600 mt-1">可以进入下一步</p>
                    <div class="text-xs text-green-600 mt-2">
                      <p><strong>文法信息：</strong></p>
                      <ul class="list-disc list-inside space-y-1 mt-1">
                        <li>开始符号：{{ originalData?.S || '未确定' }}</li>
                        <li>非终结符：{{ originalData?.Vn?.join(', ') || '未确定' }}</li>
                        <li>终结符：{{ originalData?.Vt?.join(', ') || '未确定' }}</li>
                        <li>产生式数量：{{ productions.length }} 个</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 验证失败状态 -->
              <div v-else-if="validationStatus === 'failed'" class="bg-red-50 border-red-200">
                <div class="flex gap-2">
                  <Icon
                    icon="lucide:x-circle"
                    class="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0"
                />
                <div>
                    <p class="text-sm text-red-700 font-medium">{{ validationMessage }}</p>
                    <div v-if="submitErrors.length > 0" class="text-sm text-red-600 mt-1">
                      <p><strong>具体错误：</strong></p>
                      <ul class="list-disc list-inside space-y-1 mt-1">
                        <li v-for="error in submitErrors" :key="error">{{ error }}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 示例文法 -->
        <div class="bg-gray-50 rounded-lg p-6 mb-6">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <Icon icon="lucide:book-open" class="w-5 h-5 text-gray-600" />
              <h4 class="text-md font-semibold text-gray-900">示例文法</h4>
            </div>
            <span class="text-xs text-gray-500">点击使用示例</span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              v-for="(example, index) in exampleGrammars"
              :key="index"
              class="bg-white rounded-lg p-4 border border-gray-200 cursor-pointer hover:border-green-300 hover:shadow-md transition-all duration-200 group"
              @click="useExample(example)"
            >
              <div class="flex items-center justify-between mb-3">
                <h5 class="font-medium text-gray-800 group-hover:text-green-700">
                  {{ example.name }}
                </h5>
                <Icon
                  icon="lucide:copy"
                  class="w-4 h-4 text-gray-400 group-hover:text-green-500 transition-colors"
                />
              </div>
              <pre class="text-sm text-gray-600 font-mono leading-relaxed">{{
                example.grammar
              }}</pre>
              <div class="mt-3 pt-3 border-t border-gray-100">
                <span class="text-xs text-gray-500">{{ example.description }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 分析结果 -->
        <div
          v-if="originalData"
          class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6"
        >
          <div class="flex items-center mb-4">
            <div class="flex items-center gap-2">
              <Icon icon="lucide:zap" class="w-5 h-5 text-blue-600" />
              <h4 class="text-lg font-semibold text-gray-900">当前文法分析结果</h4>
            </div>
            <span
              class="ml-auto px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full"
              >LL(1)文法</span
            >
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- 左侧统计信息 -->
            <div class="lg:col-span-1">
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-white rounded-lg p-5 border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                  <div class="flex items-center gap-3 mb-4">
                    <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon icon="lucide:play" class="w-5 h-5 text-blue-600" />
                    </div>
                    <span class="text-base font-semibold text-gray-700">起始符号</span>
              </div>
                  <p class="text-3xl font-bold text-blue-600 font-mono">{{ originalData.S }}</p>
            </div>

                <div class="bg-white rounded-lg p-5 border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                  <div class="flex items-center gap-3 mb-4">
                    <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Icon icon="lucide:tag" class="w-5 h-5 text-purple-600" />
                    </div>
                    <span class="text-base font-semibold text-gray-700">非终结符</span>
              </div>
                  <p class="text-3xl font-bold text-purple-600 font-mono">{{ originalData.Vn.length }}</p>
                  <p class="text-sm text-gray-500 mt-2 font-mono">{{ originalData.Vn.join(', ') }}</p>
            </div>

                <div class="bg-white rounded-lg p-5 border border-green-100 shadow-sm hover:shadow-md transition-shadow">
                  <div class="flex items-center gap-3 mb-4">
                    <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Icon icon="lucide:hash" class="w-5 h-5 text-green-600" />
                    </div>
                    <span class="text-base font-semibold text-gray-700">终结符</span>
              </div>
                  <p class="text-3xl font-bold text-green-600 font-mono">{{ originalData.Vt.length }}</p>
                  <p class="text-sm text-gray-500 mt-2 font-mono">{{ originalData.Vt.join(', ') }}</p>
            </div>

                <div class="bg-white rounded-lg p-5 border border-orange-100 shadow-sm hover:shadow-md transition-shadow">
                  <div class="flex items-center gap-3 mb-4">
                    <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Icon icon="lucide:list" class="w-5 h-5 text-orange-600" />
                    </div>
                    <span class="text-base font-semibold text-gray-700">产生式数</span>
              </div>
                  <p class="text-3xl font-bold text-orange-600 font-mono">
                {{ Object.keys(originalData.formulas_dict).length }}
              </p>
                </div>
            </div>
          </div>

            <!-- 右侧文法信息 -->
            <div class="lg:col-span-1">
              <div class="bg-white rounded-lg border border-blue-100 p-6 shadow-sm">
                <div class="flex items-center gap-3 mb-4">
                  <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon icon="lucide:file-text" class="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h5 class="text-lg font-semibold text-gray-800">文法信息</h5>
                    <p class="text-sm text-gray-500">Grammar Information</p>
                  </div>
                </div>
                                <div class="space-y-1">
              <div
                v-for="(productions, nonTerminal) in originalData.formulas_dict"
                :key="nonTerminal"
                    class="flex items-center gap-2 p-1.5 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                  >
                    <span class="text-sm font-bold text-blue-700 font-mono">{{ nonTerminal }}</span>
                    <span class="text-gray-400 font-mono text-sm">-></span>
                    <span class="font-mono text-gray-700 text-sm">{{ productions.join(' | ') }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="step-actions">
      <div class="flex justify-between items-center">
        <button
          disabled
          class="flex items-center gap-2 px-6 py-2 border border-gray-300 text-gray-400 rounded-lg cursor-not-allowed"
        >
          <Icon icon="lucide:chevron-left" class="w-4 h-4" />
          <span>上一步</span>
        </button>
        <div class="text-sm text-gray-500">步骤 1 / 4</div>
        <button
          @click="handleNextStep"
          :disabled="!canProceed"
          :class="[
            'flex items-center gap-2 px-6 py-2 rounded-lg transition-colors',
            canProceed
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed',
          ]"
        >
          <span>下一步</span>
          <Icon icon="lucide:chevron-right" class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { Icon } from '@iconify/vue'
import { useLL1Store } from '@/stores/ll1'
import { useCommonStore } from '@/stores/common'

// 获取 Store 实例
const ll1Store = useLL1Store()
const commonStore = useCommonStore()

// 解构响应式状态（用于模板绑定）
const { productions, originalData, inputString } = storeToRefs(ll1Store)
const { loading, error } = storeToRefs(commonStore)

// 定义 emits
const emit = defineEmits<{
  'next-step': []
  'prev-step': []
}>()

// 本地状态
const grammarInput = ref('')
const inputErrors = ref<string[]>([])
const submitErrors = ref<string[]>([])
const isValidating = ref(false)
const validationStatus = ref<'none' | 'ready' | 'success' | 'failed'>('none')
const validationMessage = ref('')

// 计算属性
const isLL1Grammar = computed(() => ll1Store.isLL1Grammar)
const canValidate = computed(() => inputErrors.value.length === 0 && grammarInput.value.trim().length > 0)
const canProceed = computed(() => {
  return validationStatus.value === 'success' && productions.value.length > 0 && originalData.value !== null
})

// 示例文法数据
const exampleGrammars = [
  {
    name: '基础文法1',
    grammar: 'S->AB\nA->a|ε\nB->b',
    description: '最简单的LL(1)文法示例，适合初学者',
  },
  {
    name: '基础文法2',
    grammar: 'S->aS|b',
    description: '简单的递归文法，生成a*b形式的字符串',
  },
  {
    name: '基础文法3',
    grammar: 'S->AB\nA->aA|ε\nB->bB|c',
    description: '生成a*bc+形式字符串的文法',
  },
]

// 输入时基础校验
function validateOnInput(text: string): string[] {
  const errors: string[] = []

  // 检查是否有中文
  if (/[\u4e00-\u9fa5]/.test(text)) {
    errors.push('不能包含中文字符')
  }

  // 检查每一行（非空行）是否包含->
  const lines = text.split('\n')
  lines.forEach((line, idx) => {
    if (line.trim() && !line.includes('->')) {
      errors.push(`第${idx + 1}行缺少->`)
    }
  })

  return errors
}

// 点击按钮后的深度校验
function validateOnSubmit(text: string): string[] {
  const errors: string[] = []

  // 1. 检查是否为空
  if (!text.trim()) {
    errors.push('文法不能为空')
    return errors
  }

  // 2. 检查是否有中文
  if (/[\u4e00-\u9fa5]/.test(text)) {
    errors.push('不能包含中文字符')
    return errors
  }

  // 3. 去除所有空格（保留换行符）
  const noSpaceText = text.replace(/ +/g, '')

  // 4. 进行分割
  const lines = noSpaceText.split('\n').filter(line => line.trim())

  // 5. 检查是否分割后每一行含有->
  lines.forEach((line, idx) => {
    if (!line.includes('->')) {
      errors.push(`第${idx + 1}行缺少->`)
    }
  })

  if (errors.length > 0) return errors

  // 6. 检查重复项（行）
  const lineSet = new Set(lines)
  if (lineSet.size !== lines.length) {
    errors.push('存在重复产生式')
    return errors
  }

  // 7. 检查是否符合产生式要求
  lines.forEach((line, idx) => {
    // 检查格式：X->Y，其中X为大写字母，Y为任意字符（除|）和|分隔的序列
    if (!/^([A-Z])->((?:[^|]+\|)*[^|]+)$/.test(line)) {
      errors.push(`第${idx + 1}行格式错误，应为"大写字母->右部"格式`)
    }
  })

  if (errors.length > 0) return errors

  // 8. 检查非终结符是否有候选式
  const leftNonTerminals = new Set(lines.map(line => line.split('->')[0]))
  const allNonTerminals = new Set<string>()

  // 收集所有右部出现的非终结符
  lines.forEach(line => {
    const right = line.split('->')[1]
    const rightParts = right.split('|')
    rightParts.forEach(part => {
      if (/^[A-Z]/.test(part)) {
        allNonTerminals.add(part[0])
      }
    })
  })

  // 检查右部的非终结符是否都有定义
  allNonTerminals.forEach(nonTerminal => {
    if (!leftNonTerminals.has(nonTerminal)) {
      errors.push(`右部非终结符${nonTerminal}未定义`)
    }
  })

  if (errors.length > 0) return errors

  // 9. 检查是否含有左递归
  lines.forEach((line, idx) => {
    const [left, right] = line.split('->')
    const rightParts = right.split('|')
    rightParts.forEach(part => {
      if (part[0] === left) {
        errors.push(`第${idx + 1}行存在左递归`)
      }
    })
  })

  if (errors.length > 0) return errors

  // 10. 检查ε符号
  lines.forEach((line, idx) => {
    const [left, right] = line.split('->')
    const rightParts = right.split('|')
    rightParts.forEach(part => {
      if (part.includes('ε') && part !== 'ε') {
        errors.push(`第${idx + 1}行：ε只能单独作为一个候选式`)
      }
    })
  })

  if (errors.length > 0) return errors

    // 11. 检查终结符连续出现
  lines.forEach((line, idx) => {
    const [left, right] = line.split('->')
    const rightParts = right.split('|')
    rightParts.forEach(part => {
      // 跳过ε
      if (part === 'ε') return

      // 检查是否有连续的终结符（除了大写字母、|、空格、非终结符以外的字符）
      for (let i = 0; i < part.length - 1; i++) {
        const current = part[i]
        const next = part[i + 1]

        // 如果当前字符和下一个字符都不是大写字母、|、空格，则可能是连续的终结符
        const isCurrentTerminal = !/[A-Z| ]/.test(current)
        const isNextTerminal = !/[A-Z| ]/.test(next)

        if (isCurrentTerminal && isNextTerminal) {
          errors.push(`第${idx + 1}行：终结符不能连续出现，如"${current}${next}"`)
          return // 一个候选式中只报一次错误
        }
      }
    })
  })

  return errors
}

// 处理输入变化
function handleInput() {
  inputErrors.value = validateOnInput(grammarInput.value)

  // 根据输入状态更新验证状态
  if (inputErrors.value.length > 0) {
    validationStatus.value = 'none'
    validationMessage.value = ''
  } else if (grammarInput.value.trim()) {
    validationStatus.value = 'ready'
    validationMessage.value = '符合文法验证条件：可以进行文法验证'
  } else {
    validationStatus.value = 'none'
    validationMessage.value = ''
  }

  // 清除提交错误
  submitErrors.value = []
}

// 处理验证文法按钮点击
async function handleValidateGrammar() {
  if (!canValidate.value || isValidating.value) return

  submitErrors.value = []
  isValidating.value = true
  validationStatus.value = 'none'
  validationMessage.value = ''

  try {
    // 深度校验
    const errors = validateOnSubmit(grammarInput.value)
    if (errors.length > 0) {
      submitErrors.value = errors
      validationStatus.value = 'failed'
      validationMessage.value = '不符合文法验证条件：' + errors.join('；')
      return
    }

    // 处理输入：去除空格，分割
    const noSpaceText = grammarInput.value.replace(/ +/g, '')
    const processedLines = noSpaceText.split('\n').filter(line => line.trim())

    // 提交后端
    const success = await ll1Store.performLL1Analysis(processedLines)

    // 检查后端验证结果
    if (success && ll1Store.isLL1Grammar === true) {
      // 后端验证通过，存储用户输入和后端数据
      ll1Store.setProductions(processedLines)
      validationStatus.value = 'success'
      validationMessage.value = '文法验证成功：符合LL(1)文法规范'
      // 清除错误
      submitErrors.value = []
    } else {
      // 后端验证失败
      validationStatus.value = 'failed'
      validationMessage.value = '文法验证失败：不符合LL(1)文法要求'
      submitErrors.value = ['后端验证失败：不符合LL(1)文法要求']
    }
  } catch (error) {
    console.error('验证失败:', error)
    validationStatus.value = 'failed'
    validationMessage.value = '文法验证失败：验证过程中发生错误，请重试'
    submitErrors.value = ['验证过程中发生错误，请重试']
  } finally {
    isValidating.value = false
  }
}

// 使用示例文法
function useExample(example: any) {
  grammarInput.value = example.grammar
  // 触发输入校验
  handleInput()
  // 重置验证状态
  validationStatus.value = 'none'
  validationMessage.value = ''
  submitErrors.value = []
}

// 处理下一步
function handleNextStep() {
  if (canProceed.value) {
    emit('next-step')
  }
}

// 监听grammarInput变化，同步到store（用于显示）
watch(grammarInput, (newValue) => {
  if (newValue.trim()) {
    const lines = newValue.split('\n').filter(line => line.trim())
    ll1Store.setProductions(lines)
    } else {
    ll1Store.setProductions([])
  }
})
</script>

<style scoped>
.step-header {
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 2rem;
}

.step-content {
  padding: 2rem;
  margin-bottom: 2rem;
}

.step-actions {
  padding: 1rem 2rem 2rem;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

.step-icon {
  width: 3rem;
  height: 3rem;
  background-color: #dcfce7;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
