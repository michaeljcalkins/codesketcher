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
import SettingsModal from './SettingsModal'
import getSharedStartingString from './lib/getSharedStartingString'
import getImportStrings from './lib/getImportStrings'

export default class App extends React.Component {
  constructor (props) {
    super(props)
    autobind(this)

    let cachedDirectoryImports = null
    try {
      cachedDirectoryImports = JSON.parse(window.localStorage.getItem('cachedDirectoryImports'))
    } catch (e) {
      cachedDirectoryImports = {}
    }

    let propertySeeds = null
    try {
      propertySeeds = window.localStorage.getItem('propertySeeds')
        ? JSON.parse(window.localStorage.getItem('propertySeeds'))
        : []
    } catch (e) {
      propertySeeds = []
    }

    this.state = {
      activeComponentContents: null,
      activeComponentFilepath: window.localStorage.getItem('activeComponentFilepath'),
      activeComponentFilepathContents: [],
      activeDirectory: window.localStorage.getItem('activeDirectory'),
      basePathForImages: window.localStorage.getItem('basePathForImages'),
      cachedDirectoryImports,
      componentFilepaths: [],
      componentInstance: null,
      filesInActiveDirectory: [],
      includedCss: window.localStorage.getItem('includedCss'),
      isRendering: false,
      propertySeeds,
      renderComponentString: null,
      watcher: null
    }

    this.debouncedRenderComponent = _.debounce(this.renderComponent, 500)
  }

  componentWillMount () {
    const {
      activeDirectory,
      activeComponentFilepath
    } = this.state

    try {
      if (fs.lstatSync(activeDirectory).isDirectory()) this.handleOpenDirectory(activeDirectory)
    } catch (e) {}

    Mousetrap.bind('command+s', () => {
      this.handleSaveComponent()
    })

    Mousetrap.bind('command+o', () => {
      this.handleOpenComponentOrDirectory()
    })

    Mousetrap.bind('command+n', () => {
      this.handleNewComponent()
    })

    if (activeComponentFilepath) {
      this.debouncedRenderComponent()
    }
  }

  componentDidMount () {
    this.handleIncludedCssChange()
    this.debouncedRenderComponent()
  }

  handleOpenDirectory (newActiveDirectory) {
    this.handleSetActiveDirectory(newActiveDirectory)
    recursive(newActiveDirectory, (err, files) => {
      if (err) return console.error(err)

      // Files is an array of filename
      var stringSegmentToBeRemoved = getSharedStartingString(files)
      let newComponentFilepaths = []
      let filesInActiveDirectory = []

      files.forEach(function (filepath) {
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
        watcher: chokidar.watch(newActiveDirectory, {
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

  handleOpenComponentOrDirectory () {
    var openedFilepath = dialog.showOpenDialog({
      properties: ['openFile', 'openDirectory']
    })
    if (!openedFilepath) return

    if (!openedFilepath[0].match(/(\.js)/)) {
      this.handleOpenDirectory(openedFilepath[0])
      return
    }

    this.handleOpenComponent(openedFilepath[0])
  }

  handleOpenComponent (filepath) {
    var contents = fs.readFileSync(filepath, {encoding: 'utf-8'})

    window.localStorage.setItem('activeComponentFilepath', filepath)

    this.setState({
      activeComponentFilepath: filepath,
      activeComponentContents: contents
    })

    this.debouncedRenderComponent()
  }

  handleFindAndAddImports (filepath, contents) {
    const {
      activeDirectory,
      cachedDirectoryImports
    } = this.state

    if (!contents) {
      contents = fs.readFileSync(filepath)
    }

    let importStrings = getImportStrings(contents)

    importStrings.forEach(importString => {
      const componentDirname = path.dirname(filepath)
      if (_.has(cachedDirectoryImports, `[${activeDirectory}][${importString}]`)) return

      console.log('Attempting to import:', importString)

      let usedPotentialLocation = false

      const importFragments = importString.split(' from ')
      const fromFragment = _.get(importFragments, '[1]').replace(/'/g, '').trim()

      // Location of imported file relative to the location of the active component's location.
      const potentialImportLocation = path.join(componentDirname, fromFragment + '.js')

      let importLocation = null

      // Transpile the file if found relatively to the active component
      try {
        if (
          fs.lstatSync(potentialImportLocation).isFile() ||
          fs.lstatSync(potentialImportLocation).isDirectory()
        ) {
          importLocation = potentialImportLocation
          usedPotentialLocation = true
        }
      } catch (e) {}

      // Ask the user for the location of the file/dir and transpile that
      if (!usedPotentialLocation) {
        const selectedFilepath = dialog.showOpenDialog({
          properties: ['openFile', 'openDirectory']
        })
        if (!_.has(selectedFilepath, '[0]')) return
        importLocation = _.get(selectedFilepath, '[0]')
      }

      if (!importLocation) return

      const cachedFilePath = this.handleAddCachedDirectoryImports(
        activeDirectory,
        importString,
        importLocation
      )

      try {
        // require(cachedFilePath)
      } catch (e) {
        // this.handleFindAndAddImports(importLocation)
        console.error('Attempted require failed', cachedFilePath, e)
      }
    })
  }

  handleReplaceRelativeImports (contents) {
    const {
      activeDirectory,
      cachedDirectoryImports
    } = this.state

    Object
      .keys(_.get(cachedDirectoryImports, `[${activeDirectory}]`, {}))
      .forEach(function (key) {
        var newImportString = replaceFromWithPath(key, cachedDirectoryImports[activeDirectory][key])
        contents = contents.replace(key, newImportString)
      })

    return contents
  }

  renderComponent () {
    const {
      basePathForImages,
      activeComponentFilepath,
      propertySeeds,
      componentInstance
    } = this.state

    if (!activeComponentFilepath) return

    let renderComponentString = fs.readFileSync(activeComponentFilepath, {encoding: 'utf-8'})

    if (!renderComponentString) return console.error(renderComponentString)

    this.setState({ isRendering: true })
    try {
      this.handleFindAndAddImports(activeComponentFilepath, renderComponentString)
      renderComponentString = this.handleReplaceRelativeImports(renderComponentString)

      // Find all imports
      const importStrings = getImportStrings(renderComponentString)

      // Loop through them
      importStrings.forEach(importString => {
        // if not node_modules transpile them and cache them
        if (importString.match('node_modules')) return

        let importFragments = importString.split(' from ')
        let fromFragment = importFragments[1].replace(/'/g, '').trim()
        let newFromFragment = fromFragment.replace(/\//g, '-')
        let importedComponentString = fs.readFileSync(fromFragment)

        // Replace import in renderComponentString with path to cached file
        let babelResult = babel.transform(importedComponentString, {
          presets: ['latest', 'react'],
          plugins: [
            'transform-class-properties',
            'transform-es2015-classes',
            'transform-runtime',
            'transform-object-rest-spread'
          ]
        })

        fs.writeFileSync('storage/components/' + newFromFragment, babelResult.code)

        const normalizedNewFromFragment = path.join(__dirname, '/../../../storage/components/', newFromFragment)
        delete require.cache[require.resolve(normalizedNewFromFragment)]
        renderComponentString = renderComponentString.replace(fromFragment, normalizedNewFromFragment)
      })

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
      const tempComponentFilepath = '../../../storage/app/temp-component.js'
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
        propertySeeds.forEach(function (propertySeed) {
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
        $('#component-preview').find('img').each(function () {
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

  handleAddCachedDirectoryImports (activeDirectory, importString, newFilepath) {
    const {
      cachedDirectoryImports
    } = this.state

    if (!newFilepath) {
      return console.error('newFilepath is required when caching directory imports.')
    }

    let newCachedDirectoryImports = { ...cachedDirectoryImports }
    newCachedDirectoryImports[activeDirectory] = newCachedDirectoryImports[activeDirectory] || {}
    newCachedDirectoryImports[activeDirectory][importString] = newFilepath

    this.setState({
      cachedDirectoryImports: newCachedDirectoryImports
    })

    window.localStorage.setItem('cachedDirectoryImports', JSON.stringify(newCachedDirectoryImports))

    return newFilepath
  }

  handleSetActiveDirectory (newActiveDirectory) {
    window.localStorage.setItem('activeDirectory', newActiveDirectory)
    this.setState({ activeDirectory: newActiveDirectory })
  }

  handleSetComponentFilepaths (componentFilepaths) {
    this.setState({ componentFilepaths })
  }

  handleSetBasePathForImages (e) {
    this.setState({
      basePathForImages: e.currentTarget.value
    }, () => {
      window.localStorage.setItem('basePathForImages', this.state.basePathForImages)
      this.handleIncludedCssChange()
    })
  }

  handleSetIncludedCss (e) {
    this.setState({
      includedCss: e.currentTarget.value
    }, () => {
      window.localStorage.setItem('includedCss', this.state.includedCss)
      this.handleIncludedCssChange()
    })
  }

  handleIncludedCssChange () {
    const {
      includedCss,
      basePathForImages
    } = this.state

    if (!includedCss) return

    request.get(includedCss, (error, response, body) => {
      if (error || response.statusCode !== 200) {
        console.error(error)
        return
      }

      let encapsulatedCss = `#component-preview{${body}}`

      Sass.compile(encapsulatedCss, (result) => {
        var css = result.text
        if (basePathForImages) {
          var matches = css.match(/(\/.*?\.\w{3})/img)
          matches.forEach(function (match) {
            try {
              css = css.replace(
                new RegExp(match, 'g'),
                path.join(basePathForImages, match)
              )
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

  handleAddPropertySeed () {
    const { propertySeeds } = this.state

    let newPropertySeeds = [ {
      id: Date.now()
    }, ...propertySeeds]

    window.localStorage.setItem('propertySeeds', JSON.stringify(newPropertySeeds))

    this.setState({
      propertySeeds: newPropertySeeds
    }, () => this.debouncedRenderComponent())
  }

  handleSetPropertySeed (e, key, propName) {
    const { propertySeeds } = this.state

    let newPropertySeeds = [ ...propertySeeds ]
    _.set(newPropertySeeds, `[${key}][${propName}]`, e.target.value)

    window.localStorage.setItem('propertySeeds', JSON.stringify(newPropertySeeds))

    this.setState({
      propertySeeds: newPropertySeeds
    }, () => this.debouncedRenderComponent())
  }

  handleRemovePropertySeed (key) {
    const { propertySeeds } = this.state

    let newPropertySeeds = propertySeeds.filter((propertySeed, index) => key !== index)

    this.setState({
      propertySeeds: newPropertySeeds
    }, () => this.debouncedRenderComponent())
  }

  render () {
    const {
      activeComponentFilepath,
      componentFilepaths,
      isRendering,
      propertySeeds
    } = this.state

    return (
      <div>
        <div className='pane pane-components'>
          <ComponentsPane
            activeComponentFilepath={activeComponentFilepath}
            onOpenComponent={this.handleOpenComponent}
            onOpenComponentOrDirectory={this.handleOpenComponentOrDirectory}
            componentFilepaths={componentFilepaths}
          />
        </div>
        <div className='pane pane-preview'>
          <PreviewPane
            onAddPropertySeed={this.handleAddPropertySeed}
            onRemovePropertySeed={this.handleRemovePropertySeed}
            onSetPropertySeed={this.handleSetPropertySeed}
            activeComponentFilepath={activeComponentFilepath}
            propertySeeds={propertySeeds}
            isRendering={isRendering}
          />
        </div>
        <div className='modal fade in' id='settings-modal'>
          <div className='modal-dialog'>
            <SettingsModal
              onSetBasePathForImages={this.handleSetBasePathForImages}
              onSetIncludedCss={this.handleSetIncludedCss}
            />
          </div>
        </div>
      </div>
    )
  }
}
