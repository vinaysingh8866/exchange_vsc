import { expect } from "chai";
import { ContractTransactionResponse } from "ethers";
import { ethers } from "hardhat";
import { MockNFT } from "../typechain-types";
const { upgrades } = require("hardhat");
describe("GasFeeDistributor", function () {
  let GasFeeDistributor, gasFeeDistributor: any;
  let diamondNFT: MockNFT & {
      deploymentTransaction(): ContractTransactionResponse;
    },
    carbonNFT: MockNFT & {
      deploymentTransaction(): ContractTransactionResponse;
    },
    greenNFT: MockNFT & {
      deploymentTransaction(): ContractTransactionResponse;
    },
    goldNFT: MockNFT & { deploymentTransaction(): ContractTransactionResponse };
  let owner: { address: any },
    orgAddress: { address: any },
    user1: { address: any },
    user2: { address: any },
    otherAccounts;
  // 25,
  //     150,
  //     350,
  //     400
  const TOTAL_DIAMOND_NFTS = 25;
  const TOTAL_CARBON_NFTS = 150;
  const TOTAL_GREEN_NFTS = 350;
  const TOTAL_GOLD_NFTS = 400;

  beforeEach(async function () {
    // Deploy mock NFT contracts
    const MockNFT = await ethers.getContractFactory("MockNFT");
    diamondNFT = await MockNFT.deploy(
      "25",
      "Diamond NFT",
      "VSDVB",
      "https://purple-abundant-anaconda-910.mypinata.cloud/ipfs/bafkreiargwgru6qmfrrcmezr5szvf22ztmcbwxgo4tdpxajw52omp4nkle"
    );
    carbonNFT = await MockNFT.deploy(
      "150",
      "Carbon NFT",
      "VSCVB",
      "https://purple-abundant-anaconda-910.mypinata.cloud/ipfs/bafkreiayu6s22ga3oqrnlc3goyzioq5g65enprah2phroihznnaxzxjfe4"
    );
    greenNFT = await MockNFT.deploy(
      "350",
      "Green NFT",
      "VSGVB",
      "https://purple-abundant-anaconda-910.mypinata.cloud/ipfs/bafkreig4udomonhm5pg4mn526e47mrprrsn67c4foxkegmlw6oeo2jt2dy"
    );
    goldNFT = await MockNFT.deploy(
      "400",
      "Gold NFT",
      "VSGVB",
      "https://purple-abundant-anaconda-910.mypinata.cloud/ipfs/bafkreid6abmsfvqvdwutveokg35mjpppivd5hhudmzvcx6bweownwtq3ja"
    );
    const diamondNFTaddress = await diamondNFT.getAddress();
    const carbonNFTaddress = await carbonNFT.getAddress();
    const greenNFTaddress = await greenNFT.getAddress();
    const goldNFTaddress = await goldNFT.getAddress();

    // Mint NFTs for testing
    [owner, orgAddress, user1, user2, ...otherAccounts] =
      await ethers.getSigners();

    await diamondNFT.batchMint(user1.address, 
      [1, 2, 3, 4, 5]
    ); // Mint 5 diamond NFTs to user1
    await carbonNFT.batchMint(user1.address, 
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    ); // Mint 10 carbon NFTs to user1
    await greenNFT.batchMint(user2.address, 
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    ); // Mint 15 green NFTs to user2
    await goldNFT.batchMint(user2.address, 
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
    );
    const GasFeeDistributor = await ethers.getContractFactory(
      "GasFeeDistributor"
    );

    const diamondPercentage = 1234; // 15% in basis points
    const carbonPercentage = 6494; // 20% in basis points
    const greenPercentage = 1623; // 30% in basis points
    const goldPercentage = 649; // 35% in basis points
    gasFeeDistributor = await GasFeeDistributor.deploy(
      diamondPercentage,
      carbonPercentage,
      greenPercentage,
      goldPercentage
    );

    await gasFeeDistributor.waitForDeployment();

    await gasFeeDistributor.setupNFTContracts(
      diamondNFTaddress,
      carbonNFTaddress,
      greenNFTaddress,
      goldNFTaddress,
      TOTAL_DIAMOND_NFTS,
      TOTAL_CARBON_NFTS,
      TOTAL_GREEN_NFTS,
      TOTAL_GOLD_NFTS
    );
  });

  describe("Deployment", function () {
    it("Should set the NFT addresses correctly", async function () {
      expect(await gasFeeDistributor.diamondNFT()).to.equal(
        await diamondNFT.getAddress()
      );
      expect(await gasFeeDistributor.carbonNFT()).to.equal(
        await carbonNFT.getAddress()
      );
      expect(await gasFeeDistributor.greenNFT()).to.equal(
        await greenNFT.getAddress()
      );
      expect(await gasFeeDistributor.goldNFT()).to.equal(
        await goldNFT.getAddress()
      );
    });
  });

  //   import { ethers } from "hardhat";

  // async function deploy() {

  //   // Deploy the VSC NFT Contracts
  //   const VSCNFT = await ethers.getContractFactory("VSCNFT");
  //   const diamondNFT = await VSCNFT.deploy("Diamond NFT", "DIMND");
  //   const carbonNFT = await VSCNFT.deploy("Carbon NFT", "CARBON");
  //   const greenNFT = await VSCNFT.deploy("Green NFT", "GREEN");
  //   const goldNFT = await VSCNFT.deploy("Gold NFT", "GOLD");

  //   console.log("Diamond NFT deployed to:", await diamondNFT.getAddress());
  //   console.log("Carbon NFT deployed to:", await carbonNFT.getAddress());
  //   console.log("Green NFT deployed to:", await greenNFT.getAddress());
  //   console.log("Gold NFT deployed to:", await goldNFT.getAddress());

  //   // Deploy the GasFeeDistributor contract
  //   const GasFeeDistributor = await ethers.getContractFactory(
  //     "GasFeeDistributor"
  //   );
  //   const diamondPercentage = 1234; // 15% in basis points
  //   const carbonPercentage = 6494; // 20% in basis points
  //   const greenPercentage = 1623; // 30% in basis points
  //   const goldPercentage = 649; // 35% in basis points

  //   const gasFeeDistributor = await GasFeeDistributor.deploy(
  //     diamondPercentage,
  //     carbonPercentage,
  //     greenPercentage,
  //     goldPercentage
  //   );

  //   const address = await gasFeeDistributor.getAddress();
  //   console.log("Contract address=", address)

  //   // Set the NFT addresses in the GasFeeDistributor
  //   await gasFeeDistributor.setupNFTContracts(
  //     diamondNFT.getAddress(),
  //     carbonNFT.getAddress(),
  //     greenNFT.getAddress(),
  //     goldNFT.getAddress(),
  //     25,
  //     150,
  //     350,
  //     400
  //   );

  //   // send 1000 VSG to the contract
  //   const [owner] = await ethers.getSigners();
  //   const tx = await owner.sendTransaction({
  //     to: address,
  //     value: ethers.parseEther("1000"),
  //   });
  //   //console.log("Transaction hash:", tx);
  //   const balance1 = await gasFeeDistributor.connect(owner).viewTotalEarnings();
  //   console.log("Balance after depositing 1000=", ethers.formatEther(balance1));
  //   const balance2 = await gasFeeDistributor.previousBalance();
  //   console.log("previousBalance=", ethers.formatEther(balance2));

  //   // Mint tokens
  //   await diamondNFT.mint(owner, 1);
  //   await diamondNFT.mint(owner, 2);
  //   await diamondNFT.mint(owner, 3);

  //   // Withdraw from token 1
  //   await gasFeeDistributor.connect(owner).withdrawEarnings(1, diamondNFT.getAddress());
  //   const balance3 = await gasFeeDistributor.previousBalance();
  //   console.log("Balance after withdrawl=", ethers.formatEther(balance3));

  //   const earning1 = await gasFeeDistributor.calculateUserEarnings(
  //     await diamondNFT.getAddress(),
  //     2
  //   );
  //   console.log("Earning token 2", ethers.formatEther(earning1));

  //   // Withdraw from token 3
  //   await gasFeeDistributor.connect(owner).withdrawEarnings(3, diamondNFT.getAddress());
  //   const balance4 = await gasFeeDistributor.previousBalance();
  //   console.log("Balance after withdrawl=", ethers.formatEther(balance4));

  //   const earning2 = await gasFeeDistributor.calculateUserEarnings(
  //     await diamondNFT.getAddress(),
  //     2
  //   );
  //   console.log("Earning token 2", ethers.formatEther(earning2));

  // };

  // deploy();

  describe("Fee Distribution", function () {
    it("Should calculate the correct fee distribution", async function () {
      const totalValue = ethers.parseEther("100");
      await ethers.provider.send("eth_sendTransaction", [
        {
          from: owner.address,
          to: await gasFeeDistributor.getAddress(),
          value: totalValue.toString(),
        },
      ]);

      const earning = await gasFeeDistributor.calculateUserEarnings(
        await diamondNFT.getAddress(),
        1
      );
      
      expect(earning).to.equal(493600000000000000n);
    });
    it("Should distribute fees correctly", async function () {
      const totalValue = ethers.parseEther("4");
      await ethers.provider.send("eth_sendTransaction", [
        {
          from: owner.address,
          to: await gasFeeDistributor.getAddress(),
          value: totalValue.toString(),
        },
      ]);

      const address = await diamondNFT.getAddress();

      await gasFeeDistributor.connect(user1).withdrawEarnings(1, address);

      expect(
        await gasFeeDistributor.totalAllocatedToNFTType(
          await diamondNFT.getAddress()
        )
      ).to.equal(493600000000000000n);
      expect(
        await gasFeeDistributor.totalAllocatedToNFTType(
          await carbonNFT.getAddress()
        )
      ).to.equal(2597600000000000000n);
      expect(
        await gasFeeDistributor.totalAllocatedToNFTType(
          await greenNFT.getAddress()
        )
      ).to.equal(649200000000000000n);
      expect(
        await gasFeeDistributor.totalAllocatedToNFTType(
          await goldNFT.getAddress()
        )
      ).to.equal(259600000000000000n);
    });
    // it("Should distribute fees correctly when user has multiple NFTs", async function () {
    //   //   const [owner] = await ethers.getSigners();
    //   //   const tx = await owner.sendTransaction({
    //   //     to: address,
    //   //     value: ethers.parseEther("1000"),
    //   //   });
    //   //   //console.log("Transaction hash:", tx);
    //   //   const balance1 = await gasFeeDistributor.connect(owner).viewTotalEarnings();
    //   //   console.log("Balance after depositing 1000=", ethers.formatEther(balance1));
    //   //   const balance2 = await gasFeeDistributor.previousBalance();
    //   //   console.log("previousBalance=", ethers.formatEther(balance2));
    //   //   // Mint tokens
    //   //   await diamondNFT.mint(owner, 1);
    //   //   await diamondNFT.mint(owner, 2);
    //   //   await diamondNFT.mint(owner, 3);
    //   //   // Withdraw from token 1
    //   //   await gasFeeDistributor.connect(owner).withdrawEarnings(1, diamondNFT.getAddress());
    //   //   const balance3 = await gasFeeDistributor.previousBalance();
    //   //   console.log("Balance after withdrawl=", ethers.formatEther(balance3));
    //   //   const earning1 = await gasFeeDistributor.calculateUserEarnings(
    //   //     await diamondNFT.getAddress(),
    //   //     2
    //   //   );
    //   //   console.log("Earning token 2", ethers.formatEther(earning1));
    //   //   // Withdraw from token 3
    //   //   await gasFeeDistributor.connect(owner).withdrawEarnings(3, diamondNFT.getAddress());
    //   //   const balance4 = await gasFeeDistributor.previousBalance();
    //   //   console.log("Balance after withdrawl=", ethers.formatEther(balance4));
    //   //   const earning2 = await gasFeeDistributor.calculateUserEarnings(
    //   //     await diamondNFT.getAddress(),
    //   //     2
    //   //   );
    //   //   console.log("Earning token 2", ethers.formatEther(earning2));
    //   const totalValue = ethers.parseEther("4");
    //   await ethers.provider.send("eth_sendTransaction", [
    //     {
    //       from: owner.address,
    //       to: await gasFeeDistributor.getAddress(),
    //       value: totalValue.toString(),
    //     },
    //   ]);

    //   const balance1 = await gasFeeDistributor
    //     .connect(user1)
    //     .viewTotalEarnings();
    //   console.log(
    //     "Balance after depositing 1000=",
    //     ethers.formatEther(balance1)
    //   );
    //   const balance2 = await gasFeeDistributor.previousBalance();
    //   console.log("previousBalance=", ethers.formatEther(balance2));

    //   await gasFeeDistributor
    //     .connect(user1)
    //     .withdrawEarnings(3, diamondNFT.getAddress());
    //   const balance3 = await gasFeeDistributor.previousBalance();
    //   const earning1 = await gasFeeDistributor.calculateUserEarnings(
    //     await diamondNFT.getAddress(),
    //     3
    //   );
    //   console.log("Earning token 2", ethers.formatEther(earning1));

    //   // Withdraw from token 3
    //   await gasFeeDistributor
    //     .connect(owner)
    //     .withdrawEarnings(4, diamondNFT.getAddress());
    //   const balance4 = await gasFeeDistributor.previousBalance();
    //   console.log("Balance after withdrawl=", ethers.formatEther(balance4));

    //   const earning2 = await gasFeeDistributor.calculateUserEarnings(
    //     await diamondNFT.getAddress(),
    //     4
    //   );
    //   console.log("Earning token 2", ethers.formatEther(earning2)); // const address = await diamondNFT.getAddress();
    //   // await gasFeeDistributor.connect(user1).withdrawEarnings(1, address);

    //   // const firstBalance = await gasFeeDistributor.totalAllocatedToNFTType(
    //   //   await diamondNFT.getAddress()
    //   // );
    //   // console.log("firstBalance", firstBalance);

    //   // const secondBalance = await gasFeeDistributor
    //   //   .connect(user1)
    //   //   .withdrawEarnings(2, address);
    //   // console.log("secondBalance", secondBalance);
    //   // expect(
    //   //   await gasFeeDistributor.totalAllocatedToNFTType(
    //   //     await diamondNFT.getAddress()
    //   //   )
    //   // ).to.equal(1080000000000000000n);
    // });
  });

  describe("Withdrawals", function () {
    it("Should allow users to withdraw earnings", async function () {
      const initialUser1Balance = await ethers.provider.getBalance(
        user1.address
      );

      // // Send 4 ether to the contract
      await ethers.provider.send("eth_sendTransaction", [
        {
          from: owner.address,
          to: await gasFeeDistributor.getAddress(),
          value: ethers.parseEther("4").toString(),
        },
      ]);

      // // withdraw earnings
      const address = await diamondNFT.getAddress();
      const widthraw = await gasFeeDistributor
        .connect(user1)
        .withdrawEarnings(1, address);
      const finalUser1Balance = await ethers.provider.getBalance(user1.address);

      expect(finalUser1Balance).to.equal(10000039048179887661409n);
    });

    it("Should revert if user has no earnings to withdraw", async function () {
      await expect(
        gasFeeDistributor
          .connect(user1)
          .withdrawEarnings(1, await diamondNFT.getAddress())
      ).to.be.revertedWith("No earnings to withdraw");
    });
  });
});
