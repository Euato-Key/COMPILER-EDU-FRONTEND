<template>
  <div class="modules-stats mb-10">
    <div class="section-header flex items-center gap-3 mb-6">
      <div class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
        <Icon icon="lucide:bar-chart-2" class="w-5 h-5 text-white" />
      </div>
      <div>
        <h2 class="text-2xl font-bold text-gray-900">各模块错误统计</h2>
        <p class="text-sm text-gray-500">按模块查看详细错误分布情况</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
      <!-- FA 模块 -->
      <ModuleStatCard
        v-if="moduleStats.fa"
        class="h-full"
        module-name="FA"
        module-icon="lucide:git-branch"
        module-color="blue"
        :stats="moduleStats.fa"
      />

      <!-- LL1 模块 -->
      <ModuleStatCard
        v-if="moduleStats.ll1"
        class="h-full"
        module-name="LL1"
        module-icon="lucide:layers"
        module-color="green"
        :stats="moduleStats.ll1"
      />

      <!-- LR0 模块 -->
      <ModuleStatCard
        v-if="moduleStats.lr0"
        class="h-full"
        module-name="LR0"
        module-icon="lucide:workflow"
        module-color="purple"
        :stats="moduleStats.lr0"
      />

      <!-- SLR1 模块 -->
      <ModuleStatCard
        v-if="moduleStats.slr1"
        class="h-full"
        module-name="SLR1"
        module-icon="lucide:git-merge"
        module-color="orange"
        :stats="moduleStats.slr1"
      />
    </div>

    <!-- 空状态 -->
    <div v-if="!hasAnyStats" class="text-center py-12 text-gray-500">
      <Icon icon="lucide:inbox" class="w-12 h-12 mx-auto mb-3 opacity-50" />
      <p>暂无模块统计数据</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import ModuleStatCard from './ModuleStatCard.vue'
import type { ModuleStats } from '../utils/types'

const props = defineProps<{
  moduleStats: ModuleStats
}>()

const hasAnyStats = computed(() => {
  return props.moduleStats.fa !== null ||
         props.moduleStats.ll1 !== null ||
         props.moduleStats.lr0 !== null ||
         props.moduleStats.slr1 !== null
})
</script>

<style scoped>
.modules-stats {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
