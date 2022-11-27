const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const {
  updatePDF,
  uploadPDF,
  getProject,
  deleteProject,
  downloadPDF
} = require('./js/detaFunctions')
const { Deta } = require('deta')
const { projectKey: defaultProjectKey } = require('./js/credentials')
const { getDocs, docsStructure } = require('./js/docs')
const { languages, getTranslations } = require('./js/translations')
const { getSymbols } = require('./js/pdfFunctions')

let projectKey = process.env.DETA_PROJECT_KEY || defaultProjectKey

let docs = getDocs()
let translations = getTranslations()
let symbols = getSymbols()

const deta = Deta(projectKey)

const app = express()
app.use(bodyParser.json())
app.use(cors())
app.use(fileUpload())
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.json({ message: 'API is working' })
})

app.post('/save', async (req, res) => {
  let base = deta.Base('test')
  let drive = deta.Drive('test')
  let fileName = req.body.name
  let file = { ...req.files.pdf, name: fileName }
  let id = await uploadPDF(drive, base, file)
  res.json({ id })
})

app.post('/update/:id', async (req, res) => {
  let base = deta.Base('test')
  let drive = deta.Drive('test')

  let id = req.params.id
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
  let settingsList = await base.fetch()
  if (settingsList.items.length === 0) {
    await base.put('en', 'locale')
    await base.put('#ff0000', 'color')
    settingsList = await base.fetch()
  }
  let settings = settingsList.items.reduce((acc, setting) => {
    acc[setting.key] = setting.value
    return acc
  }, {})
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

app.get('/setup', async (req, res) => {
  let base = deta.Base('setup')
  let setupList = await base.fetch()
  if (setupList.items.length === 0) {
    await base.put('incomplete', 'status')
    setupList = await base.fetch()
  }
  let setup = setupList.items.reduce((acc, setting) => {
    acc[setting.key] = setting.value
    return acc
  }, {})
  res.json(setup)
})

app.post('/setup', async (req, res) => {
  let base = deta.Base('setup')
  await base.put(req.body.status, 'status')
  res.json({ message: `Status set to ${req.body.status}` })
})

// app.post('/test', async (req, res) => {
//   let start = process.hrtime()
//   let drive = deta.Drive('test')
//   let base = deta.Base('test')
//   let id = req.body.id
//   let json = await test(drive, base, id)
//   let end = process.hrtime(start)
//   console.info('Execution time (hr): %ds %dms', end[0], end[1] / 1000000)
// })

app.post('/download', async (req, res) => {
  let id = req.body.id
  let drive = deta.Drive('test')
  let pdfBuffer = await downloadPDF(drive, id)
  res.json(pdfBuffer)
})

app.post('/symbol', (req, res) => {
  let id = req.body.id
  res.json(symbols[id])
})

const port = process.env.PORT || 8080
app.listen(port)

module.exports = app
