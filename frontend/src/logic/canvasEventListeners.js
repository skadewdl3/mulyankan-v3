import { fabric } from 'fabric'

const addImage = (fcanvas, id, coords, zoom) => {
  // Get the image element from the DOM
  let imgEl = document.getElementById(id)

  // Create a fabric image from the image element
  let img = new fabric.Image(imgEl)

  // Scale the image according to zoom level
  // 100 is default image width
  img.defaultWidth = 50
  img.defaultHeight = 50
  let scaleFactorX = (img.defaultWidth / img.width) * zoom
  let scaleFactorY = (img.defaultHeight / img.height) * zoom
  img.set({
    left: coords.x - (img.width * scaleFactorX) / 2,
    top: coords.y - (img.height * scaleFactorY) / 2,
    defaultLeft: coords.x - (img.width * scaleFactorX) / 2,
    defaultTop: coords.y - (img.height * scaleFactorY) / 2,
    scaleX: scaleFactorX,
    scaleY: scaleFactorY,
    defaultScaleX: scaleFactorX,
    defaultScaleY: scaleFactorY
  })

  // Apply selected color filter to image
  // Do this later

  // Add image to canvas
  fcanvas.add(img)
  fcanvas.renderAll()
}

export const dropEventListener = (fcanvas, zoom) => {
  fcanvas.on('drop', ({ e }) => {
    // Get the image element which has been dragged
    let id = e.dataTransfer.getData('id')

    // Get the coordinates of the drop event
    let coords = fcanvas.getPointer(e)

    // Add the image to the canvas
    addImage(fcanvas, id, coords, zoom)
  })
}
