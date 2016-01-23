'use strict'

var _ = require('lodash'),
    $ = require('jquery')

module.exports = function DrawingCanvasDirective(DrawingStorage, $rootScope) {
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

            let createSquareByDragging = false
            let squareCreated = false
            let startingPosition = null

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
                        $scope.drawingStorage.currentHtmlObject.styles.height = ui.size.height + 'px'
                        $scope.drawingStorage.currentHtmlObject.styles.width = ui.size.width + 'px'
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
                    stop: (evt, ui) => {
                        $scope.drawingStorage.currentHtmlObject.styles.left = ui.position.left + 'px'
                        $scope.drawingStorage.currentHtmlObject.styles.top = ui.position.top + 'px'
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

            this.startKeyBindings = () => {
                $(document).on('keydown', (evt) => {
                    if ((evt.keyCode === 8 || evt.keyCode === 46) && !$(evt.target).is('input, textarea')) {
                        evt.stopPropagation()
                        evt.preventDefault()
                        $scope.drawingStorage.removeHtmlObject($scope.drawingStorage.currentHtmlObject)
                    }
                })

                /**
                 * Create a rectangle shape
                 */
                $(document).on('keypress', function (evt) {
                    // When you push R start creating a object
                    if (evt.keyCode === 114 && !$(evt.target).is('input, textarea')) {
                        createSquareByDragging = true
                        $('.main').css('cursor', 'crosshair')
                        $('.html-object').resizable('destroy')
                        $('.html-object').draggable('destroy')
                    }
                })

                $(document).on('keydown', (evt) => {
                    if ($(evt.target).is('input, textarea')) return

                    if (evt.metaKey && evt.keyCode === 83) {
                        $scope.drawingStorage.saveCurrentSketch()
                        $rootScope.$digest()
                        evt.preventDefault()
                    }

                    if (evt.metaKey && evt.keyCode === 79) {
                        $scope.drawingStorage.openFileDialog()
                        $rootScope.$digest()
                        evt.preventDefault()
                    }

                    if (evt.metaKey && evt.keyCode === 78) {
                        $scope.drawingStorage.newCurrentSketch()
                        $rootScope.$digest()
                        evt.preventDefault()
                    }

                    if ([37,38,39,40].indexOf(evt.keyCode) > -1) {
                        let numberOfPixelsToMove = evt.shiftKey ? 10 : 1
                        switch(evt.keyCode) {
                            case 37: // left
                                var intLeft = +$scope.drawingStorage.currentHtmlObject.styles.left.slice(0, -2)
                                $scope.drawingStorage.currentHtmlObject.styles.left = Math.round(intLeft - numberOfPixelsToMove) + 'px'
                                $scope.drawingStorage.updateHtmlObject($scope.drawingStorage.currentHtmlObject)
                                $rootScope.$digest()
                                evt.preventDefault()
                                break

                            case 38: // up
                                var intTop = +$scope.drawingStorage.currentHtmlObject.styles.top.slice(0, -2)
                                $scope.drawingStorage.currentHtmlObject.styles.top = Math.round(intTop - numberOfPixelsToMove) + 'px'
                                $scope.drawingStorage.updateHtmlObject($scope.drawingStorage.currentHtmlObject)
                                $rootScope.$digest()
                                evt.preventDefault()
                                break

                            case 39: // right
                                var intLeft = +$scope.drawingStorage.currentHtmlObject.styles.left.slice(0, -2)
                                $scope.drawingStorage.currentHtmlObject.styles.left = Math.round(intLeft + numberOfPixelsToMove) + 'px'
                                $scope.drawingStorage.updateHtmlObject($scope.drawingStorage.currentHtmlObject)
                                $rootScope.$digest()
                                evt.preventDefault()
                                break

                            case 40: // down
                                var intTop = +$scope.drawingStorage.currentHtmlObject.styles.top.slice(0, -2)
                                $scope.drawingStorage.currentHtmlObject.styles.top = Math.round(intTop +  numberOfPixelsToMove) + 'px'
                                $scope.drawingStorage.updateHtmlObject($scope.drawingStorage.currentHtmlObject)
                                $rootScope.$digest()
                                evt.preventDefault()
                                break
                        }
                    }
                })
            }

            this.startCreateHtmlObjectBindings = () => {
                $('.main').on('mousedown', (evt) => {
                    if (!createSquareByDragging) return

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
                            zIndex: 999999,
                            left: factor * startingPosition.x,
                            top: factor * startingPosition.y
                        })
                    $('.drawing-canvas').append(newDiv)

                    squareCreated = true
                })

                $('.main').on('mousemove', (evt) => {
                    if (!createSquareByDragging || !squareCreated) return

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
                    if (!createSquareByDragging) return

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
                            transform: '',
                            color: '#444',
                            fontFamily: 'Arial',
                            fontSize: '18px'
                        }
                    }
                    squareCreated = false
                    createSquareByDragging = false
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

            this.startKeyBindings()
            this.startCreateHtmlObjectBindings()
        }
    }
}
