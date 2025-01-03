"use client";

import { Property } from "@/components/global.types";
import Header from "@/components/Header/Header";
import { Box, Button, Grid, Typography } from "@mui/joy";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import PropertyRegistryABI from "../../../../../smart-contract/artifacts/contracts/PropertyRegistry.sol/PropertyRegistry.json";
import { toast } from "react-toastify";

const CONTRACT_ADDRESS = "0x17435ccE3d1B4fA2e5f8A08eD921D57C6762A180";

const PropertyPage = () => {
    const { id } = useParams();
    const [property, setProperty] = useState<Property | null>(null);
    const [isOwner, setIsOwner] = useState<boolean>(false);
    const [forSale, setForSale] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchProperty = async () => {
            if (!id) {
                console.error("Property ID not found.");
                toast.error("Property ID not found.");
                setLoading(false);
                return;
            }

            try {
                const provider = new ethers.BrowserProvider(window.ethereum!);
                const signer = await provider.getSigner();
                const contract = new ethers.Contract(CONTRACT_ADDRESS, PropertyRegistryABI.abi, signer);

                const propertyData = await contract.properties(id);
                const priceInEth = parseFloat(ethers.formatEther(propertyData.price));
                const fetchedProperty = {
                    id: id.toString(),
                    name: propertyData.name,
                    zoning: propertyData.zoning,
                    location: propertyData.location,
                    price: priceInEth,
                };

                const address = await signer.getAddress();
                const isOwner = await contract.isPropertyOwner(id, address);
                const forSale = await contract.getPropertyForSale(id);

                setProperty(fetchedProperty);
                setIsOwner(isOwner);
                setForSale(forSale);
            } catch (error) {
                console.error("Error fetching property:", error);
                toast.error("Error fetching property. Please check the console for more details.");
            } finally {
                setLoading(false);
            }
        };

        fetchProperty();
    }, [id]);

    const acquireProperty = async () => {
        if (!property) return;

        try {
            const provider = new ethers.BrowserProvider(window.ethereum!);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(CONTRACT_ADDRESS, PropertyRegistryABI.abi, signer);

            const tx = await contract.acquireProperty(property.id, {
                value: ethers.parseEther(property.price.toString()),
            });

            const txHash = tx.hash;
            toast.info(`Transaction sent! Tx Hash: ${txHash}`);

            const receipt = await tx.wait();
            toast.success(`Property purchased successfully! Block: ${receipt.blockNumber}`);
        } catch (error) {
            console.error("Error buying property:", error);
            toast.error("Failed to purchase the property. Please check the console for more details.");
        }
    };

    const toggleForSale = async () => {
        if (!property) return;

        try {
            const provider = new ethers.BrowserProvider(window.ethereum!);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(CONTRACT_ADDRESS, PropertyRegistryABI.abi, signer);

            const tx = await contract.updatePropertyForSale(property.id, !forSale);
            const txHash = tx.hash;
            toast.info(`Transaction sent! Tx Hash: ${txHash}`);

            const receipt = await tx.wait();
            toast.success(`Property sale status updated successfully! Block: ${receipt.blockNumber}`);

            setForSale(!forSale);
        } catch (error) {
            console.error("Error updating property sale status:", error);
            toast.error("Failed to update sale status. Please check the console for more details.");
        }
    };

    if (loading) {
        return (
            <Box sx={{ width: 1, height: 1 }}>
                <Header />
                <Box sx={{ width: 1, height: 1, p: 2, justifyContent: "center", alignItems: "center" }}>
                    <Typography level="h1" fontSize="xl" fontWeight="xl" textColor="#ededed" sx={{ textAlign: "center" }}>
                        Loading...
                    </Typography>
                </Box>
            </Box>
        );
    }

    if (!property) {
        return (
            <Box sx={{ width: 1, height: 1 }}>
                <Header />
                <Box sx={{ width: 1, height: 1, p: 2, justifyContent: "center", alignItems: "center" }}>
                    <Typography level="h1" fontSize="xl" fontWeight="xl" textColor="#ededed" sx={{ textAlign: "center" }}>
                        Property not found.
                    </Typography>
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ width: 1, height: 1 }}>
            <Header />
            <Box sx={{ display: "flex", justifyContent: "center" }} m={2}>
                <Grid container spacing={2} sx={{ p: 2, pt: 10, maxWidth: 3 / 4 }}>
                    <Grid xs={12} mb={4} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Typography level="h1" fontSize="2xl" fontWeight="xl" sx={{ color: "#ffffff" }}>
                            {property.name}
                        </Typography>
                    </Grid>
                    <Grid xs={6} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Typography level="h1" fontSize="2xl" fontWeight="md" sx={{ color: "#ffffff" }}>
                            {property.zoning}
                        </Typography>
                    </Grid>
                    <Grid xs={6} pl={10} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Typography level="h2" fontSize="xl" sx={{ color: "#8dadf7" }}>
                            {property.price} ETH
                        </Typography>
                    </Grid>
                    <Grid xs={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Typography
                            level="body-lg"
                            fontSize="md"
                            sx={{
                                textAlign: "start",
                                color: "#ffffff",
                                borderTop: "1px solid #ffffff",
                                borderBottom: "1px solid #ffffff",
                                pr: 2,
                                py: 1,
                            }}
                        >
                            {property.location}
                        </Typography>
                    </Grid>
                    {isOwner ? (
                        <Grid xs={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <Button color="neutral" onClick={toggleForSale}>
                                {forSale ? "Remove from Sale" : "Mark for Sale"}
                            </Button>
                        </Grid>
                    ) : (
                        forSale && (
                            <Grid xs={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Button color="neutral" onClick={acquireProperty}>
                                    Buy Property
                                </Button>
                            </Grid>
                        )
                    )}
                </Grid>
            </Box>
        </Box>
    );
};

export default PropertyPage;
