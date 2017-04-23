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

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EditorPane = function (_React$Component) {
  (0, _inherits3.default)(EditorPane, _React$Component);

  function EditorPane(props) {
    (0, _classCallCheck3.default)(this, EditorPane);

    var _this = (0, _possibleConstructorReturn3.default)(this, (EditorPane.__proto__ || (0, _getPrototypeOf2.default)(EditorPane)).call(this, props));

    (0, _reactAutobind2.default)(_this);
    return _this;
  }

  (0, _createClass3.default)(EditorPane, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var onCreateEditor = this.props.onCreateEditor;


      onCreateEditor(window.CodeMirror(document.getElementById('editor'), {
        lineNumbers: true,
        styleActiveLine: true,
        indentWithTabs: false,
        lineWrapping: true,
        mode: 'jsx',
        tabSize: 2,
        theme: 'monokai'
      }));
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          activeComponentFilepath = _props.activeComponentFilepath,
          isDirty = _props.isDirty;


      var componentBasename = _path2.default.basename(activeComponentFilepath);
      var paneHeaderClasses = (0, _classnames2.default)('pane-header', {
        // 'bgg': !isDirty,
        // 'bgr': isDirty
      });

      return _react2.default.createElement(
        'div',
        { className: 'pane pane-editor' },
        _react2.default.createElement(
          'div',
          { className: 'pane-group h100 pos-rel' },
          _react2.default.createElement(
            'div',
            { className: paneHeaderClasses },
            'Editor ',
            activeComponentFilepath && '- ' + componentBasename
          ),
          _react2.default.createElement('div', { className: 'pane-row', id: 'editor', style: { position: 'absolute', top: '32px', left: 0, bottom: 0, right: 0 } })
        )
      );
    }
  }]);
  return EditorPane;
}(_react2.default.Component);

exports.default = EditorPane;