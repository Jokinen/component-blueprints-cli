const path = require('path')
const fs = require('fs')
const replace = require('stream-replace')
const junk = require('junk')
const escapeRegExp = require('./utils').escapeRegExp
const newFilePath = require('./utils').newFilePath
const capitalizeFirstLetter = require('./utils').capitalizeFirstLetter
const createDirectory = require('./utils').createDirectory

function readdir(dir) {
  return new Promise((resolve) => {
    fs.readdir(dir, (err, files) => {
      if (err) {
        throw err
      }

      resolve(files)
    })
  })
}

function injectCopy(from, to, type, name) {
  return new Promise((resolve, reject) => {
    const read = fs.createReadStream(from)
    const write = fs.createWriteStream(to)
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

function replaceBasePath(filePath, replaced, replacer) {
  return filePath.replace(new RegExp(escapeRegExp(replaced), 'g'), replacer)
}

async function walk(fileOrDirectoryList, opts) {
  const fileOperations = fileOrDirectoryList.map(
    (fileOrDirectoryPath) =>
      new Promise((resolve, reject) => {
        fs.stat(fileOrDirectoryPath, async (err, stats) => {
          if (err) {
            throw err
          }

          const { blueprintSourceDir, destinationDir, type, name } = opts
          const destinationFileOrDirectory = newFilePath(
            replaceBasePath(
              fileOrDirectoryPath,
              blueprintSourceDir,
              destinationDir
            ),
            type,
            name
          )

          if (stats.isDirectory()) {
            try {
              const files = await readdir(fileOrDirectoryPath)

              await createDirectory(destinationFileOrDirectory)

              const relativePaths = files
                .filter(junk.not)
                .map((file) => path.join(fileOrDirectoryPath, file))
              const results = await walk(relativePaths, opts)

              resolve(results)
            } catch (e) {
              throw e
            }
          } else {
            const err = await injectCopy(
              fileOrDirectoryPath,
              destinationFileOrDirectory,
              type,
              name
            )

            if (err) {
              throw err
            }

            resolve(destinationFileOrDirectory)
          }
        })
      })
  )

  return Promise.all(fileOperations)
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
  const destinationDir = path.resolve(process.cwd(), destination)

  try {
    const files = await readdir(blueprintSourceDir)

    if (!files || files.length === 0) {
      throw new Error("The blueprint is empty or doesn't exist")
    }

    const relativeFiles = files
      .filter(junk.not)
      .map((file) => path.join(blueprintSourceDir, file))

    return await walk(relativeFiles, {
      blueprintSourceDir,
      destinationDir,
      type,
      name,
    })
  } catch (e) {
    throw e
  }
}

module.exports = createBluePrint
