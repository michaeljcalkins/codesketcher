const assert = require('chai').assert

const getStateFragments = require('./getStateFragments')

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
  isPlaying: false,
  testState: 'testValue'
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

describe('getStateFragments', function () {
  it('Parse state fragments', function () {
    const fragments = getStateFragments(componentString, 'SongRow')

    assert.equal(fragments[0].name, 'isPlaying')
    assert.equal(fragments[0].value, 'false')
    assert.equal(fragments[1].name, 'testState')
    assert.equal(fragments[1].value, 'testValue')
  })
})
