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

describe('getPropertyFragments', function () {
  it('Parse property fragments', function () {
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
})
