<template>
  <div class="fixed z-50 right-6 bottom-6">
    <!-- 滚动进度条 -->
    <div
      v-if="showProgress && isVisible"
      class="absolute right-0 w-1 bg-white/20 rounded-full"
      :style="{ height: '80px', bottom: '70px' }"
    >
      <div
        class="w-full rounded-full transition-all duration-200 ease-out"
        :class="progressThemeClass"
        :style="{ height: `${scrollProgress}%`, transformOrigin: 'bottom' }"
      ></div>
    </div>

    <!-- 返回顶部按钮 -->
    <Transition name="fade-up">
      <button
        v-show="isVisible"
        @click="scrollToTop"
        class="relative w-14 h-14 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center cursor-pointer group backdrop-blur-sm border"
        :class="buttonThemeClass"
        :title="tooltip"
        aria-label="返回顶部"
        :style="{
          transform: hovering ? 'translateY(-2px) scale(1.05)' : 'translateY(0) scale(1)',
        }"
        @mouseenter="hovering = true"
        @mouseleave="hovering = false"
      >
        <Icon
          icon="lucide:arrow-up"
          class="w-5 h-5 transition-transform duration-200"
          :class="{ 'scale-110 -translate-y-0.5': hovering }"
        />

        <!-- 滚动百分比显示 -->
        <span
          v-if="showPercentage"
          class="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs bg-gray-800 text-white px-2 py-1 rounded whitespace-nowrap transition-opacity duration-200"
          :class="{ 'opacity-100': hovering, 'opacity-0': !hovering }"
        >
          {{ Math.round(scrollProgress) }}%
        </span>
      </button>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Icon } from '@iconify/vue'

interface Props {
  threshold?: number
  customClass?: string
  theme?: 'blue' | 'green' | 'purple' | 'emerald'
  showProgress?: boolean
  showPercentage?: boolean
  tooltip?: string
  position?: 'right' | 'left'
}

const props = withDefaults(defineProps<Props>(), {
  threshold: 300,
  customClass: '',
  theme: 'blue',
  showProgress: true,
  showPercentage: true,
  tooltip: '返回顶部',
  position: 'right'
})

const isVisible = ref(false)
const scrollProgress = ref(0)
const hovering = ref(false)
let ticking = false

// 主题类计算属性
const buttonThemeClass = computed(() => {
  const themes = {
    blue: 'bg-blue-600/90 hover:bg-blue-700/95 border-blue-500/20',
    green: 'bg-green-600/90 hover:bg-green-700/95 border-green-500/20',
    purple: 'bg-purple-600/90 hover:bg-purple-700/95 border-purple-500/20',
    emerald: 'bg-emerald-600/90 hover:bg-emerald-700/95 border-emerald-500/20'
  }
  return themes[props.theme]
})

const progressThemeClass = computed(() => {
  const themes = {
    blue: 'bg-gradient-to-t from-blue-400 to-blue-600',
    green: 'bg-gradient-to-t from-green-400 to-green-600',
    purple: 'bg-gradient-to-t from-purple-400 to-purple-600',
    emerald: 'bg-gradient-to-t from-emerald-400 to-emerald-600'
  }
  return themes[props.theme]
})

const handleScroll = () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const scrollTop = window.scrollY
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight

      isVisible.value = scrollTop > props.threshold
      scrollProgress.value = Math.min((scrollTop / documentHeight) * 100, 100)

      ticking = false
    })
    ticking = true
  }
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll() // 初始化
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* 动画效果 */
.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-up-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.8) rotate(10deg);
}

.fade-up-leave-to {
  opacity: 0;
  transform: translateY(30px) scale(0.8) rotate(-10deg);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .fixed {
    right: 1rem !important;
    bottom: 1rem !important;
  }
}

/* 减少动画效果（用户偏好） */
@media (prefers-reduced-motion: reduce) {
  .transition-all,
  .transition-transform,
  .transition-opacity,
  .fade-up-enter-active,
  .fade-up-leave-active {
    transition: none !important;
  }
}
</style>
