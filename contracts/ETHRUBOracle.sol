pragma solidity ^0.4.23;

import "oraclize-api/usingOraclize.sol";

contract ETHRUBOracle is usingOraclize {
    uint constant SYNC_TIMEOUT = 120;
    string constant API_QUERY = "json(https://api.cryptonator.com/api/ticker/eth-rub).ticker.price";

    uint public price;
    uint public updatedAt;
    uint internal delay;

    bool private queryQueued;

    event Log(string message);
    event Updated(uint price);

    constructor(uint delay_) payable public {
        delay = delay_;
        update(0);
    }

    function __callback(bytes32, string result) public {
        require(msg.sender == oraclize_cbAddress());
        price = parseInt(result, 2);
        /* solium-disable-next-line security/no-block-members */
        updatedAt = now;
        queryQueued = false;
        emit Updated(price);
        update(delay);
    }

    function update(uint delay_) payable public {
        if (queryQueued) {
            emit Log("Запрос уже добавлен в очередь");
            return;
        }
        uint fee = oraclize_getPrice("URL");
        if ((msg.sender == address(this) && fee > address(this).balance) || (msg.sender != address(this) && fee > msg.value)) {
            emit Log("Недостаточно средств для добавления запроса в очередь");
            return;
        }
        oraclize_query(delay_, "URL", API_QUERY);
        queryQueued = true;
        emit Log("Запрос добавлен в очередь, ожидаю ответ...");
    }

    function isOutOfSync() public view returns (bool) {
        /* solium-disable-next-line security/no-block-members */
        return now > updatedAt + delay + SYNC_TIMEOUT;
    }

    function () payable public {
        if (msg.value >= oraclize_getPrice("URL")) {
            emit Log("Спасибо за поддержку!");
        }
    }
}

contract ETHRUBTestOracle is ETHRUBOracle {
    constructor(address oarAddress, uint delay_) ETHRUBOracle(delay_) payable public {
        OAR = OraclizeAddrResolverI(oarAddress);
    }
}
