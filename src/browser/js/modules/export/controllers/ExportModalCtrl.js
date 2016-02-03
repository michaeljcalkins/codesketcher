'use strict'

let ExportImage = require('../lib/Image'),
    ExportHtml = require('../lib/Html'),
    ExportCss = require('../lib/Css'),
    ExportAngular1 = require('../lib/Angular1'),
    ExportAngular2 = require('../lib/Angular2'),
    ExportReact = require('../lib/React'),
    ExportVue = require('../lib/Vue')

angular
    .module('codesketcher')
    .controller('ExportModalCtrl', function($scope, $uibModalInstance, DrawingModel) {
        this.ok = function () {
            $uibModalInstance.close()
        }

        this.cancel = function () {
            $uibModalInstance.dismiss('cancel')
        }

        this.exportToImage = () => {
            this.exportedResult = ExportImage.process({
                sketch: DrawingModel.currentSketch
            })
        }

        this.exportToHtml = () => {
            this.exportedResult = ExportHtml.process({
                sketch: DrawingModel.currentSketch
            })
        }

        this.exportToCss = () => {
            this.exportedResult = ExportCss.process({
                sketch: DrawingModel.currentSketch
            })
        }

        this.exportToAngular1 = () => {
            this.exportedResult = ExportAngular1.process({
                sketch: DrawingModel.currentSketch
            })
        }

        this.exportToAngular2 = () => {
            this.exportedResult = ExportAngular2.process({
                sketch: DrawingModel.currentSketch
            })
        }

        this.exportToReact = () => {
            this.exportedResult = ExportReact.process({

            })
        }

        this.exportToVue = () => {
            this.exportedResult = ExportVue.process({

            })
        }
    })
