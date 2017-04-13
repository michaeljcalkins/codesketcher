const assert = require('chai').assert

const getFunctionFragments = require('./getFunctionFragments')

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

describe('getFunctionFragments', function () {
  it('Parse function fragments', function () {
    const functionFragments = getFunctionFragments(componentString, 'SongRow')
    assert.equal(functionFragments[0], `constructor (props) {
    super(props)
    autobind(this)
  }`)

    assert.equal(functionFragments[1], `playSong () {
    this.setState({ isPlaying: true })
  }`)

    assert.equal(functionFragments[2], `pauseSong () {
    this.setState({ isPlaying: false })
  }`)

    assert.equal(functionFragments[3], `render () {
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
  }`)
  })
})
