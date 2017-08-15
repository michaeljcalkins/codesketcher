import React from 'react'
import autobind from 'react-autobind'

import PreviousButton from './PreviousButton'
import PlayButton from './PlayButton'
import NextButton from './NextButton'
import SongTime from './SongTime'
import Wavelength from './Wavelength'
import SoundVolume from './SoundVolume'
import SongInfo from './SongInfo'

export default class SongRow extends React.Component {
  constructor(props) {
    super(props)
    autobind(this)

    this.state = {
      isPlaying: false
    }
  }

  handleTogglePlay() {
    this.setState({
      isPlaying: !this.state.isPlaying
    })
  }

  render() {
    const { artistName, songName, albumImageUrl, waveformUrl, secondsRemaining } = this.props

    const { isPlaying } = this.state

    const styles = {
      background: '#fff',
      borderRadius: '2px',
      fontFamily: 'Lucida Grande',
      color: '#222',
      display: 'inline-block',
      height: '57px',
      margin: '1rem',
      padding: '5px',
      position: 'relative',
      textAlign: 'left',
      width: '100%',
      boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)'
    }

    return (
      <div style={styles}>
        <PreviousButton />
        <PlayButton onTogglePlay={this.handleTogglePlay} isPlaying={isPlaying} />
        <NextButton />
        <SongTime secondsRemaining={secondsRemaining} />
        <Wavelength waveformUrl={waveformUrl} />
        <SoundVolume />
        <SongInfo artistName={artistName} songName={songName} albumImageUrl={albumImageUrl} />
      </div>
    )
  }
}
