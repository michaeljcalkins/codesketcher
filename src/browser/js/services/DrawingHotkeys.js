'use strict'

angular
    .module('codesketcher')
    .service('DrawingHotkeys', function(hotkeys, DrawingModel, $uibModal) {
        hotkeys.add({
            combo: 'down',
            description: 'Move current html object down 1 pixel.',
            callback: (evt) => {
                let numberOfPixelsToMove = 1
                var intTop = +DrawingModel.currentHtmlObject.styles.top.slice(0, -2)
                DrawingModel.currentHtmlObject.styles.top = Math.round(intTop + numberOfPixelsToMove) + 'px'
                DrawingModel.updateHtmlObject(DrawingModel.currentHtmlObject)
                evt.preventDefault()
            }
        })

        hotkeys.add({
            combo: 'meta+-',
            description: 'Zoom out.',
            callback: (evt) => {
                DrawingModel.zoomOut()
            }
        })

        hotkeys.add({
            combo: 'meta+=',
            description: 'Zoom in.',
            callback: (evt) => {
                DrawingModel.zoomIn()
            }
        })

        hotkeys.add({
            combo: 'backspace',
            description: 'Remove currently selected html object.',
            callback: (evt) => {
                evt.stopPropagation()
                evt.preventDefault()
                DrawingModel.removeHtmlObject(DrawingModel.currentHtmlObject)
            }
        })

        hotkeys.add({
            combo: 'i',
            description: 'Insert an image.',
            callback: (evt) => {
                if (! DrawingModel.currentSketch) return

                DrawingModel.openImageDialog()
            }
        })

        hotkeys.add({
            combo: 'meta+s',
            description: 'Save current sketch.',
            allowIn: ['input', 'textarea', 'select'],
            callback: (evt) => {
                DrawingModel.saveCurrentSketch()
                evt.preventDefault()
            }
        })

        hotkeys.add({
            combo: 'meta+o',
            description: 'Open an existing sketch.',
            callback: (evt) => {
                DrawingModel.openFileDialog()
                evt.preventDefault()
            }
        })

        hotkeys.add({
            combo: 'meta+n',
            description: 'Create a new sketch.',
            callback: (evt) => {
                DrawingModel.newCurrentSketch()
                evt.preventDefault()
            }
        })

        hotkeys.add({
            combo: 'left',
            description: 'Move current html object left 1 pixel.',
            callback: (evt) => {
                let numberOfPixelsToMove = 1
                var intLeft = +DrawingModel.currentHtmlObject.styles.left.slice(0, -2)
                DrawingModel.currentHtmlObject.styles.left = Math.round(intLeft - numberOfPixelsToMove) + 'px'
                DrawingModel.updateHtmlObject(DrawingModel.currentHtmlObject)
                evt.preventDefault()
            }
        })

        hotkeys.add({
            combo: 'shift+left',
            description: 'Move current html object left 10 pixels.',
            callback: (evt) => {
                let numberOfPixelsToMove = 10
                var intLeft = +DrawingModel.currentHtmlObject.styles.left.slice(0, -2)
                DrawingModel.currentHtmlObject.styles.left = Math.round(intLeft - numberOfPixelsToMove) + 'px'
                DrawingModel.updateHtmlObject(DrawingModel.currentHtmlObject)
                evt.preventDefault()
            }
        })

        hotkeys.add({
            combo: 'up',
            description: 'Move current html object up 1 pixel.',
            callback: (evt) => {
                let numberOfPixelsToMove = 1
                var intTop = +DrawingModel.currentHtmlObject.styles.top.slice(0, -2)
                DrawingModel.currentHtmlObject.styles.top = Math.round(intTop - numberOfPixelsToMove) + 'px'
                DrawingModel.updateHtmlObject(DrawingModel.currentHtmlObject)
                evt.preventDefault()
            }
        })

        hotkeys.add({
            combo: 'shift+up',
            description: 'Move current html object up 10 pixels.',
            callback: (evt) => {
                let numberOfPixelsToMove = 10
                var intTop = +DrawingModel.currentHtmlObject.styles.top.slice(0, -2)
                DrawingModel.currentHtmlObject.styles.top = Math.round(intTop - numberOfPixelsToMove) + 'px'
                DrawingModel.updateHtmlObject(DrawingModel.currentHtmlObject)
                evt.preventDefault()
            }
        })

        hotkeys.add({
            combo: 'right',
            description: 'Move current html object right 1 pixel.',
            callback: (evt) => {
                let numberOfPixelsToMove = 1
                var intLeft = +DrawingModel.currentHtmlObject.styles.left.slice(0, -2)
                DrawingModel.currentHtmlObject.styles.left = Math.round(intLeft + numberOfPixelsToMove) + 'px'
                DrawingModel.updateHtmlObject(DrawingModel.currentHtmlObject)
                evt.preventDefault()
            }
        })

        hotkeys.add({
            combo: 'shift+right',
            description: 'Move current html object right 10 pixels.',
            callback: (evt) => {
                let numberOfPixelsToMove = 10
                var intLeft = +DrawingModel.currentHtmlObject.styles.left.slice(0, -2)
                DrawingModel.currentHtmlObject.styles.left = Math.round(intLeft + numberOfPixelsToMove) + 'px'
                DrawingModel.updateHtmlObject(DrawingModel.currentHtmlObject)
                evt.preventDefault()
            }
        })

        hotkeys.add({
            combo: 'shift+down',
            description: 'Move current html object down 10 pixels.',
            callback: (evt) => {
                let numberOfPixelsToMove = 10
                var intTop = +DrawingModel.currentHtmlObject.styles.top.slice(0, -2)
                DrawingModel.currentHtmlObject.styles.top = Math.round(intTop + numberOfPixelsToMove) + 'px'
                DrawingModel.updateHtmlObject(DrawingModel.currentHtmlObject)
                evt.preventDefault()
            }
        })
    })
