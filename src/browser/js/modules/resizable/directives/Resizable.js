'use strict'

let $ = require('jquery')

angular
    .module('codesketcher')
    .directive('resizable', function() {
        return {
            scope: {
                handles: '=resizableHandles'
            },
            controller: function($scope, $element) {
                let $leftSidebar = $('.left-sidebar')
                let $rightSidebar = $('.right-sidebar')
                let $main = $('.main')

                $($element).resizable({
                    handles: $scope.handles,
                    resize: function(evt, ui) {
                        $main.css({
                            left: $leftSidebar.outerWidth(),
                            right: $rightSidebar.outerWidth()
                        })
                        $rightSidebar.css('left', 'auto')
                    }
                })
            }
        }
    })
