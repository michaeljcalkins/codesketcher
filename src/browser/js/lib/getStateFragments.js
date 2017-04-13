'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (componentString, componentName) {
  var modifiedString = componentString.replace(new RegExp(componentName, 'g'), 'COMPONENT_NAME');
  var matches = modifiedString.match(/(.*COMPONENT_NAME.state = {\s+)([\s\S]*?)(\s+}.*)/);

  if (!matches) return [];

  var stateFragments = [];
  var fragment = matches[0].replace('COMPONENT_NAME.state = ', '');
  var resultingStates = eval('(' + fragment + ')');
  (0, _keys2.default)(resultingStates).forEach(function (key) {
    stateFragments.push({
      name: key,
      value: typeof resultingStates[key] === 'boolean' ? (0, _stringify2.default)(resultingStates[key]) : resultingStates[key]
    });
  });

  return stateFragments;
};