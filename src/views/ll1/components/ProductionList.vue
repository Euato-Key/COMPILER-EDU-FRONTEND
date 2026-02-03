<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900 flex items-center">
        <Icon icon="lucide:list" class="w-5 h-5 mr-2 text-blue-500" />
        产生式
      </h3>
      <div class="text-xs text-gray-500 flex items-center gap-2">
        <span class="flex items-center gap-1">
          <Icon icon="lucide:grip-vertical" class="w-3 h-3 text-blue-400" />
          <span>拖拽到表格</span>
        </span>
        <span class="flex items-center gap-1">
          <Icon icon="lucide:copy" class="w-3 h-3 text-blue-400" />
          <span>双击复制</span>
        </span>
      </div>
    </div>
    <div class="space-y-2">
      <div
        v-for="(productions, nonTerminal) in formulasDict"
        :key="nonTerminal"
        class="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-lg border border-blue-200/50 p-3 shadow-sm"
      >
        <div class="flex items-center">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3 shadow-sm flex-shrink-0">
            <span class="font-mono font-bold text-white text-base">{{ nonTerminal }}</span>
          </div>
          <div class="flex-1 space-y-1.5">
            <div
              v-for="(production, index) in productions"
              :key="index"
              class="flex items-center"
            >
              <div
                class="flex-1 bg-white/80 backdrop-blur-sm rounded-md border border-blue-200/60 px-2 py-1.5 hover:border-blue-300 hover:bg-blue-50/80 hover:shadow-md transition-all duration-150 cursor-move select-none group shadow-sm"
                :class="{ 'ring-2 ring-orange-400 ring-opacity-50': productionHighlightState[`${nonTerminal}->${production}`] }"
                draggable="true"
                :data-production="`${nonTerminal}->${production}`"
                @dragstart="onDragStart(`${nonTerminal}->${production}`, $event)"
                @dblclick="onDblClick(`${nonTerminal}->${production}`)"
              >
                <div class="flex items-center justify-between">
                  <span class="font-mono text-xs text-gray-700">
                    <span class="text-blue-700 font-semibold">{{ nonTerminal }}</span>
                    <span class="text-blue-400 mx-1">→</span>
                    <span class="text-gray-700">{{ production }}</span>
                  </span>
                  <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Icon icon="lucide:grip-vertical" class="w-2.5 h-2.5 text-blue-400" title="拖拽" />
                    <Icon icon="lucide:copy" class="w-2.5 h-2.5 text-blue-400" title="双击复制" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

defineProps<{
  formulasDict: Record<string, string[]>
  productionHighlightState: Record<string, boolean>
}>()

const emit = defineEmits<{
  'drag-start': [production: string, event: DragEvent]
  'dbl-click': [production: string]
}>()

const onDragStart = (production: string, event: DragEvent) => {
  emit('drag-start', production, event)
}

const onDblClick = (production: string) => {
  emit('dbl-click', production)
}
</script>

<style scoped>
@keyframes highlight-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.ring-orange-400 {
  animation: highlight-pulse 1s ease-in-out infinite;
}
</style>
