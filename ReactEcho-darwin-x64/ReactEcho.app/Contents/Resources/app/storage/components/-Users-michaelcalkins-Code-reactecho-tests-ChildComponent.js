'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ChildComponent;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ChildComponent(_ref) {
  var testProp1 = _ref.testProp1;

  return _react2.default.createElement(
    'div',
    null,
    'CHILD - ',
    testProp1
  );
}

ChildComponent.defaultProps = {
  testProp1: 'NO VALUE YET'
};