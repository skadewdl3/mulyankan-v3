import { fabric } from 'fabric'
import { toRaw } from 'vue'
import { dropEventListener } from './canvasEventListeners'

const backgroundImageConfig = {
  evented: false, // Prevents events from being fired on the background image
  selectable: false, // Prevents the background image from being selected
  hasBorders: false, // Prevents the background image from having borders
  hasControls: false, // Prevents the background image from being resized/rotated
  hasRotatingPoint: false
}

const addBackgroundImage = (fcanvas, src, pageWidth, zoom) => {
  fabric.Image.fromURL(src, img => {
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
    fcanvas.add(img)
    fcanvas.sendToBack(img)
    let backgroundImg = fcanvas._objects[0]
    backgroundImg.set({
      ...backgroundImageConfig,
      scaleX: scaleFactor,
      scaleY: scaleFactor
    })
  })
}

export const createCanvas = (id, src, pageWidth, zoom) => {
  const fcanvas = new fabric.Canvas(id)
  addBackgroundImage(fcanvas, src, pageWidth, zoom)
  fcanvas.renderAll()
  return fcanvas
}

export const loadCanvas = async (refCanvas, id, pageWidth, zoom) => {
  return new Promise((resolve, reject) => {
    let json = toRaw(refCanvas).toJSON()
    let fcanvas = new fabric.Canvas(id)
    fcanvas.loadFromJSON(json, () => {
      fcanvas.renderAll()
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
      dropEventListener(fcanvas, zoom)
      resolve(fcanvas)
    })
  })
}
