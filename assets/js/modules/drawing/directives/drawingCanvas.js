'use strict'

var _ = require('lodash'),
    $ = require('jquery')

module.exports = function DrawingCanvasDirective(DrawingStorage, $rootScope, hotkeys) {
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
            let deep = function (a, b) {
                return _.isObject(a) && _.isObject(b) ? _.extend(a, b, deep) : b
            }

            let createByDragging = false
            let squareCreated = false
            let startingPosition = null
            let createACircle = false

            $rootScope.$on('htmlObject:unlocked', () => {
                this.startResizable()
                this.startDraggable()
            })

            $rootScope.$on('htmlObject:locked', () => {
                this.disableResizable()
                this.disableDraggable()
            })

            $rootScope.$on('htmlObject:selected', () => {
                this.startResizable()
                this.startDraggable()

                if ($scope.drawingStorage.currentHtmlObject.isLocked) {
                    this.disableResizable()
                    this.disableDraggable()
                }
            })

            this.disableResizable = () => {
                $('.current-html-object').resizable('destroy')
            }

            this.disableDraggable = () => {
                $('.current-html-object').draggable('destroy')
            }

            this.startResizable = () => {
                $('.current-html-object').resizable({
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
                $('.current-html-object').draggable({
                    distance: 3,
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

            this.startCreateHtmlObjectBindings = () => {
                $('.main').on('mousedown', (evt) => {
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

                    squareCreated = true
                })

                $('.main').on('mousemove', (evt) => {
                    if (!createByDragging || !squareCreated) return

                    let factor = (1 / $scope.drawingStorage.currentZoom)
                    let newWidth = evt.offsetX - startingPosition.x
                    let newHeight = evt.offsetY - startingPosition.y

                    $('.html-object-placeholder')
                        .css({
                            width: factor * newWidth,
                            height: factor * newHeight
                        })
                })

                $('.main').on('mouseup', (evt) => {
                    if (!createByDragging) return

                    let factor = (1 / $scope.drawingStorage.currentZoom)
                    let newWidth = evt.offsetX - startingPosition.x
                    let newHeight = evt.offsetY - startingPosition.y

                    $('.drawing-canvas-screen').remove()

                    let newHtmlObject = {
                        id: Math.floor(Math.random() * 10000),
                        styles: {
                            height: (factor * newHeight) + 'px',
                            width: (factor * newWidth) + 'px',
                            position: 'absolute',
                            left: (factor * startingPosition.x) + 'px',
                            top: (factor * startingPosition.y) + 'px',
                            backgroundColor: '#D8D8D8',
                            borderWidth: '1px',
                            borderStyle: 'solid',
                            borderColor: '#979797',
                            backgroundImage: '',
                            borderRadius: createACircle ? '100%' : 0,
                            transform: '',
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

                    $scope.drawingStorage.createHtmlObject(newHtmlObject)
                    $scope.drawingStorage.setCurrentHtmlObject(newHtmlObject)

                    setTimeout(() => {
                        $('.html-object').resizable({
                            stop: (evt, ui) => {
                                let newHtmlObject = _.assign($scope.drawingStorage.currentHtmlObject, {
                                    styles: {
                                        height: ui.size.height + 'px',
                                        width: ui.size.width + 'px'
                                    }
                                }, deep)

                                $scope.drawingStorage.setCurrentHtmlObject(newHtmlObject)
                                $scope.drawingStorage.updateHtmlObject(newHtmlObject)
                            }
                        })

                        $('.html-object').draggable({
                            distance: 3,
                            scroll: true,
                            stop: (evt, ui) => {
                                let newHtmlObject = _.assign($scope.drawingStorage.currentHtmlObject, {
                                    styles: {
                                        left: ui.position.left + 'px',
                                        top: ui.position.top + 'px'
                                    }
                                }, deep)

                                $scope.drawingStorage.setCurrentHtmlObject(newHtmlObject)
                                $scope.drawingStorage.updateHtmlObject(newHtmlObject)
                            }
                        })
                    })
                })
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
                    combo: 'r',
                    description: 'Create a rectangle.',
                    callback: (evt) => {
                        createByDragging = true
                        $('.main').css('cursor', 'crosshair')
                        $('.html-object').resizable('destroy')
                        $('.html-object').draggable('destroy')
                    }
                })

                hotkeys.add({
                    combo: 'o',
                    description: 'Create a circle.',
                    callback: (evt) => {
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
        }
    }
}
