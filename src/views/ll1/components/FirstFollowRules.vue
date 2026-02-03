<script setup lang="ts">
import { Icon } from '@iconify/vue'

defineProps<{
  ruleHighlightState: Record<string, boolean>
}>()
</script>

<template>
  <div class="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-6 mb-6 border border-blue-100 shadow-sm">
    <div class="flex items-center mb-4">
      <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
        <Icon icon="lucide:lightbulb" class="w-4 h-4 text-white" />
      </div>
      <h4 class="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">计算提示</h4>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-base">
      <!-- First集计算规则 -->
      <div class="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-blue-200/50">
        <h5 class="font-semibold text-blue-800 mb-3 flex items-center">
          <Icon icon="lucide:arrow-right" class="w-4 h-4 mr-2 text-blue-600" />
          First集计算规则
        </h5>
        <ul class="space-y-2 text-gray-800 font-medium">
          <li class="flex items-start">
            <span class="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            <span :class="[
              ruleHighlightState['终结符X：First(X) = {X}']
                ? 'bg-gradient-to-r from-blue-100 to-blue-200 px-2 py-1 rounded font-medium'
                : ''
            ]">终结符X：<span class="font-mono text-blue-600">First(X) = {X}</span></span>
          </li>
          <li class="flex items-start">
            <span class="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            <span :class="[
              ruleHighlightState['产生式X→ε：ε ∈ First(X)']
                ? 'bg-gradient-to-r from-blue-100 to-blue-200 px-2 py-1 rounded font-medium'
                : ''
            ]">产生式X→ε：<span class="font-mono text-blue-600">ε ∈ First(X)</span></span>
          </li>
          <li class="flex items-start">
            <span class="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            <span :class="[
              ruleHighlightState['产生式X→Y₁Y₂...Yₖ：First(Y₁)中非ε符号 ∈ First(X)']
                ? 'bg-gradient-to-r from-blue-100 to-blue-200 px-2 py-1 rounded font-medium'
                : ''
            ]">产生式X→Y₁Y₂...Yₖ：<span class="font-mono text-blue-600">First(Y₁)中非ε符号 ∈ First(X)</span></span>
          </li>
          <li class="flex items-start">
            <span class="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            <span :class="[
              ruleHighlightState['若ε ∈ First(Y₁)，则First(Y₂)中非ε符号 ∈ First(X)']
                ? 'bg-gradient-to-r from-blue-100 to-blue-200 px-2 py-1 rounded font-medium'
                : ''
            ]">若ε ∈ First(Y₁)，则<span class="font-mono text-blue-600">First(Y₂)中非ε符号 ∈ First(X)</span></span>
          </li>
        </ul>
      </div>

      <!-- Follow集计算规则 -->
      <div class="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-purple-200/50">
        <h5 class="font-semibold text-purple-800 mb-3 flex items-center">
          <Icon icon="lucide:arrow-left" class="w-4 h-4 mr-2 text-purple-600" />
          Follow集计算规则
        </h5>
        <ul class="space-y-2 text-gray-800 font-medium">
          <li class="flex items-start">
            <span class="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            <span :class="[
              ruleHighlightState['开始符号S：# ∈ Follow(S)']
                ? 'bg-gradient-to-r from-purple-100 to-purple-200 px-2 py-1 rounded font-medium'
                : ''
            ]">开始符号S：<span class="font-mono text-purple-600"># ∈ Follow(S)</span></span>
          </li>
          <li class="flex items-start">
            <span class="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            <span :class="[
              ruleHighlightState['产生式A→αBβ：First(β)中非ε符号 ∈ Follow(B)']
                ? 'bg-gradient-to-r from-purple-100 to-purple-200 px-2 py-1 rounded font-medium'
                : ''
            ]">产生式A→αBβ：<span class="font-mono text-purple-600">First(β)中非ε符号 ∈ Follow(B)</span></span>
          </li>
          <li class="flex items-start">
            <span class="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            <span :class="[
              ruleHighlightState['产生式A→αB或A→αBβ且ε∈First(β)：Follow(A) ⊆ Follow(B)']
                ? 'bg-gradient-to-r from-purple-100 to-purple-200 px-2 py-1 rounded font-medium'
                : ''
            ]">产生式A→αB或A→αBβ且ε∈First(β)：<span class="font-mono text-purple-600">Follow(A) ⊆ Follow(B)</span></span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
