const getFunctionFragments = require('./getFunctionFragments')

module.exports = function (componentString, componentName) {
  const functionFragments = getFunctionFragments(componentString, componentName)
  const contructorFragment = functionFragments.filter(function (fragments) {
    return fragments.indexOf('constructor (props)') > -1
  })

  return contructorFragment
}
