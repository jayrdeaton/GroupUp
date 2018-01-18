let uuid = require('uuid');

module.exports = class Command {
  constructor(data) {
    this.index = null;
    this.string = null;
    this.verbose = false;

    this.group = null;
    this.project = null;

    if (data) {
      if (data.index || data.index == 0) this.index = data.index;
      if (data.string) this.string = data.string;
      if (data.verbose) this.verbose = data.verbose;

      if (data.group) this.group = data.group;
      if (data.project) this.project = data.project;
    };
  };
};
