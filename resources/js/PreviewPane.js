import React from 'react'
import autobind from 'react-autobind'

export default function PreviewPane({}) {
  return (
    <div
      className="pane"
      style={{
        backgroundColor: '#2c3643',
        bottom: 0,
        display: 'block',
        position: 'absolute',
        left: 0,
        marginLeft: '275px',
        right: 0,
        top: '37px',
        width: 'auto',
        zIndex: 2
      }}
    >
      <div className="pane-group">
        <div className="pane-body">
          <div
            style={{
              overflow: 'auto',
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0
            }}
          >
            <style id="component-styles" />
            <div
              className="align-middle"
              id="component-preview"
              style={{
                background: '#2c3643',
                bottom: 0,
                left: 0,
                position: 'absolute',
                right: 0,
                top: '37px'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
