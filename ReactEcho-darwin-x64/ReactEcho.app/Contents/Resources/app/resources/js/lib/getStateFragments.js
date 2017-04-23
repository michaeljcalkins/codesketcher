module.exports = function (componentString, componentName) {
  var modifiedString = componentString.replace(new RegExp(componentName, 'g'), 'COMPONENT_NAME')
  var matches = modifiedString.match(/(.*COMPONENT_NAME.state = {\s+)([\s\S]*?)(\s+}.*)/)

  if (!matches) return []

  var stateFragments = []
  var fragment = matches[0].replace('COMPONENT_NAME.state = ', '')
  var resultingStates = eval('(' + fragment + ')')
  Object.keys(resultingStates).forEach(function (key) {
    stateFragments.push({
      name: key,
      value: typeof resultingStates[key] === 'boolean'
        ? JSON.stringify(resultingStates[key])
        : resultingStates[key]
    })
  })

  return stateFragments
}
