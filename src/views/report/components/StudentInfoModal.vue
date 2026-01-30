<template>
  <div v-if="visible" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
      <div class="p-6">
        <h3 class="text-xl font-bold text-gray-900 mb-4">填写学生信息</h3>
        <p class="text-sm text-gray-500 mb-6">请填写以下信息，将显示在导出的报告中</p>
        
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">姓名</label>
            <input
              type="text"
              id="name"
              v-model="form.name"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="请输入姓名"
              required
            />
            <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
          </div>
          
          <div>
            <label for="studentId" class="block text-sm font-medium text-gray-700 mb-1">学号</label>
            <input
              type="text"
              id="studentId"
              v-model="form.studentId"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="请输入学号"
              required
            />
            <p v-if="errors.studentId" class="mt-1 text-sm text-red-600">{{ errors.studentId }}</p>
          </div>
          
          <div>
            <label for="className" class="block text-sm font-medium text-gray-700 mb-1">班别</label>
            <input
              type="text"
              id="className"
              v-model="form.className"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="请输入班别"
              required
            />
            <p v-if="errors.className" class="mt-1 text-sm text-red-600">{{ errors.className }}</p>
          </div>
          
          <div class="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="handleCancel"
              class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              确认
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'confirm', data: {
    name: string
    studentId: string
    className: string
  }): void
}>()

const form = reactive({
  name: '',
  studentId: '',
  className: ''
})

const errors = reactive({
  name: '',
  studentId: '',
  className: ''
})

function validateForm() {
  let isValid = true
  
  // 重置错误信息
  errors.name = ''
  errors.studentId = ''
  errors.className = ''
  
  if (!form.name.trim()) {
    errors.name = '请输入姓名'
    isValid = false
  }
  
  if (!form.studentId.trim()) {
    errors.studentId = '请输入学号'
    isValid = false
  }
  
  if (!form.className.trim()) {
    errors.className = '请输入班别'
    isValid = false
  }
  
  return isValid
}

function handleSubmit() {
  if (validateForm()) {
    emit('confirm', {
      name: form.name.trim(),
      studentId: form.studentId.trim(),
      className: form.className.trim()
    })
  }
}

function handleCancel() {
  emit('close')
}

// 当组件关闭时重置表单
watch(
  () => props.visible,
  (newVal) => {
    if (!newVal) {
      form.name = ''
      form.studentId = ''
      form.className = ''
      errors.name = ''
      errors.studentId = ''
      errors.className = ''
    }
  }
)
</script>

<style scoped>
/* 样式已通过 Tailwind CSS 实现 */
</style>