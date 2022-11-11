import { createApp } from 'vue'
import router from './router/index'
import { store } from './store/index'
import { GlobalWorkerOptions } from 'pdfjs-dist'
import {
  ZoomInOutlined,
  ZoomOutOutlined,
  SearchOutlined,
  ArrowRightOutlined,
  RedoOutlined,
  UndoOutlined
} from '@ant-design/icons-vue'
import './style.css'
import App from './App.vue'

GlobalWorkerOptions.workerSrc = '/pdf.worker.js'
const app = createApp(App)

app.use(router)
app.use(store)

app.component('icon-zoom-in', ZoomInOutlined)
app.component('icon-zoom-out', ZoomOutOutlined)
app.component('icon-reset-zoom', SearchOutlined)
app.component('icon-arrow-right', ArrowRightOutlined)
app.component('icon-rotate-all-right', RedoOutlined)
app.component('icon-rotate-all-left', UndoOutlined)

app.mount('#app')
