require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    ganache: {
      url: "http://127.0.0.1:8545", // Default RPC URL for Ganache
      // chainId: 1337,               // Default Chain ID for Ganache
      accounts: [
        "0xb071eaf29c877c8664bcbccaf653994255cf870092475086bf157b311ec67808",
        // Add more private keys if needed
      ]
    },
  }
};