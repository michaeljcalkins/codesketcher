import React from 'react'

export default function ({
  src
}) {
  const styles = {
		marginBottom: '15px',
    float: 'right'
  }
  
	return (
    <div style={styles}>
      <img src={src} width="150" />
    </div>
  )
}