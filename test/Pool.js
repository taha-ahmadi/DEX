describe("Pool", function () {
  it("should create a pool", async function () {
    const [owner, user] = await ethers.getSigners();
    const initialSupply = ethers.parseEther("10",0); // for example
    const slope = 1
      const Pool = await ethers.getContractFactory("Pool");
      console.log("Contract factory created");
      const pool = await Pool.deploy(initialSupply, slope);
      console.log("Deployment transaction sent");
      await pool.waitForDeployment();
      console.log("Contract deployed at:", await pool.getAddress());

      await owner.sendTransaction({
        to: await pool.getAddress(),
        value: ethers.parseEther("1000.0")
      });

      const tokenPrice = await pool.calculateTokenPrice();
      console.log("Token price:", tokenPrice.toString());

      await pool.buy({ value: ethers.parseEther("20.0") });
      const balance = await pool.balanceOf(owner.address);
      console.log("Balance:", balance.toString());
      
      const contractBalance = await ethers.provider.getBalance(await pool.getAddress());
      console.log("Contract balance:", contractBalance.toString());

      const tokenPrice2 = await pool.calculateTokenPrice();
      console.log("Token price:", tokenPrice2.toString());

      const balance2 = await pool.balanceOf(owner.address);
      console.log("Balance:", balance2.toString());
      
      const partialAmount = ethers.parseEther("1");
      await pool.sell(partialAmount);
      const otherBalance = await pool.balanceOf(user.address);
      console.log("Other balance:", otherBalance.toString());
      
  
  });
});