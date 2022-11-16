const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const { uploadJSON } = require('./js/detaFunctions')
const { Deta } = require('deta')
const { projectKey } = require('./js/credentials')

const deta = Deta(projectKey)

const app = express()
app.use(bodyParser.json())
app.use(cors())
app.use(fileUpload())

app.get('/', (req, res) => {
  res.json({ message: 'API is working' })
})

app.post('/save', async (req, res) => {
  const pdfDrive = deta.Drive('test')
  const pdfBase = deta.Base('test')
  console.log(req.files.pdf.data)
  let list = await uploadJSON(pdfDrive, pdfBase, req.files.pdf.data)
  res.json({ message: 'File uploaded successfully', list })
})

const port = process.env.PORT || 8080
app.listen(port)

module.exports = app
