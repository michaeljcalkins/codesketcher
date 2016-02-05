'use strict'

angular
    .module('codesketcher')
    .directive('rulers', function(DrawingModel) {
        return {
            controllerAs: 'ctrl',
            controller: function () {
                this.rulerTicks = _.range(1,1000)
                this.drawingModel = DrawingModel

                this.getXRulerWidth = () => {
                    if (!_.has(this.drawingModel, 'currentPage.styles.width')) return '2000px'

                    return (parseInt(this.drawingModel.currentPage.styles.width.slice(0, -2)) + 400) + 'px'
                }

                this.getYRulerHeight = () => {
                    if (!_.has(this.drawingModel, 'currentPage.styles.height')) return '2000px'

                    return (parseInt(this.drawingModel.currentPage.styles.height.slice(0, -2)) + 400) + 'px'
                }
            },
            template: `
            <div class="corner-ruler-tile"></div>
            <div class="x-ruler" style="width: {{ ctrl.getXRulerWidth() }}">
                <div
                    class="x-ruler-tick"
                    ng-class="{
                        'x-ruler-tick-tenth': tick%10 == 0
                    }"
                    ng-repeat="tick in ctrl.rulerTicks">
                    <div ng-if="tick%10 == 0">{{ tick }}0</div>
                </div>
            </div>
            <div class="y-ruler" style="height: {{ ctrl.getYRulerHeight() }}">
                <div
                    class="y-ruler-tick"
                    ng-class="{
                        'y-ruler-tick-tenth': tick%10 == 0
                    }"
                    ng-repeat="tick in ctrl.rulerTicks">
                    <div ng-if="tick%10 == 0">{{ tick }}0</div>
                </div>
            </div>
            `
        }
    })
