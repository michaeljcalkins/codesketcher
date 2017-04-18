'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_ref) {
  var name = _ref.name,
      phone = _ref.phone,
      job = _ref.job;

  var styles = {
    float: 'left'
  };

  return _react2.default.createElement(
    'div',
    { style: styles },
    name,
    _react2.default.createElement('br', null),
    phone,
    _react2.default.createElement('br', null),
    job
  );
};

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }