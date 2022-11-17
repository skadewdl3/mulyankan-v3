const { v4: uuid } = require('uuid')

const uploadJSON = async (drive, base, data) => {
  let id = uuid()
  drive.put(`${id}.json`, { data })
}

module.exports = {
  uploadJSON
}
