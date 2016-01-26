'use strict'

angular
    .module('codesketcher.drawing', [])

    // Directives
    .directive('headerBar', require('./directives/HeaderBar.js'))
    .directive('leftSidebar', require('./directives/LeftSidebar.js'))
    .directive('rightSidebar', require('./directives/RightSidebar.js'))
    .directive('drawingCanvas', require('./directives/DrawingCanvas.js'))

    // Services
    .service('DrawingModel', require('./services/DrawingModel.js'))
    .service('DrawingEvents', require('./services/DrawingEvents.js'))
    .service('DrawingGuid', require('./services/DrawingGuid.js'))
    .service('DrawingHotkeys', require('./services/DrawingHotkeys.js'))
    .service('DrawingAlign', require('./services/DrawingAlign.js'))
    .service('DrawingLayers', require('./services/DrawingLayers.js'))
