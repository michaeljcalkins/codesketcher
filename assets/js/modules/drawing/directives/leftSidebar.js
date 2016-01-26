'use strict'

module.exports = function LeftSidebarDirective($rootScope) {
    return {
        scope: {
            drawingModel: '='
        },
        controller: function($scope) {
            $scope.sortableOptions = {
                distance: 3,
                update: function() {
                    $scope.drawingModel.flags.dirty = true
                }
            }
        },
        template: `
        <div class="left-sidebar">
            <div
                ng-show="drawingModel.currentSketch"
                class="panel panel-left-sidebar">
                <div class="panel-heading">
                    Pages
                    <button
                        class="btn btn-default btn-xs pull-right"
                        style="margin-top: 4px; width: 25px"
                        ng-click="drawingModel.createPageAndSetAsCurrent()">+</button>
                </div>
                <div class="panel-body">
                    <ul
                        class="nav nav-sidebar"
                        ng-model="drawingModel.currentSketch.pages"
                        ui-sortable="sortableOptions">
                         <li
                            ng-repeat="page in drawingModel.currentSketch.pages track by $index"
                            ng-class="{
                                active: drawingModel.currentPage && drawingModel.currentPage.id == page.id
                            }"
                            ng-click="drawingModel.setCurrentPage(page)">
                            <a>{{ page.name || "Unamed page" }}</a>
                        </li>
                    </ul>
                </div>
            </div>

            <div
                class="panel panel-left-sidebar"
                ng-if="drawingModel.currentPage"
                style="border-top: 1px solid #b8b8b8;">
                <div class="panel-heading">{{ drawingModel.currentPage.name }}</div>
                <div class="panel-body">
                    <ul
                        class="nav nav-sidebar"
                        ng-model="drawingModel.currentPage.htmlObjects"
                        ui-sortable="sortableOptions"
                        ng-if="drawingModel.currentPage">
                         <li
                            ng-class="{ active: drawingModel.currentHtmlObject.id == htmlObject.id }"
                            ng-repeat="htmlObject in drawingModel.currentPage.htmlObjects"
                            ng-click="drawingModel.setCurrentHtmlObject(htmlObject)">
                            <a>{{ htmlObject.name ? htmlObject.name : 'Unnamed object' }}</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        `
    }
}
