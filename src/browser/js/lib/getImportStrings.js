"use strict";

module.exports = function (componentString) {
  var componentImportMatches = componentString.match(/(.*import\s+)([\s\S]*?)(\s+'.*)/g);
  var componentImports = [];

  if (!componentImportMatches) return [];

  componentImportMatches.forEach(function (match) {
    // import React, { Component } from 'react'
    componentImports.push(match);
  });

  return componentImports;
};