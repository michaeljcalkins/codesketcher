import React from 'react'
import autobind from 'react-autobind'

export default class Header extends React.Component {
  constructor (props) {
    super(props)
    autobind(this)
  }

  render () {
    const {
      onOpenComponentOrDirectory,
      onNewComponent,
      onSaveComponent,
      onAddTemplate
    } = this.props

    return (
      <nav className='navbar navbar-default navbar-fixed-top'>
        <div className='header-title-bar' id='display-project-path' />
        <div className='container-fluid'>
          <div id='navbar' className='navbar-collapse collapse'>
            <ul className='nav navbar-nav text-center'>
              <li className='pointer' onClick={onOpenComponentOrDirectory}>
                <a>
                  <i className='fa fa-folder' />
                  Open
                </a>
              </li>
              <li className='pointer' onClick={onNewComponent}>
                <a>
                  <i className='fa fa-plus-square' />
                  New
                </a>
              </li>
              <li className='pointer' onClick={onSaveComponent}>
                <a>
                  <i className='fa fa-save' />
                  Save
                </a>
              </li>
              <li style={{width: '40px'}} />
              <li className='dropdown'>
                <a className='dropdown-toggle' data-toggle='dropdown'>
                  <i className='fa fa-code' />
                  Templates <span className='caret' />
                </a>
                <ul className='dropdown-menu'>
                  <li onClick={() => onAddTemplate(0)}><a>Function Component</a></li>
                  <li onClick={() => onAddTemplate(1)}><a>Class Component</a></li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    )
  }
}
