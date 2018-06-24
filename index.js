#!/usr/bin/env node --harmony
const path = require('path')
const inquirer = require('inquirer')
const createBlueprint = require('./createBlueprint')
const chalk = require('chalk')
const program = require('commander')

program
  .arguments('<destination>')
  .option('-n, --name <name>', 'The name of the created component')
  .option(
    '-t, --type <type>',
    'The name of the component type defined in the config'
  )
  .action(async (destination) => {
    const configs = findConfigs() || {}
    let { name, type } = program

    if (!name || !type) {
      ;({ name, type } = await getInquirer(configs))
    }

    try {
      await createBlueprint(type, name, destination, configs)

      success(destination, name, type)
    } catch (e) {
      process.stderr.write(chalk.red(e.stack + '\n'))
    }
  })
  .parse(process.argv)

function getInquirer(config) {
  const questions = [
    {
      type: 'list',
      name: 'type',
      message: 'Type of the blueprint?',
      choices: Object.keys(config || {}),
    },
    {
      type: 'input',
      name: 'name',
      message: 'Name for the blueprint?',
    },
  ]

  return inquirer.prompt(questions)
}

function findConfigs() {
  return require(path.resolve(process.cwd(), 'package.json'))
    .createFromBlueprint
}

function success(destination, name, type) {
  const blueprintPath = path.resolve(process.cwd(), destination, name)
  const successMessage = [
    `Created  ${chalk.bgWhite.black.bold(' ' + name + ' ')}`,
    `Type     ${chalk.bold(type)}`,
    `Path     ${chalk.bold(blueprintPath)}`,
  ]

  successMessage.forEach((line) => {
    process.stdout.write(line + '\n')
  })
}
