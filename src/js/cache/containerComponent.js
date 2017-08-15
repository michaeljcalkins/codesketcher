
    import React from 'react'
    import ReactDOM from 'react-dom'

    import transpiledReactComponent from '/Users/michaelcalkins/Code/reactecho/tests/SongRow.js'
    console.log(transpiledReactComponent)
    window.componentInstance = ReactDOM.render(
      React.createElement(transpiledReactComponent, {}),
      document.getElementById('component-preview')
    )
    