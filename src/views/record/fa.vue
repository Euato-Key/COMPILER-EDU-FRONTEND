<template>
  <div class="fa-record-page min-h-screen theme-main-bg theme-transition">
    <!-- 头部导航 -->
    <header class="theme-header-bg backdrop-blur-sm border-b sticky top-0 z-50 theme-transition">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <router-link
              to="/"
              class="text-2xl font-bold theme-header-text hover:opacity-80 transition-colors"
            >
              编译原理可视化
            </router-link>
            <span class="text-gray-400">|</span>
            <router-link to="/record" class="text-xl font-semibold text-gray-600 hover:text-gray-800">答题记录</router-link>
            <span class="text-gray-400">|</span>
            <h1 class="text-xl font-semibold text-gray-800">有限自动机 (FA)</h1>
          </div>
          <div class="flex items-center gap-2">
            <ThemeSelector />
            <router-link
              to="/"
              class="px-3 py-2 theme-header-text hover:opacity-80 transition-colors"
            >
              首页
            </router-link>
            <router-link
              to="/fa"
              class="px-3 py-2 theme-header-text hover:opacity-80 transition-colors font-bold text-blue-600"
            >
              去答题
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 py-8 pt-24">
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-4">
          <router-link to="/record" class="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <Icon icon="lucide:arrow-left" class="w-6 h-6" />
          </router-link>
          <div>
            <h1 class="text-3xl font-bold theme-content-text">FA 历史记录</h1>
            <p class="text-gray-500 text-sm mt-1">系统会自动为您保存最近 50 条验证过的正则表达式及答题进度</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button
            v-if="faStore.historyList.length > 0"
            @click="handleClearAll"
            class="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-600 hover:text-white transition-all flex items-center gap-2"
            :disabled="commonStore.loading"
          >
            <Icon icon="lucide:trash-2" class="w-4 h-4" />
            清空所有
          </button>
        </div>
      </div>

      <!-- 消息提示区域 -->
      <TransitionGroup name="fade">
        <div v-if="commonStore.error" key="err" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
          <div class="flex items-start gap-3">
            <Icon icon="lucide:alert-circle" class="w-5 h-5 text-red-500 mt-0.5" />
            <p class="text-red-700 text-sm">{{ commonStore.error }}</p>
          </div>
          <button @click="commonStore.clearError()"><Icon icon="lucide:x" class="w-4 h-4 text-red-400" /></button>
        </div>

        <div v-if="commonStore.success" key="succ" class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
          <div class="flex items-start gap-3">
            <Icon icon="lucide:check-circle" class="w-5 h-5 text-green-500 mt-0.5" />
            <p class="text-green-700 text-sm">{{ commonStore.success }}</p>
          </div>
          <button @click="commonStore.clearSuccess()"><Icon icon="lucide:x" class="w-4 h-4 text-green-400" /></button>
        </div>
      </TransitionGroup>
      
      <!-- 历史记录表格 -->
      <div v-if="faStore.historyList.length > 0" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200">
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">序号</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">记录 ID</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">正则表达式</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">创建时间</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">最后修改</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-center">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="(record, index) in faStore.historyList" :key="record.id" class="hover:bg-blue-50/30 transition-colors group">
              <td class="px-6 py-4 text-sm text-gray-400">{{ index + 1 }}</td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 bg-gray-100 rounded text-xs font-mono text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                  {{ record.id }}
                </span>
              </td>
              <td class="px-6 py-4">
                <code class="text-sm font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded">{{ record.regex }}</code>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ formatDate(record.createdAt) }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ formatDate(record.timestamp) }}
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center justify-center gap-2">
                  <button
                    @click="handleRestore(record.id)"
                    class="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm flex items-center gap-1.5 shadow-sm active:scale-95"
                    :disabled="commonStore.loading"
                  >
                    <Icon v-if="!commonStore.loading" icon="lucide:rotate-ccw" class="w-4 h-4" />
                    <Icon v-else icon="lucide:loader-2" class="w-4 h-4 animate-spin" />
                    恢复
                  </button>
                  <button
                    @click="handleViewReport(record.id)"
                    class="px-4 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-sm flex items-center gap-1.5 shadow-sm active:scale-95"
                    :disabled="commonStore.loading"
                  >
                    <Icon v-if="!commonStore.loading" icon="lucide:file-text" class="w-4 h-4" />
                    <Icon v-else icon="lucide:loader-2" class="w-4 h-4 animate-spin" />
                    查看报告
                  </button>
                  <button
                    @click="handleDelete(record.id)"
                    class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                    title="删除"
                    :disabled="commonStore.loading"
                  >
                    <Icon icon="lucide:trash-2" class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- 空状态 -->
      <div v-else class="bg-white rounded-xl shadow-lg p-20 text-center border border-dashed border-gray-300">
        <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon icon="lucide:clipboard-list" class="w-10 h-10 text-gray-300" />
        </div>
        <h2 class="text-xl font-bold text-gray-900 mb-2">暂无答题记录</h2>
        <p class="text-gray-500 mb-8 max-w-xs mx-auto">您还没有进行过正则表达式分析，或者记录已被清空。</p>
        <router-link
          to="/fa"
          class="inline-flex items-center px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg active:scale-95"
        >
          立即前往开始答题
          <Icon icon="lucide:chevron-right" class="w-5 h-5 ml-1" />
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import ThemeSelector from '@/components/shared/ThemeSelector.vue'
import { useFAStoreNew, useCommonStore } from '@/stores'

const router = useRouter()
const faStore = useFAStoreNew()
const commonStore = useCommonStore()

// 1. 清空所有
const handleClearAll = async () => {
  if (confirm('确定要清空所有记录吗？此操作不可恢复。')) {
    faStore.clearAllHistory()
    await faStore.persistence.save()
    commonStore.setSuccess('所有记录已清除')
  }
}

// 2. 删除单条
const handleDelete = async (recordId: string) => {
  faStore.deleteHistoryRecord(recordId)
  await faStore.persistence.save()
  commonStore.setSuccess('该记录已删除')
}

// 3. 核心恢复逻辑
const handleRestore = async (recordId: string) => {
  try {
    commonStore.setLoading(true)
    commonStore.clearError()
    
    // 执行 Store 中的复现逻辑：
    // a. 设置 ID 和 Regex
    // b. 带着 Regex 请求后端拿图
    // c. 成功后覆盖用户填写的答案数据
    const success = await faStore.restoreFromHistory(recordId)
    
    if (success) {
      // 关键：强制立刻将“恢复后”的状态写入 LocalStorage
      // 防止路由跳转瞬间数据没存稳
      await faStore.persistence.save()
      
      commonStore.setSuccess(`记录 ${recordId} 已成功恢复，正在跳转...`)
      
      // 使用 Vue Router 跳转，平滑且保留状态
      setTimeout(() => {
        router.push('/fa')
      }, 800)
    }
  } catch (error) {
    commonStore.setError('恢复过程中发生异常，请重试')
    console.error('[Record-FA] Restore Error:', error)
  } finally {
    commonStore.setLoading(false)
  }
}

// 4. 查看报告
const handleViewReport = (recordId: string) => {
  router.push(`/report/fa/${recordId}`)
}

// 5. 时间格式化
const formatDate = (timestamp: string) => {
  if (!timestamp) return '-'
  try {
    let date = new Date(timestamp)
    
    if (isNaN(date.getTime())) {
      const regex = /^(\d{1,2})\/(\d{1,2})\/(\d{4}),\s*(\d{1,2}):(\d{1,2}):(\d{1,2})$/;
      const match = timestamp.match(regex);
      
      if (match) {
        const [, day, month, year, hours, minutes, seconds] = match;
        date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes), parseInt(seconds));
      } else {
        return timestamp
      }
    }
    
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  } catch (e) {
    return timestamp
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>