<template>
  <div class="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-xl shadow-lg border border-green-100 p-6 mb-6">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
          <Icon icon="lucide:play-circle" class="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 class="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            输入串分析
          </h3>
          <p class="text-sm text-gray-600 mt-1">使用LL1分析表分析输入字符串</p>
        </div>
      </div>
      <div class="flex items-center gap-2 px-3 py-1.5 bg-green-100 rounded-full">
        <Icon icon="lucide:info" class="w-3 h-3 text-green-600" />
        <span class="text-xs font-medium text-green-700">自动添加结束符#</span>
      </div>
    </div>

    <div class="space-y-6">
      <!-- 输入区域 -->
      <div class="bg-white rounded-lg border border-green-200 p-4 shadow-sm">
        <label class="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Icon icon="lucide:keyboard" class="w-4 h-4 text-green-500" />
          字符串输入
          <span class="text-xs font-normal text-gray-500 ml-2">(结束符 # 会自动添加)</span>
        </label>
        <div class="flex gap-4">
          <input
            :value="modelValue"
            @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
            type="text"
            placeholder="例如: ab (不需要输入结束符#)"
            class="flex-1 px-4 py-3 border-2 border-green-200 rounded-lg focus:ring-4 focus:ring-green-100 focus:border-green-400 transition-all duration-200 font-mono text-sm"
            @keyup.enter="$emit('analyze')"
          />
          <button
            @click="$emit('analyze')"
            :disabled="!modelValue.trim() || analyzing"
            class="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
          >
            <Icon v-if="analyzing" icon="lucide:loader-2" class="w-5 h-5 animate-spin" />
            <Icon v-else icon="lucide:play" class="w-5 h-5" />
            {{ analyzing ? '分析中...' : '开始分析' }}
          </button>
          <button
            @click="$emit('reset')"
            class="px-6 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-300 text-gray-700 rounded-xl hover:from-gray-100 hover:to-gray-200 hover:border-gray-400 transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:scale-105 flex items-center gap-2"
          >
            <Icon icon="lucide:rotate-ccw" class="w-5 h-5" />
            重置
          </button>
        </div>
        <div class="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div class="flex items-start gap-2 text-sm text-blue-700">
            <Icon icon="lucide:lightbulb" class="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <p class="font-medium mb-1">💡 分析提示</p>
              <p class="text-sm">• 输入的字符串末尾会自动添加结束符 # 进行LL1分析</p>
              <p class="text-sm">• 系统会根据LL1分析表逐步分析字符串的推导过程</p>
              <p class="text-sm">• 分析结果将显示详细的栈操作和推导步骤</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 示例字符串 -->
      <div class="bg-white rounded-lg border border-green-200 p-4 shadow-sm">
        <div class="flex items-center gap-2 mb-3">
          <Icon icon="lucide:list" class="w-4 h-4 text-green-500" />
          <span class="text-sm font-semibold text-gray-800">示例字符串</span>
          <span class="text-xs text-gray-500">(点击使用)</span>
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="example in exampleStrings"
            :key="example"
            @click="$emit('update:modelValue', example)"
            class="px-4 py-2 text-sm bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 rounded-lg hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 transform hover:scale-105 hover:shadow-md border-2 border-blue-200 hover:border-blue-300 font-mono font-bold shadow-sm"
          >
            {{ example }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

defineProps<{
  modelValue: string
  analyzing: boolean
  exampleStrings: string[]
}>()

defineEmits<{
  'update:modelValue': [value: string]
  'analyze': []
  'reset': []
}>()
</script>
