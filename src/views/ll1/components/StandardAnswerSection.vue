<template>
  <div v-if="result" class="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-xl shadow-lg border border-green-100 p-6 mb-6">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
          <Icon icon="lucide:check-circle" class="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 class="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            标准答案分析表
          </h3>
          <p class="text-sm text-gray-600 mt-1">完整的LL1分析过程</p>
        </div>
      </div>
      <div class="flex items-center gap-2 px-3 py-1.5 bg-green-100 rounded-full">
        <Icon icon="lucide:eye" class="w-3 h-3 text-green-600" />
        <span class="text-xs font-medium text-green-700">查看答案模式</span>
      </div>
    </div>

    <div class="bg-white rounded-lg border border-green-200 p-4 shadow-sm">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <Icon
            :icon="result.info_res === 'Success!' ? 'lucide:check-circle' : 'lucide:x-circle'"
            class="w-6 h-6"
            :class="result.info_res === 'Success!' ? 'text-green-600' : 'text-red-600'"
          />
          <h4
            class="text-lg font-semibold"
            :class="result.info_res === 'Success!' ? 'text-green-700' : 'text-red-700'"
          >
            {{ result.info_res === 'Success!' ? '字符串分析成功！' : '字符串分析失败！' }}
          </h4>
        </div>
        <div class="text-sm text-gray-500">分析结果：{{ result.info_res }}</div>
      </div>

      <!-- 分析过程表格 -->
      <div class="overflow-x-auto">
        <table class="min-w-full border border-gray-300 text-sm">
          <thead class="bg-green-50">
            <tr>
              <th class="border border-gray-300 px-3 py-2 text-center font-medium text-gray-700">步骤</th>
              <th class="border border-gray-300 px-3 py-2 text-center font-medium text-gray-700">栈</th>
              <th class="border border-gray-300 px-3 py-2 text-center font-medium text-gray-700">输入</th>
              <th class="border border-gray-300 px-3 py-2 text-center font-medium text-gray-700">动作</th>
            </tr>
          </thead>
          <tbody class="bg-white">
            <tr v-for="(step, index) in result.info_step" :key="index">
              <td class="border border-gray-300 px-3 py-2 text-center">{{ step }}</td>
              <td class="border border-gray-300 px-3 py-2 font-mono text-center">
                {{ result.info_stack?.[index] || '' }}
              </td>
              <td class="border border-gray-300 px-3 py-2 font-mono text-center">
                {{ result.info_str?.[index] || '' }}
              </td>
              <td class="border border-gray-300 px-3 py-2 text-center">
                {{ result.info_msg?.[index] || '' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

defineProps<{
  result: any
}>()
</script>
