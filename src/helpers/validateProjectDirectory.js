let fs = require('fs'),
  chalk = require('chalk');

module.exports = (dir) => {
  if (fs.existsSync(`${dir}/.git`)) {
    return true;
  } else {
    console.log(chalk.red(`${dir} is not a valid project directory`));
    return false;
  };
};
