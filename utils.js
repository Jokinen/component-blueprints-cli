const fs = require('fs')

module.exports.replaceAll = replaceAll
module.exports.escapeRegExp = escapeRegExp
module.exports.newFileName = newFileName
module.exports.capitalizeFirstLetter = capitalizeFirstLetter
module.exports.lowercaseFirstLetter = lowercaseFirstLetter
module.exports.createDirectory = createDirectory

// https://stackoverflow.com/a/1144788/7200097
function escapeRegExp(str) {
  // eslint-disable-next-line
  return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1')
}
function replaceAll(str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace)
}

// https://stackoverflow.com/a/1026087/7200097
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
function lowercaseFirstLetter(string) {
  return string.charAt(0).toLowerCase() + string.slice(1)
}

function newFileName(filename, type, newName) {
  const replacedFirstCharLowercase = replaceAll(
    filename,
    `{% ${type} %}`,
    newName
  )
  const replacedFirstCharUppercase = replaceAll(
    replacedFirstCharLowercase,
    `{% ${capitalizeFirstLetter(type)} %}`,
    capitalizeFirstLetter(newName)
  )

  return replacedFirstCharUppercase
}

async function createDirectory(directory) {
  return new Promise((resolve, reject) => {
    fs.stat(directory, (err) => {
      if (err && err.code === 'ENOENT') {
        fs.mkdir(directory, resolve)
      } else if (err) {
        reject(err)
      }

      resolve()
    })
  })
}
