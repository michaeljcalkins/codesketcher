'use strict'

let changeCase = require('change-case')

angular
    .module('codesketcher')
    .filter('camelToTitleCase', function() {
        return function(value) {
            return changeCase.titleCase(value)
        }
    })
