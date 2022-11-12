import ImageRotation from 'image-rotation'

export const resizeCanvas = (fcanvas, zoom, pageWidth) => {
  let backgroundImage = fcanvas._objects[0]
  let scaleFactor = (pageWidth / fcanvas.width) * zoom
  let bgScaleFactor = (pageWidth / backgroundImage.width) * zoom

  backgroundImage.set({
    scaleX: bgScaleFactor,
    scaleY: bgScaleFactor
  })

  fcanvas.setDimensions({
    width: pageWidth * zoom,
    height: fcanvas.height * scaleFactor
  })

  fcanvas.renderAll()
}

export const rotateCanvas = async (imageSources, direction, index = null) => {
  // If index is not provided, rotate all canvases
  if (!index) {
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
}
