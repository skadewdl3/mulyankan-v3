import { PDFDocument, degrees, rgb } from 'pdf-lib'
import { store } from '@/store/index'
import { toRaw } from 'vue'
import axios from 'axios'
import { bufferToArrayBuffer, binaryStringToBase64 } from '@/logic/pdfFunctions'
import { roundOff } from '@/store/mutations'
import fontKit from '@pdf-lib/fontkit'
import { hexToRgb } from './colorCalculator'

const downloadURI = (uri, name) => {
  var link = document.createElement('a')
  link.download = name
  link.href = uri
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const retrieveDocument = async updateProgress => {
  updateProgress(1)
  let { data: buffer } = await axios.post('%BASE_URL%/download', {
    id: store.state.projectID
  })
  let arrayBuffer = bufferToArrayBuffer(buffer.data)
  let doc = await PDFDocument.load(arrayBuffer)
  updateProgress(5)
  return doc
}

export const executePreprocessing = async (doc, updateProgress) => {
  let instructions = [...toRaw(store.state.preprocessInstructions)]

  let deletions = instructions.reduce((acc, instruction) => {
    if (instruction.type === 'delete') {
      let id = instruction.id
      let deleteIndex = parseInt(id.split('-').slice(-1)[0] - 1)
      acc.push(deleteIndex)
    }
    return acc
  }, [])
  let rotations = instructions.reduce((acc, instruction) => {
    if (instruction.type === 'rotate' && !deletions.includes(instruction.id)) {
      acc.push({
        angle: instruction.angle,
        rotateIndex: parseInt(instruction.id.split('-').slice(-1)[0] - 1)
      })
    }
    return acc
  }, [])
  let switches = instructions.reduce((acc, instruction) => {
    if (
      instruction.type === 'switch' &&
      instruction.switch.reduce((a, c) => {
        a = a && !deletions.includes(c.id)
        return a
      }, true)
    ) {
      let firstID = instruction.switch[0]
      let secondID = instruction.switch[1]

      let firstSwitchIndex = parseInt(firstID.split('-').slice(-1)[0] - 1)
      let secondSwitchIndex = parseInt(secondID.split('-').slice(-1)[0] - 1)
      acc.push([firstSwitchIndex, secondSwitchIndex])
    }
    return acc
  }, [])
  deletions.forEach((deleteIndex, i) => {
    doc.removePage(deleteIndex)
  })
  updateProgress(20)
  rotations.forEach(async ({ angle, rotateIndex }) => {
    updateProgress(20)
    let page = await doc.getPage(rotateIndex)
    page.setRotation(degrees(page.getRotation().angle + angle))
  })
  updateProgress(35)
  let pages = await doc.getPages()
  switches.forEach(async ([firstIndex, secondIndex], i) => {
    doc.removePage(firstIndex)
    doc.insertPage(firstIndex, pages[secondIndex])
    doc.removePage(secondIndex)
    doc.insertPage(secondIndex, pages[firstIndex])
  })
  updateProgress(50)
  return doc
}

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

const getReducedAngle = rotation => {
  /*
  This function is used to reduce any angle from 0 - Infinity to the principal range of 0 - 360 degrees
  sin 0 = 0   cos0 = 1 (Note that 360 deg is equivalent to 0 deg)
  sin 90 = 1  cos90 = 0
  sin 180 = 0 cos180 = -1
  sin 270 = -1 cos270 = 0
  */

  const toRadians = angle => angle * (Math.PI / 180)
  const sine = angle => roundOff(Math.sin(toRadians(angle)), 1)
  const cosine = angle => roundOff(Math.cos(toRadians(angle)), 1)
  if (sine(rotation) === 0 && cosine(rotation) === 1) {
    return 0
  } else if (sine(rotation) === 1 && cosine(rotation) === 0) {
    return 90
  } else if (sine(rotation) === 0 && cosine(rotation) === -1) {
    return 180
  } else if (sine(rotation) === -1 && cosine(rotation) === 0) {
    return 270
  }
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
          let yCoord = page.getHeight() - text.top * scaleY - 0.785 * lineHeight
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
      }
      // else if (reducedRotation === 180) {
      //   imgs.forEach(async img => {
      //     let id = img.src.split('/').slice(-1)[0].split('.')[0]
      //     let pdfImg = await doc.embedPng(symbols[id])
      //     let scaleX = page.getWidth() / (bg.width * bg.scaleX)
      //     let scaleY = page.getHeight() / (bg.height * bg.scaleY)
      //     let imgWidth = img.width * img.scaleX * scaleX
      //     let imgHeight = img.height * img.scaleY * scaleY
      //     let xCoord = page.getWidth() - img.left * scaleX
      //     let yCoord = img.top * scaleY + imgHeight

      //     /*
      //     img.left -> bg.width * scaleX
      //     xcoord -> pageWidth

      //     img.width * img.scaleX -> bg.width * scaleX
      //     width -> pageWidth

      //     img.width * img.scaleX / scaleX
      //     */

      //     page.drawImage(pdfImg, {
      //       width: imgWidth,
      //       height: imgHeight,
      //       x: xCoord,
      //       y: yCoord,
      //       rotate: degrees(180)
      //     })
      //   })
      // } else if (reducedRotation === 270) {
      //   imgs.forEach(async img => {
      //     let id = img.src.split('/').slice(-1)[0].split('.')[0]
      //     let pdfImg = await doc.embedPng(symbols[id])
      //     let scaleX = page.getHeight() / (bg.width * bg.scaleX)
      //     let scaleY = page.getWidth() / (bg.height * bg.scaleY)
      //     let imgWidth = img.width * img.scaleX * scaleX
      //     let imgHeight = img.height * img.scaleY * scaleY
      //     let xCoord = page.getWidth() - img.top * scaleY - imgHeight
      //     let yCoord = page.getHeight() - img.left * scaleX
      //     page.drawImage(pdfImg, {
      //       width: imgWidth,
      //       height: imgHeight,
      //       x: xCoord,
      //       y: yCoord,
      //       rotate: degrees(270)
      //     })
      //   })
      // }
      if (i === objects.images.length - 1) {
        resolve(doc)
      }
    })
  })
}
