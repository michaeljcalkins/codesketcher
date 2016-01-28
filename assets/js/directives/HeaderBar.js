'use strict'

angular
    .module('codesketcher')
    .directive('headerBar', function(DrawingEvents, DrawingModel, DrawingLayers, $rootScope) {
        return {
            controller: function($scope) {
                $scope.drawingModel = DrawingModel
                $scope.drawingLayers = DrawingLayers

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
                                title="Group the currently selected objects together"
                                class="pointer">
                                <a>
                                    <i class="fa fa-object-group"></i>
                                    Group
                                </a>
                            </li>
                            <li
                                title="Ungroup the currently selected grouped objects"
                                class="pointer">
                                <a>
                                    <i class="fa fa-object-ungroup"></i>
                                    Ungroup
                                </a>
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
                                title="Scale currently selected object by pixels or percentage"
                                class="pointer">
                                <a>
                                    <i class="fa fa-expand"></i>
                                    Scale
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
                            <li class="pointer">
                                <a>
                                    <i class="fa fa-share-square-o"></i>
                                    Share
                                </a>
                            </li>
                            <li><a>&nbsp;</a></li>
                            <li class="dropdown pointer">
                                <a class="dropdown-toggle" data-toggle="dropdown">
                                    <i class="fa fa-desktop"></i>
                                    Export <span class="caret"></span>
                                </a>
                                <ul class="dropdown-menu dropdown-menu-right">
                                    <li><a>Image (.png)</a></li>
                                    <li><a>HTML</a></li>
                                    <li><a>Laravel Blade</a></li>
                                    <li><a>AngularJS v1</a></li>
                                    <li><a>AngularJS v2</a></li>
                                    <li><a>ReactJS</a></li>
                                    <li><a>VueJS</a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            `
        }
    })