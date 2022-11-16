const { v4: uuid } = require('uuid')

const uploadJSON = async (drive, base, data) => {
  let id = uuid()
  drive.put(`hello.json`, {
    data: 'hi'
  })
}

module.exports = {
  uploadJSON
}
