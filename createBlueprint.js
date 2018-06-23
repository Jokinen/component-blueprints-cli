const path = require('path')
const fs = require('fs')
const replace = require('stream-replace')
const escapeRegExp = require('./utils').escapeRegExp
const newFileName = require('./utils').newFileName
const capitalizeFirstLetter = require('./utils').capitalizeFirstLetter
const createDirectory = require('./utils').createDirectory
const configs = require(path.resolve(process.cwd(), 'package.json'))
  .createFromBlueprint

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
    const destination = path.join(targetDir, newFileName(file, type, name))
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

async function createBluePrint(type, name, destination) {
  const blueprintSource = configs[type]
  const blueprintSourceDir = path.resolve(process.cwd(), blueprintSource)
  const targetDir = path.resolve(process.cwd(), destination, name)

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

  const fileCopies = files.map((file) =>
    renameInjectCopy(file, blueprintSourceDir, targetDir, type, name)
  )

  return Promise.all(fileCopies)
}

module.exports = createBluePrint
