'use strict'

angular
    .module('codesketcher')
    .directive('headerBar', function(DrawingEvents, DrawingModel, DrawingLayers, $rootScope, $uibModal) {
        return {
            controller: function($scope) {
                $scope.drawingModel = DrawingModel
                $scope.drawingLayers = DrawingLayers

                $scope.openExportModal = function (size) {
                    let modalInstance = $uibModal.open({
                        animation: false,
                        templateUrl: 'assets/js/modules/export/views/exportModal.html',
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
                    DrawingModel.openImageDialog()
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
                                ng-click="drawingModel.newCurrentSketch()">
                                 <a>
                                    <i class="fa fa-file"></i>
                                    New
                                </a>
                            </li>
                            <li
                                class="dropdown pointer"
                                ng-click="drawingModel.openFileDialog()"
                                title="Open a sketch (cmd + o)">
                                <a class="dropdown-toggle" data-toggle="dropdown">
                                    <i class="fa fa-folder-open"></i>
                                    Open
                                </a>
                            </li>
                            <li
                                class="dropdown pointer"
                                title="Save currently open sketch (cmd + s)"
                                ng-class="{ disabled: !drawingModel.flags.isDirty }"
                                ng-click="drawingModel.saveCurrentSketch()">
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
                                        ng-click="ctrl.sendInsertRectangleEvent()">
                                        <a>Rectangle (R)</a>
                                    </li>
                                    <li
                                        title="Create an oval"
                                        ng-click="ctrl.sendInsertOvalEvent()">
                                        <a>Oval (O)</a>
                                    </li>
                                    <li
                                        title="Insert styled text"
                                        ng-click="ctrl.sendInsertTextEvent()">
                                        <a>Text (T)</a>
                                    </li>
                                    <li
                                        title="Insert an image from your computer"
                                        ng-click="ctrl.sendInsertImageEvent()">
                                        <a>Image (I)</a>
                                    </li>
                                </ul>
                            </li>
                            <li><a>&nbsp;</a></li>
                            <li
                                class="pointer"
                                title="Zoom in (cmd + =)"
                                ng-click="drawingModel.zoomIn()">
                                <a style="margin-top: 14px;">
                                    <i class="fa fa-plus"></i>
                                </a>
                            </li>
                            <li
                                title="Shows current zoom level"
                                class="pointer">
                                <a>
                                    <i class="fa fa-search"></i>
                                    {{ (drawingModel.currentZoom * 100) | number:0 }}%
                                </a>
                            </li>
                            <li
                                class="pointer"
                                title="Zoom out (cmd + -)"
                                ng-click="drawingModel.zoomOut()">
                                <a style="margin-top: 14px;">
                                    <i class="fa fa-minus"></i>
                                </a>
                            </li>
                            <li><a>&nbsp;</a></li>
                            <li
                                class="pointer"
                                title="Bring current object forwards"
                                ng-click="drawingLayers.bringCurrentObjectForward()">
                                <a>
                                    <i class="fa fa-level-up"></i>
                                    Forward
                                </a>
                            </li>
                            <li
                                class="pointer"
                                title="Send current object backwards"
                                ng-click="drawingLayers.sendCurrentObjectBackward()">
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
                                    <li><a>Show Pixels</a></li>
                                    <li><a>Show Rulers</a></li>
                                    <li><a>Show Grid</a></li>
                                    <li><a>Show Layout</a></li>
                                    <li class="divider"></li>
                                    <li><a>Grid Settings</a></li>
                                    <li><a>Layout Settings</a></li>
                                </ul>
                            </li>
                            <li><a>&nbsp;</a></li>
                            <li
                                ng-click="openExportModal()"
                                class="dropdown pointer">
                                <a class="dropdown-toggle" data-toggle="dropdown">
                                    <i class="fa fa-desktop"></i>
                                    Export <span class="caret"></span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            `
        }
    })
