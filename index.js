#!/usr/bin/env node
let chalk = require('chalk'),
  program = require('commander'),
  projects = require('./src/projects'),
  commandsController = require('./src/commands'),
  groups = require('./src/groups'),
  update = require('./src/update'),
  store = require('./src/store'),
  helpers = require('./src/helpers'),
  changeDirectory = helpers.changeDirectory,
  validate = helpers.validateProjectDirectory,
  runCommand = helpers.runCommand,
  inquirer = require('inquirer');

program
  .version('0.1.0');
program
  .command('add [dirs...]')
  .description('Add project')
  .option('-a, --all', 'Apply input commands to all given projects')
  // .option('-d, --details', 'Show details')
  .option('-s, --string [string]','Pass commands in with a string "<command>; <command>"')
  .option('-v, --verbose', 'Make commands verbose')
  // .option('-g, --group <group>', 'Add project to a group')
  .action(async (dirs, options) => {
    await store.open();
    if (dirs.length == 0) dirs.push('.');
    for (let dir of dirs) {
      let projectDir = await changeDirectory(dir);
      if (!validate(projectDir)) continue;
      let project = await projects.create(userDirectoryShort(projectDir), options.details)
      if (!project) continue;
      if (options.group) {
        groups.groupProject(project, options.group);
      };
      if (options.string) {
        let commands = await commandsController.createWithString(project, options.string, options.verbose);
      } else {
        let commands = await commandsController.createWithInput(project, options.verbose, options.all);
        if (options.all) {
          options.string = '';
          for (command of commands) {
            options.string += `${command.string}; `;
          };
        };
      };
    };
    await store.save(process.store);
  });
program
  .command('remove [dirs...]')
  .description('Remove project')
  .option('-f, --force', 'Forego confirmation')
  .action(async (dirs, options) => {
    await store.open();
    if (dirs.length == 0) dirs.push('.');
    for (let dir of dirs) {
      let projectDir = await changeDirectory(dir);
      if (!validate(projectDir)) continue;
      projectDir = userDirectoryShort(projectDir);
      let project = store.findOne('projects', { projectDir });
      if (!project) {
        console.log(chalk.red(`No project found for ${projectDir} \n`));
        continue;
      };
      let confirmation = true;
      if (!options.force) {
        let question = {
          type: 'confirm',
          name: 'confirmation',
          message: `Remove ${project.name}?`,
          prefix: ''
        };
        input = await inquirer.prompt([question]);
        confirmation = input.confirmation;
      };
      if (confirmation) {
        projects.remove(projectDir);
        console.log(chalk.green(`Removed ${project.name}`));
      };
    };
    await store.save(process.store);
  });
program
  .command('command [dirs...]')
  .description('Configure commands')
  // .option('-a, --all', 'Apply input commands to all given projects')
  .option('-a, --append', 'Append commands to project update process')
  // .option('-p, --prepend', 'Prepend commands to project update process')
  // .option('-a, --add', 'Add commands to project update process')
  // .option('-r, --replace', 'Replace project commands')
  .option('-s, --string', 'Pass commands in with a string "<command>; <command>"')
  .option('-v, --verbose', 'Make commands verbose')
  .action(async (dirs, options) => {
    await store.open();
    if (dirs.length == 0) dirs.push('.');
    for (let dir of dirs) {
      let projectDir = await changeDirectory(dir);
      if (!validate(projectDir)) continue;
      projectDir = userDirectoryShort(projectDir);
      let project = store.findOne('projects', { projectDir });
      if (!project) continue;
      if (!options.append && !options.prepend) store.removeAll('commands', { project: project.uuid });
      if (options.string) {
        let commands = await commandsController.createWithString(project, options.string, options.verbose);
      } else {
        let commands = await commandsController.createWithInput(project, options.verbose, options.all);
        if (options.all) {
          options.string = '';
          for (command of commands) {
            options.string += `${command.string}; `;
          };
        };
      };
    };
    await store.save(process.store);
  });
// program
//   .command('group [dirs...]')
//   .description('Project groups')
//   .action((dirs, options) => {
//     await store.open();
//     if (dirs.length == 0) dirs.push('.');
//     for (let dir of dirs) {
//       let projectDir = await changeDirectory(dir);
//       if (!validate(projectDir)) continue;
//       projectDir = userDirectoryShort(projectDir);
//     };
//     await store.save(process.store);
//   });
program
  .command('list [dirs...]')
  .description('List project details')
  .option('-a, --all', 'List all projects')
  .option('-v, --verbose', 'Show more information')
  .action(async (dirs, options) => {
    await store.open();
    let projects = [];
    if (options.all) {
      projects = store.findAll('projects');
      if (projects.length == 0) {
        console.log(chalk.red('No projects stored'));
        return;
      };
    } else {
      if (dirs.length == 0) dirs.push('.');
      for (let dir of dirs) {
        let projectDir = await changeDirectory(dir)
        projectDir = userDirectoryShort(projectDir);
        let project = store.findOne('projects', { projectDir });
        if (!project) {
          console.log(chalk.red(`No project found for ${projectDir} \n`));
          continue;
        };
        projects.push(project);
      };
    };
    console.log();
    for (let project of projects) {
      console.log(chalk.underline(project.name));
      if (options.verbose) console.log(`${project.projectDir}`);
      let commands = store.findAll('commands', { project: project.uuid });
      for (let [index, command] of commands.entries()) {
        if (options.verbose) {
          console.log(`${index}: ` + chalk.cyan(`${command.string}`));
        } else {
          console.log(chalk.cyan(`${command.string}`));
        };
      };
      console.log();
    };
  });

program
  .command('manual')
  .description('Open data file')
  .action(() => {
    // runCommand('open ~/.config/groupup/data.json');
  });

program
  .command('reset')
  .description('Reset data')
  .action(() => {
    store.reset();
  });

program
  .command('*')
  .action(() => {
    console.log(chalk.red('Unrecognized command'));
  });

program.parse(process.argv);

let defaultFunction = async () => {
  await store.open();
  update.updateAll();
};

if (process.argv.length == 2) {
  defaultFunction();
};
