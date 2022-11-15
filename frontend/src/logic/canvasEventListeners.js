import { fabric } from 'fabric'

const defaultObjectConfig = {
  fireRightClick: true,
  transparentCorners: false,
  cornerColor: '#6c5ce7',
  cornerSize: 7
}

const defaultImageConfig = {
  width: 50,
  height: 50
}

const defaultTextConfig = {
  width: 100,
  height: 30,
  fontSize: 40,
  fontFamily: 'Poppins',
  fill: '#ff0000',
  textAlign: 'left'
}

const addImage = (fcanvas, id, coords, zoom, { color }) => {
  fcanvas.filterBackend = new fabric.WebglFilterBackend()

  // Create a fabric image from the source in assets folder
  fabric.Image.fromURL(`/src/assets/images/${id}.svg`, function (img) {
    // Scale the image according to zoom level
    let scaleFactorX = (defaultImageConfig.width / img.width) * zoom
    let scaleFactorY = (defaultImageConfig.height / img.height) * zoom
    img.set({
      ...defaultObjectConfig,
      left: coords.x - (img.width * scaleFactorX) / 2,
      top: coords.y - (img.height * scaleFactorY) / 2,
      defaultLeft: coords.x - (img.width * scaleFactorX) / 2,
      defaultTop: coords.y - (img.height * scaleFactorY) / 2,
      scaleX: scaleFactorX,
      scaleY: scaleFactorY,
      defaultScaleX: scaleFactorX,
      defaultScaleY: scaleFactorY,
      imgColor: color
    })

    fcanvas.add(img)

    // Apply selected color filter to image
    img.filters[0] = new fabric.Image.filters.BlendColor({
      color,
      mode: 'tint',
      opacity: 0
    })

    img.applyFilters()

    // Add image to canvas
    fcanvas.renderAll()
  })
}

const addTextbox = (
  fcanvas,
  textType,
  coords,
  zoom,
  { fontSize, font: fontFamily, color: fill }
) => {
  let textbox = new fabric.Textbox(textType === 'text' ? 'Text' : 'Mark', {
    left: coords.x - defaultTextConfig.width / 2,
    top: coords.y - defaultTextConfig.height / 2,
    textType,
    ...defaultObjectConfig,
    ...defaultTextConfig,
    fontSize,
    fontFamily,
    fill
  })
  fcanvas.add(textbox)
}

export const dropEventListener = (fcanvas, zoom, getStyle) => {
  fcanvas.on('drop', ({ e }) => {
    // Get coordinates of drop event
    let coords = fcanvas.getPointer(e)
    let style = getStyle

    if (e.dataTransfer.getData('img')) {
      // Get the image id from the dataTransfer object
      let id = e.dataTransfer.getData('img')

      // Add the image to the canvas
      addImage(fcanvas, id, coords, zoom, style)
    } else if (e.dataTransfer.getData('text')) {
      // Get the text from the dataTransfer object
      let text = e.dataTransfer.getData('text')

      // Add the text to the canvas
      addTextbox(fcanvas, text, coords, zoom, style)
    }
  })
}
