const assert = require('chai').assert

const getPropertyFragments = require('./getPropertyFragments')

const componentString = `
import React, { Component, PropTypes } from 'react'
import autobind from 'react-autobind'
import { has, get } from 'lodash'

export default class SongRow extends Component {
  constructor (props) {
    super(props)
    autobind(this)
  }

  playSong () {
    this.setState({ isPlaying: true })
  }

  pauseSong () {
    this.setState({ isPlaying: false })
  }

  render () {
    const { songName, artistName } = this.props

    return (
      <div>
        <div>
          { songName }
        </div>
        <div>
          { artistName }
        </div>
      </div>
    )
  }
}

SongRow.state = {
  isPlaying: false
}

SongRow.propTypes = {
  artistName: PropTypes.string,
  songName: PropTypes.string.isRequired
}

SongRow.defaultProps = {
  artistName: 'Papa Roach',
  songName: 'Blood Brothers'
}
`

const altComponentString = `
import React, { PureComponent, PropTypes } from 'react'

export default class HudHealth extends PureComponent {
  static propTypes = {
    health: PropTypes.number.isRequired
  }

  static defaultProps = {
    health: 0
  }

  render () {
    return (
      <div className='hud-health hud-item'>{ this.props.health }</div>
    )
  }
}
`

const functionalComponentString = `
import React, { PropTypes } from 'react'

export default function HudSettingsButton ({
  onButtonClick
}) {
  return (
    <div
      className='hud-change-weapons-button hud-item'
      onClick={onButtonClick}
    >
      Weapons
    </div>
  )
}

HudSettingsButton.propTypes = {
  onButtonClick: PropTypes.func.isRequired
}
`

describe('getPropertyFragments', function () {
  it('Parse property fragments defined below', function () {
    const fragments = getPropertyFragments(componentString, 'SongRow')
    assert.equal(fragments[0].name, 'artistName')
    assert.equal(fragments[0].type, 'string')
    assert.equal(fragments[0].default, 'Papa Roach')
    assert.equal(fragments[0].required, false)
    assert.equal(fragments[1].name, 'songName')
    assert.equal(fragments[1].type, 'string')
    assert.equal(fragments[1].default, 'Blood Brothers')
    assert.equal(fragments[1].required, true)
  })

  it('Parse property fragments defined in class', function () {
    const fragments = getPropertyFragments(altComponentString, 'HudHealth')
    assert.equal(fragments[0].name, 'health')
    assert.equal(fragments[0].type, 'number')
    assert.equal(fragments[0].default, 0)
    assert.equal(fragments[0].required, true)
  })

  it('Parse functional property fragments defined in a functional', function () {
    const fragments = getPropertyFragments(functionalComponentString, 'HudSettingsButton')
    assert.equal(fragments[0].name, 'onButtonClick')
    assert.equal(fragments[0].type, 'func')
    assert.equal(fragments[0].default, '')
    assert.equal(fragments[0].required, true)
  })
})
