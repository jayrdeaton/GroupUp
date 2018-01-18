let uuid = require('uuid');

module.exports = class GroupProject {
  constructor(data) {
    this.index = null;

    this.group = null;
    this.project = null;
    if (data) {
      if (data.index || data.index == 0) this.index = data.index;

      if (data.group) this.group = data.group;
      if (data.project) this.project = data.project;
    };
  };
};
