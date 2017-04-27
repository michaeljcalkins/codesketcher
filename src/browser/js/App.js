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

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

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

    var cachedDirectoryImports = null;
    try {
      cachedDirectoryImports = JSON.parse(window.localStorage.getItem('cachedDirectoryImports'));
    } catch (e) {
      cachedDirectoryImports = {};
    }

    var propertySeeds = null;
    try {
      propertySeeds = window.localStorage.getItem('propertySeeds') ? JSON.parse(window.localStorage.getItem('propertySeeds')) : [];
    } catch (e) {
      propertySeeds = [];
    }

    _this.state = {
      activeComponentContents: null,
      activeComponentFilepath: window.localStorage.getItem('activeComponentFilepath'),
      activeComponentFilepathContents: [],
      activeDirectory: window.localStorage.getItem('activeDirectory'),
      basePathForImages: window.localStorage.getItem('basePathForImages'),
      cachedDirectoryImports: cachedDirectoryImports,
      componentFilepaths: [],
      componentInstance: null,
      filesInActiveDirectory: [],
      includedCss: window.localStorage.getItem('includedCss'),
      isRendering: false,
      propertySeeds: propertySeeds,
      renderComponentString: null,
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

      Mousetrap.bind('command+s', function () {
        _this2.handleSaveComponent();
      });

      Mousetrap.bind('command+o', function () {
        _this2.handleOpenComponentOrDirectory();
      });

      Mousetrap.bind('command+n', function () {
        _this2.handleNewComponent();
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
    key: 'handleOpenDirectory',
    value: function handleOpenDirectory(newActiveDirectory) {
      var _this3 = this;

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

        if (_this3.state.watcher) {
          _this3.state.watcher.close();
        }

        _this3.setState({
          watcher: _chokidar2.default.watch(newActiveDirectory, {
            ignored: /(^|[/\\])\../,
            persistent: true
          }).on('add', function (path) {
            if (_this3.state.filesInActiveDirectory.indexOf(path) === -1) {
              _this3.setState({
                filesInActiveDirectory: filesInActiveDirectory
              });
              _this3.handleOpenDirectory(newActiveDirectory);
            }
          }).on('change', function (path) {
            _this3.debouncedRenderComponent();
          }).on('unlink', function (path) {
            if (_this3.state.filesInActiveDirectory.indexOf(path) > -1) {
              _this3.setState({
                filesInActiveDirectory: filesInActiveDirectory
              });
              _this3.handleOpenDirectory(newActiveDirectory);
            }
          })
        });

        _this3.handleSetComponentFilepaths(newComponentFilepaths);
      });
    }
  }, {
    key: 'handleOpenComponentOrDirectory',
    value: function handleOpenComponentOrDirectory() {
      var openedFilepath = dialog.showOpenDialog({
        properties: ['openFile', 'openDirectory']
      });
      if (!openedFilepath) return;

      if (!openedFilepath[0].match(/(\.js)/)) {
        this.handleOpenDirectory(openedFilepath[0]);
        return;
      }

      this.handleOpenComponent(openedFilepath[0]);
    }
  }, {
    key: 'handleOpenComponent',
    value: function handleOpenComponent(filepath) {
      var contents = fs.readFileSync(filepath, { encoding: 'utf-8' });

      window.localStorage.setItem('activeComponentFilepath', filepath);

      this.setState({
        activeComponentFilepath: filepath,
        activeComponentContents: contents
      });

      this.debouncedRenderComponent();
    }
  }, {
    key: 'handleFindAndAddImports',
    value: function handleFindAndAddImports(filepath, contents) {
      var _this4 = this;

      var _state2 = this.state,
          activeDirectory = _state2.activeDirectory,
          cachedDirectoryImports = _state2.cachedDirectoryImports;


      if (!contents) {
        contents = fs.readFileSync(filepath);
      }

      var importStrings = (0, _getImportStrings2.default)(contents);

      importStrings.forEach(function (importString) {
        var componentDirname = path.dirname(filepath);
        if (_.has(cachedDirectoryImports, '[' + activeDirectory + '][' + importString + ']')) return;

        console.log('Attempting to import:', importString);

        var usedPotentialLocation = false;

        var importFragments = importString.split(' from ');
        var fromFragment = _.get(importFragments, '[1]').replace(/'/g, '').trim();

        // Location of imported file relative to the location of the active component's location.
        var potentialImportLocation = path.join(componentDirname, fromFragment + '.js');

        var importLocation = null;

        // Transpile the file if found relatively to the active component
        try {
          if (fs.lstatSync(potentialImportLocation).isFile() || fs.lstatSync(potentialImportLocation).isDirectory()) {
            importLocation = potentialImportLocation;
            usedPotentialLocation = true;
          }
        } catch (e) {}

        // Ask the user for the location of the file/dir and transpile that
        if (!usedPotentialLocation) {
          var selectedFilepath = dialog.showOpenDialog({
            properties: ['openFile', 'openDirectory']
          });
          if (!_.has(selectedFilepath, '[0]')) return;
          importLocation = _.get(selectedFilepath, '[0]');
        }

        if (!importLocation) return;

        var cachedFilePath = _this4.handleAddCachedDirectoryImports(activeDirectory, importString, importLocation);

        try {
          // require(cachedFilePath)
        } catch (e) {
          // this.handleFindAndAddImports(importLocation)
          console.error('Attempted require failed', cachedFilePath, e);
        }
      });
    }
  }, {
    key: 'handleReplaceRelativeImports',
    value: function handleReplaceRelativeImports(contents) {
      var _state3 = this.state,
          activeDirectory = _state3.activeDirectory,
          cachedDirectoryImports = _state3.cachedDirectoryImports;


      (0, _keys2.default)(_.get(cachedDirectoryImports, '[' + activeDirectory + ']', {})).forEach(function (key) {
        var newImportString = replaceFromWithPath(key, cachedDirectoryImports[activeDirectory][key]);
        contents = contents.replace(key, newImportString);
      });

      return contents;
    }
  }, {
    key: 'renderComponent',
    value: function renderComponent() {
      var _state4 = this.state,
          basePathForImages = _state4.basePathForImages,
          activeComponentFilepath = _state4.activeComponentFilepath,
          propertySeeds = _state4.propertySeeds,
          componentInstance = _state4.componentInstance;


      if (!activeComponentFilepath) return;

      var renderComponentString = fs.readFileSync(activeComponentFilepath, { encoding: 'utf-8' });

      if (!renderComponentString) return console.error(renderComponentString);

      this.setState({ isRendering: true });
      try {
        this.handleFindAndAddImports(activeComponentFilepath, renderComponentString);
        renderComponentString = this.handleReplaceRelativeImports(renderComponentString);

        // Find all imports
        var importStrings = (0, _getImportStrings2.default)(renderComponentString);

        // Loop through them
        importStrings.forEach(function (importString) {
          // if not node_modules transpile them and cache them
          if (importString.match('node_modules')) return;

          var importFragments = importString.split(' from ');
          var fromFragment = importFragments[1].replace(/'/g, '').trim();
          var newFromFragment = fromFragment.replace(/\//g, '-');
          var importedComponentString = fs.readFileSync(fromFragment);

          // Replace import in renderComponentString with path to cached file
          var babelResult = babel.transform(importedComponentString, {
            presets: ['latest', 'react'],
            plugins: ['transform-class-properties', 'transform-es2015-classes', 'transform-runtime', 'transform-object-rest-spread']
          });

          fs.writeFileSync('storage/components/' + newFromFragment, babelResult.code);

          var normalizedNewFromFragment = path.join(__dirname, '/../../../storage/components/', newFromFragment);
          delete require.cache[require.resolve(normalizedNewFromFragment)];
          renderComponentString = renderComponentString.replace(fromFragment, normalizedNewFromFragment);
        });

        // console.log(renderComponentString)

        var babelResult = babel.transform(renderComponentString, {
          presets: ['latest', 'react'],
          plugins: ['transform-class-properties', 'transform-es2015-classes', 'transform-runtime', 'transform-object-rest-spread']
        });

        fs.writeFileSync('storage/app/temp-component.js', babelResult.code);

        // Clear the node require cache and reload the file
        var tempComponentFilepath = '../../../storage/app/temp-component.js';
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
    key: 'handleAddCachedDirectoryImports',
    value: function handleAddCachedDirectoryImports(activeDirectory, importString, newFilepath) {
      var cachedDirectoryImports = this.state.cachedDirectoryImports;


      if (!newFilepath) {
        return console.error('newFilepath is required when caching directory imports.');
      }

      var newCachedDirectoryImports = (0, _extends3.default)({}, cachedDirectoryImports);
      newCachedDirectoryImports[activeDirectory] = newCachedDirectoryImports[activeDirectory] || {};
      newCachedDirectoryImports[activeDirectory][importString] = newFilepath;

      this.setState({
        cachedDirectoryImports: newCachedDirectoryImports
      });

      window.localStorage.setItem('cachedDirectoryImports', (0, _stringify2.default)(newCachedDirectoryImports));

      return newFilepath;
    }
  }, {
    key: 'handleSetActiveDirectory',
    value: function handleSetActiveDirectory(newActiveDirectory) {
      window.localStorage.setItem('activeDirectory', newActiveDirectory);
      this.setState({ activeDirectory: newActiveDirectory });
    }
  }, {
    key: 'handleSetComponentFilepaths',
    value: function handleSetComponentFilepaths(componentFilepaths) {
      this.setState({ componentFilepaths: componentFilepaths });
    }
  }, {
    key: 'handleSetBasePathForImages',
    value: function handleSetBasePathForImages(e) {
      var _this5 = this;

      this.setState({
        basePathForImages: e.currentTarget.value
      }, function () {
        window.localStorage.setItem('basePathForImages', _this5.state.basePathForImages);
        _this5.handleIncludedCssChange();
      });
    }
  }, {
    key: 'handleSetIncludedCss',
    value: function handleSetIncludedCss(e) {
      var _this6 = this;

      this.setState({
        includedCss: e.currentTarget.value
      }, function () {
        window.localStorage.setItem('includedCss', _this6.state.includedCss);
        _this6.handleIncludedCssChange();
      });
    }
  }, {
    key: 'handleIncludedCssChange',
    value: function handleIncludedCssChange() {
      var _this7 = this;

      var _state5 = this.state,
          includedCss = _state5.includedCss,
          basePathForImages = _state5.basePathForImages;


      if (!includedCss) return;

      request.get(includedCss, function (error, response, body) {
        if (error || response.statusCode !== 200) {
          console.error(error);
          return;
        }

        var encapsulatedCss = '#component-preview{' + body + '}';

        Sass.compile(encapsulatedCss, function (result) {
          var css = result.text;
          if (basePathForImages) {
            var matches = css.match(/(\/.*?\.\w{3})/img);
            matches.forEach(function (match) {
              try {
                css = css.replace(new RegExp(match, 'g'), path.join(basePathForImages, match));
              } catch (e) {
                console.error('Could not match', match);
              }
            });
          }

          $('#component-styles').html(css);
          _this7.debouncedRenderComponent();
        });
      });
    }
  }, {
    key: 'handleAddPropertySeed',
    value: function handleAddPropertySeed() {
      var _this8 = this;

      var propertySeeds = this.state.propertySeeds;


      var newPropertySeeds = [{
        id: Date.now()
      }].concat((0, _toConsumableArray3.default)(propertySeeds));

      window.localStorage.setItem('propertySeeds', (0, _stringify2.default)(newPropertySeeds));

      this.setState({
        propertySeeds: newPropertySeeds
      }, function () {
        return _this8.debouncedRenderComponent();
      });
    }
  }, {
    key: 'handleSetPropertySeed',
    value: function handleSetPropertySeed(e, key, propName) {
      var _this9 = this;

      var propertySeeds = this.state.propertySeeds;


      var newPropertySeeds = [].concat((0, _toConsumableArray3.default)(propertySeeds));
      _.set(newPropertySeeds, '[' + key + '][' + propName + ']', e.target.value);

      window.localStorage.setItem('propertySeeds', (0, _stringify2.default)(newPropertySeeds));

      this.setState({
        propertySeeds: newPropertySeeds
      }, function () {
        return _this9.debouncedRenderComponent();
      });
    }
  }, {
    key: 'handleRemovePropertySeed',
    value: function handleRemovePropertySeed(key) {
      var _this10 = this;

      var propertySeeds = this.state.propertySeeds;


      var newPropertySeeds = propertySeeds.filter(function (propertySeed, index) {
        return key !== index;
      });

      this.setState({
        propertySeeds: newPropertySeeds
      }, function () {
        return _this10.debouncedRenderComponent();
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _state6 = this.state,
          activeComponentFilepath = _state6.activeComponentFilepath,
          componentFilepaths = _state6.componentFilepaths,
          isRendering = _state6.isRendering,
          propertySeeds = _state6.propertySeeds;


      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'div',
          { className: 'pane pane-components' },
          _react2.default.createElement(_ComponentsPane2.default, {
            activeComponentFilepath: activeComponentFilepath,
            onOpenComponent: this.handleOpenComponent,
            onOpenComponentOrDirectory: this.handleOpenComponentOrDirectory,
            componentFilepaths: componentFilepaths
          })
        ),
        _react2.default.createElement(
          'div',
          { className: 'pane pane-preview' },
          _react2.default.createElement(_PreviewPane2.default, {
            onAddPropertySeed: this.handleAddPropertySeed,
            onRemovePropertySeed: this.handleRemovePropertySeed,
            onSetPropertySeed: this.handleSetPropertySeed,
            activeComponentFilepath: activeComponentFilepath,
            propertySeeds: propertySeeds,
            isRendering: isRendering
          })
        ),
        _react2.default.createElement(
          'div',
          { className: 'modal fade in', id: 'settings-modal' },
          _react2.default.createElement(
            'div',
            { className: 'modal-dialog' },
            _react2.default.createElement(_SettingsModal2.default, {
              onSetBasePathForImages: this.handleSetBasePathForImages,
              onSetIncludedCss: this.handleSetIncludedCss
            })
          )
        )
      );
    }
  }]);
  return App;
}(_react2.default.Component);

exports.default = App;