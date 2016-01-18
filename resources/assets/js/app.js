"use strict"

require('moment')
require('angular-ui-bootstrap')
require('angular-ui-router')
require('angular-ui-sortable')
require('angular-local-storage')

require('./routes.js')
require('./modules/drawing')

angular
    .module('codesketcher', [
        'ui.router',
        'ui.bootstrap',
        'ui.sortable',
        'colorpicker.module',
        'angular-loading-bar',
        'LocalStorageModule',
        'codesketcher.routes',
        'codesketcher.drawing'
    ])
    .config(function($urlRouterProvider, cfpLoadingBarProvider) {
        $urlRouterProvider.otherwise('/drawing')
    })
    .controller('AppCtrl', function() {

    })
