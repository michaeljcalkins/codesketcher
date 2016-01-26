'use strict'

module.exports = angular
    .module('codesketcher')
    .service('DrawingAlign', function(DrawingModel) {
        this.alignCurrentHtmlObjectLeft = () => {
            DrawingModel.currentHtmlObject.styles.left = '0px'
            DrawingModel.updateHtmlObject(DrawingModel.currentHtmlObject)
        }

        this.alignCurrentHtmlObjectVertically = () => {
            let pageWidth = +DrawingModel.currentPage.styles.width.slice(0, -2)
            let objWidth = +DrawingModel.currentHtmlObject.styles.width.slice(0, -2)

            DrawingModel.currentHtmlObject.styles.left = ((pageWidth / 2) - (objWidth / 2)) + 'px'
            DrawingModel.updateHtmlObject(DrawingModel.currentHtmlObject)
        }

        this.alignCurrentHtmlObjectRight = () => {
            let pageWidth = +DrawingModel.currentPage.styles.width.slice(0, -2)
            let objWidth = +DrawingModel.currentHtmlObject.styles.width.slice(0, -2)

            DrawingModel.currentHtmlObject.styles.left = (pageWidth - objWidth) + 'px'
            DrawingModel.updateHtmlObject(DrawingModel.currentHtmlObject)
        }

        this.alignCurrentHtmlObjectTop = () => {
            DrawingModel.currentHtmlObject.styles.top = '0px'
            DrawingModel.updateHtmlObject(DrawingModel.currentHtmlObject)
        }

        this.alignCurrentHtmlObjectHorizontally = () => {
            let pageHeight = +DrawingModel.currentPage.styles.height.slice(0, -2)
            let objHeight = +DrawingModel.currentHtmlObject.styles.height.slice(0, -2)

            DrawingModel.currentHtmlObject.styles.top = ((pageHeight / 2) - (objHeight / 2)) + 'px'
            DrawingModel.updateHtmlObject(DrawingModel.currentHtmlObject)
        }

        this.alignCurrentHtmlObjectBottom = () => {
            let pageHeight = +DrawingModel.currentPage.styles.height.slice(0, -2)
            let objHeight = +DrawingModel.currentHtmlObject.styles.height.slice(0, -2)

            DrawingModel.currentHtmlObject.styles.top = (pageHeight - objHeight) + 'px'
            DrawingModel.updateHtmlObject(DrawingModel.currentHtmlObject)
        }
    })
