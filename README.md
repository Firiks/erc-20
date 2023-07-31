# ERC20 token contract

Create ERC20 token contract. Contract is created using OpenZeppelin library.

ERC20 is a token representation standard on Ethereum blockchain. It is used for creating fungible tokens. Fungible tokens are tokens that are interchangeable with each other. For example, 1 DAI token is always equal to another DAI token. ERC20 tokens are used for creating stablecoins, utility tokens, security tokens, etc.

## Quick start
1. Clone the repo
2. Install dependencies: `npm install` use `--legacy-peer-deps` when encountering errors
3. Create .env file from .env.example `cp .env.example .env` and fill in the values
4. To run tests: `npx hardhat test`
5. To run local node with contract deployed run: `npm run chain`
6. To deploy on testnet: `npm run deploy-sepolia`

You can import token contract to metamask by copying the address from the console after deployment and adding it as a custom token.