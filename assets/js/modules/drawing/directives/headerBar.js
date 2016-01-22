'use strict'

module.exports = function HeaderBarDirective() {
    return {
        scope: {
            drawingStorage: '='
        },
        template: `
        <nav class="navbar navbar-default navbar-fixed-top">
            <div class="container-fluid">
                <div id="navbar" class="navbar-collapse collapse">
                    <ul class="nav navbar-nav text-center">
                        <li class="pointer" ng-click="drawingStorage.newCurrentSketch()">
                             <a>
                                <i class="fa fa-file"></i>
                                New
                            </a>
                        </li>
                        <li class="dropdown pointer" ng-click="drawingStorage.openFileDialog()">
                            <a class="dropdown-toggle" data-toggle="dropdown">
                                <i class="fa fa-folder-open"></i>
                                Open
                            </a>
                        </li>
                        <li class="dropdown pointer" ng-click="drawingStorage.saveCurrentSketch()">
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
                                <li><a>Rectangle</a></li>
                                <li><a>Oval</a></li>
                                <li><a>Text</a></li>
                                <li><a>Image</a></li>
                                <li><a>Show Layout</a></li>
                                <li class="divider"></li>
                                <li><a>Styled Text</a></li>
                            </ul>
                        </li>
                        <li><a>&nbsp;</a></li>
                        <li class="pointer">
                            <a>
                                <i class="fa fa-object-group"></i>
                                Group
                            </a>
                        </li>
                        <li class="pointer">
                            <a>
                                <i class="fa fa-object-ungroup"></i>
                                Ungroup
                            </a>
                        </li>
                        <li><a>&nbsp;</a></li>
                        <li class="pointer" ng-click="drawingStorage.zoomIn()">
                            <a>
                                <i class="fa fa-search-plus"></i>
                                Zoom In
                            </a>
                        </li>
                        <li class="pointer" ng-click="drawingStorage.zoomOut()">
                            <a>
                                <i class="fa fa-search-minus"></i>
                                Zoom Out
                            </a>
                        </li>
                        <li><a>&nbsp;</a></li>
                        <li class="pointer">
                            <a>
                                <i class="fa fa-rotate-right"></i>
                                Rotate
                            </a>
                        </li>
                        <li class="pointer">
                            <a>
                                <i class="fa fa-expand"></i>
                                Scale
                            </a>
                        </li>
                        <li><a>&nbsp;</a></li>
                        <li class="pointer" ng-click="drawingStorage.bringCurrentObjectForward()">
                            <a>
                                <i class="fa fa-level-up"></i>
                                Forward
                            </a>
                        </li>
                        <li class="pointer" ng-click="drawingStorage.sendCurrentObjectBackward()">
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
                                <li><a>Single Preview File (HTML)</a></li>
                                <li><a>Image (.png)</a></li>
                                <li><a>HTML Files</a></li>
                                <li><a>AngularJS (v1) Directive</a></li>
                                <li><a>AngularJS (v1) Component</a></li>
                                <li><a>ReactJS Dumb Component</a></li>
                                <li><a>ReactJS Component</a></li>
                                <li><a>VueJS Component</a></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        `
    }
}
