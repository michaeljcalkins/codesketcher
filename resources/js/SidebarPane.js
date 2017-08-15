import React from 'react'

export default function SidebarPane({
  basePathForImages,
  includedCssUrl,
  debouncedRenderComponent,
  onAddPropertySeed,
  onIncludedCssUrlChange,
  onOpenComponentOpenDialog,
  onRemovePropertySeed,
  onSetPropertySeed,
  onSetState,
  propertySeeds
}) {
  function handleSetIncludedCssUrl(e) {
    onSetState(
      {
        includedCssUrl: e.currentTarget.value
      },
      () => {
        onIncludedCssUrlChange()
      }
    )
  }

  function handleSetBasePathForImages(e) {
    onSetState({
      basePathForImages: e.currentTarget.value
    })
  }

  function handleAddDependency() {}

  function renderPropertyDataFields() {
    if (!propertySeeds) return []

    return propertySeeds.map((propertySeed, key) => {
      return (
        <div className="form-row" key={'property-seed-' + propertySeed.id}>
          <div className="form-column full-width">
            <input
              type="text"
              className="mb1"
              placeholder="Key"
              defaultValue={propertySeed.key}
              onChange={e => onSetPropertySeed(e, key, 'key')}
            />
            <textarea
              style={{ height: '60px' }}
              placeholder="Value"
              defaultValue={propertySeed.value}
              onChange={e => onSetPropertySeed(e, key, 'value')}
            />
            <button
              className="btn btn-default btn-block btn-xs pull-right mb2"
              onClick={() => onRemovePropertySeed(key)}
            >
              <i className="fa fa-remove" />
            </button>
          </div>
        </div>
      )
    })
  }

  return (
    <div
      className="pane "
      style={{
        background: '#222a34',
        bottom: 0,
        left: 0,
        position: 'absolute',
        top: 37,
        width: '275px'
      }}
    >
      <div className="pane-group bb1 pb1">
        <div className="pane-header">Entry File</div>
        <div className="pane-body">
          <div className="pane-row mb1">
            <div className="form-column full-width">
              <button className="btn btn-default btn-block" onClick={onOpenComponentOpenDialog}>
                <i className="fa fa-folder" /> Open File
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="pane-group bb1 pb1">
        <div className="pane-header">
          Property Editor
          <button onClick={onAddPropertySeed} className="btn btn-default btn-xs pull-right">
            <i className="fa fa-plus" /> Property
          </button>
        </div>
        <div className="pane-body">
          {renderPropertyDataFields()}
        </div>
      </div>
      <div className="pane-group bb1 pb1">
        <div className="pane-header">NPM Packages</div>
        <div className="pane-body">
          <div className="pane-row mb1">
            <div className="form-column full-width">
              <form onSubmit={handleAddDependency}>
                <input className="form-control" placeholder="Write package name and press enter..." type="text" />
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="pane-group bb1 pb1">
        <div className="pane-header">Included CSS File</div>
        <div className="pane-body">
          <div className="pane-row mb1">
            <div className="form-column full-width">
              <input
                className="form-control"
                defaultValue={includedCssUrl}
                onChange={handleSetIncludedCssUrl}
                placeholder="http://localhost:3000/css/app.css"
                type="text"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="pane-group bb1 pb1">
        <div className="pane-header">Base Path For Images</div>
        <div className="pane-body">
          <div className="pane-row mb1">
            <div className="form-column full-width">
              <input
                className="form-control"
                defaultValue={basePathForImages}
                onChange={handleSetBasePathForImages}
                placeholder="http://localhost:3000/images"
                type="text"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
