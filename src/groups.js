let chalk = require('chalk'),
  store = require('./store'),
  models = require('./models'),
  Group = models.Group,
  GroupProject = models.GroupProject;

let groupProject = (project, groupName) => {
  let group = store.findOne('groups', { name: groupName });
  let groupProjects = [];
  if (group) {
    groupProjects = store.findAll('groupProjects', { group: group.uuid });
  } else {
    group = new Group({ name: groupName });
    store.add('groups', group);
    console.log(chalk.green(`Created group ${groupName}`));
  };
  let groupProject = store.findOne('groupProjects', { group: group.uuid, project: project.uuid });
  if (groupProject) {
    console.log(chalk.red(`${project.name} already belongs to group ${group.name}`));
    return null;
  };
  groupProject = new GroupProject({ index: groupProjects.length, group: group.uuid, project: project.uuid });
  store.add('groupProjects', groupProject);
  console.log(chalk.green(`Added ${project.name} to group ${group.name}`));
  return group;
};

module.exports = { groupProject };
