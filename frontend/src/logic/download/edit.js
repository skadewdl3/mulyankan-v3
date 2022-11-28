import { degrees, rgb } from 'pdf-lib'
import { store } from '@/store/index'
import { toRaw } from 'vue'
import axios from 'axios'
import fontKit from '@pdf-lib/fontkit'
import { hexToRgb } from '@/helpers/color'
import { getReducedAngle, downloadURI } from '@/helpers/miscellaneous'

export const executeEditing = async (doc, updateProgress) => {
  doc.registerFontkit(fontKit)
  let fcanvases = toRaw(store.state.images)
  let pages = fcanvases.reduce((acc, fcanvas) => {
    let objects = fcanvas._objects.map(obj =>
      obj.toJSON(['imgColor', 'textType', 'id', 'zoom'])
    )
    let id = fcanvas.id
    acc = [...acc, { id, objects }]
    return acc
  }, [])
  let backgroundImages = fcanvases.reduce((acc, fcanvas) => {
    acc = [...acc, fcanvas._objects[0]]
    return acc
  }, [])
  let objects = pages.reduce((acc, page) => {
    let objs = page.objects
    if (!acc.images) acc.images = []
    if (!acc.textboxes) acc.textboxes = []
    let images = objs.filter((obj, i) => obj.type === 'image' && i !== 0)

    acc.images = [...acc.images, images]
    let textboxes = objs.filter(obj => obj.type === 'textbox')

    acc.textboxes = [...acc.textboxes, textboxes]
    return acc
  }, {})
  let newDoc = await addSymbols(objects, backgroundImages, doc)
  newDoc = await addText(objects, backgroundImages, newDoc)
  let dataurl = await newDoc.saveAsBase64({ dataUri: true })
  downloadURI(dataurl, 'test.pdf')
  return doc
}

const addSymbols = async (objects, backgroundImages, doc) => {
  return new Promise(async (resolve, reject) => {
    let symbols = {}
    objects.images.forEach(imgs => {
      imgs.forEach(img => {
        let id = img.src.split('/').slice(-1)[0].split('.')[0]
        if (!symbols[id]) {
          symbols[id] = 1
        }
      })
    })

    for (let id in symbols) {
      let { data } = await axios.get(`%BASE_URL%/images/${id}.png`, {
        responseType: 'arraybuffer'
      })
      symbols[id] = data
    }

    objects.images.forEach(async (imgs, i) => {
      let bg = backgroundImages[i]
      let page = await doc.getPage(i)
      let rotation = page.getRotation().angle
      let reducedRotation = getReducedAngle(rotation) // Always either 0, 90, 180, or 270
      if (reducedRotation === 0) {
        imgs.forEach(async img => {
          let id = img.src.split('/').slice(-1)[0].split('.')[0]
          let pdfImg = await doc.embedPng(symbols[id])
          let scaleX = page.getWidth() / (bg.width * bg.scaleX)
          let scaleY = page.getHeight() / (bg.height * bg.scaleY)
          let imgWidth = img.width * img.scaleX * scaleX
          let imgHeight = img.height * img.scaleY * scaleY
          let xCoord = img.left * scaleX
          let yCoord = page.getHeight() - img.top * scaleY - imgHeight

          /*
          img.left -> bg.width * scaleX
          xcoord -> pageWidth

          img.width * img.scaleX -> bg.width * scaleX
          width -> pageWidth

          img.width * img.scaleX / scaleX
          */

          page.drawImage(pdfImg, {
            width: imgWidth,
            height: imgHeight,
            x: xCoord,
            y: yCoord,
            rotate: degrees(0)
          })
        })
      } else if (reducedRotation === 90) {
        imgs.forEach(async img => {
          let id = img.src.split('/').slice(-1)[0].split('.')[0]
          let pdfImg = await doc.embedPng(symbols[id])
          let scaleY = page.getHeight() / (bg.width * bg.scaleX)
          let scaleX = page.getWidth() / (bg.height * bg.scaleY)
          let imgWidth = img.width * img.scaleX * scaleX
          let imgHeight = img.height * img.scaleY * scaleY
          let xCoord = img.top * scaleY + imgHeight
          let yCoord = img.left * scaleX
          page.drawImage(pdfImg, {
            width: imgWidth,
            height: imgHeight,
            x: xCoord,
            y: yCoord,
            rotate: degrees(90)
          })
        })
      } else if (reducedRotation === 180) {
        imgs.forEach(async img => {
          let id = img.src.split('/').slice(-1)[0].split('.')[0]
          let pdfImg = await doc.embedPng(symbols[id])
          let scaleX = page.getWidth() / (bg.width * bg.scaleX)
          let scaleY = page.getHeight() / (bg.height * bg.scaleY)
          let imgWidth = img.width * img.scaleX * scaleX
          let imgHeight = img.height * img.scaleY * scaleY
          let xCoord = page.getWidth() - img.left * scaleX
          let yCoord = img.top * scaleY + imgHeight

          /*
          img.left -> bg.width * scaleX
          xcoord -> pageWidth

          img.width * img.scaleX -> bg.width * scaleX
          width -> pageWidth

          img.width * img.scaleX / scaleX
          */

          page.drawImage(pdfImg, {
            width: imgWidth,
            height: imgHeight,
            x: xCoord,
            y: yCoord,
            rotate: degrees(180)
          })
        })
      } else if (reducedRotation === 270) {
        imgs.forEach(async img => {
          let id = img.src.split('/').slice(-1)[0].split('.')[0]
          let pdfImg = await doc.embedPng(symbols[id])
          let scaleX = page.getHeight() / (bg.width * bg.scaleX)
          let scaleY = page.getWidth() / (bg.height * bg.scaleY)
          let imgWidth = img.width * img.scaleX * scaleX
          let imgHeight = img.height * img.scaleY * scaleY
          let xCoord = page.getWidth() - img.top * scaleY - imgHeight
          let yCoord = page.getHeight() - img.left * scaleX
          page.drawImage(pdfImg, {
            width: imgWidth,
            height: imgHeight,
            x: xCoord,
            y: yCoord,
            rotate: degrees(270)
          })
        })
      }
      if (i === objects.images.length - 1) {
        resolve(doc)
      }
    })
  })
}

const addText = async (objects, backgroundImages, doc) => {
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
