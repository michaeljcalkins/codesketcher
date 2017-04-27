import React, { Component } from 'react'
import autobind from 'react-autobind'

export default class SettingsModal extends Component {
  constructor (props) {
    super(props)
    autobind(this)
  }

  render () {
    const {
      onSetIncludedCss,
      onSetBasePathForImages
    } = this.props

    const defaultBasePathForImages = window.localStorage.getItem('basePathForImages')
    const defaultIncludedCss = window.localStorage.getItem('includedCss')

    return (
      <div className='modal-content'>
        <div className='modal-header'>
          <button type='button' className='close' data-dismiss='modal' aria-label='Close' />
          <h4 className='modal-title'>Settings</h4>
        </div>
        <div className='modal-body'>
          <h4>Environment</h4>
          <div className='form-group'>
            <label>Included CSS File</label>
            <input
              className='form-control'
              defaultValue={defaultIncludedCss}
              onChange={onSetIncludedCss}
              placeholder='http://localhost:3000/css/app.css'
              type='text'
            />
          </div>
          <div className='form-group'>
            <label>Base Path For Images</label>
            <input
              className='form-control'
              defaultValue={defaultBasePathForImages}
              onChange={onSetBasePathForImages}
              placeholder='http://localhost:3000/images'
              type='text'
            />
          </div>
        </div>
        <div className='modal-footer'>
          <button type='button' className='btn btn-default' data-dismiss='modal'>Close</button>
        </div>
      </div>
    )
  }
}
