'use strict';

var _ = require('lodash');
var getFunctionFragments = require('./getFunctionFragments');

module.exports = function (componentString, componentName) {
  var functionFragments = getFunctionFragments(componentString, componentName);

  if (!functionFragments || !_.isArray(functionFragments)) return '';

  var contructorFragment = functionFragments.filter(function (fragments) {
    return fragments.indexOf('constructor (props)') > -1;
  });

  return contructorFragment;
};