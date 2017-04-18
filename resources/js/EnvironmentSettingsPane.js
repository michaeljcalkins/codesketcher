import React from 'react'
import autobind from 'react-autobind'

export default class PreviewPane extends React.Component {
  constructor (props) {
    super(props)
    autobind(this)
  }

  render () {
    const {
      onSetBasePathForImages,
      onSetIncludedCss
    } = this.props

    const defaultBasePathForImages = window.localStorage.getItem('basePathForImages')
    const defaultIncludedCss = window.localStorage.getItem('includedCss')

    return (
      <div className='pane-group pane-group-settings'>
        <div className='pane-header'>
          Environment Settings
        </div>
        <div className='pane-body'>
          <div className='pane-row'>
            <div className='form-column full-width'>
              <span className='form-label'>Base Path For Images</span>
              <input
                type='text'
                placeholder='http://localhost:3000/images'
                defaultValue={defaultBasePathForImages}
                onChange={onSetBasePathForImages}
              />

              <span className='form-label'>Included CSS File</span>
              <input
                type='text'
                placeholder='http://localhost:3000/css/app.css'
                defaultValue={defaultIncludedCss}
                onChange={onSetIncludedCss}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
