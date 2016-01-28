'use strict'

angular
    .module('codesketcher')
    .directive('headerTitleBar', function(DrawingModel) {
        return {
            controller: function($scope) {
                $scope.drawingModel = DrawingModel
            },
            template: `
            <div class="header-title-bar">
                <span ng-show="drawingModel.currentSketch">
                    {{ drawingModel.currentSketchFilename || 'Unsaved sketch' }}
                </span>
            </div>
            `
        }
    })
