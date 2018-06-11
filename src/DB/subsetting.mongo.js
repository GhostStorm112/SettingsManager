const mongoose = require('mongoose')
const subsettingsSchema = mongoose.Schema({
  type: String,
  id: String,
  subType: String,
  subId: String,
  data: {}
})
const subsettingsModel = mongoose.model('subsettings', subsettingsSchema)
module.exports = subsettingsModel
