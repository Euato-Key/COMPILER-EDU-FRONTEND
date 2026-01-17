import type { RouteRecordRaw } from 'vue-router'

const recordRoutes: RouteRecordRaw[] = [
  {
    path: '/record',
    name: 'record',
    component: () => import('../../views/record/index.vue'),
    meta: {
      title: '答题记录',
      description: '查看所有算法的答题记录'
    },
    children: [
      {
        path: 'fa',
        name: 'record-fa',
        component: () => import('../../views/record/fa.vue'),
        meta: {
          title: 'FA答题记录',
          description: '查看有限自动机的答题记录'
        }
      },
      {
        path: 'll1',
        name: 'record-ll1',
        component: () => import('../../views/record/ll1.vue'),
        meta: {
          title: 'LL1答题记录',
          description: '查看LL1分析的答题记录'
        }
      },
      {
        path: 'lr0',
        name: 'record-lr0',
        component: () => import('../../views/record/lr0.vue'),
        meta: {
          title: 'LR0答题记录',
          description: '查看LR0分析的答题记录'
        }
      },
      {
        path: 'slr1',
        name: 'record-slr1',
        component: () => import('../../views/record/slr1.vue'),
        meta: {
          title: 'SLR1答题记录',
          description: '查看SLR1分析的答题记录'
        }
      }
    ]
  }
]

export default recordRoutes
