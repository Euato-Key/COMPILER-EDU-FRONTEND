import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// 导入模块化路由
import faRoutes from './modules/fa'
import ll1Routes from './modules/ll1'
import lr0Routes from './modules/lr0'
import slr1Routes from './modules/slr1'
import devRoutes from './modules/dev'

// 基础路由
const baseRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/index.vue'),
    meta: {
      title: '首页',
      description: '编译原理可视化工具'
    }
  }
]

// 合并所有路由
const routes: RouteRecordRaw[] = [
  ...baseRoutes,
  ...faRoutes,
  ...ll1Routes,
  ...lr0Routes,
  ...slr1Routes,
  ...devRoutes
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
