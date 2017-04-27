import React from 'react'

export default function ({
  waveformUrl
}) {
  const styles = {
    width: '40%',
    height: '47px',
    float: 'left'
  }

  return <img style={styles} src={waveformUrl} />
}
