const { PDFDocument, degrees } = require('pdf-lib')
const { writeFile } = require('fs').promises

const test = async (drive, base, id) => {
  let pdfBlob = await drive.get(`${id}.pdf`)
  let jsonBlob = await drive.get(`${id}.json`)

  let pdf = await pdfBlob.arrayBuffer()
  let json = JSON.parse(await jsonBlob.text())

  let doc = await PDFDocument.load(pdf)
  console.log(json.pages.map(f => f.id))
  let dataurl = await preprocess(json.preprocess, id, doc)
  // dataurl = dataurl.replace(/^data:application\/pdf;base64,/, '')
  await writeFile('test.pdf', dataurl, 'base64', err => console.log(err))
}

const preprocess = async (preprocess, id, doc) => {
  // Get all PDF pages and add them to an array along with respective ids
  let pdfPages = await doc.getPages()
  let pages = pdfPages.map((page, i) => {
    return `${id}-${i + 1}`
  })

  /*
  Get all pages that need to be removed
  Use PDFDocument.removePage(PDFPage index)
  */

  let deletions = preprocess.reduce((acc, instruction) => {
    if (instruction.type === 'delete') {
      acc.push(instruction.id)
    }
    return acc
  }, [])

  /*
  Remove pages that need to be removed
  (doesn't include pages that are to be removed)
  Use PDFPage.setRotation
  */

  let rotations = preprocess.reduce((acc, instruction) => {
    if (instruction.type === 'rotate' && !deletions.includes(instruction.id)) {
      acc.push(instruction)
    }
    return acc
  }, [])

  /*
  Remove pages that need to be switched i.e. moved up/down
  (doesn't include pages that are to be removed)
  Use a combination of PDFDocument.removePage and PDFDocument.insertPage
  https://github.com/Hopding/pdf-lib/issues/506
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

  let afterDeletions = deletePages(pages, deletions)

  let data = await switchPages(doc, afterDeletions, switches)

  let newDoc = await rotatePages(data, rotations)
  let dataurl = await newDoc.saveAsBase64()
  return dataurl
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
  console.log(switchedIndices)
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
  console.log(await doc.getPages().length)
  console.log(rotations)
  console.log(switchedIndices)
  rotations.forEach(async ({ id, angle }) => {
    let i = parseInt(id.split('-')[id.split('-').length - 1])
    let pageIndex = switchedIndices.indexOf(i)
    let page = await doc.getPage(pageIndex)
    console.log(angle)
    page.setRotation(degrees(angle))
  })
  return doc
}
module.exports = { test }
