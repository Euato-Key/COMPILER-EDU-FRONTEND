<template>
  <div class="time-range-selector bg-white rounded-xl shadow-lg p-6 mb-8">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <Icon icon="lucide:calendar" class="w-5 h-5 text-blue-500" />
        时间范围选择
      </h3>
      <!-- 中文日期选择器 -->
      <div class="date-inputs flex items-center gap-2">
        <ChineseDatePicker
          v-model="startDateValue"
          placeholder="开始日期"
          :max="endDate"
          @update:model-value="handleStartDateChange"
        />
        <span class="date-separator">至</span>
        <ChineseDatePicker
          v-model="endDateValue"
          placeholder="结束日期"
          :min="startDate"
          :max="formatDateForInput(maxDate)"
          @update:model-value="handleEndDateChange"
        />
      </div>
    </div>
    <div class="text-sm text-gray-500 mb-4 text-center">
      当前选择：{{ formatDateDisplay(startDate) }} ~ {{ formatDateDisplay(endDate) }}
    </div>

    <!-- 时间轴 -->
    <div class="timeline-container" ref="timelineRef">
      <!-- 时间轴背景 -->
      <div class="timeline-track">
        <!-- 已选择范围高亮 -->
        <div
          class="timeline-range"
          :style="rangeStyle"
        ></div>

        <!-- 起点滑块 -->
        <div
          class="timeline-handle start"
          :style="startHandleStyle"
          @mousedown="handleStartDrag"
          @touchstart="handleStartDrag"
        >
          <div class="handle-indicator">
            <Icon icon="lucide:chevron-left" class="w-4 h-4" />
          </div>
          <div class="handle-label">{{ formatDateDisplay(startDate) }}</div>
        </div>

        <!-- 终点滑块 -->
        <div
          class="timeline-handle end"
          :style="endHandleStyle"
          @mousedown="handleEndDrag"
          @touchstart="handleEndDrag"
        >
          <div class="handle-indicator">
            <Icon icon="lucide:chevron-right" class="w-4 h-4" />
          </div>
          <div class="handle-label">{{ formatDateDisplay(endDate) }}</div>
        </div>
      </div>

      <!-- 时间刻度 -->
      <div class="timeline-ticks">
        <div
          v-for="tick in timeTicks"
          :key="tick.date"
          class="tick"
          :style="{ left: tick.position + '%' }"
        >
          <div class="tick-line"></div>
          <div class="tick-label">{{ tick.label }}</div>
        </div>
      </div>
    </div>

    <!-- 快捷选项 -->
    <div class="quick-options mt-4 flex gap-2">
      <button
        v-for="option in quickOptions"
        :key="option.days"
        class="quick-option-btn"
        :class="{ active: isActiveOption(option.days) }"
        @click="selectQuickOption(option.days)"
      >
        {{ option.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { Icon } from '@iconify/vue'
import ChineseDatePicker from './ChineseDatePicker.vue'

interface Props {
  startDate: string
  endDate: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:startDate': [value: string]
  'update:endDate': [value: string]
  'change': []
}>()

// 时间轴容器引用
const timelineRef = ref<HTMLElement | null>(null)

// 拖拽状态
const isDragging = ref<'start' | 'end' | null>(null)

// 日期选择器的值（用于双向绑定）
const startDateValue = ref(props.startDate)
const endDateValue = ref(props.endDate)

// 监听 props 变化更新本地值
watch(() => props.startDate, (newVal) => {
  startDateValue.value = newVal
})
watch(() => props.endDate, (newVal) => {
  endDateValue.value = newVal
})

// 时间范围（最近3年）
const minDate = ref(new Date())
const maxDate = ref(new Date())

// 初始化时间范围
onMounted(() => {
  const now = new Date()
  maxDate.value = now
  const start = new Date()
  start.setFullYear(start.getFullYear() - 3)  // 3年前
  minDate.value = start

  // 添加全局事件监听
  document.addEventListener('mousemove', handleDragMove)
  document.addEventListener('mouseup', handleDragEnd)
  document.addEventListener('touchmove', handleDragMove)
  document.addEventListener('touchend', handleDragEnd)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleDragMove)
  document.removeEventListener('mouseup', handleDragEnd)
  document.removeEventListener('touchmove', handleDragMove)
  document.removeEventListener('touchend', handleDragEnd)
})

// 时间刻度类型
interface TimeTick {
  date: string
  position: number
  label: string
}

// 计算时间刻度
const timeTicks = computed((): TimeTick[] => {
  const ticks: TimeTick[] = []
  const totalDays = (maxDate.value.getTime() - minDate.value.getTime()) / (1000 * 60 * 60 * 24)

  // 根据时间跨度决定刻度数量和格式
  const tickCount = totalDays > 365 ? 6 : 6  // 3年显示6个刻度

  for (let i = 0; i <= tickCount; i++) {
    const position = (i / tickCount) * 100
    const date = new Date(minDate.value)
    date.setDate(date.getDate() + Math.round((totalDays * i) / tickCount))

    ticks.push({
      date: date.toISOString().split('T')[0],
      position,
      label: totalDays > 365 ? formatYearMonth(date) : formatShortDate(date)
    })
  }

  return ticks
})

// 计算起点位置百分比
const startPosition = computed(() => {
  if (!props.startDate) return 0
  const start = new Date(props.startDate)
  const total = maxDate.value.getTime() - minDate.value.getTime()
  const current = start.getTime() - minDate.value.getTime()
  return Math.max(0, Math.min(100, (current / total) * 100))
})

// 计算终点位置百分比
const endPosition = computed(() => {
  if (!props.endDate) return 100
  const end = new Date(props.endDate)
  const total = maxDate.value.getTime() - minDate.value.getTime()
  const current = end.getTime() - minDate.value.getTime()
  return Math.max(0, Math.min(100, (current / total) * 100))
})

// 范围样式
const rangeStyle = computed(() => ({
  left: startPosition.value + '%',
  width: (endPosition.value - startPosition.value) + '%'
}))

// 起点滑块样式
const startHandleStyle = computed(() => ({
  left: startPosition.value + '%'
}))

// 终点滑块样式
const endHandleStyle = computed(() => ({
  left: endPosition.value + '%'
}))

// 快捷选项
const quickOptions = [
  { label: '最近7天', days: 7 },
  { label: '最近30天', days: 30 },
  { label: '最近90天', days: 90 },
  { label: '最近半年', days: 180 },
  { label: '最近1年', days: 365 },
  { label: '最近2年', days: 730 },
  { label: '全部', days: 1095 }  // 3年
]

// 检查是否选中快捷选项
const isActiveOption = (days: number) => {
  if (!props.startDate || !props.endDate) return false
  const start = new Date(props.startDate)
  const end = new Date(props.endDate)
  const diffDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  return Math.abs(diffDays - days) < 2
}

// 选择快捷选项
const selectQuickOption = (days: number) => {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - days)

  emit('update:endDate', end.toISOString().split('T')[0])
  emit('update:startDate', start.toISOString().split('T')[0])
  emit('change')
}

// 处理起点日期输入变化
const handleStartDateChange = (newDate: string) => {
  if (newDate && newDate <= props.endDate) {
    emit('update:startDate', newDate)
    emit('change')
  }
}

// 处理终点日期输入变化
const handleEndDateChange = (newDate: string) => {
  if (newDate && newDate >= props.startDate) {
    emit('update:endDate', newDate)
    emit('change')
  }
}

// 格式化日期用于input的max/min属性
const formatDateForInput = (date: Date) => {
  return date.toISOString().split('T')[0]
}

// 起点拖拽开始
const handleStartDrag = (e: MouseEvent | TouchEvent) => {
  e.preventDefault()
  isDragging.value = 'start'
}

// 终点拖拽开始
const handleEndDrag = (e: MouseEvent | TouchEvent) => {
  e.preventDefault()
  isDragging.value = 'end'
}

// 拖拽移动
const handleDragMove = (e: MouseEvent | TouchEvent) => {
  if (!isDragging.value || !timelineRef.value) return

  const rect = timelineRef.value.getBoundingClientRect()
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  const percentage = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))

  const totalTime = maxDate.value.getTime() - minDate.value.getTime()
  const newTime = minDate.value.getTime() + (totalTime * percentage) / 100
  const newDate = new Date(newTime)
  const dateStr = newDate.toISOString().split('T')[0]

  if (isDragging.value === 'start') {
    // 确保起点不超过终点
    const end = new Date(props.endDate)
    if (newDate < end) {
      emit('update:startDate', dateStr)
    }
  } else {
    // 确保终点不早于起点
    const start = new Date(props.startDate)
    if (newDate > start) {
      emit('update:endDate', dateStr)
    }
  }
}

// 拖拽结束
const handleDragEnd = () => {
  if (isDragging.value) {
    isDragging.value = null
    emit('change')
  }
}

// 格式化日期显示 (YYYY-MM-DD)
const formatDateDisplay = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// 格式化短日期 (MM-DD)
const formatShortDate = (date: Date) => {
  return `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// 格式化为年月 (YYYY-MM)
const formatYearMonth = (date: Date) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}
</script>

<style scoped>
.timeline-container {
  position: relative;
  padding: 20px 0 40px;
  user-select: none;
}

.timeline-track {
  position: relative;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  cursor: pointer;
}

.timeline-range {
  position: absolute;
  top: 0;
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 4px;
  transition: all 0.1s ease;
}

.timeline-handle {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  cursor: grab;
  z-index: 10;
}

.timeline-handle:active {
  cursor: grabbing;
}

.handle-indicator {
  width: 24px;
  height: 24px;
  background: white;
  border: 3px solid #3b82f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.timeline-handle:hover .handle-indicator {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.handle-label {
  position: absolute;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  color: #6b7280;
  white-space: nowrap;
  background: white;
  padding: 2px 8px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* 日期输入框样式 */
.date-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-separator {
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
}

.timeline-ticks {
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  height: 20px;
  pointer-events: none;
}

.tick {
  position: absolute;
  transform: translateX(-50%);
}

.tick-line {
  width: 1px;
  height: 12px;
  background: #d1d5db;
  margin: 0 auto 4px;
}

.tick-label {
  font-size: 11px;
  color: #9ca3af;
  text-align: center;
}

.quick-options {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.quick-option-btn {
  padding: 6px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  background: white;
  color: #6b7280;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.quick-option-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.quick-option-btn.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}
</style>
