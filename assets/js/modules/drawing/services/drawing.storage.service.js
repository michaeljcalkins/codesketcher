'use strict'

let $ = require('jquery')
var remote = require('remote');
var shell = remote.require('shell');
var fs = require('fs');

var BrowserWindow = remote.require('browser-window');
var dialog = remote.require('dialog');

module.exports = function($rootScope, $http, $timeout) {
    return function() {
        this.currentHtmlObject = null
        this.currentPage = null
        this.currentSketch = null
        this.currentSketchFilename = false
        this.currentZoom = 1
        this.flags = {
            isDirty: false
        }

        function guid() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
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
                if (!data) return

                var dataString = fs.readFileSync(data[0])
                this.currentSketch = eval("(" + dataString.toString() + ")")
                this.currentSketchFilename = data[0]
                $rootScope.$broadcast('sketches:loaded')
                this.setLastObjects()
                $rootScope.$digest()
            })
        }

        this.newCurrentSketch = () => {
            this.currentHtmlObject = null
            this.currentPage = null
            this.currentSketchFilename = false
            this.currentSketch = {
                pages: [
                    {
                        id: guid(),
                        name: 'New Page',
                        styles: {
                            width: '1200px',
                            height: '900px'
                        },
                        htmlObjects: []
                    }
                ]
            }
            this.setCurrentPage(this.currentSketch.pages[0])
            this.flags.isDirty = true
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

            fs.writeFile(this.currentSketchFilename, JSON.stringify(this.currentSketch), (err) => {
                if (err) return console.log(err)
                console.log('Sketch saved...')
                this.flags.isDirty = false
                $rootScope.$broadcast('sketch:saved')
                $rootScope.$digest()
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
            this.currentSketch.lastPageId = pageId
            if (page) this.setCurrentPage(page)
        }

        this.zoomIn = () => {
            if (this.currentZoom >= 4 || !this.currentSketch) return

            this.currentZoom += .2
            $(".drawing-canvas").animate({
                zoom: this.currentZoom
            })
        }

        this.zoomOut = () => {
            if (this.currentZoom <= .2 || !this.currentSketch) return

            this.currentZoom -= .2
            $(".drawing-canvas").animate({
                zoom: this.currentZoom
            })
        }

        this.setLastObjects = () => {
            if (this.currentSketch.lastPageId) {
                this.setCurrentPageById(this.currentSketch.lastPageId)
                $rootScope.$digest()
            }
        }

        this.setCurrentSketch = (sketch) => {
            this.currentSketch = sketch
            this.currentSketch.pages = JSON.parse(sketch.json) || []
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
            this.flags.isDirty = true
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
            this.flags.isDirty = true
        }

        this.removePage = (page) => {
            _.remove(this.currentSketch.pages, { id: page.id })
            $rootScope.$broadcast('page:removed')
            this.flags.isDirty = true
        }

        this.setCurrentPage = (page) => {
            this.currentPage = page
            this.currentPage.styles = this.currentPage.styles || {}
            this.currentHtmlObject = null
            this.currentSketch.lastPageId = page.id

            $rootScope.$broadcast('page:selected')
        }

        this.setCurrentHtmlObject = (htmlObject) => {
            this.currentHtmlObject = htmlObject
            if (!$rootScope.$$phase) $rootScope.$digest()
            $rootScope.$broadcast('htmlObject:selected')
        }

        this.removeHtmlObject = (htmlObject) => {
            let pageIndex = _.findIndex(this.currentSketch.pages, { id: this.currentPage.id })
            let htmlObjectsCopy = _.clone(this.currentSketch.pages[pageIndex].htmlObjects)
            _.remove(htmlObjectsCopy, { id: htmlObject.id })
            this.currentSketch.pages[pageIndex].htmlObjects = htmlObjectsCopy
            $rootScope.$digest()
            $rootScope.$broadcast('htmlObject:removed')
            this.flags.isDirty = true
        }

        this.createHtmlObject = (newHtmlObject) => {
            newHtmlObject.styles.opacity = 1
            let pageIndex = _.findIndex(this.currentSketch.pages, { id: this.currentPage.id })
            this.currentSketch.pages[pageIndex].htmlObjects.push(newHtmlObject)
            this.setCurrentPage(this.currentSketch.pages[pageIndex])
            $rootScope.$digest()
            $rootScope.$broadcast('htmlObject:created')
            this.flags.isDirty = true
        }

        this.createHtmlObjectAndSetAsCurrent = (newHtmlObject) => {
            this.createHtmlObject(newHtmlObject)
            this.setCurrentHtmlObject(newHtmlObject)
            this.flags.isDirty = true
        }

        this.updateHtmlObject = (htmlObject) => {
            let index = _.findIndex(this.currentPage.htmlObjects, { id: htmlObject.id })
            this.currentPage.htmlObjects.splice(index, 1, htmlObject)
            $rootScope.$broadcast('htmlObject:updated')
            this.flags.isDirty = true
        }

        this.bringCurrentObjectForward = () => {
            this.currentHtmlObject.styles['z-index'] = this.currentHtmlObject.styles['z-index'] || 1
            this.currentHtmlObject.styles['z-index']++
            this.updateHtmlObject(this.currentHtmlObject)
            this.flags.isDirty = true
        }

        this.sendCurrentObjectBackward = () => {
            this.currentHtmlObject.styles['z-index'] = this.currentHtmlObject.styles['z-index'] || 1
            this.currentHtmlObject.styles['z-index']--
            this.updateHtmlObject(this.currentHtmlObject)
            this.flags.isDirty = true
        }

        this.unlockCurrentHtmlObject = () => {
            this.currentHtmlObject.isLocked = false
            $rootScope.$broadcast('htmlObject:unlocked')
            this.flags.isDirty = true
        }

        this.lockCurrentHtmlObject = () => {
            this.currentHtmlObject.isLocked = true
            $rootScope.$broadcast('htmlObject:locked')
            this.flags.isDirty = true
        }
    }
}
