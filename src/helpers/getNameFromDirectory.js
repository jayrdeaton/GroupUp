module.exports = (dir) => {
  let components = dir.split('/');
  return components[components.length - 1];
};
