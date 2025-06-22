const { ethers } = require("hardhat");

module.exports = {
  async deploy() {
    const DeFiSwapLend = await ethers.getContractFactory("DeFiSwapLend");
    const defi = await DeFiSwapLend.deploy();
    await defi.waitForDeployment();
    return defi;
  }
};