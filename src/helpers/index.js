let changeDirectory = require('./changeDirectory'),
  getDirectory = require('./getDirectory'),
  getGitDataFromDirectory = require('./getGitDataFromDirectory')
  getNameFromDirectory = require('./getNameFromDirectory'),
  prettyPrintObject = require('./prettyPrintObject'),
  removeLastLineBreak = require('./removeLastLineBreak'),
  removeLineBreaks = require('./removeLineBreaks'),
  runCommand = require('./runCommand'),
  updateObject = require('./updateObject'),
  userDirectoryShort = require('./userDirectoryShort'),
  userDirectoryLong = require('./userDirectoryLong'),
  validateProjectDirectory = require('./validateProjectDirectory');

module.exports = { changeDirectory, getDirectory, getGitDataFromDirectory, getNameFromDirectory, prettyPrintObject, removeLastLineBreak, removeLineBreaks, runCommand, updateObject, userDirectoryShort, userDirectoryLong, validateProjectDirectory };
