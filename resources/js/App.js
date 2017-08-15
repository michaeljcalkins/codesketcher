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
var dialog = require('electron').remote.dialog
const request = require('request')
const app = require('electron').remote.app
const webpack = require('webpack')

import ComponentsPane from './ComponentsPane'
import PreviewPane from './PreviewPane'
import SidebarPane from './SidebarPane'
import SettingsModal from './SettingsModal'
import getSharedStartingString from './lib/getSharedStartingString'

let watching

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

    this.state = cachedState
      ? cachedState
      : {
          activeComponentFilepath: null,
          basePathForImages: null,
          compiler: null,
          componentInstance: null,
          includedCssUrl: null,
          isRendering: false,
          propertySeeds,
          watcher: null
        }

    this.debouncedCompileWebpack = _.debounce(this.handleCompileWebpack, 500)
  }

  handleCompileWebpack() {
    this.state.compiler.run(this.renderComponent.bind(this))
  }

  componentWillMount() {
    const { basePathForImages, includedCssUrl, activeComponentFilepath, propertySeeds, componentInstance } = this.state

    Mousetrap.bind('command+o', () => {
      this.handleOpenComponentOpenDialog()
    })

    this.setState(
      {
        compiler: webpack({
          // Configuration Object
          entry: path.resolve(__dirname, 'containerComponent.js'),
          output: {
            filename: 'bundle.js',
            path: path.resolve(app.getPath('temp'))
          },
          module: {
            rules: [
              {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: [require('babel-preset-latest'), require('babel-preset-react')],
                    plugins: [
                      require('babel-plugin-transform-object-rest-spread'),
                      require('babel-plugin-transform-class-properties'),
                      require('babel-plugin-transform-es2015-classes'),
                      require('babel-plugin-transform-runtime')
                    ]
                  }
                }
              }
            ]
          }
        })
      },
      () => {
        if (activeComponentFilepath) {
          this.restartWebpackWatch()
        }

        if (includedCssUrl) {
          this.handleIncludedCssUrlChange()
        }
      }
    )
  }

  componentDidMount() {
    this.registerWebpackWatch()
  }

  restartWebpackWatch() {
    if (!watching) this.registerWebpackWatch()

    watching.close(() => {
      console.log('Watching Ended.')
      this.registerWebpackWatch()
    })
  }

  registerWebpackWatch() {
    console.log('Registering webpack')
    watching = this.state.compiler.watch({}, this.renderComponent.bind(this))
  }

  renderComponent(err, stats) {
    const { basePathForImages, activeComponentFilepath, propertySeeds, componentInstance } = this.state

    if (!activeComponentFilepath) return

    console.log('Start Rendering')

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

    this.setState({ isRendering: true })

    // Get seed data for properties if there is any
    var componentPropValues = {}
    if (propertySeeds) {
      propertySeeds.forEach(function(propertySeed) {
        if (!propertySeed.value || propertySeed.value.length === 0) return
        componentPropValues[propertySeed.key] = eval('(' + propertySeed.value + ')') // eslint-disable-line
      })
    }
    componentPropValues = JSON.stringify(componentPropValues)

    const containerComponentString = `
      import React from 'react'
      import ReactDOM from 'react-dom'
  
      import transpiledReactComponent from '${activeComponentFilepath}'

      window.componentInstance = ReactDOM.render(
        React.createElement(transpiledReactComponent, ${componentPropValues}),
        document.getElementById('component-preview')
      )
      `

    fs.writeFileSync(path.resolve(__dirname, 'containerComponent.js'), containerComponentString)

    // Container for the react component
    var componentPreviewElement = document.getElementById('component-preview')

    // Destroy the existing rendered app if there is any
    if (window.componentInstance) {
      ReactDOM.unmountComponentAtNode(document.getElementById('component-preview'))
    }

    // Clear the node require cache and reload the file
    let oldScript = document.getElementById('component-preview-script')
    if (oldScript) oldScript.remove()

    let script = window.document.createElement('script')
    script.type = 'text/javascript'
    script.id = 'component-preview-script'
    script.async = true
    script.src = path.resolve(app.getPath('temp'), 'bundle.js')
    script.onload = function() {
      // remote script has loaded
    }
    window.document.getElementsByTagName('head')[0].appendChild(script)
    this.setState({ isRendering: false })

    if (basePathForImages) {
      $('#component-preview').find('img').each(function() {
        var imgSrc = $(this).attr('src')
        if (!imgSrc) return
        var newImgSrc = path.join(basePathForImages, imgSrc)
        $(this).attr('src', newImgSrc)
      })
    }

    this.setState({
      isRendering: false
    })

    console.log('Stop Rendering')
  }

  handleSetState(newState, cb) {
    this.setState(
      {
        ...newState
      },
      () => {
        this.debouncedCompileWebpack()
        localStorage.setItem(
          'state',
          JSON.stringify({
            activeComponentFilepath: this.state.activeComponentFilepath,
            includedCssUrl: this.state.includedCssUrl,
            basePathForImages: this.state.basePathForImages,
            propertySeeds: this.state.propertySeeds
          })
        )
        cb && cb()
      }
    )
  }

  handleOpenComponentOpenDialog() {
    var openedFilepath = dialog.showOpenDialog({
      properties: ['openFile']
    })
    if (!openedFilepath) return

    this.handleSetState({
      activeComponentFilepath: openedFilepath[0]
    })
    this.restartWebpackWatch()
  }

  handleIncludedCssUrlChange() {
    const { includedCssUrl, basePathForImages } = this.state

    if (!includedCssUrl) {
      return
    }

    console.log('Compiling CSS')

    request.get(includedCssUrl, (error, response, body) => {
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
        this.debouncedCompileWebpack()
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
    const {
      imports,
      activeComponentFilepath,
      includedCssUrl,
      basePathForImages,
      isRendering,
      propertySeeds
    } = this.state

    const componentBasename = activeComponentFilepath ? path.basename(activeComponentFilepath) : ''

    return (
      <div>
        <div className="pane draggable-region">
          <div className="pane-header" style={{ paddingLeft: '80px' }}>
            {componentBasename}
            {isRendering && <i className="fa fa-refresh fa-spin ml1" />}
          </div>
        </div>

        <SidebarPane
          basePathForImages={basePathForImages}
          includedCssUrl={includedCssUrl}
          onAddPropertySeed={this.handleAddPropertySeed}
          onIncludedCssUrlChange={this.handleIncludedCssUrlChange}
          onOpenComponentOpenDialog={this.handleOpenComponentOpenDialog}
          onRemovePropertySeed={this.handleRemovePropertySeed}
          onSetPropertySeed={this.handleSetPropertySeed}
          onSetState={this.handleSetState}
          propertySeeds={propertySeeds}
        />

        <PreviewPane />
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))
