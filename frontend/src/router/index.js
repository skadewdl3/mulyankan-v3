import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/Home.vue')
  },
  {
    path: '/preprocess',
    name: 'preprocess',
    component: () => import('@/pages/Preprocess.vue')
  },
  {
    path: '/editor',
    name: 'editor',
    component: () => import('@/pages/Editor.vue')
  },
  {
    path: '/download',
    name: 'download',
    component: () => import('@/pages/Download.vue')
  },
  {
    path: '/docs',
    name: 'docs',
    component: () => import('@/pages/Docs.vue')
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/pages/Settings.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
