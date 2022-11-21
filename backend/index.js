const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const {
  updatePDF,
  uploadPDF,
  getProject,
  deleteProject
} = require('./js/detaFunctions')
const { Deta } = require('deta')
const { projectKey: defaultProjectKey } = require('./js/credentials')
const { getDocs, docsStructure } = require('./js/docs')
const { languages, getTranslations } = require('./js/translations')

let projectKey = process.env.DETA_PROJECT_KEY || defaultProjectKey

let docs = getDocs()
let translations = getTranslations()

const deta = Deta(projectKey)

const app = express()
app.use(bodyParser.json())
app.use(cors())
app.use(fileUpload())

app.get('/', (req, res) => {
  res.json({ message: 'API is working' })
})

app.post('/save', async (req, res) => {
  let base = deta.Base('test')
  let drive = deta.Drive('test')
  console.log(req.files.pdf)
  let id = await uploadPDF(drive, base, req.files.pdf)
  res.json({ id })
})

app.post('/update/:id', async (req, res) => {
  let base = deta.Base('test')
  let drive = deta.Drive('test')

  let id = req.params.id
  console.log(req.files.pdf.data)
  await updatePDF(drive, id, req.files.pdf.data)
  res.json({ received: req.files.pdf.data.toString() })
})

app.get('/projects', async (req, res) => {
  let base = deta.Base('test')
  let projects = await base.fetch()
  res.json(projects)
})

app.get('/getproject/:id', async (req, res) => {
  let base = deta.Base('test')
  let drive = deta.Drive('test')

  let id = req.params.id
  let r = await getProject(drive, base, id)
  res.json(r)
})

app.get('/deleteproject/:id', async (req, res) => {
  let base = deta.Base('test')
  let drive = deta.Drive('test')
  let id = req.params.id
  let r = await deleteProject(drive, base, id)
  res.json(r)
})

app.get('/docs', async (req, res) => {
  res.json(docsStructure)
})

app.get('/languages', async (req, res) => {
  res.json(languages)
})

app.get('/settings', async (req, res) => {
  let base = deta.Base('settings')
  let settings = await base.fetch()
  if (settings.items.length === 0) {
    await base.put('en', 'locale')
    await base.put('#ff0000', 'color')
    settings = await base.fetch()
  }
  res.json(settings)
})

app.post('/updatesettings', async (req, res) => {
  let base = deta.Base('settings')
  let prevSettingsList = await base.fetch()
  let prevSettings = prevSettingsList.items.reduce((acc, setting) => {
    acc[setting.key] = setting.value
    return acc
  }, {})
  let newSettings = req.body.data.settings
  let diff = {}
  for (let newSetting in newSettings) {
    if (prevSettings[newSetting] !== newSettings[newSetting]) {
      diff[newSetting] = newSettings[newSetting]
    }
  }
  for (difference in diff) {
    await base.put(diff[difference], difference)
  }
  res.json(diff)
})

app.post('/getlang', async (req, res) => {
  const locale = req.body.data.locale
  if (!translations[locale]) res.json({ error: 'Language not found' })
  console.log(translations[locale])
  res.json(translations[locale])
})

app.post('/getdoc', async (req, res) => {
  const category = req.body.data.category
  const subcategory = req.body.data.subcategory
  const doc = docs[category][subcategory]
  res.json({ doc })
})

app.get('/refreshdocs', (req, res) => {
  docs = getDocs()
  res.json({ message: 'Docs refreshed' })
})

app.get('/refreshtl', (req, res) => {
  translations = getTranslations()
  res.json({ message: 'Translations refreshed' })
})

const port = process.env.PORT || 8080
app.listen(port)

module.exports = app
