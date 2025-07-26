<template>
  <div class="augmented-grammar-step">
    <div class="step-header">
      <div class="flex items-center gap-4">
        <div class="step-icon">
          <Icon icon="lucide:file-plus" class="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-900">写出增广文法</h2>
          <p class="text-gray-600 mt-1">第二步：构造增广文法和拓展产生式</p>
        </div>
      </div>
    </div>

    <div class="step-content">
      <div v-if="!stepData" class="text-center py-20">
        <Icon icon="lucide:arrow-left" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-gray-600 mb-2">请先完成第一步</h3>
        <p class="text-gray-500">需要先输入并验证文法才能进行增广文法构造</p>
      </div>

      <div v-else class="space-y-8">
        <!-- 说明区域 -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div class="flex items-start">
            <Icon icon="lucide:info" class="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
            <div>
              <h3 class="text-lg font-semibold text-blue-900 mb-2">增广文法构造规则</h3>
              <ul class="space-y-2 text-sm text-blue-800">
                <li>• 为原文法添加新的开始符号 S'</li>
                <li>• 添加新的产生式：S' → S（其中S是原文法的开始符号）</li>
                <li>• 保持原有产生式不变</li>
                <li>• 增广文法用于LR分析器的构造</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 原文法展示 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">原文法</h3>
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div class="space-y-2">
                <div class="text-sm text-gray-600 mb-2">开始符号：{{ stepData.analysisResult.S }}</div>
                <div class="font-mono text-sm">
                  <div v-for="(production, index) in stepData.analysisResult.formulas_list" :key="index" class="py-1">
                    {{ production }}
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-4 grid grid-cols-2 gap-4">
              <div>
                <h4 class="text-sm font-medium text-gray-700 mb-2">非终结符 (Vn)</h4>
                <div class="bg-white border rounded p-3">
                  <div class="flex flex-wrap gap-2">
                    <span v-for="vn in stepData.analysisResult.Vn" :key="vn"
                          class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-mono">
                      {{ vn }}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h4 class="text-sm font-medium text-gray-700 mb-2">终结符 (Vt)</h4>
                <div class="bg-white border rounded p-3">
                  <div class="flex flex-wrap gap-2">
                    <span v-for="vt in stepData.analysisResult.Vt" :key="vt"
                          class="px-2 py-1 bg-green-100 text-green-800 rounded text-sm font-mono">
                      {{ vt }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 增广文法展示 -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">增广文法</h3>
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div class="space-y-2">
                <div class="text-sm text-yellow-700 mb-2">新开始符号：S'</div>
                <div class="font-mono text-sm">
                  <!-- 新增的产生式 -->
                  <div class="py-1 bg-yellow-100 px-2 rounded mb-2 border border-yellow-300">
                    <span class="text-yellow-800 font-medium">S' -> {{ stepData.analysisResult.S }}</span>
                    <span class="text-xs text-yellow-600 ml-2">(新增)</span>
                  </div>
                  <!-- 原有产生式 -->
                  <div v-for="(production, index) in stepData.analysisResult.formulas_list" :key="index" class="py-1">
                    {{ production }}
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-4 grid grid-cols-2 gap-4">
              <div>
                <h4 class="text-sm font-medium text-gray-700 mb-2">增广非终结符 (Vn')</h4>
                <div class="bg-white border rounded p-3">
                  <div class="flex flex-wrap gap-2">
                    <span class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm font-mono border border-yellow-300">
                      S'
                    </span>
                    <span v-for="vn in stepData.analysisResult.Vn" :key="vn"
                          class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-mono">
                      {{ vn }}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h4 class="text-sm font-medium text-gray-700 mb-2">终结符 (Vt)</h4>
                <div class="bg-white border rounded p-3">
                  <div class="flex flex-wrap gap-2">
                    <span v-for="vt in stepData.analysisResult.Vt" :key="vt"
                          class="px-2 py-1 bg-green-100 text-green-800 rounded text-sm font-mono">
                      {{ vt }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 产生式编号 -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-4">编号后的产生式</h3>
          <div class="bg-white border border-gray-200 rounded-lg p-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="(production, index) in augmentedProductions" :key="index"
                   class="flex items-center space-x-3 p-2 rounded"
                   :class="index === 0 ? 'bg-yellow-50' : 'bg-gray-50'">
                <span class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                      :class="index === 0 ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-200 text-gray-700'">
                  {{ index }}
                </span>
                <span class="font-mono text-sm">{{ production }}</span>
                <span v-if="index === 0" class="text-xs text-yellow-600">(增广)</span>
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
        <div class="text-sm text-gray-500">步骤 2 / 5</div>
        <button
          @click="nextStep"
          :disabled="!stepData"
          class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
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

const stepData = ref<any>(null)

// 增广产生式列表
const augmentedProductions = computed(() => {
  if (!stepData.value) return []

  const productions = [`S' -> ${stepData.value.analysisResult.S}`, ...stepData.value.analysisResult.formulas_list]
  return productions
})

onMounted(() => {
  // 从localStorage获取第一步的数据
  const step1Data = localStorage.getItem('lr0-step1-data')
  if (step1Data) {
    stepData.value = JSON.parse(step1Data)
  }
})

const nextStep = () => {
  if (stepData.value) {
    const step2Data = {
      originalGrammar: stepData.value.analysisResult,
      augmentedProductions: augmentedProductions.value,
      newStartSymbol: "S'",
      timestamp: new Date().toISOString()
    }

    localStorage.setItem('lr0-step2-data', JSON.stringify(step2Data))
    emit('next-step')
  }
}
</script>

<style scoped>
.step-header { padding: 2rem 2rem 1rem; border-bottom: 1px solid #e5e7eb; }
.step-icon { width: 3rem; height: 3rem; background: #f3e8ff; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; }
.step-content { padding: 2rem; }
.step-actions { padding: 1rem 2rem 2rem; border-top: 1px solid #e5e7eb; background: #f9fafb; }
</style>
