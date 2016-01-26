'use strict'

var angular = require('angular')
require('angular-local-storage')
require('angular-ui-sortable')
require('angular-hotkeys')

require('./assets/js/modules/drawing')

angular
    .module('codesketcher', [
        'ui.sortable',
        'LocalStorageModule',
        'cfp.hotkeys',
        'codesketcher.drawing'
    ])
    .config(function($compileProvider) {
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob):|data:image/);
    })
    .controller('AppCtrl', function(DrawingHotkeys) {

    })
