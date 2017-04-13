'use strict';

module.exports = function (componentString, componentName) {
  var modifiedString = componentString.replace(new RegExp(componentName, 'g'), 'COMPONENT_NAME');
  modifiedString = modifiedString.replace(/(.*COMPONENT_NAME.state = {\s+)([\s\S]*?)(\s+}.*)/g, '');
  modifiedString = modifiedString.replace(/(.*COMPONENT_NAME.propTypes = {\s+)([\s\S]*?)(\s+}.*)/g, '');
  modifiedString = modifiedString.replace(/(.*COMPONENT_NAME.defaultProps = {\s+)([\s\S]*?)(\s+}.*)/g, '');
  modifiedString = modifiedString.replace(/(.*import\s+)([\s\S]*?)(\s+'.*)/g, '');

  if (modifiedString.match(/(.*export default function\s+)/g)) {
    return modifiedString.replace(/(.*export default function COMPONENT_NAME\s+)/g, '').replace(/(.*export default function\s+)/g, '').trim();
  }

  modifiedString = modifiedString.replace(/(.*export default class COMPONENT_NAME extends Component {\s+)/g, '').trim().slice(0, -1);

  var functionFragments = [];
  // Find instances of function declartions
  var matches = modifiedString.match(/.+ \(.*\) {/g);

  if (!matches) return false;

  // Go through each instance and build a string of the function
  matches.forEach(function (match) {
    var functionIndex = modifiedString.indexOf(match);

    // Rely on the initial opening brace and then the final closing brace to build the function and move on to the next
    var openBraces = 0;
    var functionString = '';
    var openBraceTrigger = false;
    for (var i = functionIndex; i < modifiedString.length; i++) {
      if (modifiedString[i] === '{') {
        openBraces++;
        openBraceTrigger = true;
      }
      if (modifiedString[i] === '}') openBraces--;
      functionString += modifiedString[i];
      if (openBraces === 0 && openBraceTrigger) break;
    }

    functionFragments.push(functionString.trim());
  });

  return functionFragments;
};