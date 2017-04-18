import React from 'react'

export default function ({
  name,
  phone,
  job
}) {
  const styles = {
		float: 'left'
  }
  
	return ( 
    <div style={styles}>
      {name}<br />
      {phone}<br />
      {job}
    </div>
  )
}