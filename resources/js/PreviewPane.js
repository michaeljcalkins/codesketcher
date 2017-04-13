import React from 'react'
import autobind from 'react-autobind'

export default class PreviewPane extends React.Component {
  constructor (props) {
    super(props)
    autobind(this)
  }

  renderPropertyDataFields () {
    const { propertySeeds } = this.props

    return propertySeeds.map((property, key) => {
      return (
        <tr className='pane-row bt0' key={'property-seed-' + key}>
          <td className='form-column w45'>
            <input type='text' placeholder='Key' />
          </td>
          <td className='form-column w45'>
            <input type='text' placeholder='Value' />
          </td>
          <td className='form-column w10'>
            <button className='btn btn-default btn-xs pull-right' style={{ marginTop: '2px' }}>
              <i className='fa fa-remove' />
            </button>
          </td>
        </tr>
      )
    })
  }

  render () {
    const {
      onSetBasePathForImages,
      onSetIncludedCss,
      onAddPropertySeed
    } = this.props

    return (
      <div className='right-sidebar'>
        <div className='sidebar-group bgw' style={{ position: 'absolute', left: 0, top: 0, right: 0, height: '60%' }}>
          <div className='pane-header'>
            Component Preview
          </div>
          <div style={{ position: 'absolute', top: '33px', left: 0, bottom: 0, right: 0 }}>
            <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 }}>
              <style id='component-styles' />
              <div className='align-middle' id='component-preview' />
            </div>
          </div>
        </div>
        <div className='sidebar-group bgw' style={{ position: 'absolute', overflowY: 'scroll', bottom: '20%', left: 0, right: 0, height: '20%' }}>
          <div className='pane-header'>
            Prop Editor
            <button
              onClick={onAddPropertySeed}
              className='btn btn-default btn-xs pull-right mr1'
            >
              +
            </button>
          </div>
          <div className='component-properties-seed-data-container'>
            <table className='table'>
              <tbody>
                {this.renderPropertyDataFields()}
              </tbody>
            </table>
          </div>
        </div>
        <div className='sidebar-group bgw' style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '20%' }}>
          <div className='pane-header'>
            Environment Settings
          </div>
          <div className='pane-row'>
            <div className='form-column full-width'>
              <span className='form-label'>Base Path For Images</span>
              <input
                type='text'
                placeholder='http://localhost:3000/images'
                defaultValue='https://rangersteve.io'
                onChange={onSetBasePathForImages}
              />

              <span className='form-label'>Included CSS File</span>
              <input
                type='text'
                placeholder='http://localhost:3000/css/app.css'
                defaultValue='https://rangersteve.io/css/app.css'
                onChange={onSetIncludedCss}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
