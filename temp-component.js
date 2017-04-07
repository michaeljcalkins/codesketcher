'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = LicenseWizardSongsInfo;

var _react = require('/Users/michaelcalkins/Code/musicbed/node_modules/react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('/Users/michaelcalkins/Code/musicbed/node_modules/lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function LicenseWizardSongsInfo(_ref) {
  var songs = _ref.songs;

  return _react2.default.createElement(
    'div',
    { className: 'flex fdr' },
    _react2.default.createElement(
      'div',
      { className: 'flex pr3' },
      _react2.default.createElement(
        'div',
        { className: 'LicenseImage__wrapper' },
        songs.map(function (song) {
          var songImageUrl = (0, _lodash.has)(song, 'album.imageObject.small_image_url') ? (0, _lodash.get)(song, 'album.imageObject.small_image_url') : (0, _lodash.get)(song, 'album.data.small_image_url');

          return _react2.default.createElement('div', {
            className: 'LicenseImage',
            style: {
              background: 'url(' + songImageUrl + ') no-repeat'
            }
          });
        })
      )
    ),
    _react2.default.createElement(
      'div',
      { className: 'flex fdr aifs' },
      songs.length === 1 && _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'div',
          { className: 'sans tal tcw ft3' },
          songs[0].name
        ),
        _react2.default.createElement(
          'div',
          { className: 'sans tal tcg60 ft1' },
          (0, _lodash.has)(songs, '[0]album.artist.name') ? (0, _lodash.get)(songs, '[0]album.artist.name') : (0, _lodash.get)(songs, '[0]album.data.artist.data.name')
        )
      ),
      songs.length > 1 && _react2.default.createElement(
        'span',
        { className: 'sans tal tcw ft2' },
        songs.length,
        ' Songs'
      )
    )
  );
}

LicenseWizardSongsInfo.propTypes = {
  songs: _react.PropTypes.array
};