import React from 'react'
import autobind from 'react-autobind'
import path from 'path'

export default class PreviewPane extends React.Component {
  constructor(props) {
    super(props)
    autobind(this)
  }

  render() {
    const { activeComponentFilepath, isRendering } = this.props

    const componentBasename = activeComponentFilepath ? ' - ' + path.basename(activeComponentFilepath) : ''

    return (
      <div>
        <div className="pane-group pane-group-preview">
          <div className="pane-header draggable-region">
            Component Preview
            {componentBasename}
            {isRendering && <i className="fa fa-refresh fa-spin ml1" />}
          </div>

          <div className="pane-body">
            <div
              className="bl1 bb1 bt1"
              style={{
                overflow: 'auto',
                position: 'absolute',
                top: '37px',
                left: 0,
                bottom: 0,
                right: 0
              }}
            >
              <style id="component-styles" />
              <div className="align-middle" id="component-preview" />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
