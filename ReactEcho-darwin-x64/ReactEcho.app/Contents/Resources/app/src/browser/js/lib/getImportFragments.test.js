'use strict';

var assert = require('chai').assert;

var getImportFragments = require('./getImportFragments');

var componentString = '\nimport React, { Component, PropTypes } from \'react\'\nimport autobind from \'react-autobind\'\nimport { has, get } from \'lodash\'\n\nexport default class SongRow extends Component {\n  constructor (props) {\n    super(props)\n    autobind(this)\n  }\n\n  playSong () {\n    this.setState({ isPlaying: true })\n  }\n\n  pauseSong () {\n    this.setState({ isPlaying: false })\n  }\n\n  render () {\n    const { songName, artistName } = this.props\n\n    return (\n      <div>\n        <div>\n          { songName }\n        </div>\n        <div>\n          { artistName }\n        </div>\n      </div>\n    )\n  }\n}\n\nSongRow.state = {\n  isPlaying: false\n}\n\nSongRow.propTypes = {\n  artistName: PropTypes.string,\n  songName: PropTypes.string\n}\n\nSongRow.defaultProps = {\n  artistName: \'Papa Roach\',\n  songName: \'Blood Brothers\'\n}\n';

var functionalComponentString = '\nimport React, { PropTypes } from \'react\'\n\nexport default function HudChangeWeaponsButton ({\n  onButtonClick\n}) {\n  return (\n    <div\n      className=\'hud-change-weapons-button hud-item\'\n      onClick={onButtonClick}\n    >\n      Weapons\n    </div>\n  )\n}\n\nHudChangeWeaponsButton.propTypes = {\n  onButtonClick: PropTypes.func.isRequired\n}\n';

describe('getImportFragments', function () {
  it('Parse class component import fragments', function () {
    var importFragments = getImportFragments(componentString);
    assert.equal(importFragments[0].variables, 'React, { Component, PropTypes }');
    assert.equal(importFragments[0].from, 'react');
    assert.equal(importFragments[1].variables, 'autobind');
    assert.equal(importFragments[1].from, 'react-autobind');
    assert.equal(importFragments[2].variables, '{ has, get }');
    assert.equal(importFragments[2].from, 'lodash');
  });

  it('Parse function component import fragments', function () {
    var importFragments = getImportFragments(functionalComponentString);
    assert.equal(importFragments[0].variables, 'React, { PropTypes }');
    assert.equal(importFragments[0].from, 'react');
  });
});