'use strict'

angular
    .module('codesketcher')
    .component('headerTitleBar', {
        controller: function(DrawingModel) {
            this.drawingModel = DrawingModel
        },
        template: `
        <div class="header-title-bar">
            <span ng-show="$ctrl.drawingModel.currentSketch">
                {{ $ctrl.drawingModel.currentSketchFilename || 'Unsaved sketch' }}
            </span>
        </div>
        `
    })
