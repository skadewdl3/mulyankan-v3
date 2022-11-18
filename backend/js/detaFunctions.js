const { v4: uuid } = require('uuid')

const updatePDF = async (drive, id, data) => {
  // drive.put(`${id}.json`, { data })
  await drive.put(`${id}.json`, { data })
}

const generateValidID = async (drive, setID) => {
  let id = uuid()
  let res = await drive.get(`${id}.pdf`)
  if (res) {
    generateValidID(drive, setID)
  } else {
    setID(id)
  }
}

const uploadPDF = async (drive, base, { name, data }) => {
  let id = ''
  let setID = x => (id = x)
  await generateValidID(drive, setID)
  await drive.put(`${id}.pdf`, { data })
  await base.put({ name }, id)
  return id
}

const getProject = async (drive, base, id) => {
  let res = await base.get(id)
  if (!res) return { type: 'error', message: `Project doesn't exist.` }
  let json = await drive.get(`${id}.json`)
  if (json) {
    let buffer = Buffer.from(await json.arrayBuffer())
    return { key: id, type: 'json', buffer }
  } else {
    let pdf = await drive.get(`${id}.pdf`)
    let buffer = Buffer.from(await pdf.arrayBuffer())
    return { key: id, type: 'pdf', buffer }
  }
}

const deleteProject = async (drive, base, id) => {
  console.log(id)
  await base.delete(id).catch(err => {
    return { type: 'error', message: err }
  })
  await drive.delete(`${id}.json`).catch(console.log('no json exists'))
  await drive.delete(`${id}.pdf`).catch(err => {
    return { type: 'error', message: err }
  })
  return { type: 'delete', message: `Project deleted.` }
}

module.exports = {
  updatePDF,
  uploadPDF,
  getProject,
  deleteProject
}
