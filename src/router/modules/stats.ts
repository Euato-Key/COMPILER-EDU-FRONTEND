import type { RouteRecordRaw } from 'vue-router'

const statsRoutes: RouteRecordRaw[] = [
  {
    path: '/stats',
    name: 'stats',
    component: () => import('../../views/stats/StatsView.vue'),
    meta: {
      title: '学习统计',
      description: '查看各模块答题错误统计分析'
    }
  }
]

export default statsRoutes
