module.exports = (object) => {
  for (let key of Object.keys(object)) {
    if (Date.parse(object[key])) console.log('date')
  };
};
