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

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ComponentsPane = function (_React$Component) {
  (0, _inherits3.default)(ComponentsPane, _React$Component);

  function ComponentsPane(props) {
    (0, _classCallCheck3.default)(this, ComponentsPane);

    var _this = (0, _possibleConstructorReturn3.default)(this, (ComponentsPane.__proto__ || (0, _getPrototypeOf2.default)(ComponentsPane)).call(this, props));

    (0, _reactAutobind2.default)(_this);

    _this.state = {
      searchTerm: null
    };
    return _this;
  }

  (0, _createClass3.default)(ComponentsPane, [{
    key: 'handleSearchTermInput',
    value: function handleSearchTermInput() {
      this.setState({
        searchTerm: this.refs.searchTerm.value.toLowerCase()
      });
    }
  }, {
    key: 'renderComponentsList',
    value: function renderComponentsList() {
      var _props = this.props,
          activeComponentFilepath = _props.activeComponentFilepath,
          componentFilepaths = _props.componentFilepaths,
          onOpenComponent = _props.onOpenComponent;
      var searchTerm = this.state.searchTerm;


      return componentFilepaths.filter(function (component) {
        if (!searchTerm) return true;
        return component.uniqueFilepath.toLowerCase().indexOf(searchTerm) > -1;
      }).map(function (component) {
        var componentClassnames = (0, _classnames2.default)('mb1 ph1 pv1 ft13 pointer tcg', {
          'bglb': activeComponentFilepath === component.filepath
        });

        return _react2.default.createElement(
          'p',
          {
            className: componentClassnames,
            key: component.uniqueFilepath,
            onClick: function onClick() {
              return onOpenComponent(component.filepath);
            }
          },
          _react2.default.createElement(
            'strong',
            null,
            component.filename
          ),
          _react2.default.createElement('br', null),
          _react2.default.createElement(
            'span',
            { className: 'ft12' },
            component.uniqueFilepath
          )
        );
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var onOpenComponentOrDirectory = this.props.onOpenComponentOrDirectory;


      return _react2.default.createElement(
        'div',
        { className: 'pane-group pange-group-components h100' },
        _react2.default.createElement(
          'div',
          { className: 'pane-header' },
          _react2.default.createElement(
            'span',
            { className: 'ml14' },
            'React Echo'
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'pane-body br1' },
          _react2.default.createElement(
            'div',
            { className: 'pane-row mb1' },
            _react2.default.createElement(
              'div',
              { className: 'form-column three-fourths' },
              _react2.default.createElement('input', {
                type: 'text',
                ref: 'searchTerm',
                placeholder: 'Search Components',
                onChange: this.handleSearchTermInput
              })
            ),
            _react2.default.createElement(
              'div',
              { className: 'form-column one-fourth' },
              _react2.default.createElement(
                'button',
                {
                  className: 'btn btn-default btn-block',
                  onClick: onOpenComponentOrDirectory
                },
                _react2.default.createElement('i', { className: 'fa fa-folder' })
              )
            )
          ),
          _react2.default.createElement(
            'div',
            {
              className: 'pane-row',
              style: {
                top: 74,
                left: 0,
                right: 0,
                bottom: 0,
                position: 'absolute',
                overflowY: 'auto',
                overflowX: 'hidden'
              }
            },
            this.renderComponentsList()
          )
        )
      );
    }
  }]);
  return ComponentsPane;
}(_react2.default.Component);

exports.default = ComponentsPane;