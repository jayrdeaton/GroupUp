let fs = require('fs'),
  username = require("os").userInfo().username,
  storeDir = `/users/${username}/.config/groupup`,
  models = require('./models'),
  Configuration = models.Configuration;

let open = async () => {
  if (fs.existsSync(storeDir)) {
    data = await read();
  } else {
    data = await setup()
  };
  process.store = data;
};
let read = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(`${storeDir}/data.json`, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data))
      };
    });
  });
};
let setup = () => {
  return new Promise((resolve, reject) => {
    fs.mkdir(storeDir, (err, data) => {
      if (err) {
        reject(err);
      } else {
        let configuration = new Configuration();
        let data = {
          configuration,
          commands: [],
          groups: [],
          groupProjects: [],
          projects: []
        };
        save(data).then((data) => {
          resolve(data);
        }).catch((err) => {
          reject(err);
        });
      };
    });
  });
};
let save = (data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(`${storeDir}/data.json`, JSON.stringify(data, null, 2), (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      };
    });
  });
};
let findOne = (collection, query) => {
  let objects = process.store[collection];
  if (!objects) return null;
  for (let object of objects) {
    let match = true;
    for (let key of Object.keys(query)) {
      if (object[key] !== query[key]) {
        match = false;
      };
    };
    if (match) {
      return object;
    };
  };
};
let findAll = (collection, query) => {
  let objects = process.store[collection];
  if (!objects) return null;
  if (!query) return objects;
  let results = [];
  for (let [index, object] of objects.entries()) {
    let match = true;
    for (let key of Object.keys(query)) {
      if (object[key] !== query[key]) {
        match = false;
      };
    };
    if (match) {
      results.push(object);
    };
  };
  return results;
};
let add = (collection, object) => {
  if (process.store[collection].length >= 0) {
    process.store[collection].push(object);
  };
};
let removeAll = (collection, query) => {
  let objects = process.store[collection];
  if (!objects) return null;
  if (!query) return null;
  let results = [];
  for (let [index, object] of objects.entries()) {
    let match = true;
    for (let key of Object.keys(query)) {
      if (object[key] !== query[key]) {
        match = false;
      };
    };
    if (match) {
      results.push(index);
    };
  };
  results.reverse();
  for (let result of results) {
    process.store[collection].splice(result, 1);
  };
};

let reset = () => {
  let configuration = new Configuration();
  let data = {
    configuration,
    commands: [],
    groups: [],
    groupProjects: [],
    projects: []
  };
  save(data);
};

module.exports = { open, save, findOne, findAll, add, removeAll, reset };
