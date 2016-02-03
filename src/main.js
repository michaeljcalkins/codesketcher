// set up any autoupdating functionality as defined by electron-accelerator
// require('./updater')

var app = require('app')
var BrowserWindow = require('browser-window')

// Report crashes to our server.
require('crash-reporter').start()

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null
// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', function () {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: 'CodeSketcher',
    center: true,
    titleBarStyle: 'hidden-inset'
  })
  mainWindow.loadUrl('file://' + __dirname + '/browser/index.html')

  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
})

app.on('window-all-closed', function () {
  app.quit()
})
