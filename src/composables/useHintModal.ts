import { ref } from 'vue'

export type HintModalType = 'success' | 'error' | 'warning' | 'info' | 'hint'
export type HintModalPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center' | 'top-center'

export interface HintModalConfig {
  type: HintModalType
  title: string
  message: string
  details: string
  action: string
  duration: number
  position: HintModalPosition
}

export function useHintModal() {
  const hintModalVisible = ref(false)
  const hintModalConfig = ref<HintModalConfig>({
    type: 'hint',
    title: '',
    message: '',
    details: '',
    action: '',
    duration: 3000,
    position: 'bottom-left'
  })

  const showHintModal = (
    type: HintModalType,
    title: string,
    message: string,
    details?: string,
    action?: string,
    duration = 3000,
    position: HintModalPosition = 'bottom-left'
  ) => {
    hintModalConfig.value = {
      type,
      title,
      message,
      details: details || '',
      action: action || '',
      duration,
      position
    }
    hintModalVisible.value = true
  }

  const closeHintModal = () => {
    hintModalVisible.value = false
  }

  return {
    hintModalVisible,
    hintModalConfig,
    showHintModal,
    closeHintModal
  }
}
