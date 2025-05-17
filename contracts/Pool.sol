// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Pool {
    using SafeMath for uint256;
    using SafeMath for uint32;

    uint256 public totalSupply;
    uint32 public slope;
    mapping(address => uint256) public balances;

    constructor(uint256 initialSupply, uint32 _slope) {
        totalSupply = initialSupply;
        slope = _slope;
    }

    function buy() public payable {
        require(msg.value > 0, "Amount must be greater than 0");
        uint256 tokenToMint = calculateBuyReturn(msg.value);
        totalSupply = totalSupply.add(tokenToMint);
        balances[msg.sender] = balances[msg.sender].add(tokenToMint);
    }

    function sell(uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");

        balances[msg.sender] = balances[msg.sender].sub(amount);
        totalSupply = totalSupply.sub(amount);

        uint256 tokenToBurn = calculateSellReturn(amount);
        require(address(this).balance >= tokenToBurn, "Insufficient balance");

        payable(msg.sender).transfer(tokenToBurn);
    }

    function calculateTokenPrice() public view returns (uint256) {
        uint256 expectedSupply = totalSupply.mul(totalSupply);
        return expectedSupply;
    }

    function calculateBuyReturn(uint256 amount) public view returns (uint256) {
        uint256 tokenPrice = calculateTokenPrice();
        return amount.div(tokenPrice);
    }

    function calculateSellReturn(uint256 amount) public view returns (uint256) {
        uint256 tokenPrice = calculateTokenPrice();
        return amount.mul(tokenPrice);
    }

    receive() external payable {}
}
