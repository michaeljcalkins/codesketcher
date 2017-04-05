const assert = require('chai').assert

const replaceFromWithPath = require('./replaceFromWithPath')

describe('replaceFromWithPath', function () {
  it('Replace from with path', function () {
    const importString = 'import autobind from \'react-autobind\''
    const newFilepath = '/Users/michaelcalkins/Code/rangersteve/node_modules/preact'
    const newImportString = replaceFromWithPath(importString, newFilepath)

    assert.equal(newImportString, 'import autobind from \'/Users/michaelcalkins/Code/rangersteve/node_modules/preact\'')
  })
})
