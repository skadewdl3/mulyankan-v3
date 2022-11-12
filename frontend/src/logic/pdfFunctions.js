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

export const pdfBinaryToImages = async data => {
  let imgArr = []
  let doc = await getDocument({ data }).promise

  for (let i = 1; i <= doc.numPages; i++) {
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
  return imgArr
}