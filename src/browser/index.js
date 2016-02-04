'use strict'

var angular = require('angular')
require('angular-local-storage')
require('angular-ui-bootstrap')
require('angular-ui-sortable')
require('angular-hotkeys')
require('angular-elastic')
require('angular-highlightjs')

angular
    .module('codesketcher', [
        'ui.sortable',
        'ui.bootstrap',
        'cfp.hotkeys',
        'LocalStorageModule',
        'monospaced.elastic',
        'hljs',
        'colorpicker.module'
    ])
    .config(function($compileProvider) {
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob):|data:image/);
    })
    .controller('AppCtrl', function(DrawingHotkeys) {

    })

// Modules
require('./js/modules/export')
require('./js/modules/resizable')

// Services
require('./js/services/DrawingModel.js')
require('./js/services/DrawingEvents.js')
require('./js/services/DrawingGuid.js')
require('./js/services/DrawingHotkeys.js')
require('./js/services/DrawingAlign.js')
require('./js/services/DrawingLayers.js')

// Directives
require('./js/directives/HeaderBar.js')
require('./js/directives/LeftSidebar.js')
require('./js/directives/RightSidebar.js')
require('./js/directives/DrawingCanvas.js')
require('./js/directives/HeaderTitleBar.js')
