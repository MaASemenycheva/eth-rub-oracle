pragma solidity ^0.4.23;

import "github.com/oraclize/ethereum-api/oraclizeAPI.sol";

contract ETHRUBOracle is usingOraclize {
    uint constant SYNC_TIMEOUT = 120;
    string constant API_QUERY = "json(https://api.cryptonator.com/api/ticker/eth-rub).ticker.price";

    uint public price;
    uint public updatedAt;
    uint public delay;

    bool public queryQueued;

    event Log(string message);
    event Updated(uint price);

    function constructor(uint delay) public {
        require(delay >= 60);
        this.delay = delay;
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

    function update(uint delay) payable public {
        if (queryQueued) {
            emit Log("Запрос уже добавлен в очередь");
            return;
        }
        if (oraclize_getPrce("URL") > this.balance) {
            emit Log("Недостаточно средств для добавления запроса в очередь");
            return;
        }
        oraclize_query(delay, "URL", API_QUERY);
        queryQueued = true;
        emit Log("Запрос добавлен в очередь, ожидаю ответ...");
    }

    function isOutOfSync() public view returns (bool) {
        /* solium-disable-next-line security/no-block-members */
        return now > updatedAt + delay + SYNC_TIMEOUT;
    }
}

contract ETHRUBTestOracle is ETHRUBOracle {
    function constructor(address oarAddress, uint delay) ETHRUBOracle(delay) public {
        OAR = OraclizeAddrResolverI(oarAddress);
    }
}
