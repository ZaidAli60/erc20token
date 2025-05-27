require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    ganache: {
      url: "http://127.0.0.1:8545", // Default RPC URL for Ganache
      // chainId: 1337,               // Default Chain ID for Ganache
      accounts: [
        "0x338bd4f1af5f5b1533e0b7f89bc76d27159300d360d9a02a20367f44c0ba1d92",
        // Add more private keys if needed
      ]
    },
  }
};