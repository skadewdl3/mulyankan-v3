import ImageRotation from 'image-rotation'

export const resizeCanvas = (fcanvas, zoom, prevZoom) => {
  let scaleFactor = zoom / prevZoom

  let backgroundImage = fcanvas._objects[0]

  backgroundImage.set({
    scaleX: backgroundImage.scaleX * scaleFactor,
    scaleY: backgroundImage.scaleY * scaleFactor
  })

  fcanvas.setDimensions({
    width: fcanvas.width * scaleFactor,
    height: fcanvas.height * scaleFactor
  })

  fcanvas._objects.forEach((obj, i) => {
    if (i === 0) return

    /* Calculation for position of object after zooming
    We have to calculate the position of the object relative to previous position and adjust by multiplying by certain factor

    Hence,
    obj.leftPrev    ---> prevZoom
    obj.left        ---> zoom
    
    Hence, obj.left = obj.LeftPrev * (scaleFactor).
    Same logic applies to obj.top
    */

    /* Calculation of scaling for objects after zooming
    We have to calculate how much to scale object relative to the previous zoom level.
    
    Hence,
    obj.scaleXPrev    ---> prevZoom
    obj.scaleX        ---> zoom

    Hence, obj.scaleX = obj.scaleXPrev * (scaleFactor).
    Same logic applies to obj.scaleY
    */

    obj.set({
      left: obj.left * scaleFactor,
      top: obj.top * scaleFactor,
      scaleX: obj.scaleX * scaleFactor,
      scaleY: obj.scaleY * scaleFactor,
      zoom
    })
    obj.setCoords()
  })

  fcanvas.renderAll()
}

export const rotateCanvas = async (
  imageSources,
  direction,
  index = undefined
) => {
  // If index is not provided, rotate all canvases
  if (typeof index !== 'number') {
    return new Promise((resolve, reject) => {
      let temp = []
      imageSources.forEach(async src => {
        let r = new ImageRotation(src)
        try {
          let res = await r.generate(direction === 'right' ? 90 : -90)
          temp.push(res)
          if (temp.length === imageSources.length) resolve(temp)
        } catch (err) {
          reject(err)
        }
      })
    })
  }
  // If index is provided, rotate only the canvas at that index
  return new Promise(async (resolve, reject) => {
    let temp = imageSources
    let src = temp[index]
    let r = new ImageRotation(src)
    try {
      let res = await r.generate(direction === 'right' ? 90 : -90)
      temp[index] = res
      resolve(temp)
    } catch (err) {
      reject(err)
    }
  })
}

export const updateStyle = (
  obj,
  { fontSize, font: fontFamily, color: fill }
) => {
  if (obj.textType) {
    obj.set({
      fontSize,
      fontFamily,
      fill
    })
  } else if (obj.imgColor) {
    obj.filters[0] = new fabric.Image.filters.BlendColor({
      color: fill,
      opacity: 0,
      mode: 'tint'
    })
    obj.imgColor = fill

    obj.applyFilters()
  }
}
