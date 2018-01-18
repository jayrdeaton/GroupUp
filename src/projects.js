let chalk = require('chalk'),
  helpers = require('./helpers'),
  getName = helpers.getNameFromDirectory,
  getGitData = helpers.getGitDataFromDirectory,
  models = require('./models'),
  Project = models.Project,
  store = require('./store');

let create = async (projectDir) => {
  if (store.findOne('projects', { projectDir })) {
    console.log(chalk.red(`Found project for ${projectDir}`));
    return null;
  };

  let gitData = await getGitData(projectDir);
  let gitBranch = gitData.branch;
  let gitURL = gitData.url;
  let name = getName(projectDir);

  let project = new Project({ gitBranch, gitURL, name, projectDir });
  store.add('projects', project);

  return project;
};

let remove = (projectDir) => {
  let project = store.findOne('projects', { projectDir });

  if (!project) {
    console.log(chalk.red(`No stored projects at path ${projectDir}`));
    return null;
  };

  store.removeAll('projects', { uuid: project.uuid });
  store.removeAll('commands', { project: project.uuid });
  let groupProjects = store.findAll('groupProjects', { project: project.uuid });
  for (let groupProject of groupProjects) {
    if (store.findAll('groupProjects', { group: groupProject.group }).length == 1) store.removeAll('groups', { uuid: groupProject.group });
  };
  store.removeAll('groupProjects', { project: project.uuid });
  return true;
};

module.exports = { create, remove };
