'use strict';

var assert = require('chai').assert;

var getFunctionFragments = require('./getFunctionFragments');

var componentString = '\nimport React, { Component, PropTypes } from \'react\'\nimport autobind from \'react-autobind\'\nimport { has, get } from \'lodash\'\n\nexport default class SongRow extends Component {\n  constructor (props) {\n    super(props)\n    autobind(this)\n  }\n\n  playSong () {\n    this.setState({ isPlaying: true })\n  }\n\n  pauseSong () {\n    this.setState({ isPlaying: false })\n  }\n\n  render () {\n    const { songName, artistName } = this.props\n\n    return (\n      <div>\n        <div>\n          { songName }\n        </div>\n        <div>\n          { artistName }\n        </div>\n      </div>\n    )\n  }\n}\n\nSongRow.state = {\n  isPlaying: false\n}\n\nSongRow.propTypes = {\n  artistName: PropTypes.string,\n  songName: PropTypes.string\n}\n\nSongRow.defaultProps = {\n  artistName: \'Papa Roach\',\n  songName: \'Blood Brothers\'\n}\n';

describe('getFunctionFragments', function () {
  it('Parse function fragments', function () {
    var functionFragments = getFunctionFragments(componentString, 'SongRow');
    assert.equal(functionFragments[0], 'constructor (props) {\n    super(props)\n    autobind(this)\n  }');

    assert.equal(functionFragments[1], 'playSong () {\n    this.setState({ isPlaying: true })\n  }');

    assert.equal(functionFragments[2], 'pauseSong () {\n    this.setState({ isPlaying: false })\n  }');

    assert.equal(functionFragments[3], 'render () {\n    const { songName, artistName } = this.props\n\n    return (\n      <div>\n        <div>\n          { songName }\n        </div>\n        <div>\n          { artistName }\n        </div>\n      </div>\n    )\n  }');
  });
});