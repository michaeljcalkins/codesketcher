import React from 'react'

export default function ImportsPane({
  handleSetState,
  imports,
  onAddPropertySeed,
  onRemovePropertySeed,
  onSetPropertySeed,
  propertySeeds,
  onSetBasePathForImages,
  onSetIncludedCss,
  handleOpenComponentOpenDialog,
  handleOpenComponent
}) {
  function onSetImportPath(e) {}

  function renderImportRows() {
    return imports.map(importString => {
      return (
        <div className="pane-row mb1" key={'import-' + importString.packageName}>
          <div className="form-column one-half">
            <label className="form-label">
              {importString.packageName}
            </label>
          </div>
          <div className="form-column one-half">
            <input type="text" placeholder="Value" defaultValue={importString.path} onChange={onSetImportPath} />
          </div>
        </div>
      )
    })
  }

  function renderPropertyDataFields() {
    if (!propertySeeds) return []

    return propertySeeds.map((propertySeed, key) => {
      return (
        <tr key={'property-seed-' + propertySeed.id}>
          <td className="form-column w45 bl1">
            <input
              type="text"
              placeholder="Key"
              defaultValue={propertySeed.key}
              onChange={e => onSetPropertySeed(e, key, 'key')}
            />
          </td>
          <td className="form-column w45">
            <input
              type="text"
              placeholder="Value"
              defaultValue={propertySeed.value}
              onChange={e => onSetPropertySeed(e, key, 'value')}
            />
          </td>
          <td className="form-column w10">
            <button
              className="btn btn-default btn-xs pull-right"
              onClick={() => onRemovePropertySeed(key)}
              style={{ marginTop: '2px' }}
            >
              <i className="fa fa-remove" />
            </button>
          </td>
        </tr>
      )
    })
  }

  function onAddDependency() {}

  function handleSubmitOpenComponent(e) {
    console.log(e)
    handleOpenComponent()
  }

  const defaultBasePathForImages = window.localStorage.getItem('basePathForImages')
  const defaultIncludedCss = window.localStorage.getItem('includedCss')

  return (
    <div style={{ marginTop: 37 }}>
      <div className="pane-group bb1 bt1 pb1">
        <div className="pane-header">Entry File</div>
        <div className="pane-body">
          <div className="pane-row mb1">
            <div className="form-column full-width">
              <button className="btn btn-default btn-block" onClick={handleOpenComponentOpenDialog}>
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
          <div className="pane-row">
            <table className="table mb0">
              <tbody>
                {renderPropertyDataFields()}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="pane-group bb1 pb1">
        <div className="pane-header">NPM Packages</div>
        <div className="pane-body">
          <div className="pane-row mb1">
            <div className="form-column full-width">
              <form onSubmit={onAddDependency}>
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
                defaultValue={defaultIncludedCss}
                onChange={onSetIncludedCss}
                placeholder="http://localhost:3000/css/app.css"
                type="text"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="form-row">
        <label />
      </div>
    </div>
  )
}
