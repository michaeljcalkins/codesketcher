'use strict'

let $ = require('jquery'),
    remote = require('remote'),
    shell = remote.require('shell'),
    fs = require('fs'),
    sizeOf = require('image-size'),
    BrowserWindow = remote.require('browser-window'),
    dialog = remote.require('dialog')

function moveElementInArray(arrayToBeModified, oldIndex, newIndex) {
    if (newIndex >= arrayToBeModified.length) {
        var k = newIndex - arrayToBeModified.length
        while ((k--) + 1) {
            arrayToBeModified.push(undefined)
        }
    }
    arrayToBeModified.splice(newIndex, 0, arrayToBeModified.splice(oldIndex, 1)[0])

    return arrayToBeModified
}

module.exports = function($rootScope, $http, $timeout, DrawingGuid, DrawingEvents) {
    this.currentHtmlObject = null
    this.currentPage = null
    this.currentSketch = null
    this.currentSketchFilename = false
    this.currentZoom = 1
    this.flags = {
        isDirty: false
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
                    id: DrawingGuid.guid(),
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
            if (err) return console.log(err)
            console.log('Sketch saved...')
            this.flags.isDirty = false
            $rootScope.$broadcast('sketch:saved')
            if (!$rootScope.$$phase) $rootScope.$digest()
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

        this.currentZoom = (parseFloat(this.currentZoom) + .2).toFixed(1)
        $(".drawing-canvas").animate({
            zoom: this.currentZoom
        }, 'medium')
    }

    this.zoomOut = () => {
        if (this.currentZoom <= .2 || !this.currentSketch) return

        this.currentZoom = (parseFloat(this.currentZoom) - .2).toFixed(1)
        $(".drawing-canvas").animate({
            zoom: this.currentZoom
        }, 'medium')
    }

    this.setLastObjects = () => {
        if (this.currentSketch.lastPageId) {
            this.setCurrentPageById(this.currentSketch.lastPageId)
            if (!$rootScope.$$phase) $rootScope.$digest()
        }
    }

    this.setCurrentSketch = (sketch) => {
        this.currentSketch = sketch
        this.currentSketch.pages = JSON.parse(sketch.json) || []
        $rootScope.$broadcast('sketch:selected')
    }

    this.createPage = () => {
        this.currentSketch.pages.push({
            id: DrawingGuid.guid(),
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
        let id = DrawingGuid.guid()
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
        this.currentHtmlObject = htmlObject
        $rootScope.$broadcast('htmlObject:selected')
        if (!$rootScope.$$phase) $rootScope.$digest()
    }

    this.removeHtmlObject = (htmlObject) => {
        let pageIndex = _.findIndex(this.currentSketch.pages, { id: this.currentPage.id })
        let htmlObjectsCopy = _.clone(this.currentSketch.pages[pageIndex].htmlObjects)
        _.remove(htmlObjectsCopy, { id: htmlObject.id })
        this.currentSketch.pages[pageIndex].htmlObjects = htmlObjectsCopy
        $rootScope.$broadcast('htmlObject:removed')
        this.flags.isDirty = true
    }

    this.createHtmlObject = (newHtmlObject) => {
        newHtmlObject.styles.opacity = 1
        let pageIndex = _.findIndex(this.currentSketch.pages, { id: this.currentPage.id })
        this.currentSketch.pages[pageIndex].htmlObjects.push(newHtmlObject)
        this.setCurrentPage(this.currentSketch.pages[pageIndex])
        $rootScope.$broadcast('htmlObject:created')
        this.flags.isDirty = true
        if (!$rootScope.$$phase) $rootScope.$digest()
    }

    this.createHtmlObjectAndSetAsCurrent = (newHtmlObject) => {
        this.createHtmlObject(newHtmlObject)
        this.setCurrentHtmlObject(newHtmlObject)
        this.flags.isDirty = true
    }

    this.updateHtmlObject = (htmlObject) => {
        let index = _.findIndex(this.currentPage.htmlObjects, { id: htmlObject.id })
        this.currentPage.htmlObjects.splice(index, 1, htmlObject)
        this.flags.isDirty = true
        $rootScope.$broadcast('htmlObject:updated')
        if (!$rootScope.$$phase) $rootScope.$digest()
    }

    this.updatePage = (page) => {
        let index = _.findIndex(this.currentSketch.pages, { id: page.id })
        this.currentSketch.pages.splice(index, 1, page)
        this.flags.isDirty = true
        $rootScope.$broadcast('page:updated')
        if (!$rootScope.$$phase) $rootScope.$digest()
    }

    this.bringCurrentObjectForward = () => {
        let currentIndex = _.findIndex(this.currentPage.htmlObjects, { id: this.currentHtmlObject.id })
        this.currentPage.htmlObjects = moveElementInArray(this.currentPage.htmlObjects, currentIndex, (currentIndex - 1))

        this.flags.isDirty = true
        if (!$rootScope.$$phase) $rootScope.$digest()
        this.updateHtmlObject(this.currentHtmlObject)
    }

    this.sendCurrentObjectBackward = () => {
        let currentIndex = _.findIndex(this.currentPage.htmlObjects, { id: this.currentHtmlObject.id })
        this.currentPage.htmlObjects = moveElementInArray(this.currentPage.htmlObjects, currentIndex, (currentIndex + 1))

        this.flags.isDirty = true
        if (!$rootScope.$$phase) $rootScope.$digest()
        this.updateHtmlObject(this.currentHtmlObject)

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
            id: DrawingGuid.guid(),
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

    this.alignCurrentHtmlObjectLeft = () => {
        this.currentHtmlObject.styles.left = '0px'
        this.updateHtmlObject(this.currentHtmlObject)
    }

    this.alignCurrentHtmlObjectVertically = () => {
        let pageWidth = +this.currentPage.styles.width.slice(0, -2)
        let objWidth = +this.currentHtmlObject.styles.width.slice(0, -2)

        this.currentHtmlObject.styles.left = ((pageWidth / 2) - (objWidth / 2)) + 'px'
        this.updateHtmlObject(this.currentHtmlObject)
    }

    this.alignCurrentHtmlObjectRight = () => {
        let pageWidth = +this.currentPage.styles.width.slice(0, -2)
        let objWidth = +this.currentHtmlObject.styles.width.slice(0, -2)

        this.currentHtmlObject.styles.left = (pageWidth - objWidth) + 'px'
        this.updateHtmlObject(this.currentHtmlObject)
    }

    this.alignCurrentHtmlObjectTop = () => {
        this.currentHtmlObject.styles.top = 0
        this.updateHtmlObject(this.currentHtmlObject)
    }

    this.alignCurrentHtmlObjectHorizontally = () => {
        let pageHeight = +this.currentPage.styles.height.slice(0, -2)
        let objHeight = +this.currentHtmlObject.styles.height.slice(0, -2)

        this.currentHtmlObject.styles.top = ((pageHeight / 2) - (objHeight / 2)) + 'px'
        this.updateHtmlObject(this.currentHtmlObject)
    }

    this.alignCurrentHtmlObjectBottom = () => {
        let pageHeight = +this.currentPage.styles.height.slice(0, -2)
        let objHeight = +this.currentHtmlObject.styles.height.slice(0, -2)

        this.currentHtmlObject.styles.top = (pageHeight - objHeight) + 'px'
        this.updateHtmlObject(this.currentHtmlObject)
    }
}
