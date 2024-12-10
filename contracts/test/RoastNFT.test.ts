const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RoastNFT", function () {
    let roastNFT;
    let owner, user1, user2;

    beforeEach(async function () {
        [owner, user1, user2] = await ethers.getSigners();
        const RoastNFTFactory = await ethers.getContractFactory("RoastNFT");
        roastNFT = await RoastNFTFactory.deploy();
    });

    it("Should mint a roast", async function () {
        const tx = await roastNFT.connect(user1).mintRoast("Test roast");
        const receipt = await tx.wait() as any;
        expect(receipt.status).to.equal(1);
    });

    it("Should like a roast", async function () {
        await roastNFT.connect(user1).mintRoast("Test roast");
        await roastNFT.connect(user2).likeRoast(1);
        const roast = await roastNFT.getRoast(1);
        expect(roast.likes).to.equal(1);
    });

    it("Should get top roasts", async function () {
        await roastNFT.connect(user1).mintRoast("First roast");
        await roastNFT.connect(user1).mintRoast("Second roast");
        const roasts = await roastNFT.getTopRoasts(10);
        expect(roasts.length).to.equal(2);
    });
}); 