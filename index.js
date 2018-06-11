#!/usr/bin/env node
const fs = require('fs')
const spawn = require('child_process').spawn
const to_install = []
fs.readFile('./.babelrc', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  const parsed = JSON.parse(data)
  ;[].concat(parsed.plugins).forEach(add('babel-plugin-'))
  ;[].concat(parsed.presets).forEach(add('babel-preset-'))
  const is_npm = check_arg('-n')
  const cmd = {
    program: is_npm ? 'npm' : 'yarn',
    cmd: is_npm ? 'i' : 'add',
  }
  spawn(cmd.program, [cmd.cmd, ...to_install], {stdio: 'inherit'})
})

function add(prefix) {
  return function(name) {
    if (typeof name === 'string') {
      to_install.push(prefix + name)
    } else if (Array.isArray(name)) {
      to_install.push(name[0])
    }
  }
}

function check_arg(arg) {
  const args = process.argv.slice(2)
  return args.includes(arg)
}

function usage() {
  console.log(
`
Usage: Where your .babelrc file is located, just run install-babel.

add -n to use npm. default is yarn. Sorry.
`
  )
}
