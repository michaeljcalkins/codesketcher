const getFunctionFragments = require('./getFunctionFragments')

module.exports = function (componentString, componentName) {
  const functionFragments = getFunctionFragments(componentString, componentName)
  const renderFragment = functionFragments.filter(function (fragments) {
    return fragments.indexOf('render ()') > -1
  })

  return renderFragment
}
