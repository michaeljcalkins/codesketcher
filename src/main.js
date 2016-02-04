'use strict'


// Report crashes to our server.
require('crash-reporter').start({
    companyName: 'CodeSketcher',
    submitURL: 'http://www.michaeljcalkins.com'
})

const electron = require('electron')

// Module to control application life.
const app = electron.app

// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow


//
// var pkg = require('../package.json') // Insert your app's manifest here
// var updater = require('../../electron-auto-updater')
// var upd = new updater(pkg)
// var copyPath, execPath
//
// // Args passed when new app is launched from temp dir during update
// if(gui.App.argv.length) {
//     // ------------- Step 5 -------------
//     copyPath = gui.App.argv[0];
//     execPath = gui.App.argv[1];
//
//     // Replace old app, Run updated app from original location and close temp instance
//     upd.install(copyPath, function(err) {
//         if(!err) {
//
//             // ------------- Step 6 -------------
//             upd.run(execPath, null);
//             gui.App.quit();
//         }
//     });
// }
// else { // if no arguments were passed to the app
//     // ------------- Step 1 -------------
//     upd.checkNewVersion(function(error, newVersionExists, manifest) {
//         if (!error && newVersionExists) {
//
//             // ------------- Step 2 -------------
//             upd.download(function(error, filename) {
//                 if (!error) {
//
//                     // ------------- Step 3 -------------
//                     upd.unpack(filename, function(error, newAppPath) {
//                         if (!error) {
//
//                             // ------------- Step 4 -------------
//                             upd.runInstaller(newAppPath, [upd.getAppPath(), upd.getAppExec()],{})
//                             app.quit()
//                         }
//                     }, manifest)
//                 }
//             }, manifest)
//         }
//     })
// }



function createWindow () {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        title: 'Code Sketcher',
        center: true,
        titleBarStyle: 'hidden-inset'
    })

    // and load the index.html of the app.
    mainWindow.loadURL('file://' + __dirname + '/browser/index.html')

    // Open the DevTools.
    mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
})
