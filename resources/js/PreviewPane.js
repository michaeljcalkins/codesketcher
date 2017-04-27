import React from 'react'
import autobind from 'react-autobind'
import path from 'path'

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

    if (!propertySeeds) return []

    return propertySeeds.map((propertySeed, key) => {
      return (
        <tr key={'property-seed-' + propertySeed.id}>
          <td className='form-column w45 bl1'>
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
      onAddPropertySeed,
      activeComponentFilepath,
      isRendering
    } = this.props

    const componentBasename = activeComponentFilepath
      ? ' - ' + path.basename(activeComponentFilepath)
      : ''

    return (
      <div>
        <div className='pane-group pane-group-preview'>
          <div className='pane-header'>
            Component Preview
            {componentBasename}
            { isRendering && <i className='fa fa-refresh fa-spin ml1' /> }
            <button
              className='btn btn-default btn-xs pull-right'
              data-toggle='modal'
              data-target='#settings-modal'
            >
              <i className='fa fa-cog mr1' />
              Settings
            </button>
          </div>

          <div className='pane-body'>
            <div
              className='bl1 bb1 bt1'
              style={{
                overflow: 'auto',
                position: 'absolute',
                top: '37px',
                left: 0,
                bottom: 0,
                right: 0
              }}
            >
              <style id='component-styles' />
              <div
                className='align-middle'
                id='component-preview'
              />
            </div>
          </div>
        </div>
        <div className='pane-group pane-group-prop-editor'>
          <div className='pane-header'>
            Property Editor
            <button
              onClick={onAddPropertySeed}
              className='btn btn-default btn-xs pull-right mr1'
            >
              Detect and Replace Properties
            </button>
            <button
              onClick={onAddPropertySeed}
              className='btn btn-default btn-xs pull-right mr1'
            >
              <i className='fa fa-plus' /> Property
            </button>
          </div>
          <div className='pane-body'>
            <div className='pane-row'
              style={{
                overflowY: 'scroll',
                position: 'absolute',
                top: 37,
                left: 0,
                bottom: 0,
                right: 0
              }}
            >
              <table className='table mb0'>
                <tbody>
                  {this.renderPropertyDataFields()}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
