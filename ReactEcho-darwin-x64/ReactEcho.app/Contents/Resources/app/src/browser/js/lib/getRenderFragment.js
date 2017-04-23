'use strict';

var getFunctionFragments = require('./getFunctionFragments');
var _ = require('lodash');

module.exports = function (componentString, componentName) {
  var functionFragments = getFunctionFragments(componentString, componentName);

  if (_.isString(functionFragments)) return functionFragments;

  var renderFragment = functionFragments.filter(function (fragments) {
    return fragments.indexOf('render ()') > -1;
  });

  return renderFragment;
};