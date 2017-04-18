import React from 'react'

export default function ChildComponent ({
	testProp1
}) {
	return (
   	<div>
    	CHILD - {testProp1}
    </div>
  )
}

ChildComponent.defaultProps = {
	testProp1: 'NO VALUE YET'
}