module.exports = class Configuration {
  constructor(data) {
    this.baseURL = '~/Developer/'

    if (data) {
      if (data.baseURL) this.baseURL = data.baseURL;
    };
  };
};
