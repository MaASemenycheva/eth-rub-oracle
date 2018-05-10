'use strict'

const { spawn: spawnProcess } = require('child_process')

const OAR_REGEX = new RegExp(/\(0x\w{40}\)/)
const UPDATE_DELAY = 30

const ETHRUBTestOracle = artifacts.require('ETHRUBTestOracle')

contract('ETHRUBTestOracle', accounts => {
  let ethRubTestOracle

  it('должен получить курс пары ETH/RUB из API Cryptonator', async () => {
    const OAR_ADDRESS = await oraclizeAddressResolverDeployed()
    ethRubTestOracle = await ETHRUBTestOracle.new(OAR_ADDRESS, UPDATE_DELAY, { value: web3.toWei(0.5, 'ether') })

    let e = await watchEvent(ethRubTestOracle.Log())
    // assert.equal(e.event, 'Log', 'Событие Log не сработало')
    assert.equal(e.args.message, 'Запрос добавлен в очередь, ожидаю ответ...', 'Некорректное описание события Log')

    e = await watchEvent(ethRubTestOracle.Updated())
    // assert.equal(e.event, 'Updated', 'Событие Updated не сработало')
    assert.isNotNull(e.args.price, 'Событие Updated возвратило цену null')
  })
})

const watchEvent = async event => {
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

const oraclizeAddressResolverDeployed = async () => {
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
