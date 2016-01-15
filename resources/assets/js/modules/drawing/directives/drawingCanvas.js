module.exports = function drawingCanvas(DrawingStorage) {
    return {
        scope: {
            drawingStorage: '='
        },
        template: `
        <div class="main">
            <div
                class="drawing-container"
                ng-if="drawingStorage.currentPage"
                ng-style="{ width: (parseInt(drawingStorage.currentPage.styles.width.slice(0, -2)) + 100) + 'px' }">
                <div
                    class="drawing-canvas"
                    ng-style="drawingStorage.currentPage.styles">
                    <div
                        class="html-object"
                        ng-mousedown="drawingStorage.setCurrentHtmlObject(htmlObject)"
                        ng-click="drawingStorage.setCurrentHtmlObject(htmlObject)"
                        ng-repeat="htmlObject in drawingStorage.currentPage.htmlObjects"
                        ng-style="htmlObject.styles">
                        {{ htmlObject.styles.body }}
                    </div>
                </div>
            </div>
        </div>
        `,
        controllerAs: 'ctrl',
        controller: function($scope) {
            console.log('Drawing Canvas Ready')

            let deep = function (a, b) {
                return _.isObject(a) && _.isObject(b) ? _.extend(a, b, deep) : b
            }

            let createSquareByDragging = false
            let squareCreated = false
            let startingPosition = null

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
                if (evt.keyCode === 114 && !$(evt.target).is('input, textarea')) {
                    createSquareByDragging = true
                    $('.main').css('cursor', 'crosshair')
                    $('.html-object').resizable('destroy')
                    $('.html-object').draggable('destroy')
                }
            })

            $('.main').on('mousedown', (evt) => {
                startingPosition = {
                    x: evt.offsetX,
                    y: evt.offsetY + $('.navbar').outerHeight()
                }

                if (!createSquareByDragging) return

                var newDiv = $('<div class="html-object-placeholder" />')
                    .css({
                        height: 0,
                        width: 0,
                        position: 'absolute',
                        zIndex: 100000,
                        left: startingPosition.x,
                        top: startingPosition.y - $('.navbar').outerHeight()
                    })
                $('.drawing-canvas').append(newDiv)

                squareCreated = true
            })

            $('.main').on('mousemove', (evt) => {
                if (!createSquareByDragging || !squareCreated) return

                $('.html-object-placeholder')
                    .css({
                        width: evt.offsetX - startingPosition.x,
                        height: evt.offsetY + $('.navbar').outerHeight() - startingPosition.y
                    })
            })

            $('.main').on('mouseup', (evt) => {
                if (!createSquareByDragging) return

                let newWidth = evt.offsetX - startingPosition.x
                let newHeight = evt.offsetY + $('.navbar').outerHeight() - startingPosition.y

                let newHtmlObject = {
                    id: Math.floor(Math.random() * 10000),
                    styles: {
                        height: newHeight + 'px',
                        width: newWidth + 'px',
                        position: 'absolute',
                        left: `${startingPosition.x}px`,
                        top: `${startingPosition.y - $('.navbar').outerHeight()}px`,
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

                $scope.drawingStorage.addHtmlObject(newHtmlObject)
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
    }
}
