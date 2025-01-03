import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();
    const contractOwner = deployer.address;
    const oracleAddress = "0x0643D39D47CF0ea95Dbea69Bf11a7F8C4Bc34968";

    const PropertyRegistry = await ethers.getContractFactory("PropertyRegistry");
    const propertyRegistry = await PropertyRegistry.deploy(contractOwner, oracleAddress);

    const contractAddress = await propertyRegistry.getAddress();

    console.log("PropertyRegistry deployed to:", contractAddress);
    console.log("PropertyRegistry owner:", contractOwner);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
