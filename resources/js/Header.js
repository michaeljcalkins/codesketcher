import React from 'react'
import autobind from 'react-autobind'

export default class Header extends React.Component {
  constructor (props) {
    super(props)
    autobind(this)
  }

  render () {
    const { onOpenComponentOrDirectory } = this.props

    return (
      <nav className='navbar navbar-default navbar-fixed-top'>
        <div className='header-title-bar' id='display-project-path' />
        <div className='container-fluid'>
          <div id='navbar' className='navbar-collapse collapse'>
            <ul className='nav navbar-nav text-center'>
              <li>
                <a onClick={onOpenComponentOrDirectory}>
                  <i className='fa fa-folder' />
                  Open
                </a>
              </li>
              <li className='pointer'>
                <a>
                  <i className='fa fa-plus-square' />
                  Create
                </a>
              </li>
              <li>
                <a id='save-file'>
                  <i className='fa fa-save' />
                      Save
                    </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    )
  }
    }
