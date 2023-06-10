const { network } = require("hardhat");
const {
  developmentChains,
  INITIAL_SUPPLY,
  VERIFICATION_BLOCK_CONFIRMATIONS,
} = require("../helper-hardhat-config");
const { verify } = require("../helper-functions");

// use 1 block confirmation for development and dynamic block confirmations for live networks
const waitBlockConfirmations = developmentChains.includes(network.name) ? 1 : VERIFICATION_BLOCK_CONFIRMATIONS;

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const token = await deploy("OgToken", {
    from: deployer,
    args: [INITIAL_SUPPLY],
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: waitBlockConfirmations
  });

  log(`Token deployed at: ${token.address}`);
  log(`Token was deployed by: ${deployer}`);

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(token.address, [INITIAL_SUPPLY]);
  }
}

module.exports.tags = ["all", "token"]