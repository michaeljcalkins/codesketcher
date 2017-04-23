'use strict';

var assert = require('chai').assert;

var replaceFromWithPath = require('./replaceFromWithPath');

describe('replaceFromWithPath', function () {
  it('Replace from with path', function () {
    var importString = 'import autobind from \'react-autobind\'';
    var newFilepath = '/Users/michaelcalkins/Code/rangersteve/node_modules/preact';
    var newImportString = replaceFromWithPath(importString, newFilepath);

    assert.equal(newImportString, 'import autobind from \'/Users/michaelcalkins/Code/rangersteve/node_modules/preact\'');
  });
});