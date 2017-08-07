const exec = require('child_process').exec
const execFile = require('child_process').execFile
const path = require('path')
const fs = require('fs')
const execPath = process.execPath
const binPath = path.dirname(execPath)
const dep = path.join(execPath, '../../lib/node_modules/dep')
const datNode = path.join(dep, 'node_modules/dat-node')
const repository = 'https://github.com/watilde/dep.git'
const bin = path.join(dep, 'bin/dep.js')

process.stdout.write(
  'exec: git' + [' clone', repository, dep].join(' ') + '\n'
)
exec('git clone ' + repository + ' ' + dep, (e) => {
  if (e) throw e
  process.stdout.write('link: ' + bin + '\n')
  process.stdout.write(' => ' + path.join(binPath, 'dep') + '\n')
  fs.symlink(bin, path.join(binPath, 'dep'), (e) => {
    if (e) throw e
    execFile(bin, ['install', '--only=prod'], {cwd: datNode}, (e) => {
      if (e) throw e
    })
  })
})
