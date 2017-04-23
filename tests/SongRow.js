import React from 'react'

import PreviousButton from './PreviousButton'
import PlayButton from './PlayButton'
import NextButton from './NextButton'
import SongTime from './SongTime'
import Wavelength from './Wavelength'
import SoundVolume from './SoundVolume'
import SongInfo from './SongInfo'

export default function ({
	artistName,
  songName,
  albumImageUrl,
  wavelengthUrl,
  secondsRemaining
}) {
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
      <PlayButton /> 
      <NextButton />
      <SongTime 
        secondsRemaining={secondsRemaining}
      />
      <Wavelength 
        wavelengthUrl={wavelengthUrl} 
      />
      <SoundVolume />
      <SongInfo
        artistName={artistName}
        songName={songName}
        albumImageUrl={albumImageUrl}
      />
    </div>
  )
}
