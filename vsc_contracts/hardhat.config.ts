import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import "@nomicfoundation/hardhat-verify";
import { config as dotEnvConfig } from "dotenv";

dotEnvConfig(); // Load environment variables from .env

const config: HardhatUserConfig = {
  solidity: {
    
    compilers: [
      {
        version: "0.5.16",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.4.18",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.6.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version:"0.8.20"
      },

      {
        version:"0.8.22"
      }
    ],
  },
  networks: {
    hardhat: {
      accounts: {
        mnemonic:
          process.env.HARDHAT_MNEMONIC ||
          "test test test test test test test test test test test junk",
        count: 20, // Generate 20 accounts
        accountsBalance: "10000000000000000000000", // Set each account balance to 10,000 ETH
      },
    },
    // arbsepolia: {
    //   url: "https://sepolia-rollup.arbitrum.io/rpc",
    //   accounts: [
    //     process.env.wallet1!,
    //     process.env.wallet2!,
    //     process.env.wallet3!,
    //     process.env.wallet4!,
    //     process.env.wallet5!,
    //   ],
    // },
    // sepolia: {
    //   url: "https://eth-sepolia.api.onfinality.io/public",
    //   accounts: [
    //     process.env.wallet1!,
    //     process.env.wallet2!,
    //     process.env.wallet3!,
    //     process.env.wallet4!,
    //     process.env.wallet5!,
    //   ],
    // },
    // arbitrum: {
    //   url: "https://arb1.arbitrum.io/rpc",
    //   accounts: [process.env.wallet1!],
    // },

    vsc_testnet: {
      url: "https://testnet-rpc.vsgofficial.com",
      accounts: [
        process.env.vsg!,
        process.env.wallet1!,
        process.env.wallet2!,
        process.env.wallet3!,
        process.env.wallet4!,
        process.env.wallet5!,
      ],
    },
    //     Network Name: Vector Smart Chain
    // New RPC URL: https://rpc.vscblockchain.org
    // Chain ID: 420042
    // Currency Symbol: VSG
    // Block Explorer URL: https://explorer.vscblockchain.org
    vsc: {
      url: "https://rpc.vscblockchain.org",
      accounts: [
        process.env.vsg!,
        process.env.wallet1!,
        process.env.wallet2!,
        process.env.wallet3!,
        process.env.wallet4!,
        process.env.wallet5!,
      ],
    },
  },
  etherscan: {
    // apiURL: "https://testnet-scan.vsgofficial.com/api",
    customChains: [
      {
        network: "vsc",
        chainId: 420044,
        urls: {
          apiURL: "https://testnet-scan.vsgofficial.com/api",
          browserURL: "https://testnet-scan.vsgofficial.com",
        },
      },
    ],
    // browserURL: "https://testnet-scan.vsgofficial.com",
  },
};

export default config;
