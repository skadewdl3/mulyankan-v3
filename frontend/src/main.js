import { createApp } from 'vue'
import { GlobalWorkerOptions } from 'pdfjs-dist'
import './style.css'
import App from './App.vue'

GlobalWorkerOptions.workerSrc = '/pdf.worker.js'
createApp(App).mount('#app')
