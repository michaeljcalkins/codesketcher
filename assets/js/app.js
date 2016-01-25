'use strict'

var angular = require('angular')
require('angular-local-storage')
require('angular-ui-router')
require('angular-ui-sortable')
require('angular-hotkeys')

require('./assets/js/modules/drawing')

angular
    .module('codesketcher', [
        'ui.router',
        'ui.sortable',
        'LocalStorageModule',
        'cfp.hotkeys',
        'codesketcher.drawing'
    ])
    .config(function($urlRouterProvider, $compileProvider) {
        $urlRouterProvider.otherwise('/drawing')
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob):|data:image/);
    })
    .controller('AppCtrl', function(DrawingStorage) {
        this.drawingStorage = DrawingStorage
    })
