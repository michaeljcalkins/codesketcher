import React from 'react'
import autobind from 'react-autobind'

import ImageComponent from './ImageComponent'
import NameComponent from './NameComponent'

export default function ({
	src,
  name,
  phone,
  job
}) {
  const styles = {
    background: '#3498db',
    borderRadius: '2px',
    fontFamily: 'Lucida Grande',
    color: 'white',
    display: 'inline-block',
    height: '170px',
    margin: '1rem',
    padding: '15px',
    position: 'relative',
    textAlign: 'left',
    width: '300px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)'
  }
  
	return (      
  	<div style={styles}>
      <ImageComponent style={styles.image} src={src} />
			<NameComponent 
        style={styles.name} 
        name={name} 
        phone={phone}
        job={job}
      />
    </div>
  )
}
