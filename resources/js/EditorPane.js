import React from 'react'
import autobind from 'react-autobind'
import path from 'path'
import classnames from 'classnames'

export default class EditorPane extends React.Component {
  constructor (props) {
    super(props)
    autobind(this)
  }

  componentDidMount () {
    const {
      onCreateEditor,
      onSaveComponent,
      onNewComponent,
      onOpenComponentOrDirectory
    } = this.props

    const editor = window.CodeMirror(document.getElementById('editor'), {
      lineNumbers: true,
      styleActiveLine: true,
      indentWithTabs: false,
      lineWrapping: true,
      showInvisibles: true,
      mode: 'jsx',
      tabSize: 2,
      theme: 'monokai',
      showTrailingSpace: true,
      matchTags: true,
      matchBrackets: true,
      autoCloseBrackets: true
    })

    editor.setOption('extraKeys', {
      'Cmd-S': () => onSaveComponent(),
      'Cmd-O': () => onOpenComponentOrDirectory(),
      'Cmd-N': () => onNewComponent()
    })

    onCreateEditor(editor)
  }

  render () {
    const {
      activeComponentFilepath,
      isDirty
    } = this.props

    const componentBasename = activeComponentFilepath
      ? '- ' + path.basename(activeComponentFilepath)
      : ''
    const paneHeaderClasses = classnames('pane-header', {
      // 'bgg': !isDirty,
      // 'bgr': isDirty
    })

    return (
      <div className='pane pane-editor'>
        <div className='pane-group h100 pos-rel'>
          <div className={paneHeaderClasses}>
            Editor {componentBasename}
          </div>
          <div className='pane-row' id='editor' style={{ position: 'absolute', top: '32px', left: 0, bottom: 0, right: 0 }} />
        </div>
      </div>
    )
  }
}
