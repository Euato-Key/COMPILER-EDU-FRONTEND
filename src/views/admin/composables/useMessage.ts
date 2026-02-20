import { ref } from 'vue'

export interface MessageState {
  errorMsg: string
  successMsg: string
  apiKeyErrorMsg: string
  apiKeySuccessMsg: string
  passwordErrorMsg: string
  passwordSuccessMsg: string
}

export function useMessage() {
  // 登录页面消息
  const errorMsg = ref('')
  const successMsg = ref('')
  
  // API 密钥更新消息
  const apiKeyErrorMsg = ref('')
  const apiKeySuccessMsg = ref('')
  
  // 密码修改消息
  const passwordErrorMsg = ref('')
  const passwordSuccessMsg = ref('')

  // 显示登录错误
  const showError = (msg: string, duration = 5000) => {
    errorMsg.value = msg
    successMsg.value = ''
    setTimeout(() => {
      errorMsg.value = ''
    }, duration)
  }

  // 显示登录成功
  const showSuccess = (msg: string, duration = 3000) => {
    successMsg.value = msg
    errorMsg.value = ''
    setTimeout(() => {
      successMsg.value = ''
    }, duration)
  }

  // 显示 API 密钥更新错误
  const showApiKeyError = (msg: string, duration = 5000) => {
    apiKeyErrorMsg.value = msg
    apiKeySuccessMsg.value = ''
    setTimeout(() => {
      apiKeyErrorMsg.value = ''
    }, duration)
  }

  // 显示 API 密钥更新成功
  const showApiKeySuccess = (msg: string, duration = 3000) => {
    apiKeySuccessMsg.value = msg
    apiKeyErrorMsg.value = ''
    setTimeout(() => {
      apiKeySuccessMsg.value = ''
    }, duration)
  }

  // 显示密码修改错误
  const showPasswordError = (msg: string, duration = 5000) => {
    passwordErrorMsg.value = msg
    passwordSuccessMsg.value = ''
    setTimeout(() => {
      passwordErrorMsg.value = ''
    }, duration)
  }

  // 显示密码修改成功
  const showPasswordSuccess = (msg: string, duration = 3000) => {
    passwordSuccessMsg.value = msg
    passwordErrorMsg.value = ''
    setTimeout(() => {
      passwordSuccessMsg.value = ''
    }, duration)
  }

  // 清空所有消息
  const clearAllMessages = () => {
    errorMsg.value = ''
    successMsg.value = ''
    apiKeyErrorMsg.value = ''
    apiKeySuccessMsg.value = ''
    passwordErrorMsg.value = ''
    passwordSuccessMsg.value = ''
  }

  return {
    // 状态
    errorMsg,
    successMsg,
    apiKeyErrorMsg,
    apiKeySuccessMsg,
    passwordErrorMsg,
    passwordSuccessMsg,
    // 方法
    showError,
    showSuccess,
    showApiKeyError,
    showApiKeySuccess,
    showPasswordError,
    showPasswordSuccess,
    clearAllMessages
  }
}
