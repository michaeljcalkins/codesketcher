'use strict'

let ExportCss = {}

ExportCss.process = (config) => {
    let cssResult = ''

    config.sketch.pages.forEach(function(page, key) {
        page.htmlObjects.forEach(function(htmlObject, key) {
            let cssRuleName = htmlObject.name.replace(/\s+/g, '-').toLowerCase()

            cssResult += `.${cssRuleName} {\n`
            for (var style in htmlObject.styles) {
                if (! htmlObject.styles.hasOwnProperty(style)) return

                let cssPropertyName = style.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
                cssResult += `  ${cssPropertyName}: ${htmlObject.styles[style]};\n`
            }

            cssResult += `}\n\n`
        })
    })

    return cssResult
}

module.exports = ExportCss
