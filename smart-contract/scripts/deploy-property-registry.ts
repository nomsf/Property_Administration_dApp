import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();
    const contractOwner = deployer.address;

    const PropertyRegistry = await ethers.getContractFactory("PropertyRegistry");
    const propertyRegistry = await PropertyRegistry.deploy(contractOwner);

    const contractAddress = await propertyRegistry.getAddress();

    console.log("PropertyRegistry deployed to:", contractAddress);
    console.log("PropertyRegistry owner:", contractOwner);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
