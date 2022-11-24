import { createApp } from 'vue'
import router from './router/index'
import { store } from './store/index'
import { translate } from './logic/translator'
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
  DeleteOutlined,
  UpOutlined,
  DownOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
  UnderlineOutlined,
  ItalicOutlined,
  BoldOutlined,
  CopyOutlined,
  FormOutlined,
  CloseOutlined,
  DownloadOutlined,
  ProjectOutlined,
  LoadingOutlined,
  LeftOutlined,
  RightOutlined,
  DeliveredProcedureOutlined
} from '@ant-design/icons-vue'
import './style.css'
import App from './App.vue'

GlobalWorkerOptions.workerSrc = '/pdf.worker.js'
const app = createApp(App)

app.use(router)
app.use(store)

app.config.globalProperties.$t = translate

const icons = [
  { name: 'icon-zoom-in', component: ZoomInOutlined },
  { name: 'icon-zoom-out', component: ZoomOutOutlined },
  { name: 'icon-reset-zoom', component: SearchOutlined },
  { name: 'icon-arrow-right', component: ArrowRightOutlined },
  { name: 'icon-arrow-left', component: ArrowLeftOutlined },
  { name: 'icon-rotate-all-right', component: RedoOutlined },
  { name: 'icon-rotate-all-left', component: UndoOutlined },
  { name: 'icon-rotate-right', component: RotateRightOutlined },
  { name: 'icon-rotate-left', component: RotateLeftOutlined },
  { name: 'icon-delete', component: DeleteOutlined },
  { name: 'icon-up', component: UpOutlined },
  { name: 'icon-down', component: DownOutlined },
  { name: 'icon-save', component: SaveOutlined },
  { name: 'icon-bold', component: BoldOutlined },
  { name: 'icon-italic', component: ItalicOutlined },
  { name: 'icon-underline', component: UnderlineOutlined },
  { name: 'icon-copy', component: CopyOutlined },
  { name: 'icon-paste', component: FormOutlined },
  { name: 'icon-close', component: CloseOutlined },
  { name: 'icon-download', component: DownloadOutlined },
  { name: 'icon-project', component: ProjectOutlined },
  { name: 'icon-loading', component: LoadingOutlined },
  { name: 'icon-left', component: LeftOutlined },
  { name: 'icon-right', component: RightOutlined },
  { name: 'icon-deliver', component: DeliveredProcedureOutlined }
]

icons.forEach(icon => app.component(icon.name, icon.component))

app.mount('#app')
