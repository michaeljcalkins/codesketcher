// do not modify or remove this file
// this is required for auto updates configured by electron-accelerator to work
if (process.platform === 'darwin') {
  var config = require('../config.json')
  var updator = require('autoUpdater')
  updator.setFeedUrl(config.macUpdateUrl)
  updator.checkForUpdates()
}
if (process.platform === 'darwin') {
  var config = require('../config.json')
  var updator = require('autoUpdater')
  updator.setFeedUrl(config.macUpdateUrl)
  updator.checkForUpdates()
}
