import { getDocument } from 'pdfjs-dist'

export const pdfToBinaryString = file => {
  // Return a promise that resolves with the binary string
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => {
      resolve(reader.result)
    }
    reader.onerror = err => {
      reject(err)
    }
    reader.readAsArrayBuffer(file)
  })
}

export const pdfBinaryToImages = async (data, processNow, store) => {
  let imgArr = []
  let doc = await getDocument({ data }).promise

  let now = doc.numPages

  if (doc.numPages > processNow) now = processNow

  for (let i = 1; i <= now; i++) {
    let page = await doc.getPage(i)

    // Using greater scale gives better quality (when zooming in/out)
    // but takes longer to render

    let viewport = page.getViewport({ scale: 4 })
    let canvas = document.createElement('canvas')
    canvas.width = viewport.width
    canvas.height = viewport.height
    let canvasContext = canvas.getContext('2d')
    let task = page.render({ canvasContext, viewport })
    await task.promise
    imgArr.push(canvas.toDataURL())
  }

  if (doc.numPages > processNow) store.dispatch('lazyLoadPDF', { doc, now })

  return imgArr
}
