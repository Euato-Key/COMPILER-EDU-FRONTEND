import type { RouteRecordRaw } from 'vue-router'

const pptAnimationRoutes: RouteRecordRaw[] = [
  {
    path: '/ppt-animations',
    name: 'ppt-animations',
    component: () => import('../../views/ppt-animations/index.vue'),
    meta: {
      title: 'PPT动画演示',
      description: '编译原理PPT动画演示'
    }
  },
  {
    path: '/ppt-animations/video-intro',
    name: 'video-intro',
    component: () => import('../../views/ppt-animations/pages/video-intro.vue'),
    meta: {
      title: '视频开场动画',
      description: '编译原理可视化平台视频开场'
    }
  },
  {
    path: '/ppt-animations/compiler-overview',
    name: 'compiler-overview',
    component: () => import('../../views/ppt-animations/pages/compiler-overview.vue'),
    meta: {
      title: '编译原理概述',
      description: '编译原理基本概念动画演示'
    }
  },
  {
    path: '/ppt-animations/fa-animation',
    name: 'fa-animation',
    component: () => import('../../views/ppt-animations/pages/fa-animation.vue'),
    meta: {
      title: '有限自动机动画',
      description: 'NFA到DFA转换动画演示'
    }
  },
  {
    path: '/ppt-animations/parsing-animation',
    name: 'parsing-animation',
    component: () => import('../../views/ppt-animations/pages/parsing-animation.vue'),
    meta: {
      title: '语法分析动画',
      description: 'LL1和LR分析算法动画演示'
    }
  }
]

export default pptAnimationRoutes
