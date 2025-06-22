const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DeFiSwapLend", function () {
  let DeFiSwapLend, defi, owner, user1, user2, token, tokenOut;

  beforeEach(async function () {
    const ERC20Mock = await ethers.getContractFactory("ERC20Mock");
    token = await ERC20Mock.deploy("Mock Token", "MTK", ethers.parseEther("1000"));
    await token.waitForDeployment();

    tokenOut = await ERC20Mock.deploy("Mock Token Out", "MTO", ethers.parseEther("1000"));
    await tokenOut.waitForDeployment();

    DeFiSwapLend = await ethers.getContractFactory("DeFiSwapLend");
    defi = await DeFiSwapLend.deploy();
    await defi.waitForDeployment();

    [owner, user1, user2] = await ethers.getSigners();

    await token.connect(owner).approve(defi.getAddress(), ethers.parseEther("1000"));
    await tokenOut.connect(owner).approve(defi.getAddress(), ethers.parseEther("1000"));
    await token.connect(user1).approve(defi.getAddress(), ethers.parseEther("1000"));
    await tokenOut.connect(user1).approve(defi.getAddress(), ethers.parseEther("1000"));

    await token.connect(owner).transfer(user1.address, ethers.parseEther("100"));
  });

  it("Should set correct owner", async function () {
    expect(await defi.owner()).to.equal(owner.address);
  });

  it("Should add liquidity correctly", async function () {
    const amount = ethers.parseEther("100");
    await defi.connect(owner).addLiquidity(token.getAddress(), amount);
    expect(await defi.liquidityPool(token.getAddress())).to.equal(amount);
  });

  it("Should swap tokens correctly", async function () {
    const amount = ethers.parseEther("100");
    await defi.connect(owner).addLiquidity(token.getAddress(), amount);
    await defi.connect(owner).addLiquidity(tokenOut.getAddress(), amount);

    const amountIn = ethers.parseEther("10");
    await defi.connect(user1).swap(token.getAddress(), tokenOut.getAddress(), amountIn);

    expect(await defi.liquidityPool(token.getAddress())).to.equal(ethers.parseEther("110"));
    expect(await defi.liquidityPool(tokenOut.getAddress())).to.equal(ethers.parseEther("90"));
  });

  it("Should lend tokens correctly", async function () {
    const amount = ethers.parseEther("50");
    await defi.connect(owner).addLiquidity(token.getAddress(), ethers.parseEther("100"));
    await defi.connect(user1).lend(token.getAddress(), amount);

    expect(await defi.loans(user1.address, token.getAddress())).to.equal(amount);
    expect(await defi.liquidityPool(token.getAddress())).to.equal(ethers.parseEther("50"));
  });

  it("Should repay loan correctly", async function () {
    const amount = ethers.parseEther("50");
    await defi.connect(owner).addLiquidity(token.getAddress(), ethers.parseEther("100"));
    await defi.connect(user1).lend(token.getAddress(), amount);

    await token.connect(user1).mint(user1.address, ethers.parseEther("100"));
    await token.connect(user1).approve(defi.getAddress(), ethers.parseEther("100"));

    await defi.connect(user1).repay(token.getAddress(), amount);

    expect(await defi.loans(user1.address, token.getAddress())).to.equal(0);
    expect(await defi.liquidityPool(token.getAddress())).to.equal(ethers.parseEther("102.5")); // 50 + 50 + 2.5 (lãi 5%)
  });
});