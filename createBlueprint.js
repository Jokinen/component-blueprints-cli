const path = require('path')
const fs = require('fs')
const replace = require('stream-replace')
const junk = require('junk')
const escapeRegExp = require('./utils').escapeRegExp
const newFilePath = require('./utils').newFilePath
const capitalizeFirstLetter = require('./utils').capitalizeFirstLetter
const lowercaseFirstLetter = require('./utils').lowercaseFirstLetter
const createDirectory = require('./utils').createDirectory

function readdir(dir) {
  return new Promise((resolve) => {
    fs.readdir(dir, (err, files) => {
      if (err) {
        return resolve([err, files])
      }

      resolve([err, files])
    })
  })
}

function renameInjectCopy(file, blueprintSourceDir, targetDir, type, name) {
  return new Promise((resolve, reject) => {
    const source = path.join(blueprintSourceDir, file)
    const destination = newFilePath(path.join(targetDir, file), type, name)
    const read = fs.createReadStream(source)
    const write = fs.createWriteStream(destination)
    const capitalizedType = capitalizeFirstLetter(type)
    const capitalizedName = capitalizeFirstLetter(name)

    read.on('error', reject)
    write.on('error', reject)
    write.on('finish', resolve)

    read
      .pipe(replace(new RegExp(escapeRegExp(type), 'g'), name))
      .pipe(
        replace(new RegExp(escapeRegExp(capitalizedType), 'g'), capitalizedName)
      )
      .pipe(write)
  })
}

async function createBluePrint(type, name, destination, configs) {
  if (!configs) {
    throw new Error('No configs found')
  }

  const blueprintSource = configs[type]

  if (!blueprintSource) {
    throw new Error(`No configs found for type ${type}`)
  }

  const blueprintSourceDir = path.resolve(process.cwd(), blueprintSource)
  // Hack
  const newDirName = blueprintSource.includes(capitalizeFirstLetter(type))
    ? capitalizeFirstLetter(name)
    : lowercaseFirstLetter(name)
  const targetDir = path.join(process.cwd(), destination, newDirName)

  const directoryCreationErr = await createDirectory(targetDir)

  if (directoryCreationErr) {
    throw directoryCreationErr
  }

  const [fileSearchErr, files] = await readdir(blueprintSourceDir)

  if (fileSearchErr) {
    throw fileSearchErr
  }
  if (!files || files.length === 0) {
    throw new Error("The blueprint is empty or doesn't exist")
  }

  const fileCopies = files
    .filter(junk.not)
    .map((file) =>
      renameInjectCopy(file, blueprintSourceDir, targetDir, type, name)
    )

  return Promise.all(fileCopies)
}

module.exports = createBluePrint
