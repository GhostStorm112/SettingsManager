const SettingModel = require('./DB/setting.mongo')
const SubsettingModel = require('./DB/subsetting.mongo')
const mongoose = require('mongoose')
mongoose.Promise = Promise

class SettingsController {
  constructor (opts) {
    this.dburl = opts.dburl
  }
  async init () {
    try {
      await mongoose.connect(this.dburl)
    } catch (e) {
      console.log('Unable to connect to Mongo Server.')
    }
  }
  async getSetting (settingType, settingId) {
    return SettingModel.findOne({type: settingType, id: settingId}, {_id: 0, __v: -0})
  }

  async updateSetting (settingType, settingId, settingData) {
    const setting = await this.getSetting(settingType, settingId)
    if (setting) {
      await this._updateSetting(settingType, settingId, settingData)
      setting.data = settingData
      return setting
    }
    return this._createSetting(settingType, settingId, settingData)
  }

  async _createSetting (settingType, settingId, settingData) {
    const setting = new SettingModel({
      id: settingId,
      type: settingType,
      data: settingData
    })
    await setting.save()
    return setting
  }

  async _updateSetting (settingType, settingId, settingData) {
    return SettingModel.update({id: settingId, type: settingType}, {$set: {data: settingData}})
  }

  async deleteSetting (settingType, settingId) {
    const setting = await this.getSetting(settingType, settingId)
    if (setting) {
      await this._deleteSetting(settingType, settingId)
      return setting
    }
    return null
  }

  async _deleteSetting (settingType, settingId) {
    return SettingModel.remove({id: settingId, type: settingType})
  }

  async getSubsettings (settingType, settingId, subType) {
    return SubsettingModel.find({type: settingType, id: settingId, subType}, {_id: 0, __v: 0})
  }

  async getSubsetting (settingType, settingId, subType, subId) {
    return SubsettingModel.findOne({type: settingType, id: settingId, subType, subId}, {_id: 0, __v: 0})
  }

  async updateSubsetting (settingType, settingId, subType, subId, data) {
    const subsetting = await this.getSubsetting(settingType, settingId, subType, subId)
    if (subsetting) {
      await this._updateSubsetting(settingType, settingId, subType, subId, data)
      subsetting.data = data
      return subsetting
    }
    return this._createSubsetting(settingType, settingId, subType, subId, data)
  }

  async _updateSubsetting (settingType, settingId, subType, subId, data) {
    return SubsettingModel.update({type: settingType, id: settingId, subType, subId}, {$set: {data}})
  }

  async _createSubsetting (settingType, settingId, subType, subId, data) {
    const setting = new SubsettingModel({
      id: settingId,
      type: settingType,
      data,
      subId,
      subType
    })
    await setting.save()
    return setting
  }

  async deleteSubsetting (settingType, settingId, subType, subId) {
    const subsetting = await this.getSubsetting(settingType, settingId, subType, subId)
    if (subsetting) {
      await SubsettingModel.remove({type: settingType, id: settingId, subType, subId})
      return subsetting
    }
    return null
  }
}

module.exports = SettingsController
