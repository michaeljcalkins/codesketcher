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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HudAmmo = function (_PureComponent) {
  (0, _inherits3.default)(HudAmmo, _PureComponent);

  function HudAmmo() {
    (0, _classCallCheck3.default)(this, HudAmmo);
    return (0, _possibleConstructorReturn3.default)(this, (HudAmmo.__proto__ || (0, _getPrototypeOf2.default)(HudAmmo)).apply(this, arguments));
  }

  (0, _createClass3.default)(HudAmmo, [{
    key: 'renderAmmo',
    value: function renderAmmo(ammo, isReloading, isSwitching) {
      if (isSwitching) return _react2.default.createElement('i', { className: 'switching-weapon' });
      if (isReloading) return _react2.default.createElement('i', { className: 'reloading-weapon' });
      return ammo;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          ammo = _props.ammo,
          isReloading = _props.isReloading,
          isSwitching = _props.isSwitching;


      return _react2.default.createElement(
        'div',
        { className: 'hud-ammo hud-item' },
        this.renderAmmo(ammo, isReloading, isSwitching)
      );
    }
  }]);
  return HudAmmo;
}(_react.PureComponent);

HudAmmo.propTypes = {
  ammo: _react.PropTypes.number.isRequired,
  isReloading: _react.PropTypes.bool,
  isSwitching: _react.PropTypes.bool
};
HudAmmo.defaultProps = {
  ammo: 0,
  isReloading: false,
  isSwitching: false
};
exports.default = HudAmmo;