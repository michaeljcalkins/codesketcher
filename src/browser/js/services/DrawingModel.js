'use strict'

let _ = require('lodash'),
    $ = require('jquery'),
    remote = require('remote'),
    shell = remote.require('shell'),
    fs = require('fs'),
    sizeOf = require('image-size'),
    BrowserWindow = remote.require('browser-window'),
    dialog = remote.require('dialog'),
    DrawingEvents = require('../lib/DrawingEvents'),
    guid = require('../lib/Guid')

angular
    .module('codesketcher')
    .service('DrawingModel', function($rootScope, $http, $timeout) {
        this.currentHtmlObject = null
        this.currentPage = null
        this.currentSketch = null
        this.currentSketchFilename = null
        this.currentZoom = 1
        this.flags = {
            isDirty: false
        }

        this.isCurrentHtmlObject = (id) => {
            return id === _.get(this.currentHtmlObject, 'id')
        }

        this.openFileDialog = () => {
            if (this.flags.isDirty && !confirm("You are going to lose your unsaved work, is that ok?")) return

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

                let dataString = fs.readFileSync(data[0])
                this.currentSketch = eval('(' + dataString.toString() + ')')
                this.currentSketchFilename = data[0]
                this.currentHtmlObject = null
                this.currentPage = null
                this.setLastObjects()
                $rootScope.$broadcast('sketch:loaded')
                document.title = 'Code Sketcher | ' + this.currentSketchFilename
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
            document.title = 'Code Sketcher | New Sketch'
        }

        this.showSaveDialog = () => {
            dialog.showSaveDialog({
                options: {
                    defaultPath: '.codesketch',
                    title: 'codesketch'
                }
            }, (data) => {
                if (!data) return
                this.currentSketchFilename = data
                this.saveCurrentSketch()
            })
        }

        this.rotationChange = () => {
            this.currentHtmlObject.styles.transform = `rotate(${this.currentHtmlObject.rotation}deg)`
        }

        this.saveCurrentSketch = () => {
            if (!this.currentSketchFilename) return this.showSaveDialog()

            fs.writeFile(this.currentSketchFilename, JSON.stringify(this.currentSketch), (err) => {
                $timeout(() => {
                    if (err) return console.log(err)
                    console.log('Sketch saved...')
                    this.flags.isDirty = false
                    $rootScope.$broadcast('sketch:saved')
                    if (!$rootScope.$$phase) $rootScope.$apply()
                })
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

            this.currentZoom = (parseFloat(this.currentZoom) + .1).toFixed(1)
            $(".drawing-canvas").animate({
                zoom: this.currentZoom
            }, 'medium')
        }

        this.zoomOut = () => {
            if (this.currentZoom <= .2 || !this.currentSketch) return

            this.currentZoom = (parseFloat(this.currentZoom) - .1).toFixed(1)
            $(".drawing-canvas").animate({
                zoom: this.currentZoom
            }, 'medium')
        }

        this.setLastObjects = () => {
            if (this.currentSketch.lastPageId) {
                this.setCurrentPageById(this.currentSketch.lastPageId)
                if (!$rootScope.$$phase) $rootScope.$apply()
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

            this.currentPage.htmlObjects = this.currentPage.htmlObjects.filter((result) => {
                return !!result
            })
            .map((result) => {
                return result
            })

            $rootScope.$broadcast('page:selected')
        }

        this.setCurrentHtmlObject = (htmlObject) => {
            this.currentHtmlObject = angular.copy(htmlObject)
            $rootScope.$broadcast(DrawingEvents.htmlObject.selected)
            $rootScope.$broadcast('elastic:adjust')
        }

        this.removeHtmlObject = (htmlObject) => {
            let pageIndex = _.findIndex(this.currentSketch.pages, { id: this.currentPage.id })
            let htmlObjectsCopy = _.clone(this.currentSketch.pages[pageIndex].htmlObjects)
            _.remove(htmlObjectsCopy, { id: htmlObject.id })
            this.currentSketch.pages[pageIndex].htmlObjects = htmlObjectsCopy
            this.flags.isDirty = true
            $rootScope.$broadcast(DrawingEvents.htmlObject.removed)
        }

        this.createHtmlObject = (newHtmlObject) => {
            let pageIndex = _.findIndex(this.currentSketch.pages, { id: this.currentPage.id })
            this.currentSketch.pages[pageIndex].htmlObjects.unshift(newHtmlObject)
            this.setCurrentPage(this.currentSketch.pages[pageIndex])
            this.flags.isDirty = true
            $rootScope.$broadcast(DrawingEvents.htmlObject.created)
        }

        this.duplicateCurrentHtmlObject = () => {
            let newHtmlObject = angular.copy(this.currentHtmlObject)
            newHtmlObject.id = guid()
            this.createHtmlObject(newHtmlObject)
            this.setCurrentHtmlObject(newHtmlObject)
        }

        this.createHtmlObjectAndSetAsCurrent = (newHtmlObject) => {
            this.createHtmlObject(newHtmlObject)
            this.setCurrentHtmlObject(newHtmlObject)
            this.flags.isDirty = true
        }

        this.updateHtmlObject = (htmlObject) => {
            $timeout(() => {
                let index = _.findIndex(this.currentPage.htmlObjects, { id: htmlObject.id })
                this.currentPage.htmlObjects.splice(index, 1, htmlObject)
                this.flags.isDirty = true
                $rootScope.$broadcast('htmlObject:updated')
                $rootScope.$broadcast('elastic:adjust')
            })
        }

        this.updatePage = (page) => {
            let index = _.findIndex(this.currentSketch.pages, { id: page.id })
            this.currentSketch.pages.splice(index, 1, page)
            this.flags.isDirty = true
            $rootScope.$broadcast('page:updated')
            if (!$rootScope.$$phase) $rootScope.$apply()
        }

        this.unlockCurrentHtmlObject = () => {
            this.currentHtmlObject.isLocked = false
            this.updateHtmlObject(this.currentHtmlObject)
            this.flags.isDirty = true
            $rootScope.$broadcast(DrawingEvents.htmlObject.unlocked)
        }

        this.lockCurrentHtmlObject = () => {
            this.currentHtmlObject.isLocked = true
            this.updateHtmlObject(this.currentHtmlObject)
            this.flags.isDirty = true
            $rootScope.$broadcast(DrawingEvents.htmlObject.locked)
        }

        this.openImageDialog = () => {
            dialog.showOpenDialog({
                properties: [ 'openFile' ],
                filters: [
                    { name: 'Images', extensions: ['jpg', 'png', 'gif'] }
                ]
            }, (data) => {
                if (!data) return

                let imageData = fs.readFileSync(data[0])
                let base64Image = this.convertImageDataToBase64(imageData)
                let dimensions = sizeOf(data[0])

                this.addImageHtmlObject(base64Image, dimensions.width, dimensions.height)
            })
        }

        this.convertImageDataToBase64 = (imageData) => {
            return new Buffer(imageData, 'binary').toString('base64')
        }

        this.addImageHtmlObject = (base64Image, width, height) => {
            let newHtmlObject = {
                id: guid(),
                rotation: 0,
                imageSrc: base64Image,
                type: 'image',
                styles: {
                    height: height + 'px',
                    width: width + 'px',
                    position: 'absolute',
                    left: '0px',
                    top: '0px',
                    backgroundColor: '',
                    borderWidth: '',
                    borderStyle: '',
                    borderColor: '',
                    backgroundImage: '',
                    borderRadius: 0,
                    transform: 'rotate(0deg)',
                    color: '',
                    fontFamily: '',
                    fontSize: ''
                }
            }

            this.createHtmlObject(newHtmlObject)
            this.setCurrentHtmlObject(newHtmlObject)
            $rootScope.$broadcast(DrawingEvents.htmlObject.created)
        }
    })
