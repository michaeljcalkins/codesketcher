'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

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

var _ImportsPane = require('./ImportsPane');

var _ImportsPane2 = _interopRequireDefault(_ImportsPane);

var _SettingsModal = require('./SettingsModal');

var _SettingsModal2 = _interopRequireDefault(_SettingsModal);

var _getSharedStartingString = require('./lib/getSharedStartingString');

var _getSharedStartingString2 = _interopRequireDefault(_getSharedStartingString);

var _getImportStrings = require('./lib/getImportStrings');

var _getImportStrings2 = _interopRequireDefault(_getImportStrings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Sass = require('sass.js');
var _ = require('lodash');
var replaceFromWithPath = require('./lib/replaceFromWithPath');
var recursive = require('recursive-readdir');
var fs = require('fs');
var path = require('path');
var babel = require('babel-core');
var dialog = require('electron').remote.dialog;
var request = require('request');

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

    console.log(cachedState);

    _this.state = cachedState ? cachedState : {
      activeComponentFilepath: null,
      basePathForImages: null,
      cachedDirectoryImports: cachedDirectoryImports,
      componentFilepaths: [],
      componentInstance: null,
      imports: [],
      includedCss: null,
      isRendering: false,
      propertySeeds: propertySeeds,
      watcher: null
    };

    _this.debouncedRenderComponent = _.debounce(_this.renderComponent, 500);
    return _this;
  }

  (0, _createClass3.default)(App, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this2 = this;

      var _state = this.state,
          activeDirectory = _state.activeDirectory,
          activeComponentFilepath = _state.activeComponentFilepath;


      try {
        if (fs.lstatSync(activeDirectory).isDirectory()) this.handleOpenDirectory(activeDirectory);
      } catch (e) {}

      Mousetrap.bind('command+o', function () {
        _this2.handleOpenComponentOpenDialog();
      });

      if (activeComponentFilepath) {
        this.debouncedRenderComponent();
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.handleIncludedCssChange();
      this.debouncedRenderComponent();
    }
  }, {
    key: 'handleSetState',
    value: function handleSetState(newState) {
      var _this3 = this;

      this.setState((0, _extends3.default)({}, newState), function () {
        localStorage.setItem('state', (0, _stringify2.default)(_this3.state));
        _this3.debouncedRenderComponent();
      });
    }
  }, {
    key: 'handleOpenDirectory',
    value: function handleOpenDirectory(newActiveDirectory) {
      var _this4 = this;

      this.handleSetActiveDirectory(newActiveDirectory);
      recursive(newActiveDirectory, function (err, files) {
        if (err) return console.error(err);

        // Files is an array of filename
        var stringSegmentToBeRemoved = (0, _getSharedStartingString2.default)(files);
        var newComponentFilepaths = [];
        var filesInActiveDirectory = [];

        files.forEach(function (filepath) {
          if (!filepath.match(/(\.js|\.jsx)/g)) return;

          var uniqueFilepath = filepath.replace(stringSegmentToBeRemoved, '');
          var filename = path.basename(filepath);
          filesInActiveDirectory.push(filepath);

          newComponentFilepaths.push({
            filename: filename,
            uniqueFilepath: uniqueFilepath,
            filepath: filepath
          });
        });

        if (_this4.state.watcher) {
          _this4.state.watcher.close();
        }

        _this4.setState({
          watcher: _chokidar2.default.watch(newActiveDirectory, {
            ignored: /(^|[/\\])\../,
            persistent: true
          }).on('add', function (path) {
            if (_this4.state.filesInActiveDirectory.indexOf(path) === -1) {
              _this4.setState({
                filesInActiveDirectory: filesInActiveDirectory
              });
              _this4.handleOpenDirectory(newActiveDirectory);
            }
          }).on('change', function (path) {
            _this4.debouncedRenderComponent();
          }).on('unlink', function (path) {
            if (_this4.state.filesInActiveDirectory.indexOf(path) > -1) {
              _this4.setState({
                filesInActiveDirectory: filesInActiveDirectory
              });
              _this4.handleOpenDirectory(newActiveDirectory);
            }
          })
        });

        _this4.handleSetComponentFilepaths(newComponentFilepaths);
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
    }
  }, {
    key: 'renderComponent',
    value: function renderComponent() {
      var _this5 = this;

      var _state2 = this.state,
          basePathForImages = _state2.basePathForImages,
          activeComponentFilepath = _state2.activeComponentFilepath,
          propertySeeds = _state2.propertySeeds,
          componentInstance = _state2.componentInstance;


      if (!activeComponentFilepath) return;

      this.setState({ isRendering: true });

      var webpack = require('webpack');

      var compiler = webpack({
        // Configuration Object
        entry: activeComponentFilepath,
        output: {
          filename: 'bundle.js',
          path: path.resolve(__dirname, 'cache')
        },
        module: {
          rules: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['latest', 'react', 'env'],
                plugins: [require('babel-plugin-transform-object-rest-spread')]
              }
            }
          }]
        }
      }, function (err, stats) {
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

        // Log result...
      });

      compiler.run(function (err, stats) {
        console.log(stats);
        _this5.setState({ isRendering: false });
      });

      return;

      try {
        console.log(importStrings);

        // Loop through them
        // importStrings.forEach(importString => {
        //   // if not node_modules transpile them and cache them
        //   if (importString.match('node_modules')) return

        //   let importFragments = importString.split(' from ')
        //   let fromFragment = importFragments[1].replace(/'/g, '').trim()
        //   let newFromFragment = fromFragment.replace(/\//g, '-')
        //   let importedComponentString = fs.readFileSync(fromFragment)

        //   // Replace import in renderComponentString with path to cached file
        //   let babelResult = babel.transform(importedComponentString, {
        //     presets: ['latest', 'react'],
        //     plugins: [
        //       'transform-class-properties',
        //       'transform-es2015-classes',
        //       'transform-runtime',
        //       'transform-object-rest-spread'
        //     ]
        //   })

        //   fs.writeFileSync('storage/components/' + newFromFragment, babelResult.code)

        //   const normalizedNewFromFragment = path.join(__dirname, '/../../storage/components/', newFromFragment)
        //   delete require.cache[require.resolve(normalizedNewFromFragment)]
        //   renderComponentString = renderComponentString.replace(fromFragment, normalizedNewFromFragment)
        // })

        return;

        // console.log(renderComponentString)

        var babelResult = babel.transform(renderComponentString, {
          presets: ['latest', 'react'],
          plugins: ['transform-class-properties', 'transform-es2015-classes', 'transform-runtime', 'transform-object-rest-spread']
        });

        fs.writeFileSync('storage/app/temp-component.js', babelResult.code);

        // Clear the node require cache and reload the file
        var tempComponentFilepath = '../../storage/app/temp-component.js';
        delete require.cache[require.resolve(tempComponentFilepath)];
        var transpiledReactComponent = require(tempComponentFilepath).default;

        // Container for the react component
        var componentPreviewElement = document.getElementById('component-preview');

        if (componentInstance) {
          _reactDom2.default.unmountComponentAtNode(document.getElementById('component-preview'));
        }

        // Get seed data for properties if there is any
        var componentPropValues = {};
        if (propertySeeds) {
          propertySeeds.forEach(function (propertySeed) {
            if (!propertySeed.value || propertySeed.value.length === 0) return;
            componentPropValues[propertySeed.key] = eval('(' + propertySeed.value + ')'); // eslint-disable-line
          });
        }

        this.setState({
          componentInstance: _reactDom2.default.render(_react2.default.createElement(transpiledReactComponent, componentPropValues), componentPreviewElement)
        });

        if (basePathForImages) {
          $('#component-preview').find('img').each(function () {
            var imgSrc = $(this).attr('src');
            if (!imgSrc) return;
            var newImgSrc = path.join(basePathForImages, imgSrc);
            $(this).attr('src', newImgSrc);
          });
        }

        this.setState({ isRendering: false });
      } catch (e) {
        this.setState({ isRendering: false });
        console.error(e);
      }
    }
  }, {
    key: 'handleSetBasePathForImages',
    value: function handleSetBasePathForImages(e) {
      var _this6 = this;

      this.setState({
        basePathForImages: e.currentTarget.value
      }, function () {
        window.localStorage.setItem('basePathForImages', _this6.state.basePathForImages);
        _this6.handleIncludedCssChange();
      });
    }
  }, {
    key: 'handleSetIncludedCss',
    value: function handleSetIncludedCss(e) {
      var _this7 = this;

      this.setState({
        includedCss: e.currentTarget.value
      }, function () {
        window.localStorage.setItem('includedCss', _this7.state.includedCss);
        _this7.handleIncludedCssChange();
      });
    }
  }, {
    key: 'handleIncludedCssChange',
    value: function handleIncludedCssChange() {
      var _this8 = this;

      var _state3 = this.state,
          includedCss = _state3.includedCss,
          basePathForImages = _state3.basePathForImages;


      if (!includedCss) {
        this.debouncedRenderComponent();
        return;
      }

      request.get(includedCss, function (error, response, body) {
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
          _this8.debouncedRenderComponent();
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
          componentFilepaths = _state4.componentFilepaths,
          isRendering = _state4.isRendering,
          propertySeeds = _state4.propertySeeds;


      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'div',
          { className: 'pane pane-components' },
          _react2.default.createElement(_ImportsPane2.default, {
            handleSetState: this.handleSetState,
            imports: imports,
            onAddPropertySeed: this.handleAddPropertySeed,
            onRemovePropertySeed: this.handleRemovePropertySeed,
            onSetPropertySeed: this.handleSetPropertySeed,
            propertySeeds: propertySeeds,
            onSetBasePathForImages: this.handleSetBasePathForImages,
            onSetIncludedCss: this.handleSetIncludedCss,
            handleOpenComponentOpenDialog: this.handleOpenComponentOpenDialog,
            handleOpenComponent: this.handleOpenComponent
          })
        ),
        _react2.default.createElement(
          'div',
          { className: 'pane pane-preview' },
          _react2.default.createElement(_PreviewPane2.default, { activeComponentFilepath: activeComponentFilepath, isRendering: isRendering })
        )
      );
    }
  }]);
  return App;
}(_react2.default.Component);

exports.default = App;


_reactDom2.default.render(_react2.default.createElement(App, null), document.getElementById('app'));