import { getDocument } from 'pdfjs-dist'
import { toRaw } from 'vue'
import axios from 'axios'

export const binaryStringToJSON = ab => {
  return new Promise((resolve, reject) => {
    let blob = new Blob([ab])

    let fr = new FileReader()

    fr.onload = () => {
      let json = JSON.parse(fr.result)
      resolve(json)
    }
    fr.onerror = err => reject(err)
    fr.readAsText(blob)
  })
}

export const binaryStringToBase64 = ab => {
  return new Promise((resolve, reject) => {
    let blob = new Blob([ab])

    let fr = new FileReader()

    fr.onload = () => {
      resolve(fr.result)
    }
    fr.onerror = err => reject(err)
    fr.readAsDataURL(blob)
  })
}

export const bufferToArrayBuffer = buf => {
  const ab = new ArrayBuffer(buf.length)
  const view = new Uint8Array(ab)
  for (let i = 0; i < buf.length; ++i) {
    view[i] = buf[i]
  }
  return ab
}

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

export const pdfBinaryToImages = async (data, processNow, store, projectID) => {
  let imgArr = []
  let doc = await getDocument({ data }).promise
  let now = doc.numPages
  store.commit('setNumPages', doc.numPages)
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

  if (doc.numPages > processNow)
    store.dispatch('lazyLoadPDF', { doc, now, projectID })

  return imgArr
}

export const savePDF = async file => {
  const formData = new FormData()
  formData.append('pdf', file)
  formData.append('name', file.name)

  // Send to server
  let { data } = await axios.post('%BASE_URL%/save', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return data.id
}

export const updateSavedPDF = store => {
  return new Promise(async (resolve, reject) => {
    let {
      images: fcanvases,
      preprocessInstructions: preprocess,
      projectID,
      style,
      marks,
      clipboard
    } = toRaw(store.state)
    // Convert fcanvases to json using fcanvas.toJSON('_objects')

    let pages = fcanvases.reduce((acc, fcanvas) => {
      let objects = fcanvas._objects.map(obj =>
        obj.toJSON(['imgColor', 'textType', 'id', 'zoom'])
      )
      let id = fcanvas.id
      acc = [...acc, { id, objects }]
      return acc
    }, [])

    let json = {
      pages,
      preprocess,
      style,
      marks,
      clipboard
    }

    // Convert json to blob
    const str = JSON.stringify(json)
    const bytes = new TextEncoder().encode(str)
    const blob = new Blob([bytes], {
      type: 'application/json;charset=utf-8'
    })

    // Add blob to formData
    const formData = new FormData()
    formData.append('pdf', blob)

    // Send formData to server
    let { data } = await axios
      .post(`%BASE_URL%/update/${projectID}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      .catch(err => reject(err))
    resolve(data)
  })
}
