'use strict'

const UPDATE_DELAY = 60 * 60

const ETHRUBOracle = artifacts.require('ETHRUBOracle')

module.exports = async deployer => deployer.deploy(ETHRUBOracle, UPDATE_DELAY)
