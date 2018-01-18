let runCommand = require('./runCommand'),
  removeLineBreaks = require('./removeLineBreaks');

module.exports = async (dir) => {
  let directory = await runCommand(`cd ${dir}; /bin/pwd -P`);
  directory = removeLineBreaks(directory);
  return directory;
};
