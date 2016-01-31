'use strict'

angular
    .module('codesketcher')
    .directive('rightSidebar', function(DrawingModel, DrawingAlign) {
        return {
            replace: true,
            controller: function($scope) {
                $scope.drawingModel = DrawingModel
                $scope.drawingAlign = DrawingAlign
            },
            template: `
            <div
                class="right-sidebar"
                resizable-handles="'w'"
                resizable>
                <div ng-if="!drawingModel.currentHtmlObject && drawingModel.currentPage && drawingModel.currentPage.styles">
                    <div class="sidebar-row">
                        <div class="form-column form-label">
                            Name
                        </div>
                        <div class="form-column text-center two-thirds">
                            <input
                                title="Page name"
                                type="text"
                                ng-change="drawingModel.updatePage(drawingModel.currentPage)"
                                ng-model="drawingModel.currentPage.name">
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
                                ng-change="drawingModel.updatePage(drawingModel.currentPage)"
                                ng-model="drawingModel.currentPage.styles.width">
                            Width
                        </div>
                        <div class="form-column text-center">
                            <input
                                title="Page height"
                                type="text"
                                ng-change="drawingModel.updatePage(drawingModel.currentPage)"
                                ng-model="drawingModel.currentPage.styles.height">
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
                                    ng-change="drawingModel.updatePage(drawingModel.currentPage)"
                                    ng-model="drawingModel.currentPage.styles.background">
                                Fill
                            </div>
                            <div class="form-column one-half text-center">
                                <input
                                    type="text"
                                    ng-change="drawingModel.updatePage(drawingModel.currentPage)"
                                    ng-model="drawingModel.currentPage.styles.backgroundSize">
                                Size
                            </div>
                        </div>
                    </div>
                </div>
                <div ng-if="drawingModel.currentHtmlObject && drawingModel.currentHtmlObject.styles">
                    <div class="sidebar-row">
                        <div class="btn-group align-object-btns">
                            <button
                                title="Align selected objects left"
                                class="btn btn-default"
                                ng-click="drawingAlign.alignCurrentHtmlObjectLeft()">
                                <i class="glyphicon glyphicon-object-align-left"></i>
                            </button>
                            <button
                                title="Align selected objects centered vertically"
                                class="btn btn-default"
                                ng-click="drawingAlign.alignCurrentHtmlObjectVertically()">
                                <i class="glyphicon glyphicon-object-align-vertical"></i>
                            </button>
                            <button
                                title="Align selected objects right"
                                class="btn btn-default"
                                ng-click="drawingAlign.alignCurrentHtmlObjectRight()">
                                <i class="glyphicon glyphicon-object-align-right"></i>
                            </button>

                            <button
                                title="Align selected objects to the top"
                                class="btn btn-default"
                                ng-click="drawingAlign.alignCurrentHtmlObjectTop()">
                                <i class="glyphicon glyphicon-object-align-top"></i>
                            </button>
                            <button
                                title="Align selected objects centered horizontally"
                                class="btn btn-default"
                                ng-click="drawingAlign.alignCurrentHtmlObjectHorizontally()">
                                <i class="glyphicon glyphicon-object-align-horizontal"></i>
                            </button>
                            <button
                                title="Align selected objects to the bottom"
                                class="btn btn-default"
                                ng-click="drawingAlign.alignCurrentHtmlObjectBottom()">
                                <i class="glyphicon glyphicon-object-align-bottom"></i>
                            </button>
                        </div>
                    </div>

                    <div class="sidebar-row">
                        <div class="btn-group align-object-btns">
                            <button
                                class="btn btn-default"
                                ng-class="{ active: drawingModel.currentHtmlObject.isLocked }"
                                ng-click="drawingModel.lockCurrentHtmlObject()"><i class="fa fa-lock"></i></button>
                            <button
                                class="btn btn-default"
                                ng-class="{ active: !drawingModel.currentHtmlObject.isLocked }"
                                ng-click="drawingModel.unlockCurrentHtmlObject()"><i class="fa fa-unlock"></i></button>
                        </div>
                    </div>

                    <div class="sidebar-row">
                        <div class="form-column form-label">
                            Name
                        </div>
                        <div class="form-column text-center two-thirds">
                            <input
                                type="text"
                                ng-change="drawingModel.updateHtmlObject(drawingModel.currentHtmlObject)"
                                ng-model="drawingModel.currentHtmlObject.name">
                        </div>
                    </div>

                    <div class="sidebar-row">
                        <div class="form-column form-label">
                            Position
                        </div>
                        <div class="form-column text-center">
                            <input
                                type="text"
                                ng-change="drawingModel.updateHtmlObject(drawingModel.currentHtmlObject)"
                                ng-model="drawingModel.currentHtmlObject.styles.left">
                            X
                        </div>
                        <div class="form-column text-center">
                            <input
                                type="text"
                                ng-change="drawingModel.updateHtmlObject(drawingModel.currentHtmlObject)"
                                ng-model="drawingModel.currentHtmlObject.styles.top">
                            Y
                        </div>
                    </div>

                    <div class="sidebar-row">
                        <div class="form-column form-label">
                            Size
                        </div>
                        <div class="form-column text-center">
                            <input
                                type="text"
                                ng-change="drawingModel.updateHtmlObject(drawingModel.currentHtmlObject)"
                                ng-model="drawingModel.currentHtmlObject.styles.width">
                            Width
                        </div>
                        <div class="form-column text-center">
                            <input
                                type="text"
                                ng-change="drawingModel.updateHtmlObject(drawingModel.currentHtmlObject)"
                                ng-model="drawingModel.currentHtmlObject.styles.height">
                            Height
                        </div>
                    </div>

                    <div class="sidebar-row">
                        <div class="form-column form-label">
                            Radius
                        </div>
                        <div class="form-column text-center" style="width: 45%">
                            <input
                                type="range"
                                ng-change="drawingModel.updateHtmlObject(drawingModel.currentHtmlObject)"
                                ng-model="drawingModel.currentHtmlObject.styles.borderRadius"
                                max="100"
                                min="0"
                                step="1">
                        </div>
                        <div class="form-column text-center" style="width: 22%">
                            <input
                                type="text"
                                ng-change="drawingModel.updateHtmlObject(drawingModel.currentHtmlObject)"
                                ng-model="drawingModel.currentHtmlObject.styles.borderRadius">
                        </div>
                    </div>

                    <div class="sidebar-row">
                        <div class="form-column form-label">
                            Rotation
                        </div>
                        <div class="form-column text-center" style="width: 45%">
                            <input
                                type="range"
                                ng-model="drawingModel.currentHtmlObject.rotation"
                                ng-change="drawingModel.rotationChange()"
                                max="360"
                                min="0"
                                step="1">
                        </div>
                        <div class="form-column text-center" style="width: 22%">
                            <input
                                type="number"
                                max="360"
                                min="0"
                                step="1"
                                ng-change="drawingModel.rotationChange()"
                                ng-model="drawingModel.currentHtmlObject.rotation">
                        </div>
                    </div>

                    <div class="sidebar-row">
                        <div class="form-column form-label">
                            Opacity
                        </div>
                        <div class="form-column text-center" style="width: 45%">
                            <input
                                type="range"
                                ng-change="drawingModel.updateHtmlObject(drawingModel.currentHtmlObject)"
                                ng-model="drawingModel.currentHtmlObject.styles.opacity"
                                max="1"
                                min="0"
                                step=".01">
                        </div>
                        <div class="form-column text-center" style="width: 22%">
                            <input
                                type="text"
                                ng-change="drawingModel.updateHtmlObject(drawingModel.currentHtmlObject)"
                                ng-model="drawingModel.currentHtmlObject.styles.opacity">
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
                                    ng-change="drawingModel.updateHtmlObject(drawingModel.currentHtmlObject)"
                                    ng-model="drawingModel.currentHtmlObject.styles.background">
                                Fill
                            </div>
                            <div class="form-column one-half text-center">
                                <input
                                    type="text"
                                    ng-change="drawingModel.updateHtmlObject(drawingModel.currentHtmlObject)"
                                    ng-model="drawingModel.currentHtmlObject.styles.backgroundSize">
                                Size
                            </div>
                        </div>
                    </div>

                    <div class="sidebar-group">
                        <div class="sidebar-header">
                            Borders
                        </div>
                        <div class="sidebar-row">
                            <div class="form-column text-center">
                                <input
                                    type="text"
                                    ng-change="drawingModel.updateHtmlObject(drawingModel.currentHtmlObject)"
                                    ng-model="drawingModel.currentHtmlObject.styles.borderColor"
                                    colorpicker>
                                Color
                            </div>
                            <div class="form-column text-center">
                                <input
                                    type="text"
                                    ng-change="drawingModel.updateHtmlObject(drawingModel.currentHtmlObject)"
                                    ng-model="drawingModel.currentHtmlObject.styles.borderStyle">
                                Style
                            </div>
                            <div class="form-column text-center">
                                <input
                                    type="text"
                                    ng-change="drawingModel.updateHtmlObject(drawingModel.currentHtmlObject)"
                                    ng-model="drawingModel.currentHtmlObject.styles.borderWidth">
                                Thickness
                            </div>
                        </div>
                    </div>

                    <div class="sidebar-group">
                        <div class="sidebar-header">
                            Shadows
                        </div>
                        <div class="sidebar-row">
                            <div class="form-column full-width text-center">
                                <input
                                    type="text"
                                    ng-change="drawingModel.updateHtmlObject(drawingModel.currentHtmlObject)"
                                    ng-model="drawingModel.currentHtmlObject.styles.boxShadow">
                                Shadow
                            </div>
                        </div>
                    </div>

                    <div class="sidebar-group">
                        <div class="sidebar-header">
                            Fonts
                        </div>
                        <div class="sidebar-row">
                            <div class="form-column one-third text-center">
                                <input
                                    type="text"
                                    ng-change="drawingModel.updateHtmlObject(drawingModel.currentHtmlObject)"
                                    ng-model="drawingModel.currentHtmlObject.styles.color"
                                    colorpicker>
                                Color
                            </div>
                            <div class="form-column one-third text-center">
                                <input
                                    type="text"
                                    ng-change="drawingModel.updateHtmlObject(drawingModel.currentHtmlObject)"
                                    ng-model="drawingModel.currentHtmlObject.styles.fontFamily">
                                Font
                            </div>
                            <div class="form-column one-third text-center">
                                <input
                                    type="text"
                                    ng-change="drawingModel.updateHtmlObject(drawingModel.currentHtmlObject)"
                                    ng-model="drawingModel.currentHtmlObject.styles.fontSize">
                                Size
                            </div>
                        </div>
                        <div class="sidebar-row">
                            <div class="form-column one-third text-center">
                                <input
                                    type="text"
                                    ng-change="drawingModel.updateHtmlObject(drawingModel.currentHtmlObject)"
                                    ng-model="drawingModel.currentHtmlObject.styles.fontWeight">
                                Weight
                            </div>
                            <div class="form-column one-third text-center">
                                <select
                                    ng-change="drawingModel.updateHtmlObject(drawingModel.currentHtmlObject)"
                                    ng-model="drawingModel.currentHtmlObject.styles.textAlign">
                                    <option value="left">left</option>
                                    <option value="center">center</option>
                                    <option value="right">right</option>
                                </select>
                                Align
                            </div>
                        </div>
                    </div>

                    <div class="sidebar-group">
                        <div class="sidebar-header">
                            Content
                        </div>
                        <div class="form-column full-width text-center">
                            <textarea
                                ng-model="drawingModel.currentHtmlObject.styles.body"
                                ng-change="drawingModel.updateHtmlObject(drawingModel.currentHtmlObject)"
                                rows="6"></textarea>
                        </div>
                    </div>
                </div>
            </div>
            `
        }
    })
