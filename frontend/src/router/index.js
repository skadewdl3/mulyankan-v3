import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import Preprocess from '@/pages/Preprocess.vue'
import Editor from '@/pages/Editor.vue'

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
  },
  {
    path: '/editor',
    name: 'editor',
    component: Editor
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
