'use strict'

var angular = require('angular')
require('angular-ui-router')
require('angular-local-storage')

require('./assets/js/modules/drawing')

angular
    .module('codesketcher', [
        'ui.router',
        'LocalStorageModule',
        'codesketcher.drawing'
    ])
    .config(function($urlRouterProvider) {
        $urlRouterProvider.otherwise('/drawing')
    })
    .controller('AppCtrl', function(DrawingStorage) {
        this.drawingStorage = new DrawingStorage()
    })
