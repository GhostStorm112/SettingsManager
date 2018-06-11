const mongoose = require('mongoose')
const settingsSchema = mongoose.Schema({
  type: String,
  id: String,
  data: {}
})
const settingsModel = mongoose.model('settings', settingsSchema)
module.exports = settingsModel
