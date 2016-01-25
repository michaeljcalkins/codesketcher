'use strict'

var _ = require('lodash'),
    $ = require('jquery')

module.exports = function DrawingCanvasDirective(DrawingStorage, DrawingEvents, $rootScope, hotkeys) {
    return {
        scope: {
            drawingStorage: '='
        },
        template: `
        <div class="main">
            <div
                class="drawing-container"
                ng-if="drawingStorage.currentPage"
                ng-style="{ width: drawingStorage.getContainerWidth() }">
                <div
                    class="drawing-canvas"
                    ng-style="drawingStorage.currentPage.styles">
                    <div
                        class="html-object"
                        ng-mousedown="drawingStorage.setCurrentHtmlObject(htmlObject)"
                        ng-click="drawingStorage.setCurrentHtmlObject(htmlObject)"
                        ng-repeat="htmlObject in drawingStorage.currentPage.htmlObjects track by $index"
                        ng-class="{
                            'current-html-object': htmlObject.id == drawingStorage.currentHtmlObject.id,
                            'unfocused-html-object': htmlObject.id != drawingStorage.currentHtmlObject.id
                        }"
                        ng-style="htmlObject.styles">
                        <div class="html-object-border"></div>
                        {{ htmlObject.styles.body }}
                    </div>
                </div>
            </div>
        </div>
        `,
        controllerAs: 'ctrl',
        controller: function($scope) {
            let createByDragging = false
            let createACircle = false
            let squareCreated = false
            let startingPosition = null

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
                this.disableResizable()
                this.disableDraggable()

                if (!$scope.drawingStorage.currentHtmlObject.isLocked) {
                    this.enableCurrentResizable()
                    this.enableCurrentDraggable()
                }
            })

            $rootScope.$on(DrawingEvents.insert.rectangle, () => {
                if (! $scope.drawingStorage.currentSketch) return

                createByDragging = true
                $('.main').css('cursor', 'crosshair')
                this.stopResizable()
                this.stopDraggable()
            })

            $rootScope.$on(DrawingEvents.insert.oval, () => {
                if (!$scope.drawingStorage.currentSketch) return

                createByDragging = true
                createACircle = true
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
                    stop: (evt, ui) => {
                        $scope.drawingStorage.currentHtmlObject.styles.height = Math.round(ui.size.height) + 'px'
                        $scope.drawingStorage.currentHtmlObject.styles.width = Math.round(ui.size.width) + 'px'
                        $scope.drawingStorage.setCurrentHtmlObject($scope.drawingStorage.currentHtmlObject)
                        $scope.drawingStorage.updateHtmlObject($scope.drawingStorage.currentHtmlObject)
                    },
                    resize: function(evt, ui) {
                        $scope.drawingStorage.currentZoom = $scope.drawingStorage.currentZoom || 1
                        var factor = (1 / $scope.drawingStorage.currentZoom) - 1
                        ui.size.width += Math.round((ui.size.width - ui.originalSize.width) * factor)
                        ui.size.height += Math.round((ui.size.height - ui.originalSize.height) * factor)
                    }
                })
            }

            this.startDraggable = () => {
                $('.html-object').draggable({
                    distance: 3,
                    disabled: true,
                    scroll: true,
                    stop: function (evt, ui) {
                        $scope.drawingStorage.currentHtmlObject.styles.left = Math.round(ui.position.left) + 'px'
                        $scope.drawingStorage.currentHtmlObject.styles.top = Math.round(ui.position.top) + 'px'
                        $scope.drawingStorage.setCurrentHtmlObject($scope.drawingStorage.currentHtmlObject)
                        $scope.drawingStorage.updateHtmlObject($scope.drawingStorage.currentHtmlObject)
                    },
                    drag: function (evt, ui) {
                        // http://stackoverflow.com/questions/8605439/jquery-draggable-div-with-zoom
                        $scope.drawingStorage.currentZoom = $scope.drawingStorage.currentZoom || 1
                        var factor = (1 / $scope.drawingStorage.currentZoom) - 1
                        ui.position.top += Math.round((ui.position.top - ui.originalPosition.top) * factor)
                        ui.position.left += Math.round((ui.position.left - ui.originalPosition.left) * factor)
                    }
                })
            }

            this.startNewHtmlObjectProcess = (evt) => {
                if (!createByDragging) return

                $('.drawing-canvas').append("<div class='drawing-canvas-screen'></div>")
                var factor = (1 / $scope.drawingStorage.currentZoom)

                startingPosition = {
                    x: evt.offsetX,
                    y: evt.offsetY
                }

                var newDiv = $('<div class="html-object-placeholder" />')
                    .css({
                        height: 0,
                        width: 0,
                        position: 'absolute',
                        borderRadius: createACircle ? '100%' : '',
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

                let factor = (1 / $scope.drawingStorage.currentZoom)
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

                let factor = (1 / $scope.drawingStorage.currentZoom)
                let newWidth = evt.offsetX - startingPosition.x
                let newHeight = evt.offsetY - startingPosition.y

                $('.drawing-canvas-screen').remove()

                let newHtmlObject = {
                    id: Math.floor(Math.random() * 10000),
                    rotation: 0,
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
                        borderRadius: createACircle ? '100%' : 0,
                        transform: 'rotate(0deg)',
                        color: '#444',
                        fontFamily: 'Arial',
                        fontSize: '18px'
                    }
                }
                squareCreated = false
                createACircle = false
                createByDragging = false
                $('.main').css('cursor', 'auto')
                $('.html-object-placeholder').remove()

                if (Math.round(factor * newHeight) < 1 || Math.round(factor * newWidth) < 1)
                    return

                $scope.drawingStorage.createHtmlObject(newHtmlObject)
                this.startDraggable()
                this.startResizable()
                $scope.drawingStorage.setCurrentHtmlObject(newHtmlObject)
            }

            this.startCreateHtmlObjectBindings = () => {
                $('.main').on('mousedown', this.startNewHtmlObjectProcess)
                $('.main').on('mousemove', this.adjustNewHtmlObject)
                $('.main').on('mouseup', this.createNewHtmlObject)
            }

            this.startKeyBindings = () => {
                hotkeys.add({
                    combo: 'meta+-',
                    description: 'Zoom out.',
                    callback: (evt) => {
                        $scope.drawingStorage.zoomOut()
                    }
                })

                hotkeys.add({
                    combo: 'meta+=',
                    description: 'Zoom in.',
                    callback: (evt) => {
                        $scope.drawingStorage.zoomIn()
                    }
                })

                hotkeys.add({
                    combo: 'backspace',
                    description: 'Remove currently selected html object.',
                    callback: (evt) => {
                        evt.stopPropagation()
                        evt.preventDefault()
                        $scope.drawingStorage.removeHtmlObject($scope.drawingStorage.currentHtmlObject)
                    }
                })

                hotkeys.add({
                    combo: 'esc',
                    description: 'Stop whatever you were doing.',
                    callback: (evt) => {
                        $scope.drawingStorage.currentHtmlObject = null
                        squareCreated = false
                        createACircle = false
                        createByDragging = false
                        this.stopResizable()
                        this.stopDraggable()
                    }
                })

                hotkeys.add({
                    combo: 'r',
                    description: 'Create a rectangle.',
                    callback: (evt) => {
                        if (! $scope.drawingStorage.currentSketch) return

                        this.stopResizable()
                        this.stopDraggable()
                        $scope.drawingStorage.currentHtmlObject = null
                        createByDragging = true
                        $('.main').css('cursor', 'crosshair')
                    }
                })

                hotkeys.add({
                    combo: 'o',
                    description: 'Create a circle.',
                    callback: (evt) => {
                        if (! $scope.drawingStorage.currentSketch) return

                        this.stopResizable()
                        this.stopDraggable()
                        $scope.drawingStorage.currentHtmlObject = null
                        createByDragging = true
                        createACircle = true
                        $('.main').css('cursor', 'crosshair')
                    }
                })

                hotkeys.add({
                    combo: 't',
                    description: 'Create text.',
                    callback: (evt) => {
                        if (! $scope.drawingStorage.currentSketch) return

                        $scope.drawingStorage.currentHtmlObject = null
                        createByDragging = true
                        createACircle = true
                        $('.main').css('cursor', 'crosshair')
                        $('.html-object').resizable('destroy')
                        $('.html-object').draggable('destroy')
                    }
                })

                hotkeys.add({
                    combo: 'i',
                    description: 'Insert an image.',
                    callback: (evt) => {
                        if (! $scope.drawingStorage.currentSketch) return

                        $scope.drawingStorage.currentHtmlObject = null
                        createByDragging = true
                        createACircle = true
                        $('.main').css('cursor', 'crosshair')
                        $('.html-object').resizable('destroy')
                        $('.html-object').draggable('destroy')
                    }
                })

                hotkeys.add({
                    combo: 'meta+s',
                    description: 'Save current sketch.',
                    callback: (evt) => {
                        $scope.drawingStorage.saveCurrentSketch()
                        evt.preventDefault()
                    }
                })

                hotkeys.add({
                    combo: 'meta+o',
                    description: 'Open an existing sketch.',
                    callback: (evt) => {
                        $scope.drawingStorage.openFileDialog()
                        evt.preventDefault()
                    }
                })

                hotkeys.add({
                    combo: 'meta+n',
                    description: 'Create a new sketch.',
                    callback: (evt) => {
                        $scope.drawingStorage.newCurrentSketch()
                        evt.preventDefault()
                    }
                })

                hotkeys.add({
                    combo: 'left',
                    description: 'Move current html object left 1 pixel.',
                    callback: (evt) => {
                        let numberOfPixelsToMove = 1
                        var intLeft = +$scope.drawingStorage.currentHtmlObject.styles.left.slice(0, -2)
                        $scope.drawingStorage.currentHtmlObject.styles.left = Math.round(intLeft - numberOfPixelsToMove) + 'px'
                        $scope.drawingStorage.updateHtmlObject($scope.drawingStorage.currentHtmlObject)
                        evt.preventDefault()
                    }
                })

                hotkeys.add({
                    combo: 'shift+left',
                    description: 'Move current html object left 10 pixels.',
                    callback: (evt) => {
                        let numberOfPixelsToMove = 10
                        var intLeft = +$scope.drawingStorage.currentHtmlObject.styles.left.slice(0, -2)
                        $scope.drawingStorage.currentHtmlObject.styles.left = Math.round(intLeft - numberOfPixelsToMove) + 'px'
                        $scope.drawingStorage.updateHtmlObject($scope.drawingStorage.currentHtmlObject)
                        evt.preventDefault()
                    }
                })

                hotkeys.add({
                    combo: 'up',
                    description: 'Move current html object up 1 pixel.',
                    callback: (evt) => {
                        let numberOfPixelsToMove = 1
                        var intTop = +$scope.drawingStorage.currentHtmlObject.styles.top.slice(0, -2)
                        $scope.drawingStorage.currentHtmlObject.styles.top = Math.round(intTop - numberOfPixelsToMove) + 'px'
                        $scope.drawingStorage.updateHtmlObject($scope.drawingStorage.currentHtmlObject)
                        evt.preventDefault()
                    }
                })

                hotkeys.add({
                    combo: 'shift+up',
                    description: 'Move current html object up 10 pixels.',
                    callback: (evt) => {
                        let numberOfPixelsToMove = 10
                        var intTop = +$scope.drawingStorage.currentHtmlObject.styles.top.slice(0, -2)
                        $scope.drawingStorage.currentHtmlObject.styles.top = Math.round(intTop - numberOfPixelsToMove) + 'px'
                        $scope.drawingStorage.updateHtmlObject($scope.drawingStorage.currentHtmlObject)
                        evt.preventDefault()
                    }
                })

                hotkeys.add({
                    combo: 'right',
                    description: 'Move current html object right 1 pixel.',
                    callback: (evt) => {
                        let numberOfPixelsToMove = 1
                        var intLeft = +$scope.drawingStorage.currentHtmlObject.styles.left.slice(0, -2)
                        $scope.drawingStorage.currentHtmlObject.styles.left = Math.round(intLeft + numberOfPixelsToMove) + 'px'
                        $scope.drawingStorage.updateHtmlObject($scope.drawingStorage.currentHtmlObject)
                        evt.preventDefault()
                    }
                })

                hotkeys.add({
                    combo: 'shift+right',
                    description: 'Move current html object right 10 pixels.',
                    callback: (evt) => {
                        let numberOfPixelsToMove = 10
                        var intLeft = +$scope.drawingStorage.currentHtmlObject.styles.left.slice(0, -2)
                        $scope.drawingStorage.currentHtmlObject.styles.left = Math.round(intLeft + numberOfPixelsToMove) + 'px'
                        $scope.drawingStorage.updateHtmlObject($scope.drawingStorage.currentHtmlObject)
                        evt.preventDefault()
                    }
                })

                hotkeys.add({
                    combo: 'down',
                    description: 'Move current html object down 1 pixel.',
                    callback: (evt) => {
                        let numberOfPixelsToMove = 1
                        var intTop = +$scope.drawingStorage.currentHtmlObject.styles.top.slice(0, -2)
                        $scope.drawingStorage.currentHtmlObject.styles.top = Math.round(intTop +  numberOfPixelsToMove) + 'px'
                        $scope.drawingStorage.updateHtmlObject($scope.drawingStorage.currentHtmlObject)
                        evt.preventDefault()
                    }
                })

                hotkeys.add({
                    combo: 'shift+down',
                    description: 'Move current html object down 10 pixels.',
                    callback: (evt) => {
                        let numberOfPixelsToMove = 10
                        var intTop = +$scope.drawingStorage.currentHtmlObject.styles.top.slice(0, -2)
                        $scope.drawingStorage.currentHtmlObject.styles.top = Math.round(intTop +  numberOfPixelsToMove) + 'px'
                        $scope.drawingStorage.updateHtmlObject($scope.drawingStorage.currentHtmlObject)
                        evt.preventDefault()
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
