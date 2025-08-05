import type { RouteRecordRaw } from 'vue-router'

const docRoutes: RouteRecordRaw[] = [
  {
    path: '/docs',
    name: 'docs',
    component: () => import('@/docs/views/DocView.vue'),
    meta: {
      title: '官方文档',
      description: '编译原理官方文档'
    }
  },
  {
    path: '/docs/:section/:page',
    name: 'doc-page',
    component: () => import('@/docs/views/DocView.vue'),
    meta: {
      title: '文档页面'
    }
  }
]

export default docRoutes
