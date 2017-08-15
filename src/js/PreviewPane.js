'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _objectDestructuringEmpty2 = require('babel-runtime/helpers/objectDestructuringEmpty');

var _objectDestructuringEmpty3 = _interopRequireDefault(_objectDestructuringEmpty2);

exports.default = PreviewPane;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactAutobind = require('react-autobind');

var _reactAutobind2 = _interopRequireDefault(_reactAutobind);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function PreviewPane(_ref) {
  (0, _objectDestructuringEmpty3.default)(_ref);

  return _react2.default.createElement(
    'div',
    {
      className: 'pane',
      style: {
        backgroundColor: '#2c3643',
        bottom: 0,
        display: 'block',
        position: 'absolute',
        left: 0,
        marginLeft: '275px',
        right: 0,
        top: '37px',
        width: 'auto',
        zIndex: 2
      }
    },
    _react2.default.createElement(
      'div',
      { className: 'pane-group' },
      _react2.default.createElement(
        'div',
        { className: 'pane-body' },
        _react2.default.createElement(
          'div',
          {
            style: {
              overflow: 'auto',
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0
            }
          },
          _react2.default.createElement('style', { id: 'component-styles' }),
          _react2.default.createElement('div', {
            className: 'align-middle',
            id: 'component-preview',
            style: {
              background: '#2c3643',
              bottom: 0,
              left: 0,
              position: 'absolute',
              right: 0,
              top: '37px'
            }
          })
        )
      )
    )
  );
}