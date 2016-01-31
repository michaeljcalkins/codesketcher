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
require('./assets/js/modules/export')
require('./assets/js/modules/resizable')

// Services
require('./assets/js/services/DrawingModel.js')
require('./assets/js/services/DrawingEvents.js')
require('./assets/js/services/DrawingGuid.js')
require('./assets/js/services/DrawingHotkeys.js')
require('./assets/js/services/DrawingAlign.js')
require('./assets/js/services/DrawingLayers.js')

// Directives
require('./assets/js/directives/HeaderBar.js')
require('./assets/js/directives/LeftSidebar.js')
require('./assets/js/directives/RightSidebar.js')
require('./assets/js/directives/DrawingCanvas.js')
require('./assets/js/directives/HeaderTitleBar.js')
