'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactAutobind = require('react-autobind');

var _reactAutobind2 = _interopRequireDefault(_reactAutobind);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SongRow = function (_Component) {
  _inherits(SongRow, _Component);

  function SongRow(props) {
    _classCallCheck(this, SongRow);

    var _this = _possibleConstructorReturn(this, (SongRow.__proto__ || Object.getPrototypeOf(SongRow)).call(this, props));

    (0, _reactAutobind2.default)(_this);
    _this.state = {};
    return _this;
  }

  _createClass(SongRow, [{
    key: 'playSong',
    value: function playSong() {
      this.setState({ isPlaying: true });
    }
  }, {
    key: 'pauseSong',
    value: function pauseSong() {
      this.setState({ isPlaying: false });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          songName = _props.songName,
          artistName = _props.artistName;
      var isPlaying = this.state.isPlaying;


      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'div',
          null,
          songName
        ),
        _react2.default.createElement(
          'div',
          null,
          artistName
        ),
        _react2.default.createElement(
          'div',
          null,
          isPlaying ? 'Song is playing' : 'Song is not playing'
        ),
        _react2.default.createElement(
          'button',
          { onClick: this.playSong },
          'Play Now'
        ),
        _react2.default.createElement(
          'button',
          { onClick: this.pauseSong },
          'Pause Song'
        )
      );
    }
  }]);

  return SongRow;
}(_react.Component);

exports.default = SongRow;


SongRow.state = {
  isPlaying: false

};

SongRow.propTypes = {
  artistName: _react.PropTypes.string,
  songName: _react.PropTypes.string

};

SongRow.defaultProps = {
  artistName: 'DEFAULT',
  songName: 'Blood Brothers'

};