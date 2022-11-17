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
  quickMarkWidth: 300,
  quickMarkHeight: 30,
  height: 30,
  fontSize: 40,
  fontFamily: 'Poppins',
  fill: '#ff0000',
  textAlign: 'left'
}

const addImage = (fcanvas, id, coords, zoom, { color }) => {
  fcanvas.filterBackend = new fabric.WebglFilterBackend()

  // Create a fabric image from the source in assets folder

  fabric.Image.fromURL(`/images/${id}.svg`, function (img) {
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
      imgColor: color,
      id,
      zoom
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
  { fontSize, font: fontFamily, color: fill },
  text = null
) => {
  let width =
    textType === 'quickmark'
      ? defaultTextConfig.quickMarkWidth
      : defaultTextConfig.width
  let height =
    textType === 'quickmark'
      ? defaultTextConfig.quickMarkHeight
      : defaultTextConfig.height
  let textbox = new fabric.Textbox(
    text
      ? text
      : textType === 'text' || textType === 'quickmark'
      ? 'Text'
      : 'Mark',
    {
      left: coords.x - width / 2,
      top: coords.y - height / 2,
      textType,
      ...defaultObjectConfig,
      ...defaultTextConfig,
      fontSize,
      fontFamily,
      width,
      height,
      fill,
      zoom,
      scaleX: zoom,
      scaleY: zoom
    }
  )
  fcanvas.add(textbox)
}

export const addCopiedObject = (fcanvas, coords, obj, zoom) => {
  console.log(obj.zoom)
  // Make this later
  if (obj.type === 'image') {
    fabric.util.enlivenObjects([obj], objects => {
      let img = objects[0]
      img.set({
        ...defaultObjectConfig,
        scaleX: img.scaleX * (zoom / obj.zoom),
        scaleY: img.scaleY * (zoom / obj.zoom)
      })
      img.set({
        left: coords.x - (img.width * img.scaleX) / 2,
        top: coords.y - (img.height * img.scaleY) / 2
      })
      fcanvas.add(img)
    })
  } else if (obj.type === 'textbox') {
    fabric.util.enlivenObjects([obj], objects => {
      let textbox = objects[0]
      textbox.set({
        ...defaultObjectConfig,
        scaleX: textbox.scaleX * (zoom / obj.zoom),
        scaleY: textbox.scaleY * (zoom / obj.zoom)
      })
      textbox.set({
        left: coords.x - (textbox.width * textbox.scaleX) / 2,
        top: coords.y - (textbox.height * textbox.scaleY) / 2,
        textType: obj.textType
      })
      fcanvas.add(textbox)
    })
  }
}

export const dropEventListener = (
  fcanvas,
  setActiveCanvas,
  getZoom,
  getStyle
) => {
  fcanvas.on('drop', ({ e }) => {
    // Get coordinates of drop event
    let coords = fcanvas.getPointer(e)
    let style = getStyle
    let zoom = getZoom()
    setActiveCanvas()
    if (e.dataTransfer.getData('copy')) {
      let obj = JSON.parse(e.dataTransfer.getData('copy'))
      addCopiedObject(fcanvas, coords, obj, zoom)
    } else if (e.dataTransfer.getData('img')) {
      // Get the image id from the dataTransfer object
      let id = e.dataTransfer.getData('img')

      // Add the image to the canvas
      addImage(fcanvas, id, coords, zoom, style)
    } else if (e.dataTransfer.getData('text')) {
      // Get the text from the dataTransfer object
      let text = e.dataTransfer.getData('text')

      // Add the text to the canvas
      addTextbox(fcanvas, text, coords, zoom, style)
    } else if (e.dataTransfer.getData('quickmark')) {
      let marks = JSON.parse(e.dataTransfer.getData('quickmark'))
      let marksText = `${marks.calculated} / ${
        marks.total ? marks.total : 'Total'
      }`
      addTextbox(fcanvas, 'quickmark', coords, zoom, style, marksText)
    }
  })
}

export const textChangeEventListener = (fcanvas, updateMarks) => {
  fcanvas.on('text:changed', () => {
    updateMarks()
  })
  fcanvas.on('object:added', ({ target }) => {
    if (target.textType !== 'mark') return
    updateMarks()
  })
  fcanvas.on('object:removed', ({ target }) => {
    if (target.textType !== 'mark') return
    updateMarks()
  })
}

export const clickEventListener = (
  fcanvas,
  index,
  setActiveCanvas,
  setMenu,
  getMenu
) => {
  fcanvas.on('mouse:down', e => {
    if (e.button === 3) {
      setMenu({
        ...getMenu(),
        pasteCoords: e.pointer
      })
    }
  })
  // This weird array makes sure that the elements
  // on which event listener is added are not undefined
  // and have classList property
  Array.from(document.querySelector('.canvases').childNodes)
    .filter(el => el && el.classList)
    [index].addEventListener('contextmenu', e => {
      // Setting canvas as active is used to make sure
      // that copied/pasted/deleted element is from the same canvas

      setActiveCanvas()
      e.preventDefault()
      setMenu({
        ...getMenu(),
        show: true, // Show the menu
        coords: { x: e.pageX, y: e.pageY } // Get coordinates of right click
      })
    })

  document.addEventListener('click', () => {
    // If the menu is open, hide it when clicked anywhere on the screen
    if (getMenu().show) {
      setMenu({
        ...getMenu(),
        show: false
      })
    }
  })
}
