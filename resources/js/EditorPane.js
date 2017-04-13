import React from 'react'
import autobind from 'react-autobind'

export default class EditorPane extends React.Component {
  constructor (props) {
    super(props)
    autobind(this)
  }

  componentDidMount () {
    const { onCreateEditor } = this.props

    onCreateEditor(window.CodeMirror(document.getElementById('editor'), {
      lineNumbers: true,
      styleActiveLine: true,
      indentWithTabs: false,
      lineWrapping: true,
      mode: 'jsx',
      tabSize: 2,
      theme: 'monokai'
    }))
  }

  render () {
    const { componentFilepath } = this.props

    return (
      <div className='pane pane-editor'>
        <div className='pane-group h100 pos-rel'>
          <div className='pane-header'>
            Editor {componentFilepath && '- ' + componentFilepath.uniqueFilepath}
          </div>
          <div className='pane-row' id='editor' style={{ position: 'absolute', top: '32px', left: 0, bottom: 0, right: 0 }} />
        </div>
      </div>
    )
  }
}
