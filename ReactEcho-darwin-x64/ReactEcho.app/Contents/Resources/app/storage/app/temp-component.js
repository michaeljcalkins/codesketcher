'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_ref) {
  var src = _ref.src,
      name = _ref.name,
      phone = _ref.phone,
      job = _ref.job;

  var styles = {
    background: '#3498db',
    borderRadius: '2px',
    fontFamily: 'Lucida Grande',
    color: 'white',
    display: 'inline-block',
    height: '170px',
    margin: '1rem',
    padding: '15px',
    position: 'relative',
    textAlign: 'left',
    width: '300px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)'
  };

  return _react2.default.createElement(
    'div',
    { style: styles },
    _react2.default.createElement(_UsersMichaelcalkinsCodeReactechoTestsImageComponent2.default, { style: styles.image, src: src }),
    _react2.default.createElement(_UsersMichaelcalkinsCodeReactechoTestsNameComponent2.default, {
      style: styles.name,
      name: name,
      phone: phone,
      job: job
    })
  );
};

var _react = require('/Users/michaelcalkins/Code/reactecho/node_modules/react');

var _react2 = _interopRequireDefault(_react);

var _reactAutobind = require('/Users/michaelcalkins/Code/reactecho/node_modules/react-autobind');

var _reactAutobind2 = _interopRequireDefault(_reactAutobind);

var _UsersMichaelcalkinsCodeReactechoTestsImageComponent = require('/Users/michaelcalkins/Code/reactecho/storage/components/-Users-michaelcalkins-Code-reactecho-tests-ImageComponent.js');

var _UsersMichaelcalkinsCodeReactechoTestsImageComponent2 = _interopRequireDefault(_UsersMichaelcalkinsCodeReactechoTestsImageComponent);

var _UsersMichaelcalkinsCodeReactechoTestsNameComponent = require('/Users/michaelcalkins/Code/reactecho/storage/components/-Users-michaelcalkins-Code-reactecho-tests-NameComponent.js');

var _UsersMichaelcalkinsCodeReactechoTestsNameComponent2 = _interopRequireDefault(_UsersMichaelcalkinsCodeReactechoTestsNameComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }