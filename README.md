# create-from-blueprint [![CircleCI](https://circleci.com/gh/Jokinen/create-from-blueprint.svg?style=shield)](https://circleci.com/gh/Jokinen/create-from-blueprint)

Gives ability to create common file structures, such as for example components, à la Django's `manage.py startapp app-name`.

Blueprint's are defined with `text files` and `folders` giving a lot of flexibility in defining based on your requirements.

### Install
```
yarn add -D create-from-blueprint
```
```
npm i --save-dev create-from-blueprint
```

### Quick instructions
For an interactive session use
```
create-from-blueprint <destination>
```
or traditionally
```
create-from-blueprint -n name -t type <destination>
```
```terminal
  $ create-from-blueprint --help

  Usage: create-from-blueprint [options] <destination>

  Options:

    -n, --name <name>  The name of the created component
    -t, --type <type>  The name of the component type defined in the config
    -h, --help         output usage information
```

Define blueprints in your `package.json`

```json
{
  "createFromBlueprint": {
    "component": "blueprints/{{component}}/",
    "container": "blueprints/{{container}}/"
  }
}
```

**Where**
* The path points to an existing folder or file
* The keys (component, container) are used for the `type` option
* Everything delimited with double angle brackets (`{{}}`) in file paths will be replaced with the `name` option
* Every instance of `type`, capitalized or uncapitalized, will be replaced with `name`, capitalized appropriately

### TODO

- [ ] Single file blueprint support