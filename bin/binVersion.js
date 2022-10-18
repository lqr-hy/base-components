#! /usr/bin/env node

const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const inquirer = require('inquirer')
const semver = require('semver')

const packageJson = JSON.parse(fs.readFileSync(
  path.resolve(__dirname, `../package.json`),
  {
    encoding: 'utf8'
  }
))

const packageLockJson = JSON.parse(fs.readFileSync(
  path.resolve(__dirname, `../package-lock.json`),
  {
    encoding: 'utf8'
  }
))


const version = packageJson.version

console.log(`
${chalk.bgBlue('bump version start')}
current version is: ${chalk.green(version)}

please select which semantic version sould bump:
`)

const newMajorUpVersion = semver.inc(version, 'major')
const newMinorUpVersion = semver.inc(version, 'minor')
const newPatchUpVersion = semver.inc(version, 'patch')

inquirer.prompt([{
  type: 'list',
  name: 'newVersion',
  default: newPatchUpVersion,
  choices: [
    newPatchUpVersion,
    newMinorUpVersion,
    newMajorUpVersion
  ]
}])
.then(res => {
  writeFiles(res.newVersion)

  console.log(`\n${chalk.bgBlue('bump version end')}\n`)
})

function writeFiles (newVersion) {
  packageJson.version = newVersion
  packageLockJson.version = newVersion

  fs.writeFileSync(
    path.resolve(__dirname, `../package.json`),
    JSON.stringify(packageJson, null, 2),
    {
      encoding: 'utf8'
    }
  )

  fs.writeFileSync(
    path.resolve(__dirname, `../package-lock.json`),
    JSON.stringify(packageLockJson, null, 2),
    {
      encoding: 'utf8'
    }
  )
}

