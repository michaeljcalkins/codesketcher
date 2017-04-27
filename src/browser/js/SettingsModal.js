'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactAutobind = require('react-autobind');

var _reactAutobind2 = _interopRequireDefault(_reactAutobind);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SettingsModal = function (_Component) {
  (0, _inherits3.default)(SettingsModal, _Component);

  function SettingsModal(props) {
    (0, _classCallCheck3.default)(this, SettingsModal);

    var _this = (0, _possibleConstructorReturn3.default)(this, (SettingsModal.__proto__ || (0, _getPrototypeOf2.default)(SettingsModal)).call(this, props));

    (0, _reactAutobind2.default)(_this);
    return _this;
  }

  (0, _createClass3.default)(SettingsModal, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          onSetIncludedCss = _props.onSetIncludedCss,
          onSetBasePathForImages = _props.onSetBasePathForImages;


      var defaultBasePathForImages = window.localStorage.getItem('basePathForImages');
      var defaultIncludedCss = window.localStorage.getItem('includedCss');

      return _react2.default.createElement(
        'div',
        { className: 'modal-content' },
        _react2.default.createElement(
          'div',
          { className: 'modal-header' },
          _react2.default.createElement('button', { type: 'button', className: 'close', 'data-dismiss': 'modal', 'aria-label': 'Close' }),
          _react2.default.createElement(
            'h4',
            { className: 'modal-title' },
            'Settings'
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'modal-body' },
          _react2.default.createElement(
            'h4',
            null,
            'Environment'
          ),
          _react2.default.createElement(
            'div',
            { className: 'form-group' },
            _react2.default.createElement(
              'label',
              null,
              'Included CSS File'
            ),
            _react2.default.createElement('input', {
              className: 'form-control',
              defaultValue: defaultIncludedCss,
              onChange: onSetIncludedCss,
              placeholder: 'http://localhost:3000/css/app.css',
              type: 'text'
            })
          ),
          _react2.default.createElement(
            'div',
            { className: 'form-group' },
            _react2.default.createElement(
              'label',
              null,
              'Base Path For Images'
            ),
            _react2.default.createElement('input', {
              className: 'form-control',
              defaultValue: defaultBasePathForImages,
              onChange: onSetBasePathForImages,
              placeholder: 'http://localhost:3000/images',
              type: 'text'
            })
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'modal-footer' },
          _react2.default.createElement(
            'button',
            { type: 'button', className: 'btn btn-default', 'data-dismiss': 'modal' },
            'Close'
          )
        )
      );
    }
  }]);
  return SettingsModal;
}(_react.Component);

exports.default = SettingsModal;