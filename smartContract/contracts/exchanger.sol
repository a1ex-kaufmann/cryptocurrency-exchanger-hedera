pragma solidity ^0.5.0;

contract SafeMath {
    function safeMul(uint a, uint b) internal returns (uint) {
        uint c = a * b;
        assert(a == 0 || c / a == b);
        return c;
    }

    function safeSub(uint a, uint b) internal returns (uint) {
        assert(b <= a);
        return a - b;
    }

    function safeAdd(uint a, uint b) internal returns (uint) {
        uint c = a + b;
        assert(c>=a && c>=b);
        return c;
    }
}



contract Exchanger is SafeMath {

    address public admin;
    bool public tradeState;

    mapping (address => mapping (uint => uint)) public tokens;
    uint[][] dataArray;
    address[] addressesArray;


  constructor () public {
      admin = msg.sender;
      tradeState = true;
      
      uint256 zeroNum = 0;
      uint[5] memory tempArray = [zeroNum,zeroNum,zeroNum,zeroNum,zeroNum];
      dataArray.push(tempArray);
  }

  modifier onlyAdmin {
        require(msg.sender != admin);
        _;
  }

  modifier tradeIsOpen {
        require(tradeState);
        _;
  }

  function checkAdmin() onlyAdmin public view returns (bool) {
    return true;
  }

  function transferOwnership(address newAdmin) public onlyAdmin {
    admin = newAdmin;
  }

  function changeTradeState(bool state_) public onlyAdmin {
    tradeState = state_;
  }

  function deposit() payable tradeIsOpen public {
    tokens[msg.sender][0] = safeAdd(tokens[msg.sender][0], msg.value);
  }

  function withdraw(uint amount) public {
    require(tokens[msg.sender][0] >= amount);
    tokens[msg.sender][0] = safeSub(tokens[msg.sender][0], amount);
    msg.sender.call.value(amount)("");
  }


  function myBalance(uint token) view public returns (uint) {
    return tokens[msg.sender][token];
  }

  function order(uint tokenGet, uint amountGet, uint tokenGive, uint amountGive) public returns(uint) {
    uint index = dataArray.length - 1;
    dataArray[index][0] = 1;
    dataArray[index][1] = tokenGet;
    dataArray[index][2] = amountGet;
    dataArray[index][3] = tokenGive;
    dataArray[index][4] = amountGive;
    addressesArray.push(msg.sender);
    
    uint256 zeroNum = 0;
    uint[5] memory tempArray = [zeroNum,zeroNum,zeroNum,zeroNum,zeroNum];
    dataArray.push(tempArray);
    return index;
  }
  
  function getData(uint order, uint param) public view returns(uint) {
      return dataArray[order][param];
  }
  
  function getMaker(uint order) public view returns(address) {
      return addressesArray[order];
  }
  
  function getMeMoney() public {
      tokens[msg.sender][0] = 100;
      tokens[msg.sender][1] = 100;
      tokens[msg.sender][2] = 100;
      tokens[msg.sender][3] = 100;
  }

  function trade(uint order) public {
    tradeBalances(dataArray[order][1], dataArray[order][2], dataArray[order][3], dataArray[order][4], addressesArray[order]);
    dataArray[order][0] = 2;
  }

  function tradeBalances(uint tokenGet, uint amountGet, uint tokenGive, uint amountGive, address user) private {
    tokens[msg.sender][tokenGet] = safeSub(tokens[msg.sender][tokenGet], amountGet);
    tokens[user][tokenGet] = safeAdd(tokens[user][tokenGet], amountGet);
    tokens[user][tokenGive] = safeSub(tokens[user][tokenGive], amountGive);
    tokens[msg.sender][tokenGive] = safeAdd(tokens[msg.sender][tokenGive], amountGive);
  }
}