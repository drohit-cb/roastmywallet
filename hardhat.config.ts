require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: '.env.local' });

const config = {
    solidity: "0.8.20",
    networks: {
        "base-sepolia": {
            url: 'https://sepolia.base.org',
            accounts: [process.env.PRIVATE_KEY],
        }
    },
    etherscan: {
        apiKey: {
            "base-sepolia": process.env.BASESCAN_API_KEY
        },
        customChains: [
            {
                network: "base-sepolia",
                chainId: 84532,
                urls: {
                    apiURL: "https://api-sepolia.basescan.org/api",
                    browserURL: "https://sepolia.basescan.org"
                }
            }
        ]
    },
    typechain: {
        outDir: 'contracts/typechain-types',
        target: 'ethers-v6'
    }
};

module.exports = config;