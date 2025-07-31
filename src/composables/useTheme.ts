import { ref, onMounted } from 'vue'

export interface Theme {
  name: string
  colors: {
    primary: string
    mainBgFrom: string
    mainBgTo: string
    headerBg: string
    headerText: string
    contentBg: string
    contentBorder: string
    stepBg: string
    stepBorder: string
  }
}

export function useTheme() {
  const currentTheme = ref<Theme | null>(null)

  const applyTheme = (theme: Theme) => {
    const root = document.documentElement

    // 设置CSS变量
    root.style.setProperty('--theme-primary', theme.colors.primary)
    root.style.setProperty('--theme-main-bg-from', theme.colors.mainBgFrom)
    root.style.setProperty('--theme-main-bg-to', theme.colors.mainBgTo)
    root.style.setProperty('--theme-header-bg', theme.colors.headerBg)
    root.style.setProperty('--theme-header-text', theme.colors.headerText)
    root.style.setProperty('--theme-content-bg', theme.colors.contentBg)
    root.style.setProperty('--theme-content-border', theme.colors.contentBorder)
    root.style.setProperty('--theme-step-bg', theme.colors.stepBg)
    root.style.setProperty('--theme-step-border', theme.colors.stepBorder)

    // 移除深色主题class
    root.classList.remove('theme-dark')

    currentTheme.value = theme

    // 保存到本地存储
    localStorage.setItem('selectedTheme', JSON.stringify(theme))

    // 触发自定义事件
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: theme }))
  }

  const loadSavedTheme = () => {
    const savedTheme = localStorage.getItem('selectedTheme')
    if (savedTheme) {
      try {
        const theme = JSON.parse(savedTheme)
        applyTheme(theme)
      } catch (error) {
        console.error('Failed to load saved theme:', error)
      }
    }
  }

  const resetTheme = () => {
    const defaultTheme: Theme = {
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
    }
    applyTheme(defaultTheme)
  }

  onMounted(() => {
    loadSavedTheme()
  })

  return {
    currentTheme,
    applyTheme,
    loadSavedTheme,
    resetTheme
  }
}
