'use strict'

const UPDATE_DELAY = 60 * 60

const ETHRUBOracle = artifacts.require('ETHRUBOracle')
const ETHRUBTestOracle = artifacts.require('ETHRUBTestOracle')

module.exports = async (deployer, network) => {
  if (network !== 'ganache') {
    await deployer.deploy(ETHRUBOracle, UPDATE_DELAY)
  } else {
    const oarAddress = process.env.OAR_ADDRESS
    await deployer.deploy(ETHRUBTestOracle, oarAddress, UPDATE_DELAY)
  }
}
