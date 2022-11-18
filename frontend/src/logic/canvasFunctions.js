import { fabric } from 'fabric'
import { toRaw } from 'vue'
import {
  addCopiedObject,
  clickEventListener,
  defaultObjectConfig,
  dropEventListener,
  textChangeEventListener
} from './canvasEventListeners'

const backgroundImageConfig = {
  evented: false, // Prevents events from being fired on the background image
  selectable: false, // Prevents the background image from being selected
  hasBorders: false, // Prevents the background image from having borders
  hasControls: false, // Prevents the background image from being resized/rotated
  hasRotatingPoint: false
}

const addBackgroundImage = (fcanvas, src, pageWidth, zoom, mode = 'new') => {
  fabric.Image.fromURL(
    src,
    img => {
      let orientation = img.width > img.height ? 'landscape' : 'portrait'
      let scaleFactor =
        (orientation === 'portrait'
          ? pageWidth / img.width
          : pageWidth / img.height) * zoom

      let width = img.width * scaleFactor
      let height = img.height * scaleFactor

      // Resize canvas to be size of background image
      fcanvas.setWidth(width)
      fcanvas.setHeight(height)

      // Add the background image to the canvas and send it to the back
      if (mode === 'resume') {
        fcanvas._objects = []
      }
      fcanvas.add(img)
      fcanvas.sendToBack(img)
      let backgroundImg = fcanvas._objects[0]
      backgroundImg.set({
        ...backgroundImageConfig,
        scaleX: scaleFactor,
        scaleY: scaleFactor
      })
    },
    { crossOrigin: 'anonymous' }
  )
}

export const createCanvas = (canvasID, projectID, src, pageWidth, zoom) => {
  console.log(canvasID)
  const fcanvas = new fabric.Canvas(canvasID)
  addBackgroundImage(fcanvas, src, pageWidth, zoom)
  fcanvas.id = projectID
  fcanvas.renderAll()
  return fcanvas
}

export const loadCanvas = async (refCanvas, index, pageWidth, store) => {
  let zoom = store.state.zoom
  let getStyle = store.getters.getStyle
  let updateMarks = () => store.dispatch('updateMarks')
  return new Promise((resolve, reject) => {
    let json = toRaw(refCanvas).toJSON(['imgColor', 'textType', 'zoom', 'id'])
    let fcanvas = new fabric.Canvas(`canvas-${index}`)
    fcanvas.loadFromJSON(json, () => {
      fcanvas.renderAll()
      fcanvas._objects.forEach((obj, i) => {
        if (i === 0) return
        obj.set(defaultObjectConfig)
      })
      let img = fcanvas._objects[0]

      let orientation = img.width > img.height ? 'landscape' : 'portrait'
      let scaleFactor =
        (orientation === 'portrait'
          ? pageWidth / img.width
          : pageWidth / img.height) * zoom
      img.set({
        ...backgroundImageConfig,
        scaleX: scaleFactor,
        scaleY: scaleFactor
      })
      fcanvas.setDimensions({
        width: img.width * scaleFactor,
        height: img.height * scaleFactor
      })
      fcanvas.fireRightClick = true
      fcanvas.filterBackend = new fabric.WebglFilterBackend()
      dropEventListener(
        fcanvas,
        () => store.dispatch('setActiveCanvas', index),
        () => store.state.zoom,
        getStyle
      )
      textChangeEventListener(fcanvas, updateMarks)
      clickEventListener(
        fcanvas,
        index,
        () => store.dispatch('setActiveCanvas', index),
        menu => store.commit('setMenu', menu),
        () => store.state.menu
      )
      resolve(fcanvas)
    })
  })
}

export const resumeCanvases = pages => {
  let fcanvases = []
  // Converts fcanvas from json to fcanvas (which are not linked to canvas element)
  // loadCanvas has to be called after this to actually show fcanvas
  return new Promise((resolve, reject) => {
    pages.forEach(({ objects: objectJSON, id }, i) => {
      let fcanvas = new fabric.Canvas()

      fabric.util.enlivenObjects(objectJSON, objects => {
        let bg = objects[0]
        fcanvas.setDimensions({
          height: bg.height,
          width: bg.width
        })
        objects.forEach(obj => {
          obj.set(defaultObjectConfig)
          fcanvas.add(obj)
        })
        fcanvas.id = id
        fcanvases.push(fcanvas)
        if (i === pages.length - 1) resolve(fcanvases)
      })
    })
  })
}
export const deleteSelectedObject = fcanvas => {
  let selectedObj = fcanvas.getActiveObject()
  fcanvas.remove(selectedObj)
}

export const copySelectedObject = (fcanvas, addToClipboard) => {
  let selectedObj = fcanvas
    .getActiveObject()
    .toJSON(['imgColor', 'textType', 'id', 'zoom'])
  addToClipboard(selectedObj)
}

export const pasteFromClipboard = (fcanvas, clipboard, coords, zoom) => {
  // Implement this later
  if (clipboard.length === 0) return
  let recentCopy = clipboard[clipboard.length - 1]
  addCopiedObject(fcanvas, coords, recentCopy, zoom)
}
