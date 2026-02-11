<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
    <div class="max-w-2xl mx-auto">
      <!-- 标题 -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-slate-800 mb-2">API 密钥管理</h1>
        <p class="text-slate-500">管理 DeepSeek API 密钥和管理员密码</p>
      </div>

      <!-- 密码验证卡片 -->
      <div v-if="!isAuthenticated" class="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
            <Icon icon="lucide:lock" class="w-5 h-5 text-amber-600" />
          </div>
          <h2 class="text-lg font-semibold text-slate-800">管理员验证</h2>
        </div>
        <p class="text-slate-500 text-sm mb-4">请输入管理员密码以继续操作</p>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">管理员密码</label>
            <input
              v-model="password"
              type="password"
              placeholder="请输入密码"
              class="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              @keyup.enter="handleLogin"
            />
          </div>
          <button
            @click="handleLogin"
            :disabled="isLoading || !password"
            class="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Icon v-if="isLoading" icon="lucide:loader-2" class="w-4 h-4 animate-spin" />
            <span>{{ isLoading ? '验证中...' : '验证' }}</span>
          </button>
        </div>
        <div v-if="errorMsg" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-red-600 text-sm flex items-center gap-2">
            <Icon icon="lucide:alert-circle" class="w-4 h-4" />
            {{ errorMsg }}
          </p>
        </div>
      </div>

      <!-- 管理面板 -->
      <div v-else class="space-y-6">
        <!-- 当前 API 密钥 -->
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Icon icon="lucide:key" class="w-5 h-5 text-blue-600" />
            </div>
            <h2 class="text-lg font-semibold text-slate-800">当前 API 密钥</h2>
          </div>
          <div class="bg-slate-50 rounded-lg p-4 mb-4">
            <div class="flex items-center justify-between">
              <code class="text-sm text-slate-600 font-mono">{{ maskApiKey(currentApiKey) }}</code>
              <button
                @click="showApiKey = !showApiKey"
                class="p-1.5 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <Icon :icon="showApiKey ? 'lucide:eye-off' : 'lucide:eye'" class="w-4 h-4 text-slate-500" />
              </button>
            </div>
            <div v-if="showApiKey" class="mt-2 pt-2 border-t border-slate-200">
              <code class="text-sm text-slate-800 font-mono break-all">{{ currentApiKey }}</code>
            </div>
          </div>
          <div class="flex items-center gap-2 text-sm text-slate-500">
            <Icon icon="lucide:info" class="w-4 h-4" />
            <span>API 密钥存储在服务器上，本地仅缓存密码</span>
          </div>
        </div>

        <!-- 余额查询 -->
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <Icon icon="lucide:wallet" class="w-5 h-5 text-orange-600" />
              </div>
              <h2 class="text-lg font-semibold text-slate-800">账户余额</h2>
            </div>
            <div class="flex items-center gap-2">
              <a
                href="https://platform.deepseek.com/usage"
                target="_blank"
                rel="noopener noreferrer"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <Icon icon="lucide:credit-card" class="w-4 h-4" />
                <span>充值</span>
              </a>
              <button
                @click="queryBalance"
                :disabled="isQueryingBalance || !currentApiKey"
                class="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-slate-300 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <Icon v-if="isQueryingBalance" icon="lucide:loader-2" class="w-4 h-4 animate-spin" />
                <Icon v-else icon="lucide:refresh-cw" class="w-4 h-4" />
                <span>{{ isQueryingBalance ? '查询中...' : '刷新' }}</span>
              </button>
            </div>
          </div>

          <!-- 余额信息 -->
          <div v-if="balanceInfo" class="space-y-3">
            <div class="flex items-center gap-2 mb-3">
              <span
                class="px-2 py-1 rounded text-xs font-medium"
                :class="balanceInfo.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
              >
                {{ balanceInfo.is_available ? '账户可用' : '账户不可用' }}
              </span>
            </div>
            <div
              v-for="(info, idx) in balanceInfo.balance_infos"
              :key="idx"
              class="bg-slate-50 rounded-lg p-4"
            >
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-slate-500">货币</span>
                <span class="text-sm font-medium text-slate-700">{{ info.currency }}</span>
              </div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-slate-500">总余额</span>
                <span class="text-lg font-bold text-orange-600">¥{{ info.total_balance }}</span>
              </div>
              <div class="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-slate-200">
                <div>
                  <span class="text-xs text-slate-400 block">赠送余额</span>
                  <span class="text-sm font-medium text-slate-600">¥{{ info.granted_balance }}</span>
                </div>
                <div>
                  <span class="text-xs text-slate-400 block">充值余额</span>
                  <span class="text-sm font-medium text-slate-600">¥{{ info.topped_up_balance }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 未查询状态 -->
          <div v-else-if="!balanceError" class="text-center py-8 text-slate-400">
            <Icon icon="lucide:wallet" class="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p class="text-sm">点击刷新按钮查询余额</p>
          </div>

          <!-- 错误提示 -->
          <div v-if="balanceError" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-red-600 text-sm flex items-center gap-2">
              <Icon icon="lucide:alert-circle" class="w-4 h-4" />
              {{ balanceError }}
            </p>
          </div>
        </div>

        <!-- 更新 API 密钥 -->
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <Icon icon="lucide:refresh-cw" class="w-5 h-5 text-green-600" />
            </div>
            <h2 class="text-lg font-semibold text-slate-800">更新 API 密钥</h2>
          </div>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">新的 API 密钥</label>
              <input
                v-model="newApiKey"
                type="text"
                placeholder="sk-..."
                class="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div class="flex items-center gap-2">
              <input
                v-model="updatePasswordTogether"
                type="checkbox"
                id="update-password-together"
                class="w-4 h-4 text-green-600 rounded border-slate-300 focus:ring-green-500"
              />
              <label for="update-password-together" class="text-sm text-slate-600">同时修改管理员密码</label>
            </div>
            <div v-if="updatePasswordTogether">
              <label class="block text-sm font-medium text-slate-700 mb-1">新的管理员密码</label>
              <input
                v-model="newPasswordTogether"
                type="password"
                placeholder="请输入新密码"
                class="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <button
              @click="handleUpdateApiKey"
              :disabled="isUpdating || !newApiKey"
              class="w-full py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-slate-300 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Icon v-if="isUpdating" icon="lucide:loader-2" class="w-4 h-4 animate-spin" />
              <span>{{ isUpdating ? '更新中...' : '更新 API 密钥' }}</span>
            </button>
          </div>
        </div>

        <!-- 修改管理员密码 -->
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <Icon icon="lucide:shield" class="w-5 h-5 text-purple-600" />
            </div>
            <h2 class="text-lg font-semibold text-slate-800">修改管理员密码</h2>
          </div>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">原密码</label>
              <input
                v-model="oldPassword"
                type="password"
                placeholder="请输入原密码"
                class="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">新密码</label>
              <input
                v-model="newPassword"
                type="password"
                placeholder="请输入新密码"
                class="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">确认新密码</label>
              <input
                v-model="confirmPassword"
                type="password"
                placeholder="请再次输入新密码"
                class="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <button
              @click="handleUpdatePassword"
              :disabled="isUpdatingPassword || !oldPassword || !newPassword || !confirmPassword"
              class="w-full py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Icon v-if="isUpdatingPassword" icon="lucide:loader-2" class="w-4 h-4 animate-spin" />
              <span>{{ isUpdatingPassword ? '修改中...' : '修改密码' }}</span>
            </button>
          </div>
        </div>

        <!-- 退出登录 -->
        <div class="flex justify-center">
          <button
            @click="handleLogout"
            class="px-6 py-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-2"
          >
            <Icon icon="lucide:log-out" class="w-4 h-4" />
            <span>退出登录</span>
          </button>
        </div>
      </div>

      <!-- 成功提示 -->
      <div
        v-if="successMsg"
        class="fixed top-4 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in"
      >
        <Icon icon="lucide:check-circle" class="w-5 h-5" />
        <span>{{ successMsg }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Icon } from '@iconify/vue'
import {
  getStoredPassword,
  storePassword,
  clearStoredPassword,
  getApiKey,
  updateApiKey,
  updateAdminPassword,
  queryDeepSeekBalance,
  type BalanceResponse
} from '@/api/ai'

// 状态
const isAuthenticated = ref(false)
const isLoading = ref(false)
const isUpdating = ref(false)
const isUpdatingPassword = ref(false)
const password = ref('')
const currentApiKey = ref('')
const showApiKey = ref(false)
const newApiKey = ref('')
const updatePasswordTogether = ref(false)
const newPasswordTogether = ref('')
const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const errorMsg = ref('')
const successMsg = ref('')

// 余额查询状态
const isQueryingBalance = ref(false)
const balanceInfo = ref<BalanceResponse | null>(null)
const balanceError = ref('')

// 页面加载时检查是否已登录
onMounted(() => {
  const storedPassword = getStoredPassword()
  if (storedPassword) {
    // 尝试自动登录
    password.value = storedPassword
    handleLogin()
  }
})

// 监听认证状态，登录成功后自动查询余额
watch(isAuthenticated, async (newVal) => {
  if (newVal && currentApiKey.value) {
    // 延迟一点时间确保页面渲染完成
    setTimeout(() => {
      queryBalance()
    }, 100)
  }
})

// 显示成功消息
const showSuccess = (msg: string) => {
  successMsg.value = msg
  setTimeout(() => {
    successMsg.value = ''
  }, 3000)
}

// 显示错误消息
const showError = (msg: string) => {
  errorMsg.value = msg
  setTimeout(() => {
    errorMsg.value = ''
  }, 5000)
}

// 登录
const handleLogin = async () => {
  if (!password.value) {
    showError('请输入密码')
    return
  }

  isLoading.value = true
  errorMsg.value = ''

  try {
    const res = await getApiKey(password.value)
    if (res.data.code === 0) {
      currentApiKey.value = res.data.data?.api_key || ''
      storePassword(password.value)
      isAuthenticated.value = true
    } else {
      showError(res.data.msg || '密码错误')
      clearStoredPassword()
    }
  } catch (error) {
    showError('验证失败，请检查网络连接')
    console.error('登录失败:', error)
  } finally {
    isLoading.value = false
  }
}

// 退出登录
const handleLogout = () => {
  clearStoredPassword()
  isAuthenticated.value = false
  password.value = ''
  currentApiKey.value = ''
  newApiKey.value = ''
  oldPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
}

// 掩码显示 API 密钥
const maskApiKey = (key: string): string => {
  if (!key || key.length < 8) return '未配置'
  return key.slice(0, 6) + '...' + key.slice(-4)
}

// 更新 API 密钥
const handleUpdateApiKey = async () => {
  if (!newApiKey.value) {
    showError('请输入新的 API 密钥')
    return
  }

  if (updatePasswordTogether.value && !newPasswordTogether.value) {
    showError('请输入新的管理员密码')
    return
  }

  isUpdating.value = true

  try {
    const storedPassword = getStoredPassword()
    if (!storedPassword) {
      showError('登录已过期，请重新登录')
      isAuthenticated.value = false
      return
    }

    const res = await updateApiKey(
      storedPassword,
      newApiKey.value,
      updatePasswordTogether.value ? newPasswordTogether.value : undefined
    )

    if (res.data.code === 0) {
      currentApiKey.value = newApiKey.value
      newApiKey.value = ''

      // 如果同时修改了密码，更新本地存储
      if (updatePasswordTogether.value && newPasswordTogether.value) {
        storePassword(newPasswordTogether.value)
        newPasswordTogether.value = ''
        updatePasswordTogether.value = false
      }

      showSuccess('API 密钥更新成功')
    } else {
      showError(res.data.msg || '更新失败')
    }
  } catch (error) {
    showError('更新失败，请检查网络连接')
    console.error('更新 API 密钥失败:', error)
  } finally {
    isUpdating.value = false
  }
}

// 修改管理员密码
const handleUpdatePassword = async () => {
  if (!oldPassword.value || !newPassword.value || !confirmPassword.value) {
    showError('请填写所有字段')
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    showError('两次输入的新密码不一致')
    return
  }

  isUpdatingPassword.value = true

  try {
    const res = await updateAdminPassword(oldPassword.value, newPassword.value)

    if (res.data.code === 0) {
      storePassword(newPassword.value)
      oldPassword.value = ''
      newPassword.value = ''
      confirmPassword.value = ''
      showSuccess('密码修改成功')
    } else {
      showError(res.data.msg || '修改失败')
    }
  } catch (error) {
    showError('修改失败，请检查网络连接')
    console.error('修改密码失败:', error)
  } finally {
    isUpdatingPassword.value = false
  }
}

// 查询余额
const queryBalance = async () => {
  if (!currentApiKey.value) {
    balanceError.value = '请先配置 API 密钥'
    return
  }

  isQueryingBalance.value = true
  balanceError.value = ''

  try {
    const result = await queryDeepSeekBalance(currentApiKey.value)
    if (result) {
      balanceInfo.value = result
    } else {
      balanceError.value = '查询余额失败，请检查 API 密钥是否有效'
    }
  } catch (error) {
    balanceError.value = '查询余额失败，请检查网络连接'
    console.error('查询余额失败:', error)
  } finally {
    isQueryingBalance.value = false
  }
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}
</style>
