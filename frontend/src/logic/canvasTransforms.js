import ImageRotation from 'image-rotation'

export const resizeCanvas = (fcanvas, zoom, pageWidth) => {
  let orientation = fcanvas.width > fcanvas.height ? 'landscape' : 'portrait'
  console.log(orientation)

  // BUG: Fix this shit where horizontal images are not being resized properly

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
  return new Promise((resolve, reject) => {
    let temp = []
    imageSources.forEach(async (src, i) => {
      let r = new ImageRotation(src)
      try {
        let res = await r.generate(
          i !== index ? 0 : direction === 'right' ? 90 : -90
        )
        temp.push(res)
        if (temp.length === imageSources.length) resolve(temp)
      } catch (err) {
        reject(err)
      }
    })
  })
}
