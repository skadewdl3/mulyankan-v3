import { fabric } from 'fabric'
import { toRaw } from 'vue'
import {
  addCopiedObject,
  clickEventListener,
  defaultObjectConfig,
  dropEventListener,
  textChangeEventListener
} from './canvasEventListeners'
import { roundOff } from '@/helpers/miscellaneous'

const backgroundImageConfig = {
  evented: false, // Prevents events from being fired on the background image
  selectable: false, // Prevents the background image from being selected
  hasBorders: false, // Prevents the background image from having borders
  hasControls: false, // Prevents the background image from being resized/rotated
  hasRotatingPoint: false
}

const addBackgroundImage = (fcanvas, src, pageWidth, store, zoom) => {
  fabric.Image.fromURL(
    src,
    img => {
      let scaleFactor =
        store.state.scaleFactor || (pageWidth / img.width) * zoom
      if (!store.state.scaleFactor) store.commit('setScaleFactor', scaleFactor)
      let width = roundOff(img.width * scaleFactor, 1)
      let height = roundOff(img.height * scaleFactor, 1)

      // Resize canvas to be size of background image
      fcanvas.setWidth(width)
      fcanvas.setHeight(height)

      img.set({
        ...backgroundImageConfig,
        scaleX: scaleFactor,
        scaleY: scaleFactor
      })

      // Add the background image to the canvas and send it to the back
      fcanvas.add(img)
      fcanvas.sendToBack(img)
    },
    { crossOrigin: 'anonymous' }
  )
}

export const createCanvas = (
  canvasID,
  projectID,
  src,
  pageWidth,
  // pageHeight,
  store,
  zoom
) => {
  const fcanvas = new fabric.Canvas(canvasID)
  addBackgroundImage(fcanvas, src, pageWidth, store, zoom)
  fcanvas.id = projectID
  fcanvas.renderAll()
  return fcanvas
}

export const loadCanvas = async (refCanvas, index, pageWidth, store) => {
  let zoom = store.state.zoom
  let getStyle = store.getters.getStyle
  let updateMarks = () => store.dispatch('updateMarks')
  return new Promise((resolve, reject) => {
    if (refCanvas.rawObjects) {
      fabric.util.enlivenObjects(refCanvas.rawObjects, objects => {
        refCanvas._objects = objects
        let json = toRaw(refCanvas).toJSON([
          'imgColor',
          'textType',
          'zoom',
          'id'
        ])
        let fcanvas = new fabric.Canvas(`canvas-${index}`)

        fcanvas.loadFromJSON(json, () => {
          fcanvas.renderAll()
          fcanvas._objects.forEach((obj, i) => {
            if (i === 0) return
            obj.set(defaultObjectConfig)
          })
          let img = fcanvas._objects[0]

          img.set({
            ...backgroundImageConfig
          })
          fcanvas.setDimensions({
            width: img.width * img.scaleX,
            height: img.height * img.scaleY
          })
          fcanvas.fireRightClick = true
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
    } else {
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
    }
  })
}

export const resumeCanvases = pages => {
  let fcanvases = []
  // Converts fcanvas from json to fcanvas (which are not linked to canvas element)
  // loadCanvas has to be called after this to actually show fcanvas
  return new Promise((resolve, reject) => {
    pages.forEach(({ objects: objectJSON, id }, i) => {
      let fcanvas = new fabric.Canvas()
      let newRawObjetcs = objectJSON.map((obj, i) => {
        if (i === 0) return obj
        if (obj.type === 'image') {
          let srcs = obj.src.split('/')
          let src = `%BASE_URL%/svgs/${srcs[srcs.length - 1]}`
          return {
            ...obj,
            src
          }
        } else {
          return obj
        }
      })
      fcanvas.rawObjects = newRawObjetcs
      fcanvas.id = id
      fcanvases.push(fcanvas)
      if (i === pages.length - 1) resolve(fcanvases)
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
