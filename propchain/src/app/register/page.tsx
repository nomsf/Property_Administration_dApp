"use client";

import Header from "@/components/Header/Header";
import { Box, Button, Card, CardActions, CardContent, Divider, FormControl, FormLabel, Input, Typography } from "@mui/joy";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import PropertyRegistryABI from "../../../../smart-contract/artifacts/contracts/PropertyRegistry.sol/PropertyRegistry.json";
import { toast } from "react-toastify";

const CONTRACT_ADDRESS = "0x9f5eaC3d8e082f47631F1551F1343F23cd427162";

const RegisterPage = () => {
  const [name, setPropertyName] = useState("");
  const [zoning, setZoning] = useState("");
  const [price, setPrice] = useState(0);
  const [location, setLocation] = useState("");
  const [propertyOwner, setPropertyOwner] = useState("");
  const [isGovernmentAccount, setIsGovernmentAccount] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setPropertyName(e.target.value);
  const handleZoningChange = (e: React.ChangeEvent<HTMLInputElement>) => setZoning(e.target.value);
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => setPrice(Number(e.target.value));
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => setLocation(e.target.value);
  const handlePropertyOwnerChange = (e: React.ChangeEvent<HTMLInputElement>) => setPropertyOwner(e.target.value);

  const initializeWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      toast.error("MetaMask is not installed!");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum!);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      const contract = new ethers.Contract(CONTRACT_ADDRESS, PropertyRegistryABI.abi, signer);
      const contractOwner = await contract.owner();
      setIsGovernmentAccount(address.toLowerCase() === contractOwner.toLowerCase());
    } catch (error) {
      console.error("Error initializing wallet:", error);
      toast.error("Error initializing wallet. Please check the console for more details.");
    }
  };

  useEffect(() => {
    initializeWallet();
  }, []);

  const handleRegister = async () => {
    if (!name || !zoning || !price || !location || !propertyOwner) {
      toast.error("Please fill in all fields.");
      return;
    }
  
    if (!isGovernmentAccount) {
      toast.error("Unauthorized! Only the Government account can register properties.");
      return;
    }
  
    try {
      setLoading(true);

      const provider = new ethers.BrowserProvider(window.ethereum!);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, PropertyRegistryABI.abi, signer);
  
      const priceInWei = ethers.parseUnits(price.toString(), "ether");
      const tx = await contract.registerProperty(propertyOwner, priceInWei, name, location, zoning);
  
      const txHash = tx.hash;
      toast.info(`Transaction sent! Tx Hash: ${txHash}`);
  
      const receipt = await tx.wait();
      toast.success(`Property registered successfully! Block: ${receipt.blockNumber}`);
    } catch (error) {
      console.error("Error registering property:", error);
      toast.error("Failed to register property. Check the console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: 1, height: 1 }}>
      <Header />
      <Box sx={{ width: 1, height: 1, p: 2, justifyContent: "center", alignItems: "center" }}>
        <Card
          variant="outlined"
          sx={{
            maxHeight: "max-content",
            maxWidth: 600,
            mx: "auto",
            overflow: "auto",
            resize: "horizontal",
          }}
        >
          <Typography level="title-lg">Register New Property</Typography>
          <Divider inset="none" />
          <CardContent
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(80px, 1fr))",
              gap: 1.5,
            }}
          >
            <FormControl sx={{ gridColumn: "1/-1" }}>
              <FormLabel>Name</FormLabel>
              <Input onChange={handleNameChange} />
            </FormControl>
            <FormControl>
              <FormLabel>Zoning</FormLabel>
              <Input placeholder="Type of property" onChange={handleZoningChange} />
            </FormControl>
            <FormControl>
              <FormLabel>Proposed Price (in ETH)</FormLabel>
              <Input type="number" onChange={handlePriceChange} />
            </FormControl>
            <FormControl sx={{ gridColumn: "1/-1" }}>
              <FormLabel>Location</FormLabel>
              <Input placeholder="Enter full location address" onChange={handleLocationChange} />
            </FormControl>
            <FormControl sx={{ gridColumn: "1/-1" }}>
              <FormLabel>Owner Address</FormLabel>
              <Input placeholder="Enter owner's wallet address" onChange={handlePropertyOwnerChange} />
            </FormControl>
            <CardActions sx={{ gridColumn: "1/-1" }}>
              <Button
                variant="solid"
                color="primary"
                onClick={handleRegister}
                disabled={loading}
              >
                {loading ? "Registering..." : "Register Property"}
              </Button>
            </CardActions>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default RegisterPage;
