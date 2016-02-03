'use strict'

let ExportHtml = {}

ExportHtml.process = (config) => {
    let htmlResult = ''

    config.sketch.pages.forEach(function(page, key) {
        page.htmlObjects.forEach(function(htmlObject, key) {
            let cssRuleName = htmlObject.name.replace(/\s+/g, '-').toLowerCase()

            htmlResult += `<div class="${cssRuleName}">${htmlObject.body || ''}</div>\n`
        })
    })

    return htmlResult
}

module.exports = ExportHtml
