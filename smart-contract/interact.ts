import { createPublicClient, createWalletClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { Address, Abi } from "viem";
import PropertyRegistryABI from "./artifacts/contracts/PropertyRegistry.sol/PropertyRegistry.json";

const RPC_URL = "http://127.0.0.1:51247";
const PRIVATE_KEY = "0xbcdf20249abf0ed6d944c0288fad489e33f66b3960d9e6229c1cd214ed3bbe31";

async function main() {
    const contractAddress: Address = "0x703848F4c85f18e3acd8196c8eC91eb0b7Bd0797";
    const abi: Abi = PropertyRegistryABI.abi as Abi;
  
    const client = createPublicClient({ transport: http(RPC_URL) });
    const wallet = createWalletClient({
        transport: http(RPC_URL),
        account: privateKeyToAccount(PRIVATE_KEY),
    });

    const price = parseEther("1");

    try {
        const registerTx = await wallet.writeContract({
            address: contractAddress,
            abi,
            functionName: "registerProperty",
            args: ["House", "123 Main St", price, "Residential"],
            chain: wallet.chain,
        });
        console.log("Register Property TX:", registerTx);
    } catch (error) {
        console.error("Failed to register property:", error);
    }

    try {
        const property = await client.readContract({
            address: contractAddress,
            abi,
            functionName: "properties",
            args: [0],
        });
        console.log("Property Details:", property);
    } catch (error) {
        console.error("Failed to fetch property details:", error);
    }
}

main().catch((err) => console.error(err));
