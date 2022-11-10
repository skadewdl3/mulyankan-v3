import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import Preprocess from '@/pages/Preprocess.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/preprocess',
    name: 'preprocess',
    component: Preprocess
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
