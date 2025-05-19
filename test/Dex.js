const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Dex", () => {
  it("should work", async () => {
    const [owner, otherAccount] = await ethers.getSigners();

    // deploy the test ERC20 tokens so we can actually register a new pool.
    const initialSupply = ethers.parseUnits("100", 8);
    
    // Deploy USDC token
    const UsdcToken = await ethers.getContractFactory("Usdc");
    const usdcToken = await UsdcToken.deploy(initialSupply);
    await usdcToken.waitForDeployment();
    const usdcAddress = await usdcToken.getAddress();
    
    // Deploy TAHA token
    const TahaToken = await ethers.getContractFactory("Taha");
    const tahaToken = await TahaToken.deploy(initialSupply);
    await tahaToken.waitForDeployment();
    const tahaAddress = await tahaToken.getAddress();

    // Log token addresses to verify they're not null
    console.log("USDC Token address:", usdcAddress);
    console.log("TAHA Token address:", tahaAddress);

    // Deploy DEX
    const Dex = await ethers.getContractFactory("Dex");
    const dex = await Dex.deploy();
    await dex.waitForDeployment();
    const dexAddress = await dex.getAddress();
    console.log("Dex address:", dexAddress);

    // Register pool with both tokens
    await dex.registerPool(usdcAddress, tahaAddress);

    // Deposit some USDC
    const depositAmount = ethers.parseUnits("2", 8);
    await usdcToken.approve(dexAddress, depositAmount);
    await dex.deposit("USDCTAHA", usdcAddress, depositAmount);
    expect(
      await dex.poolTokenBalances(owner.address, usdcAddress)
    ).to.equal(depositAmount);

    // Deposit some TAHA tokens
    const tahaTokenDepositAmount = ethers.parseUnits("1", 8);
    await tahaToken.approve(dexAddress, tahaTokenDepositAmount);
    await dex.deposit("USDCTAHA", tahaAddress, tahaTokenDepositAmount);
    expect(
      await dex.poolTokenBalances(owner.address, tahaAddress)
    ).to.equal(tahaTokenDepositAmount);

    console.log(
      "usdc balance before swap",
      await usdcToken.balanceOf(owner.address)
    );
    console.log(
      "taha token balance before swap",
      await tahaToken.balanceOf(owner.address)
    );

    const amountUSDCToSwap = ethers.parseUnits("0.5", 8);
    await usdcToken.approve(dexAddress, amountUSDCToSwap);
    await dex.swap("USDCTAHA", usdcAddress, amountUSDCToSwap);

    console.log(    
      "usdc balance after swap",
      await usdcToken.balanceOf(owner.address)
    );
    console.log(
      "taha token balance after swap",
      await tahaToken.balanceOf(owner.address)
    );

    // await dex.withdraw("USDCTAHA", tahaAddress, tahaTokenDepositAmount);
    // expect(
    //   await dex.poolTokenBalances(owner.address, tahaAddress)
    // ).to.equal(0);

    // expect(await usdcToken.balanceOf(dexAddress)).to.equal(0);
  });
});