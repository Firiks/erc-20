/**
 * Hardhat configuration
 */

// include plugins
require('@nomicfoundation/hardhat-network-helpers');
require('@nomicfoundation/hardhat-chai-matchers');
require('@nomicfoundation/hardhat-toolbox');
require('@nomiclabs/hardhat-etherscan');
require('@nomiclabs/hardhat-ethers');
require('hardhat-contract-sizer');
require('hardhat-gas-reporter');
require('hardhat-deploy');
require('solidity-coverage');

// load .env
require("dotenv").config();

const COMPILER_SETTINGS = {
  optimizer: {
    enabled: true,
    runs: 1000000,
  },
  metadata: {
    bytecodeHash: "none",
  },
}

// Set RPC urls
const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL || "https://eth-mainnet.alchemyapi.io/v2/your-api-key";
const POLYGON_MAINNET_RPC_URL = process.env.POLYGON_MAINNET_RPC_URL || "https://polygon-mainnet.alchemyapi.io/v2/your-api-key";
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
const MUMBAI_RPC_URL = process.env.MUMBAI_RPC_URL || "https://polygon-mumbai.g.alchemy.com/v2/your-api-key";

// Wallet private key
const PRIVATE_KEY = process.env.PRIVATE_KEY;

// Mnemonic
const MNEMONIC = process.env.MNEMONIC || "Your mnemonic";

// Forking
const FORKING_BLOCK_NUMBER = parseInt(process.env.FORKING_BLOCK_NUMBER) || 0;

// API keys
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "Your etherscan API key";
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY || "Your polygonscan API key";

// Gas reporting
const REPORT_GAS = process.env.REPORT_GAS || false;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  namedAccounts: { 
    deployer: {
      default: 0, // default take the first account as deployer
      1: 0, // same for mainnet
    },
    user1: { // create a named account called user1
      default: 1,
    },
    user2: {
      default: 2,
    },
  },
  solidity: { // manage solidity compiler versions
    compilers: [
      {
        version: "0.8.7",
        COMPILER_SETTINGS,
      },
      {
        version: "0.4.24",
        COMPILER_SETTINGS,
      },
    ],
  },
  networks: {
  hardhat: {
      hardfork: "merge",
      forking: {
        url: MAINNET_RPC_URL,
        blockNumber: FORKING_BLOCK_NUMBER,
        enabled: false,
      },
      chainId: 31337,
    },
    localhost: {
      chainId: 31337,
    },
    sepolia: {
      url: SEPOLIA_RPC_URL !== undefined ? SEPOLIA_RPC_URL : "",
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      //   accounts: {
      //     mnemonic: MNEMONIC,
      //   },
      chainId: 11155111,
    },
    mainnet: {
      url: MAINNET_RPC_URL,
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      //   accounts: {
      //     mnemonic: MNEMONIC,
      //   },
      chainId: 1,
    },
    polygon: {
      url: POLYGON_MAINNET_RPC_URL,
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      chainId: 137,
    },
    mumbai: {
      url: MUMBAI_RPC_URL,
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      chainId: 80001,
    },
  },
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_API_KEY,
      mainnet: ETHERSCAN_API_KEY,
      polygon: POLYGONSCAN_API_KEY,
      polygonMumbai: POLYGONSCAN_API_KEY,
    },
  },
  gasReporter: {
    enabled: REPORT_GAS,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: false,
    only: ["OgToken"]
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./build/cache",
    artifacts: "./build/artifacts",
  },
  mocha: {
    timeout: 300000, // 300 seconds max for running tests
  },
}
