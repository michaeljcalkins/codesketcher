import React from 'react'
import autobind from 'react-autobind'

import ImageComponent from './ImageComponent'
import NameComponent from './NameComponent'

export default function ({
	profileUrl,
  name
}) {
  const styles = {
    background: '#3498db',
    borderRadius: '2px',
    fontFamily: 'Lucida Grande',
    color: 'white',
    display: 'inline-block',
    height: '300px',
    margin: '1rem',
    position: 'relative',
    textAlign: 'center',
    width: '300px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)'
  }
  
	return (      
  	<div style={styles}>
      <ImageComponent src={profileUrl} />
			<NameComponent name={name} />
    </div>
  )
}
