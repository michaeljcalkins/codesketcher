import React from 'react'

import getTimeStringFromSeconds from './lib/getTimeStringFromSeconds'

export default function({ secondsRemaining }) {
  const styles = {
    lineHeight: '47px',
    textAlign: 'center',
    width: '10%',
    height: '47px',
    float: 'left'
  }

  const time = getTimeStringFromSeconds(secondsRemaining)

  return (
    <div style={styles}>
      {time}
    </div>
  )
}
