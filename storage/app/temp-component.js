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

var _react = require('/Users/michaelcalkins/Code/reactecho/node_modules/react');

var _react2 = _interopRequireDefault(_react);

var _reactAutobind = require('/Users/michaelcalkins/Code/reactecho/node_modules/react-autobind');

var _reactAutobind2 = _interopRequireDefault(_reactAutobind);

var _UsersMichaelcalkinsCodeReactechoTestsPreviousButton = require('/Users/michaelcalkins/Code/reactecho/storage/components/-Users-michaelcalkins-Code-reactecho-tests-PreviousButton.js');

var _UsersMichaelcalkinsCodeReactechoTestsPreviousButton2 = _interopRequireDefault(_UsersMichaelcalkinsCodeReactechoTestsPreviousButton);

var _UsersMichaelcalkinsCodeReactechoTestsPlayButton = require('/Users/michaelcalkins/Code/reactecho/storage/components/-Users-michaelcalkins-Code-reactecho-tests-PlayButton.js');

var _UsersMichaelcalkinsCodeReactechoTestsPlayButton2 = _interopRequireDefault(_UsersMichaelcalkinsCodeReactechoTestsPlayButton);

var _UsersMichaelcalkinsCodeReactechoTestsNextButton = require('/Users/michaelcalkins/Code/reactecho/storage/components/-Users-michaelcalkins-Code-reactecho-tests-NextButton.js');

var _UsersMichaelcalkinsCodeReactechoTestsNextButton2 = _interopRequireDefault(_UsersMichaelcalkinsCodeReactechoTestsNextButton);

var _UsersMichaelcalkinsCodeReactechoTestsSongTime = require('/Users/michaelcalkins/Code/reactecho/storage/components/-Users-michaelcalkins-Code-reactecho-tests-SongTime.js');

var _UsersMichaelcalkinsCodeReactechoTestsSongTime2 = _interopRequireDefault(_UsersMichaelcalkinsCodeReactechoTestsSongTime);

var _UsersMichaelcalkinsCodeReactechoTestsWavelength = require('/Users/michaelcalkins/Code/reactecho/storage/components/-Users-michaelcalkins-Code-reactecho-tests-Wavelength.js');

var _UsersMichaelcalkinsCodeReactechoTestsWavelength2 = _interopRequireDefault(_UsersMichaelcalkinsCodeReactechoTestsWavelength);

var _UsersMichaelcalkinsCodeReactechoTestsSoundVolume = require('/Users/michaelcalkins/Code/reactecho/storage/components/-Users-michaelcalkins-Code-reactecho-tests-SoundVolume.js');

var _UsersMichaelcalkinsCodeReactechoTestsSoundVolume2 = _interopRequireDefault(_UsersMichaelcalkinsCodeReactechoTestsSoundVolume);

var _UsersMichaelcalkinsCodeReactechoTestsSongInfo = require('/Users/michaelcalkins/Code/reactecho/storage/components/-Users-michaelcalkins-Code-reactecho-tests-SongInfo.js');

var _UsersMichaelcalkinsCodeReactechoTestsSongInfo2 = _interopRequireDefault(_UsersMichaelcalkinsCodeReactechoTestsSongInfo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SongRow = function (_React$Component) {
  (0, _inherits3.default)(SongRow, _React$Component);

  function SongRow(props) {
    (0, _classCallCheck3.default)(this, SongRow);

    var _this = (0, _possibleConstructorReturn3.default)(this, (SongRow.__proto__ || (0, _getPrototypeOf2.default)(SongRow)).call(this, props));

    (0, _reactAutobind2.default)(_this);

    _this.state = {
      isPlaying: false
    };
    return _this;
  }

  (0, _createClass3.default)(SongRow, [{
    key: 'handleTogglePlay',
    value: function handleTogglePlay() {
      this.setState({
        isPlaying: !this.state.isPlaying
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          artistName = _props.artistName,
          songName = _props.songName,
          albumImageUrl = _props.albumImageUrl,
          waveformUrl = _props.waveformUrl,
          secondsRemaining = _props.secondsRemaining;
      var isPlaying = this.state.isPlaying;


      var styles = {
        background: '#fff',
        borderRadius: '2px',
        fontFamily: 'Lucida Grande',
        color: '#222',
        display: 'inline-block',
        height: '57px',
        margin: '1rem',
        padding: '5px',
        position: 'relative',
        textAlign: 'left',
        width: '100%',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)'
      };

      return _react2.default.createElement(
        'div',
        { style: styles },
        _react2.default.createElement(_UsersMichaelcalkinsCodeReactechoTestsPreviousButton2.default, null),
        _react2.default.createElement(_UsersMichaelcalkinsCodeReactechoTestsPlayButton2.default, {
          onTogglePlay: this.handleTogglePlay,
          isPlaying: isPlaying
        }),
        _react2.default.createElement(_UsersMichaelcalkinsCodeReactechoTestsNextButton2.default, null),
        _react2.default.createElement(_UsersMichaelcalkinsCodeReactechoTestsSongTime2.default, {
          secondsRemaining: secondsRemaining
        }),
        _react2.default.createElement(_UsersMichaelcalkinsCodeReactechoTestsWavelength2.default, {
          waveformUrl: waveformUrl
        }),
        _react2.default.createElement(_UsersMichaelcalkinsCodeReactechoTestsSoundVolume2.default, null),
        _react2.default.createElement(_UsersMichaelcalkinsCodeReactechoTestsSongInfo2.default, {
          artistName: artistName,
          songName: songName,
          albumImageUrl: albumImageUrl
        })
      );
    }
  }]);
  return SongRow;
}(_react2.default.Component);

exports.default = SongRow;