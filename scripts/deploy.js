const { ethers } = require("hardhat");

async function main() {
  // Lấy ContractFactory
  const DeFiSwapLend = await ethers.getContractFactory("DeFiSwapLend");
  // Triển khai hợp đồng
  const defi = await DeFiSwapLend.deploy();
  // Chờ giao dịch triển khai được xác nhận
  await defi.waitForDeployment();
  // Lấy địa chỉ hợp đồng
  const contractAddress = await defi.getAddress();
  console.log("Contract deployed to:", contractAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});