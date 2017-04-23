const assert = require('chai').assert

const getImportStrings = require('./getImportStrings')

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

describe('getImportStrings', function () {
  it('Parse class component import strings', function () {
    const importFragments = getImportStrings(componentString)
    assert.equal(importFragments[0], 'import React, { Component, PropTypes } from \'react\'')
    assert.equal(importFragments[1], 'import autobind from \'react-autobind\'')
    assert.equal(importFragments[2], 'import { has, get } from \'lodash\'')
  })
})
