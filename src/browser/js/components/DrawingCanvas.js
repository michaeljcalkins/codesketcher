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
                    <html-object html-object="htmlObject" ng-repeat="htmlObject in $ctrl.drawingModel.currentPage.htmlObjects track by $index"></html-object>
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
                    if (! DrawingModel.currentSketch) return

                    DrawingModel.currentHtmlObject = null
                    createByDragging = true
                    $('.main').css('cursor', 'crosshair')
                    $('.drawing-canvas').append("<div class='drawing-canvas-screen'></div>")

                    $('.main').on('mousedown', this.startNewHtmlObjectProcess)
                    $('.main').on('mousemove', this.adjustNewHtmlObject)
                    $('.main').on('mouseup', this.createNewHtmlObject)
                }
            })

            hotkeys.add({
                combo: 'o',
                description: 'Create a circle.',
                callback: (evt) => {
                    if (! DrawingModel.currentSketch) return

                    DrawingModel.currentHtmlObject = null
                    createByDragging = true
                    createAnOval = true
                    $('.main').css('cursor', 'crosshair')
                    $('.drawing-canvas').append("<div class='drawing-canvas-screen'></div>")

                    $('.main').on('mousedown', this.startNewHtmlObjectProcess)
                    $('.main').on('mousemove', this.adjustNewHtmlObject)
                    $('.main').on('mouseup', this.createNewHtmlObject)
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

            this.startNewHtmlObjectProcess = (evt) => {
                if (!createByDragging) return

                var factor = (1 / DrawingModel.currentZoom)

                startingPosition = {
                    x: evt.offsetX,
                    y: evt.offsetY
                }

                if (createAText) {
                    this.createNewHtmlObject(evt)
                    return
                }

                var newDiv = $('<div class="html-object-placeholder" />')
                    .css({
                        height: 0,
                        width: 0,
                        position: 'absolute',
                        borderRadius: createAnOval ? '100%' : '',
                        zIndex: 999999,
                        left: factor * startingPosition.x,
                        top: factor * startingPosition.y
                    })
                $('.drawing-canvas').append(newDiv)

                squareCreated = true
            }

            this.adjustNewHtmlObject = (evt) => {
                if (!createByDragging || !squareCreated) return

                let factor = (1 / DrawingModel.currentZoom)
                let newWidth = evt.offsetX - startingPosition.x
                let newHeight = evt.offsetY - startingPosition.y

                $('.html-object-placeholder')
                    .css({
                        width: factor * newWidth,
                        height: factor * newHeight
                    })
            }

            this.createNewHtmlObject = (evt) => {
                if (!createByDragging) return

                let factor = (1 / DrawingModel.currentZoom)
                let newWidth = evt.offsetX - startingPosition.x
                let newHeight = evt.offsetY - startingPosition.y

                $('.drawing-canvas-screen').remove()

                let htmlObjectType = 'rectangle'
                htmlObjectType = createAnOval ? 'oval' : htmlObjectType
                htmlObjectType = createAText ? 'text' : htmlObjectType

                let newHtmlObject = {
                    id: guid(),
                    rotation: 0,
                    type: htmlObjectType
                }

                if ((Math.round(factor * newHeight) < 1 || Math.round(factor * newWidth) < 1) && !createAText) {
                    console.error('Did not create object, due to size of 0 or less.')
                    return
                }

                if (htmlObjectType === 'rectangle' || htmlObjectType === 'oval') {
                    newHtmlObject.styles = {
                        backgroundColor: '#D8D8D8',
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        borderColor: '#979797',
                        backgroundImage: '',
                        borderRadius: createAnOval ? '100%' : 0,
                        color: '#444',
                        fontFamily: 'Arial',
                        fontSize: '18px',
                        height: Math.round(factor * newHeight) + 'px',
                        width: Math.round(factor * newWidth) + 'px',
                        position: 'absolute',
                        left: Math.round(factor * startingPosition.x) + 'px',
                        top: Math.round(factor * startingPosition.y) + 'px',
                        transform: 'rotate(0deg)'
                    }
                } else if (htmlObjectType === 'text') {
                    newHtmlObject.styles = {
                        backgroundColor: 'transparent',
                        color: '#444',
                        fontFamily: 'Arial',
                        fontSize: '18px',
                        textAlign: 'center',
                        height: 'auto',
                        width: '240px',
                        position: 'absolute',
                        left: Math.round(factor * startingPosition.x) + 'px',
                        top: Math.round(factor * startingPosition.y) + 'px',
                        transform: 'rotate(0deg)',
                        body: ''
                    }
                }

                squareCreated = false
                createAnOval = false
                createAText = false
                createByDragging = false
                $('.main').css('cursor', 'auto')
                $('.html-object-placeholder').remove()

                DrawingModel.createHtmlObject(newHtmlObject)
                DrawingModel.setCurrentHtmlObject(newHtmlObject)
            }
        }
    })
