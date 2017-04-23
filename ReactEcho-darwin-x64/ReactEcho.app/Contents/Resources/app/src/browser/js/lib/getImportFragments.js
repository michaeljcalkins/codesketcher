'use strict';

module.exports = function (componentString) {
  var componentImportMatches = componentString.match(/(.*import\s+)([\s\S]*?)(\s+'.*)/g);
  var componentImports = [];

  componentImportMatches.forEach(function (match) {
    // import React, { Component } from 'react'
    var importFragments = match.split(' from ');
    var fromFragment = importFragments[1].replace(/'/g, '').trim();
    var variablesFragment = importFragments[0].replace('import ', '').trim();

    componentImports.push({
      variables: variablesFragment,
      from: fromFragment
    });
  });

  return componentImports;
};