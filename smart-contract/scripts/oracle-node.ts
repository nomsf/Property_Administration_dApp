import { ethers } from "hardhat";
import axios from "axios";

interface TaxResponse {
    harga_akhir: number;
}

const jobHandlers: {
    [key: string]: (
        building_area: string,
        land_area: string,
        building_price_per_m2: string,
        land_price_per_m2: string
    ) => Promise<Number>
} = {
    "CALCULATE_PROPERTY_TAX": async (
        building_area: string,
        land_area: string,
        building_price_per_m2: string,
        land_price_per_m2: string
    ): Promise<Number> => {
        try {
            const response = await axios.post<TaxResponse>('http://localhost:3001/tax_count', {
                luas_bangunan: building_area,
                luas_tanah: land_area,
                harga_bangunan: building_price_per_m2,
                harga_tanah: land_price_per_m2
            });
            
            return response.data.harga_akhir;
        } catch (error) {
            console.error('Error calling Tax Counter API:', error);
            throw error;
        }
    }
};

async function runOracleNode(oracleAddress: string): Promise<void> {
    // Get the signer that was authorized during deployment
    const [authorizedSigner] = await ethers.getSigners();
    console.log("Running oracle node with address:", authorizedSigner.address);

    const Oracle = await ethers.getContractFactory("Oracle");
    const oracle = Oracle.attach(oracleAddress).connect(authorizedSigner);

    // Verify authorization
    const isAuthorized = await oracle.authorizeNode(authorizedSigner.address);
    if (!isAuthorized) {
        throw new Error("Node is not authorized!");
    }
    console.log("Node authorization verified");

    oracle.on("RequestCreated", async (
        requestId: string,
        requester: string,
        jobId: string,
        building_area: Number,
        land_area: Number,
        building_price_per_m2: Number,
        land_price_per_m2: Number,
        event: any
    ) => {
        console.log(`New tax calculation request received: ${requestId}`);
        console.log(`Parameters:
            Building Area: ${building_area.toString()}
            Land Area: ${land_area.toString()}
            Building Price/m2: ${building_price_per_m2.toString()}
            Land Price/m2: ${land_price_per_m2.toString()}
        `);
        
        try {
            // Get result from API
            const result = await jobHandlers["CALCULATE_PROPERTY_TAX"](
                building_area.toString(),
                land_area.toString(),
                building_price_per_m2.toString(),
                land_price_per_m2.toString()
            );
            
            console.log("Calculated result:", result.toString());
            
            // Submit result to blockchain
            const tx = await oracle.fulfillRequest(requestId, result);
            console.log("Transaction sent:", tx.hash);
            
            const receipt = await tx.wait();

            console.log("Transaction confirmed in block:", receipt.blockNumber);
            
            console.log(`Request ${requestId} fulfilled with result: ${result.toString()}`);
            console.log("========================================================================================")
        } catch (error) {
            console.error(`Error processing request ${requestId}:`, error);
            if (error.response) {
                console.error('API Response Error:', error.response.data);
            }
        }
    });

    console.log("Oracle node is running...");
    console.log("Listening on address:", oracleAddress);
}

export { runOracleNode };