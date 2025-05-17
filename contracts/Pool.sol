// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Pool is ERC20 {
    using SafeMath for uint256;
    using SafeMath for uint32;

    uint32 public slope;

    constructor(uint256 initialSupply, uint32 _slope) ERC20("Pool", "POOL") {
        require(initialSupply > 0, "Initial supply must be greater than 0");
        _mint(msg.sender, initialSupply);
        slope = _slope;
    }

    function buy() public payable {
        require(msg.value > 0, "Amount must be greater than 0");

        uint256 tokenToMint = calculateBuyReturn(msg.value);
        _mint(msg.sender, tokenToMint);
    }

    function sell(uint256 amount) public {
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");

        uint256 tokenToBurn = calculateSellReturn(amount);
        require(address(this).balance >= tokenToBurn, "Insufficient balance");

        payable(msg.sender).transfer(tokenToBurn);
    }

    function calculateTokenPrice() public view returns (uint256) {
        uint256 expectedSupply = totalSupply();
        return expectedSupply.mul(expectedSupply).div(1e18);
    }

    function calculateBuyReturn(uint256 amount) public view returns (uint256) {
        uint256 tokenPrice = calculateTokenPrice();
        require(tokenPrice > 0, "Token price is zero");

        return amount.div(tokenPrice);
    }

    function calculateSellReturn(uint256 amount) public view returns (uint256) {
        uint256 tokenPrice = calculateTokenPrice();
        return amount.mul(tokenPrice).div(1e18);
    }

    receive() external payable {}
}
