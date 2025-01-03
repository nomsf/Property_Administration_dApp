"use client";

import Header from "@/components/Header/Header";
import Propertycard from "@/components/Propertycard/Propertycard";
import { PropertycardProps } from "@/components/Propertycard/Propertycard.types";
import { Box, Button, Stack, Typography } from "@mui/joy";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import PropertyRegistryABI from "../../../../smart-contract/artifacts/contracts/PropertyRegistry.sol/PropertyRegistry.json";
import { toast } from "react-toastify";

const CONTRACT_ADDRESS = "0x9f5eaC3d8e082f47631F1551F1343F23cd427162";

export default function HomePage() {
  const [properties, setProperties] = useState<PropertycardProps[]>([]);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const initializeContract = async () => {
    if (typeof window.ethereum === "undefined") {
      toast.error("MetaMask is not installed!");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum!);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(
        CONTRACT_ADDRESS,
        PropertyRegistryABI.abi,
        signer
      );

      setContract(contractInstance);
    } catch (error) {
      console.error("Error initializing contract:", error);
      toast.error("Error initializing contract. Please check the console for more details.");
    }
  };

  const fetchProperties = async () => {
    if (!contract) {
      toast.error("Contract not initialized!");
      return;
    }

    try {
      const propertyCount = await contract.nextPropertyId();
      const loadedProperties: PropertycardProps[] = [];

      for (let i = 0; i < propertyCount; i++) {
        const property = await contract.properties(i);
        loadedProperties.push({
          id: i.toString(),
          name: property.name,
          location: property.location,
          zoning: property.zoning,
          price: parseFloat(ethers.formatEther(property.price)),
        });
      }

      setProperties(loadedProperties);
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast.error("Error fetching properties. Please check the console for more details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeContract();
  }, []);

  useEffect(() => {
    if (contract) {
      fetchProperties();
    }
  }, [contract]);

  return (
    <Box sx={{ width: 1, height: 1 }}>
      <Header />
      {loading ? (
        <Typography
          level="h4"
          fontWeight="bold"
          textColor="#ededed"
          sx={{ textAlign: "center", mt: 4 }}
        >
          Loading properties...
        </Typography>
      ) : (
        <Stack spacing={2} pt={4} mb={10} sx={{ justifyContent: "center", alignItems: "center" }}>
          {properties.length > 0 ? (
            properties.map((property, index) => (
              <Propertycard key={index} {...property} />
            ))
          ) : (
            <Typography
              level="h4"
              fontWeight="bold"
              textColor="#ededed"
              sx={{ textAlign: "center", mt: 4 }}
            >
              No properties found on the blockchain.
            </Typography>
          )}
        </Stack>
      )}
      <Button
        color="primary"
        onClick={fetchProperties}
        sx={{ display: "block", mx: "auto", mt: 4 }}
      >
        Refresh Properties
      </Button>
    </Box>
  );
}
