const { PDFDocument, degrees, rgb } = require('pdf-lib')
const { writeFile, readFile } = require('fs').promises

const test = async (drive, base, id) => {
  let pdfBlob = await drive.get(`${id}.pdf`)
  let jsonBlob = await drive.get(`${id}.json`)

  let pdf = await pdfBlob.arrayBuffer()
  let json = JSON.parse(await jsonBlob.text())
  let doc = await PDFDocument.load(pdf)
  doc = await preprocess(json.preprocess, id, doc)
  // let dataurl = await edit(json.pages, doc)
  let dataurl = await doc.save()
  console.log(dataurl)
  // dataurl = dataurl.replace(/^data:application\/pdf;base64,/, '')
  // await writeFile('test.pdf', dataurl, 'base64', err => console.log(err))
}

const edit = async (pages, doc) => {
  let objects = {
    images: {
      // [canvasID]: [ array of images on that canvas ]
    },
    textboxes: {
      // [canvasID]: [ array of textboxes on that canvas ]
    }
  }
  pages.forEach(({ id, objects: o }, i) => {
    let imgs = o.filter((obj, j) => j !== 0 && obj.type === 'image')
    let textboxes = o.filter((obj, j) => j !== 0 && obj.type === 'textbox')
    objects.images[id] = imgs
    objects.textboxes[id] = textboxes
  })

  await writeFile('test.json', JSON.stringify(objects), 'utf-8', err =>
    console.log(err)
  )

  console.log(pages)
}

const preprocess = async (preprocess, id, doc) => {
  // Get all PDF pages and add their respective ids to an array
  let pdfPages = await doc.getPages()
  let pages = pdfPages.map((page, i) => {
    return `${id}-${i + 1}`
  })

  /* Remove all pages that need to be deleted
  Use PDFDocument.removePage(PDFPage index)
  */
  let deletions = preprocess.reduce((acc, instruction) => {
    if (instruction.type === 'delete') {
      acc.push(instruction.id)
    }
    return acc
  }, [])

  /* Rotate pages that need to be rotated
  (doesn't include pages that are to be removed)
  Use PDFPage.setRotation
  */
  let rotations = preprocess.reduce((acc, instruction) => {
    if (instruction.type === 'rotate' && !deletions.includes(instruction.id)) {
      acc.push(instruction)
    }
    return acc
  }, [])

  /* Remove pages that need to be switched i.e. moved up/down
  (doesn't include pages that are to be removed)
  Use a combination of PDFDocument.addPage and PDFDocument.copyPages
  */
  let switches = preprocess.reduce((acc, instruction) => {
    if (
      instruction.type === 'switch' &&
      instruction.switch.reduce((a, c) => {
        a = a && !deletions.includes(c.id)
        return a
      }, true)
    ) {
      acc.push(instruction.switch)
    }
    return acc
  }, [])

  // Execute preprocessing instructions
  let afterDeletions = deletePages(pages, deletions)
  let data = await switchPages(doc, afterDeletions, switches) // data = {doc, switchedIndices}
  let newDoc = await rotatePages(data, rotations)

  let pg = await newDoc.getPages()[0]
  // let img = await readFile('./images/arrow.png', err => console.log(err))
  // pngImg = await newDoc.embedPng(img)
  // pg.drawImage(pngImg, {
  //   x: 50,
  //   y: 50,
  //   width: 500,
  //   height: 500
  // })
  return newDoc
}

const deletePages = (pages, deletions) => {
  let newPages = pages.filter(id => !deletions.includes(id))
  return newPages
}

const switchPages = async (oldDoc, pages, switches) => {
  let switchedPages = switches.reduce((acc, switchInstruction) => {
    let [firstID, secondID] = switchInstruction
    let firstIndex = pages.indexOf(firstID)
    let secondIndex = pages.indexOf(secondID)
    acc[firstIndex] = secondID
    acc[secondIndex] = firstID
    return acc
  }, pages)
  let switchedIndices = switchedPages.map(id =>
    parseInt(id.split('-')[id.split('-').length - 1])
  )
  let doc = await PDFDocument.create()
  let newPages = await doc.copyPages(
    oldDoc,
    switchedIndices.map(i => i - 1)
  )
  newPages.forEach(page => {
    doc.addPage(page)
  })
  return {
    doc,
    switchedIndices
  }
}

const rotatePages = async ({ doc, switchedIndices }, rotations) => {
  rotations.forEach(async ({ id, angle }) => {
    let i = parseInt(id.split('-')[id.split('-').length - 1])
    let pageIndex = switchedIndices.indexOf(i)
    let page = await doc.getPage(pageIndex)
    page.setRotation(degrees(angle))
  })
  return doc
}
module.exports = { test }
