const hre = require("hardhat");

async function main() {
    const RoastNFT = await hre.ethers.getContractFactory("RoastNFT");
    const roastNFT = await RoastNFT.deploy();
    await roastNFT.waitForDeployment();

    const address = await roastNFT.getAddress();
    console.log(`RoastNFT deployed to: ${address}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 