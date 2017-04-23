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

  return (
		<div style={styles}>
      {secondsRemaining}
    </div>
  )
}
