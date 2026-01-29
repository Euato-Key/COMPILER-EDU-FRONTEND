import { ref } from 'vue'
import { defineStore } from 'pinia'
import { testAPI } from '@/api'

export const useCommonStore = defineStore('common', () => {
  // 状态
  const loading = ref(false)
  const error = ref<string | null>(null)
  const success = ref<string | null>(null)
  const apiConnected = ref<boolean | null>(null)

  // Actions
  const setLoading = (state: boolean) => {
    loading.value = state
  }

  const setError = (message: string | null) => {
    error.value = message
    success.value = null
  }

  const setSuccess = (message: string | null) => {
    success.value = message
    error.value = null
  }

  const clearError = () => {
    error.value = null
  }

  const clearSuccess = () => {
    success.value = null
  }

  // API测试连接
  const testConnection = async () => {
    try {
      setLoading(true)
      clearError()
      clearSuccess()

      const response = await testAPI()

      if (response.data.code === 0) {
        apiConnected.value = true
        return true
      } else {
        apiConnected.value = false
        setError(response.data.message || '连接测试失败')
        return false
      }
    } catch (err) {
      apiConnected.value = false
      setError(err instanceof Error ? err.message : '网络连接失败')
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    // 状态
    loading,
    error,
    success,
    apiConnected,

    // Actions
    setLoading,
    setError,
    setSuccess,
    clearError,
    clearSuccess,
    testConnection,
  }
})
