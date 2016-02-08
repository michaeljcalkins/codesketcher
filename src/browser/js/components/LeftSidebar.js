'use strict'

angular
    .module('codesketcher')
    .component('leftSidebar', {
        controller: function(DrawingModel, DrawingLayers, $timeout) {
            this.drawingModel = DrawingModel
            this.drawingLayers = DrawingLayers

            this.sortableHtmlObjectOptions = {
                distance: 3,
                axis: 'y',
                update: function() {
                    $timeout(function() {
                        DrawingModel.flags.dirty = true
                        DrawingLayers.updateLayerPositions()
                    })
                }
            }

            this.sortablePageOptions = {
                distance: 3,
                axis: 'y',
                update: function() {
                    $timeout(function() {
                        DrawingModel.flags.dirty = true
                    })
                }
            }
        },
        template: `
        <div
            class="left-sidebar"
            resizable-handles="'e'"
            resizable>
            <div
                ng-show="$ctrl.drawingModel.currentSketch"
                class="panel panel-left-sidebar">
                <div class="panel-heading">
                    Pages
                    <button
                        class="btn btn-default btn-xs pull-right"
                        style="margin-top: 4px; width: 25px"
                        ng-click="$ctrl.drawingModel.createPageAndSetAsCurrent()">+</button>
                </div>
                <div class="panel-body">
                    <ul
                        class="nav nav-sidebar"
                        ng-model="$ctrl.drawingModel.currentSketch.pages"
                        ui-sortable="$ctrl.sortablePageOptions">
                         <li
                            ng-repeat="page in $ctrl.drawingModel.currentSketch.pages track by $index"
                            ng-class="{
                                active: $ctrl.drawingModel.currentPage && $ctrl.drawingModel.currentPage.id == page.id
                            }"
                            ng-click="$ctrl.drawingModel.setCurrentPage(page)">
                            <a>{{ page.name || "Unamed page" }}</a>
                        </li>
                    </ul>
                </div>
            </div>

            <div
                class="panel panel-left-sidebar"
                ng-if="$ctrl.drawingModel.currentPage"
                style="border-top: 1px solid #b8b8b8;">
                <div class="panel-heading">{{ $ctrl.drawingModel.currentPage.name }}</div>
                <div class="panel-body">
                    <ul
                        class="nav nav-sidebar"
                        ng-model="$ctrl.drawingModel.currentPage.htmlObjects"
                        ui-sortable="$ctrl.sortableHtmlObjectOptions"
                        ng-if="$ctrl.drawingModel.currentPage">
                         <li
                            ng-class="{ active: $ctrl.drawingModel.currentHtmlObject.id == htmlObject.id }"
                            ng-repeat="htmlObject in $ctrl.drawingModel.currentPage.htmlObjects track by $index"
                            ng-click="$ctrl.drawingModel.setCurrentHtmlObject(htmlObject)">
                            <a>{{ htmlObject.name ? htmlObject.name : 'Unnamed ' + htmlObject.type }}</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        `
    })
