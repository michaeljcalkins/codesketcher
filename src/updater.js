'use strict'

var http = require('http')
var fs = require('fs')
var wrench = require('wrench')

var targz = require('tar.gz')

/*
 1. Check the manifest for version (from your running "old" app).
 2. If the version is different from the running one, download new package to a temp directory.
 3. Unpack the package in temp.
 4. Run new app from temp and kill the old one (i.e. still all from the running app).
 5. The new app (in temp) will copy itself to the original folder, overwriting the old app.
 6. The new app will run itself from original folder and exit the process.
*/

let Updater = {}

// If the version is different from the running one, download new package to a temp directory.
Updater.download = (config, cb) => {
    console.log('Downloading update to temporary directory...')

    var file = fs.createWriteStream('whatever.jpg')
    var request = http.get(config.macUpdateUrl, function(response) {
        response.pipe(file)
        file.on('finish', function() {
            file.close(cb)
        })
    })
}

Updater.packDirectory = () => {
    // tar -cvzf tarballname.tar.gz itemtocompress
    // tar -cvzf CodeSketcher-darwin-x64.tar.gz CodeSketcher-darwin-x64

}

// Unpack the package in temp.
Updater.unpack = () => {
    console.log('Unpacking update...')

    // tar xvzf CodeSketcher-darwin-x64.tar.gz
    const exec = require('child_process').exec
    const child = exec('tar xvzf ./CodeSketcher-darwin-x64.tar.gz',
      (error, stdout, stderr) => {
        console.log(`stdout: ${stdout}`)
        console.log(`stderr: ${stderr}`)
        if (error !== null) {
          console.log(`exec error: ${error}`)
        }
    })
}

// Replace old app, Run updated app from original location and close temp instance
Updater.install = () => {
    console.log('Installing new package over old one...')
    // rm -rf /Applications/CodeSketcher.app
    // cp -rf CodeSketcher.app /Applications/CodeSketcher.app
    const exec = require('child_process').exec
    const child = exec('rm -rf /Applications/CodeSketcher.app && cp -rf ./CodeSketcher-darwin-x64/CodeSketcher.app /Applications/CodeSketcher.app',
      (error, stdout, stderr) => {
        console.log(`stdout: ${stdout}`)
        console.log(`stderr: ${stderr}`)
        if (error !== null) {
          console.log(`exec error: ${error}`)
        }
    })
}

Updater.downloadAndInstall = (jsonBody) => {
    Updater.download(jsonBody, function() {
        Updater.unpack(function() {
            Updater.install()
        })
    })
}

// Check the manifest for version (from your running "old" app).
Updater.checkForNewVersion = () => {
    var request = require('request'),
        semver = require('semver')

    request('https://raw.githubusercontent.com/michaeljcalkins/codesketcher-updates/master/version', (error, response, body) => {
        if (error || response.statusCode != 200) {
            console.error('response.statusCode', response.statusCode)
            console.error('error', error)
        }

        var jsonBody = JSON.parse(body)
        var packageJson = require('../package.json')

        if (semver.lte(jsonBody.version, packageJson.version)) {
            console.info('No new updates.')
            return
        }

        console.info('Update detected!')
        console.log('Current version: ', packageJson.version)
        console.log('New version: ', jsonBody.version)

        Updater.downloadAndInstall(jsonBody)
    })
}

// User Installing, Running, and Updating
// 1. someone installs
// 2. starts app
// 3. request to server for update
// 4. if update available download to OS's tmp folder
// 5. start bash or cmd
// 6. close app
// 7. copy tmp files over existing program
// 8. starts app

module.exports = Updater
