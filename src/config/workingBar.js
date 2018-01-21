let WorkingBar = require('working-bar'),
  chalk = require('chalk');

let workingBar = new WorkingBar();
workingBar.length = 80;
workingBar.character = chalk.cyan('------')
workingBar.interval = 35;

module.exports = workingBar;
