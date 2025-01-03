import { ethers } from "hardhat";
import dotenv from 'dotenv';

dotenv.config();

async function main() {
    const ORACLE_ADDRESS = "0xDeeea509217cACA34A4f42ae76B046F263b06494";
    const [requester] = await ethers.getSigners();
    const Oracle = await ethers.getContractFactory("Oracle");
    const oracle = Oracle.attach(ORACLE_ADDRESS);

    // Wait a bit for the node to start up
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create a request
    console.log("Creating tax calculation request...");
    const building_area = 3600;
    const land_area = 2000;
    const building_price_per_m2 = 2000000;
    const land_price_per_m2 = 3000000;

    // Connect as requester and send request with payment
    const requesterOracle = oracle.connect(requester);
    const fee = await oracle.fee();
    
    // Create request transaction
    const tx = await requesterOracle.requestTaxCalculation(
        building_area,
        land_area,
        building_price_per_m2,
        land_price_per_m2,
        { value: fee }
    );

    console.log("Request transaction sent:", tx.hash);
    const receipt = await tx.wait();

    // Get RequestCreated event
    const requestCreatedEvent = receipt.logs.find(
        (log) => {
            try {
                return oracle.interface.parseLog(log)?.name === "RequestCreated";
            } catch {
                return false;
            }
        }
    );

    if (!requestCreatedEvent) {
        throw new Error("RequestCreated event not found");
    }

    const parsedEvent = oracle.interface.parseLog(requestCreatedEvent);
    const requestId = parsedEvent?.args[0];
    console.log("Request ID:", requestId);

    // Listen for the DataFulfilled event
    console.log("Waiting for result...");
    
    const result = await new Promise((resolve, reject) => {
        // Set timeout for 30 seconds to wait for result
        const timeout = setTimeout(() => {
            reject(new Error("Timeout waiting for result"));
        }, 30000);

        oracle.once("DataFulfilled", (fulfilledRequestId, result) => {
            if (fulfilledRequestId === requestId) {
                clearTimeout(timeout);
                resolve(result);
            }
        });
    });

    console.log("Transaction at block:", receipt.blockNumber);
    console.log("Received result:", result.toString());

    // Get request details to verify fulfillment
    const request = await oracle.getRequest(requestId);
    console.log("Request fulfilled:", request.fulfilled);
    console.log("================================================================================================");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });