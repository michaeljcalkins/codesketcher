import React from 'react'

export default function ({
  artistName,
  songName,
  albumImageUrl
}) {
  const styles = {
    container: {
      float: 'left',
      width: '25%'
    },
    image: {
      width: '47px',
      height: '47px',
      float: 'left'
    },
    infoContainer: {
      marginLeft: '10px',
      marginRight: '10px',
      float: 'left',
      maxWidth: '200px'
    },
    songName: {
      marginTop: '5px'
    },
    artistName: {
      marginTop: '3px',
      color: '#999'
    }
  }
  
  return (
		<div style={styles.container}>
      <img style={styles.image} src={albumImageUrl} />
      <div style={styles.infoContainer}>
        <div style={styles.songName}>{songName}</div>
        <div style={styles.artistName}>{artistName}</div>
      </div>
    </div>
  )
}
