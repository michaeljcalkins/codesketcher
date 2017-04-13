import React from 'react'
import autobind from 'react-autobind'

export default class PreviewPane extends React.Component {
  constructor (props) {
    super(props)
    autobind(this)
  }

  renderPropertyDataFields () {
    const {
      propertySeeds,
      onRemovePropertySeed,
      onSetPropertySeed
    } = this.props

    return propertySeeds.map((propertySeed, key) => {
      return (
        <tr className='pane-row bt0' key={'property-seed-' + propertySeed.id}>
          <td className='form-column w45'>
            <input
              type='text'
              placeholder='Key'
              defaultValue={propertySeed.key}
              onChange={(e) => onSetPropertySeed(e, key, 'key')}
            />
          </td>
          <td className='form-column w45'>
            <input
              type='text'
              placeholder='Value'
              defaultValue={propertySeed.value}
              onChange={(e) => onSetPropertySeed(e, key, 'value')}
            />
          </td>
          <td className='form-column w10'>
            <button
              className='btn btn-default btn-xs pull-right'
              onClick={() => onRemovePropertySeed(key)}
              style={{ marginTop: '2px' }}
            >
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
      <div className='pane pane-preview'>
        <div className='pane-group pane-group-preview'>
          <div className='pane-header'>
            Component Preview
          </div>
          <div className='pane-body'>
            <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 }}>
              <style id='component-styles' />
              <div className='align-middle' id='component-preview' />
            </div>
          </div>
        </div>
        <div className='pane-group pane-group-prop-editor'>
          <div className='pane-header'>
            Prop Editor
            <button
              onClick={onAddPropertySeed}
              className='btn btn-default btn-xs pull-right mr1'
            >
              +
            </button>
          </div>
          <div className='pane-body'>
            <table className='table'>
              <tbody>
                {this.renderPropertyDataFields()}
              </tbody>
            </table>
          </div>
        </div>
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
      </div>
    )
  }
}
