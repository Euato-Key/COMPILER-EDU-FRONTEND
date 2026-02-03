<template>
  <div class="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-xl p-6 mb-6 border border-green-100 shadow-sm">
    <div class="flex items-center mb-4">
      <div class="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center mr-3">
        <Icon icon="lucide:info" class="w-4 h-4 text-white" />
      </div>
      <h3 class="text-lg font-semibold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">构建说明</h3>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div class="flex items-center gap-3 p-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
        <div class="w-4 h-4 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full shadow-sm border-2 border-orange-600"></div>
        <span class="text-sm font-semibold text-orange-700">待填写</span>
      </div>
      <div class="flex items-center gap-3 p-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
        <div class="w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-sm border-2 border-green-600"></div>
        <span class="text-sm font-semibold text-green-700">校验正确</span>
      </div>
      <div class="flex items-center gap-3 p-2 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200">
        <div class="w-4 h-4 bg-gradient-to-r from-red-400 to-pink-500 rounded-full shadow-sm border-2 border-red-600"></div>
        <span class="text-sm font-semibold text-red-700">校验错误</span>
      </div>
    </div>
    <div class="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-green-200/50">
      <div class="text-sm text-gray-700 space-y-2">
        <p>根据 First 集合和 Follow 集合，填写产生式，构造 LL1 分析表</p>
        <div class="flex items-start">
          <span class="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
          <span>对于产生式 A → α，将 <span class="font-mono text-green-600">A->α</span> 填入 <span class="font-mono text-green-600">M[A, a]</span>，其中 <span class="font-mono text-green-600">a ∈ First(A)</span></span>
        </div>
        <div class="flex items-start">
          <span class="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
          <span>如果 <span class="font-mono text-green-600">ε ∈ First(A)</span>，将 <span class="font-mono text-green-600">A->ε</span> 填入 <span class="font-mono text-green-600">M[A, b]</span>，其中 <span class="font-mono text-green-600">b ∈ Follow(A)</span></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
</script>
