'use strict';

var assert = require('chai').assert;

var getConstructorFragment = require('./getConstructorFragment');

var componentString = '\nimport React, { Component, PropTypes } from \'react\'\nimport autobind from \'react-autobind\'\nimport { has, get } from \'lodash\'\n\nexport default class SongRow extends Component {\n  constructor (props) {\n    super(props)\n    autobind(this)\n  }\n\n  playSong () {\n    this.setState({ isPlaying: true })\n  }\n\n  pauseSong () {\n    this.setState({ isPlaying: false })\n  }\n\n  render () {\n    const { songName, artistName } = this.props\n\n    return (\n      <div>\n        <div>\n          { songName }\n        </div>\n        <div>\n          { artistName }\n        </div>\n      </div>\n    )\n  }\n}\n\nSongRow.state = {\n  isPlaying: false\n}\n\nSongRow.propTypes = {\n  artistName: PropTypes.string,\n  songName: PropTypes.string\n}\n\nSongRow.defaultProps = {\n  artistName: \'Papa Roach\',\n  songName: \'Blood Brothers\'\n}\n';

var functionalComponentString = '\nimport React, { PropTypes } from \'react\'\n\nexport default function HudChangeWeaponsButton ({\n  onButtonClick\n}) {\n  return (\n    <div\n      className=\'hud-change-weapons-button hud-item\'\n      onClick={onButtonClick}\n    >\n      Weapons\n    </div>\n  )\n}\n\nHudChangeWeaponsButton.propTypes = {\n  onButtonClick: PropTypes.func.isRequired\n}\n';

describe('getConstructorFragment', function () {
  it('Parse class constructor function fragment', function () {
    var constructorFragment = getConstructorFragment(componentString, 'SongRow');
    assert.equal(constructorFragment, 'constructor (props) {\n    super(props)\n    autobind(this)\n  }');
  });

  it('Parse function constructor function fragment', function () {
    var constructorFragment = getConstructorFragment(functionalComponentString, 'HudChangeWeaponsButton');
    assert.equal(constructorFragment, '');
  });
});