module.exports = (object, updates) => {
  for (let key of Object.keys(updates)) {
    if (Object.keys(object).includes(key)) object[key] = updates[key];
  };
  if (Object.keys(object).includes('updatedAt')) object.updatedAt = Date.now();
};
