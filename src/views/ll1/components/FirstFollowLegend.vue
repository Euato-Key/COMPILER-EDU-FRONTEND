<script setup lang="ts">
import { Icon } from '@iconify/vue'
</script>

<template>
  <div class="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-6 mb-6 border border-blue-100 shadow-sm">
    <div class="flex items-center mb-4">
      <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
        <Icon icon="lucide:info" class="w-4 h-4 text-white" />
      </div>
      <h3 class="text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">填写说明</h3>
    </div>

    <!-- 颜色图例 -->
    <div class="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-blue-200/50 mb-4">
      <h4 class="text-sm font-medium text-gray-700 mb-3 flex items-center">
        <Icon icon="lucide:palette" class="w-4 h-4 mr-2 text-blue-500" />
        状态说明
      </h4>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div class="flex items-center gap-2 p-2 rounded-md bg-gray-50 border border-gray-200">
          <div class="w-3 h-3 bg-gray-300 rounded-sm shadow-sm"></div>
          <span class="text-sm font-medium text-gray-700">已知信息</span>
        </div>
        <div class="flex items-center gap-2 p-2 rounded-md bg-amber-50 border border-amber-200">
          <div class="w-3 h-3 bg-gradient-to-r from-amber-300 to-orange-300 rounded-sm shadow-sm"></div>
          <span class="text-sm font-medium text-amber-800">待填写</span>
        </div>
        <div class="flex items-center gap-2 p-2 rounded-md bg-green-50 border border-green-200">
          <div class="w-3 h-3 bg-green-400 rounded-sm shadow-sm"></div>
          <span class="text-sm font-medium text-green-800">校验正确</span>
        </div>
        <div class="flex items-center gap-2 p-2 rounded-md bg-red-50 border border-red-200">
          <div class="w-3 h-3 bg-red-400 rounded-sm shadow-sm"></div>
          <span class="text-sm font-medium text-red-800">校验错误</span>
        </div>
      </div>
    </div>

    <!-- 填写规则 -->
    <div class="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-blue-200/50">
      <h4 class="text-sm font-medium text-gray-700 mb-3 flex items-center">
        <Icon icon="lucide:edit-3" class="w-4 h-4 mr-2 text-blue-500" />
        填写规则
      </h4>
      <div class="space-y-2 text-base text-gray-700">
        <p class="text-gray-800 font-semibold">根据非终结符、终结符和产生式等已知信息，填写First集和Follow集合。</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div class="flex items-center gap-2">
            <Icon icon="lucide:check" class="w-3 h-3 text-green-500 flex-shrink-0" />
            <span>多个符号用空格分隔（如：<span class="font-mono text-blue-600">a b c</span>）</span>
          </div>
          <div class="flex items-center gap-2">
            <Icon icon="lucide:check" class="w-3 h-3 text-green-500 flex-shrink-0" />
            <span>空符号用 <span class="font-mono text-pink-600">ε</span> 表示</span>
          </div>
          <div class="flex items-center gap-2">
            <Icon icon="lucide:check" class="w-3 h-3 text-green-500 flex-shrink-0" />
            <span>注意字符的大小写</span>
          </div>
          <div class="flex items-center gap-2">
            <Icon icon="lucide:check" class="w-3 h-3 text-green-500 flex-shrink-0" />
            <span class="text-blue-600 font-medium">可通过拖拽输入和双击符号卡片复制内容</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
