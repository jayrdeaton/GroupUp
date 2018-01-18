let helpers = require('./helpers'),
  changeDirectory = helpers.changeDirectory,
  userDirectoryShort = helpers.userDirectoryShort,
  store = require('./store'),
  projects = require('./projects'),
  models = require('./models'),
  Command = models.Command,
  inquirer = require('inquirer'),
  chalk = require('chalk');

let create = async (project, string, verbose) => {
  let storedCommands = store.findAll('commands', { project: project.uuid });
  let index = storedCommands.length;
  if (!verbose) verbose = false;
  let command = new Command({ index, string, project: project.uuid, verbose });
  store.add('commands', command);
  // process.store.commands.push(command);

  return command;
};
let createWithInput = async (project, verbose, all) => {
  let commands = [];
  let storedCommands = store.findAll('commands', { project: project.uuid });
  if (all) {
    console.log(`Update commands:`);
  } else {
    console.log(`${project.name} update commands:`);
  }
  for (let command of storedCommands) {
    console.log(`${command.index} - ` + chalk.cyan(`${command.string}`));
  };
  let index = storedCommands.length;
  // console.log('Add update commands: ')
  let shouldQuit = false;
  while (!shouldQuit) {
    let question = {
      type: 'input',
      name: 'command',
      message: '-',
      prefix: index
    };
    let input = await inquirer.prompt([question]);
    if (input.command == 'q' || input.command == 'Q' || input.command == '') {
      shouldQuit = true;
    } else {
      let string = input.command;
      let verboseCommand = verbose;
      if (!verboseCommand) verboseCommand = false;
      if (!verboseCommand && string.startsWith('-v')) {
        verboseCommand = true;
        string = string.replace('-v', '');
        string = string.trim();
      };
      let command = new Command({ index, string, project: project.uuid, verbose: verboseCommand });
      store.add('commands', command);
      commands.push(command);
      index++;
    };
  };
  return commands;
};
let createWithString = async (project, string, verbose) => {
  let commands = string.split(';');
  for (let string of commands) {
    string = string.trim();
    if (!string) continue;
    let command = await create(project, string, verbose);
  };
};
module.exports = { create, createWithInput, createWithString };
