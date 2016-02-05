'use strict'

angular
    .module('codesketcher')
    .controller('CreateProjectModal', function($scope, $uibModalInstance, DrawingModel) {
        this.ok = function () {
            $uibModalInstance.close()
        }

        this.cancel = function () {
            $uibModalInstance.dismiss('cancel')
        }

    })
