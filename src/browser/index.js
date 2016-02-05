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
require('./js/modules/rulers')

// Services
require('./js/services/DrawingModel')
require('./js/services/DrawingHotkeys')
require('./js/services/DrawingAlign')
require('./js/services/DrawingLayers')

// Directives
require('./js/directives/HeaderBar')
require('./js/directives/LeftSidebar')
require('./js/directives/RightSidebar')
require('./js/directives/DrawingCanvas')
require('./js/directives/HeaderTitleBar')

// Filters
require('./js/modules/camelToTitleCase')
