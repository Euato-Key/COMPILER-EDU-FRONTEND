<template>
  <div class="chinese-date-picker" v-click-outside="closeCalendar">
    <!-- 输入框显示 -->
    <div class="date-input-wrapper" @click="toggleCalendar">
      <input
        type="text"
        readonly
        :value="displayValue"
        :placeholder="placeholder"
        class="date-input"
      />
      <Icon icon="lucide:calendar-days" class="date-icon" />
    </div>

    <!-- 日历弹窗 -->
    <div v-if="isOpen" class="calendar-popup">
      <!-- 头部：年月选择 -->
      <div class="calendar-header">
        <button class="nav-btn" @click="prevMonth">
          <Icon icon="lucide:chevron-left" class="w-4 h-4" />
        </button>
        <div class="month-year-selector">
          <select v-model="selectedYear" class="year-select" @change="updateCalendar">
            <option v-for="year in yearOptions" :key="year" :value="year">{{ year }}年</option>
          </select>
          <select v-model="selectedMonth" class="month-select" @change="updateCalendar">
            <option v-for="(month, index) in monthNames" :key="index" :value="index">{{ month }}</option>
          </select>
        </div>
        <button class="nav-btn" @click="nextMonth">
          <Icon icon="lucide:chevron-right" class="w-4 h-4" />
        </button>
      </div>

      <!-- 星期标题 -->
      <div class="weekdays">
        <div v-for="day in weekDays" :key="day" class="weekday">{{ day }}</div>
      </div>

      <!-- 日期网格 -->
      <div class="days-grid">
        <div
          v-for="(day, index) in calendarDays"
          :key="index"
          class="day-cell"
          :class="{
            'other-month': !day.isCurrentMonth,
            'selected': isSelected(day.date),
            'today': isToday(day.date),
            'disabled': isDisabled(day.date)
          }"
          @click="selectDate(day)"
        >
          {{ day.dayOfMonth }}
        </div>
      </div>

      <!-- 底部按钮 -->
      <div class="calendar-footer">
        <button class="footer-btn today-btn" @click="selectToday">今天</button>
        <button class="footer-btn clear-btn" @click="clearDate">清除</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Icon } from '@iconify/vue'

interface Props {
  modelValue: string
  placeholder?: string
  min?: string
  max?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '请选择日期'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

// 中文月份名称
const monthNames = [
  '1月', '2月', '3月', '4月', '5月', '6月',
  '7月', '8月', '9月', '10月', '11月', '12月'
]

// 中文星期名称
const weekDays = ['日', '一', '二', '三', '四', '五', '六']

// 状态
const isOpen = ref(false)
const selectedYear = ref(new Date().getFullYear())
const selectedMonth = ref(new Date().getMonth())

// 计算显示值
const displayValue = computed(() => {
  if (!props.modelValue) return ''
  const date = new Date(props.modelValue)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
})

// 年份选项（前后10年）
const yearOptions = computed((): number[] => {
  const currentYear = new Date().getFullYear()
  const years: number[] = []
  for (let i = currentYear - 10; i <= currentYear + 1; i++) {
    years.push(i)
  }
  return years
})

// 计算日历天数
interface CalendarDay {
  date: Date
  dayOfMonth: number
  isCurrentMonth: boolean
}

const calendarDays = computed((): CalendarDay[] => {
  const days: CalendarDay[] = []
  const year = selectedYear.value
  const month = selectedMonth.value

  // 当月第一天
  const firstDay = new Date(year, month, 1)
  // 当月最后一天
  const lastDay = new Date(year, month + 1, 0)

  // 需要显示的上月天数
  const firstDayOfWeek = firstDay.getDay()
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month, -i)
    days.push({
      date,
      dayOfMonth: date.getDate(),
      isCurrentMonth: false
    })
  }

  // 当月天数
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(year, month, i)
    days.push({
      date,
      dayOfMonth: i,
      isCurrentMonth: true
    })
  }

  // 需要显示的下月天数（补齐6行）
  const remainingDays = 42 - days.length
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(year, month + 1, i)
    days.push({
      date,
      dayOfMonth: i,
      isCurrentMonth: false
    })
  }

  return days
})

// 打开/关闭日历
const toggleCalendar = () => {
  if (!isOpen.value && props.modelValue) {
    const date = new Date(props.modelValue)
    selectedYear.value = date.getFullYear()
    selectedMonth.value = date.getMonth()
  }
  isOpen.value = !isOpen.value
}

const closeCalendar = () => {
  isOpen.value = false
}

// 切换月份
const prevMonth = () => {
  if (selectedMonth.value === 0) {
    selectedMonth.value = 11
    selectedYear.value--
  } else {
    selectedMonth.value--
  }
}

const nextMonth = () => {
  if (selectedMonth.value === 11) {
    selectedMonth.value = 0
    selectedYear.value++
  } else {
    selectedMonth.value++
  }
}

// 更新日历
const updateCalendar = () => {
  // 年月改变时自动更新
}

// 判断是否为选中日期
const isSelected = (date: Date) => {
  if (!props.modelValue) return false
  const selected = new Date(props.modelValue)
  return date.toDateString() === selected.toDateString()
}

// 判断是否为今天
const isToday = (date: Date) => {
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

// 判断是否禁用
const isDisabled = (date: Date) => {
  const dateStr = date.toISOString().split('T')[0]
  if (props.min && dateStr < props.min) return true
  if (props.max && dateStr > props.max) return true
  return false
}

// 选择日期
const selectDate = (day: CalendarDay) => {
  if (isDisabled(day.date)) return
  const dateStr = day.date.toISOString().split('T')[0]
  emit('update:modelValue', dateStr)
  isOpen.value = false
}

// 选择今天
const selectToday = () => {
  const today = new Date()
  const dateStr = today.toISOString().split('T')[0]
  emit('update:modelValue', dateStr)
  selectedYear.value = today.getFullYear()
  selectedMonth.value = today.getMonth()
  isOpen.value = false
}

// 清除日期
const clearDate = () => {
  emit('update:modelValue', '')
  isOpen.value = false
}

// 点击外部关闭指令
interface ClickOutsideElement extends HTMLElement {
  _clickOutside?: (event: Event) => void
}

const vClickOutside = {
  mounted(el: ClickOutsideElement, binding: any) {
    el._clickOutside = (event: Event) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value()
      }
    }
    document.addEventListener('click', el._clickOutside)
  },
  unmounted(el: ClickOutsideElement) {
    if (el._clickOutside) {
      document.removeEventListener('click', el._clickOutside)
    }
  }
}
</script>

<style scoped>
.chinese-date-picker {
  position: relative;
}

.date-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.date-input {
  padding: 8px 32px 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  color: #374151;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 140px;
}

.date-input:hover {
  border-color: #3b82f6;
}

.date-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.date-icon {
  position: absolute;
  right: 10px;
  width: 16px;
  height: 16px;
  color: #9ca3af;
  pointer-events: none;
}

/* 日历弹窗 */
.calendar-popup {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 8px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  padding: 16px;
  z-index: 1000;
  min-width: 280px;
}

/* 头部 */
.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.nav-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #f3f4f6;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.nav-btn:hover {
  background: #e5e7eb;
}

.month-year-selector {
  display: flex;
  gap: 8px;
}

.year-select,
.month-select {
  padding: 6px 8px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  cursor: pointer;
}

.year-select:hover,
.month-select:hover {
  border-color: #3b82f6;
}

/* 星期标题 */
.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 8px;
}

.weekday {
  text-align: center;
  font-size: 12px;
  color: #9ca3af;
  padding: 8px 0;
  font-weight: 500;
}

/* 日期网格 */
.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.day-cell {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #374151;
}

.day-cell:hover:not(.disabled) {
  background: #eff6ff;
  color: #3b82f6;
}

.day-cell.other-month {
  color: #d1d5db;
}

.day-cell.selected {
  background: #3b82f6;
  color: white;
  font-weight: 600;
}

.day-cell.today {
  border: 2px solid #3b82f6;
}

.day-cell.disabled {
  color: #d1d5db;
  cursor: not-allowed;
  background: #f9fafb;
}

/* 底部按钮 */
.calendar-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #f3f4f6;
}

.footer-btn {
  padding: 6px 16px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.today-btn {
  background: #eff6ff;
  color: #3b82f6;
}

.today-btn:hover {
  background: #dbeafe;
}

.clear-btn {
  background: #f3f4f6;
  color: #6b7280;
}

.clear-btn:hover {
  background: #e5e7eb;
}
</style>
