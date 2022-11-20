// Called if the PDF has more than 5 pages
// Loads PDF pages past 5 in the background while showing the first 5

//now = 5

const lazyLoadPDF = (store, { doc, now, projectID }) => {
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
          {
            src: canvas.toDataURL(),
            id: `${projectID}-${now}`
          }
        ])
      })
    })
  }
}

/*
isNumber code courtesy of: Dan
Stackoverflow Post: https://stackoverflow.com/questions/175739/how-can-i-check-if-a-string-is-a-valid-number
Dan's Profile: https://stackoverflow.com/users/17121/dan
*/
export const isNumber = str => {
  // we only process strings!
  if (typeof str != 'string') return false
  // use type coercion to parse the entirety of the string (parseFloat alone does not do this)
  // and ensure strings of whitespace fail
  return !isNaN(str) && !isNaN(parseFloat(str))
}

// Update the marks on the canvas when any markbox changes
const updateMarks = store => {
  let markBoxes = []
  store.state.images.forEach(fcanvas => {
    fcanvas._objects.forEach(obj => {
      if (obj.textType && obj.textType === 'mark') {
        if (isNumber(obj.text)) {
          markBoxes.push(obj.text)
        }
      }
    })
  })
  let marks = markBoxes.reduce((acc, cur) => (acc += parseFloat(cur)), 0)
  store.commit('setCalculatedMarks', marks)
}

const setActiveCanvas = (store, index) => {
  store.state.images.forEach((fcanvas, i) => {
    if (i === index) {
      fcanvas.active = true
    } else {
      fcanvas.active = false
    }
  })
}

const addToClipboard = (store, obj) => {
  store.commit('setClipboard', [...store.state.clipboard, obj])
}

const deleteFromClipboard = (store, index) => {
  let temp = store.state.clipboard.filter((_, i) => i !== index)
  store.commit('setClipboard', temp)
}

const addPreprocessInstruction = (store, instruction) => {
  let newInstructions = [...store.state.preprocessInstructions, instruction]
  store.commit('setPreprocessInstructions', newInstructions)
  console.log(store.state.preprocessInstructions)
}

export default {
  lazyLoadPDF,
  updateMarks,
  setActiveCanvas,
  addToClipboard,
  deleteFromClipboard,
  addPreprocessInstruction
}
