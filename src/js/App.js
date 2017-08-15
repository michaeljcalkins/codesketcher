'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

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

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactAutobind = require('react-autobind');

var _reactAutobind2 = _interopRequireDefault(_reactAutobind);

var _chokidar = require('chokidar');

var _chokidar2 = _interopRequireDefault(_chokidar);

var _ComponentsPane = require('./ComponentsPane');

var _ComponentsPane2 = _interopRequireDefault(_ComponentsPane);

var _PreviewPane = require('./PreviewPane');

var _PreviewPane2 = _interopRequireDefault(_PreviewPane);

var _SidebarPane = require('./SidebarPane');

var _SidebarPane2 = _interopRequireDefault(_SidebarPane);

var _SettingsModal = require('./SettingsModal');

var _SettingsModal2 = _interopRequireDefault(_SettingsModal);

var _getSharedStartingString = require('./lib/getSharedStartingString');

var _getSharedStartingString2 = _interopRequireDefault(_getSharedStartingString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Sass = require('sass.js');
var _ = require('lodash');
var replaceFromWithPath = require('./lib/replaceFromWithPath');
var recursive = require('recursive-readdir');
var fs = require('fs');
var path = require('path');
var dialog = require('electron').remote.dialog;
var request = require('request');
var app = require('electron').remote.app;
var webpack = require('webpack');

var watching = void 0;

var App = function (_React$Component) {
  (0, _inherits3.default)(App, _React$Component);

  function App(props) {
    (0, _classCallCheck3.default)(this, App);

    var _this = (0, _possibleConstructorReturn3.default)(this, (App.__proto__ || (0, _getPrototypeOf2.default)(App)).call(this, props));

    (0, _reactAutobind2.default)(_this);

    var cachedState = null;
    try {
      cachedState = window.localStorage.getItem('state') ? JSON.parse(window.localStorage.getItem('state')) : {};
    } catch (e) {
      cachedState = null;
    }

    _this.state = cachedState ? cachedState : {
      activeComponentFilepath: null,
      basePathForImages: null,
      compiler: null,
      componentInstance: null,
      includedCssUrl: null,
      isRendering: false,
      propertySeeds: propertySeeds,
      watcher: null
    };

    _this.debouncedCompileWebpack = _.debounce(_this.handleCompileWebpack, 500);
    return _this;
  }

  (0, _createClass3.default)(App, [{
    key: 'handleCompileWebpack',
    value: function handleCompileWebpack() {
      this.state.compiler.run(this.renderComponent.bind(this));
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this2 = this;

      var _state = this.state,
          basePathForImages = _state.basePathForImages,
          includedCssUrl = _state.includedCssUrl,
          activeComponentFilepath = _state.activeComponentFilepath,
          propertySeeds = _state.propertySeeds,
          componentInstance = _state.componentInstance;


      Mousetrap.bind('command+o', function () {
        _this2.handleOpenComponentOpenDialog();
      });

      this.setState({
        compiler: webpack({
          // Configuration Object
          entry: path.resolve(__dirname, 'containerComponent.js'),
          output: {
            filename: 'bundle.js',
            path: path.resolve(app.getPath('temp'))
          },
          module: {
            rules: [{
              test: /\.js$/,
              exclude: /(node_modules|bower_components)/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: [require('babel-preset-latest'), require('babel-preset-react')],
                  plugins: [require('babel-plugin-transform-object-rest-spread'), require('babel-plugin-transform-class-properties'), require('babel-plugin-transform-es2015-classes'), require('babel-plugin-transform-runtime')]
                }
              }
            }]
          }
        })
      }, function () {
        if (activeComponentFilepath) {
          _this2.restartWebpackWatch();
        }

        if (includedCssUrl) {
          _this2.handleIncludedCssUrlChange();
        }
      });
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.registerWebpackWatch();
    }
  }, {
    key: 'restartWebpackWatch',
    value: function restartWebpackWatch() {
      var _this3 = this;

      if (!watching) this.registerWebpackWatch();

      watching.close(function () {
        console.log('Watching Ended.');
        _this3.registerWebpackWatch();
      });
    }
  }, {
    key: 'registerWebpackWatch',
    value: function registerWebpackWatch() {
      console.log('Registering webpack');
      watching = this.state.compiler.watch({}, this.renderComponent.bind(this));
    }
  }, {
    key: 'renderComponent',
    value: function renderComponent(err, stats) {
      var _state2 = this.state,
          basePathForImages = _state2.basePathForImages,
          activeComponentFilepath = _state2.activeComponentFilepath,
          propertySeeds = _state2.propertySeeds,
          componentInstance = _state2.componentInstance;


      if (!activeComponentFilepath) return;

      console.log('Start Rendering');

      if (err) {
        console.error(err.stack || err);
        if (err.details) {
          console.error(err.details);
        }
        return;
      }

      var info = stats.toJson();

      if (stats.hasErrors()) {
        console.error(info.errors);
      }

      if (stats.hasWarnings()) {
        console.warn(info.warnings);
      }

      this.setState({ isRendering: true });

      // Get seed data for properties if there is any
      var componentPropValues = {};
      if (propertySeeds) {
        propertySeeds.forEach(function (propertySeed) {
          if (!propertySeed.value || propertySeed.value.length === 0) return;
          componentPropValues[propertySeed.key] = eval('(' + propertySeed.value + ')'); // eslint-disable-line
        });
      }
      componentPropValues = (0, _stringify2.default)(componentPropValues);

      var containerComponentString = '\n      import React from \'react\'\n      import ReactDOM from \'react-dom\'\n  \n      import transpiledReactComponent from \'' + activeComponentFilepath + '\'\n\n      window.componentInstance = ReactDOM.render(\n        React.createElement(transpiledReactComponent, ' + componentPropValues + '),\n        document.getElementById(\'component-preview\')\n      )\n      ';

      fs.writeFileSync(path.resolve(__dirname, 'containerComponent.js'), containerComponentString);

      // Container for the react component
      var componentPreviewElement = document.getElementById('component-preview');

      // Destroy the existing rendered app if there is any
      if (window.componentInstance) {
        _reactDom2.default.unmountComponentAtNode(document.getElementById('component-preview'));
      }

      // Clear the node require cache and reload the file
      var oldScript = document.getElementById('component-preview-script');
      if (oldScript) oldScript.remove();

      var script = window.document.createElement('script');
      script.type = 'text/javascript';
      script.id = 'component-preview-script';
      script.async = true;
      script.src = path.resolve(app.getPath('temp'), 'bundle.js');
      script.onload = function () {
        // remote script has loaded
      };
      window.document.getElementsByTagName('head')[0].appendChild(script);
      this.setState({ isRendering: false });

      if (basePathForImages) {
        $('#component-preview').find('img').each(function () {
          var imgSrc = $(this).attr('src');
          if (!imgSrc) return;
          var newImgSrc = path.join(basePathForImages, imgSrc);
          $(this).attr('src', newImgSrc);
        });
      }

      this.setState({
        isRendering: false
      });

      console.log('Stop Rendering');
    }
  }, {
    key: 'handleSetState',
    value: function handleSetState(newState, cb) {
      var _this4 = this;

      this.setState((0, _extends3.default)({}, newState), function () {
        _this4.debouncedCompileWebpack();
        localStorage.setItem('state', (0, _stringify2.default)({
          activeComponentFilepath: _this4.state.activeComponentFilepath,
          includedCssUrl: _this4.state.includedCssUrl,
          basePathForImages: _this4.state.basePathForImages,
          propertySeeds: _this4.state.propertySeeds
        }));
        cb && cb();
      });
    }
  }, {
    key: 'handleOpenComponentOpenDialog',
    value: function handleOpenComponentOpenDialog() {
      var openedFilepath = dialog.showOpenDialog({
        properties: ['openFile']
      });
      if (!openedFilepath) return;

      this.handleSetState({
        activeComponentFilepath: openedFilepath[0]
      });
      this.restartWebpackWatch();
    }
  }, {
    key: 'handleIncludedCssUrlChange',
    value: function handleIncludedCssUrlChange() {
      var _this5 = this;

      var _state3 = this.state,
          includedCssUrl = _state3.includedCssUrl,
          basePathForImages = _state3.basePathForImages;


      if (!includedCssUrl) {
        return;
      }

      console.log('Compiling CSS');

      request.get(includedCssUrl, function (error, response, body) {
        if (error || response.statusCode !== 200) {
          console.error(error);
          return;
        }

        var encapsulatedCss = '#component-preview{' + body + '}';

        Sass.compile(encapsulatedCss, function (result) {
          var css = result.text;
          if (basePathForImages) {
            var matches = css.match(/(\/.*?\.\w{3})/gim);
            matches.forEach(function (match) {
              try {
                css = css.replace(new RegExp(match, 'g'), path.join(basePathForImages, match));
              } catch (e) {
                console.error('Could not match', match);
              }
            });
          }

          $('#component-styles').html(css);
          _this5.debouncedCompileWebpack();
        });
      });
    }
  }, {
    key: 'handleAddPropertySeed',
    value: function handleAddPropertySeed() {
      var newPropertySeeds = [{
        id: Date.now()
      }].concat((0, _toConsumableArray3.default)(_.get(this.state, 'propertySeeds', [])));

      this.handleSetState({
        propertySeeds: newPropertySeeds
      });
    }
  }, {
    key: 'handleSetPropertySeed',
    value: function handleSetPropertySeed(e, key, propName) {
      var newPropertySeeds = [].concat((0, _toConsumableArray3.default)(_.get(this.state, 'propertySeeds', [])));
      _.set(newPropertySeeds, '[' + key + '][' + propName + ']', e.target.value);

      this.handleSetState({
        propertySeeds: newPropertySeeds
      });
    }
  }, {
    key: 'handleRemovePropertySeed',
    value: function handleRemovePropertySeed(key) {
      var propertySeeds = this.state.propertySeeds;


      var newPropertySeeds = propertySeeds.filter(function (propertySeed, index) {
        return key !== index;
      });

      this.handleSetState({
        propertySeeds: newPropertySeeds
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _state4 = this.state,
          imports = _state4.imports,
          activeComponentFilepath = _state4.activeComponentFilepath,
          includedCssUrl = _state4.includedCssUrl,
          basePathForImages = _state4.basePathForImages,
          isRendering = _state4.isRendering,
          propertySeeds = _state4.propertySeeds;


      var componentBasename = activeComponentFilepath ? path.basename(activeComponentFilepath) : '';

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'div',
          { className: 'pane draggable-region' },
          _react2.default.createElement(
            'div',
            { className: 'pane-header', style: { paddingLeft: '80px' } },
            componentBasename,
            isRendering && _react2.default.createElement('i', { className: 'fa fa-refresh fa-spin ml1' })
          )
        ),
        _react2.default.createElement(_SidebarPane2.default, {
          basePathForImages: basePathForImages,
          includedCssUrl: includedCssUrl,
          onAddPropertySeed: this.handleAddPropertySeed,
          onIncludedCssUrlChange: this.handleIncludedCssUrlChange,
          onOpenComponentOpenDialog: this.handleOpenComponentOpenDialog,
          onRemovePropertySeed: this.handleRemovePropertySeed,
          onSetPropertySeed: this.handleSetPropertySeed,
          onSetState: this.handleSetState,
          propertySeeds: propertySeeds
        }),
        _react2.default.createElement(_PreviewPane2.default, null)
      );
    }
  }]);
  return App;
}(_react2.default.Component);

exports.default = App;


_reactDom2.default.render(_react2.default.createElement(App, null), document.getElementById('app'));