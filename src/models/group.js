let uuid = require('uuid');

module.exports = class Group {
  constructor(data) {
    this.createdAt = Date.now();
    this.enabled = true;
    this.info = null;
    this.name = null;
    this.updatedAt = Date.now();
    this.uuid = uuid.v1();

    if (data) {
      if (data.createdAt) this.createdAt = data.createdAt;
      if (data.enabled) this.enabled = data.enabled;
      if (data.info) this.info = data.info;
      if (data.name) this.name = data.name;
      if (data.updatedAt) this.updatedAt = data.updatedAt;
      if (data.uuid) this.uuid = data.uuid;
    };
  };
};
