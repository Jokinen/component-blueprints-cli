import test from 'ava'
import mock from 'mock-fs'
import createBlueprint from './createBlueprint'
import {
  replaceAll,
  escapeRegExp,
  newFileName,
  capitalizeFirstLetter,
  lowercaseFirstLetter,
  createDirectory,
} from './utils'

test('createBlueprint', async (t) => {
  t.truthy(createBlueprint)
  // mock-fs doesn't work with this setup
  /*mock({
    'blueprints': {
      '{% component %}': {
        '{% component %}.js': 'Content'
      }
    },
    'src': {
      'components': {}
    }
  })

  t.truthy(createBlueprint, 'should be defined')

  const targetDir = 'src/components'
  const name = 'Test'

  await createBlueprint('component', name, targetDir)

  const err = await new Promise((resolve) => {
    fs.stat(`${ targetDir }/${ name }/${ name }.js`, (err) => {
      if (err) {
        return resolve(err)
      }

      resolve()
    })
  })
  
  t.truthy(err, 'should create the new files as expected')
  mock.restore()
  */
})

test('utils exports', (t) => {
  const exports = {
    replaceAll,
    escapeRegExp,
    newFileName,
    capitalizeFirstLetter,
    createDirectory,
    lowercaseFirstLetter,
  }

  Object.entries(exports).forEach(([key, val]) => {
    t.truthy(val, `utils should export ${key}`)
  })
})

test('newFileName', (t) => {
  const type = 'testValue'
  const filenameLowerCase = `{% testValue %}.js`
  const filenameUpperCase = `{% TestValue %}.js`
  const newName = 'givenName'

  t.is(
    newFileName(filenameLowerCase, type, newName),
    newName + '.js',
    'should replace lowercase instances of type with a lowercase newName'
  )
  t.is(
    newFileName(filenameUpperCase, type, newName),
     'GivenName.js',
    'should replace instances of {type} with newName'
  )
})

test('replaceAll', (t) => {
  const str = 'one two one two'
  const find = 'two'
  const replace = 'three'
  const result = replaceAll(str, find, replace)

  t.is(
    result,
    'one three one three',
    'should replace every instance of find with replace'
  )

  const result2 = replaceAll('{test}', '{', '[')
  t.is(result2, '[test}', 'should handle characters which need escaping')
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
  const testDirectory = 'sampleDir/anotherDir'

  mock({ sampleDir: {} })

  const err = await createDirectory(testDirectory)

  t.falsy(err)
  mock.restore()
})
