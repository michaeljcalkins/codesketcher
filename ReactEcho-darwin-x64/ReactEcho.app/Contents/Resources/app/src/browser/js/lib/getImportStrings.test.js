'use strict';

var assert = require('chai').assert;

var getImportStrings = require('./getImportStrings');

var componentString = '\nimport React, { Component, PropTypes } from \'react\'\nimport autobind from \'react-autobind\'\nimport { has, get } from \'lodash\'\n\nexport default class SongRow extends Component {\n  constructor (props) {\n    super(props)\n    autobind(this)\n  }\n\n  playSong () {\n    this.setState({ isPlaying: true })\n  }\n\n  pauseSong () {\n    this.setState({ isPlaying: false })\n  }\n\n  render () {\n    const { songName, artistName } = this.props\n\n    return (\n      <div>\n        <div>\n          { songName }\n        </div>\n        <div>\n          { artistName }\n        </div>\n      </div>\n    )\n  }\n}\n\nSongRow.state = {\n  isPlaying: false\n}\n\nSongRow.propTypes = {\n  artistName: PropTypes.string,\n  songName: PropTypes.string\n}\n\nSongRow.defaultProps = {\n  artistName: \'Papa Roach\',\n  songName: \'Blood Brothers\'\n}\n';

describe('getImportStrings', function () {
  it('Parse class component import strings', function () {
    var importFragments = getImportStrings(componentString);
    assert.equal(importFragments[0], 'import React, { Component, PropTypes } from \'react\'');
    assert.equal(importFragments[1], 'import autobind from \'react-autobind\'');
    assert.equal(importFragments[2], 'import { has, get } from \'lodash\'');
  });
});