<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- 标题 -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-slate-800 mb-2">API 密钥管理</h1>
        <p class="text-slate-500">管理 DeepSeek 和 GLM API 密钥、查看 Token 用量和管理员密码</p>
      </div>

      <!-- 密码验证卡片 -->
      <div v-if="!isAuthenticated" class="bg-white rounded-2xl shadow-lg p-6 mb-6 max-w-2xl mx-auto">
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
        <!-- 模型选择策略 -->
        <ModelStrategyCard
          ref="modelStrategyRef"
          v-model="modelStrategy"
          @change="handleUpdateModelStrategy"
        />

        <!-- DeepSeek API 密钥 -->
        <ApiKeyCard
          ref="deepseekCardRef"
          title="DeepSeek API 密钥"
          icon="lucide:key"
          theme-color="blue"
          :current-key="currentApiKey"
          key-hint="以 sk- 开头"
          placeholder="sk-..."
          :help-links="[
            { text: '前往 DeepSeek 官网获取密钥 →', url: 'https://platform.deepseek.com/api_keys' }
          ]"
          no-key-title="还没有 DeepSeek API 密钥？"
          no-key-desc="前往 DeepSeek 开放平台获取您的 API 密钥，即可开始使用 AI 功能。"
          @update="handleUpdateApiKey"
        />

        <!-- Hunyuan API 密钥 -->
        <ApiKeyCard
          ref="hunyuanCardRef"
          title="Hunyuan API 密钥"
          icon="lucide:zap"
          theme-color="green"
          :current-key="currentHunyuanKey"
          badge="hunyuan-lite 免费，不支持思考推理"
          extra-hint="hunyuan-lite 模型完全免费，其他模型可能收费"
          :help-links="[
            { text: '前往腾讯云获取 Hunyuan API 密钥 →', url: 'https://console.cloud.tencent.com/hunyuan/api-key' }
          ]"
          no-key-title="还没有 Hunyuan API 密钥？"
          no-key-desc="hunyuan-lite 模型完全免费，前往腾讯云开通服务并获取 API 密钥。"
          @update="handleUpdateHunyuanKey"
        />

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
                :disabled="isQueryingBalance"
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

        <!-- Token 用量统计 -->
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <Icon icon="lucide:bar-chart-3" class="w-5 h-5 text-indigo-600" />
              </div>
              <h2 class="text-lg font-semibold text-slate-800">Token 用量统计</h2>
            </div>
            <button
              @click="queryTokenUsage"
              :disabled="isQueryingTokenUsage"
              class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Icon v-if="isQueryingTokenUsage" icon="lucide:loader-2" class="w-4 h-4 animate-spin" />
              <Icon v-else icon="lucide:refresh-cw" class="w-4 h-4" />
              <span>{{ isQueryingTokenUsage ? '查询中...' : '刷新' }}</span>
            </button>
          </div>

          <!-- Token 统计信息 -->
          <div v-if="tokenUsageData" class="space-y-6">
            <!-- 总体统计（含费用计算） -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="bg-slate-50 rounded-lg p-4 text-center">
                <div class="text-2xl font-bold text-indigo-600">{{ tokenUsageData.summary.total_requests }}</div>
                <div class="text-xs text-slate-500 mt-1">总请求数</div>
              </div>
              <div class="bg-slate-50 rounded-lg p-4 text-center">
                <div class="text-2xl font-bold text-green-600">{{ formatNumber(tokenUsageData.summary.total_input_tokens) }}</div>
                <div class="text-xs text-slate-500 mt-1">输入 Token</div>
                <div class="text-xs text-slate-400 mt-0.5">2元/百万</div>
              </div>
              <div class="bg-slate-50 rounded-lg p-4 text-center">
                <div class="text-2xl font-bold text-purple-600">{{ formatNumber(tokenUsageData.summary.total_output_tokens) }}</div>
                <div class="text-xs text-slate-500 mt-1">输出 Token</div>
                <div class="text-xs text-slate-400 mt-0.5">3元/百万</div>
              </div>
              <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 text-center border border-green-100">
                <div class="text-2xl font-bold text-green-600">¥{{ calculateTotalCost(tokenUsageData) }}</div>
                <div class="text-xs text-slate-500 mt-1">预计费用</div>
                <div class="text-xs text-slate-400 mt-0.5">基于当前用量</div>
              </div>
            </div>

            <!-- 平均消耗统计 -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="bg-blue-50 rounded-lg p-4 text-center">
                <div class="text-2xl font-bold text-blue-600">{{ calculateAvgTokensPerRequest(tokenUsageData) }}</div>
                <div class="text-xs text-slate-500 mt-1">平均每次 Token 数</div>
              </div>
              <div class="bg-cyan-50 rounded-lg p-4 text-center">
                <div class="text-2xl font-bold text-cyan-600">{{ calculateAvgInputTokensPerRequest(tokenUsageData) }}</div>
                <div class="text-xs text-slate-500 mt-1">平均每次输入 Token</div>
              </div>
              <div class="bg-pink-50 rounded-lg p-4 text-center">
                <div class="text-2xl font-bold text-pink-600">{{ calculateAvgOutputTokensPerRequest(tokenUsageData) }}</div>
                <div class="text-xs text-slate-500 mt-1">平均每次输出 Token</div>
              </div>
              <div class="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 text-center border border-amber-100">
                <div class="text-2xl font-bold text-amber-600">¥{{ calculateAvgCostPerRequest(tokenUsageData) }}</div>
                <div class="text-xs text-slate-500 mt-1">平均每次费用</div>
              </div>
            </div>

            <!-- 统计时间 -->
            <div class="flex items-center justify-between text-sm">
              <div class="text-slate-400 text-xs">
                统计时间: {{ tokenUsageData.date_range.start_date }} 至 {{ tokenUsageData.date_range.end_date }}
              </div>
              <div class="text-xs text-slate-400">
                定价: 输入 2元/百万tokens | 输出 3元/百万tokens
                <a
                  href="https://api-docs.deepseek.com/zh-cn/quick_start/pricing/"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="ml-2 text-blue-500 hover:text-blue-600 hover:underline"
                >
                  官方定价可能变化，以实际为准 →
                </a>
              </div>
            </div>

            <!-- 按模块统计 -->
            <div v-if="tokenUsageData.module_stats.length > 0">
              <h3 class="text-sm font-medium text-slate-700 mb-3">按模块统计</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead class="bg-slate-50">
                    <tr>
                      <th class="px-4 py-2 text-left text-slate-600 font-medium">模块</th>
                      <th class="px-4 py-2 text-right text-slate-600 font-medium">请求数</th>
                      <th class="px-4 py-2 text-right text-slate-600 font-medium">输入 Token</th>
                      <th class="px-4 py-2 text-right text-slate-600 font-medium">输出 Token</th>
                      <th class="px-4 py-2 text-right text-slate-600 font-medium">总 Token</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100">
                    <tr v-for="stat in tokenUsageData.module_stats" :key="stat.module" class="hover:bg-slate-50">
                      <td class="px-4 py-2 text-slate-700">{{ formatModuleName(stat.module) }}</td>
                      <td class="px-4 py-2 text-right text-slate-600">{{ stat.requests }}</td>
                      <td class="px-4 py-2 text-right text-slate-600">{{ formatNumber(stat.input_tokens) }}</td>
                      <td class="px-4 py-2 text-right text-slate-600">{{ formatNumber(stat.output_tokens) }}</td>
                      <td class="px-4 py-2 text-right font-medium text-indigo-600">{{ formatNumber(stat.total_tokens) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- 按模型统计 -->
            <div v-if="tokenUsageData.model_stats.length > 0">
              <h3 class="text-sm font-medium text-slate-700 mb-3">按模型统计</h3>
              <div class="flex flex-wrap gap-3">
                <div
                  v-for="stat in tokenUsageData.model_stats"
                  :key="stat.model"
                  class="bg-slate-50 rounded-lg px-4 py-2"
                >
                  <div class="text-xs text-slate-500">{{ stat.model }}</div>
                  <div class="text-sm font-medium text-slate-700">
                    {{ stat.requests }} 次 / {{ formatNumber(stat.total_tokens) }} tokens
                  </div>
                </div>
              </div>
            </div>

            <!-- 无数据提示 -->
            <div v-if="tokenUsageData.module_stats.length === 0" class="text-center py-8 text-slate-400">
              <Icon icon="lucide:bar-chart-2" class="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p class="text-sm">暂无 Token 使用记录</p>
            </div>
          </div>

          <!-- 加载中 -->
          <div v-else-if="isQueryingTokenUsage" class="text-center py-8 text-slate-400">
            <Icon icon="lucide:loader-2" class="w-8 h-8 mx-auto mb-3 animate-spin" />
            <p class="text-sm">正在查询 Token 用量...</p>
          </div>

          <!-- 错误提示 -->
          <div v-if="tokenUsageError" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-red-600 text-sm flex items-center gap-2">
              <Icon icon="lucide:alert-circle" class="w-4 h-4" />
              {{ tokenUsageError }}
            </p>
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
            <!-- 密码修改错误提示 -->
            <div v-if="passwordErrorMsg" class="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-red-600 text-sm flex items-center gap-2">
                <Icon icon="lucide:alert-circle" class="w-4 h-4 flex-shrink-0" />
                {{ passwordErrorMsg }}
              </p>
            </div>

            <!-- 密码修改成功提示 -->
            <div v-if="passwordSuccessMsg" class="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p class="text-green-600 text-sm flex items-center gap-2">
                <Icon icon="lucide:check-circle" class="w-4 h-4 flex-shrink-0" />
                {{ passwordSuccessMsg }}
              </p>
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
import ApiKeyCard from './components/ApiKeyCard.vue'
import ModelStrategyCard from './components/ModelStrategyCard.vue'
import {
  getStoredPassword,
  storePassword,
  clearStoredPassword,
  getApiKey,
  updateApiKey,
  updateHunyuanApiKey,
  updateModelStrategy,
  updateAdminPassword,
  queryDeepSeekBalance,
  getTokenUsage,
  type BalanceResponse,
  type TokenUsageResponse
} from '@/api/ai'
import {
  formatNumber,
  formatModuleName,
  calculateTotalCost,
  calculateAvgTokensPerRequest,
  calculateAvgInputTokensPerRequest,
  calculateAvgOutputTokensPerRequest,
  calculateAvgCostPerRequest
} from './utils/calculations'
import { useMessage } from './composables/useMessage'

// 消息提示
const {
  errorMsg,
  successMsg,
  passwordErrorMsg,
  passwordSuccessMsg,
  showError,
  showPasswordError,
  showPasswordSuccess,
  clearAllMessages
} = useMessage()

// 组件引用
const deepseekCardRef = ref<InstanceType<typeof ApiKeyCard> | null>(null)
const hunyuanCardRef = ref<InstanceType<typeof ApiKeyCard> | null>(null)
const modelStrategyRef = ref<InstanceType<typeof ModelStrategyCard> | null>(null)

// 状态
const isAuthenticated = ref(false)
const isLoading = ref(false)
const isUpdatingPassword = ref(false)
const password = ref('')
const currentApiKey = ref('')  // DeepSeek API Key（掩码版本）
const currentHunyuanKey = ref('')  // Hunyuan API Key（掩码版本）
const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

// 模型策略
const modelStrategy = ref<'deepseek' | 'hunyuan' | 'dynamic'>('dynamic')

// 余额查询状态
const isQueryingBalance = ref(false)
const balanceInfo = ref<BalanceResponse | null>(null)
const balanceError = ref('')

// Token 用量查询状态
const isQueryingTokenUsage = ref(false)
const tokenUsageData = ref<TokenUsageResponse | null>(null)
const tokenUsageError = ref('')



// 页面加载时检查是否已登录
onMounted(() => {
  const storedPassword = getStoredPassword()
  if (storedPassword) {
    // 尝试自动登录
    password.value = storedPassword
    handleLogin()
  }
})

// 监听认证状态，登录成功后自动查询数据
watch(isAuthenticated, async (newVal) => {
  if (newVal) {
    // 延迟一点时间确保页面渲染完成
    setTimeout(() => {
      queryBalance()
      queryTokenUsage()
    }, 100)
  }
})

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
      currentHunyuanKey.value = res.data.data?.hunyuan_api_key || ''
      modelStrategy.value = (res.data.data?.model_strategy as 'deepseek' | 'hunyuan' | 'dynamic') || 'dynamic'
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
  currentHunyuanKey.value = ''
  oldPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
  modelStrategy.value = 'dynamic'
  balanceInfo.value = null
  tokenUsageData.value = null
  clearAllMessages()
}

// 更新 DeepSeek API 密钥
const handleUpdateApiKey = async (key: string, callback: (error?: Error) => void) => {
  const storedPassword = getStoredPassword()
  if (!storedPassword) {
    callback(new Error('登录已过期，请重新登录'))
    return
  }

  try {
    const res = await updateApiKey(storedPassword, key)

    if (res.data.code === 0) {
      // 更新成功后，重新获取掩码版本的密钥
      const keyRes = await getApiKey(storedPassword)
      if (keyRes.data.code === 0) {
        currentApiKey.value = keyRes.data.data?.api_key || ''
      }
      callback()
    } else {
      callback(new Error(res.data.msg || '更新失败'))
    }
  } catch (error: any) {
    // 处理 Axios 错误，提取后端返回的错误信息
    if (error.response?.data?.msg) {
      callback(new Error(error.response.data.msg))
    } else if (error.response?.data?.message) {
      callback(new Error(error.response.data.message))
    } else if (error.message) {
      callback(new Error(error.message))
    } else {
      callback(new Error('更新失败，请检查网络连接'))
    }
  }
}

// 更新 Hunyuan API 密钥
const handleUpdateHunyuanKey = async (key: string, callback: (error?: Error) => void) => {
  const storedPassword = getStoredPassword()
  if (!storedPassword) {
    callback(new Error('登录已过期，请重新登录'))
    return
  }

  try {
    const res = await updateHunyuanApiKey(storedPassword, key)

    if (res.data.code === 0) {
      // 更新成功后，重新获取掩码版本的密钥
      const keyRes = await getApiKey(storedPassword)
      if (keyRes.data.code === 0) {
        currentHunyuanKey.value = keyRes.data.data?.hunyuan_api_key || ''
      }
      callback()
    } else {
      callback(new Error(res.data.msg || '更新失败'))
    }
  } catch (error: any) {
    // 处理 Axios 错误，提取后端返回的错误信息
    if (error.response?.data?.msg) {
      callback(new Error(error.response.data.msg))
    } else if (error.response?.data?.message) {
      callback(new Error(error.response.data.message))
    } else if (error.message) {
      callback(new Error(error.message))
    } else {
      callback(new Error('更新失败，请检查网络连接'))
    }
  }
}

// 更新模型策略
const handleUpdateModelStrategy = async (
  value: 'deepseek' | 'hunyuan' | 'dynamic',
  callback: (error?: Error) => void
) => {
  try {
    const storedPassword = getStoredPassword()
    if (!storedPassword) {
      isAuthenticated.value = false
      callback(new Error('登录已过期，请重新登录'))
      return
    }

    const res = await updateModelStrategy(storedPassword, value)

    if (res.data.code === 0) {
      callback()
    } else {
      callback(new Error(res.data.msg || '更新失败'))
    }
  } catch (error: any) {
    if (error.response?.data?.msg) {
      callback(new Error(error.response.data.msg))
    } else if (error.response?.data?.message) {
      callback(new Error(error.response.data.message))
    } else if (error.message) {
      callback(new Error(`更新失败: ${error.message}`))
    } else {
      callback(new Error('更新失败，请检查网络连接'))
    }
    console.error('更新模型策略失败:', error)
  }
}

// 修改管理员密码
const handleUpdatePassword = async () => {
  if (!oldPassword.value || !newPassword.value || !confirmPassword.value) {
    showPasswordError('请填写所有字段')
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    showPasswordError('两次输入的新密码不一致')
    return
  }

  isUpdatingPassword.value = true
  passwordErrorMsg.value = ''
  passwordSuccessMsg.value = ''

  try {
    const res = await updateAdminPassword(oldPassword.value, newPassword.value)

    if (res.data.code === 0) {
      storePassword(newPassword.value)
      oldPassword.value = ''
      newPassword.value = ''
      confirmPassword.value = ''
      showPasswordSuccess('密码修改成功')
    } else {
      showPasswordError(res.data.msg || '修改失败')
    }
  } catch (error: any) {
    // 处理 Axios 错误，提取后端返回的错误信息
    if (error.response?.data?.msg) {
      showPasswordError(error.response.data.msg)
    } else if (error.response?.data?.message) {
      showPasswordError(error.response.data.message)
    } else if (error.message) {
      showPasswordError(`修改失败: ${error.message}`)
    } else {
      showPasswordError('修改失败，请检查网络连接')
    }
    console.error('修改密码失败:', error)
  } finally {
    isUpdatingPassword.value = false
  }
}

// 查询余额（通过后端代理）
const queryBalance = async () => {
  isQueryingBalance.value = true
  balanceError.value = ''

  try {
    const result = await queryDeepSeekBalance()
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

// 查询 Token 用量
const queryTokenUsage = async () => {
  isQueryingTokenUsage.value = true
  tokenUsageError.value = ''

  try {
    const result = await getTokenUsage()
    if (result) {
      tokenUsageData.value = result
    } else {
      tokenUsageError.value = '获取 Token 用量失败'
    }
  } catch (error) {
    tokenUsageError.value = '获取 Token 用量失败，请检查网络连接'
    console.error('获取 Token 用量失败:', error)
  } finally {
    isQueryingTokenUsage.value = false
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
