import type { RouteRecordRaw } from 'vue-router'

const staticsRoutes: RouteRecordRaw[] = [
  {
    path: '/statics',
    name: 'statics',
    component: () => import('../../views/statics/StaticsView.vue'),
    meta: {
      title: '学习统计',
      description: '查看所有用户的学习错误统计'
    }
  }
]

export default staticsRoutes
