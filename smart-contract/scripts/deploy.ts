import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();
    const initialOwner = deployer.address;

    const PropertyRegistry = await ethers.getContractFactory("PropertyRegistry");
    const propertyRegistry = await PropertyRegistry.deploy(initialOwner);

    const contractAddress = await propertyRegistry.getAddress();

    console.log("PropertyRegistry deployed to:", contractAddress);
    console.log("Contract owner:", initialOwner);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
