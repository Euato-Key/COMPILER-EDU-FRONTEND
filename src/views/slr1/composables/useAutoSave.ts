import { watch, ref } from 'vue'

/**
 * Auto Save Composable for SLR1
 * Handles automatic saving to history with debounce
 */
export function useAutoSave(slr1Store: any, options: { delay?: number } = {}) {
  const { delay = 1000 } = options
  let saveTimer: ReturnType<typeof setTimeout> | null = null
  const isSaving = ref(false)

  /**
   * Save to history with debounce
   */
  const debouncedSave = () => {
    if (saveTimer) {
      clearTimeout(saveTimer)
    }
    
    isSaving.value = true
    saveTimer = setTimeout(() => {
      slr1Store.saveToHistory()
      isSaving.value = false
      console.log('[SLR1-AUTOSAVE] 已自动保存到历史记录')
    }, delay)
  }

  /**
   * Immediate save without debounce
   */
  const immediateSave = () => {
    if (saveTimer) {
      clearTimeout(saveTimer)
      saveTimer = null
    }
    slr1Store.saveToHistory()
    console.log('[SLR1-AUTOSAVE] 已立即保存到历史记录')
  }

  /**
   * Setup auto-save watcher for reactive data
   */
  const setupAutoSave = (dataRef: any, options: { deep?: boolean } = {}) => {
    watch(dataRef, () => {
      debouncedSave()
    }, { deep: options.deep ?? true })
  }

  /**
   * Cleanup timer on unmount
   */
  const cleanup = () => {
    if (saveTimer) {
      clearTimeout(saveTimer)
      saveTimer = null
    }
  }

  return {
    isSaving,
    debouncedSave,
    immediateSave,
    setupAutoSave,
    cleanup
  }
}
