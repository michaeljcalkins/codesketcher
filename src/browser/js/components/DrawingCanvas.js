'use strict'

var angular = require('angular'),
    _ = require('lodash'),
    $ = require('jquery'),
    DrawingEvents = require('../lib/DrawingEvents'),
    guid = require('../lib/Guid')

module.exports = angular
    .module('codesketcher')
    .component('drawingCanvas', {
        template: `
        <div class="main">
            <rulers></rulers>
            <div
                class="drawing-container"
                ng-if="$ctrl.drawingModel.currentPage"
                ng-style="{ width: $ctrl.drawingModel.getContainerWidth() }">
                <div
                    class="drawing-canvas"
                    ng-style="$ctrl.drawingModel.currentPage.styles">
                    <html-object
                        html-object="htmlObject"
                        ng-repeat="htmlObject in $ctrl.drawingModel.currentPage.htmlObjects track by $index"></html-object>
                </div>
            </div>
        </div>
        `,
        controller: function (DrawingModel, $rootScope, hotkeys, $timeout, $sce) {
            let createByDragging = false,
                createAnOval = false,
                createAText = false,
                squareCreated = false,
                startingPosition = null

            this.drawingModel = DrawingModel

            $rootScope.$on(DrawingEvents.insert.rectangle, () => {
                if (!DrawingModel.currentSketch) return
                createByDragging = true
                $('.main').css('cursor', 'crosshair')
            })

            $rootScope.$on(DrawingEvents.insert.oval, () => {
                if (!DrawingModel.currentSketch) return

                createByDragging = true
                createAnOval = true
                $('.main').css('cursor', 'crosshair')
            })

            $rootScope.$on(DrawingEvents.insert.text, () => {

            })

            $rootScope.$on(DrawingEvents.insert.image, () => {

            })

            hotkeys.add({
                combo: 'esc',
                description: 'Stop whatever you were doing.',
                callback: (evt) => {
                    DrawingModel.currentHtmlObject = null
                    squareCreated = false
                    createAnOval = false
                    createByDragging = false
                    $('.main').css('cursor', 'auto')
                    $('.drawing-canvas-screen').remove()
                }
            })

            hotkeys.add({
                combo: 'r',
                description: 'Create a rectangle.',
                callback: (evt) => {
                    if (! DrawingModel.currentSketch)
                        return

                    let newHtmlObject = DrawingModel.createHtmlObject({
                        id: guid(),
                        type: 'rectangle',
                        styles: {
                            backgroundColor: '#D8D8D8',
                            borderWidth: '1px',
                            borderStyle: 'solid',
                            borderColor: '#979797',
                            backgroundImage: '',
                            borderRadius: 0,
                            color: '#444',
                            fontFamily: 'Arial',
                            fontSize: '18px',
                            height: '200px',
                            width: '200px',
                            position: 'relative'
                        }
                    })
                    DrawingModel.setCurrentHtmlObject(newHtmlObject)
                }
            })

            hotkeys.add({
                combo: 'o',
                description: 'Create a circle.',
                callback: (evt) => {
                    if (! DrawingModel.currentSketch)
                        return

                    let newHtmlObject = DrawingModel.createHtmlObject({
                        id: guid(),
                        type: 'rectangle',
                        styles: {
                            backgroundColor: '#D8D8D8',
                            borderWidth: '1px',
                            borderStyle: 'solid',
                            borderColor: '#979797',
                            backgroundImage: '',
                            borderRadius: '100%',
                            color: '#444',
                            fontFamily: 'Arial',
                            fontSize: '18px',
                            height: '200px',
                            width: '200px',
                            position: 'relative'
                        }
                    })
                    DrawingModel.setCurrentHtmlObject(newHtmlObject)
                }
            })

            hotkeys.add({
                combo: 't',
                description: 'Create text.',
                callback: (evt) => {
                    if (! DrawingModel.currentSketch) return

                    DrawingModel.currentHtmlObject = null
                    createByDragging = true
                    createAText = true
                    $('.main').css('cursor', 'crosshair')
                    $('.drawing-canvas').append("<div class='drawing-canvas-screen'></div>")

                    $('.main').on('mousedown', this.startNewHtmlObjectProcess)
                    $('.main').on('mousemove', this.adjustNewHtmlObject)
                    $('.main').on('mouseup', this.createNewHtmlObject)
                }
            })

            this.toTrusted = (htmlCode) => {
                return $sce.trustAsHtml(htmlCode)
            }
        }
    })
