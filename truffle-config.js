'use strict'

const { load: loadConfig } = require('dotenv')
const HDWalletProvider = require('truffle-hdwallet-provider')

loadConfig()

const mnemonic = process.env.MNEMONIC_PHRASE
const infuraApiKey = process.env.INFURA_API_KEY
const provider = network => new HDWalletProvider(mnemonic, `https://${network}.infura.io/${infuraApiKey}`)

module.exports = {
  networks: {
    /*
    mainnet: {
      provider: provider('mainnet'),
      network_id: 1
    },
    */
    ganache: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*'
    },
    ropsten: {
      provider: provider('ropsten'),
      network_id: 3
    },
    infuranet: {
      provider: provider('infuranet'),
      network_id: 5810
    },
    kovan: {
      provider: provider('kovan'),
      network_id: 42
    },
    rinkeby: {
      provider: provider('rinkeby'),
      network_id: 4
    }
  }
}
