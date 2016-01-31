'use strict'

let ExportCss = {}

ExportCss.process = (config) => {
    return `
    body {
        color: #333;
    }
    `
}

module.exports = ExportCss
