import { ethers } from "hardhat";

const { upgrades } = require("hardhat");
async function deploy() {
  const [owner] = await ethers.getSigners();
  const UniswapV2Factory = await ethers.getContractFactory("UniswapV2Factory");
  const uniswapV2Factory = await UniswapV2Factory.deploy(owner.address);
  await uniswapV2Factory.waitForDeployment();
  console.log("UniswapV2Factory deployed to:", await uniswapV2Factory.getAddress());
  console.log(await uniswapV2Factory.INIT_CODE_PAIR_HASH(), "INIT_CODE_PAIR_HASH");
  const weth9 = await ethers.getContractFactory("WETH9");
  // console.log("Deploying WETH9...", weth9);
  const weth = await weth9.deploy();
  await weth.waitForDeployment();
  // mint 1000 weth to owner
  await weth.deposit({ value: ethers.parseEther("1000") });

  console.log("WETH9 deployed to:", await weth.getAddress());
  // open router.sol file and replace 127081bc7e9ea223cfb7c2690919c9d7c5ebd1fbd6a60454bb528f30d41315a6 with INIT_CODE_PAIR_HASH remove 0x from the start
  const files = require("fs");
  const data = files.readFileSync("contracts/Router.sol", "utf8");
  const newValue = await uniswapV2Factory.INIT_CODE_PAIR_HASH();
  console.log("newValue", newValue);
  const result = data.replace("561ae01693754a05b94d024dd80c22cc5a8eefc105cf7a1b913006b33e285422", newValue.slice(2));
  files.writeFileSync("contracts/Router.sol", result, "utf8");
  const Router = await ethers.getContractFactory("UniswapV2Router02");
  // console.log("Deploying Router...", Router);
  const router = await Router.deploy(await uniswapV2Factory.getAddress(), await weth.getAddress());
  await router.waitForDeployment();
  console.log("Router deployed to:", await router.getAddress());
  // console.log("Deploying UniswapV2Pair...");
  // deploy multicall
  const Multicall = await ethers.getContractFactory("Multicall");
  // console.log("Deploying Multicall...", Multicall);
  const multicall = await Multicall.deploy();
  await multicall.waitForDeployment();
  console.log("Multicall deployed to:", await multicall.getAddress());
  const usd = await ethers.getContractFactory("USD");
  const usdToken = await usd.deploy();
  await usdToken.waitForDeployment();
  console.log("USD deployed to:", await usdToken.getAddress());

}
deploy();
