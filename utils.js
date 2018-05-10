'use strict'

const { spawn: spawnProcess } = require('child_process')

const OAR_REGEX = new RegExp(/\((0x\w{40})\)/)

const watchEvent = event => {
  return new Promise((resolve, reject) => {
    event.watch((error, result) => {
      if (error) {
        event.stopWatching()
        return reject(error)
      }
      event.stopWatching()
      resolve(result)
    })
  })
}

const oraclizeAddressResolverDeployed = () => {
  return new Promise((resolve, reject) => {
    const logs = spawnProcess('docker', ['logs', '-f', 'oraclize'])
    logs.stdout.on('data', data => {
      const matches = data.toString().match(OAR_REGEX)
      if (matches) {
        logs.kill('SIGINT')
        resolve(matches[1])
      }
    })
    logs.stderr.on('data', data => {
      logs.kill('SIGINT')
      reject(data)
    })
  })
}

module.exports = {
  watchEvent,
  oraclizeAddressResolverDeployed
}
