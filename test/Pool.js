describe("Pool", function () {
  it("should create a pool", async function () {
    const [owner, user] = await ethers.getSigners();
    const initialSupply = BigInt(1)
    const slope = 1;
      const Pool = await ethers.getContractFactory("Pool");
      console.log("Contract factory created");
      const pool = await Pool.deploy(initialSupply, slope);
      console.log("Deployment transaction sent");
      await pool.waitForDeployment();
      console.log("Contract deployed at:", await pool.getAddress());

      await owner.sendTransaction({
        to: await pool.getAddress(),
        value: ethers.parseEther("100.0")
      });

      const tokenPrice = await pool.calculateTokenPrice();
      console.log("Token price:", tokenPrice.toString());

      await pool.buy({ value: ethers.parseEther("20.0") });
      const balance = await pool.balances(owner.address);
      console.log("Balance:", balance.toString());
      
      const contractBalance = await ethers.provider.getBalance(await pool.getAddress());
      console.log("Contract balance:", contractBalance.toString());

      const tokenPrice2 = await pool.calculateTokenPrice();
      console.log("Token price:", tokenPrice2.toString());

      const balance2 = await pool.balances(owner.address);
      console.log("Balance:", balance2.toString());

      await pool.sell(balance2);
      const otherBalance = await pool.balances(user.address);
      console.log("Other balance:", otherBalance.toString());
      
  
  });
});