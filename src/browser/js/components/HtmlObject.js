'use strict'

angular
    .module('codesketcher')
    .component('htmlObject', {
        bindings: {
            htmlObject: '='
        },
        controller: function(DrawingModel, $timeout) {
            this.drawingModel = DrawingModel
        },
        replace: true,
        template: `
        <div
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
                <div
                    ng-switch-default
                    ng-bind-html="$ctrl.toTrusted($ctrl.htmlObject.body)"></div>
                <div ng-repeat="subHtmlObject in htmlObject.htmlObjects"></div>
            </div>
        </div>
        `
    })
