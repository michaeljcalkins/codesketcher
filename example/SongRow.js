import React from 'react'

import PlayButton from './PlayButton'

export default function ({
  songName
}) {
  return (
    <div>
      { songName }
      <PlayButton />
    </div>
  )
}
