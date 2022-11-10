import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { GlobalWorkerOptions } from 'pdfjs-dist'
import './style.css'
import App from './App.vue'

const router = createRouter({
  history: createWebHistory(),
  routes
})

GlobalWorkerOptions.workerSrc = '/pdf.worker.js'
const app = createApp(App)

app.use(router)

app.mount('#app')
