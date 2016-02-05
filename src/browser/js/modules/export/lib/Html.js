'use strict'

let ExportHtml = {}

ExportHtml.process = function(config) {
    let htmlPages = []

    config.sketch.pages.forEach(function (page, key) {
        let htmlResults = ''
        page.htmlObjects.forEach(function (htmlObject, key) {
            let cssRuleName = _.get(htmlObject, 'name', `Unnamed ${htmlObject.type} ${key}`).replace(/\s+/g, '-').toLowerCase()
            console.log(htmlObject)

            htmlResults += `
            <html>
                <head>
                    <title>${page.name}</title>
                    <link href="test.css" rel="stylesheet">
                <head>
                <body>
            `

            switch(htmlObject.type) {
                case 'oval':
                    break

                case 'rectangle':
                    htmlResults += `<div class="${cssRuleName}">${_.get(htmlObject, 'body', '')}</div>\n`
                    break

                case 'image':
                    htmlResults += `
                    <img class="${cssRuleName}" src="data:image;base64,${htmlObject.imageSrc}">
                    `

                    break

                case 'text':
                    break
            }

            htmlResults += `
            </body>
            </html>
            `
        })
        htmlPages.push(htmlResults)
    })

    return htmlPages
}

module.exports = ExportHtml
