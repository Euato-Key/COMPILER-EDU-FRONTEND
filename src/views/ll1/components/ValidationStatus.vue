<template>
  <div v-if="status !== 'none'" class="rounded-xl p-6 border-2 shadow-lg">
    <!-- 准备验证状态 -->
    <div v-if="status === 'ready'" class="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <div class="flex gap-4">
        <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <Icon icon="lucide:info" class="w-6 h-6 text-white" />
        </div>
        <div class="flex-1">
          <p class="text-lg font-semibold text-blue-800 mb-2">{{ message }}</p>
          <p class="text-blue-600">点击"验证文法"按钮进行深度校验</p>
        </div>
      </div>
    </div>

    <!-- 验证成功状态 -->
    <div v-else-if="status === 'success'" class="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
      <div class="flex gap-4">
        <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <Icon icon="lucide:check-circle" class="w-6 h-6 text-white" />
        </div>
        <div class="flex-1">
          <p class="text-lg font-semibold text-green-800 mb-2">{{ message }}</p>
          <p class="text-green-600 mb-4">可以进入下一步</p>
          <div class="bg-white/60 rounded-lg p-4 border border-green-200">
            <p class="text-sm font-semibold text-green-700 mb-3">文法信息：</p>
            <div class="grid grid-cols-2 gap-3 text-sm">
              <div class="flex items-center gap-2">
                <Icon icon="lucide:play" class="w-4 h-4 text-blue-500" />
                <span class="text-gray-700">开始符号：</span>
                <span class="font-mono font-semibold text-blue-600">{{ originalData?.S || '未确定' }}</span>
              </div>
              <div class="flex items-center gap-2">
                <Icon icon="lucide:tag" class="w-4 h-4 text-purple-500" />
                <span class="text-gray-700">非终结符：</span>
                <span class="font-mono font-semibold text-purple-600">{{ originalData?.Vn?.join(', ') || '未确定' }}</span>
              </div>
              <div class="flex items-center gap-2">
                <Icon icon="lucide:hash" class="w-4 h-4 text-green-500" />
                <span class="text-gray-700">终结符：</span>
                <span class="font-mono font-semibold text-green-600">{{ originalData?.Vt?.join(', ') || '未确定' }}</span>
              </div>
              <div class="flex items-center gap-2">
                <Icon icon="lucide:list" class="w-4 h-4 text-orange-500" />
                <span class="text-gray-700">产生式数量：</span>
                <span class="font-mono font-semibold text-orange-600">{{ productionCount }} 个</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 验证失败状态 -->
    <div v-else-if="status === 'failed'" class="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
      <div class="flex gap-4">
        <div class="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <Icon icon="lucide:x-circle" class="w-6 h-6 text-white" />
        </div>
        <div class="flex-1">
          <p class="text-lg font-semibold text-red-800 mb-2">{{ message }}</p>
          <div v-if="submitErrors.length > 0" class="bg-white/60 rounded-lg p-4 border border-red-200">
            <p class="text-sm font-semibold text-red-700 mb-3">具体错误：</p>
            <ul class="space-y-2">
              <li v-for="error in submitErrors" :key="error" class="flex items-start gap-2 text-sm">
                <Icon icon="lucide:alert-circle" class="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span class="text-red-600">{{ error }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { LL1AnalysisResult } from '@/types'

defineProps<{
  status: 'none' | 'ready' | 'success' | 'failed'
  message: string
  originalData?: LL1AnalysisResult | null
  productionCount: number
  submitErrors: string[]
}>()
</script>
