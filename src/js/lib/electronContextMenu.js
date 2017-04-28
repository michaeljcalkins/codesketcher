'use strict';

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }return arr2;
  } else {
    return (0, _from2.default)(arr);
  }
}

var electron = require('electron');

var _require = require('electron-dl'),
    download = _require.download;

var isDev = false;

function create(win, opts) {
  (win.webContents || win.getWebContents()).on('context-menu', function (e, props) {
    if (typeof opts.shouldShowMenu === 'function' && opts.shouldShowMenu(e, props) === false) {
      return;
    }

    var editFlags = props.editFlags;
    var hasText = props.selectionText.trim().length > 0;
    var can = function can(type) {
      return editFlags['can' + type] && hasText;
    };

    var menuTpl = [{
      type: 'separator'
    }, {
      id: 'cut',
      label: 'Cut',
      // Needed because of macOS limitation:
      // https://github.com/electron/electron/issues/5860
      role: can('Cut') ? 'cut' : '',
      enabled: can('Cut'),
      visible: props.isEditable
    }, {
      id: 'copy',
      label: 'Copy',
      role: can('Copy') ? 'copy' : '',
      enabled: can('Copy'),
      visible: props.isEditable || hasText
    }, {
      id: 'paste',
      label: 'Paste',
      role: editFlags.canPaste ? 'paste' : '',
      enabled: editFlags.canPaste,
      visible: props.isEditable
    }, {
      type: 'separator'
    }];

    if (props.mediaType === 'image') {
      menuTpl = [{
        type: 'separator'
      }, {
        id: 'save',
        label: 'Save Image',
        click: function click(item, win) {
          download(win, props.srcURL);
        }
      }, {
        type: 'separator'
      }];
    }

    if (props.linkURL && props.mediaType === 'none') {
      menuTpl = [{
        type: 'separator'
      }, {
        id: 'copyLink',
        label: 'Copy Link',
        click: function click() {
          if (process.platform === 'darwin') {
            electron.clipboard.writeBookmark(props.linkText, props.linkURL);
          } else {
            electron.clipboard.writeText(props.linkURL);
          }
        }
      }, {
        type: 'separator'
      }];
    }

    if (opts.prepend) {
      var result = opts.prepend(props, win);

      if (Array.isArray(result)) {
        var _menuTpl;

        (_menuTpl = menuTpl).unshift.apply(_menuTpl, _toConsumableArray(result));
      }
    }

    if (opts.append) {
      var _result = opts.append(props, win);

      if (Array.isArray(_result)) {
        var _menuTpl2;

        (_menuTpl2 = menuTpl).push.apply(_menuTpl2, _toConsumableArray(_result));
      }
    }

    if (opts.showInspectElement || opts.showInspectElement !== false && isDev) {
      menuTpl.push({
        type: 'separator'
      }, {
        id: 'inspect',
        label: 'Inspect Element',
        click: function click(item, win) {
          win.webContents.inspectElement(props.x, props.y);

          if (win.webContents.isDevToolsOpened()) {
            win.webContents.devToolsWebContents.focus();
          }
        }
      }, {
        type: 'separator'
      });
    }

    // Apply custom labels for default menu items
    if (opts.labels) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError;

      try {
        for (var _iterator = (0, _getIterator3.default)(menuTpl), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var menuItem = _step.value;

          if (opts.labels[menuItem.id]) {
            menuItem.label = opts.labels[menuItem.id];
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }

    // Filter out leading/trailing separators
    // TODO: https://github.com/electron/electron/issues/5869
    menuTpl = delUnusedElements(menuTpl);

    if (menuTpl.length > 0) {
      var menu = (electron.Menu || electron.remote.Menu).buildFromTemplate(menuTpl);

      /*
       * When electron.remote is not available this runs in the browser process.
       * We can safely use win in this case as it refers to the window the
       * context-menu should open in.
       * When this is being called from a webView, we can't use win as this
       * would refere to the webView which is not allowed to render a popup menu.
       */
      menu.popup(electron.remote ? electron.remote.getCurrentWindow() : win);
    }
  });
}

function delUnusedElements(menuTpl) {
  var notDeletedPrevEl = void 0;
  return menuTpl.filter(function (el) {
    return el.visible !== false;
  }).filter(function (el, i, arr) {
    var toDelete = el.type === 'separator' && (!notDeletedPrevEl || i === arr.length - 1 || arr[i + 1].type === 'separator');
    notDeletedPrevEl = toDelete ? notDeletedPrevEl : el;
    return !toDelete;
  });
}

module.exports = function () {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (opts.window) {
    var win = opts.window;
    var webContents = win.webContents || win.getWebContents();

    // When window is a webview that has not yet finished loading webContents is not available
    if (webContents === undefined) {
      win.addEventListener('dom-ready', function () {
        create(win, opts);
      }, { once: true });
      return;
    }

    return create(win, opts);
  }

  (electron.BrowserWindow || electron.remote.BrowserWindow).getAllWindows().forEach(function (win) {
    create(win, opts);
  });

  (electron.app || electron.remote.app).on('browser-window-created', function (e, win) {
    create(win, opts);
  });
};