// Called if the PDF has more than 5 pages
// Loads PDF pages past 5 in the background while showing the first 5

const lazyLoadPDF = (store, { doc, now }) => {
  for (let i = now + 1; i <= doc.numPages; i++) {
    doc.getPage(i).then(page => {
      let viewport = page.getViewport({ scale: 4 })
      let canvas = document.createElement('canvas')
      canvas.width = viewport.width
      canvas.height = viewport.height
      let canvasContext = canvas.getContext('2d')
      let task = page.render({ canvasContext, viewport })
      task.promise.then(() => {
        store.commit('setImageSources', [
          ...store.state.imageSources,
          canvas.toDataURL()
        ])
      })
    })
  }
}

export default {
  lazyLoadPDF
}
