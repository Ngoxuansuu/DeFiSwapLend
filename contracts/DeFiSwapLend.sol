// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20; // Thay ^0.8.0 thành ^0.8.20

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DeFiSwapLend {
    address public owner;
    mapping(address => uint256) public liquidityPool;
    mapping(address => mapping(address => uint256)) public loans;
    uint256 public constant INTEREST_RATE = 5;

    constructor() {
        owner = msg.sender;
    }

    function addLiquidity(address token, uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        liquidityPool[token] += amount;
    }

    function swap(address tokenIn, address tokenOut, uint256 amountIn) external {
        require(amountIn > 0, "Amount must be greater than 0");
        require(liquidityPool[tokenOut] >= amountIn, "Insufficient liquidity");
        uint256 amountOut = amountIn;
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
        IERC20(tokenOut).transfer(msg.sender, amountOut);
        liquidityPool[tokenIn] += amountIn;
        liquidityPool[tokenOut] -= amountOut;
    }

    function lend(address token, uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        require(liquidityPool[token] >= amount, "Insufficient liquidity");
        loans[msg.sender][token] += amount;
        liquidityPool[token] -= amount;
        IERC20(token).transfer(msg.sender, amount);
    }

    function repay(address token, uint256 amount) external {
        require(loans[msg.sender][token] >= amount, "Invalid loan amount");
        uint256 interest = (amount * INTEREST_RATE) / 100;
        IERC20(token).transferFrom(msg.sender, address(this), amount + interest);
        loans[msg.sender][token] -= amount;
        liquidityPool[token] += (amount + interest);
    }
}