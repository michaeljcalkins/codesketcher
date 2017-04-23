'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_ref) {
  var src = _ref.src;

  var styles = {
    marginBottom: '15px',
    float: 'right'
  };

  return _react2.default.createElement(
    'div',
    { style: styles },
    _react2.default.createElement('img', { src: src, width: '150' })
  );
};

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }