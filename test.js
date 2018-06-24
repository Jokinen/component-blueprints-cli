import test from 'ava'
import fs from 'fs'
import path from 'path'
import rimraf from 'rimraf'
import createBlueprint from './createBlueprint'
import {
  replaceAll,
  escapeRegExp,
  newFilePath,
  capitalizeFirstLetter,
  lowercaseFirstLetter,
  createDirectory,
} from './utils'

test.before(() => {
  const notRelative = (p) => path.resolve(process.cwd(), p)

  if (!fs.existsSync(notRelative('blueprints'))) {
    fs.mkdirSync(notRelative('blueprints'))
    fs.mkdirSync(notRelative('blueprints/{% component %}'))
    fs.writeFileSync(
      notRelative('blueprints/{% component %}/{% Component %}.js', 'Content')
    )
  }

  if (!fs.existsSync(notRelative('src'))) {
    fs.mkdirSync(notRelative('src'))
    fs.mkdirSync(notRelative('src/components'))
  }
})

test.after.always(() => {
  const notRelative = (p) => path.resolve(process.cwd(), p)

  rimraf.sync(notRelative('blueprints'))
  rimraf.sync(notRelative('src'))
})

test('createBlueprint', async (t) => {
  t.truthy(createBlueprint, 'should be defined')

  if (!fs.existsSync('blueprints/{% component %}')) {
    t.fails('The file should be created')
  }

  const targetDir = 'src/components'
  const name = 'someComponent'
  const configs = {
    component: 'blueprints/{% component %}',
  }

  try {
    await createBlueprint('component', name, targetDir, configs)
  } catch (e) {
    t.log(e.stack)
    t.fail('An error should not be returned')
  }

  const err = await new Promise((resolve) => {
    fs.stat(`${targetDir}`, (err) => {
      if (err) {
        return resolve(err)
      }

      resolve()
    })
  })

  t.falsy(err, 'should create the new files as expected')
})

test('utils exports', (t) => {
  const exports = {
    replaceAll,
    escapeRegExp,
    newFilePath,
    capitalizeFirstLetter,
    createDirectory,
    lowercaseFirstLetter,
  }

  Object.entries(exports).forEach(([key, val]) => {
    t.truthy(val, `utils should export ${key}`)
  })
})

test('newFilePath', (t) => {
  const type = 'testValue'
  const filenameLowerCase = `{% TestValue %}/{% testValue %}.js`
  const filenameUpperCase = `{% TestValue %}.js`
  const newName = 'givenName'

  t.is(
    newFilePath(filenameLowerCase, type, newName),
    'GivenName/givenName.js',
    'should replace lowercase instances of type with a lowercase newName'
  )
  t.is(
    newFilePath(filenameUpperCase, type, newName),
    'GivenName.js',
    'should replace instances of {type} with newName'
  )
})

test('replaceAll', (t) => {
  const str = 'one two one two'
  const find = 'two'
  const replace = 'three'

  t.is(
    replaceAll(str, find, replace),
    'one three one three',
    'should replace every instance of find with replace'
  )
  t.is(
    replaceAll('{test}', '{', '['),
    '[test}',
    'should handle characters which need escaping'
  )
})

test('capitalizeFirstLetter', (t) => {
  const testStrings = ['string', 'Bring', '1fing']

  testStrings.forEach((testString) => {
    const firstChar = capitalizeFirstLetter(testString).charAt(0)

    t.truthy(
      firstChar === firstChar.toUpperCase(),
      'should capitalize the first letter of the string'
    )
  })
})

test('lowercaseFirstLetter', (t) => {
  const testStrings = ['String', 'bringFling', '1fing']

  testStrings.forEach((testString) => {
    const firstChar = lowercaseFirstLetter(testString).charAt(0)

    t.truthy(
      firstChar === firstChar.toLowerCase(),
      'should lowercase the first letter of the string'
    )
  })
})

test('createDirectory', async (t) => {
  const testDirectory = 'src/components/anotherDir'
  const err = await createDirectory(testDirectory)

  t.falsy(err)
})
