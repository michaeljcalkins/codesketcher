'use strict'

angular
    .module('codesketcher')
    .component('htmlObject', {
        bindings: {
            htmlObject: '='
        },
        controller: function(DrawingModel, $timeout) {
            this.drawingModel = DrawingModel
            this.draggableOptions = {
                stop: (evt, x, y, startX, startY, wasMoved) => {
                    if (!wasMoved) return
                    this.htmlObject.styles.left = x + 'px'
                    this.htmlObject.styles.top = y + 'px'
                },
                drag: function (evt, newX, newY, startX, startY, cb) {
                    // http://stackoverflow.com/questions/8605439/jquery-draggable-div-with-zoom
                    DrawingModel.currentZoom = DrawingModel.currentZoom || 1
                    var factor = (1 / DrawingModel.currentZoom) - 1
                    newY += ~~((newY - startY) * factor)
                    newX += ~~((newX - startX) * factor)
                    cb(newX, newY)
                }
            }
        },
        replace: true,
        template: `
        <div
            draggable="$ctrl.draggableOptions"
            class="html-object"
            ng-mousedown="$ctrl.drawingModel.setCurrentHtmlObject($ctrl.htmlObject)"
            ng-click="$ctrl.drawingModel.setCurrentHtmlObject($ctrl.htmlObject)"
            ng-class="{
                'text-html-object': $ctrl.drawingModel.currentHtmlObject.type == 'text',
                'image-html-object': $ctrl.drawingModel.currentHtmlObject.type == 'image',
                'rectangle-html-object': $ctrl.drawingModel.currentHtmlObject.type == 'rectangle',
                'current-html-object': $ctrl.drawingModel.isCurrentHtmlObject($ctrl.htmlObject.id),
                'unfocused-html-object': !$ctrl.drawingModel.isCurrentHtmlObject($ctrl.htmlObject.id)
            }"
            ng-style="$ctrl.htmlObject.styles">
            <div class="html-object-border"></div>
            <div
                class="html-object-switch-container"
                ng-switch on="$ctrl.htmlObject.type">
                <div ng-switch-when="image">
                    <img ng-src="data:image;base64,{{ $ctrl.htmlObject.imageSrc }}" style="height: 100%; width: 100%;">
                </div>
                <div ng-switch-when="text">
                    <textarea
                        ng-change="$ctrl.drawingModel.updateHtmlObject($ctrl.drawingModel.currentHtmlObject)"
                        msd-elastic
                        placeholder="Write your text here..."
                        ng-model="$ctrl.htmlObject.body"></textarea>
                </div>
                <div
                    ng-switch-default
                    ng-bind-html="$ctrl.toTrusted($ctrl.htmlObject.body)"></div>
            </div>
        </div>
        `
    })
