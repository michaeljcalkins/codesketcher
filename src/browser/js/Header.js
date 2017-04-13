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

var Header = function (_React$Component) {
  (0, _inherits3.default)(Header, _React$Component);

  function Header(props) {
    (0, _classCallCheck3.default)(this, Header);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Header.__proto__ || (0, _getPrototypeOf2.default)(Header)).call(this, props));

    (0, _reactAutobind2.default)(_this);
    return _this;
  }

  (0, _createClass3.default)(Header, [{
    key: 'render',
    value: function render() {
      var onOpenComponentOrDirectory = this.props.onOpenComponentOrDirectory;


      return _react2.default.createElement(
        'nav',
        { className: 'navbar navbar-default navbar-fixed-top' },
        _react2.default.createElement('div', { className: 'header-title-bar', id: 'display-project-path' }),
        _react2.default.createElement(
          'div',
          { className: 'container-fluid' },
          _react2.default.createElement(
            'div',
            { id: 'navbar', className: 'navbar-collapse collapse' },
            _react2.default.createElement(
              'ul',
              { className: 'nav navbar-nav text-center' },
              _react2.default.createElement(
                'li',
                null,
                _react2.default.createElement(
                  'a',
                  { onClick: onOpenComponentOrDirectory },
                  _react2.default.createElement('i', { className: 'fa fa-folder' }),
                  'Open'
                )
              ),
              _react2.default.createElement(
                'li',
                { className: 'pointer' },
                _react2.default.createElement(
                  'a',
                  null,
                  _react2.default.createElement('i', { className: 'fa fa-plus-square' }),
                  'Create'
                )
              ),
              _react2.default.createElement(
                'li',
                null,
                _react2.default.createElement(
                  'a',
                  { id: 'save-file' },
                  _react2.default.createElement('i', { className: 'fa fa-save' }),
                  'Save'
                )
              )
            )
          )
        )
      );
    }
  }]);
  return Header;
}(_react2.default.Component);

exports.default = Header;