import React from 'react'
import autobind from 'react-autobind'
import classnames from 'classnames'

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
    const {
      activeComponentFilepath,
      componentFilepaths,
      onOpenComponent
    } = this.props

    const {
      searchTerm
    } = this.state

    return componentFilepaths
      .filter(component => {
        if (!searchTerm) return true
        return component.uniqueFilepath.toLowerCase().indexOf(searchTerm) > -1
      })
      .map(component => {
        const componentClassnames = classnames('mb1 ph1 pv1 ft13 pointer tcg', {
          'bglb': activeComponentFilepath === component.filepath
        })

        return (
          <p
            className={componentClassnames}
            key={component.uniqueFilepath}
            onClick={() => onOpenComponent(component.filepath)}
          >
            <strong>{component.filename}</strong>
            <br />
            <span className='ft12'>{component.uniqueFilepath}</span>
          </p>
        )
      })
  }

  render () {
    const {
      onOpenComponentOrDirectory
    } = this.props

    return (
      <div className='pane-group pange-group-components h100'>
        <div className='pane-header'>
          <span className='ml14'>React Echo</span>
        </div>
        <div className='pane-body br1'>
          <div className='pane-row mb1'>
            <div className='form-column three-fourths'>
              <input
                type='text'
                ref='searchTerm'
                placeholder='Search Components'
                onChange={this.handleSearchTermInput}
              />
            </div>
            <div className='form-column one-fourth'>
              <button
                className='btn btn-default btn-block'
                onClick={onOpenComponentOrDirectory}
              >
                <i className='fa fa-folder' />
              </button>
            </div>
          </div>
          <div
            className='pane-row'
            style={{
              top: 74,
              left: 0,
              right: 0,
              bottom: 0,
              position: 'absolute',
              overflowY: 'auto',
              overflowX: 'hidden'
            }}
          >
            {this.renderComponentsList()}
          </div>
        </div>
      </div>
    )
  }
}
