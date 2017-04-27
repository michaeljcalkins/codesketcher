import React from 'react'

export default function ({
  secondsRemaining
}) {
  const styles = {
    lineHeight: '47px',
    textAlign: 'center',
    width: '10%',
    height: '47px',
    float: 'left'
  }

  const minutes = Math.floor(secondsRemaining / 60)
  const seconds = secondsRemaining - minutes * 60

  return (
    <div style={styles}>
      {minutes}:{seconds}
    </div>
  )
}
