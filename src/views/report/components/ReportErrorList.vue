<template>
  <div class="report-error-list bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
        <Icon icon="lucide:alert-triangle" class="w-5 h-5 text-red-500" />
        {{ title }}
        <span class="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">
          {{ totalCount }} 个错误
        </span>
      </h3>
      <button
        @click="toggleExpand"
        class="text-sm text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
      >
        {{ isExpanded ? '收起' : '展开' }}
        <Icon :icon="isExpanded ? 'lucide:chevron-up' : 'lucide:chevron-down'" class="w-4 h-4" />
      </button>
    </div>

    <div v-if="isExpanded && totalCount > 0" class="space-y-3">
      <div v-for="(errors, section) in errorSections" :key="section" class="space-y-2">
        <div v-if="errors.length > 0">
          <h4 class="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Icon icon="lucide:file-text" class="w-4 h-4 text-gray-400" />
            {{ sectionLabels[section] }}
            <span class="text-xs text-gray-500">({{ errors.length }})</span>
          </h4>
          <div class="space-y-2">
            <div
              v-for="(error, index) in errors"
              :key="index"
              class="p-3 bg-red-50 border border-red-200 rounded-lg"
            >
              <div class="flex items-start justify-between mb-2">
                <div class="flex items-center gap-2">
                  <span class="px-2 py-0.5 bg-red-200 text-red-800 rounded text-xs font-medium">
                    {{ error.location }}
                  </span>
                  <span class="text-xs text-gray-500">{{ formatDate(error.timestamp) }}</span>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div class="text-xs text-gray-500 mb-1">错误答案</div>
                  <div class="px-2 py-1 bg-red-100 text-red-800 rounded font-mono text-xs">
                    {{ error.wrongValue || '(空)' }}
                  </div>
                </div>
                <div>
                  <div class="text-xs text-gray-500 mb-1">正确答案</div>
                  <div class="px-2 py-1 bg-green-100 text-green-800 rounded font-mono text-xs">
                    {{ error.correctValue }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="isExpanded && totalCount === 0" class="text-center py-8 text-gray-500">
      <Icon icon="lucide:check-circle" class="w-12 h-12 mx-auto mb-3 text-green-500" />
      <p class="text-sm">恭喜！没有错误记录</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

interface ErrorItem {
  location: string
  wrongValue: string
  correctValue: string
  timestamp: string
}

interface ErrorSections {
  [key: string]: ErrorItem[]
}

interface Props {
  title: string
  errorSections: ErrorSections
  totalCount: number
  sectionLabels: Record<string, string>
}

const props = defineProps<Props>()

const isExpanded = ref(true)

function toggleExpand() {
  isExpanded.value = !isExpanded.value
}

function formatDate(timestamp: string) {
  if (!timestamp) return '-'
  try {
    let date = new Date(timestamp)
    
    // 如果直接解析失败，尝试解析 "DD/MM/YYYY, HH:mm:ss" 格式
    if (isNaN(date.getTime())) {
      const regex = /^(\d{1,2})\/(\d{1,2})\/(\d{4}),\s*(\d{1,2}):(\d{1,2}):(\d{1,2})$/;
      const match = timestamp.match(regex);
      
      if (match) {
        const [, day, month, year, hours, minutes, seconds] = match;
        date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes), parseInt(seconds));
      } else {
        return timestamp
      }
    }
    
    if (isNaN(date.getTime())) return timestamp

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  } catch (e) {
    return timestamp
  }
}
</script>
