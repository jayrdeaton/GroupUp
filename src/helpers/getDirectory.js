let runCommand = require('./runCommand'),
  removeLineBreaks = require('./removeLineBreaks');

module.exports = async () => {
  let dir = await runCommand('/bin/pwd -P');
  dir = removeLineBreaks(dir);
  return dir;
}
