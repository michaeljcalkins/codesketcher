'use strict'

angular
    .module('codesketcher')
    .component('rightSidebar', {
        controller: function(DrawingModel, DrawingAlign) {
            this.drawingModel = DrawingModel
            this.drawingAlign = DrawingAlign

            this.hasCurrentHtmlObject = function() {
                return _.has(this.drawingModel, 'currentHtmlObject.styles')
            }
        },
        template: `
        <div
            class="right-sidebar"
            resizable-handles="'w'"
            resizable>
            <div ng-if="!$ctrl.hasCurrentHtmlObject()">
                <div class="sidebar-row">
                    <div class="form-column form-label">
                        Name
                    </div>
                    <div class="form-column text-center two-thirds">
                        <input
                            title="Page name"
                            type="text"
                            ng-change="$ctrl.drawingModel.updatePage($ctrl.drawingModel.currentPage)"
                            ng-model="$ctrl.drawingModel.currentPage.name">
                    </div>
                </div>

                <div class="sidebar-row">
                    <div class="form-column form-label">
                        Size
                    </div>
                    <div class="form-column text-center">
                        <input
                            title="Page width"
                            type="text"
                            ng-change="$ctrl.drawingModel.updatePage($ctrl.drawingModel.currentPage)"
                            ng-model="$ctrl.drawingModel.currentPage.styles.width">
                        Width
                    </div>
                    <div class="form-column text-center">
                        <input
                            title="Page height"
                            type="text"
                            ng-change="$ctrl.drawingModel.updatePage($ctrl.drawingModel.currentPage)"
                            ng-model="$ctrl.drawingModel.currentPage.styles.height">
                        Height
                    </div>
                </div>

                <div class="sidebar-group">
                    <div class="sidebar-header">
                        Fills
                    </div>
                    <div class="sidebar-row">
                        <div class="form-column one-half text-center">
                            <input
                                type="text"
                                colorpicker
                                ng-change="$ctrl.drawingModel.updatePage($ctrl.drawingModel.currentPage)"
                                ng-model="$ctrl.drawingModel.currentPage.styles.background">
                            Fill
                        </div>
                        <div class="form-column one-half text-center">
                            <input
                                type="text"
                                ng-change="$ctrl.drawingModel.updatePage($ctrl.drawingModel.currentPage)"
                                ng-model="$ctrl.drawingModel.currentPage.styles.backgroundSize">
                            Size
                        </div>
                    </div>
                </div>
            </div>
            <div ng-if="$ctrl.hasCurrentHtmlObject()">
                <div class="sidebar-row">
                    <div class="btn-group align-object-btns">
                        <button
                            title="Align selected objects left"
                            class="btn btn-default"
                            ng-click="$ctrl.drawingAlign.alignCurrentHtmlObjectLeft()">
                            <i class="glyphicon glyphicon-object-align-left"></i>
                        </button>
                        <button
                            title="Align selected objects centered vertically"
                            class="btn btn-default"
                            ng-click="$ctrl.drawingAlign.alignCurrentHtmlObjectVertically()">
                            <i class="glyphicon glyphicon-object-align-vertical"></i>
                        </button>
                        <button
                            title="Align selected objects right"
                            class="btn btn-default"
                            ng-click="$ctrl.drawingAlign.alignCurrentHtmlObjectRight()">
                            <i class="glyphicon glyphicon-object-align-right"></i>
                        </button>

                        <button
                            title="Align selected objects to the top"
                            class="btn btn-default"
                            ng-click="$ctrl.drawingAlign.alignCurrentHtmlObjectTop()">
                            <i class="glyphicon glyphicon-object-align-top"></i>
                        </button>
                        <button
                            title="Align selected objects centered horizontally"
                            class="btn btn-default"
                            ng-click="$ctrl.drawingAlign.alignCurrentHtmlObjectHorizontally()">
                            <i class="glyphicon glyphicon-object-align-horizontal"></i>
                        </button>
                        <button
                            title="Align selected objects to the bottom"
                            class="btn btn-default"
                            ng-click="$ctrl.drawingAlign.alignCurrentHtmlObjectBottom()">
                            <i class="glyphicon glyphicon-object-align-bottom"></i>
                        </button>
                    </div>
                </div>

                <div class="sidebar-row">
                    <div class="btn-group align-object-btns">
                        <button
                            class="btn btn-default"
                            title="Lock current object in place"
                            ng-class="{ active: $ctrl.drawingModel.currentHtmlObject.isLocked }"
                            ng-click="$ctrl.drawingModel.lockCurrentHtmlObject()"><i class="fa fa-lock"></i></button>
                        <button
                            class="btn btn-default"
                            title="Unlock current object"
                            ng-class="{ active: !$ctrl.drawingModel.currentHtmlObject.isLocked }"
                            ng-click="$ctrl.drawingModel.unlockCurrentHtmlObject()"><i class="fa fa-unlock"></i></button>

                        <button
                            class="btn btn-default"
                            title="Duplicate current object"
                            ng-click="$ctrl.drawingModel.duplicateCurrentHtmlObject()">
                            <i class="fa fa-clone"></i>
                        </button>
                    </div>
                </div>

                <div class="sidebar-row">
                    <div class="form-column form-label">
                        Name
                    </div>
                    <div class="form-column text-center two-thirds">
                        <input
                            type="text"
                            ng-change="$ctrl.drawingModel.updateHtmlObject($ctrl.drawingModel.currentHtmlObject)"
                            ng-model="$ctrl.drawingModel.currentHtmlObject.name">
                    </div>
                </div>

                <div class="sidebar-group">
                    <div class="sidebar-header">
                        Styles
                    </div>
                    <div
                        class="sidebar-row"
                        ng-repeat="(styleName, styleValue) in $ctrl.drawingModel.currentHtmlObject.styles track by $index">
                    <div class="sidebar-row">
                        <div class="form-column one-half form-label">
                            {{ styleName | camelToTitleCase }}
                        </div>
                        <div class="form-column one-half text-center">
                            <input
                                type="text"
                                ng-change="$ctrl.drawingModel.updateHtmlObject($ctrl.drawingModel.currentHtmlObject)"
                                ng-model="$ctrl.drawingModel.currentHtmlObject.styles[styleName]">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `
    })
