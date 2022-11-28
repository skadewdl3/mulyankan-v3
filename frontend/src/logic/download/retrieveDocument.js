import { PDFDocument } from 'pdf-lib'
import { store } from '@/store/index'
import axios from 'axios'
import { bufferToArrayBuffer } from '@/logic/pdfFunctions'

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
