import { getReducedAngle } from '@/helpers/miscellaneous'
import { degrees } from 'pdf-lib'
import axios from 'axios'

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

export default addSymbols
