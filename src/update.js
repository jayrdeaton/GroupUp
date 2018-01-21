let helpers = require('./helpers'),
  runCommand = helpers.runCommand,
  store = require('./store'),
  chalk = require('chalk'),
  workingBar = require('./config').workingBar;

let updateAll = async () => {
  workingBar.start();
  let projects = store.findAll('projects');
  if (projects.length == 0) {
    workingBar.message(chalk.red('No projects to update'));
    workingBar.stop();
    return null;
  };
  for (let project of projects) {
    let commands = store.findAll('commands', { project: project.uuid });
    if (!commands) {
      workingBar.message(chalk.red(`No update commands for ${project.name}`));
      continue;
    };
    await updateProject(project, commands)
  };
  workingBar.message(chalk.green('\nGroup update completed\n'));
  workingBar.stop();
};

let updateProject = async (project, commands) => {
  workingBar.message(chalk.underline(`\n${project.name}\n`));
  for (command of commands) {
    workingBar.message(chalk.cyan(`${command.string}`));
    let data = await runUpdate(`cd ${project.projectDir}; ${command.string}`);
    if (data.error) {
      workingBar.message(chalk.red('Error: '));
      workingBar.message(`${data.string}`);
      return null;
    } else {
      if (command.verbose) workingBar.message(`${data.string}`);
    };
  };
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
