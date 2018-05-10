'use strict'

const { resolve: resolvePath } = require('path')
const { load: loadConfig } = require('dotenv')

loadConfig({ path: resolvePath(process.cwd(), '.env.local') })

const HDWalletProvider = require('truffle-hdwallet-provider')

const MNEMONIC = process.env.MNEMONIC
const INFURA_API_KEY = process.env.INFURA_API_KEY
const provider = network => new HDWalletProvider(MNEMONIC, `https://${network}.infura.io/${INFURA_API_KEY}`)

module.exports = {
  networks: {
    development: {
      // provider: () => new HDWalletProvider(MNEMONIC, 'http://127.0.0.1:8545'),
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
    /*
    mainnet: {
      provider: provider('mainnet'),
      network_id: 1
    }
    */
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
}
