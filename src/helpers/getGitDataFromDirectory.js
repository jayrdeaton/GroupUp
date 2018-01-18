let fs = require('fs'),
  gitConfig = require('git-config'),
  removeLineBreaks = require('./removeLineBreaks');

module.exports = (dir) => {
  return new Promise((resolve, reject) => {
    dir = userDirectoryLong(dir);
    let config = gitConfig.sync(`${dir}/.git/config`);
    let url = config['remote "origin"'].url;

    fs.readFile(`${dir}/.git/head`, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        data = removeLineBreaks(data);
        let branch = data.replace('ref: refs/heads/', '');
        resolve({ branch, url });
      };
    });
  });
};
