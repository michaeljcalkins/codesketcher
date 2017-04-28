import React from 'react'

export default function ({
  isPlaying,
  onTogglePlay
}) {
  const styles = {
    fontSize: '25px',
    lineHeight: '47px',
    textAlign: 'center',
    width: '5%',
    height: '47px',
    float: 'left'
  }

  if (isPlaying) {
    return (
      <div style={styles} onClick={onTogglePlay}>
        <i className='fa fa-pause' />
      </div>
    )
  }

  return (
    <div style={styles} onClick={onTogglePlay}>
      <i className='fa fa-play' />
    </div>
  )
}
