import React from 'react'
import autobind from 'react-autobind'

export default class ComponentsPane extends React.Component {
  constructor (props) {
    super(props)
    autobind(this)

    this.state = {
      searchTerm: null
    }
  }

  handleSearchTermInput () {
    this.setState({
      searchTerm: this.refs.searchTerm.value.toLowerCase()
    })
  }

  renderComponentsList () {
    const { componentFilepaths, onOpenComponent } = this.props
    const { searchTerm } = this.state

    return componentFilepaths
      .filter(component => {
        if (!searchTerm) return true
        return component.uniqueFilepath.toLowerCase().indexOf(searchTerm) > -1
      })
      .map(component => {
        return (
          <p
            className='mb1 ft12 pointer'
            key={component.uniqueFilepath}
            onClick={() => onOpenComponent(component.filepath)}
          >
            <strong>{component.filename}</strong>
            <br />
            <span className='ft11'>{component.uniqueFilepath}</span>
          </p>
        )
      })
  }

  render () {
    const { onOpenComponentOrDirectory } = this.props

    return (
      <div className='pane-group pange-group-components'>
        <div className='pane-header'>
          Components
          <button
            className='btn btn-default btn-xs pull-right mr1'
            onClick={onOpenComponentOrDirectory}
          >
            <i className='fa fa-folder' />
          </button>
        </div>
        <div className='pane-body'>
          <div className='pane-row'>
            <div className='form-column full-width'>
              <input
                type='text'
                ref='searchTerm'
                placeholder='Filter Components'
                onChange={this.handleSearchTermInput}
              />
            </div>
          </div>
          <div className='pane-row'>
            <div className='form-column full-width component-filepaths-container'>
              {this.renderComponentsList()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
