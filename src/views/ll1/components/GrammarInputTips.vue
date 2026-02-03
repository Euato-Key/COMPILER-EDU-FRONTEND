<template>
  <div class="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-lg border border-amber-200 p-4 shadow-sm">
    <div class="flex items-center gap-2 mb-3">
      <div class="w-6 h-6 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
        <Icon icon="lucide:book-open" class="w-3 h-3 text-white" />
      </div>
      <h4 class="text-base font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
        重要规范
      </h4>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <!-- 左侧规范 -->
      <div class="space-y-2">
        <div class="flex items-start gap-2 p-2 bg-white/60 rounded-md border border-amber-200/50">
          <div class="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <Icon icon="lucide:play" class="w-2.5 h-2.5 text-blue-600" />
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-900 mb-0.5">开始符</p>
            <p class="text-sm text-gray-700 leading-tight font-medium">第一个产生式的左侧大写字母为开始符</p>
          </div>
        </div>

        <div class="flex items-start gap-2 p-2 bg-white/60 rounded-md border border-amber-200/50">
          <div class="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <Icon icon="lucide:type" class="w-2.5 h-2.5 text-purple-600" />
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-900 mb-0.5">字符规定</p>
            <p class="text-sm text-gray-700 leading-tight font-medium">每个符号必须是单个字符（如A、B、C，而非E1、id等）</p>
          </div>
        </div>

        <div class="flex items-start gap-2 p-2 bg-white/60 rounded-md border border-amber-200/50">
          <div class="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <Icon icon="lucide:arrow-right" class="w-2.5 h-2.5 text-green-600" />
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-900 mb-0.5">产生式格式</p>
            <p class="text-sm text-gray-700 leading-tight font-medium">必须为"大写字母->右部"格式（如：S->AB）</p>
          </div>
        </div>
      </div>

      <!-- 右侧规范 -->
      <div class="space-y-2">
        <div class="flex items-start gap-2 p-2 bg-white/60 rounded-md border border-amber-200/50">
          <div class="w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <Icon icon="lucide:list" class="w-2.5 h-2.5 text-indigo-600" />
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-900 mb-0.5">右部格式</p>
            <p class="text-sm text-gray-700 leading-tight font-medium">可以是单个符号或由"|"分隔的多个候选式（如：A->a|ε）</p>
          </div>
        </div>

        <div class="flex items-start gap-2 p-2 bg-white/60 rounded-md border border-amber-200/50">
          <div class="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <Icon icon="lucide:ban" class="w-2.5 h-2.5 text-red-600" />
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-900 mb-0.5">限制条件</p>
            <p class="text-sm text-gray-700 leading-tight font-medium">不能有左递归，每个非终结符必须有产生式定义</p>
          </div>
        </div>

        <div class="flex items-start gap-2 p-2 bg-white/60 rounded-md border border-amber-200/50">
          <div class="w-5 h-5 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <Icon icon="lucide:circle" class="w-2.5 h-2.5 text-pink-600" />
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-900 mb-0.5">ε符号</p>
            <p class="text-sm text-gray-700 leading-tight font-medium">ε只能单独作为一个候选式，如G->+TG|ε是正确的</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
</script>
