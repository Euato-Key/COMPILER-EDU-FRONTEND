<template>
  <div class="bg-white rounded-2xl shadow-lg p-6">
    <div class="flex items-center gap-3 mb-4">
      <div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
        <Icon icon="lucide:settings-2" class="w-5 h-5 text-purple-600" />
      </div>
      <h2 class="text-lg font-semibold text-slate-800">模型选择策略</h2>
    </div>
    <div class="space-y-4">
      <p class="text-sm text-slate-500">选择 AI 模型的使用策略，系统将自动根据策略选择合适的模型</p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- 强制使用 DeepSeek -->
        <label
          class="relative flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-all"
          :class="modelValue === 'deepseek' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-300'"
        >
          <input
            :checked="modelValue === 'deepseek'"
            type="radio"
            value="deepseek"
            class="sr-only"
            @change="handleChange('deepseek')"
          />
          <div class="flex items-center gap-2 mb-2">
            <Icon icon="lucide:brain" class="w-5 h-5" :class="modelValue === 'deepseek' ? 'text-blue-600' : 'text-slate-400'" />
            <span class="font-medium" :class="modelValue === 'deepseek' ? 'text-blue-900' : 'text-slate-700'">强制 DeepSeek</span>
          </div>
          <p class="text-xs text-slate-500">始终使用 DeepSeek 模型，余额不足时可能失败</p>
          <div v-if="modelValue === 'deepseek'" class="absolute top-2 right-2">
            <Icon icon="lucide:check-circle" class="w-5 h-5 text-blue-500" />
          </div>
        </label>

        <!-- 强制使用 Hunyuan -->
        <label
          class="relative flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-all"
          :class="modelValue === 'hunyuan' ? 'border-green-500 bg-green-50' : 'border-slate-200 hover:border-green-300'"
        >
          <input
            :checked="modelValue === 'hunyuan'"
            type="radio"
            value="hunyuan"
            class="sr-only"
            @change="handleChange('hunyuan')"
          />
          <div class="flex items-center gap-2 mb-2">
            <Icon icon="lucide:zap" class="w-5 h-5" :class="modelValue === 'hunyuan' ? 'text-green-600' : 'text-slate-400'" />
            <span class="font-medium" :class="modelValue === 'hunyuan' ? 'text-green-900' : 'text-slate-700'">强制 Hunyuan</span>
          </div>
          <p class="text-xs text-slate-500">始终使用腾讯混元模型，hunyuan-lite 免费，不支持思考推理</p>
          <div v-if="modelValue === 'hunyuan'" class="absolute top-2 right-2">
            <Icon icon="lucide:check-circle" class="w-5 h-5 text-green-500" />
          </div>
        </label>

        <!-- 动态切换 -->
        <label
          class="relative flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-all"
          :class="modelValue === 'dynamic' ? 'border-purple-500 bg-purple-50' : 'border-slate-200 hover:border-purple-300'"
        >
          <input
            :checked="modelValue === 'dynamic'"
            type="radio"
            value="dynamic"
            class="sr-only"
            @change="handleChange('dynamic')"
          />
          <div class="flex items-center gap-2 mb-2">
            <Icon icon="lucide:refresh-cw" class="w-5 h-5" :class="modelValue === 'dynamic' ? 'text-purple-600' : 'text-slate-400'" />
            <span class="font-medium" :class="modelValue === 'dynamic' ? 'text-purple-900' : 'text-slate-700'">动态切换</span>
          </div>
          <p class="text-xs text-slate-500">DeepSeek 余额充足时使用，不足时自动切换到 Hunyuan</p>
          <div v-if="modelValue === 'dynamic'" class="absolute top-2 right-2">
            <Icon icon="lucide:check-circle" class="w-5 h-5 text-purple-500" />
          </div>
        </label>
      </div>

      <!-- 策略说明 -->
      <div class="mt-4 p-3 bg-slate-50 rounded-lg">
        <div class="flex items-start gap-2">
          <Icon icon="lucide:info" class="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
          <p class="text-xs text-slate-500">
            <span class="font-medium">当前策略：</span>
            <span v-if="modelValue === 'deepseek'">强制使用 DeepSeek，需要配置有效的 DeepSeek API Key</span>
            <span v-else-if="modelValue === 'hunyuan'">强制使用 Hunyuan，需要配置 Hunyuan API Key（hunyuan-lite 免费）</span>
            <span v-else>动态切换：DeepSeek 余额 > 0.3元 时使用 DeepSeek，否则自动切换到 Hunyuan</span>
          </p>
        </div>
      </div>

      <!-- 更新状态提示 -->
      <div v-if="errorMsg" class="p-3 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-red-600 text-sm flex items-center gap-2">
          <Icon icon="lucide:alert-circle" class="w-4 h-4 flex-shrink-0" />
          {{ errorMsg }}
        </p>
      </div>
      <div v-if="successMsg" class="p-3 bg-green-50 border border-green-200 rounded-lg">
        <p class="text-green-600 text-sm flex items-center gap-2">
          <Icon icon="lucide:check-circle" class="w-4 h-4 flex-shrink-0" />
          {{ successMsg }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Icon } from '@iconify/vue'

type Strategy = 'deepseek' | 'hunyuan' | 'dynamic'

interface Props {
  modelValue: Strategy
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: Strategy]
  change: [value: Strategy, callback: (error?: Error) => void]
}>()

const errorMsg = ref('')
const successMsg = ref('')

// 监听外部值变化，清除消息
watch(() => props.modelValue, () => {
  errorMsg.value = ''
  successMsg.value = ''
})

const handleChange = (value: Strategy) => {
  if (value === props.modelValue) return

  errorMsg.value = ''
  successMsg.value = ''

  emit('update:modelValue', value)
  emit('change', value, (error?: Error) => {
    if (error) {
      errorMsg.value = error.message || '更新失败'
    } else {
      successMsg.value = '模型策略更新成功'
    }
  })
}

const clearMessages = () => {
  errorMsg.value = ''
  successMsg.value = ''
}

defineExpose({
  clearMessages
})
</script>
