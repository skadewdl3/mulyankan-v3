import { fabric } from 'fabric'

const addBackgroundImage = (fcanvas, src, pageWidth) => {
  fabric.Image.fromURL(src, img => {
    let scaleFactor = pageWidth / img.width

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
      evented: false, // Prevents events from being fired on the background image
      selectable: false, // Prevents the background image from being selected
      hasBorders: false, // Prevents the background image from having borders
      hasControls: false, // Prevents the background image from being resized/rotated
      hasRotatingPoint: false,
      scaleX: scaleFactor,
      scaleY: scaleFactor
    })
  })
}

export const createCanvas = (id, src, pageWidth) => {
  const fcanvas = new fabric.Canvas(id)
  addBackgroundImage(fcanvas, src, pageWidth)
  fcanvas.renderAll()
  return fcanvas
}
