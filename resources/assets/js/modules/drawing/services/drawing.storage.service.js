module.exports = function($rootScope, $http, $timeout, localStorageService) {
    return function() {
        this.pages = []
        this.currentHtmlObject = null
        this.currentPage = null
        this.currentSketch = null

        function guid() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
        }

        this.fetch = () => {
            $http
                .get('/api/sketches')
                .success((data) => {
                    this.sketches = data.sketches
                    this.setLastObjects()
                    $rootScope.$broadcast('sketches:loaded')
                })
        }

        this.setCurrentSketchById = (sketchId) => {
            let sketch = _.find(this.sketches, { id: sketchId })
            if (sketch) this.setCurrentSketch(sketch)
        }

        this.setCurrentPageById = (pageId) => {
            if (!this.currentSketch) return
            let page = _.find(this.pages, { id: pageId })
            if (page) this.setCurrentPage(page)
        }

        this.setLastObjects = () => {
            let lastSketchId = localStorageService.get('lastSketchId')
            let lastPageId = localStorageService.get('lastPageId')

            if (lastSketchId) {
                this.setCurrentSketchById(lastSketchId)
            }

            if (lastPageId) {
                this.setCurrentPageById(lastPageId)
            }
        }

        this.setCurrentSketch = (sketch) => {
            this.currentSketch = sketch
            this.pages = JSON.parse(sketch.json) || []
            localStorageService.set('lastSketchId', sketch.id)
            $rootScope.$broadcast('sketch:selected')
        }

        let currentSketchHandle
        this.saveCurrentSketch = () => {
            $timeout.cancel(currentSketchHandle)
            currentSketchHandle = $timeout(() => {
                $http
                    .put(`/api/sketches/${this.currentSketch.id}`, {
                        name: this.currentSketch.name,
                        json: JSON.stringify(this.pages)
                    })
                    .success(() => {
                        console.log('Sketch saved...')
                        $rootScope.$broadcast('sketch:saved')
                    })
            }, 300)
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
            this.saveCurrentSketch()
            $rootScope.$broadcast('page:created')
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
            $rootScope.$broadcast('page:created')

            let page = _.find(this.pages, { id })
            this.setCurrentPage(page)
            this.saveCurrentSketch()
        }

        this.removePage = (page) => {
            _.remove(this.pages, { id: page.id })
            $rootScope.$broadcast('page:removed')
            this.saveCurrentSketch()
        }

        this.setCurrentPage = (page) => {
            this.currentPage = page
            this.currentPage.styles = this.currentPage.styles || {}
            this.currentHtmlObject = null
            localStorageService.set('lastPageId', page.id)
            $rootScope.$broadcast('page:selected')
        }

        this.setCurrentHtmlObject = (htmlObject) => {
            this.currentHtmlObject = htmlObject
            if (!$rootScope.$$phase) $rootScope.$apply()
            $rootScope.$broadcast('htmlObject:selected')
        }

        this.removeHtmlObject = (htmlObject) => {
            let pageIndex = _.findIndex(this.pages, { id: this.currentPage.id })
            let htmlObjectsCopy = _.clone(this.pages[pageIndex].htmlObjects)
            _.remove(htmlObjectsCopy, { id: htmlObject.id })
            this.pages[pageIndex].htmlObjects = htmlObjectsCopy
            this.saveCurrentSketch()
            $rootScope.$broadcast('htmlObject:removed')
        }

        this.createHtmlObject = (newHtmlObject) => {
            let pageIndex = _.findIndex(this.pages, { id: this.currentPage.id })
            this.pages[pageIndex].htmlObjects.push(newHtmlObject)
            this.setCurrentPage(this.pages[pageIndex])
            $rootScope.$apply()
            this.saveCurrentSketch()
            $rootScope.$broadcast('htmlObject:created')
        }

        this.createHtmlObjectAndSetAsCurrent = (newHtmlObject) => {
            this.createHtmlObject(newHtmlObject)
            this.setCurrentHtmlObject(newHtmlObject)
            this.saveCurrentSketch()
        }

        this.updateHtmlObject = (htmlObject) => {
            let index = _.findIndex(this.currentPage.htmlObjects, { id: htmlObject.id })
            this.currentPage.htmlObjects.splice(index, 1, htmlObject)
            this.saveCurrentSketch()
            $rootScope.$broadcast('htmlObject:updated')
        }

        this.unlockCurrentHtmlObject = () => {
            this.currentHtmlObject.isLocked = false
            this.saveCurrentSketch()
            $rootScope.$broadcast('htmlObject:unlocked')
        }

        this.lockCurrentHtmlObject = () => {
            this.currentHtmlObject.isLocked = true
            this.saveCurrentSketch()
            $rootScope.$broadcast('htmlObject:locked')
        }
    }
}
