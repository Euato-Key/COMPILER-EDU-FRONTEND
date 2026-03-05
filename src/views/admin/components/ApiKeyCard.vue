<template>
  <div class="bg-white rounded-2xl shadow-lg p-6">
    <div class="flex items-center gap-3 mb-4">
      <div class="w-10 h-10 rounded-full flex items-center justify-center" :class="iconBgClass">
        <Icon :icon="icon" class="w-5 h-5" :class="iconClass" />
      </div>
      <h2 class="text-lg font-semibold text-slate-800">{{ title }}</h2>
      <span v-if="badge" class="px-2 py-0.5 text-xs rounded-full" :class="badgeClass">{{ badge }}</span>
    </div>

    <!-- 当前密钥显示 -->
    <div class="bg-slate-50 rounded-lg p-4 mb-4">
      <div class="flex items-center justify-between">
        <code class="text-sm text-slate-600 font-mono">{{ currentKey || '未配置' }}</code>
        <div
          v-if="currentKey && currentKey !== '未配置'"
          class="flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium"
        >
          <Icon icon="lucide:check-circle" class="w-3.5 h-3.5" />
          <span>已配置</span>
        </div>
        <div
          v-else
          class="flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium"
        >
          <Icon icon="lucide:alert-circle" class="w-3.5 h-3.5" />
          <span>未配置</span>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-2 text-sm text-slate-500 mb-4">
      <Icon icon="lucide:shield-check" class="w-4 h-4" />
      <span>{{ securityText }}</span>
    </div>

    <!-- 密钥输入和更新 -->
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">
          新的 {{ title }}
          <span v-if="keyHint" class="text-xs text-slate-400 font-normal ml-1">（{{ keyHint }}）</span>
        </label>
        <div class="relative">
          <input
            v-model="newKey"
            :type="showNewKey ? 'text' : 'password'"
            :placeholder="placeholder"
            class="w-full px-4 py-2 pr-12 border border-slate-200 rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all font-mono"
            :class="`focus:ring-${themeColor}-500`"
          />
          <button
            type="button"
            @click="showNewKey = !showNewKey"
            class="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
            :title="showNewKey ? '隐藏密钥' : '显示密钥'"
          >
            <Icon :icon="showNewKey ? 'lucide:eye-off' : 'lucide:eye'" class="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      <!-- 错误提示 -->
      <div v-if="errorMsg" class="p-3 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-red-600 text-sm flex items-center gap-2">
          <Icon icon="lucide:alert-circle" class="w-4 h-4 flex-shrink-0" />
          {{ errorMsg }}
        </p>
      </div>

      <!-- 成功提示 -->
      <div v-if="successMsg" class="p-3 bg-green-50 border border-green-200 rounded-lg">
        <p class="text-green-600 text-sm flex items-center gap-2">
          <Icon icon="lucide:check-circle" class="w-4 h-4 flex-shrink-0" />
          {{ successMsg }}
        </p>
      </div>

      <!-- 更新按钮 -->
      <button
        @click="handleUpdate"
        :disabled="isUpdating || !newKey"
        class="w-full py-2.5 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:bg-slate-300"
        :class="buttonClass"
      >
        <Icon v-if="isUpdating" icon="lucide:loader-2" class="w-4 h-4 animate-spin" />
        <span>{{ isUpdating ? updatingText : updateButtonText }}</span>
      </button>

      <!-- 安全提示 -->
      <div class="flex items-start gap-2 text-xs text-slate-500 bg-slate-50 rounded-lg p-3">
        <Icon icon="lucide:shield" class="w-4 h-4 mt-0.5 flex-shrink-0" />
        <div>
          <p class="font-medium text-slate-600 mb-1">安全提示</p>
          <ul class="space-y-0.5 text-slate-500">
            <li>• API 密钥输入时默认隐藏，防止旁人偷看</li>
            <li v-if="extraHint">• {{ extraHint }}</li>
            <li>• 更新成功后输入框将自动清空</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 未配置时的提示 -->
    <div
      v-if="!currentKey || currentKey === '未配置'"
      class="mt-4 p-4 border rounded-lg"
      :class="infoBoxClass"
    >
      <div class="flex items-start gap-3">
        <Icon icon="lucide:info" class="w-5 h-5 mt-0.5 flex-shrink-0" :class="infoIconClass" />
        <div>
          <p class="text-sm font-medium mb-1" :class="infoTitleClass">{{ noKeyTitle }}</p>
          <p class="text-sm mb-2" :class="infoDescClass">{{ noKeyDesc }}</p>
          <div class="space-y-2">
            <a
              v-for="(link, index) in helpLinks"
              :key="index"
              :href="link.url"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
              :class="linkClass"
            >
              <Icon icon="lucide:external-link" class="w-4 h-4" />
              {{ link.text }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'

interface HelpLink {
  text: string
  url: string
}

interface Props {
  title: string
  icon: string
  themeColor: 'blue' | 'green' | 'purple' | 'orange' | 'red'
  currentKey: string
  securityText?: string
  keyHint?: string
  placeholder?: string
  updatingText?: string
  updateButtonText?: string
  extraHint?: string
  badge?: string
  noKeyTitle: string
  noKeyDesc: string
  helpLinks: HelpLink[]
}

const props = withDefaults(defineProps<Props>(), {
  securityText: 'API 密钥已加密存储，仅显示掩码版本以确保安全',
  placeholder: '请输入 API 密钥',
  updatingText: '验证并更新中...',
  updateButtonText: '更新 API 密钥',
  keyHint: '',
  extraHint: '',
  badge: ''
})

const emit = defineEmits<{
  update: [key: string, callback: (error?: Error) => void]
}>()

const newKey = ref('')
const showNewKey = ref(false)
const isUpdating = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

const iconBgClass = computed(() => {
  const map: Record<string, string> = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    purple: 'bg-purple-100',
    orange: 'bg-orange-100',
    red: 'bg-red-100'
  }
  return map[props.themeColor] || 'bg-slate-100'
})

const iconClass = computed(() => {
  const map: Record<string, string> = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
    red: 'text-red-600'
  }
  return map[props.themeColor] || 'text-slate-600'
})

const badgeClass = computed(() => {
  const map: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    purple: 'bg-purple-100 text-purple-700',
    orange: 'bg-orange-100 text-orange-700',
    red: 'bg-red-100 text-red-700'
  }
  return map[props.themeColor] || 'bg-slate-100 text-slate-700'
})

const buttonClass = computed(() => {
  const map: Record<string, string> = {
    blue: 'bg-blue-600 hover:bg-blue-700',
    green: 'bg-green-600 hover:bg-green-700',
    purple: 'bg-purple-600 hover:bg-purple-700',
    orange: 'bg-orange-600 hover:bg-orange-700',
    red: 'bg-red-600 hover:bg-red-700'
  }
  return map[props.themeColor] || 'bg-slate-600 hover:bg-slate-700'
})

const infoBoxClass = computed(() => {
  const map: Record<string, string> = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    purple: 'bg-purple-50 border-purple-200',
    orange: 'bg-orange-50 border-orange-200',
    red: 'bg-red-50 border-red-200'
  }
  return map[props.themeColor] || 'bg-slate-50 border-slate-200'
})

const infoIconClass = computed(() => {
  const map: Record<string, string> = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
    red: 'text-red-600'
  }
  return map[props.themeColor] || 'text-slate-600'
})

const infoTitleClass = computed(() => {
  const map: Record<string, string> = {
    blue: 'text-blue-800',
    green: 'text-green-800',
    purple: 'text-purple-800',
    orange: 'text-orange-800',
    red: 'text-red-800'
  }
  return map[props.themeColor] || 'text-slate-800'
})

const infoDescClass = computed(() => {
  const map: Record<string, string> = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
    red: 'text-red-600'
  }
  return map[props.themeColor] || 'text-slate-600'
})

const linkClass = computed(() => {
  const map: Record<string, string> = {
    blue: 'text-blue-700 hover:text-blue-800',
    green: 'text-green-700 hover:text-green-800',
    purple: 'text-purple-700 hover:text-purple-800',
    orange: 'text-orange-700 hover:text-orange-800',
    red: 'text-red-700 hover:text-red-800'
  }
  return map[props.themeColor] || 'text-slate-700 hover:text-slate-800'
})

const handleUpdate = () => {
  if (!newKey.value) {
    errorMsg.value = `请输入新的 ${props.title}`
    return
  }

  isUpdating.value = true
  errorMsg.value = ''
  successMsg.value = ''

  emit('update', newKey.value, (error?: Error) => {
    isUpdating.value = false
    if (error) {
      errorMsg.value = error.message || '更新失败，请检查网络连接'
    } else {
      newKey.value = ''
      showNewKey.value = false
      successMsg.value = `${props.title}更新成功`
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
