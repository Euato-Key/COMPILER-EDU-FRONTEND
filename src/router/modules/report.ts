import type { RouteRecordRaw } from 'vue-router'

const reportRoutes: RouteRecordRaw[] = [
  {
    path: '/report/fa/:id',
    name: 'report-fa',
    component: () => import('../../views/report/fa.vue'),
    meta: {
      title: 'FA答题报告',
      description: '查看有限自动机的详细答题报告'
    }
  },
  {
    path: '/report/ll1/:id',
    name: 'report-ll1',
    component: () => import('../../views/report/ll1.vue'),
    meta: {
      title: 'LL1答题报告',
      description: '查看LL1语法分析的详细答题报告'
    }
  }
]

export default reportRoutes
