'use strict';

module.exports = function (importString, newFilepath) {
  return importString.replace(/from(.*)/g, 'from \'' + newFilepath + '\'');
};