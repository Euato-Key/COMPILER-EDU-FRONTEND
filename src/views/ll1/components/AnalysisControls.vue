<template>
  <div class="flex flex-wrap gap-1 mb-4">
    <button
      @click="$emit('match')"
      class="px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105"
    >
      匹配
    </button>
    <button
      @click="$emit('undo')"
      :disabled="undoDisabled"
      class="px-3 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105 disabled:transform-none"
    >
      回退
    </button>
    <button
      @click="$emit('toggle-answer')"
      class="px-3 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105"
    >
      {{ showAnswer ? '隐藏答案' : '查看答案' }}
    </button>
    <button
      @click="$emit('redo')"
      class="px-3 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105"
    >
      重做
    </button>
    <button
      @click="$emit('hint')"
      class="px-3 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105"
    >
      提示
    </button>
    <button
      @click="$emit('validate')"
      class="px-3 py-2 bg-gradient-to-r from-teal-500 to-green-600 text-white rounded-lg hover:from-teal-600 hover:to-green-700 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105"
    >
      检验
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  undoDisabled: boolean
  showAnswer: boolean
}>()

defineEmits<{
  'match': []
  'undo': []
  'toggle-answer': []
  'redo': []
  'hint': []
  'validate': []
}>()
</script>
