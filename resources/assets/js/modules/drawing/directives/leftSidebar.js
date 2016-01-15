module.exports = function() {
    return {
        scope: {
            drawingStorage: '='
        },
        template: `
        <div class="left-sidebar">
            <div class="panel panel-left-sidebar">
                <div class="panel-heading">
                    Pages
                    <button
                        ng-click="drawingStorage.createPage()"
                        class="btn btn-link">+</button>
                </div>
                <div class="panel-body">
                    <ul class="nav nav-sidebar">
                         <li
                            ng-repeat="page in drawingStorage.pages"
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
                    <ul class="nav nav-sidebar" ng-if="drawingStorage.currentPage">
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
