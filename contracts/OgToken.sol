// contracts/OgToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract OgToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("OgToken", "OG") {
        _mint(msg.sender, initialSupply); // owner of the contract gets all the tokens
    }
}
