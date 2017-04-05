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

var HudTimer = function (_PureComponent) {
  (0, _inherits3.default)(HudTimer, _PureComponent);

  function HudTimer() {
    (0, _classCallCheck3.default)(this, HudTimer);
    return (0, _possibleConstructorReturn3.default)(this, (HudTimer.__proto__ || (0, _getPrototypeOf2.default)(HudTimer)).apply(this, arguments));
  }

  (0, _createClass3.default)(HudTimer, [{
    key: 'getRemainingTimeText',
    value: function getRemainingTimeText(secondsRemaining) {
      if (secondsRemaining <= 0) return '0:00';

      var minutes = Math.floor(secondsRemaining / 60);
      var seconds = secondsRemaining - minutes * 60;
      seconds = ('0' + seconds).substr(-2);

      return minutes + ':' + seconds;
    }
  }, {
    key: 'render',
    value: function render() {
      var secondsRemaining = this.props.secondsRemaining;


      return _react2.default.createElement(
        'div',
        { className: 'hud-timer hud-item' },
        this.getRemainingTimeText(secondsRemaining)
      );
    }
  }]);
  return HudTimer;
}(_react.PureComponent);

HudTimer.propTypes = {
  secondsRemaining: _react.PropTypes.number.isRequired
};
HudTimer.defaultProps = {
  secondsRemaining: 0
};
exports.default = HudTimer;