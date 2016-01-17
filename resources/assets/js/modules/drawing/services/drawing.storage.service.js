module.exports = function($rootScope, $timeout) {
    return function() {
        this.pages = []
        this.currentHtmlObject = null
        this.currentPage = null

        function guid() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
        }

        this.createPage = () => {
            this.pages.push({
                id: guid(),
                name: "",
                htmlObjects: [],
                styles: {
                    height: '900px',
                    width: '1200px',
                    backgroundColor: 'white'
                }
            })
        }

        this.createPageAndSetAsCurrent = () => {
            let id = guid()
            this.pages.push({
                id: id,
                name: "",
                htmlObjects: [],
                styles: {
                    height: '900px',
                    width: '1200px',
                    backgroundColor: 'white'
                }
            })

            let page = _.find(this.pages, { id })
            this.setCurrentPage(page)
        }

        this.removePage = (page) => {
            _.remove(this.pages, { id: page.id })
        }

        this.setCurrentPage = (page) => {
            this.currentPage = page
            this.currentPage.styles = this.currentPage.styles || {}
            this.currentHtmlObject = null
        }

        this.setCurrentHtmlObject = (htmlObject) => {
            this.currentHtmlObject = htmlObject
            if (!$rootScope.$$phase) $rootScope.$apply()
        }

        this.removeHtmlObject = (htmlObject) => {
            let pageIndex = _.findIndex(this.pages, { id: this.currentPage.id })
            let htmlObjectsCopy = _.clone(this.pages[pageIndex].htmlObjects)
            _.remove(htmlObjectsCopy, { id: htmlObject.id })
            this.pages[pageIndex].htmlObjects = htmlObjectsCopy
        }

        this.createHtmlObject = (newHtmlObject) => {
            let pageIndex = _.findIndex(this.pages, { id: this.currentPage.id })
            this.pages[pageIndex].htmlObjects.push(newHtmlObject)
            this.setCurrentPage(this.pages[pageIndex])
            $rootScope.$apply()
        }

        this.createHtmlObjectAndSetAsCurrent = (newHtmlObject) => {
            this.createHtmlObject(newHtmlObject)
            this.setCurrentHtmlObject(newHtmlObject)
        }

        this.updateHtmlObject = (htmlObject) => {
            let index = _.findIndex(this.currentPage.htmlObjects, { id: htmlObject.id })
            this.currentPage.htmlObjects.splice(index, 1, htmlObject)
        }
    }
}
