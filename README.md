# Create from Blueprint [![CircleCI](https://circleci.com/gh/Jokinen/create-from-blueprint.svg?style=shield)](https://circleci.com/gh/Jokinen/create-from-blueprint)

**BETA version disclaimer**: This package is still very volatile, use with caution.

Gives ability to copy a file structure into a certain path renaming the file paths and the files' content.

Can be used with React to provide `component` and `container` blueprints, in which case creating a new component is done with a single command instead of manually creating and filling all the files. This has the added benefit of providing teams the ability to offer and enforce common patterns for developers.

## Getting started

### Install
```
yarn add -D create-from-blueprint
```
```
npm i --save-dev create-from-blueprint
```

## Usage
### 1. Define blueprints in your `package.json`

```json
{
  "createFromBlueprint": {
    "component": "blueprints/{% component %}/",
    "container": "blueprints/{% container %}/"
  }
}
```
**`key`**  
Type of the blueprint (`component`, `container`)  

**`value`**  
A path pointing to an existing folder (`blueprints/{% component %}/`, ...)

### 2. Run the command
```
create-from-blueprint <destination>
```
2.1. **You'll be asked to choose a `type` from a list<sup>1</sup>**  
2.2. **And input a `name`** 
 
Instances of `type`, beginning with a lowercase or uppercase letter, will be replaced with `name`
* **`In file paths`**: Every instance of `{% type %}` will be replaced with `name`
* **`In file contents`**: Every instance of `type` will be replaced with `name`

<sup>1</sup> The list consists of `keys` from the config field 

## Further details
**Commander `--help` output**
```terminal
  $ create-from-blueprint --help

  Usage: create-from-blueprint [options] <destination>

  Options:

    -n, --name <name>  The name of the created component
    -t, --type <type>  The name of the component type defined in the config
    -h, --help         output usage information
```

When `type` or `name` is missing, both will be asked for with `inquirer`. You can input everything in one go as well by providing both (`type`, `name`) of the options.
```
create-from-blueprint -t component -n InvoiceItem components
```

## Inspiration
Django's `startapp` which automatically generates a base for a new application.

## Built with
* [Commander](https://github.com/tj/commander.js/)
* [Inquirer](https://github.com/SBoudrias/Inquirer.js/)

## License

This project is licensed under the MIT License - see the [license](license) file for details

## TODO

- [ ] Single file blueprint support