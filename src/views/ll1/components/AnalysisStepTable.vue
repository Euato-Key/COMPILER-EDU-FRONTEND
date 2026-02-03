<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div class="mb-4">
      <div class="bg-yellow-50 border border-yellow-300 rounded-lg px-4 py-3 flex items-start gap-2 text-yellow-800 text-sm">
        <Icon icon="lucide:info" class="w-5 h-5 flex-shrink-0 mt-0.5 text-yellow-500" />
        <div>
          <div class="font-bold mb-1">操作指引：</div>
          <ul class="list-disc list-inside space-y-1">
            <li>若栈顶为非终结符，双击左侧 LL1 分析表对应单元格进行推导。</li>
            <li>若栈顶与输入串首字符相同，点击 <span class="font-bold text-green-700">匹配</span> 按钮。</li>
            <li>如操作失误可点击 <span class="font-bold text-gray-700">回退</span>，重新开始可点 <span class="font-bold text-gray-700">重做</span>。</li>
            <li>遇到不会做时可点击 <span class="font-bold text-yellow-700">提示</span>，系统会高亮推荐操作。</li>
            <li>点击 <span class="font-bold text-blue-700">查看答案</span> 可显示完整标准分析过程。</li>
          </ul>
        </div>
      </div>
    </div>

    <slot name="controls"></slot>

    <h3 class="text-lg font-semibold text-gray-900 mb-4">输入串分析表（答题区）</h3>

    <div class="overflow-x-auto">
      <table class="min-w-full border border-gray-300 text-sm user-steps-table">
        <thead class="bg-gray-50">
          <tr>
            <th class="border border-gray-300 px-3 py-2 text-center font-medium text-gray-700">步骤</th>
            <th class="border border-gray-300 px-3 py-2 text-center font-medium text-gray-700">分析栈</th>
            <th class="border border-gray-300 px-3 py-2 text-center font-medium text-gray-700">输入串</th>
          </tr>
        </thead>
        <tbody class="bg-white">
          <tr v-for="(step, idx) in steps" :key="idx">
            <td class="border border-gray-300 px-3 py-2 text-center">{{ idx + 1 }}</td>
            <td class="border border-gray-300 px-3 py-2 font-mono text-center">
              <template v-if="idx === steps.length - 1 && hintActive && (hintType === 'match' || hintType === 'll1')">
                <span
                  v-for="(ch, i) in step.stack || ''"
                  :key="i"
                  :class="i === (step.stack.length || 1) - 1 ? 'bg-yellow-200 text-yellow-800 px-1 rounded' : ''"
                >
                  {{ ch }}
                </span>
              </template>
              <template v-else>
                {{ step.stack }}
              </template>
            </td>
            <td class="border border-gray-300 px-3 py-2 font-mono text-center">
              <template v-if="idx === steps.length - 1 && hintActive && (hintType === 'match' || hintType === 'll1')">
                <span
                  v-for="(ch, i) in step.input || ''"
                  :key="i"
                  :class="i === 0 ? 'bg-yellow-200 text-yellow-800 px-1 rounded' : ''"
                >
                  {{ ch }}
                </span>
              </template>
              <template v-else>
                {{ step.input }}
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

defineProps<{
  steps: { stack: string; input: string }[]
  hintActive: boolean
  hintType: 'll1' | 'match' | ''
}>()
</script>
