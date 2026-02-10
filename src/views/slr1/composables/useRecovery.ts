import { ref, watch, onMounted } from 'vue'

/**
 * SLR1 Session Recovery Composable
 * Handles automatic recovery of session data when page refreshes
 */
export function useSLR1Recovery(slr1Store: any) {
  const isRecovering = ref(false)

  const handleRecovery = async () => {
    if (isRecovering.value) return
    
    // Check if we have productions but no analysis result (page refresh scenario)
    if (slr1Store.productions.length > 0 && !slr1Store.originalData) {
      isRecovering.value = true
      console.log('[SLR1-RECOVERY] 检测到文法记录，正在静默恢复分析结果...', slr1Store.productions)
      
      try {
        const success = await slr1Store.performSLR1Analysis(true) // true = restoring mode
        if (success) {
          console.log('[SLR1-RECOVERY] 分析结果恢复成功')
          // If there's an input string, also restore the analysis
          if (slr1Store.inputString) {
            await slr1Store.analyzeInputString()
          }
          return true
        }
      } catch (err) {
        console.error('[SLR1-RECOVERY] 恢复失败:', err)
      } finally {
        isRecovering.value = false
      }
    }
    return false
  }

  // Watch for grammar changes and trigger recovery
  const setupRecoveryWatcher = (callback?: () => void) => {
    watch(() => slr1Store.grammar, (newVal) => {
      if (newVal) {
        handleRecovery().then((recovered) => {
          if (recovered && callback) {
            callback()
          }
        })
      }
    }, { immediate: true })
  }

  // Initialize recovery on mount
  const initRecovery = async () => {
    // Load persisted data first
    try {
      slr1Store.persistence.load()
    } catch (err) {
      console.warn('[SLR1-RECOVERY] Failed to load persisted data:', err)
    }
    
    // Then attempt recovery
    return await handleRecovery()
  }

  return {
    isRecovering,
    handleRecovery,
    setupRecoveryWatcher,
    initRecovery
  }
}
