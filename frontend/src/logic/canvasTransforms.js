import ImageRotation from 'image-rotation'

export const resizeCanvas = (fcanvas, zoom, prevZoom, pageWidth) => {
  let orientation = fcanvas.width > fcanvas.height ? 'landscape' : 'portrait'
  let backgroundImage = fcanvas._objects[0]
  let scaleFactor =
    (orientation === 'portrait'
      ? pageWidth / fcanvas.width
      : pageWidth / fcanvas.height) * zoom
  let bgScaleFactor =
    (orientation === 'portrait'
      ? pageWidth / backgroundImage.width
      : pageWidth / backgroundImage.height) * zoom

  backgroundImage.set({
    scaleX: bgScaleFactor,
    scaleY: bgScaleFactor
  })

  fcanvas.setDimensions({
    width:
      orientation === 'portrait'
        ? pageWidth * zoom
        : fcanvas.width * scaleFactor,
    height:
      orientation === 'portrait'
        ? fcanvas.height * scaleFactor
        : pageWidth * zoom
  })

  fcanvas._objects.forEach((obj, i) => {
    if (i === 0) return

    /* Calculation for position of object after zooming
    We have to calculate the position of the object relative to previous position and adjust by multiplying by certain factor

    Hence,
    obj.leftPrev    ---> prevZoom
    obj.left        ---> zoom
    
    Hence, obj.left = obj.LeftPrev * (zoom / prevZoom).
    Same logic applies to obj.top
    */

    /* Calculation of scaling for objects after zooming
    We have to calculate how much to scale object relative to the previous zoom level.
    
    Hence,
    obj.scaleXPrev    ---> prevZoom
    obj.scaleX        ---> zoom

    Hence, obj.scaleX = obj.scaleXPrev * (zoom / prevZoom).
    Same logic applies to obj.scaleY
    */

    obj.set({
      left: obj.left * (zoom / prevZoom),
      top: obj.top * (zoom / prevZoom),
      scaleX: obj.scaleX * (zoom / prevZoom),
      scaleY: obj.scaleY * (zoom / prevZoom)
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
