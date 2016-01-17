angular
    .module('codesketcher.routes', [])
    .config(function($stateProvider) {
        $stateProvider
            .state('drawing', {
                url: '/drawing',
                template: require('./modules/drawing/views/drawing.html'),
                controller: require('./modules/drawing/controllers/drawing.ctrl.js'),
                controllerAs: 'ctrl'
            })
    }
)
