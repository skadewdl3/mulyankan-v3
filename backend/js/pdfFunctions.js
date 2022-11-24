const { PDFDocument } = require('pdf-lib')
const { writeFile } = require('fs').promises

const test = async (drive, base, id) => {
  let pdfBlob = await drive.get(`${id}.pdf`)
  let jsonBlob = await drive.get(`${id}.json`)

  let pdf = await pdfBlob.arrayBuffer()
  let json = JSON.parse(await jsonBlob.text())

  let doc = await PDFDocument.load(pdf)
  await preprocess(json.preprocess, id, doc)
  // dataurl = dataurl.replace(/^data:application\/pdf;base64,/, '')
  // await writeFile('test.pdf', dataurl, 'base64', err => console.log(err))
}

const preprocess = async (preprocess, id, doc) => {
  const pdfPages = doc.getPages()
  let pages = pdfPages.map((page, i) => {
    return { page, id: `${id}-${i}` }
  })
  // console.log(pages)
  console.log(preprocess)
}

module.exports = { test }
