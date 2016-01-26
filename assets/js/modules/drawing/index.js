'use strict'

angular
    .module('codesketcher.drawing', [])

    // Directives
    .directive('headerBar', require('./directives/headerBar.js'))
    .directive('leftSidebar', require('./directives/leftSidebar.js'))
    .directive('rightSidebar', require('./directives/rightSidebar.js'))
    .directive('drawingCanvas', require('./directives/drawingCanvas.js'))

    // Services
    .service('DrawingModel', require('./services/DrawingModel.js'))
    .service('DrawingEvents', require('./services/drawingEvents.js'))
    .service('DrawingGuid', require('./services/drawingGuid.js'))
    .service('DrawingHotkeys', require('./services/drawingHotkeys.js'))
