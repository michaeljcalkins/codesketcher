import React from 'react'
import ReactDOM from 'react-dom'
import autobind from 'react-autobind'
import chokidar from 'chokidar'

var Sass = require('sass.js')
var _ = require('lodash')
var replaceFromWithPath = require('./lib/replaceFromWithPath')
var recursive = require('recursive-readdir')
var fs = require('fs')
var path = require('path')
var babel = require('babel-core')
var dialog = require('electron').remote.dialog
var request = require('request')

import ComponentsPane from './ComponentsPane'
import PreviewPane from './PreviewPane'
import ImportsPane from './ImportsPane'
import SettingsModal from './SettingsModal'
import getSharedStartingString from './lib/getSharedStartingString'
import getImportStrings from './lib/getImportStrings'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    autobind(this)

    let cachedState = null
    try {
      cachedState = window.localStorage.getItem('state') ? JSON.parse(window.localStorage.getItem('state')) : {}
    } catch (e) {
      cachedState = null
    }

    console.log(cachedState)

    this.state = cachedState
      ? cachedState
      : {
          activeComponentFilepath: null,
          basePathForImages: null,
          cachedDirectoryImports,
          componentFilepaths: [],
          componentInstance: null,
          imports: [],
          includedCss: null,
          isRendering: false,
          propertySeeds,
          watcher: null
        }

    this.debouncedRenderComponent = _.debounce(this.renderComponent, 500)
  }

  componentWillMount() {
    const { activeDirectory, activeComponentFilepath } = this.state

    try {
      if (fs.lstatSync(activeDirectory).isDirectory()) this.handleOpenDirectory(activeDirectory)
    } catch (e) {}

    Mousetrap.bind('command+o', () => {
      this.handleOpenComponentOpenDialog()
    })

    if (activeComponentFilepath) {
      this.debouncedRenderComponent()
    }
  }

  componentDidMount() {
    this.handleIncludedCssChange()
    this.debouncedRenderComponent()
  }

  handleSetState(newState) {
    this.setState(
      {
        ...newState
      },
      () => {
        localStorage.setItem('state', JSON.stringify(this.state))
        this.debouncedRenderComponent()
      }
    )
  }

  handleOpenDirectory(newActiveDirectory) {
    this.handleSetActiveDirectory(newActiveDirectory)
    recursive(newActiveDirectory, (err, files) => {
      if (err) return console.error(err)

      // Files is an array of filename
      var stringSegmentToBeRemoved = getSharedStartingString(files)
      let newComponentFilepaths = []
      let filesInActiveDirectory = []

      files.forEach(function(filepath) {
        if (!filepath.match(/(\.js|\.jsx)/g)) return

        var uniqueFilepath = filepath.replace(stringSegmentToBeRemoved, '')
        var filename = path.basename(filepath)
        filesInActiveDirectory.push(filepath)

        newComponentFilepaths.push({
          filename,
          uniqueFilepath,
          filepath
        })
      })

      if (this.state.watcher) {
        this.state.watcher.close()
      }

      this.setState({
        watcher: chokidar
          .watch(newActiveDirectory, {
            ignored: /(^|[/\\])\../,
            persistent: true
          })
          .on('add', path => {
            if (this.state.filesInActiveDirectory.indexOf(path) === -1) {
              this.setState({
                filesInActiveDirectory
              })
              this.handleOpenDirectory(newActiveDirectory)
            }
          })
          .on('change', path => {
            this.debouncedRenderComponent()
          })
          .on('unlink', path => {
            if (this.state.filesInActiveDirectory.indexOf(path) > -1) {
              this.setState({
                filesInActiveDirectory
              })
              this.handleOpenDirectory(newActiveDirectory)
            }
          })
      })

      this.handleSetComponentFilepaths(newComponentFilepaths)
    })
  }

  handleOpenComponentOpenDialog() {
    var openedFilepath = dialog.showOpenDialog({
      properties: ['openFile']
    })
    if (!openedFilepath) return

    this.handleSetState({
      activeComponentFilepath: openedFilepath[0]
    })
  }

  renderComponent() {
    const { basePathForImages, activeComponentFilepath, propertySeeds, componentInstance } = this.state

    if (!activeComponentFilepath) return

    this.setState({ isRendering: true })

    const webpack = require('webpack')

    const compiler = webpack(
      {
        // Configuration Object
        entry: activeComponentFilepath,
        output: {
          filename: 'bundle.js',
          path: path.resolve(__dirname, 'cache')
        },
        module: {
          rules: [
            {
              test: /\.js$/,
              exclude: /(node_modules|bower_components)/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: ['latest', 'react', 'env'],
                  plugins: [require('babel-plugin-transform-object-rest-spread')]
                }
              }
            }
          ]
        }
      },
      (err, stats) => {
        if (err) {
          console.error(err.stack || err)
          if (err.details) {
            console.error(err.details)
          }
          return
        }

        const info = stats.toJson()

        if (stats.hasErrors()) {
          console.error(info.errors)
        }

        if (stats.hasWarnings()) {
          console.warn(info.warnings)
        }

        // Log result...
      }
    )

    compiler.run((err, stats) => {
      console.log(stats)
      this.setState({ isRendering: false })
    })

    return

    try {
      console.log(importStrings)

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

      return

      // console.log(renderComponentString)

      let babelResult = babel.transform(renderComponentString, {
        presets: ['latest', 'react'],
        plugins: [
          'transform-class-properties',
          'transform-es2015-classes',
          'transform-runtime',
          'transform-object-rest-spread'
        ]
      })

      fs.writeFileSync('storage/app/temp-component.js', babelResult.code)

      // Clear the node require cache and reload the file
      const tempComponentFilepath = '../../storage/app/temp-component.js'
      delete require.cache[require.resolve(tempComponentFilepath)]
      var transpiledReactComponent = require(tempComponentFilepath).default

      // Container for the react component
      var componentPreviewElement = document.getElementById('component-preview')

      if (componentInstance) {
        ReactDOM.unmountComponentAtNode(document.getElementById('component-preview'))
      }

      // Get seed data for properties if there is any
      var componentPropValues = {}
      if (propertySeeds) {
        propertySeeds.forEach(function(propertySeed) {
          if (!propertySeed.value || propertySeed.value.length === 0) return
          componentPropValues[propertySeed.key] = eval('(' + propertySeed.value + ')') // eslint-disable-line
        })
      }

      this.setState({
        componentInstance: ReactDOM.render(
          React.createElement(transpiledReactComponent, componentPropValues),
          componentPreviewElement
        )
      })

      if (basePathForImages) {
        $('#component-preview').find('img').each(function() {
          var imgSrc = $(this).attr('src')
          if (!imgSrc) return
          var newImgSrc = path.join(basePathForImages, imgSrc)
          $(this).attr('src', newImgSrc)
        })
      }

      this.setState({ isRendering: false })
    } catch (e) {
      this.setState({ isRendering: false })
      console.error(e)
    }
  }

  handleSetBasePathForImages(e) {
    this.setState(
      {
        basePathForImages: e.currentTarget.value
      },
      () => {
        window.localStorage.setItem('basePathForImages', this.state.basePathForImages)
        this.handleIncludedCssChange()
      }
    )
  }

  handleSetIncludedCss(e) {
    this.setState(
      {
        includedCss: e.currentTarget.value
      },
      () => {
        window.localStorage.setItem('includedCss', this.state.includedCss)
        this.handleIncludedCssChange()
      }
    )
  }

  handleIncludedCssChange() {
    const { includedCss, basePathForImages } = this.state

    if (!includedCss) {
      this.debouncedRenderComponent()
      return
    }

    request.get(includedCss, (error, response, body) => {
      if (error || response.statusCode !== 200) {
        console.error(error)
        return
      }

      let encapsulatedCss = `#component-preview{${body}}`

      Sass.compile(encapsulatedCss, result => {
        var css = result.text
        if (basePathForImages) {
          var matches = css.match(/(\/.*?\.\w{3})/gim)
          matches.forEach(function(match) {
            try {
              css = css.replace(new RegExp(match, 'g'), path.join(basePathForImages, match))
            } catch (e) {
              console.error('Could not match', match)
            }
          })
        }

        $('#component-styles').html(css)
        this.debouncedRenderComponent()
      })
    })
  }

  handleAddPropertySeed() {
    let newPropertySeeds = [
      {
        id: Date.now()
      },
      ..._.get(this.state, 'propertySeeds', [])
    ]

    this.handleSetState({
      propertySeeds: newPropertySeeds
    })
  }

  handleSetPropertySeed(e, key, propName) {
    let newPropertySeeds = [..._.get(this.state, 'propertySeeds', [])]
    _.set(newPropertySeeds, `[${key}][${propName}]`, e.target.value)

    this.handleSetState({
      propertySeeds: newPropertySeeds
    })
  }

  handleRemovePropertySeed(key) {
    const { propertySeeds } = this.state

    let newPropertySeeds = propertySeeds.filter((propertySeed, index) => key !== index)

    this.handleSetState({
      propertySeeds: newPropertySeeds
    })
  }

  render() {
    const { imports, activeComponentFilepath, componentFilepaths, isRendering, propertySeeds } = this.state

    return (
      <div>
        <div className="pane pane-components">
          <ImportsPane
            handleSetState={this.handleSetState}
            imports={imports}
            onAddPropertySeed={this.handleAddPropertySeed}
            onRemovePropertySeed={this.handleRemovePropertySeed}
            onSetPropertySeed={this.handleSetPropertySeed}
            propertySeeds={propertySeeds}
            onSetBasePathForImages={this.handleSetBasePathForImages}
            onSetIncludedCss={this.handleSetIncludedCss}
            handleOpenComponentOpenDialog={this.handleOpenComponentOpenDialog}
            handleOpenComponent={this.handleOpenComponent}
          />
        </div>
        <div className="pane pane-preview">
          <PreviewPane activeComponentFilepath={activeComponentFilepath} isRendering={isRendering} />
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))
