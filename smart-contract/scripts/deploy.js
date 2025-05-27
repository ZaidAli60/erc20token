const hre = require("hardhat");

async function main() {
    const initialSupply = 1000; // 1 million tokens
    const Contract = await hre.ethers.getContractFactory("EmergingTechGridToken");
    const myContract = await Contract.deploy(initialSupply);

    await myContract.waitForDeployment();

    console.log("Contract deployed to :", await myContract.getAddress())

}

main()