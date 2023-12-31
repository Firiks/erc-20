const { assert, expect } = require("chai");
const { network, getNamedAccounts, deployments, ethers } = require("hardhat");
const { developmentChains, INITIAL_SUPPLY } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("OgToken Unit Test", function () {
    // Multipler is used to make reading the math easier because of the 18 decimal points
    const multiplier = 10 ** 18;

    let ogToken, deployer, user1, user2;

    beforeEach(async function () {
      const accounts = await getNamedAccounts();
      deployer = accounts.deployer;
      user1 = accounts.user1;
      user2 = accounts.user2;

      await deployments.fixture("all");
      ogToken = await ethers.getContract("OgToken", deployer);
    });

    it("was deployed", async () => {
      assert(ogToken.address);
    });

    describe("constructor", () => {
      it("Should have correct INITIAL_SUPPLY of token ", async () => {
        const totalSupply = await ogToken.totalSupply();
        assert.equal(totalSupply.toString(), INITIAL_SUPPLY);
      });

      it("initializes the token with the correct name and symbol ", async () => {
        const name = (await ogToken.name()).toString();
        assert.equal(name, "OgToken");

        const symbol = (await ogToken.symbol()).toString();
        assert.equal(symbol, "OG");
      });
    });

    describe("transfers", () => {
      it("Should be able to transfer tokens successfully to an address", async () => {
        const tokensToSend = ethers.utils.parseEther("10");
        await ogToken.transfer(user1, tokensToSend);
        expect(await ogToken.balanceOf(user1)).to.equal(tokensToSend);
      });

      it("emits an transfer event, when an transfer occurs", async () => {
        await expect(ogToken.transfer(user1, (10 * multiplier).toString())).to.emit(
          ogToken,
          "Transfer"
        );
      });
    });

    describe("allowances", () => {
      const amount = (20 * multiplier).toString();
      beforeEach(async () => {
        playerToken = await ethers.getContract("OgToken", user1); // create a new instance of the contract
      });

      it("Should approve other address to spend token", async () => {
        const tokensToSpend = ethers.utils.parseEther("5");
        //Deployer is approving that user1 can spend 5 tokens
        await ogToken.approve(user1, tokensToSpend);
        await playerToken.transferFrom(deployer, user1, tokensToSpend);
        expect(await playerToken.balanceOf(user1)).to.equal(tokensToSpend);
      });

      it("doesn't allow an unnaproved member to do transfers", async () => {
        await expect(
          playerToken.transferFrom(deployer, user1, amount)
        ).to.be.revertedWith("ERC20: insufficient allowance");
      });

      it("emits an approval event, when an approval occurs", async () => {
        await expect(ogToken.approve(user1, amount)).to.emit(ogToken, "Approval")
      });

      it("the allowance being set is accurate", async () => {
        await ogToken.approve(user1, amount);
        const allowance = await ogToken.allowance(deployer, user1);
        assert.equal(allowance.toString(), amount);
      });

      it("won't allow a user to go over the allowance", async () => {
        await ogToken.approve(user1, amount);
        await expect(
          playerToken.transferFrom(deployer, user1, (40 * multiplier).toString())
        ).to.be.revertedWith("ERC20: insufficient allowance");
      });

      it("allow transfer from user1 to user2", async () => {
        const tokensToSpend = ethers.utils.parseEther("5");

        // transfer tokens to user1
        await ogToken.approve(user1, tokensToSpend);
        await playerToken.transferFrom(deployer, user1, tokensToSpend);

        // get signer for user1
        const user1Singer = ethers.provider.getSigner(user1);
      
        // transfer tokens from user1 to user2
        await ogToken.connect(user1Singer).approve(user1, tokensToSpend);
        await ogToken.connect(user1Singer).approve(user2, tokensToSpend);
        await playerToken.connect(user1Singer).transferFrom(user1, user2, tokensToSpend);
      
        // console.log("user1 balance: ", await playerToken.balanceOf(user1));
        // console.log("user2 balance: ", await playerToken.balanceOf(user2));

        expect(await playerToken.balanceOf(user2)).to.equal(tokensToSpend);
      });

    });
  });