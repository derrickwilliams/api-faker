var fs = require("fs")

function copyFile(from, to) {
  var content = fs.readFileSync(from, "utf8")
  fs.writeFileSync(to, content)
}

function fileExists(path) {
  try {
    fs.statSync(path)
    return true
  } catch(e) {
    return false
  }
}

function replaceInFile(filePath, regexp, replacement) {
  var replacer = function(match) {
    console.log("\nReplacing in %s: %s => %s", filePath, match, replacement) // eslint-disable-line
    return replacement
  }
  var content = fs.readFileSync(filePath, "utf8")
  var out = content.replace(new RegExp(regexp, "g"), replacer)
  fs.writeFileSync(filePath, out)
}

module.exports = {
  copyFile,
  fileExists,
  replaceInFile,
}
