'use strict'

let changeCase = require('changeCase')

module.exports = angular.module('codesketcher')
    .filter('camelToTitleCase', function() {
        return function(value) {
            changeCase.titleCase('a simple test')
            return value.replace(/([A-Z]+)/g, " $1").replace(/([A-Z][a-z])/g, " $1")
        }
    })
