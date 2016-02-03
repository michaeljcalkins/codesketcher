'use strict'

var angular = require('angular'),
    _ = require('lodash'),
    $ = require('jquery')

module.exports = angular
    .module('codesketcher')
    .directive('drawingCanvas', function (DrawingModel, DrawingEvents, $rootScope, hotkeys, DrawingGuid, $timeout, $sce) {
        return {
            template: `
            <div class="main">
                <div
                    class="drawing-container"
                    ng-if="drawingModel.currentPage"
                    ng-style="{ width: drawingModel.getContainerWidth() }">
                    <div
                        class="drawing-canvas"
                        ng-style="drawingModel.currentPage.styles">
                        <div
                            class="html-object"
                            ng-mousedown="drawingModel.setCurrentHtmlObject(htmlObject)"
                            ng-click="drawingModel.setCurrentHtmlObject(htmlObject)"
                            ng-repeat="htmlObject in drawingModel.currentPage.htmlObjects track by $index"
                            ng-class="{
                                'text-html-object': drawingModel.currentHtmlObject.type == 'text',
                                'image-html-object': drawingModel.currentHtmlObject.type == 'image',
                                'rectangle-html-object': drawingModel.currentHtmlObject.type == 'rectangle',
                                'current-html-object': drawingModel.isCurrentHtmlObject(htmlObject.id),
                                'unfocused-html-object': !drawingModel.isCurrentHtmlObject(htmlObject.id)
                            }"
                            ng-style="htmlObject.styles">
                            <div class="html-object-border"></div>
                            <div
                                class="html-object-switch-container"
                                ng-switch on="htmlObject.type">
                                <div ng-switch-when="image">
                                    <img ng-src="data:image;base64,{{ htmlObject.imageSrc }}" style="height: 100%; width: 100%;">
                                </div>
                                <div ng-switch-when="text">
                                    <textarea
                                        ng-change="drawingModel.updateHtmlObject(drawingModel.currentHtmlObject)"
                                        msd-elastic
                                        placeholder="Write your text here..."
                                        ng-model="htmlObject.body"></textarea>
                                </div>
                                <div
                                    ng-switch-default
                                    ng-bind-html="ctrl.toTrusted(htmlObject.body)"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `,
            controllerAs: 'ctrl',
            controller: function($scope) {
                let createByDragging = false
                let createAnOval = false
                let createAText = false
                let squareCreated = false
                let startingPosition = null

                $rootScope.$on(DrawingEvents.htmlObject.created, () => {
                    this.startResizable()
                    this.startDraggable()
                })

                $rootScope.$on(DrawingEvents.htmlObject.unlocked, () => {
                    this.enableResizable()
                    this.enableDraggable()
                })

                $rootScope.$on(DrawingEvents.htmlObject.locked, () => {
                    this.disableResizable()
                    this.disableDraggable()
                })

                $rootScope.$on(DrawingEvents.htmlObject.removed, () => {
                    this.disableResizable()
                    this.disableDraggable()
                })

                $rootScope.$on(DrawingEvents.insert.rectangle, () => {
                    if (!DrawingModel.currentSketch) return

                    createByDragging = true
                    $('.main').css('cursor', 'crosshair')
                    this.stopResizable()
                    this.stopDraggable()
                })

                $rootScope.$on(DrawingEvents.insert.oval, () => {
                    if (!DrawingModel.currentSketch) return

                    createByDragging = true
                    createAnOval = true
                    $('.main').css('cursor', 'crosshair')
                    this.stopResizable()
                    this.stopDraggable()
                })

                $rootScope.$on(DrawingEvents.insert.text, () => {

                })

                $rootScope.$on(DrawingEvents.insert.image, () => {

                })

                $rootScope.$on(DrawingEvents.htmlObject.selected, () => {
                    $timeout(() => {
                        this.startResizable()
                        this.startDraggable()

                        this.disableResizable()
                        this.disableDraggable()

                        if (!DrawingModel.currentHtmlObject.isLocked) {
                            this.enableResizable()
                            this.enableDraggable()
                        }
                    })
                })

                hotkeys.add({
                    combo: 'esc',
                    description: 'Stop whatever you were doing.',
                    callback: (evt) => {
                        DrawingModel.currentHtmlObject = null
                        squareCreated = false
                        createAnOval = false
                        createByDragging = false
                        this.stopResizable()
                        this.stopDraggable()
                        $('.main').css('cursor', 'auto')
                        $('.drawing-canvas-screen').remove()
                    }
                })

                hotkeys.add({
                    combo: 'r',
                    description: 'Create a rectangle.',
                    callback: (evt) => {
                        if (! DrawingModel.currentSketch) return

                        this.stopResizable()
                        this.stopDraggable()
                        DrawingModel.currentHtmlObject = null
                        createByDragging = true
                        $('.main').css('cursor', 'crosshair')
                        $('.drawing-canvas').append("<div class='drawing-canvas-screen'></div>")
                    }
                })

                hotkeys.add({
                    combo: 'o',
                    description: 'Create a circle.',
                    callback: (evt) => {
                        if (! DrawingModel.currentSketch) return

                        this.stopResizable()
                        this.stopDraggable()
                        DrawingModel.currentHtmlObject = null
                        createByDragging = true
                        createAnOval = true
                        $('.main').css('cursor', 'crosshair')
                        $('.drawing-canvas').append("<div class='drawing-canvas-screen'></div>")
                    }
                })

                hotkeys.add({
                    combo: 't',
                    description: 'Create text.',
                    callback: (evt) => {
                        if (! DrawingModel.currentSketch) return

                        this.stopResizable()
                        this.stopDraggable()
                        DrawingModel.currentHtmlObject = null
                        createByDragging = true
                        createAText = true
                        $('.main').css('cursor', 'crosshair')
                        $('.drawing-canvas').append("<div class='drawing-canvas-screen'></div>")
                    }
                })

                $('.main').on('mousedown', this.startNewHtmlObjectProcess)
                $('.main').on('mousemove', this.adjustNewHtmlObject)
                $('.main').on('mouseup', this.createNewHtmlObject)

                this.toTrusted = (htmlCode) => {
                    return $sce.trustAsHtml(htmlCode)
                }

                this.disableDraggable = () => {
                    $('.html-object').draggable('disable')
                }

                this.disableResizable = () => {
                    $('.html-object').resizable('disable')
                }

                this.enableResizable = () => {
                    $('.current-html-object').resizable('enable')
                }

                this.enableDraggable = () => {
                    $('.current-html-object').draggable('enable')
                }

                this.stopResizable = () => {
                    try {
                        $('.current-html-object').resizable('destroy')
                    } catch(e) {
                        console.log(e)
                    }
                }

                this.stopDraggable = () => {
                    try {
                        $('.current-html-object').draggable('destroy')
                    } catch(e) {
                        console.log(e)
                    }
                }

                this.startResizable = () => {
                    $('.rectangle-html-object').resizable({
                        handles: 'all',
                        disabled: true,
                        stop: (evt, ui) => {
                            $timeout(function() {
                                DrawingModel.currentHtmlObject.styles.height = Math.round($('.current-html-object').outerHeight()) + 'px'
                                DrawingModel.currentHtmlObject.styles.width = Math.round($('.current-html-object').outerWidth()) + 'px'
                                DrawingModel.currentHtmlObject.styles.left = Math.round(ui.position.left) + 'px'
                                DrawingModel.currentHtmlObject.styles.top = Math.round(ui.position.top) + 'px'

                                if (DrawingModel.currentHtmlObject.type === 'text') {
                                    DrawingModel.currentHtmlObject.styles.height = 'auto'
                                }

                                DrawingModel.updateHtmlObject(DrawingModel.currentHtmlObject)
                                DrawingModel.setCurrentHtmlObject(DrawingModel.currentHtmlObject)
                            })
                        },
                        resize: function(evt, ui) {
                            DrawingModel.currentZoom = DrawingModel.currentZoom || 1
                            let factor = (1 / DrawingModel.currentZoom) - 1
                            ui.size.width += Math.round(($('.current-html-object').outerWidth() - ui.originalSize.width) * factor)
                            ui.size.height += Math.round(($('.current-html-object').outerHeight() - ui.originalSize.height) * factor)
                            ui.position.top += Math.round((ui.position.top - ui.originalPosition.top) * factor)
                            ui.position.left += Math.round((ui.position.left - ui.originalPosition.left) * factor)
                        }
                    })

                    $('.text-html-object').resizable({
                        handles: 'all',
                        disabled: true,
                        stop: (evt, ui) => {
                            $timeout(function() {
                                DrawingModel.currentHtmlObject.styles.height = Math.round($('.current-html-object').outerHeight()) + 'px'
                                DrawingModel.currentHtmlObject.styles.width = Math.round($('.current-html-object').outerWidth()) + 'px'
                                DrawingModel.currentHtmlObject.styles.left = Math.round(ui.position.left) + 'px'
                                DrawingModel.currentHtmlObject.styles.top = Math.round(ui.position.top) + 'px'

                                if (DrawingModel.currentHtmlObject.type === 'text') {
                                    DrawingModel.currentHtmlObject.styles.height = 'auto'
                                }

                                DrawingModel.updateHtmlObject(DrawingModel.currentHtmlObject)
                                DrawingModel.setCurrentHtmlObject(DrawingModel.currentHtmlObject)
                            })
                        },
                        resize: function(evt, ui) {
                            DrawingModel.currentZoom = DrawingModel.currentZoom || 1
                            let factor = (1 / DrawingModel.currentZoom) - 1
                            ui.size.width += Math.round(($('.current-html-object').outerWidth() - ui.originalSize.width) * factor)
                            ui.size.height += Math.round(($('.current-html-object').outerHeight() - ui.originalSize.height) * factor)
                            ui.position.top += Math.round((ui.position.top - ui.originalPosition.top) * factor)
                            ui.position.left += Math.round((ui.position.left - ui.originalPosition.left) * factor)
                        }
                    })

                    $('.image-html-object').resizable({
                        handles: 'all',
                        disabled: true,
                        aspectRatio: true,
                        stop: (evt, ui) => {
                            $timeout(function() {
                                DrawingModel.currentHtmlObject.styles.height = Math.round($('.current-html-object').outerHeight()) + 'px'
                                DrawingModel.currentHtmlObject.styles.width = Math.round($('.current-html-object').outerWidth()) + 'px'
                                DrawingModel.currentHtmlObject.styles.left = Math.round(ui.position.left) + 'px'
                                DrawingModel.currentHtmlObject.styles.top = Math.round(ui.position.top) + 'px'

                                if (DrawingModel.currentHtmlObject.type === 'text') {
                                    DrawingModel.currentHtmlObject.styles.height = 'auto'
                                }

                                DrawingModel.updateHtmlObject(DrawingModel.currentHtmlObject)
                                DrawingModel.setCurrentHtmlObject(DrawingModel.currentHtmlObject)
                            })
                        },
                        resize: function(evt, ui) {
                            DrawingModel.currentZoom = DrawingModel.currentZoom || 1
                            let factor = (1 / DrawingModel.currentZoom) - 1
                            ui.size.width += Math.round(($('.current-html-object').outerWidth() - ui.originalSize.width) * factor)
                            ui.size.height += Math.round(($('.current-html-object').outerHeight() - ui.originalSize.height) * factor)
                            ui.position.top += Math.round((ui.position.top - ui.originalPosition.top) * factor)
                            ui.position.left += Math.round((ui.position.left - ui.originalPosition.left) * factor)
                        }
                    })
                }

                this.startDraggable = () => {
                    $('.html-object').draggable({
                        distance: 3,
                        scroll: true,
                        disabled: true,
                        stop: function (evt, ui) {
                            $timeout(function() {
                                DrawingModel.currentHtmlObject.styles.left = Math.round(ui.position.left) + 'px'
                                DrawingModel.currentHtmlObject.styles.top = Math.round(ui.position.top) + 'px'
                                DrawingModel.updateHtmlObject(DrawingModel.currentHtmlObject)
                                DrawingModel.setCurrentHtmlObject(DrawingModel.currentHtmlObject)
                            })
                        },
                        drag: function (evt, ui) {
                            // http://stackoverflow.com/questions/8605439/jquery-draggable-div-with-zoom
                            DrawingModel.currentZoom = DrawingModel.currentZoom || 1
                            var factor = (1 / DrawingModel.currentZoom) - 1
                            ui.position.top += Math.round((ui.position.top - ui.originalPosition.top) * factor)
                            ui.position.left += Math.round((ui.position.left - ui.originalPosition.left) * factor)
                        }
                    })
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
                    this.startDraggable()
                    this.startResizable()

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
                        id: DrawingGuid.guid(),
                        rotation: 0,
                        type: htmlObjectType
                    }

                    if ((Math.round(factor * newHeight) < 1 || Math.round(factor * newWidth) < 1) && !createAText) {
                        console.error('Did not create object, due to size of 0 or less.')
                        return
                    }

                    switch(htmlObjectType) {
                        case 'rectangle' :
                        case 'oval' :
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
                            break

                        case 'text' :
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
                            break
                    }

                    squareCreated = false
                    createAnOval = false
                    createAText = false
                    createByDragging = false
                    $('.main').css('cursor', 'auto')
                    $('.html-object-placeholder').remove()

                    DrawingModel.createHtmlObject(newHtmlObject)
                    this.startDraggable()
                    this.startResizable()
                    DrawingModel.setCurrentHtmlObject(newHtmlObject)
                }
            }
        }
    })
