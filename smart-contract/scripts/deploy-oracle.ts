// const { ethers } = require("hardhat");
import { ethers } from "hardhat";

async function main() {
    // Deploy Oracle contract
    const [deployer] = await ethers.getSigners();
    const initialOwner = deployer.address;
    const fee = ethers.parseEther("0.1");

    const Oracle = await ethers.getContractFactory("Oracle");
    const oracle = await Oracle.deploy(fee, initialOwner);
    const oracleAddress = await oracle.getAddress();
    console.log("Oracle deployed to:", oracleAddress);

    // Add oracle node address as authorized node
    await oracle.authorizeNode(oracleAddress);
    console.log("Authorized node:", oracleAddress);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });