<template>
  <div class="api-test-center">
    <header class="test-header">
      <h1 class="text-3xl font-bold text-gray-900">API连接测试</h1>
      <p class="text-gray-600 mt-2">测试前后端API连接状态和各功能模块</p>
    </header>

    <!-- API状态概览 -->
    <section class="status-overview">
      <div class="status-card">
        <div class="status-icon" :class="overallStatus">
          <Icon :icon="getOverallStatusIcon()" class="w-6 h-6" />
        </div>
        <div class="status-content">
          <h3 class="status-title">整体状态</h3>
          <p class="status-text">{{ getOverallStatusText() }}</p>
        </div>
      </div>
    </section>

    <!-- API测试列表 -->
    <main class="api-tests-grid">
      <!-- 基础连接测试 -->
      <div class="test-section">
        <h2 class="section-title">基础连接测试</h2>
        <div class="test-card">
          <div class="test-header">
            <h3>服务器连接</h3>
            <button @click="testConnection" :disabled="commonLoading" class="test-btn">
              <Icon
                v-if="commonLoading"
                icon="lucide:loader-2"
                class="w-4 h-4 animate-spin"
              />
              <Icon v-else icon="lucide:play" class="w-4 h-4" />
              测试连接
            </button>
          </div>
          <div
            v-if="connectionResult"
            class="test-result"
            :class="connectionResult.success ? 'success' : 'error'"
          >
            <p>{{ connectionResult.message }}</p>
            <pre v-if="connectionResult.data">{{
              JSON.stringify(connectionResult.data, null, 2)
            }}</pre>
          </div>
        </div>
      </div>

      <!-- LL1分析测试 -->
      <div class="test-section">
        <h2 class="section-title">LL1语法分析</h2>
        <div class="test-card">
          <div class="test-header">
            <h3>LL1分析测试</h3>
            <button @click="testLL1" :disabled="ll1Loading" class="test-btn">
              <Icon
                v-if="ll1Loading"
                icon="lucide:loader-2"
                class="w-4 h-4 animate-spin"
              />
              <Icon v-else icon="lucide:play" class="w-4 h-4" />
              测试LL1
            </button>
          </div>
          <div class="test-input">
            <textarea
              v-model="ll1Productions"
              placeholder="输入产生式，每行一个"
              class="input-textarea"
            ></textarea>
          </div>
          <div
            v-if="ll1Result"
            class="test-result"
            :class="ll1Result.success ? 'success' : 'error'"
          >
            <p>{{ ll1Result.message }}</p>
            <details v-if="ll1Result.data">
              <summary>查看详细结果</summary>
              <pre>{{ JSON.stringify(ll1Result.data, null, 2) }}</pre>
            </details>
          </div>
        </div>
      </div>

      <!-- LR0分析测试 -->
      <div class="test-section">
        <h2 class="section-title">LR0语法分析</h2>
        <div class="test-card">
          <div class="test-header">
            <h3>LR0分析测试</h3>
            <button @click="testLR0" :disabled="lr0Loading" class="test-btn">
              <Icon
                v-if="lr0Loading"
                icon="lucide:loader-2"
                class="w-4 h-4 animate-spin"
              />
              <Icon v-else icon="lucide:play" class="w-4 h-4" />
              测试LR0
            </button>
          </div>
          <div class="test-input">
            <textarea
              v-model="lr0Productions"
              placeholder="输入产生式，每行一个"
              class="input-textarea"
            ></textarea>
          </div>
          <div
            v-if="lr0Result"
            class="test-result"
            :class="lr0Result.success ? 'success' : 'error'"
          >
            <p>{{ lr0Result.message }}</p>
            <details v-if="lr0Result.data">
              <summary>查看详细结果</summary>
              <pre>{{ JSON.stringify(lr0Result.data, null, 2) }}</pre>
            </details>
          </div>
        </div>
      </div>

      <!-- SLR1分析测试 -->
      <div class="test-section">
        <h2 class="section-title">SLR1语法分析</h2>
        <div class="test-card">
          <div class="test-header">
            <h3>SLR1分析测试</h3>
            <button @click="testSLR1" :disabled="slr1Loading" class="test-btn">
              <Icon
                v-if="slr1Loading"
                icon="lucide:loader-2"
                class="w-4 h-4 animate-spin"
              />
              <Icon v-else icon="lucide:play" class="w-4 h-4" />
              测试SLR1
            </button>
          </div>
          <div class="test-input">
            <textarea
              v-model="slr1Productions"
              placeholder="输入产生式，每行一个"
              class="input-textarea"
            ></textarea>
          </div>
          <div
            v-if="slr1Result"
            class="test-result"
            :class="slr1Result.success ? 'success' : 'error'"
          >
            <p>{{ slr1Result.message }}</p>
            <details v-if="slr1Result.data">
              <summary>查看详细结果</summary>
              <pre>{{ JSON.stringify(slr1Result.data, null, 2) }}</pre>
            </details>
          </div>
        </div>
      </div>

      <!-- 有限自动机测试 -->
      <div class="test-section">
        <h2 class="section-title">有限自动机</h2>
        <div class="test-card">
          <div class="test-header">
            <h3>正则表达式转DFAM</h3>
            <button @click="testFA" :disabled="faLoading" class="test-btn">
              <Icon
                v-if="faLoading"
                icon="lucide:loader-2"
                class="w-4 h-4 animate-spin"
              />
              <Icon v-else icon="lucide:play" class="w-4 h-4" />
              测试FA
            </button>
          </div>
          <div class="test-input">
            <input
              v-model="regexInput"
              placeholder="输入正则表达式，如：(a|b)*abb"
              class="input-field"
            />
          </div>
          <div v-if="faResult" class="test-result" :class="faResult.success ? 'success' : 'error'">
            <p>{{ faResult.message }}</p>
            <details v-if="faResult.data">
              <summary>查看详细结果</summary>
              <pre>{{ JSON.stringify(faResult.data, null, 2) }}</pre>
            </details>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import {
  testAPI,
  getLL1AnalyseAPI,
  getLR0AnalyseAPI,
  getSLR1AnalyseAPI,
  getDFAM,
} from '@/api'

// 加载状态
const commonLoading = ref(false)
const ll1Loading = ref(false)
const lr0Loading = ref(false)
const slr1Loading = ref(false)
const faLoading = ref(false)

// 测试输入
const ll1Productions = ref('E -> E + T | T\nT -> T * F | F\nF -> ( E ) | i')
const lr0Productions = ref('E -> E + T | T\nT -> T * F | F\nF -> ( E ) | i')
const slr1Productions = ref('E -> E + T | T\nT -> T * F | F\nF -> ( E ) | i')
const regexInput = ref('(a|b)*abb')

// 测试结果
const connectionResult = ref<any>(null)
const ll1Result = ref<any>(null)
const lr0Result = ref<any>(null)
const slr1Result = ref<any>(null)
const faResult = ref<any>(null)

// 整体状态计算
const overallStatus = computed(() => {
  const results = [
    connectionResult.value,
    ll1Result.value,
    lr0Result.value,
    slr1Result.value,
    faResult.value,
  ]
  const hasError = results.some((r) => r && !r.success)
  const hasSuccess = results.some((r) => r && r.success)

  if (hasError) return 'error'
  if (hasSuccess) return 'success'
  return 'pending'
})

// 测试函数
const testConnection = async () => {
  commonLoading.value = true
  try {
    const result = await testAPI()
    connectionResult.value = {
      success: true,
      message: '服务器连接成功',
      data: result,
    }
  } catch (error: any) {
    connectionResult.value = {
      success: false,
      message: `连接失败: ${error.message}`,
      data: null,
    }
  } finally {
    commonLoading.value = false
  }
}

const testLL1 = async () => {
  ll1Loading.value = true
  try {
    const productions = ll1Productions.value.split('\n').filter((p) => p.trim())
    const result = await getLL1AnalyseAPI(productions)
    ll1Result.value = {
      success: true,
      message: 'LL1分析成功',
      data: result.data,
    }
  } catch (error: any) {
    ll1Result.value = {
      success: false,
      message: `LL1分析失败: ${error.message}`,
      data: null,
    }
  } finally {
    ll1Loading.value = false
  }
}

const testLR0 = async () => {
  lr0Loading.value = true
  try {
    const productions = lr0Productions.value.split('\n').filter((p) => p.trim())
    const result = await getLR0AnalyseAPI(productions)
    lr0Result.value = {
      success: true,
      message: 'LR0分析成功',
      data: result.data,
    }
  } catch (error: any) {
    lr0Result.value = {
      success: false,
      message: `LR0分析失败: ${error.message}`,
      data: null,
    }
  } finally {
    lr0Loading.value = false
  }
}

const testSLR1 = async () => {
  slr1Loading.value = true
  try {
    const productions = slr1Productions.value.split('\n').filter((p) => p.trim())
    const result = await getSLR1AnalyseAPI(productions)
    slr1Result.value = {
      success: true,
      message: 'SLR1分析成功',
      data: result.data,
    }
  } catch (error: any) {
    slr1Result.value = {
      success: false,
      message: `SLR1分析失败: ${error.message}`,
      data: null,
    }
  } finally {
    slr1Loading.value = false
  }
}

const testFA = async () => {
  faLoading.value = true
  try {
    const result = await getDFAM(regexInput.value)
    faResult.value = {
      success: true,
      message: '有限自动机分析成功',
      data: result.data,
    }
  } catch (error: any) {
    faResult.value = {
      success: false,
      message: `有限自动机分析失败: ${error.message}`,
      data: null,
    }
  } finally {
    faLoading.value = false
  }
}

// 状态辅助函数
const getOverallStatusIcon = () => {
  switch (overallStatus.value) {
    case 'success':
      return 'lucide:check-circle'
    case 'error':
      return 'lucide:x-circle'
    default:
      return 'lucide:clock'
  }
}

const getOverallStatusText = () => {
  switch (overallStatus.value) {
    case 'success':
      return 'API连接正常'
    case 'error':
      return '部分API连接异常'
    default:
      return '等待测试'
  }
}
</script>

<style scoped>
.api-test-center {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 2rem;
}

.test-header {
  text-align: center;
  color: #1e293b;
  margin-bottom: 2rem;
}

.status-overview {
  margin-bottom: 2rem;
}

.status-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.status-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-icon.success {
  background: #d1fae5;
  color: #065f46;
}
.status-icon.error {
  background: #fee2e2;
  color: #dc2626;
}
.status-icon.pending {
  background: #fef3c7;
  color: #d97706;
}

.status-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.25rem;
}

.status-text {
  color: #6b7280;
  font-size: 0.875rem;
}

.api-tests-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.test-section {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.section-title {
  background: #f9fafb;
  padding: 1rem 1.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  border-bottom: 1px solid #e5e7eb;
  margin: 0;
}

.test-card {
  padding: 1.5rem;
}

.test-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.test-header h3 {
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.test-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #374151;
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.test-btn:hover:not(:disabled) {
  background: #4b5563;
}

.test-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.test-input {
  margin-bottom: 1rem;
}

.input-textarea {
  width: 100%;
  min-height: 80px;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  resize: vertical;
}

.input-field {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.test-result {
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid;
}

.test-result.success {
  background: #f0fdf4;
  border-color: #bbf7d0;
  color: #166534;
}

.test-result.error {
  background: #fef2f2;
  border-color: #fecaca;
  color: #dc2626;
}

.test-result pre {
  background: rgba(0, 0, 0, 0.05);
  padding: 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  margin-top: 0.5rem;
  overflow-x: auto;
}

.test-result details {
  margin-top: 0.5rem;
}

.test-result summary {
  cursor: pointer;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
