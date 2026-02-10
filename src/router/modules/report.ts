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
  },
  {
    path: '/report/lr0/:id',
    name: 'report-lr0',
    component: () => import('../../views/report/lr0.vue'),
    meta: {
      title: 'LR0答题报告',
      description: '查看LR0语法分析的详细答题报告'
    }
  },
  {
    path: '/report/slr1/:id',
    name: 'report-slr1',
    component: () => import('../../views/report/slr1.vue'),
    meta: {
      title: 'SLR1答题报告',
      description: '查看SLR1语法分析的详细答题报告'
    }
  }
]

export default reportRoutes
