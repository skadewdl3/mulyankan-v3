import { createApp } from 'vue'
import router from './router/index'
import { store } from './store/index'
import { GlobalWorkerOptions } from 'pdfjs-dist'
import './style.css'
import App from './App.vue'

GlobalWorkerOptions.workerSrc = '/pdf.worker.js'
const app = createApp(App)

app.use(router)
app.use(store)

app.mount('#app')
