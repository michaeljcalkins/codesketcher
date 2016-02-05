'use strict'

let DrawingEvents = require('../lib/DrawingEvents')

angular
    .module('codesketcher')
    .service('DrawingLayers', function(DrawingModel, $rootScope, $timeout) {
        $rootScope.$on(DrawingEvents.htmlObject.created, () => {
            this.updateLayerPositions()
        })

        $rootScope.$on(DrawingEvents.htmlObject.selected, () => {
            this.updateLayerPositions()
        })

        $rootScope.$on(DrawingEvents.page.selected, () => {
            this.updateLayerPositions()
        })

        this.updateLayerPositions = function() {
            $timeout(function() {
                DrawingModel.currentPage.htmlObjects.forEach((htmlObject, key) => {
                    htmlObject.styles.zIndex = DrawingModel.currentPage.htmlObjects.length - key
                    DrawingModel.updateHtmlObject(htmlObject)
                })
            })
        }

        this.bringCurrentObjectForward = () => {
            $timeout(function() {
                let currentIndex = _.findIndex(DrawingModel.currentPage.htmlObjects, { id: DrawingModel.currentHtmlObject.id })

                _.remove(DrawingModel.currentPage.htmlObjects, { id: DrawingModel.currentHtmlObject.id })
                DrawingModel.currentPage.htmlObjects.splice((currentIndex - 1), 0, DrawingModel.currentHtmlObject)

                DrawingModel.setCurrentHtmlObject(DrawingModel.currentHtmlObject)
                DrawingModel.flags.isDirty = true
            })
        }

        this.sendCurrentObjectBackward = () => {
            $timeout(function() {
                let currentIndex = _.findIndex(DrawingModel.currentPage.htmlObjects, { id: DrawingModel.currentHtmlObject.id })

                _.remove(DrawingModel.currentPage.htmlObjects, { id: DrawingModel.currentHtmlObject.id })
                DrawingModel.currentPage.htmlObjects.splice((currentIndex + 1), 0, DrawingModel.currentHtmlObject)

                DrawingModel.setCurrentHtmlObject(DrawingModel.currentHtmlObject)
                DrawingModel.flags.isDirty = true
            })
        }
    })
