import React from 'react'

export default function ({
  wavelengthUrl
}) {
  const styles = {
    width: '40%',
    height: '47px',
    float: 'left'
  }
    
  return <img style={styles} src={wavelengthUrl} />
}
