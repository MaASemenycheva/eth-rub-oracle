'use strict'

const { oraclizeAddressResolverDeployed, watchEvent } = require('./../utils')

const UPDATE_DELAY = 30

const ETHRUBTestOracle = artifacts.require('ETHRUBTestOracle')

contract('ETHRUBTestOracle', accounts => {
  let ethRubTestOracle

  it('должен получить курс пары ETH/RUB из API Cryptonator', async () => {
    const oarAddress = await oraclizeAddressResolverDeployed()
    ethRubTestOracle = await ETHRUBTestOracle.new(oarAddress, UPDATE_DELAY, { value: web3.toWei(0.5, 'ether') })

    let e = await watchEvent(ethRubTestOracle.Log())
    assert.equal(e.args.message, 'Запрос добавлен в очередь, ожидаю ответ...', 'Некорректное описание события Log')

    e = await watchEvent(ethRubTestOracle.Updated())
    assert.isNotNull(e.args.price, 'Событие Updated возвратило цену null')

    assert.isNotOk(await ethRubTestOracle.isOutOfSync(), 'isOutOfSync возвратила true')
  })
})

