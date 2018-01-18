let helpers = require('./helpers'),
  runCommand = helpers.runCommand,
  store = require('./store'),
  chalk = require('chalk'),
  WorkingBar = require('working-bar');

let working = new WorkingBar();

let updateAll = () => {
  working.start();
  let projects = store.findAll('projects');
  if (projects.length == 0) {
    console.log(chalk.red('No projects to update'));
    return null;
  };
  let updates = [];
  for (let project of projects) {
    let commands = store.findAll('commands', { project: project.uuid });
    if (!commands) {
      console.log(chalk.red(`No update commands for ${project.name}`));
      continue;
    };
    let update = updateProject(project, commands).then((response) => {
      working.stop();
      console.log(response);
      working.start();
    }).catch((err) => {
      console.log(chalk.red(err));
    });
    updates.push(update);
  };
  Promise.all(updates).then((data) => {
    working.stop();
    console.log(chalk.green('Group update completed'));
  });
};

let updateProject = async (project, commands) => {
  let response = chalk.underline(`\n${project.name}\n`);
  for (command of commands) {
    response += chalk.cyan(`${command.string}\n`);
    let data = await runUpdate(`cd ${project.projectDir}; ${command.string}`);
    if (data.error) {
      response += chalk.red(`${data.string}`);
    } else {
      if (command.verbose) response += `${data.string}`;
    };

  };
  return response;
};

let runUpdate = (string) => {
  return new Promise((resolve, reject) => {
    runCommand(string).then((data) => {
      resolve({string: data});
    }).catch((err) => {
      resolve({error: true, string: err});
    });
  });
};
module.exports = { updateAll };
