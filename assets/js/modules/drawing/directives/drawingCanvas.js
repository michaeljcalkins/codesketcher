'use strict'

var _ = require('lodash'),
    $ = require('jquery')

module.exports = function DrawingCanvasDirective(DrawingModel, DrawingEvents, $rootScope, hotkeys, DrawingGuid) {
    return {
        scope: {
            drawingModel: '='
        },
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
                        ng-repeat="htmlObject in drawingModel.currentPage.htmlObjects track by $index | orderBy:$index:true"
                        ng-class="{
                            'current-html-object': htmlObject.id == drawingModel.currentHtmlObject.id,
                            'unfocused-html-object': htmlObject.id != drawingModel.currentHtmlObject.id
                        }"
                        ng-style="htmlObject.styles"
                        style="z-index: {{ drawingModel.currentPage.htmlObjects.length - $index }}">
                        <div class="html-object-border"></div>
                        <div ng-switch on="htmlObject.type">
                            <div ng-switch-when="image">
                                <img ng-src="data:image;base64,{{ htmlObject.imageSrc }}" style="height: 100%; width: 100%;">
                            </div>
                            <div ng-switch-default>
                                {{ htmlObject.styles.body }}
                            </div>
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
            let squareCreated = false
            let startingPosition = null

            $rootScope.$on(DrawingEvents.htmlObject.created, () => {
                this.startResizable()
                this.startDraggable()
            })

            $rootScope.$on(DrawingEvents.htmlObject.unlocked, () => {
                this.enableCurrentResizable()
                this.enableCurrentDraggable()
            })

            $rootScope.$on(DrawingEvents.htmlObject.locked, () => {
                this.disableResizable()
                this.disableDraggable()
            })

            $rootScope.$on(DrawingEvents.htmlObject.removed, () => {
                this.disableResizable()
                this.disableDraggable()
            })

            $rootScope.$on(DrawingEvents.htmlObject.selected, () => {
                this.startResizable()
                this.startDraggable()

                this.disableResizable()
                this.disableDraggable()

                if (!DrawingModel.currentHtmlObject.isLocked) {
                    this.enableCurrentResizable()
                    this.enableCurrentDraggable()
                }
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

            this.disableDraggable = () => {
                $('.html-object').draggable('disable')
            }

            this.disableResizable = () => {
                $('.html-object').resizable('disable')
            }

            this.enableCurrentResizable = () => {
                $('.current-html-object').resizable('enable')
            }

            this.enableCurrentDraggable = () => {
                $('.current-html-object').draggable('enable')
            }

            this.stopResizable = () => {
                $('.current-html-object').resizable('disable')
            }

            this.stopDraggable = () => {
                $('.current-html-object').draggable('disable')
            }

            this.startResizable = () => {
                $('.html-object').resizable({
                    disabled: true,
                    handles: 'all',
                    stop: (evt, ui) => {
                        DrawingModel.currentHtmlObject.styles.height = Math.round($('.current-html-object').outerHeight()) + 'px'
                        DrawingModel.currentHtmlObject.styles.width = Math.round($('.current-html-object').outerWidth()) + 'px'
                        DrawingModel.currentHtmlObject.styles.left = Math.round(ui.position.left) + 'px'
                        DrawingModel.currentHtmlObject.styles.top = Math.round(ui.position.top) + 'px'
                        DrawingModel.setCurrentHtmlObject(DrawingModel.currentHtmlObject)
                        DrawingModel.updateHtmlObject(DrawingModel.currentHtmlObject)
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
                    disabled: true,
                    scroll: true,
                    stop: function (evt, ui) {
                        DrawingModel.currentHtmlObject.styles.left = Math.round(ui.position.left) + 'px'
                        DrawingModel.currentHtmlObject.styles.top = Math.round(ui.position.top) + 'px'
                        DrawingModel.setCurrentHtmlObject(DrawingModel.currentHtmlObject)
                        DrawingModel.updateHtmlObject(DrawingModel.currentHtmlObject)
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

                $('.drawing-canvas').append("<div class='drawing-canvas-screen'></div>")
                var factor = (1 / DrawingModel.currentZoom)

                startingPosition = {
                    x: evt.offsetX,
                    y: evt.offsetY
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

                let newHtmlObject = {
                    id: DrawingGuid.guid(),
                    rotation: 0,
                    type: createAnOval ? 'oval' : 'rectangle',
                    styles: {
                        height: Math.round(factor * newHeight) + 'px',
                        width: Math.round(factor * newWidth) + 'px',
                        position: 'absolute',
                        left: Math.round(factor * startingPosition.x) + 'px',
                        top: Math.round(factor * startingPosition.y) + 'px',
                        backgroundColor: '#D8D8D8',
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        borderColor: '#979797',
                        backgroundImage: '',
                        borderRadius: createAnOval ? '100%' : 0,
                        transform: 'rotate(0deg)',
                        color: '#444',
                        fontFamily: 'Arial',
                        fontSize: '18px'
                    }
                }
                squareCreated = false
                createAnOval = false
                createByDragging = false
                $('.main').css('cursor', 'auto')
                $('.html-object-placeholder').remove()

                if (Math.round(factor * newHeight) < 1 || Math.round(factor * newWidth) < 1)
                    return

                DrawingModel.createHtmlObject(newHtmlObject)
                this.startDraggable()
                this.startResizable()
                DrawingModel.setCurrentHtmlObject(newHtmlObject)
            }

            this.startCreateHtmlObjectBindings = () => {
                $('.main').on('mousedown', this.startNewHtmlObjectProcess)
                $('.main').on('mousemove', this.adjustNewHtmlObject)
                $('.main').on('mouseup', this.createNewHtmlObject)
            }

            this.startKeyBindings = () => {
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
                    }
                })

                hotkeys.add({
                    combo: 't',
                    description: 'Create text.',
                    callback: (evt) => {
                        if (! DrawingModel.currentSketch) return


                    }
                })
            }

            this.startKeyBindings()
            this.startCreateHtmlObjectBindings()
            this.startDraggable()
            this.startResizable()
        }
    }
}
