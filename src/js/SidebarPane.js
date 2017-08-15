'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = SidebarPane;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function SidebarPane(_ref) {
  var basePathForImages = _ref.basePathForImages,
      includedCssUrl = _ref.includedCssUrl,
      debouncedRenderComponent = _ref.debouncedRenderComponent,
      onAddPropertySeed = _ref.onAddPropertySeed,
      onIncludedCssUrlChange = _ref.onIncludedCssUrlChange,
      onOpenComponentOpenDialog = _ref.onOpenComponentOpenDialog,
      onRemovePropertySeed = _ref.onRemovePropertySeed,
      onSetPropertySeed = _ref.onSetPropertySeed,
      onSetState = _ref.onSetState,
      propertySeeds = _ref.propertySeeds;

  function handleSetIncludedCssUrl(e) {
    onSetState({
      includedCssUrl: e.currentTarget.value
    }, function () {
      onIncludedCssUrlChange();
    });
  }

  function handleSetBasePathForImages(e) {
    onSetState({
      basePathForImages: e.currentTarget.value
    });
  }

  function handleAddDependency() {}

  function renderPropertyDataFields() {
    if (!propertySeeds) return [];

    return propertySeeds.map(function (propertySeed, key) {
      return _react2.default.createElement(
        'div',
        { className: 'form-row', key: 'property-seed-' + propertySeed.id },
        _react2.default.createElement(
          'div',
          { className: 'form-column full-width' },
          _react2.default.createElement('input', {
            type: 'text',
            className: 'mb1',
            placeholder: 'Key',
            defaultValue: propertySeed.key,
            onChange: function onChange(e) {
              return onSetPropertySeed(e, key, 'key');
            }
          }),
          _react2.default.createElement('textarea', {
            style: { height: '60px' },
            placeholder: 'Value',
            defaultValue: propertySeed.value,
            onChange: function onChange(e) {
              return onSetPropertySeed(e, key, 'value');
            }
          }),
          _react2.default.createElement(
            'button',
            {
              className: 'btn btn-default btn-block btn-xs pull-right mb2',
              onClick: function onClick() {
                return onRemovePropertySeed(key);
              }
            },
            _react2.default.createElement('i', { className: 'fa fa-remove' })
          )
        )
      );
    });
  }

  return _react2.default.createElement(
    'div',
    {
      className: 'pane ',
      style: {
        background: '#222a34',
        bottom: 0,
        left: 0,
        position: 'absolute',
        top: 37,
        width: '275px'
      }
    },
    _react2.default.createElement(
      'div',
      { className: 'pane-group bb1 pb1' },
      _react2.default.createElement(
        'div',
        { className: 'pane-header' },
        'Entry File'
      ),
      _react2.default.createElement(
        'div',
        { className: 'pane-body' },
        _react2.default.createElement(
          'div',
          { className: 'pane-row mb1' },
          _react2.default.createElement(
            'div',
            { className: 'form-column full-width' },
            _react2.default.createElement(
              'button',
              { className: 'btn btn-default btn-block', onClick: onOpenComponentOpenDialog },
              _react2.default.createElement('i', { className: 'fa fa-folder' }),
              ' Open File'
            )
          )
        )
      )
    ),
    _react2.default.createElement(
      'div',
      { className: 'pane-group bb1 pb1' },
      _react2.default.createElement(
        'div',
        { className: 'pane-header' },
        'Property Editor',
        _react2.default.createElement(
          'button',
          { onClick: onAddPropertySeed, className: 'btn btn-default btn-xs pull-right' },
          _react2.default.createElement('i', { className: 'fa fa-plus' }),
          ' Property'
        )
      ),
      _react2.default.createElement(
        'div',
        { className: 'pane-body' },
        renderPropertyDataFields()
      )
    ),
    _react2.default.createElement(
      'div',
      { className: 'pane-group bb1 pb1' },
      _react2.default.createElement(
        'div',
        { className: 'pane-header' },
        'NPM Packages'
      ),
      _react2.default.createElement(
        'div',
        { className: 'pane-body' },
        _react2.default.createElement(
          'div',
          { className: 'pane-row mb1' },
          _react2.default.createElement(
            'div',
            { className: 'form-column full-width' },
            _react2.default.createElement(
              'form',
              { onSubmit: handleAddDependency },
              _react2.default.createElement('input', { className: 'form-control', placeholder: 'Write package name and press enter...', type: 'text' })
            )
          )
        )
      )
    ),
    _react2.default.createElement(
      'div',
      { className: 'pane-group bb1 pb1' },
      _react2.default.createElement(
        'div',
        { className: 'pane-header' },
        'Included CSS File'
      ),
      _react2.default.createElement(
        'div',
        { className: 'pane-body' },
        _react2.default.createElement(
          'div',
          { className: 'pane-row mb1' },
          _react2.default.createElement(
            'div',
            { className: 'form-column full-width' },
            _react2.default.createElement('input', {
              className: 'form-control',
              defaultValue: includedCssUrl,
              onChange: handleSetIncludedCssUrl,
              placeholder: 'http://localhost:3000/css/app.css',
              type: 'text'
            })
          )
        )
      )
    ),
    _react2.default.createElement(
      'div',
      { className: 'pane-group bb1 pb1' },
      _react2.default.createElement(
        'div',
        { className: 'pane-header' },
        'Base Path For Images'
      ),
      _react2.default.createElement(
        'div',
        { className: 'pane-body' },
        _react2.default.createElement(
          'div',
          { className: 'pane-row mb1' },
          _react2.default.createElement(
            'div',
            { className: 'form-column full-width' },
            _react2.default.createElement('input', {
              className: 'form-control',
              defaultValue: basePathForImages,
              onChange: handleSetBasePathForImages,
              placeholder: 'http://localhost:3000/images',
              type: 'text'
            })
          )
        )
      )
    )
  );
}