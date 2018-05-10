'use strict'

const Migrations = artifacts.require('Migrations')

module.exports = async deployer => deployer.deploy(Migrations)
