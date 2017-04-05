const assert = require('chai').assert

const getConstructorFragment = require('./getConstructorFragment')

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
  songName: PropTypes.string
}

SongRow.defaultProps = {
  artistName: 'Papa Roach',
  songName: 'Blood Brothers'
}
`

const functionalComponentString = `
import React, { PropTypes } from 'react'

export default function HudChangeWeaponsButton ({
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

HudChangeWeaponsButton.propTypes = {
  onButtonClick: PropTypes.func.isRequired
}
`

describe('getConstructorFragment', function () {
  it('Parse class constructor function fragment', function () {
    const constructorFragment = getConstructorFragment(componentString, 'SongRow')
    assert.equal(constructorFragment, `constructor (props) {
    super(props)
    autobind(this)
  }`)
  })

  it('Parse function constructor function fragment', function () {
    const constructorFragment = getConstructorFragment(functionalComponentString, 'HudChangeWeaponsButton')
    assert.equal(constructorFragment, '')
  })
})
