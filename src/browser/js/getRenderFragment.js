const getFunctionFragments = require('./getFunctionFragments')
const _ = require('lodash')

module.exports = function (componentString, componentName) {
  const functionFragments = getFunctionFragments(componentString, componentName)

  if (_.isString(functionFragments)) return functionFragments

  const renderFragment = functionFragments.filter(function (fragments) {
    return fragments.indexOf('render ()') > -1
  })

  return renderFragment
}
