const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const { updatePDF, uploadPDF, getProject } = require('./js/detaFunctions')
const { Deta } = require('deta')
const { projectKey } = require('./js/credentials')

const deta = Deta(projectKey)

const getDeta = id => {
  return {
    drive: deta.Drive(id),
    base: deta.Base(id)
  }
}

const app = express()
app.use(bodyParser.json())
app.use(cors())
app.use(fileUpload())

app.get('/', (req, res) => {
  res.json({ message: 'API is working' })
})

app.post('/save', async (req, res) => {
  const { drive, base } = getDeta('test')
  console.log(req.files.pdf)
  let id = await uploadPDF(drive, base, req.files.pdf)
  res.json({ id })
})

app.post('/update/:id', async (req, res) => {
  const { drive } = getDeta('test')
  let id = req.params.id
  console.log(req.files.pdf.data)
  await updatePDF(drive, id, req.files.pdf.data)
  res.json({ received: req.files.pdf.data.toString() })
})

app.get('/projects', async (req, res) => {
  const { base } = getDeta('test')
  let projects = await base.fetch()
  res.json(projects)
})

app.get('/getproject/:id', async (req, res) => {
  const { drive, base } = getDeta('test')
  let id = req.params.id
  let r = await getProject(drive, base, id)
  res.json(r)
})

const port = process.env.PORT || 8080
app.listen(port)

module.exports = app
