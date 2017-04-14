import React from 'react'
import ReactDOM from 'react-dom'
import autobind from 'react-autobind'

var Sass = require('sass.js')
var _ = require('lodash')
var getImportStrings = require('./lib/getImportStrings')
var replaceFromWithPath = require('./lib/replaceFromWithPath')
var recursive = require('recursive-readdir')
var fs = require('fs')
var path = require('path')
var babel = require('babel-core')
var dialog = require('electron').remote.dialog
var request = require('request')

import Header from './Header'
import ComponentsPane from './ComponentsPane'
import EditorPane from './EditorPane'
import PreviewPane from './PreviewPane'
import getSharedStartingString from './lib/getSharedStartingString'

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

    this.state = {
      basePathForImages: window.localStorage.getItem('basePathForImages'),
      activeComponentFilepath: null,
      activeDirectory: window.localStorage.getItem('activeDirectory'),
      cachedDirectoryImports: cachedDirectoryImports,
      componentFilepaths: [],
      componentString: null,
      isDirty: false,
      activeComponentFilepathContents: [],
      componentInstance: null,
      editor: null,
      includedCss: window.localStorage.getItem('includedCss'),
      propertySeeds: [],
      renderComponentString: null
    }

    this.debouncedRenderComponent = _.debounce(this.renderComponent, 300)
  }

  componentWillMount () {
    const { activeDirectory } = this.state

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
  }

  componentDidMount () {
    this.handleIncludedCssChange()
    this.debouncedRenderComponent()
  }

  handleCreateEditor (editor) {
    this.setState({ editor })
    editor.on('change', (e) => {
      this.debouncedRenderComponent()
    })
  }

  handleNewComponent () {
    const { editor } = this.state

    editor.setValue('')

    this.setState({
      activeComponentFilepath: null,
      componentString: null
    })
  }

  handleSaveComponent () {
    const { activeComponentFilepath, editor } = this.state

    const componentString = editor.getValue()

    if (!activeComponentFilepath) {
      var newFilepath = dialog.showSaveDialog()

      if (!newFilepath) return
      this.setState({
        activeComponentFilepath: newFilepath
      })

      fs.writeFileSync(newFilepath, componentString)
      this.handleOpenComponent(newFilepath)
      return
    }

    fs.writeFile(activeComponentFilepath, componentString)
  }

  handleOpenDirectory (newActiveDirectory) {
    this.handleSetActiveDirectory(newActiveDirectory)
    recursive(newActiveDirectory, (err, files) => {
      // Files is an array of filename
      var stringSegmentToBeRemoved = getSharedStartingString(files)
      let newComponentFilepaths = []

      files.forEach(function (filepath) {
        if (!filepath.match(/(\.js|\.jsx)/g)) return

        var uniqueFilepath = filepath.replace(stringSegmentToBeRemoved, '')
        var filename = path.basename(filepath)

        newComponentFilepaths.push({
          filename,
          uniqueFilepath,
          filepath
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
    const {
      activeDirectory,
      editor,
      cachedDirectoryImports
    } = this.state

    var filename = path.basename(filepath)
    var contents = fs.readFileSync(filepath, {encoding: 'utf-8'})

    editor.setValue(contents)

    this.setState({
      activeComponentFilepath: filepath
    })

    var importStrings = getImportStrings(contents)
    importStrings.forEach(importString => {
      if (cachedDirectoryImports[activeDirectory] && cachedDirectoryImports[activeDirectory][importString]) return

      console.log(importString)

      var selectedFilepath = dialog.showOpenDialog({
        properties: ['openFile', 'openDirectory']
      })
      if (!selectedFilepath) return

      this.handleAddCachedDirectoryImports(activeDirectory, importString, selectedFilepath[0])
    })

    this.debouncedRenderComponent()
  }

  renderComponent () {
    const {
      editor,
      basePathForImages,
      activeDirectory,
      propertySeeds,
      cachedDirectoryImports,
      componentInstance
    } = this.state

    let renderComponentString = editor.getValue()

    if (!renderComponentString) return console.error(renderComponentString)

    this.setState({ componentString: renderComponentString })

    try {
      Object.keys(_.get(cachedDirectoryImports, `[${activeDirectory}]`, {})).forEach(function (key) {
        var newImportString = replaceFromWithPath(key, _.get(cachedDirectoryImports, `[${activeDirectory}][${key}]`))
        renderComponentString = renderComponentString.replace(key, newImportString)
      })

      let babelResult = babel.transform(renderComponentString, {
        presets: ['latest', 'react'],
        plugins: [
          'transform-class-properties',
          'transform-es2015-classes',
          'transform-runtime',
          'transform-object-rest-spread'
        ]
      })

      fs.writeFileSync('temp-component.js', babelResult.code)

      // Clear the node require cache and reload the file
      delete require.cache[require.resolve('../../../temp-component.js')]
      var transpiledReactComponent = require('../../../temp-component.js').default

      // Container for the react component
      var componentPreviewElement = document.getElementById('component-preview')

      if (componentInstance) {
        ReactDOM.unmountComponentAtNode(document.getElementById('component-preview'))
      }

      // Get seed data for properties if there is any
      var componentPropValues = {}
      propertySeeds.forEach(function (propertySeed) {
        if (!propertySeed.value || propertySeed.value.length === 0) return
        componentPropValues[propertySeed.key] = eval('(' + propertySeed.value + ')') // eslint-disable-line
      })
      console.log('componentPropValues', componentPropValues)

      this.setState({
        componentInstance: ReactDOM.render(
          React.createElement(transpiledReactComponent, componentPropValues),
          componentPreviewElement
        )
      })

      $('#component-preview').find('img').each(function () {
        var imgSrc = $(this).attr('src')
        var newImgSrc = path.join(basePathForImages, imgSrc)
        $(this).attr('src', newImgSrc)
      })
    } catch (e) {
      console.error(e)
    }
  }

  handleAddCachedDirectoryImports (activeDirectory, importString, newFilepath) {
    const { cachedDirectoryImports } = this.state

    let newCachedDirectoryImports = { ...cachedDirectoryImports }
    _.set(newCachedDirectoryImports, `[${activeDirectory}][${importString}]`, newFilepath)

    this.setState({
      cachedDirectoryImports: newCachedDirectoryImports
    })

    window.localStorage.setItem('cachedDirectoryImports', JSON.stringify(newCachedDirectoryImports))
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
    const { includedCss, basePathForImages } = this.state

    request.get(includedCss, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        let encapsulatedCss = `#component-preview{${body}}`

        Sass.compile(encapsulatedCss, (result) => {
          var css = result.text
          if (basePathForImages) {
            var matches = css.match(/(\/.*?\.\w{3})/img)
            matches.forEach(function (match) {
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
      }
    })
  }

  handleAddPropertySeed () {
    const { propertySeeds } = this.state

    let newPropertySeeds = [ {
      id: Date.now()
    }, ...propertySeeds]

    this.setState({
      propertySeeds: newPropertySeeds
    }, () => this.debouncedRenderComponent())
  }

  handleSetPropertySeed (e, key, propName) {
    const { propertySeeds } = this.state

    let newPropertySeeds = [ ...propertySeeds ]
    _.set(newPropertySeeds, `[${key}][${propName}]`, e.target.value)

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
      componentFilepaths,
      activeComponentFilepath,
      propertySeeds,
      isDirty
    } = this.state

    return (
      <div>
        <Header
          onOpenComponentOrDirectory={this.handleOpenComponentOrDirectory}
          onSaveComponent={this.handleSaveComponent}
          onNewComponent={this.handleNewComponent}
        />
        <ComponentsPane
          onOpenComponent={this.handleOpenComponent}
          onOpenComponentOrDirectory={this.handleOpenComponentOrDirectory}
          componentFilepaths={componentFilepaths}
        />
        <EditorPane
          isDirty={isDirty}
          onCreateEditor={this.handleCreateEditor}
          activeComponentFilepath={activeComponentFilepath}
        />
        <PreviewPane
          onSetBasePathForImages={this.handleSetBasePathForImages}
          onSetIncludedCss={this.handleSetIncludedCss}
          onAddPropertySeed={this.handleAddPropertySeed}
          onRemovePropertySeed={this.handleRemovePropertySeed}
          onSetPropertySeed={this.handleSetPropertySeed}
          propertySeeds={propertySeeds}
        />
      </div>
    )
  }
}
