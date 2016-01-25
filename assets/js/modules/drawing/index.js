'use strict'

angular
    .module('codesketcher.drawing', [])

    // Directives
    .directive('headerBar', require('./directives/headerBar.js'))
    .directive('leftSidebar', require('./directives/leftSidebar.js'))
    .directive('rightSidebar', require('./directives/rightSidebar.js'))
    .directive('drawingCanvas', require('./directives/drawingCanvas.js'))

    // Services
    .service('DrawingStorage', require('./services/drawingStorage.js'))
    .service('DrawingEvents', require('./services/drawingEvents.js'))
