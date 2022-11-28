import { getReducedAngle } from '@/helpers/miscellaneous'
import { degrees, rgb } from 'pdf-lib'
import { hexToRgb } from '@/helpers/color'
import axios from 'axios'

const importFontkit = () => {
  return new Promise((resolve, reject) => {
    import('@pdf-lib/fontkit').then(({ default: fontkit }) => {
      resolve(fontkit)
    })
  })
}

const addText = async (objects, backgroundImages, doc) => {
  const fontKit = await importFontkit()
  doc.registerFontkit(fontKit)
  return new Promise(async (resolve, reject) => {
    let fonts = {}
    objects.textboxes.forEach(texts => {
      texts.forEach(text => {
        let fontFamily = text.fontFamily
        if (!fonts[fontFamily]) {
          fonts[fontFamily] = 1
        }
      })
    })

    for (let font in fonts) {
      let { data } = await axios.get(`%BASE_URL%/fonts/${font}.ttf`, {
        responseType: 'arraybuffer'
      })
      fonts[font] = await doc.embedFont(data)
    }
    objects.textboxes.forEach(async (texts, i) => {
      let bg = backgroundImages[i]
      let page = await doc.getPage(i)
      let rotation = page.getRotation().angle
      let reducedRotation = getReducedAngle(rotation) // Always either 0, 90, 180, or 270
      console.log(texts)
      if (reducedRotation === 0) {
        texts.forEach(async text => {
          let scaleX = page.getWidth() / (bg.width * bg.scaleX)
          let scaleY = page.getHeight() / (bg.height * bg.scaleY)
          console.log(scaleX, scaleY)
          let textWidth = text.width * text.scaleX * scaleX
          let textHeight = text.height * text.scaleY * scaleY
          let lineHeight =
            text.fontSize * text.lineHeight * scaleY * text.scaleY
          let xCoord = text.left * scaleX
          // IDK where the 0.785 came from. I pulled it out of my ass so it aligns properly.
          let yCoord = page.getHeight() - text.top * scaleY - 0.9 * lineHeight
          let font = fonts[text.fontFamily]
          let { r, g, b } = hexToRgb(text.fill)
          r = r / 255
          g = g / 255
          b = b / 255

          /*
          img.left -> bg.width * scaleX
          xcoord -> pageWidth

          img.width * img.scaleX -> bg.width * scaleX
          width -> pageWidth

          img.width * img.scaleX / scaleX
          */
          page.drawText(text.text, {
            width: textWidth,
            height: textHeight,
            lineHeight,
            maxWidth: textWidth,
            size: text.fontSize * scaleY * text.scaleY,
            x: xCoord,
            y: yCoord,
            font,
            rotate: degrees(0),
            color: rgb(r, g, b)
          })
        })
      } else if (reducedRotation === 90) {
        texts.forEach(async text => {
          let scaleX = page.getWidth() / (bg.height * bg.scaleY)
          let scaleY = page.getHeight() / (bg.width * bg.scaleX)
          console.log(scaleX, scaleY)
          let textWidth = text.width * text.scaleX * scaleX
          let textHeight = text.height * text.scaleY * scaleY
          let lineHeight =
            text.fontSize * text.lineHeight * scaleY * text.scaleY
          // let xCoord = text.left * scaleX
          let xCoord = text.top * scaleY + 0.9 * lineHeight
          let yCoord = text.left * scaleX
          // IDK where the 0.785 came from. I pulled it out of my ass so it aligns properly.
          // let yCoord = page.getHeight() - text.top * scaleY - 0.785 * lineHeight
          let font = fonts[text.fontFamily]
          let { r, g, b } = hexToRgb(text.fill)
          r = r / 255
          g = g / 255
          b = b / 255

          /*
          img.left -> bg.width * scaleX
          xcoord -> pageWidth

          img.width * img.scaleX -> bg.width * scaleX
          width -> pageWidth

          img.width * img.scaleX / scaleX
          */
          page.drawText(text.text, {
            width: textWidth,
            height: textHeight,
            lineHeight,
            maxWidth: textWidth,
            size: text.fontSize * scaleY * text.scaleY,
            x: xCoord,
            y: yCoord,
            font,
            rotate: degrees(90),
            color: rgb(r, g, b)
          })
        })
      } else if (reducedRotation === 180) {
        texts.forEach(async text => {
          let scaleX = page.getWidth() / (bg.width * bg.scaleX)
          let scaleY = page.getHeight() / (bg.height * bg.scaleY)
          console.log(scaleX, scaleY)
          let textWidth = text.width * text.scaleX * scaleX
          let textHeight = text.height * text.scaleY * scaleY
          let lineHeight =
            text.fontSize * text.lineHeight * scaleY * text.scaleY
          // let xCoord = text.left * scaleX
          let xCoord = page.getWidth() - text.left * scaleX
          let yCoord = text.top * scaleY + 0.9 * lineHeight
          // IDK where the 0.785 came from. I pulled it out of my ass so it aligns properly.
          // let yCoord = page.getHeight() - text.top * scaleY - 0.785 * lineHeight
          let font = fonts[text.fontFamily]
          let { r, g, b } = hexToRgb(text.fill)
          r = r / 255
          g = g / 255
          b = b / 255

          /*
          img.left -> bg.width * scaleX
          xcoord -> pageWidth

          img.width * img.scaleX -> bg.width * scaleX
          width -> pageWidth

          img.width * img.scaleX / scaleX
          */
          page.drawText(text.text, {
            width: textWidth,
            height: textHeight,
            lineHeight,
            maxWidth: textWidth,
            size: text.fontSize * scaleY * text.scaleY,
            x: xCoord,
            y: yCoord,
            font,
            rotate: degrees(180),
            color: rgb(r, g, b)
          })
        })
      } else if (reducedRotation === 270) {
        texts.forEach(async text => {
          let scaleX = page.getWidth() / (bg.height * bg.scaleY)
          let scaleY = page.getHeight() / (bg.width * bg.scaleX)
          console.log(scaleX, scaleY)
          let textWidth = text.width * text.scaleX * scaleX
          let textHeight = text.height * text.scaleY * scaleY
          let lineHeight =
            text.fontSize * text.lineHeight * scaleY * text.scaleY
          // let xCoord = text.left * scaleX
          let xCoord = page.getWidth() - text.top * scaleY - 0.9 * lineHeight
          let yCoord = page.getHeight() - text.left * scaleX
          // IDK where the 0.785 came from. I pulled it out of my ass so it aligns properly.
          // let yCoord = page.getHeight() - text.top * scaleY - 0.785 * lineHeight
          let font = fonts[text.fontFamily]
          let { r, g, b } = hexToRgb(text.fill)
          r = r / 255
          g = g / 255
          b = b / 255

          /*
          img.left -> bg.width * scaleX
          xcoord -> pageWidth

          img.width * img.scaleX -> bg.width * scaleX
          width -> pageWidth

          img.width * img.scaleX / scaleX
          */
          page.drawText(text.text, {
            width: textWidth,
            height: textHeight,
            lineHeight,
            maxWidth: textWidth,
            size: text.fontSize * scaleY * text.scaleY,
            x: xCoord,
            y: yCoord,
            font,
            rotate: degrees(270),
            color: rgb(r, g, b)
          })
        })
      }
      if (i === objects.images.length - 1) {
        resolve(doc)
      }
    })
  })
}

export default addText
