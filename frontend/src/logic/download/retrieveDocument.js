import { PDFDocument } from 'pdf-lib'
import { bufferToArrayBuffer } from '../pdfFunctions'
import axios from 'axios'
import { store } from '@/store/index'

export const retrieveDocument = async updateProgress => {
  updateProgress(1)
  let { data: buffer } = await axios.post('%BASE_URL%/download', {
    id: store.state.projectID
  })
  let arrayBuffer = bufferToArrayBuffer(buffer.data)
  let doc = await PDFDocument.load(arrayBuffer)
  updateProgress(5)
  return doc
}
