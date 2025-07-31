<template>
  <div class="theme-selector relative">
    <button
      @click="toggleDropdown"
      class="flex items-center gap-2 px-3 py-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg hover:bg-white transition-all duration-200 shadow-sm"
    >
      <Icon icon="lucide:palette" class="w-4 h-4 text-gray-600" />
      <span class="text-sm font-medium text-gray-700">主题</span>
      <Icon
        :icon="isOpen ? 'lucide:chevron-up' : 'lucide:chevron-down'"
        class="w-4 h-4 text-gray-500 transition-transform duration-200"
      />
    </button>

    <div
      v-if="isOpen"
      class="absolute top-full right-0 mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50"
    >
      <div class="p-4 border-b border-gray-100">
        <h3 class="text-sm font-semibold text-gray-900 mb-3">预设主题</h3>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="theme in presetThemes"
            :key="theme.name"
            @click="applyTheme(theme)"
            class="flex items-center gap-2 p-2 rounded-lg border-2 transition-all duration-200"
            :class="[
              currentTheme?.name === theme.name
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            ]"
          >
            <div class="w-4 h-4 rounded-full" :style="{ backgroundColor: theme.colors.primary }"></div>
            <span class="text-xs font-medium text-gray-700">{{ theme.name }}</span>
          </button>
        </div>
      </div>

      <div class="p-4">
        <h3 class="text-sm font-semibold text-gray-900 mb-3">自定义主题</h3>

        <div class="mb-4">
          <label class="block text-xs font-medium text-gray-700 mb-2">主背景渐变</label>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-xs text-gray-500 mb-1">起始色</label>
              <input
                v-model="customTheme.mainBgFrom"
                type="color"
                class="w-full h-8 rounded border border-gray-200 cursor-pointer"
              />
            </div>
            <div>
              <label class="block text-xs text-gray-500 mb-1">结束色</label>
              <input
                v-model="customTheme.mainBgTo"
                type="color"
                class="w-full h-8 rounded border border-gray-200 cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-xs font-medium text-gray-700 mb-2">头部配色</label>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-xs text-gray-500 mb-1">背景色</label>
              <input
                v-model="customTheme.headerBg"
                type="color"
                class="w-full h-8 rounded border border-gray-200 cursor-pointer"
              />
            </div>
            <div>
              <label class="block text-xs text-gray-500 mb-1">文字色</label>
              <input
                v-model="customTheme.headerText"
                type="color"
                class="w-full h-8 rounded border border-gray-200 cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-xs font-medium text-gray-700 mb-2">答题区域</label>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-xs text-gray-500 mb-1">背景色</label>
              <input
                v-model="customTheme.contentBg"
                type="color"
                class="w-full h-8 rounded border border-gray-200 cursor-pointer"
              />
            </div>
            <div>
              <label class="block text-xs text-gray-500 mb-1">边框色</label>
              <input
                v-model="customTheme.contentBorder"
                type="color"
                class="w-full h-8 rounded border border-gray-200 cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-xs font-medium text-gray-700 mb-2">步骤导航区域</label>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-xs text-gray-500 mb-1">背景色</label>
              <input
                v-model="customTheme.stepBg"
                type="color"
                class="w-full h-8 rounded border border-gray-200 cursor-pointer"
              />
            </div>
            <div>
              <label class="block text-xs text-gray-500 mb-1">边框色</label>
              <input
                v-model="customTheme.stepBorder"
                type="color"
                class="w-full h-8 rounded border border-gray-200 cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div class="flex gap-2">
          <button
            @click="applyCustomTheme"
            class="flex-1 px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            应用自定义
          </button>
          <button
            @click="resetTheme"
            class="px-3 py-2 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            重置
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="isOpen"
      @click="closeDropdown"
      class="fixed inset-0 z-40"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { useTheme, type Theme } from '@/composables/useTheme'

// 使用导入的Theme接口

const presetThemes: Theme[] = [
  {
    name: '默认蓝',
    colors: {
      primary: '#3B82F6',
      mainBgFrom: '#EBF8FF',
      mainBgTo: '#BFDBFE',
      headerBg: '#FFFFFF',
      headerText: '#3B82F6',
      contentBg: '#FFFFFF',
      contentBorder: '#E5E7EB',
      stepBg: '#F8FAFC',
      stepBorder: '#E2E8F0'
    }
  },
  {
    name: '科技紫',
    colors: {
      primary: '#8B5CF6',
      mainBgFrom: '#F5F3FF',
      mainBgTo: '#DDD6FE',
      headerBg: '#F8FAFC',
      headerText: '#8B5CF6',
      contentBg: '#FFFFFF',
      contentBorder: '#E2E8F0',
      stepBg: '#F1F5F9',
      stepBorder: '#CBD5E1'
    }
  },
  {
    name: '自然绿',
    colors: {
      primary: '#10B981',
      mainBgFrom: '#ECFDF5',
      mainBgTo: '#A7F3D0',
      headerBg: '#F0FDF4',
      headerText: '#10B981',
      contentBg: '#FFFFFF',
      contentBorder: '#D1FAE5',
      stepBg: '#F0FDF4',
      stepBorder: '#A7F3D0'
    }
  },
  {
    name: '温暖橙',
    colors: {
      primary: '#F59E0B',
      mainBgFrom: '#FFFBEB',
      mainBgTo: '#FED7AA',
      headerBg: '#FFFAF0',
      headerText: '#F59E0B',
      contentBg: '#FFFFFF',
      contentBorder: '#FDE68A',
      stepBg: '#FFFAF0',
      stepBorder: '#FED7AA'
    }
  },
  {
    name: '浪漫粉',
    colors: {
      primary: '#EC4899',
      mainBgFrom: '#FDF2F8',
      mainBgTo: '#FCE7F3',
      headerBg: '#FFFFFF',
      headerText: '#EC4899',
      contentBg: '#FFFFFF',
      contentBorder: '#FBCFE8',
      stepBg: '#FDF2F8',
      stepBorder: '#FBCFE8'
    }
  },
  {
    name: '清新青',
    colors: {
      primary: '#06B6D4',
      mainBgFrom: '#ECFEFF',
      mainBgTo: '#CFFAFE',
      headerBg: '#F0FDFA',
      headerText: '#06B6D4',
      contentBg: '#FFFFFF',
      contentBorder: '#A7F3D0',
      stepBg: '#F0FDFA',
      stepBorder: '#A7F3D0'
    }
  }
]

const { currentTheme, applyTheme: applyThemeToDOM } = useTheme()
const isOpen = ref(false)

// 初始化自定义主题为当前主题的值
const customTheme = reactive({
  mainBgFrom: '#EBF8FF',
  mainBgTo: '#E0E7FF',
  headerBg: '#FFFFFF',
  headerText: '#3B82F6',
  contentBg: '#FFFFFF',
  contentBorder: '#E5E7EB',
  stepBg: '#F8FAFC',
  stepBorder: '#E2E8F0'
})

// 监听当前主题变化，更新自定义主题的值
const updateCustomTheme = () => {
  if (currentTheme.value) {
    customTheme.mainBgFrom = currentTheme.value.colors.mainBgFrom
    customTheme.mainBgTo = currentTheme.value.colors.mainBgTo
    customTheme.headerBg = currentTheme.value.colors.headerBg
    customTheme.headerText = currentTheme.value.colors.headerText
    customTheme.contentBg = currentTheme.value.colors.contentBg
    customTheme.contentBorder = currentTheme.value.colors.contentBorder
    customTheme.stepBg = currentTheme.value.colors.stepBg
    customTheme.stepBorder = currentTheme.value.colors.stepBorder
  }
}

// 监听主题变化
onMounted(() => {
  updateCustomTheme()
})

// 监听currentTheme变化
watch(currentTheme, () => {
  updateCustomTheme()
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const closeDropdown = () => {
  isOpen.value = false
}

const applyTheme = (theme: Theme) => {
  applyThemeToDOM(theme)
  closeDropdown()
}

const applyCustomTheme = () => {
  const theme: Theme = {
    name: '自定义',
    colors: {
      primary: customTheme.headerText,
      mainBgFrom: customTheme.mainBgFrom,
      mainBgTo: customTheme.mainBgTo,
      headerBg: customTheme.headerBg,
      headerText: customTheme.headerText,
      contentBg: customTheme.contentBg,
      contentBorder: customTheme.contentBorder,
      stepBg: customTheme.stepBg,
      stepBorder: customTheme.stepBorder
    }
  }

  applyThemeToDOM(theme)
  closeDropdown()
}

const resetTheme = () => {
  applyThemeToDOM(presetThemes[0])
}

// 移除重复的函数定义，使用composable中的函数

const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.theme-selector')) {
    closeDropdown()
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.theme-selector {
  position: relative;
  z-index: 60;
}
</style>
