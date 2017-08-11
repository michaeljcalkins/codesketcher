'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ImportsPane;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ImportsPane(_ref) {
  var handleSetState = _ref.handleSetState,
      imports = _ref.imports,
      onAddPropertySeed = _ref.onAddPropertySeed,
      onRemovePropertySeed = _ref.onRemovePropertySeed,
      onSetPropertySeed = _ref.onSetPropertySeed,
      propertySeeds = _ref.propertySeeds,
      onSetBasePathForImages = _ref.onSetBasePathForImages,
      onSetIncludedCss = _ref.onSetIncludedCss,
      handleOpenComponentOpenDialog = _ref.handleOpenComponentOpenDialog,
      handleOpenComponent = _ref.handleOpenComponent;

  function onSetImportPath(e) {}

  function renderImportRows() {
    return imports.map(function (importString) {
      return _react2.default.createElement(
        'div',
        { className: 'pane-row mb1', key: 'import-' + importString.packageName },
        _react2.default.createElement(
          'div',
          { className: 'form-column one-half' },
          _react2.default.createElement(
            'label',
            { className: 'form-label' },
            importString.packageName
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'form-column one-half' },
          _react2.default.createElement('input', { type: 'text', placeholder: 'Value', defaultValue: importString.path, onChange: onSetImportPath })
        )
      );
    });
  }

  function renderPropertyDataFields() {
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

  function onAddDependency() {}

  function handleSubmitOpenComponent(e) {
    console.log(e);
    handleOpenComponent();
  }

  var defaultBasePathForImages = window.localStorage.getItem('basePathForImages');
  var defaultIncludedCss = window.localStorage.getItem('includedCss');

  return _react2.default.createElement(
    'div',
    { style: { marginTop: 37 } },
    _react2.default.createElement(
      'div',
      { className: 'pane-group bb1 bt1 pb1' },
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
              { className: 'btn btn-default btn-block', onClick: handleOpenComponentOpenDialog },
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
        _react2.default.createElement(
          'div',
          { className: 'pane-row' },
          _react2.default.createElement(
            'table',
            { className: 'table mb0' },
            _react2.default.createElement(
              'tbody',
              null,
              renderPropertyDataFields()
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
              { onSubmit: onAddDependency },
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
              defaultValue: defaultIncludedCss,
              onChange: onSetIncludedCss,
              placeholder: 'http://localhost:3000/css/app.css',
              type: 'text'
            })
          )
        )
      )
    ),
    _react2.default.createElement(
      'div',
      { className: 'form-row' },
      _react2.default.createElement('label', null)
    )
  );
}