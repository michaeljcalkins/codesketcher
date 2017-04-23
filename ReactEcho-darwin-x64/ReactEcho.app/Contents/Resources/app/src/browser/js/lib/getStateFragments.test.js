'use strict';

var assert = require('chai').assert;

var getStateFragments = require('./getStateFragments');

var componentString = '\nimport React, { Component, PropTypes } from \'react\'\nimport autobind from \'react-autobind\'\nimport { has, get } from \'lodash\'\n\nexport default class SongRow extends Component {\n  constructor (props) {\n    super(props)\n    autobind(this)\n  }\n\n  playSong () {\n    this.setState({ isPlaying: true })\n  }\n\n  pauseSong () {\n    this.setState({ isPlaying: false })\n  }\n\n  render () {\n    const { songName, artistName } = this.props\n\n    return (\n      <div>\n        <div>\n          { songName }\n        </div>\n        <div>\n          { artistName }\n        </div>\n      </div>\n    )\n  }\n}\n\nSongRow.state = {\n  isPlaying: false,\n  testState: \'testValue\'\n}\n\nSongRow.propTypes = {\n  artistName: PropTypes.string,\n  songName: PropTypes.string\n}\n\nSongRow.defaultProps = {\n  artistName: \'Papa Roach\',\n  songName: \'Blood Brothers\'\n}\n';

describe('getStateFragments', function () {
  it('Parse state fragments', function () {
    var fragments = getStateFragments(componentString, 'SongRow');

    assert.equal(fragments[0].name, 'isPlaying');
    assert.equal(fragments[0].value, 'false');
    assert.equal(fragments[1].name, 'testState');
    assert.equal(fragments[1].value, 'testValue');
  });
});