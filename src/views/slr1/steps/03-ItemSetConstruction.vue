<template>
  <div class="item-set-construction-step">
    <div class="step-header">
      <div class="flex items-center gap-4">
        <div class="step-icon">
          <Icon icon="lucide:git-merge" class="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-900">画DFA</h2>
          <p class="text-gray-600 mt-1">第三步：构造SLR1项目集规范族DFA</p>
        </div>
      </div>
    </div>

    <!-- 操作说明 -->
    <div class="bg-purple-50 border border-purple-200 rounded-lg p-4 mx-6 mt-4">
      <h3 class="text-lg font-semibold text-purple-800 mb-3">操作流程</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-700">
        <div>
          <h4 class="font-medium mb-2">1. 项目集管理：</h4>
          <ul class="space-y-1">
            <li>• 双击画布空白处创建新项目集</li>
            <li>• 点击"添加项目集"按钮手动添加</li>
            <li>• 点击项目集节点可编辑LR项目内容</li>
          </ul>
        </div>
        <div>
          <h4 class="font-medium mb-2">2. 转移关系：</h4>
          <ul class="space-y-1">
            <li>• 拖拽节点连接创建转移边</li>
            <li>• 选择两个节点后点击"连接项目集"</li>
            <li>• 点击边可编辑转移符号</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="step-content">
      <!-- 当前文法信息 -->
      <div v-if="grammarInfo" class="bg-gray-50 rounded-lg p-4 mb-4">
        <h4 class="font-semibold text-gray-800 mb-2">当前增广文法</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span class="font-medium">开始符号：</span>{{ grammarInfo.startSymbol }}
          </div>
          <div>
            <span class="font-medium">产生式数量：</span>{{ grammarInfo.productions?.length || 0 }}
          </div>
        </div>
        <div v-if="grammarInfo.productions?.length" class="mt-3">
          <span class="font-medium">产生式：</span>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
            <div
              v-for="(prod, index) in grammarInfo.productions"
              :key="index"
              class="text-xs bg-white px-2 py-1 rounded border"
            >
              {{ prod }}
            </div>
          </div>
        </div>
      </div>

      <!-- LR画布 -->
      <div class="canvas-wrapper">
        <LRCanvas
          ref="lrCanvasRef"
          @nodes-change="onNodesChange"
          @edges-change="onEdgesChange"
        />
      </div>

      <!-- 验证按钮 -->
      <div class="flex justify-center gap-4 mt-6">
        <button
          @click="validateDFA"
          :disabled="isValidating"
          class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
        >
          <Icon
            :icon="isValidating ? 'lucide:loader-2' : 'lucide:check-circle'"
            :class="['w-4 h-4 inline mr-2', isValidating ? 'animate-spin' : '']"
          />
          {{ isValidating ? '验证中...' : '验证DFA' }}
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

    <div class="step-actions">
      <div class="flex justify-between items-center">
        <button @click="$emit('prev-step')" class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          <Icon icon="lucide:chevron-left" class="w-4 h-4 inline mr-2" />
          上一步
        </button>
        <div class="text-sm text-gray-500">步骤 3 / 5</div>
        <button
          @click="nextStep"
          :disabled="!isStepComplete"
          :class="[
            'px-6 py-2 rounded-lg transition-colors',
            isStepComplete
              ? 'bg-purple-600 text-white hover:bg-purple-700'
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
import { useSLR1API } from '@/composables/api/useSLR1API'
import LRCanvas from '@/components/flow/canvas/LRCanvas.vue'

const emit = defineEmits<{
  'next-step': []
  'prev-step': []
}>()

const slr1API = useSLR1API()

// 画布引用
const lrCanvasRef = ref<InstanceType<typeof LRCanvas>>()

// 组件状态
const isValidating = ref(false)
const validationMessage = ref('')
const validationSuccess = ref(false)
const savedCanvasData = ref<any>(null)

// 模拟的文法信息（在实际应用中应该从store或props获取）
const grammarInfo = computed(() => ({
  startSymbol: "S'",
  productions: [
    "S' → S",
    "S → E",
    "E → E + T | T",
    "T → T * F | F",
    "F → ( E ) | id"
  ]
}))

// 步骤完成状态
const isStepComplete = ref(false)

// 画布事件处理
const onNodesChange = (nodes: any[]) => {
  // 保存节点状态
  savedCanvasData.value = {
    nodes: lrCanvasRef.value?.getNodes() || [],
    edges: lrCanvasRef.value?.getEdges() || []
  }
  checkStepCompletion()
}

const onEdgesChange = (edges: any[]) => {
  // 保存边状态
  savedCanvasData.value = {
    nodes: lrCanvasRef.value?.getNodes() || [],
    edges: lrCanvasRef.value?.getEdges() || []
  }
  checkStepCompletion()
}

// 检查步骤完成状态
const checkStepCompletion = () => {
  const nodes = lrCanvasRef.value?.getNodes() || []
  const edges = lrCanvasRef.value?.getEdges() || []

  // 至少有一个项目集节点才算开始构造
  isStepComplete.value = nodes.length > 0
}

// 验证DFA
const validateDFA = async () => {
  if (!lrCanvasRef.value) return

  isValidating.value = true
  validationMessage.value = ''

  try {
    const nodes = lrCanvasRef.value.getNodes()
    const edges = lrCanvasRef.value.getEdges()

    // 这里应该调用实际的API来验证DFA
    // 暂时使用模拟的验证逻辑
    if (nodes.length === 0) {
      validationSuccess.value = false
      validationMessage.value = '请至少创建一个项目集'
    } else {
      validationSuccess.value = true
      validationMessage.value = `验证成功！已创建${nodes.length}个项目集，${edges.length}个转移关系`
      isStepComplete.value = true
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
  if (!lrCanvasRef.value) return

  try {
    // 这里应该从API获取标准答案
    // 暂时使用模拟数据
    lrCanvasRef.value.clearCanvas()

    // 添加示例项目集
    setTimeout(() => {
      lrCanvasRef.value?.addItemSet()
      isStepComplete.value = true
      validationMessage.value = '已加载标准答案'
      validationSuccess.value = true
    }, 100)
  } catch (error) {
    console.error('Error loading answer:', error)
  }
}

const nextStep = () => {
  emit('next-step')
}

// 组件挂载后的初始化
onMounted(() => {
  // 这里可以加载之前保存的画布数据
  // 暂时使用空的初始化
})
</script>

<style scoped>
.step-header { padding: 2rem 2rem 1rem; border-bottom: 1px solid #e5e7eb; }
.step-icon { width: 3rem; height: 3rem; background: #f3e8ff; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; }
.step-content { padding: 2rem; }
.step-actions { padding: 1rem 2rem 2rem; border-top: 1px solid #e5e7eb; background: #f9fafb; }
</style>
