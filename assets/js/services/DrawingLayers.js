'use strict'

module.exports = angular
    .module('codesketcher')
    .service('DrawingLayers', function(DrawingModel, DrawingEvents, $rootScope, $timeout) {
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
            DrawingModel.currentPage.htmlObjects.forEach((htmlObject, key) => {
                htmlObject.styles.zIndex = DrawingModel.currentPage.htmlObjects.length - key
                DrawingModel.updateHtmlObject(htmlObject)
            })
        }

        this.bringCurrentObjectForward = () => {
            $timeout(function() {
                let currentIndex = _.findIndex(DrawingModel.currentPage.htmlObjects, { id: DrawingModel.currentHtmlObject.id })

                _.remove(DrawingModel.currentPage.htmlObjects, { id: DrawingModel.currentHtmlObject.id })
                DrawingModel.currentPage.htmlObjects.splice((currentIndex - 1), 0, DrawingModel.currentHtmlObject)

                DrawingModel.flags.isDirty = true
                DrawingModel.updateHtmlObject(DrawingModel.currentHtmlObject)
            })
        }

        this.sendCurrentObjectBackward = () => {
            $timeout(function() {
                let currentIndex = _.findIndex(DrawingModel.currentPage.htmlObjects, { id: DrawingModel.currentHtmlObject.id })

                _.remove(DrawingModel.currentPage.htmlObjects, { id: DrawingModel.currentHtmlObject.id })
                DrawingModel.currentPage.htmlObjects.splice((currentIndex + 1), 0, DrawingModel.currentHtmlObject)

                DrawingModel.flags.isDirty = true
                DrawingModel.updateHtmlObject(DrawingModel.currentHtmlObject)
            })
        }
    })
