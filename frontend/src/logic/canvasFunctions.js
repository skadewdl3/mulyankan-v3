import { fabric } from 'fabric'

const addBackgroundImage = (fcanvas, src) => {
  fabric.Image.fromURL(src, img => {
    // Resize canvas to be size of background image
    fcanvas.setWidth(img.width)
    fcanvas.setHeight(img.height)

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
      originX: 'center',
      originY: 'center',
      top: img.height / 2,
      left: img.width / 2
    })
  })
}

export const createCanvas = (id, src) => {
  const fcanvas = new fabric.Canvas(id)
  addBackgroundImage(fcanvas, src)
  fcanvas.renderAll()
  console.log(fcanvas)
  return fcanvas
}
