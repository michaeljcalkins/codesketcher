'use strict'

let fs = require('fs'),
    ExportCss = require('./Css'),
    ExportHtml = require('./Html')

let ExportApp = {}

ExportApp.process = function(config) {
    let cssContents = ExportCss.process(config)
    let htmlFiles = ExportHtml.process(config)

    fs.writeFileSync('/Users/michaelcalkins/Downloads/test.css', cssContents)
    htmlFiles.forEach(function(htmlContents, key) {
        fs.writeFileSync(`/Users/michaelcalkins/Downloads/test-${key}.html`, htmlContents)
    })
}

module.exports = ExportApp
