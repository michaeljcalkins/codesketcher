'use strict'

let $ = require('jquery')
var remote = require('remote');
var shell = remote.require('shell');
var fs = require('fs');

var BrowserWindow = remote.require('browser-window');
var dialog = remote.require('dialog');

module.exports = function($rootScope, $http, $timeout, localStorageService) {
    return function() {
        this.currentHtmlObject = null
        this.currentPage = null
        this.currentSketch = null
        this.currentSketchFilename = false
        this.currentZoom = 1

        function guid() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
        }

        this.openFileDialog = () => {
            dialog.showOpenDialog({
                properties: [ 'openFile' ],
                filters: [
                    {
                        name: 'Code Sketch',
                        extensions: ['codesketch']
                    }
                ]
            }, (data) => {
                var dataString = fs.readFileSync(data[0])
                this.currentSketch = eval("(" + dataString.toString() + ")")
                this.currentSketchFilename = data[0]
                $rootScope.$apply()
                this.setLastObjects()
                $rootScope.$broadcast('sketches:loaded')
            })
        }

        this.newCurrentSketch = () => {
            this.currentHtmlObject = null
            this.currentPage = null
            this.currentSketchFilename = false
            this.currentSketch = {
                pages: []
            }
        }

        this.showSaveDialog = () => {
            dialog.showSaveDialog({
                options: {
                    title: 'codesketch'
                }
            }, (data) => {
                if (!data) return
                this.currentSketchFilename = data
                this.saveCurrentSketch()
            })
        }

        this.saveCurrentSketch = () => {
            if (!this.currentSketchFilename) return this.showSaveDialog()

            fs.writeFile(this.currentSketchFilename, JSON.stringify(this.currentSketch), function(err) {
                if (err) return console.log(err)
                console.log('Sketch saved...')
                $rootScope.$broadcast('sketch:saved')
            })
        }

        this.getContainerWidth = () => {
            let intWidth = +this.currentPage.styles.width.slice(0, -2)
            return (intWidth + 200) + 'px'
        }

        this.setCurrentSketchById = (sketchId) => {
            let sketch = _.find(this.sketches, { id: sketchId })
            if (sketch) this.setCurrentSketch(sketch)
        }

        this.setCurrentPageById = (pageId) => {
            if (!this.currentSketch) return
            let page = _.find(this.currentSketch.pages, { id: pageId })
            if (page) this.setCurrentPage(page)
        }

        this.zoomIn = () => {
            this.currentPage.styles.zoom = this.currentPage.styles.zoom || 1
            this.currentPage.styles.zoom += .2
        }

        this.zoomOut = () => {
            this.currentPage.styles.zoom = this.currentPage.styles.zoom || 1
            this.currentPage.styles.zoom -= .2
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
            this.currentSketch.pages = JSON.parse(sketch.json) || []
            localStorageService.set('lastSketchId', sketch.id)
            $rootScope.$broadcast('sketch:selected')
        }

        this.createPage = () => {
            this.currentSketch.pages.push({
                id: guid(),
                name: "",
                htmlObjects: [],
                styles: {
                    height: '900px',
                    width: '1200px',
                    backgroundColor: 'white'
                }
            })
            $rootScope.$broadcast('page:created')
        }

        this.createPageAndSetAsCurrent = () => {
            let id = guid()
            this.currentSketch.pages.push({
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

            let page = _.find(this.currentSketch.pages, { id })
            this.setCurrentPage(page)
        }

        this.removePage = (page) => {
            _.remove(this.currentSketch.pages, { id: page.id })
            $rootScope.$broadcast('page:removed')
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
            let pageIndex = _.findIndex(this.currentSketch.pages, { id: this.currentPage.id })
            let htmlObjectsCopy = _.clone(this.currentSketch.pages[pageIndex].htmlObjects)
            _.remove(htmlObjectsCopy, { id: htmlObject.id })
            this.currentSketch.pages[pageIndex].htmlObjects = htmlObjectsCopy
            $rootScope.$broadcast('htmlObject:removed')
        }

        this.createHtmlObject = (newHtmlObject) => {
            let pageIndex = _.findIndex(this.currentSketch.pages, { id: this.currentPage.id })
            this.currentSketch.pages[pageIndex].htmlObjects.push(newHtmlObject)
            this.setCurrentPage(this.currentSketch.pages[pageIndex])
            $rootScope.$apply()
            $rootScope.$broadcast('htmlObject:created')
        }

        this.createHtmlObjectAndSetAsCurrent = (newHtmlObject) => {
            this.createHtmlObject(newHtmlObject)
            this.setCurrentHtmlObject(newHtmlObject)
        }

        this.updateHtmlObject = (htmlObject) => {
            let index = _.findIndex(this.currentPage.htmlObjects, { id: htmlObject.id })
            this.currentPage.htmlObjects.splice(index, 1, htmlObject)
            $rootScope.$broadcast('htmlObject:updated')
        }

        this.bringCurrentObjectForward = () => {
            this.currentHtmlObject.styles['z-index'] = this.currentHtmlObject.styles['z-index'] || 1
            this.currentHtmlObject.styles['z-index']++
            this.updateHtmlObject(this.currentHtmlObject)
        }

        this.sendCurrentObjectBackward = () => {
            this.currentHtmlObject.styles['z-index'] = this.currentHtmlObject.styles['z-index'] || 1
            this.currentHtmlObject.styles['z-index']--
            this.updateHtmlObject(this.currentHtmlObject)
        }

        this.unlockCurrentHtmlObject = () => {
            this.currentHtmlObject.isLocked = false
            $rootScope.$broadcast('htmlObject:unlocked')
        }

        this.lockCurrentHtmlObject = () => {
            this.currentHtmlObject.isLocked = true
            $rootScope.$broadcast('htmlObject:locked')
        }
    }
}
