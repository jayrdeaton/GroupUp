module.exports = (string) => {
  string = string.replace(/(\r\n|\n|\r)$/,'');
  return string;
};
