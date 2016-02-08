'use strict'

angular
    .module('codesketcher')
    .component('scalePopover', {
        controller: function(DrawingModel) {
            this.drawingModel = DrawingModel
            this.currentHtmlObjectCopy = angular.copy(this.drawingModel.currentHtmlObject)
            this.percentageChange = 100

            this.scaleCurrentHtmlObject = function() {
                this.drawingModel.currentHtmlObject.styles.height = this.currentHtmlObjectCopy.styles.height.slice(0, -2) + 'px'
                this.drawingModel.currentHtmlObject.styles.width = this.currentHtmlObjectCopy.styles.width.slice(0, -2) + 'px'
                this.drawingModel.updateHtmlObject(this.drawingModel.currentHtmlObject)
                this.percentageChange = 100
            }

            this.updateSizesBasedOnPercentage = function() {
                let factor = (this.percentageChange / 100)

                let objectHeight = this.drawingModel.currentHtmlObject.styles.height.slice(0, -2)
                let objectWidth = this.drawingModel.currentHtmlObject.styles.width.slice(0, -2)

                this.currentHtmlObjectCopy.styles.height = ~~(objectHeight * factor) + 'px'
                this.currentHtmlObjectCopy.styles.width = ~~(objectWidth * factor) + 'px'
            }
        },
        template: `
        <div class="form-group">
            <label>Width</label>
            <input
                type="text"
                ng-model="$ctrl.currentHtmlObjectCopy.styles.width"
                class="form-control">
        </div>

        <div class="form-group">
            <label>Height</label>
            <input
                type="text"
                ng-model="$ctrl.currentHtmlObjectCopy.styles.height"
                class="form-control">
        </div>

        <div class="form-group">
            <label>Scale</label>
            <div class="input-group">
                <input
                    type="number"
                    min="0"
                    step="1"
                    ng-model="$ctrl.percentageChange"
                    ng-change="$ctrl.updateSizesBasedOnPercentage()"
                    class="form-control">
                <span class="input-group-addon">%</span>
            </div>
        </div>

        <div class="row">
            <div class="col-sm-12 text-right">
                <button class="btn btn-link btn-sm">
                    Cancel
                </button>
                <button class="btn btn-primary btn-sm" ng-click="$ctrl.scaleCurrentHtmlObject()">
                    Ok
                </button>
            </div>
        </div>
        `
    })
