'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_ref) {
  var artistName = _ref.artistName,
      songName = _ref.songName,
      albumImageUrl = _ref.albumImageUrl,
      waveformUrl = _ref.waveformUrl,
      secondsRemaining = _ref.secondsRemaining;

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
    _react2.default.createElement(_UsersMichaelcalkinsCodeReactechoTestsPlayButton2.default, null),
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
};

var _react = require('/Users/michaelcalkins/Code/reactecho/node_modules/react');

var _react2 = _interopRequireDefault(_react);

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