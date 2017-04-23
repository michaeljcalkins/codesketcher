'use strict';

var assert = require('chai').assert;

var getPropertyFragments = require('./getPropertyFragments');

var componentString = '\nimport React, { Component, PropTypes } from \'react\'\nimport autobind from \'react-autobind\'\nimport { has, get } from \'lodash\'\n\nexport default class SongRow extends Component {\n  constructor (props) {\n    super(props)\n    autobind(this)\n  }\n\n  playSong () {\n    this.setState({ isPlaying: true })\n  }\n\n  pauseSong () {\n    this.setState({ isPlaying: false })\n  }\n\n  render () {\n    const { songName, artistName } = this.props\n\n    return (\n      <div>\n        <div>\n          { songName }\n        </div>\n        <div>\n          { artistName }\n        </div>\n      </div>\n    )\n  }\n}\n\nSongRow.state = {\n  isPlaying: false\n}\n\nSongRow.propTypes = {\n  artistName: PropTypes.string,\n  songName: PropTypes.string.isRequired\n}\n\nSongRow.defaultProps = {\n  artistName: \'Papa Roach\',\n  songName: \'Blood Brothers\'\n}\n';

var altComponentString = '\nimport React, { PureComponent, PropTypes } from \'react\'\n\nexport default class HudHealth extends PureComponent {\n  static propTypes = {\n    health: PropTypes.number.isRequired\n  }\n\n  static defaultProps = {\n    health: 0\n  }\n\n  render () {\n    return (\n      <div className=\'hud-health hud-item\'>{ this.props.health }</div>\n    )\n  }\n}\n';

var functionalComponentString = '\nimport React, { PropTypes } from \'react\'\n\nexport default function HudSettingsButton ({\n  onButtonClick\n}) {\n  return (\n    <div\n      className=\'hud-change-weapons-button hud-item\'\n      onClick={onButtonClick}\n    >\n      Weapons\n    </div>\n  )\n}\n\nHudSettingsButton.propTypes = {\n  onButtonClick: PropTypes.func.isRequired\n}\n';

describe('getPropertyFragments', function () {
  it('Parse property fragments defined below', function () {
    var fragments = getPropertyFragments(componentString, 'SongRow');
    assert.equal(fragments[0].name, 'artistName');
    assert.equal(fragments[0].type, 'string');
    assert.equal(fragments[0].default, 'Papa Roach');
    assert.equal(fragments[0].required, false);
    assert.equal(fragments[1].name, 'songName');
    assert.equal(fragments[1].type, 'string');
    assert.equal(fragments[1].default, 'Blood Brothers');
    assert.equal(fragments[1].required, true);
  });

  it('Parse property fragments defined in class', function () {
    var fragments = getPropertyFragments(altComponentString, 'HudHealth');
    assert.equal(fragments[0].name, 'health');
    assert.equal(fragments[0].type, 'number');
    assert.equal(fragments[0].default, 0);
    assert.equal(fragments[0].required, true);
  });

  it('Parse functional property fragments defined in a functional', function () {
    var fragments = getPropertyFragments(functionalComponentString, 'HudSettingsButton');
    assert.equal(fragments[0].name, 'onButtonClick');
    assert.equal(fragments[0].type, 'func');
    assert.equal(fragments[0].default, '');
    assert.equal(fragments[0].required, true);
  });
});