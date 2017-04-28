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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PreviewPane = function (_React$Component) {
  (0, _inherits3.default)(PreviewPane, _React$Component);

  function PreviewPane(props) {
    (0, _classCallCheck3.default)(this, PreviewPane);

    var _this = (0, _possibleConstructorReturn3.default)(this, (PreviewPane.__proto__ || (0, _getPrototypeOf2.default)(PreviewPane)).call(this, props));

    (0, _reactAutobind2.default)(_this);
    return _this;
  }

  (0, _createClass3.default)(PreviewPane, [{
    key: 'renderPropertyDataFields',
    value: function renderPropertyDataFields() {
      var _props = this.props,
          propertySeeds = _props.propertySeeds,
          onRemovePropertySeed = _props.onRemovePropertySeed,
          onSetPropertySeed = _props.onSetPropertySeed;


      if (!propertySeeds) return [];

      return propertySeeds.map(function (propertySeed, key) {
        return _react2.default.createElement(
          'tr',
          { key: 'property-seed-' + propertySeed.id },
          _react2.default.createElement(
            'td',
            { className: 'form-column w45 bl1' },
            _react2.default.createElement('input', {
              type: 'text',
              placeholder: 'Key',
              defaultValue: propertySeed.key,
              onChange: function onChange(e) {
                return onSetPropertySeed(e, key, 'key');
              }
            })
          ),
          _react2.default.createElement(
            'td',
            { className: 'form-column w45' },
            _react2.default.createElement('input', {
              type: 'text',
              placeholder: 'Value',
              defaultValue: propertySeed.value,
              onChange: function onChange(e) {
                return onSetPropertySeed(e, key, 'value');
              }
            })
          ),
          _react2.default.createElement(
            'td',
            { className: 'form-column w10' },
            _react2.default.createElement(
              'button',
              {
                className: 'btn btn-default btn-xs pull-right',
                onClick: function onClick() {
                  return onRemovePropertySeed(key);
                },
                style: { marginTop: '2px' }
              },
              _react2.default.createElement('i', { className: 'fa fa-remove' })
            )
          )
        );
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          onAddPropertySeed = _props2.onAddPropertySeed,
          activeComponentFilepath = _props2.activeComponentFilepath,
          isRendering = _props2.isRendering;


      var componentBasename = activeComponentFilepath ? ' - ' + _path2.default.basename(activeComponentFilepath) : '';

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'div',
          { className: 'pane-group pane-group-preview' },
          _react2.default.createElement(
            'div',
            { className: 'pane-header' },
            'Component Preview',
            componentBasename,
            isRendering && _react2.default.createElement('i', { className: 'fa fa-refresh fa-spin ml1' }),
            _react2.default.createElement(
              'button',
              {
                className: 'btn btn-default btn-xs pull-right',
                'data-toggle': 'modal',
                'data-target': '#settings-modal'
              },
              _react2.default.createElement('i', { className: 'fa fa-cog mr1' }),
              'Settings'
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'pane-body' },
            _react2.default.createElement(
              'div',
              {
                className: 'bl1 bb1 bt1',
                style: {
                  overflow: 'auto',
                  position: 'absolute',
                  top: '37px',
                  left: 0,
                  bottom: 0,
                  right: 0
                }
              },
              _react2.default.createElement('style', { id: 'component-styles' }),
              _react2.default.createElement('div', {
                className: 'align-middle',
                id: 'component-preview'
              })
            )
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'pane-group pane-group-prop-editor' },
          _react2.default.createElement(
            'div',
            { className: 'pane-header' },
            'Property Editor',
            _react2.default.createElement(
              'button',
              {
                onClick: onAddPropertySeed,
                className: 'btn btn-default btn-xs pull-right mr1'
              },
              'Detect and Replace Properties'
            ),
            _react2.default.createElement(
              'button',
              {
                onClick: onAddPropertySeed,
                className: 'btn btn-default btn-xs pull-right mr1'
              },
              _react2.default.createElement('i', { className: 'fa fa-plus' }),
              ' Property'
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'pane-body' },
            _react2.default.createElement(
              'div',
              { className: 'pane-row',
                style: {
                  overflowY: 'scroll',
                  position: 'absolute',
                  top: 37,
                  left: 0,
                  bottom: 0,
                  right: 0
                }
              },
              _react2.default.createElement(
                'table',
                { className: 'table mb0' },
                _react2.default.createElement(
                  'tbody',
                  null,
                  this.renderPropertyDataFields()
                )
              )
            )
          )
        )
      );
    }
  }]);
  return PreviewPane;
}(_react2.default.Component);

exports.default = PreviewPane;