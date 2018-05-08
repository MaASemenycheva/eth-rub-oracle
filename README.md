# ETH/RUB оракул

[![Solidity 0.4.23](https://img.shields.io/badge/Solidity-0.4.23-brightgreen.svg?style=flat-square&colorB=C99D66)](https://github.com/ethereum/solidity/releases/tag/v0.4.23)
[![Лицензия MIT](https://img.shields.io/badge/%D0%9B%D0%B8%D1%86%D0%B5%D0%BD%D0%B7%D0%B8%D1%8F-MIT-green.svg?style=flat-square)](https://www.opensource.org/licenses/MIT)

Реализация ETH/RUB [оракула](https://decenter.org/blockchain/360-blockchain-oracles-rus) на блокчейне Ethereum; для работы с [API Cryptonator](https://cryptonator.com/api) используется [Oraclize](https://oraclize.it).

## Пример использования
```solidity
pragma solidity ^0.4.23;

interface ETHRUBOracle {
    function price() public view returns (uint);
    function updatedAt() public view returns (uint);
    function isOutOfSync() public view returns (bool);
    function update(uint delay) public payable;
}

contract ETHToRUBConverter {
    ETHRUBOracle public priceOracle;

    function constructor(address priceOracleAddress) public {
        priceOracle = ETHRUBOracle(priceOracleAddress);
    }

    function convert(uint amountInEther) public view returns (uint) {
        require(!priceOracle.isOutOfSync());
        return amountInEther * priceOracle.price();
    }
}
```
