const assert = require('chai').assert

const getImportFragments = require('./getImportFragments')

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

describe('getImportFragments', function () {
  it('Parse class component import fragments', function () {
    const importFragments = getImportFragments(componentString)
    assert.equal(importFragments[0].variables, 'React, { Component, PropTypes }')
    assert.equal(importFragments[0].from, 'react')
    assert.equal(importFragments[1].variables, 'autobind')
    assert.equal(importFragments[1].from, 'react-autobind')
    assert.equal(importFragments[2].variables, '{ has, get }')
    assert.equal(importFragments[2].from, 'lodash')
  })

  it('Parse function component import fragments', function () {
    const importFragments = getImportFragments(functionalComponentString)
    assert.equal(importFragments[0].variables, 'React, { PropTypes }')
    assert.equal(importFragments[0].from, 'react')
  })
})
