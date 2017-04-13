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

var _Header = require('./Header');

var _Header2 = _interopRequireDefault(_Header);

var _ComponentsPane = require('./ComponentsPane');

var _ComponentsPane2 = _interopRequireDefault(_ComponentsPane);

var _EditorPane = require('./EditorPane');

var _EditorPane2 = _interopRequireDefault(_EditorPane);

var _PreviewPane = require('./PreviewPane');

var _PreviewPane2 = _interopRequireDefault(_PreviewPane);

var _getSharedStartingString = require('./lib/getSharedStartingString');

var _getSharedStartingString2 = _interopRequireDefault(_getSharedStartingString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Sass = require('sass.js');
var _ = require('lodash');
var getImportStrings = require('./lib/getImportStrings');
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

    _this.state = {
      basePathForImages: window.localStorage.getItem('basePathForImages'),
      activeactiveComponentFilepath: null,
      activeDirectory: window.localStorage.getItem('activeDirectory'),
      cachedDirectoryImports: cachedDirectoryImports,
      componentFilepaths: [],
      componentString: null,
      activeComponentFilepathContents: [],
      componentInstance: null,
      editor: null,
      includedCss: window.localStorage.getItem('includedCss'),
      propertySeeds: [],
      renderComponentString: null
    };

    _this.debouncedRenderComponent = _.debounce(_this.renderComponent, 300);
    return _this;
  }

  (0, _createClass3.default)(App, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this2 = this;

      var activeDirectory = this.state.activeDirectory;


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
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.handleIncludedCssChange();
      this.debouncedRenderComponent();
    }
  }, {
    key: 'handleCreateEditor',
    value: function handleCreateEditor(editor) {
      var _this3 = this;

      this.setState({ editor: editor });
      editor.on('change', function (e) {
        _this3.debouncedRenderComponent();
      });
    }
  }, {
    key: 'handleSaveComponent',
    value: function handleSaveComponent() {
      var _state = this.state,
          activeComponentFilepath = _state.activeComponentFilepath,
          editor = _state.editor;


      var componentString = editor.getValue();

      if (!activeComponentFilepath) {
        var newFilepath = dialog.showSaveDialog();

        if (!newFilepath) return;
        this.setState({
          activeComponentFilepath: newFilepath[0]
        });

        return fs.writeFile(newFilepath[0], componentString);
      }

      fs.writeFile(activeComponentFilepath, componentString);
    }
  }, {
    key: 'handleOpenDirectory',
    value: function handleOpenDirectory(newActiveDirectory) {
      var _this4 = this;

      this.handleSetActiveDirectory(newActiveDirectory);
      recursive(newActiveDirectory, function (err, files) {
        // Files is an array of filename
        var stringSegmentToBeRemoved = (0, _getSharedStartingString2.default)(files);
        var newComponentFilepaths = [];

        files.forEach(function (filepath) {
          if (!filepath.match(/(\.js|\.jsx)/g)) return;

          var uniqueFilepath = filepath.replace(stringSegmentToBeRemoved, '');
          var filename = path.basename(filepath);

          newComponentFilepaths.push({
            filename: filename,
            uniqueFilepath: uniqueFilepath,
            filepath: filepath
          });
        });

        _this4.handleSetComponentFilepaths(newComponentFilepaths);
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
      var _this5 = this;

      var _state2 = this.state,
          activeDirectory = _state2.activeDirectory,
          editor = _state2.editor,
          cachedDirectoryImports = _state2.cachedDirectoryImports;


      var filename = path.basename(filepath);
      var contents = fs.readFileSync(filepath, { encoding: 'utf-8' });

      editor.setValue(contents);

      this.setState({
        activeComponentFilepath: filepath
      });

      var importStrings = getImportStrings(contents);
      importStrings.forEach(function (importString) {
        if (cachedDirectoryImports[activeDirectory] && cachedDirectoryImports[activeDirectory][importString]) return;

        console.log(importString);

        var selectedFilepath = dialog.showOpenDialog({
          properties: ['openFile', 'openDirectory']
        });
        if (!selectedFilepath) return;

        _this5.handleAddCachedDirectoryImports(activeDirectory, importString, selectedFilepath[0]);
      });

      this.debouncedRenderComponent();
    }
  }, {
    key: 'renderComponent',
    value: function renderComponent() {
      var _state3 = this.state,
          editor = _state3.editor,
          basePathForImages = _state3.basePathForImages,
          activeDirectory = _state3.activeDirectory,
          cachedDirectoryImports = _state3.cachedDirectoryImports,
          componentInstance = _state3.componentInstance;


      var renderComponentString = editor.getValue();

      if (!renderComponentString) return;

      this.setState({ componentString: renderComponentString });

      try {
        (0, _keys2.default)(_.get(cachedDirectoryImports, '[' + activeDirectory + ']', {})).forEach(function (key) {
          var newImportString = replaceFromWithPath(key, _.get(cachedDirectoryImports, '[' + activeDirectory + '][' + key + ']'));
          renderComponentString = renderComponentString.replace(key, newImportString);
        });

        var babelResult = babel.transform(renderComponentString, {
          presets: ['latest', 'react'],
          plugins: ['transform-class-properties', 'transform-es2015-classes', 'transform-runtime', 'transform-object-rest-spread']
        });

        fs.writeFileSync('temp-component.js', babelResult.code);

        // Clear the node require cache and reload the file
        delete require.cache[require.resolve('../../../temp-component.js')];
        var transpiledReactComponent = require('../../../temp-component.js').default;

        // Container for the react component
        var componentPreviewElement = document.getElementById('component-preview');

        if (componentInstance) {
          _reactDom2.default.unmountComponentAtNode(document.getElementById('component-preview'));
        }

        // Get seed data for properties if there is any
        var componentPropValues = {};
        $('.component-properties-seed-data-container .pane-row').each(function (el) {
          var key = $(this).find('div:first-child input').val();
          var value = $(this).find('div:nth-child(2) textarea').val();
          if (value.length === 0) return;
          componentPropValues[key] = eval('(' + value + ')'); // eslint-disable-line
        });

        this.setState({
          componentInstance: _reactDom2.default.render(_react2.default.createElement(transpiledReactComponent, componentPropValues), componentPreviewElement)
        });

        $('#component-preview').find('img').each(function () {
          var imgSrc = $(this).attr('src');
          var newImgSrc = path.join(basePathForImages, imgSrc);
          $(this).attr('src', newImgSrc);
        });
      } catch (e) {
        console.error(e);
      }
    }
  }, {
    key: 'handleAddCachedDirectoryImports',
    value: function handleAddCachedDirectoryImports(activeDirectory, importString, newFilepath) {
      var cachedDirectoryImports = this.state.cachedDirectoryImports;


      var newCachedDirectoryImports = (0, _extends3.default)({}, cachedDirectoryImports);
      _.set(newCachedDirectoryImports, '[' + activeDirectory + '][' + importString + ']', newFilepath);

      this.setState({
        cachedDirectoryImports: newCachedDirectoryImports
      });

      window.localStorage.setItem('cachedDirectoryImports', (0, _stringify2.default)(newCachedDirectoryImports));
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
      var _this6 = this;

      this.setState({
        basePathForImages: e.currentTarget.value
      }, function () {
        window.localStorage.setItem('basePathForImages', _this6.state.basePathForImages);
        _this6.handleIncludedCssChange();
        _this6.debouncedRenderComponent();
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
        _this7.debouncedRenderComponent();
      });
    }
  }, {
    key: 'handleIncludedCssChange',
    value: function handleIncludedCssChange() {
      var _this8 = this;

      var _state4 = this.state,
          includedCss = _state4.includedCss,
          basePathForImages = _state4.basePathForImages;


      request.get(includedCss, function (error, response, body) {
        if (!error && response.statusCode == 200) {
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
            _this8.debouncedRenderComponent();
          });
        }
      });
    }
  }, {
    key: 'handleAddPropertySeed',
    value: function handleAddPropertySeed() {
      var propertySeeds = this.state.propertySeeds;


      this.setState({
        propertySeeds: [{}].concat((0, _toConsumableArray3.default)(propertySeeds))
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _state5 = this.state,
          componentFilepaths = _state5.componentFilepaths,
          activeComponentFilepath = _state5.activeComponentFilepath,
          propertySeeds = _state5.propertySeeds;


      var componentFilepath = _.first(componentFilepaths.filter(function (componentFilepath) {
        return componentFilepath.filepath === activeComponentFilepath;
      }));

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_Header2.default, {
          onOpenComponentOrDirectory: this.handleOpenComponentOrDirectory
        }),
        _react2.default.createElement(_ComponentsPane2.default, {
          onOpenComponent: this.handleOpenComponent,
          onOpenComponentOrDirectory: this.handleOpenComponentOrDirectory,
          componentFilepaths: componentFilepaths
        }),
        _react2.default.createElement(_EditorPane2.default, {
          onCreateEditor: this.handleCreateEditor,
          componentFilepath: componentFilepath
        }),
        _react2.default.createElement(_PreviewPane2.default, {
          onSetBasePathForImages: this.handleSetBasePathForImages,
          onSetIncludedCss: this.handleSetIncludedCss,
          onAddPropertySeed: this.handleAddPropertySeed,
          propertySeeds: propertySeeds
        })
      );
    }
  }]);
  return App;
}(_react2.default.Component);

exports.default = App;