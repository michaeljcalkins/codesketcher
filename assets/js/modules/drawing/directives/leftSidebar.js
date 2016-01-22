'use strict'

module.exports = function LeftSidebarDirective() {
    return {
        scope: {
            drawingStorage: '='
        },
        controller: function($scope) {
            $scope.sortableOptions = {
                distance: 3,
                update: function() {
                    $scope.drawingStorage.saveCurrentSketch()
                }
            }
        },
        template: `
        <div class="left-sidebar">
            <div
                ng-show="drawingStorage.currentSketch"
                class="panel panel-left-sidebar">
                <div class="panel-heading">
                    Pages
                    <button
                        ng-click="drawingStorage.createPageAndSetAsCurrent()"
                        class="btn btn-link">+</button>
                </div>
                <div class="panel-body">
                    <ul
                        class="nav nav-sidebar"
                        ng-model="drawingStorage.currentSketch.pages"
                        ui-sortable="sortableOptions">
                         <li
                            ng-repeat="page in drawingStorage.currentSketch.pages track by $index"
                            ng-class="{
                                active: drawingStorage.currentPage && drawingStorage.currentPage.id == page.id
                            }"
                            ng-click="drawingStorage.setCurrentPage(page)">
                            <a>{{ page.name || "Unamed page" }}</a>
                        </li>
                    </ul>
                </div>
            </div>

            <div
                class="panel panel-left-sidebar"
                ng-if="drawingStorage.currentPage"
                style="border-top: 1px solid #b8b8b8;">
                <div class="panel-heading">{{ drawingStorage.currentPage.name }}</div>
                <div class="panel-body">
                    <ul
                        class="nav nav-sidebar"
                        ng-model="drawingStorage.currentPage.htmlObjects"
                        ui-sortable="sortableOptions"
                        ng-if="drawingStorage.currentPage">
                         <li
                            ng-class="{ active: drawingStorage.currentHtmlObject && drawingStorage.currentHtmlObject.id == htmlObject.id }"
                            ng-repeat="htmlObject in drawingStorage.currentPage.htmlObjects"
                            ng-click="drawingStorage.setCurrentHtmlObject(htmlObject)">
                            <a>{{ htmlObject.name ? htmlObject.name : 'Unnamed object' }}</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        `
    }
}
