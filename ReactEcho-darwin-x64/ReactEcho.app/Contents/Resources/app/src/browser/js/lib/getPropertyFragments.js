'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (componentString, componentName) {
  var modifiedString = componentString.replace(new RegExp(componentName, 'g'), 'COMPONENT_NAME');
  var matches = modifiedString.match(/(.*COMPONENT_NAME.propTypes = {\s+)([\s\S]*?)(\s+}.*)/);

  if (!matches) {
    matches = modifiedString.match(/(.*static propTypes = {\s+)([\s\S]*?)(\s+}.*)/);
  }

  if (!matches) return [];

  var propFragments = {};
  var fragment = matches[0].replace('COMPONENT_NAME.propTypes = ', '').replace('static propTypes = ', '');
  var requiredFragment = matches[0].replace('COMPONENT_NAME.propTypes = ', '').replace('static propTypes = ', '');
  fragment = fragment.replace(new RegExp('PropTypes.', 'g'), '');
  fragment = fragment.replace(new RegExp('.isRequired', 'g'), '');
  fragment = fragment.replace(new RegExp('string', 'g'), '"string"');
  fragment = fragment.replace(new RegExp('number', 'g'), '"number"');
  fragment = fragment.replace(new RegExp('object', 'g'), '"object"');
  fragment = fragment.replace(new RegExp('func', 'g'), '"func"');
  fragment = fragment.replace(new RegExp('bool', 'g'), '"bool"');
  fragment = fragment.replace(new RegExp('array', 'g'), '"array"');

  var resultingStates = eval('(' + fragment + ')');
  (0, _keys2.default)(resultingStates).forEach(function (key) {
    propFragments[key] = {
      name: key,
      required: !!requiredFragment.match(key + ': PropTypes.' + resultingStates[key] + '.isRequired'),
      type: typeof resultingStates[key] === 'boolean' ? (0, _stringify2.default)(resultingStates[key]) : resultingStates[key]
    };
  });

  matches = modifiedString.match(/(.*COMPONENT_NAME.defaultProps = {\s+)([\s\S]*?)(\s+}.*)/);
  if (!matches) {
    matches = modifiedString.match(/(.*static defaultProps = {\s+)([\s\S]*?)(\s+}.*)/);
    (0, _keys2.default)(resultingStates).forEach(function (key) {
      propFragments[key].default = '';
    });
  }

  if (matches) {
    fragment = matches[0].replace('COMPONENT_NAME.defaultProps = ', '').replace('static defaultProps = ', '');

    resultingStates = eval('(' + fragment + ')');
    (0, _keys2.default)(resultingStates).forEach(function (key) {
      propFragments[key].default = resultingStates[key];
    });
  }

  return (0, _keys2.default)(propFragments).map(function (key) {
    return propFragments[key];
  });
};