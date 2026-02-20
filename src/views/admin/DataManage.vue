<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- 标题 -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-slate-800 mb-2">统计数据管理</h1>
        <p class="text-slate-500">管理学习统计数据的导出、恢复和清理</p>
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
        <!-- 数据库状态概览 -->
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Icon icon="lucide:database" class="w-5 h-5 text-blue-600" />
              </div>
              <h2 class="text-lg font-semibold text-slate-800">数据库状态</h2>
            </div>
            <button
              @click="fetchDbStatus"
              :disabled="isLoadingStatus"
              class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Icon v-if="isLoadingStatus" icon="lucide:loader-2" class="w-4 h-4 animate-spin" />
              <Icon v-else icon="lucide:refresh-cw" class="w-4 h-4" />
              <span>刷新</span>
            </button>
          </div>
          
          <div v-if="dbStatus" class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-slate-50 rounded-lg p-4 text-center">
              <div class="text-2xl font-bold text-blue-600">{{ dbStatus.total_records }}</div>
              <div class="text-sm text-slate-500">总记录数</div>
            </div>
            <div class="bg-slate-50 rounded-lg p-4 text-center">
              <div class="text-2xl font-bold text-green-600">{{ dbStatus.min_date || '-' }}</div>
              <div class="text-sm text-slate-500">最早记录</div>
            </div>
            <div class="bg-slate-50 rounded-lg p-4 text-center">
              <div class="text-2xl font-bold text-orange-600">{{ dbStatus.max_date || '-' }}</div>
              <div class="text-sm text-slate-500">最晚记录</div>
            </div>
            <div class="bg-slate-50 rounded-lg p-4 text-center">
              <div class="text-2xl font-bold text-purple-600">{{ dbStatus.module_counts?.length || 0 }}</div>
              <div class="text-sm text-slate-500">模块数</div>
            </div>
          </div>
          
          <div v-if="dbStatus?.module_counts?.length" class="mt-4">
            <h3 class="text-sm font-medium text-slate-700 mb-2">各模块记录数</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="item in dbStatus.module_counts"
                :key="item.module"
                class="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
              >
                {{ item.module.toUpperCase() }}: {{ item.count }}
              </span>
            </div>
          </div>
        </div>

        <!-- 数据导出 -->
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <Icon icon="lucide:download" class="w-5 h-5 text-green-600" />
            </div>
            <h2 class="text-lg font-semibold text-slate-800">数据导出/备份</h2>
          </div>
          
          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">开始日期</label>
                <input
                  v-model="exportForm.start_date"
                  type="date"
                  class="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">结束日期</label>
                <input
                  v-model="exportForm.end_date"
                  type="date"
                  class="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">模块（可选）</label>
                <select
                  v-model="exportForm.module"
                  class="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="">全部模块</option>
                  <option value="fa">FA</option>
                  <option value="ll1">LL1</option>
                  <option value="lr0">LR0</option>
                  <option value="slr1">SLR1</option>
                </select>
              </div>
            </div>
            
            <div class="flex gap-3">
              <button
                @click="exportData"
                :disabled="isExporting"
                class="flex-1 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-slate-300 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Icon v-if="isExporting" icon="lucide:loader-2" class="w-4 h-4 animate-spin" />
                <Icon v-else icon="lucide:download" class="w-4 h-4" />
                <span>{{ isExporting ? '导出中...' : '导出 SQL 文件' }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 数据恢复 -->
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <Icon icon="lucide:upload" class="w-5 h-5 text-purple-600" />
            </div>
            <h2 class="text-lg font-semibold text-slate-800">数据恢复</h2>
          </div>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">选择 SQL 备份文件</label>
              <input
                ref="fileInput"
                type="file"
                accept=".sql"
                @change="handleFileChange"
                class="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            
            <div v-if="importFileName" class="p-3 bg-blue-50 rounded-lg">
              <p class="text-sm text-blue-700 flex items-center gap-2">
                <Icon icon="lucide:file-text" class="w-4 h-4" />
                已选择: {{ importFileName }}
              </p>
            </div>
            
            <button
              @click="importData"
              :disabled="isImporting || !importSqlContent"
              class="w-full py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Icon v-if="isImporting" icon="lucide:loader-2" class="w-4 h-4 animate-spin" />
              <Icon v-else icon="lucide:upload" class="w-4 h-4" />
              <span>{{ isImporting ? '恢复中...' : '恢复数据' }}</span>
            </button>

            <!-- 恢复结果提示 -->
            <div v-if="importResult" class="p-4 rounded-lg" :class="importResult.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'">
              <p class="flex items-center gap-2" :class="importResult.type === 'success' ? 'text-green-700' : 'text-red-700'">
                <Icon :icon="importResult.type === 'success' ? 'lucide:check-circle' : 'lucide:alert-circle'" class="w-5 h-5" />
                {{ importResult.message }}
              </p>
            </div>
          </div>
        </div>

        <!-- 数据清理 -->
        <div class="bg-white rounded-2xl shadow-lg p-6 border-2 border-red-100">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <Icon icon="lucide:trash-2" class="w-5 h-5 text-red-600" />
            </div>
            <h2 class="text-lg font-semibold text-slate-800">数据清理</h2>
          </div>
          
          <div class="space-y-6">
            <!-- 清空所有数据 -->
            <div class="p-4 bg-red-50 rounded-lg border border-red-200">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-medium text-red-800">清空所有统计数据</h3>
                  <p class="text-sm text-red-600 mt-1">此操作将删除所有模块的所有记录，不可恢复！</p>
                </div>
                <button
                  @click="confirmClearAll"
                  class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Icon icon="lucide:trash-2" class="w-4 h-4" />
                  <span>清空全部</span>
                </button>
              </div>
            </div>

            <!-- 按模块删除 -->
            <div class="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h3 class="font-medium text-orange-800 mb-3">删除指定模块数据</h3>
              <div class="flex gap-3">
                <select
                  v-model="deleteModuleForm.module"
                  class="flex-1 px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                >
                  <option value="">选择模块</option>
                  <option value="fa">FA</option>
                  <option value="ll1">LL1</option>
                  <option value="lr0">LR0</option>
                  <option value="slr1">SLR1</option>
                </select>
                <button
                  @click="confirmDeleteModule"
                  :disabled="!deleteModuleForm.module"
                  class="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-slate-300 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Icon icon="lucide:trash" class="w-4 h-4" />
                  <span>删除</span>
                </button>
              </div>
            </div>

            <!-- 按日期范围删除 -->
            <div class="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <h3 class="font-medium text-amber-800 mb-3">删除指定日期范围数据</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  v-model="deleteDateForm.start_date"
                  type="date"
                  placeholder="开始日期"
                  class="px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                />
                <input
                  v-model="deleteDateForm.end_date"
                  type="date"
                  placeholder="结束日期"
                  class="px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                />
                <button
                  @click="confirmDeleteByDate"
                  :disabled="!deleteDateForm.start_date || !deleteDateForm.end_date"
                  class="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-300 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Icon icon="lucide:calendar-x" class="w-4 h-4" />
                  <span>删除</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import axios from 'axios'
import { utcToLocalDate, localDateToUTC, formatDateToLocalString } from '@/utils/timezone'

// 认证状态
const isAuthenticated = ref(false)
const password = ref('')
const isLoading = ref(false)
const errorMsg = ref('')

// 数据库状态
const dbStatus = ref<any>(null)
const isLoadingStatus = ref(false)

// 导出表单
const exportForm = ref({
  start_date: '',
  end_date: '',
  module: ''
})
const isExporting = ref(false)

// 导入
const fileInput = ref<HTMLInputElement | null>(null)
const importFileName = ref('')
const importSqlContent = ref('')
const isImporting = ref(false)

// 删除表单
const deleteModuleForm = ref({
  module: ''
})
const deleteDateForm = ref({
  start_date: '',
  end_date: ''
})

// 恢复结果（单独显示在数据恢复容器下方）
const importResult = ref<{ type: 'success' | 'error'; message: string } | null>(null)

// API 基础地址
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

// 登录验证
const handleLogin = async () => {
  if (!password.value) return
  
  isLoading.value = true
  errorMsg.value = ''
  
  try {
    // 调用验证密码 API
    const response = await axios.post(`${API_BASE}/api/admin/verify-password`, {
      password: password.value
    })
    
    if (response.data.code === 0) {
      isAuthenticated.value = true
      // 保存密码用于后续操作
      localStorage.setItem('admin_password', password.value)
      fetchDbStatus()
    } else {
      errorMsg.value = response.data.msg || '密码错误'
    }
  } catch (error: any) {
    errorMsg.value = error.response?.data?.msg || '验证失败，请检查网络连接'
  } finally {
    isLoading.value = false
  }
}

// 获取数据库状态
const fetchDbStatus = async () => {
  isLoadingStatus.value = true
  try {
    const response = await axios.get(`${API_BASE}/api/stats/debug/db-status`)
    if (response.data.code === 0) {
      // 将 UTC 时间转换为本地日期显示（只显示日期，不显示时间）
      const data = response.data.data
      dbStatus.value = {
        ...data,
        min_date: data.min_date ? utcToLocalDate(data.min_date) : '-',
        max_date: data.max_date ? utcToLocalDate(data.max_date) : '-'
      }
    }
  } catch (error) {
    showResult('error', '获取数据库状态失败')
  } finally {
    isLoadingStatus.value = false
  }
}



// 导出数据
const exportData = async () => {
  isExporting.value = true
  try {
    const params = new URLSearchParams()
    // 将本地日期转换为 UTC 日期进行查询
    if (exportForm.value.start_date) params.append('start_date', localDateToUTC(exportForm.value.start_date))
    if (exportForm.value.end_date) params.append('end_date', localDateToUTC(exportForm.value.end_date))
    if (exportForm.value.module) params.append('module', exportForm.value.module)

    const response = await axios.get(`${API_BASE}/api/stats/export?${params}`)

    if (response.data.code === 0) {
      const sql = response.data.data.sql
      const blob = new Blob([sql], { type: 'text/sql' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url

      // 生成文件名（使用本地时间）
      const date = formatDateToLocalString(new Date())
      const module = exportForm.value.module || 'all'
      link.download = `stats_backup_${module}_${date}.sql`
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      showResult('success', `成功导出 ${response.data.data.count} 条记录`)
    } else {
      showResult('error', response.data.msg)
    }
  } catch (error: any) {
    showResult('error', error.response?.data?.msg || '导出失败')
  } finally {
    isExporting.value = false
  }
}

// 处理文件选择
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    importFileName.value = file.name
    const reader = new FileReader()
    reader.onload = (e) => {
      importSqlContent.value = e.target?.result as string
    }
    reader.readAsText(file)
  }
}

// 导入数据
const importData = async () => {
  if (!importSqlContent.value) return

  isImporting.value = true
  importResult.value = null
  try {
    const response = await axios.post(`${API_BASE}/api/stats/import`, {
      sql_content: importSqlContent.value
    })

    if (response.data.code === 0) {
      const data = response.data.data
      const successCount = data?.success_count || 0
      const failCount = data?.fail_count || 0
      importResult.value = {
        type: 'success',
        message: `数据恢复完成: 成功 ${successCount} 条, 失败 ${failCount} 条`
      }
      // 清空文件选择
      importFileName.value = ''
      importSqlContent.value = ''
      if (fileInput.value) fileInput.value.value = ''
      // 刷新状态
      fetchDbStatus()
    } else {
      importResult.value = {
        type: 'error',
        message: response.data.msg || '恢复失败'
      }
    }
  } catch (error: any) {
    importResult.value = {
      type: 'error',
      message: error.response?.data?.msg || '恢复失败'
    }
  } finally {
    isImporting.value = false
    // 5秒后自动隐藏结果
    setTimeout(() => {
      importResult.value = null
    }, 5000)
  }
}

// 确认清空所有数据
const confirmClearAll = () => {
  if (confirm('确定要清空所有统计数据吗？此操作不可恢复！')) {
    clearAllData()
  }
}

// 清空所有数据
const clearAllData = async () => {
  try {
    const response = await axios.post(`${API_BASE}/api/stats/clear`)
    if (response.data.code === 0) {
      showResult('success', response.data.msg)
      fetchDbStatus()
    } else {
      showResult('error', response.data.msg)
    }
  } catch (error: any) {
    showResult('error', error.response?.data?.msg || '清空失败')
  }
}

// 确认删除模块数据
const confirmDeleteModule = () => {
  if (!deleteModuleForm.value.module) return
  if (confirm(`确定要删除 ${deleteModuleForm.value.module.toUpperCase()} 模块的所有数据吗？`)) {
    deleteModuleData()
  }
}

// 删除模块数据
const deleteModuleData = async () => {
  try {
    const response = await axios.post(`${API_BASE}/api/stats/delete/${deleteModuleForm.value.module}`)
    if (response.data.code === 0) {
      showResult('success', response.data.msg)
      deleteModuleForm.value.module = ''
      fetchDbStatus()
    } else {
      showResult('error', response.data.msg)
    }
  } catch (error: any) {
    showResult('error', error.response?.data?.msg || '删除失败')
  }
}

// 确认按日期删除
const confirmDeleteByDate = () => {
  if (!deleteDateForm.value.start_date || !deleteDateForm.value.end_date) return
  if (confirm(`确定要删除 ${deleteDateForm.value.start_date} 至 ${deleteDateForm.value.end_date} 的数据吗？`)) {
    deleteByDate()
  }
}

// 按日期删除
const deleteByDate = async () => {
  try {
    // 将本地日期转换为 UTC 日期进行删除
    const response = await axios.post(`${API_BASE}/api/stats/delete/by-date`, {
      start_date: localDateToUTC(deleteDateForm.value.start_date),
      end_date: localDateToUTC(deleteDateForm.value.end_date)
    })
    if (response.data.code === 0) {
      showResult('success', response.data.msg)
      deleteDateForm.value.start_date = ''
      deleteDateForm.value.end_date = ''
      fetchDbStatus()
    } else {
      showResult('error', response.data.msg)
    }
  } catch (error: any) {
    showResult('error', error.response?.data?.msg || '删除失败')
  }
}

// 显示操作结果（使用 alert）
const showResult = (type: 'success' | 'error', message: string) => {
  if (type === 'success') {
    alert('✓ ' + message)
  } else {
    alert('✗ ' + message)
  }
}

// 检查本地存储的密码
onMounted(() => {
  const savedPassword = localStorage.getItem('admin_password')
  if (savedPassword) {
    password.value = savedPassword
    handleLogin()
  }
})
</script>

<style scoped>
/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
