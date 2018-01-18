let username = require("os").userInfo().username,
  userDir = '/Users/' + username;

module.exports = (string) => {
  string = string.replace('~', userDir);
  return string;
};
