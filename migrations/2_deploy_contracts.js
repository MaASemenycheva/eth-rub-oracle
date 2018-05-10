'use strict'

const { oraclizeAddressResolverDeployed } = require('./../utils')

const UPDATE_DELAY = 60 * 60
const INITIAL_BALANCE = 0.5

const ETHRUBOracle = artifacts.require('ETHRUBOracle')
const ETHRUBTestOracle = artifacts.require('ETHRUBTestOracle')

module.exports = (deployer, network) => {
  deployer.then(async () => {
    if (network !== 'development') {
      deployer.deploy(ETHRUBOracle, UPDATE_DELAY)
    } else {
      const oarAddress = await oraclizeAddressResolverDeployed()
      deployer.deploy(ETHRUBTestOracle, oarAddress, UPDATE_DELAY, { value: web3.toWei(INITIAL_BALANCE, 'ether') })
    }
  })
}
