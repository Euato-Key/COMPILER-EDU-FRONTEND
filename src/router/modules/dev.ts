import type { RouteRecordRaw } from 'vue-router'

const devRoutes: RouteRecordRaw[] = [
  {
    path: '/dev',
    name: 'dev-index',
    component: () => import('../../views/dev/index.vue'),
    meta: {
      title: '开发调试',
      description: '开发者调试页面总览'
    }
  },
  {
    path: '/dev/api-test',
    name: 'dev-api-test',
    component: () => import('../../views/dev/pages/api-test.vue'),
    meta: {
      title: 'API测试',
      description: '前后端API连接测试'
    }
  },
  {
    path: '/dev/canvas',
    name: 'dev-canvas',
    component: () => import('../../views/dev/pages/CanvasFlowTest.vue'),
    meta: {
      title: '画布调试',
      description: 'Vue Flow 画布组件测试和调试'
    }
  },
  {
    path: '/dev/canvas-demos',
    name: 'dev-canvas-demos',
    component: () => import('../../views/dev/pages/CanvasDemos.vue'),
    meta: {
      title: '算法画布演示',
      description: '各种算法的画布组件演示'
    }
  }
]

export default devRoutes
