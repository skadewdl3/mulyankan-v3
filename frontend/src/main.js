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
  UndoOutlined,
  RotateRightOutlined,
  RotateLeftOutlined,
  DeleteOutlined
} from '@ant-design/icons-vue'
import './style.css'
import App from './App.vue'

GlobalWorkerOptions.workerSrc = '/pdf.worker.js'
const app = createApp(App)

app.use(router)
app.use(store)

const icons = [
  { name: 'icon-zoom-in', component: ZoomInOutlined },
  { name: 'icon-zoom-out', component: ZoomOutOutlined },
  { name: 'icon-reset-zoom', component: SearchOutlined },
  { name: 'icon-arrow-right', component: ArrowRightOutlined },
  { name: 'icon-rotate-all-right', component: RedoOutlined },
  { name: 'icon-rotate-all-left', component: UndoOutlined },
  { name: 'icon-rotate-right', component: RotateRightOutlined },
  { name: 'icon-rotate-left', component: RotateLeftOutlined },
  { name: 'icon-delete', component: DeleteOutlined }
]

icons.forEach(icon => app.component(icon.name, icon.component))

app.mount('#app')
