'use strict'

let DrawingEvents = require('../lib/DrawingEvents')

angular
    .module('codesketcher')
    .component('headerBar', {
        controller: function(DrawingModel, DrawingLayers, $rootScope, $uibModal) {
            this.drawingModel = DrawingModel
            this.drawingLayers = DrawingLayers

            this.openExportModal = function () {
                if (!this.drawingModel.currentSketch) return

                let modalInstance = $uibModal.open({
                    animation: false,
                    size: 'lg',
                    templateUrl: './js/modules/export/views/exportModal.html',
                    controllerAs: 'ctrl',
                    controller: 'ExportModalCtrl'
                })

                modalInstance.result.then(function () {

                }, function () {
                })
            }

            this.sendInsertRectangleEvent = () => {
                $rootScope.$broadcast(DrawingEvents.insert.rectangle)
            }

            this.sendInsertOvalEvent = () => {
                $rootScope.$broadcast(DrawingEvents.insert.oval)
            }

            this.sendInsertTextEvent = () => {
                $rootScope.$broadcast(DrawingEvents.insert.text)
            }

            this.sendInsertImageEvent = () => {
                this.drawingModel.openImageDialog()
            }
        },
        template: `
        <nav class="navbar navbar-default navbar-fixed-top">
            <header-title-bar></header-title-bar>
            <div class="container-fluid">
                <div id="navbar" class="navbar-collapse collapse">
                    <ul class="nav navbar-nav text-center">
                        <li
                            class="pointer"
                            title="Create a new sketch (cmd + s)"
                            ng-click="$ctrl.drawingModel.newCurrentSketch()">
                             <a>
                                <i class="fa fa-file"></i>
                                New
                            </a>
                        </li>
                        <li
                            class="dropdown pointer"
                            ng-click="$ctrl.drawingModel.openFileDialog()"
                            title="Open a sketch (cmd + o)">
                            <a class="dropdown-toggle" data-toggle="dropdown">
                                <i class="fa fa-folder-open"></i>
                                Open
                            </a>
                        </li>
                        <li
                            class="dropdown pointer"
                            title="Save currently open sketch (cmd + s)"
                            ng-class="{ disabled: !$ctrl.drawingModel.flags.isDirty }"
                            ng-click="$ctrl.drawingModel.saveCurrentSketch()">
                            <a class="dropdown-toggle" data-toggle="dropdown">
                                <i class="fa fa-floppy-o"></i>
                                Save
                            </a>
                        </li>
                        <li><a>&nbsp;</a></li>
                        <li class="dropdown pointer">
                            <a class="dropdown-toggle" data-toggle="dropdown">
                                <i class="fa fa-plus-square"></i>
                                Insert <span class="caret"></span>
                            </a>
                            <ul class="dropdown-menu">
                                <li
                                    title="Create a rectangle"
                                    ng-click="$ctrl.sendInsertRectangleEvent()">
                                    <a>Rectangle (R)</a>
                                </li>
                                <li
                                    title="Create an oval"
                                    ng-click="$ctrl.sendInsertOvalEvent()">
                                    <a>Oval (O)</a>
                                </li>
                                <li
                                    title="Insert styled text"
                                    ng-click="$ctrl.sendInsertTextEvent()">
                                    <a>Text (T)</a>
                                </li>
                                <li
                                    title="Insert an image from your computer"
                                    ng-click="$ctrl.sendInsertImageEvent()">
                                    <a>Image (I)</a>
                                </li>
                            </ul>
                        </li>
                        <li><a>&nbsp;</a></li>
                        <li
                            class="pointer"
                            title="Zoom in (cmd + =)"
                            ng-click="$ctrl.drawingModel.zoomIn()">
                            <a style="margin-top: 14px;">
                                <i class="fa fa-plus"></i>
                            </a>
                        </li>
                        <li
                            title="Shows current zoom level"
                            class="pointer">
                            <a>
                                <i class="fa fa-search"></i>
                                {{ ($ctrl.drawingModel.currentZoom * 100) | number:0 }}%
                            </a>
                        </li>
                        <li
                            class="pointer"
                            title="Zoom out (cmd + -)"
                            ng-click="$ctrl.drawingModel.zoomOut()">
                            <a style="margin-top: 14px;">
                                <i class="fa fa-minus"></i>
                            </a>
                        </li>
                        <li><a>&nbsp;</a></li>
                        <li
                            class="pointer"
                            title="Scale layer"
                            uib-popover-template="'src/browser/js/directives/views/scalePopover.html'"
                            popover-placement="bottom"
                            popover-title="Scale Layer">
                            <a>
                                <i class="fa fa-expand"></i>
                                Scale
                            </a>
                        </li>
                        <li><a>&nbsp;</a></li>
                        <li
                            class="pointer"
                            title="Bring current object forwards"
                            ng-click="$ctrl.drawingLayers.bringCurrentObjectForward()">
                            <a>
                                <i class="fa fa-level-up"></i>
                                Forward
                            </a>
                        </li>
                        <li
                            class="pointer"
                            title="Send current object backwards"
                            ng-click="$ctrl.drawingLayers.sendCurrentObjectBackward()">
                            <a>
                                <i class="fa fa-level-down"></i>
                                Backward
                            </a>
                        </li>
                        <li><a>&nbsp;</a></li>
                        <li class="dropdown pointer">
                            <a class="dropdown-toggle" data-toggle="dropdown">
                                <i class="fa fa-toggle-on"></i>
                                View <span class="caret"></span>
                            </a>
                            <ul class="dropdown-menu">
                                <li><a>Show Rulers</a></li>
                            </ul>
                        </li>
                        <li><a>&nbsp;</a></li>
                        <li
                            ng-click="$ctrl.openExportModal()"
                            class="dropdown pointer">
                            <a class="dropdown-toggle" data-toggle="dropdown">
                                <i class="fa fa-upload"></i>
                                Export
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        `
    })
