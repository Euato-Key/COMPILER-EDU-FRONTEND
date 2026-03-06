import type { RouteRecordRaw } from 'vue-router'

const legalRoutes: RouteRecordRaw[] = [
  {
    path: '/terms',
    name: 'terms',
    component: () => import('@/views/legal/TermsView.vue'),
    meta: {
      title: '用户协议',
      description: '编译原理可视化工具用户协议'
    }
  },
  {
    path: '/privacy',
    name: 'privacy',
    component: () => import('@/views/legal/PrivacyView.vue'),
    meta: {
      title: '隐私政策',
      description: '编译原理可视化工具隐私政策'
    }
  },
  {
    path: '/disclaimer',
    name: 'disclaimer',
    component: () => import('@/views/legal/DisclaimerView.vue'),
    meta: {
      title: '免责声明',
      description: '编译原理可视化工具免责声明'
    }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/legal/AboutView.vue'),
    meta: {
      title: '关于我们',
      description: '关于编译原理可视化工具'
    }
  }
]

export default legalRoutes
