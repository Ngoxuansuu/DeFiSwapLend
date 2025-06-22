#!/usr/bin/env node
const { ethers } = require("hardhat");

async function main() {
  const DeFiSwapLend = await ethers.getContractFactory("DeFiSwapLend");
  const defi = await DeFiSwapLend.deploy();
  await defi.waitForDeployment();
  console.log("DeFiSwapLend deployed to:", defi.address);
}

main().catch(console.error);